<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stylist_id' => $this->stylist_id,
            'nom' => $this->nom,
            'description' => $this->description,
            'price' => $this->price,
            'category' => $this->category,
            'image' => $this->image,
            'stylist' => new StylistResource($this->whenLoaded('stylist')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews'))
        ];
    }
}
