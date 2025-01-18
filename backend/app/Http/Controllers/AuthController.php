<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'mot_de_passe' => 'required|string|min:6',
            'role' => 'required|string'
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'role' => $request->role
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'user' => $user,
            'Authorization' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'mot_de_passe' => 'required|string',
        ]);

        $credentials = $request->only('email', 'mot_de_passe');

        $user = User::with('mesures')->where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['mot_de_passe'], $user->mot_de_passe)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Utiliser fromCredentials pour générer un token basé sur les informations d'identification
        $token = JWTAuth::fromUser($user);
        return response()->json([
                'status' => 'success',
                'user' => $user,
                'authorisation' => [
                    'token' => $token,
                    'type' => 'bearer',
                ]
            ]);
    }

    public function logout(): JsonResponse
    {
        try {
            $token = JWTAuth::getToken();
            
            if (!$token) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Already logged out'
                ]);
            }

            try {
                JWTAuth::invalidate($token);
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully logged out'
                ]);
            } catch (TokenExpiredException $e) {
                // Si le token est expiré, on le considère comme déjà invalidé
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully logged out'
                ]);
            } catch (TokenInvalidException $e) {
                // Si le token est invalide, on le considère comme déjà invalidé
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully logged out'
                ]);
            }
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to logout, but token has been removed'
            ], 500);
        }
    }

    // Ajoutez cette méthode pour vérifier la validité du token
    public function checkToken(): JsonResponse
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json(['valid' => true]);
        } catch (TokenExpiredException $e) {
            return response()->json(['valid' => false, 'error' => 'token_expired'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['valid' => false, 'error' => 'token_invalid'], 401);
        } catch (JWTException $e) {
            return response()->json(['valid' => false, 'error' => 'token_absent'], 401);
        }
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

    protected function respondWithToken($token): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    public function index(): AnonymousResourceCollection
    {
        return UserResource::collection(User::all());
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user);
    }

    public function update(Request $request, User $user): UserResource
    {
        $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|unique:users,email,' . $user->id,
            'mot_de_passe' => 'sometimes|required|string|min:6',
            'role' => 'sometimes|required|string'
        ]);

        $user->update($request->only(['nom', 'email', 'role']));

        if ($request->filled('mot_de_passe')) {
            $user->mot_de_passe = Hash::make($request->mot_de_passe);
            $user->save();
        }

        return new UserResource($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
