<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Stylist;

class StylistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'stylist')->get();

        $specialites = ['Casual', 'Business', 'Evening Wear', 'Sports Wear', 'Haute Couture'];

        foreach ($users as $key => $user) {
            $randomSpecialiteKey = array_rand($specialites);
            $randomSpecialite = $specialites[$randomSpecialiteKey];

            Stylist::create([
                'user_id' => $user->id,
                'bibliography' => "Professional stylist with over " . rand(5, 20) . " years of experience.",
                'specialite' => $randomSpecialite,
                'rating' => rand(35, 50) / 10,
                'image' => 'storage/stylists/' . ($key + 1) . '.png'
            ]);
        }
    }
}
