<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Photo;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        

        // Create 10 regular users
        User::factory()->count(10)->create([
            'role' => 'user',
            'mot_de_passe' => Hash::make('password123')
        ]);

        // Create 5 stylists
        User::factory()->count(5)->create([
            'role' => 'stylist',
            'mot_de_passe' => Hash::make('password123')
        ]);
    }
}
