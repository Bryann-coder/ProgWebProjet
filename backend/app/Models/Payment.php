<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'montant',
        'cart_id',
        'date_paiement',
        'status'
    ];
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }
}
