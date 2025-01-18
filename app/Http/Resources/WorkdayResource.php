<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkdayResource extends JsonResource
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
            'stylist_id' => $this->stylist_id,
            'user_id' => $this->user_id,
            'status' => $this->status,
            'date' => $this->date,
            'stylist' => new StylistResource($this->whenLoaded('stylist')),
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
