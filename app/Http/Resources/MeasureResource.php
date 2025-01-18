<?php

// app/Http/Resources/MeasureResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeasureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'tour_de_la_poitrine' => $this->tour_de_la_poitrine,
            'tour_de_taille' => $this->tour_de_taille,
            'tour_de_bassin' => $this->tour_de_bassin,
            'longueur_du_buste' => $this->longueur_du_buste,
            'tour_de_la_cuisse' => $this->tour_de_la_cuisse,
            'tour_du_mollet' => $this->tour_du_mollet,
            'longueur_entre_jambes' => $this->longueur_entre_jambes,
            'largeur_epaule' => $this->largeur_epaule,
            'tour_de_cou' => $this->tour_de_cou,
            'tour_de_bras' => $this->tour_de_bras,
            'tour_avant_bras' => $this->tour_avant_bras,
            'longueur_du_bras' => $this->longueur_du_bras,
            'tour_de_poignet' => $this->tour_de_poignet,
            'type' => $this->type,
        ];
    }
}