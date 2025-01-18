<?php

// app/Http/Controllers/ReviewController.php
namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ReviewResource::collection(
            Review::with(['user', 'product'])->get()
        );
    }

    public function getProductReviews(Product $product): AnonymousResourceCollection
    {
        return ReviewResource::collection(
            $product->reviews()->with(['user'])->get()
        );
    }

    public function store(StoreReviewRequest $request): ReviewResource
    {
        $review = Review::create($request->validated());

        // Charger les relations
        $review->load(['user', 'product']);

        return new ReviewResource($review);
    }

    public function show(Review $review): ReviewResource
    {
        return new ReviewResource(
            $review->load(['user', 'product'])
        );
    }

    public function update(StoreReviewRequest $request, Review $review): ReviewResource
    {
        $review->update($request->validated());

        return new ReviewResource(
            $review->load(['user', 'product'])
        );
    }

    public function destroy(Review $review): JsonResponse
    {
        $review->delete();
        return response()->json(null, 204);
    }

    public function getAverageRating(Product $product): JsonResponse
    {
        $averageRating = $product->reviews()->avg('note');

        return response()->json([
            'product_id' => $product->id,
            'average_rating' => round($averageRating, 2),
            'total_reviews' => $product->reviews()->count()
        ]);
    }
}
