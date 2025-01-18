<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Mesure;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Cart::class);
            $table->foreignIdFor(Product::class);
            $table->foreignIdFor(Mesure::class);
            $table->decimal('prix', 8, 2); // Changement du type pour un prix à virgule flottante
            $table->enum('status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
