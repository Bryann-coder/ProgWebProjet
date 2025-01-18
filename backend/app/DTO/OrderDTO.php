<?php

namespace App\DTOs;

class OrderDTO
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $user_id,
        public readonly int $product_id,
        public readonly float $prix,
        public readonly int $status
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            id: null,
            user_id: $request->user_id,
            product_id: $request->product_id,
            prix: $request->prix,
            status: $request->status
        );
    }
}