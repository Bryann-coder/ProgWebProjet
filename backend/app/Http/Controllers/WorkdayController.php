<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkdayRequest;
use App\Http\Resources\WorkdayResource;
use App\Models\Workday;
use App\Models\Stylist;
use App\Models\User;
use App\Mail\NewAppointmentRequest;
use App\Mail\AppointmentAccepted;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class WorkdayController extends Controller
{

    public function index(): AnonymousResourceCollection
    {
        return WorkdayResource::collection(
            Workday::with(['stylist', 'user'])
                ->orderBy('date', 'desc')
                ->get()
        );
    }

    public function requestAppointment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'stylist_id' => 'required|exists:stylists,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date|after:today',
        ]);

        $stylist = Stylist::findOrFail($validated['stylist_id']);
        $user = User::findOrFail($validated['user_id']);

        // Vérifier si le créneau est disponible
        if (!Workday::isSlotAvailable($stylist->id, $validated['date'])) {
            return response()->json([
                'message' => 'Ce créneau est déjà réservé.'
            ], 422);
        }

        // Envoyer l'email au styliste
        Mail::to($stylist->user->email)
            ->send(new NewAppointmentRequest($stylist, $user, $validated['date']));

        return response()->json([
            'message' => 'Demande envoyée au styliste.'
        ], 200);
    }

    public function show(Workday $workday): WorkdayResource
    {
        return new WorkdayResource($workday->load(['stylist', 'user']));
    }

    public function update(StoreWorkdayRequest $request, Workday $workday): WorkdayResource
    {
        $workday->update($request->validated());
        return new WorkdayResource($workday->load(['stylist', 'user']));
    }


    public function destroy(Workday $workday): JsonResponse
    {
        $workday->delete();
        return response()->json(['message' => 'Réservation supprimée avec succès.'], 200);
    }

    public function confirmAppointment(Stylist $stylist, User $user, string $date): JsonResponse
    {
        // Créer la réservation
        $workday = Workday::create([
            'stylist_id' => $stylist->id,
            'user_id' => $user->id,
            'date' => $date,
            'status' => Workday::STATUS_RESERVED
        ]);

        // Envoyer l'email de confirmation au client
        if ($user->email){
            Mail::to($user->email)
            ->send(new AppointmentAccepted($workday->stylist, $workday->user, $workday->date));
        } else {
            return response()->json([
                'message' => 'client non trouvé.'
            ], 404);
        }
        return response()->json([
            'message' => 'Réservation confirmée et client notifié.',
            'email' => $user->email,
            'workday' => new WorkdayResource($workday)
        ], 201);
    }

    public function updateStatus(): JsonResponse
    {
        $today = now()->toDateString();
        $updated = Workday::where('date', '<', $today)
            ->where('status', 0)
            ->update(['status' => 1]);

        return response()->json([
            'message' => "{$updated} réservation(s) mise(s) à jour.",
            'updated_count' => $updated
        ]);
    }

    public function getStylistWorkdays(Stylist $stylist): AnonymousResourceCollection
    {
        return WorkdayResource::collection(
            Workday::with(['user'])
                ->where('stylist_id', $stylist->id)
                ->orderBy('date', 'desc')
                ->get()
        );
    }

    public function getUserWorkdays(User $user): AnonymousResourceCollection
    {
        return WorkdayResource::collection(
            Workday::with(['stylist'])
                ->where('user_id', $user->id)
                ->orderBy('date', 'desc')
                ->get()
        );
    }

    public function getWorkdaysByDate(string $date): AnonymousResourceCollection
    {
        return WorkdayResource::collection(
            Workday::with(['stylist', 'user'])
                ->whereDate('date', $date)
                ->orderBy('date', 'desc')
                ->get()
        );
    }
}