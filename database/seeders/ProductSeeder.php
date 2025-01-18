<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stylist;
use App\Models\Product;
use App\Models\Photo;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $stylists = Stylist::all();
        $categories = ['Shirts', 'Pants', 'Dresses', 'Suits', 'Accessories'];

        foreach ($stylists as $stylist) {
            foreach ($categories as $category) {
                $numProducts = rand(3, 7);

                for ($i = 0; $i < $numProducts; $i++) {
                    Product::create([
                        'stylist_id' => $stylist->id,
                        'nom' => $category . ' ' . rand(1, 1000),
                        'description' => "A beautiful " . strtolower($category) . " piece designed by our stylist.",
                        'price' => rand(2000, 50000) / 100,
                        'category' => $category,
                        'image' => 'storage/products/'. rand(1, 5) . '.png'
                    ]);
                }
            }
        }
    }
}
