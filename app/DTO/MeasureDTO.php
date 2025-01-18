<?php

// app/DTOs/MeasureDTO.php
namespace App\DTOs;

class MeasureDTO
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $user_id,
        public readonly int $tour_de_la_poitrine,
        public readonly int $tour_de_taille,
        public readonly int $tour_de_bassin,
        public readonly int $longueur_du_buste,
        public readonly int $tour_de_la_cuisse,
        public readonly int $tour_du_mollet,
        public readonly int $longueur_entre_jambes,
        public readonly int $largeur_epaule,
        public readonly int $tour_de_cou,
        public readonly int $tour_de_bras,
        public readonly int $tour_avant_bras,
        public readonly int $longueur_du_bras,
        public readonly int $tour_de_poignet,
        public readonly int $type
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            id: null,
            user_id: $request->user_id,
            tour_de_la_poitrine: $request->tour_de_la_poitrine,
            tour_de_taille: $request->tour_de_taille,
            tour_de_bassin: $request->tour_de_bassin,
            longueur_du_buste: $request->longueur_du_buste,
            tour_de_la_cuisse: $request->tour_de_la_cuisse,
            tour_du_mollet: $request->tour_du_mollet,
            longueur_entre_jambes: $request->longueur_entre_jambes,
            largeur_epaule: $request->largeur_epaule,
            tour_de_cou: $request->tour_de_cou,
            tour_de_bras: $request->tour_de_bras,
            tour_avant_bras: $request->tour_avant_bras,
            longueur_du_bras: $request->longueur_du_bras,
            tour_de_poignet: $request->tour_de_poignet,
            type: $request->type
        );
    }
}
