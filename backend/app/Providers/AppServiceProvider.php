<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Resources\Json\JsonResource;

use App\Models\Review;

use Illuminate\Support\Facades\Gate;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Map des policies.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Assurez-vous que ReviewPolicy est également lié ici si nécessaire
        Review::class => \App\Policies\ReviewPolicy::class,
    ];
    
    
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();


        // $this->registerPolicies();

        // Gate pour update
        Gate::define('update-review', function ($user, Review $review) {
            return $user->id === $review->user_id;
        });

        // Gate pour destroy
        Gate::define('delete-review', function ($user, Review $review) {
            return $user->id === $review->user_id;
        });
    }
}
