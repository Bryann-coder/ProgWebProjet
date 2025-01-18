<?php

// app/Http/Controllers/MeasureController.php
namespace App\Http\Controllers;

use App\Http\Requests\StoreMeasureRequest;
use App\Http\Resources\MeasureResource;
use App\Models\Mesure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MeasureController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return MeasureResource::collection(Mesure::with('user')->get());
    }

    public function store(StoreMeasureRequest $request): MeasureResource
    {
        if($request->type == 0){
            $ancients = Mesure::where('user_id',$request->user_id)->where('type',0)->get();
            foreach($ancients as $ancient){
                $ancient->delete();
            }
        }
        $measure = Mesure::create($request->validated());
        return new MeasureResource($measure);
    }

    public function show(Mesure $measure): MeasureResource
    {
        return new MeasureResource($measure);
    }

    public function update(StoreMeasureRequest $request, Mesure $measure): MeasureResource
    {
        $measure->update($request->validated());
        return new MeasureResource($measure);
    }

    public function destroy(Mesure $measure): JsonResponse
    {
        $measure->delete();
        return response()->json(null, 204);
    }
}
