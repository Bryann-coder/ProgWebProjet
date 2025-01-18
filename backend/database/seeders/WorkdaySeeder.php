<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stylist;
use App\Models\User;
use App\Models\Workday;

class WorkdaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stylists = Stylist::all();
        $users = User::whereDoesntHave('stylist')->get(); // On prend que les users qui ne sont pas stylistes

        if ($users->isEmpty()) {
            throw new \RuntimeException('Aucun utilisateur disponible pour les réservations. Veuillez d\'abord créer des utilisateurs.');
        }

        foreach ($stylists as $stylist) {
            // Créer 3 réservations pour chaque styliste
            for ($i = 0; $i < 3; $i++) {
                // Sélectionner un utilisateur aléatoire
                $randomUser = $users->random();
                
                // Générer une date aléatoire dans les 30 prochains jours
                $randomDate = now()->addDays(rand(1, 30));
                
                // Vérifier si le styliste n'a pas déjà une réservation à cette date
                while (Workday::where('stylist_id', $stylist->id)
                             ->where('date', $randomDate)
                             ->exists()) {
                    $randomDate = now()->addDays(rand(1, 30));
                }

                Workday::create([
                    'stylist_id' => $stylist->id,
                    'user_id' => $randomUser->id,
                    'status' => rand(0, 1), // 0 = réservé, 1 = terminé
                    'date' => $randomDate
                ]);
            }
        }
    }
}