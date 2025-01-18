<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMeasureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'tour_de_la_poitrine' => 'required|integer',
            'tour_de_taille' => 'required|integer',
            'tour_de_bassin' => 'required|integer',
            'longueur_du_buste' => 'required|integer',
            'tour_de_la_cuisse' => 'required|integer',
            'tour_du_mollet' => 'required|integer',
            'longueur_entre_jambes' => 'required|integer',
            'largeur_epaule' => 'required|integer',
            'tour_de_cou' => 'required|integer',
            'tour_de_bras' => 'required|integer',
            'tour_avant_bras' => 'required|integer',
            'longueur_du_bras' => 'required|integer',
            'tour_de_poignet' => 'required|integer',
            'type' => 'required|integer|in:0,1',
        ];
    }
}