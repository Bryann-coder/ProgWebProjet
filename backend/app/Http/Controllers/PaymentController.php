<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaymentController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PaymentResource::collection(Payment::with('cart')->get());
    }

    public function show(Payment $payment): PaymentResource
    {
        return new PaymentResource($payment->load(['cart']));
    }

    public function destroy(Payment $payment): JsonResponse
    {
        $payment->delete();
        return response()->json(null, 204);
    }

    public function submit_payment(Request $request){
        try{
            $request->validate([
                'cart_id' => 'required|exists:carts,id',
                'montant' => 'required|numeric',
                'currency' => 'required',
                'telephone' => 'required',
            ]);
            $token = env('CAMPAY_APP_TOKEN');
            $response = Http::withHeaders([
                'Authorization' => "Token " . $token,
            ])->withOptions([
                'verify' => false,
            ])
            ->post('https://demo.campay.net/api/collect/',[
                'amount' => (int)$request->montant,
                'currency' => $request->currency,
                'from' => $request->telephone,
                'description' => "Application paiement",
                'external_reference' => '',
                'external_user' => '',
            ]);

            if($response->status() == 200){
                $message = "Requête envoyée.";
                $payment = Payment::create([
                    'cart_id' => $request->cart_id,
                    'montant' => $request->montant,
                ]);
                $reference = $response->json()['reference'];
                return response()->json(compact('message','reference', 'payment'));
            }
            $message = $response->body();
            return response()->json(compact('message'), $response->status());
        }catch(\Throwable $th){
            $error = $th->getMessage();
            return response()->json(compact('error'), 500);
        }
    }

    public function payment_status(Request $request){
        try{
            $request->validate([
                'reference' => 'required',
                'id_paiement' => 'required|exists:payments,id'
            ]);
            $payment = Payment::findOrFail($request->id_paiement);
            $reference = $request->reference;

            $token = env('CAMPAY_APP_TOKEN');
            $response = Http::withHeaders([
                'Authorization' => 'Token '.$token,
            ])->withOptions([
                'verify' => false,
            ])
            ->get('https://demo.campay.net/api/transaction/'.$reference.'/', [
                'Authorization' => 'Token '.$token,
            ]);
            if($response->status() === 401){
                $error = "Unauthorized";
                return response()->json(compact('error'), 401);
            }
            if($response->json()['status'] === "SUCCESSFUL"){
                $message = "Paiement effectué.";
                $payment->update(['status'=>'confirmed']);
                return response()->json(compact('message'));
            }elseif ($response->json()['status'] === "FAILED"){
                $message = "Vérifiez votre solde";
                $payment->update(['status'=>'failed']);
                return response()->json(compact('message'), 401);
            }elseif ($response->json()['status'] === "PENDING"){
                $message = "En cours";
                return response()->json(compact('message'), 200);
            }
        }catch(\Throwable $th){
            $error = $th->getMessage();
            return response()->json(compact('error'), 500);
        }
        
    }
}
