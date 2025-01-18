<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Review;
use App\Models\Cart;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = Order::where('status', 'delivered')->get();
        
        foreach ($orders as $order) {
            if (rand(0, 1)) { // 50% chance of review
                $cart = Cart::find($order->cart_id);
                Review::create([
                    'user_id' => $cart->user_id,
                    'product_id' => $order->product_id,
                    'note' => rand(3, 5),
                    'commentaire' => "Great product! Rating: " . rand(3, 5) . "/5"
                ]);
            }
        }
    }
}
