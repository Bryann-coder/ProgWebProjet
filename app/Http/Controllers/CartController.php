<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CartController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CartResource::collection(Cart::with(['user', 'orders', 'payment'])->get());
    }

    public function show(Cart $Cart): CartResource
    {
        return new CartResource($Cart->load(['user', 'orders', 'payment']));
    }

    public function store(Request $request){
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
        $cart = Cart::create([
            'user_id' => $request->user_id,
        ]);
        return new CartResource($cart->load(['user', 'orders', 'payment']));
    }

    public function destroy(Cart $Cart): JsonResponse
    {
        $Cart->delete();
        return response()->json(null, 204);
    }
}
