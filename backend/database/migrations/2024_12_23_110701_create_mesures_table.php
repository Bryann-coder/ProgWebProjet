<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mesures', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignIdFor(User::class);
            $table->integer('tour_de_la_poitrine');
            $table->integer('tour_de_taille');
            $table->integer('tour_de_bassin');
            $table->integer('longueur_du_buste');
            $table->integer('tour_de_la_cuisse');
            $table->integer('tour_du_mollet');
            $table->integer('longueur_entre_jambes');
            $table->integer('largeur_epaule');
            $table->integer('tour_de_cou');
            $table->integer('tour_de_bras');
            $table->integer('tour_avant_bras');
            $table->integer('longueur_du_bras');
            $table->integer('tour_de_poignet');
            $table->integer('type')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mesures');
    }
};