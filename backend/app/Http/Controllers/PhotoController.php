<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePhotoRequest;
use App\Http\Resources\PhotoResource;
use App\Models\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PhotoResource::collection(Photo::with(['user', 'product'])->get());
    }

    public function store(StorePhotoRequest $request): PhotoResource
    {
        $photo = $request->file('photo');
        $photoPath = Storage::putFile('photos', $photo);

        $photoModel = Photo::create([
            'user_id' => $request->user_id,
            'product_id' => $request->product_id,
            'photo' => file_get_contents(storage_path('app/photos/' . $photoPath)),
        ]);

        return new PhotoResource($photoModel->load(['user', 'product']));
    }

    public function show(Photo $photo): PhotoResource
    {
        return new PhotoResource($photo->load(['user', 'product']));
    }

    public function update(StorePhotoRequest $request, Photo $photo): PhotoResource
    {
        $photoFile = $request->file('photo');
        $photoPath = Storage::putFile('photos', $photoFile);

        $photo->update([
            'user_id' => $request->user_id,
            'product_id' => $request->product_id,
            'photo' => file_get_contents(storage_path('app/photos/' . $photoPath)),
        ]);

        return new PhotoResource($photo->load(['user', 'product']));
    }

    public function destroy(Photo $photo): JsonResponse
    {
        $photo->delete();
        return response()->json(null, 204);
    }
}
