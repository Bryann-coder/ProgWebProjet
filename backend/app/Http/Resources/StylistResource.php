<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StylistResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'bibliography' => $this->bibliography,
            'specialite' => $this->specialite,
            'rating' => $this->rating,
            'image' => $this->image ?? null,
            'user' => new UserResource($this->whenLoaded('user')),
            'products' => ProductResource::collection($this->whenLoaded('products')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
