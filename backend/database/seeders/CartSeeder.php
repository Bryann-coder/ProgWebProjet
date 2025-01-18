<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cart;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        foreach ($users as $user) {
            $numOrders = rand(1, 5);

            for ($i = 0; $i < $numOrders; $i++) {
                Cart::create([
                    'user_id' => $user->id,
                    'date' => now()->subDays(rand(1, 30)),
                ]);
            }
        }
    }
}
