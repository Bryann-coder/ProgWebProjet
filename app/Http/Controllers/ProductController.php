<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ProductResource::collection(Product::with(['stylist.user', 'reviews'])->get());
    }

    public function store(StoreProductRequest $request): ProductResource
    {
        // Récupérer les données validées
        $validatedData = $request->validated();

        // Vérifier et traiter l'image en Base64
        if (!empty($validatedData['image'])) {
            $base64Image = $validatedData['image'];

            // Vérifie et découpe le type MIME et les données
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                // Récupère l'extension de fichier (jpeg, png, etc.)
                $extension = strtolower($type[1]);

                // Découpe pour extraire les données encodées
                $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);

                // Décodage des données
                $decodedImage = base64_decode($base64Image);

                if ($decodedImage === false) {
                    return response()->json(['error' => 'Invalid Base64 image data'], 400);
                }

                // Génère un nom unique pour l'image
                $fileName = uniqid() . '.' . $extension;

                // Sauvegarde dans le répertoire storage/products
                Storage::disk('public')->put('products/' . $fileName, $decodedImage);

                // Met à jour le chemin de l'image dans les données validées
                $validatedData['image'] = 'storage/products/' . $fileName;
            } else {
                return response()->json(['error' => 'Invalid image format'], 400);
            }
        }

        // Créer le produit avec les données validées
        $product = Product::create($validatedData);

        // Retourner la ressource produit
        return new ProductResource($product->load(['stylist.user', 'reviews']));
    }

    public function show(Product $product): ProductResource
    {
        return new ProductResource($product->load(['stylist.user', 'reviews']));
    }

    public function update(StoreProductRequest $request, Product $product): ProductResource
{
    $validatedData = $request->validated();

    // Vérifier et traiter l'image en Base64
    if (!empty($validatedData['image'])) {
        $base64Image = $validatedData['image'];

        // Vérifie et découpe le type MIME et les données
        if (!preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            abort(400, 'Invalid image format');
        }

        // Si une image existe déjà, la supprimer
        if ($product->image) {
            $oldImagePath = str_replace('storage/', '', $product->image);
            Storage::disk('public')->delete($oldImagePath);
        }

        // Récupère l'extension de fichier (jpeg, png, etc.)
        $extension = strtolower($type[1]);

        // Découpe pour extraire les données encodées
        $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);

        // Décodage des données
        $decodedImage = base64_decode($base64Image);

        if ($decodedImage === false) {
            abort(400, 'Invalid Base64 image data');
        }

        // Génère un nom unique pour l'image
        $fileName = uniqid() . '.' . $extension;

        // Sauvegarde dans le répertoire storage/products
        Storage::disk('public')->put('products/' . $fileName, $decodedImage);

        // Met à jour le chemin de l'image dans les données validées
        $validatedData['image'] = 'storage/products/' . $fileName;
    }

    $product->update($validatedData);
    return new ProductResource($product->load(['stylist.user', 'reviews']));
}

    public function destroy(Product $product): JsonResponse
    {
        // Supprimer l'image associée si elle existe
        if ($product->image) {
            $imagePath = str_replace('storage/', '', $product->image);
            Storage::disk('public')->delete($imagePath);
        }

        $product->delete();
        return response()->json(null, 204);
    }
}