<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStylistRequest;
use App\Http\Resources\StylistResource;
use App\Models\Stylist;
use App\Http\Resources\ReviewResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class StylistController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return StylistResource::collection(Stylist::with(['user', 'products', 'workdays'])->get());
    }

    public function store(StoreStylistRequest $request): StylistResource
    {
        // Get validated data
        $validatedData = $request->validated();

        // Set default image value
        $validatedData['image'] = null;

        // Handle image upload if present
        if (!empty($validatedData['image'])) {
            $base64Image = $validatedData['image'];

            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                $extension = strtolower($type[1]);
                $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
                $decodedImage = base64_decode($base64Image);

                if ($decodedImage === false) {
                    return response()->json(['error' => 'Invalid Base64 image data'], 400);
                }

                $fileName = uniqid() . '.' . $extension;
                Storage::disk('public')->put('stylists/' . $fileName, $decodedImage);
                $validatedData['image'] = 'storage/stylists/' . $fileName;
            } else {
                return response()->json(['error' => 'Invalid image format'], 400);
            }
        }

        // Create stylist
        $stylist = Stylist::create($validatedData);

        // Update user role
        $stylist->user->update(['role' => 'stylist']);

        return new StylistResource($stylist->load(['user', 'products', 'workdays']));
    }

    public function show(Stylist $stylist): StylistResource
    {
        return new StylistResource($stylist->load(['user', 'products', 'workdays']));
    }

    public function update(StoreStylistRequest $request, Stylist $stylist): StylistResource
    {
        $validatedData = $request->validated();

        // Handle image upload if present
        if (!empty($validatedData['image'])) {
            $base64Image = $validatedData['image'];

            if (!preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                throw new \InvalidArgumentException('Invalid image format');
            }

            // Delete old image if exists
            if ($stylist->image) {
                $oldImagePath = str_replace('storage/', '', $stylist->image);
                Storage::disk('public')->delete($oldImagePath);
            }

            $extension = strtolower($type[1]);
            $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
            $decodedImage = base64_decode($base64Image);

            if ($decodedImage === false) {
                throw new \InvalidArgumentException('Invalid Base64 image data');
            }

            $fileName = uniqid() . '.' . $extension;
            Storage::disk('public')->put('stylists/' . $fileName, $decodedImage);
            $validatedData['image'] = 'storage/stylists/' . $fileName;
        }

        $stylist->update($validatedData);
        return new StylistResource($stylist->load(['user', 'products', 'workdays']));
    }

    public function destroy(Stylist $stylist): JsonResponse
    {
        // Supprimer l'image du styliste si elle existe
        if ($stylist->image) {
            $imagePath = str_replace('storage/', '', $stylist->image);
            Storage::disk('public')->delete($imagePath);
        }

        // Récupérer tous les produits associés au styliste
        $products = $stylist->products;

        // Supprimer les images de tous les produits associés
        foreach ($products as $product) {
            if ($product->image) {
                $productImagePath = str_replace('storage/', '', $product->image);
                Storage::disk('public')->delete($productImagePath);
            }
        }

        // Supprimer le styliste (cela supprimera aussi les produits grâce aux relations)
        $stylist->delete();
        
        return response()->json(null, 204);
    }

    public function getReviewsByStylist($stylistId)
    {
        // Charger le stylist et les reviews associées avec les utilisateurs via les produits
        $stylist = Stylist::with(['products.reviews.user'])->findOrFail($stylistId);

        // Récupérer toutes les reviews à travers les produits du stylist
        $reviews = $stylist->products->flatMap(function ($product) {
            return $product->reviews;
        });

        // Transformer les reviews avec la ressource ReviewResource
        return response()->json([
            'stylist_id' => $stylist->id,
            'reviews' => ReviewResource::collection($reviews),
        ]);
    }

    public function getStylistByUser(int $userId): JsonResponse
    {
        $stylist = Stylist::with('user', 'products')
            ->where('user_id', $userId)
            ->first();

        if (!$stylist) {
            return response()->json([
                'status' => 'error',
                'message' => 'Stylist not found for this user',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'stylist' => $stylist,
        ]);
    }
}