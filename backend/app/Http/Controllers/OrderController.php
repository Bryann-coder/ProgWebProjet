<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest; // Ajoutez cette ligne
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return OrderResource::collection(Order::with(['cart', 'product', 'mesure'])->get());
    }

    public function store(StoreOrderRequest $request): OrderResource
    {
        $order = Order::create($request->validated());
        return new OrderResource($order->load(['cart', 'product', 'mesure']));
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource($order->load(['cart', 'product','mesure']));
    }

    public function update(UpdateOrderRequest $request, Order $order): OrderResource // Mettez à jour cette ligne
    {
        $order->update($request->validated());
        return new OrderResource($order->load(['cart', 'product', 'mesure']));
    }

    public function destroy(Order $order): JsonResponse
    {
        $order->delete();
        return response()->json(null, 204);
    }
}
