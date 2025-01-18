<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Mesure;

class MeasureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        
        foreach ($users as $user) {
            Mesure::create([
                'user_id' => $user->id,
                'tour_de_la_poitrine' => rand(80, 120),
                'tour_de_taille' => rand(60, 100),
                'tour_de_bassin' => rand(85, 125),
                'longueur_du_buste' => rand(40, 60),
                'tour_de_la_cuisse' => rand(45, 70),
                'tour_du_mollet' => rand(30, 45),
                'longueur_entre_jambes' => rand(70, 90),
                'largeur_epaule' => rand(35, 50),
                'tour_de_cou' => rand(30, 45),
                'tour_de_bras' => rand(25, 40),
                'tour_avant_bras' => rand(20, 35),
                'longueur_du_bras' => rand(50, 70),
                'tour_de_poignet' => rand(15, 25),
                'type' => rand(0,1)
            ]);
        }
    }
}
