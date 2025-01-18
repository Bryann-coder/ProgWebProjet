<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stylist extends Model
{
    protected $fillable = [
        'user_id',
        'bibliography',
        'specialite',
        'rating',
        'image'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function workdays(): HasMany
    {
        return $this->hasMany(Workday::class);
    }
    public function reviews()
    {
        return $this->hasManyThrough(Review::class, Product::class, 'stylist_id', 'product_id');
    }
}
