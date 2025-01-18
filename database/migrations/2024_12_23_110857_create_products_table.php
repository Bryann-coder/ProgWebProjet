<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Stylist;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('stylist_id');
            $table->string('nom');
            $table->string('description');
            $table->decimal('price', 8, 2); // Price avec un format décimal
            $table->string('category'); // Changez pour string ou enum
            $table->string('image')->nullable();
            $table->timestamps();

            // Relation avec Stylist
            $table->foreign('stylist_id')->references('id')->on('stylists')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
