<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cart_id' => $this->cart_id,
            'product_id' => $this->product_id,
            'mesure_id' => $this->mesure_id,
            'prix' => $this->prix,
            'status' => $this->status,
            'cart' => new CartResource($this->whenLoaded('cart')),
            'product' => new ProductResource($this->whenLoaded('product')),
            'mesure' => new MeasureResource($this->whenLoaded('mesure'))
        ];
    }
}
