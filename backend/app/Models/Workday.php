<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class Workday extends Model
{
    use HasFactory;

    protected $fillable = [
        'stylist_id',
        'user_id',
        'status',
        'date'
    ];

    protected $casts = [
        'date' => 'date',
        'status' => 'integer'
    ];

    /**
     * Les constantes de statut
     */
    const STATUS_RESERVED = 0;
    const STATUS_COMPLETED = 1;

    /**
     * Relation avec le styliste
     */
    public function stylist(): BelongsTo
    {
        return $this->belongsTo(Stylist::class);
    }

    /**
     * Relation avec l'utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope pour les réservations à venir
     */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('date', '>=', now())
                    ->orderBy('date', 'asc');
    }

    /**
     * Scope pour les réservations passées
     */
    public function scopePast(Builder $query): Builder
    {
        return $query->where('date', '<', now())
                    ->orderBy('date', 'desc');
    }

    /**
     * Scope pour les réservations réservées
     */
    public function scopeReserved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_RESERVED);
    }

    /**
     * Scope pour les réservations terminées
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Vérifie si la réservation est à venir
     */
    public function isUpcoming(): bool
    {
        return $this->date->isFuture();
    }

    /**
     * Vérifie si la réservation est passée
     */
    public function isPast(): bool
    {
        return $this->date->isPast();
    }

    /**
     * Vérifie si la réservation est pour aujourd'hui
     */
    public function isToday(): bool
    {
        return $this->date->isToday();
    }

    /**
     * Vérifie si le créneau est disponible pour un styliste à une date donnée
     */
    public static function isSlotAvailable(int $stylistId, string $date): bool
    {
        return !self::where('stylist_id', $stylistId)
                    ->where('date', $date)
                    ->exists();
    }

    /**
     * Obtient le statut sous forme de texte
     */
    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            self::STATUS_RESERVED => 'Réservé',
            self::STATUS_COMPLETED => 'Terminé',
            default => 'Inconnu'
        };
    }
}