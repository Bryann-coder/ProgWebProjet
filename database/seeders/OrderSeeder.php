<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Order;
use App\Models\Mesure;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carts = Cart::all();
        $products = Product::all();
        $mesures = Mesure::all();
        $statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

        foreach ($carts as $cart) {
            $numOrders = rand(1, 5);

            for ($i = 0; $i < $numOrders; $i++) {
                $product = $products->random();
                $mesure = $mesures->random();
                Order::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'mesure_id' => $mesure->id,
                    'prix' => $product->price, // Utilisez directement le prix du produit
                    'status' => $statuses[array_rand($statuses)]
                ]);
            }
        }
    }
}
