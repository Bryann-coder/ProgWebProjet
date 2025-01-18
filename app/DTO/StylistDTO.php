<?php

// app/DTOs/StylistDTO.php
namespace App\DTOs;

class StylistDTO
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $user_id,
        public readonly string $bibliography,
        public readonly string $specialite,
        public readonly int $rating
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            id: null,
            user_id: $request->user_id,
            bibliography: $request->bibliography,
            specialite: $request->specialite,
            rating: $request->rating
        );
    }
}