<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            'role' => $this->role,
            'mesures' => new MeasureResource($this->whenLoaded('mesures')),
            'stylist' => new StylistResource($this->whenLoaded('stylist')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'carts' => CartResource::collection($this->whenLoaded('carts')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
