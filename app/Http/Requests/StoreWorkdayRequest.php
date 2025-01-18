<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkdayRequest extends FormRequest
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
            'stylist_id' => 'required|exists:stylists,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|integer|in:0,1',
            'date' => 'required|date'
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Le statut doit être 0 (réservé) ou 1 (terminé).',
            'date.required' => 'La date de réservation est requise.',
            'date.date' => 'La date de réservation doit être une date valide.'
        ];
    }
}
