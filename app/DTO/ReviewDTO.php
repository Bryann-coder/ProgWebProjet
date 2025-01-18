<?php

namespace App\DTOs;

class ReviewDTO
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $user_id,
        public readonly int $product_id,
        public readonly string $note,
        public readonly string $commentaire
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            id: null,
            user_id: $request->user_id,
            product_id: $request->product_id,
            note: $request->note,
            commentaire: $request->commentaire
        );
    }
}