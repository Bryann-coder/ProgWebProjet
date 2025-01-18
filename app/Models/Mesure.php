<?php

// app/Models/Mesure.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mesure extends Model
{
    protected $fillable = [
        'user_id',
        'tour_de_la_poitrine',
        'tour_de_taille',
        'tour_de_bassin',
        'longueur_du_buste',
        'tour_de_la_cuisse',
        'tour_du_mollet',
        'longueur_entre_jambes',
        'largeur_epaule',
        'tour_de_cou',
        'tour_de_bras',
        'tour_avant_bras',
        'longueur_du_bras',
        'tour_de_poignet',
        'type'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}