<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'mot_de_passe',
        'role',
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function mesures(): HasMany
    {
        return $this->hasMany(Mesure::class);
    }

    public function stylist(): HasOne
    {
        return $this->hasOne(Stylist::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }
}
