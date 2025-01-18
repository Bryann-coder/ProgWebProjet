<?php

// app/DTOs/ProductDTO.php
namespace App\DTOs;

class ProductDTO
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $stylist_id,
        public readonly string $nom,
        public readonly string $description,
        public readonly float $price,
        public readonly int $category
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            id: null,
            stylist_id: $request->stylist_id,
            nom: $request->nom,
            description: $request->description,
            price: $request->price,
            category: $request->category
        );
    }
}