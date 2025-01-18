<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the cart is authorized to make this request.
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
            'cart_id' => 'required|exists:carts,id',
            'product_id' => 'required|exists:products,id',
            'mesure_id' => 'required|exists:mesures,id',
            'prix' => 'required|numeric|min:0',
            'status' => 'required|string|in:pending,confirmed,delivered,shipped,cancelled'
        ];
    }
}
