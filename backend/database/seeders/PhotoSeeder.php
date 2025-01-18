<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Photo;
use GuzzleHttp\Client;

class PhotoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $client = new Client([
            'verify' => 'C:\\certs\\cacert.pem'  // Remplacez par le chemin où vous avez enregistré le fichier
        ]);

        // Générer plusieurs photos aléatoires
        for ($i = 1; $i <= 10; $i++) {
            $response = $client->request('GET', 'https://picsum.photos/200/300');
            $photoContent = $response->getBody()->getContents();

            // Alterner entre user_id et product_id
            if ($i % 2 == 0) {
                Photo::create([
                    'user_id' => null,
                    'product_id' => 1,
                    'photo' => $photoContent,
                ]);
            } else {
                Photo::create([
                    'user_id' => 1,
                    'product_id' => null,
                    'photo' => $photoContent,
                ]);
            }
        }

        // Vérifiez si les photos ont été insérées
        $photos = Photo::all();
        if ($photos->isEmpty()) {
            throw new \Exception('No photos were inserted.');
        }
    }
}
