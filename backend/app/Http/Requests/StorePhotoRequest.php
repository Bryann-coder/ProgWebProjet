<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'nullable|exists:users,id',
            'product_id' => 'nullable|exists:products,id',
            'photo' => 'required|file|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
