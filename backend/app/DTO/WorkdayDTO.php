<?php

// app/DTOs/WorkdayDTO.php
namespace App\DTOs;

class WorkdayDTO
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $stylist_id,
        public readonly int $status
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            id: null,
            stylist_id: $request->stylist_id,
            status: $request->status
        );
    }
}