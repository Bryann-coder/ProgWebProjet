<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStylistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id|unique:stylists,user_id,' . $this->stylist?->id,
            'bibliography' => 'required|string',
            'specialite' => 'required|string|max:255',
            'rating' => 'required|integer|min:0|max:5',
            'image' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.unique' => 'Cet utilisateur est déjà un styliste.',
            'rating.min' => 'La note doit être entre 0 et 5.',
            'rating.max' => 'La note doit être entre 0 et 5.',
            'image' => 'nullable|string'
        ];
    }
}