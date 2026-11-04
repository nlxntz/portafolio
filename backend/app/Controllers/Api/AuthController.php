<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use Firebase\JWT\JWT;
use Exception;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $rules = [
            'login'    => 'required', // email o username
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $login = $this->request->getVar('login');
        $password = $this->request->getVar('password');

        $userModel = new UserModel();
        $user = $userModel->groupStart()
                          ->where('email', $login)
                          ->orWhere('username', $login)
                          ->groupEnd()
                          ->first();

        if (!$user) {
            return $this->failUnauthorized('Credenciales incorrectas.');
        }

        if (!password_verify($password, $user['password_hash'])) {
            return $this->failUnauthorized('Credenciales incorrectas.');
        }

        $secretKey = env('JWT_SECRET_KEY', 'default_secret_key_change_me');
        $ttl = (int) env('JWT_TIME_TO_LIVE', 86400);
        $issuedAt = time();
        $expire = $issuedAt + $ttl;

        $payload = [
            'iss' => base_url(),
            'aud' => base_url(),
            'iat' => $issuedAt,
            'exp' => $expire,
            'uid' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
        ];

        $token = JWT::encode($payload, $secretKey, 'HS256');

        return $this->respond([
            'status'  => 'success',
            'message' => 'Autenticación exitosa',
            'token'   => $token,
            'user'    => [
                'id'       => $user['id'],
                'username' => $user['username'],
                'email'    => $user['email'],
            ],
            'expires_in' => $ttl,
        ]);
    }

    public function me()
    {
        $userPayload = $this->request->user ?? null;
        if (!$userPayload) {
            return $this->failUnauthorized('No autenticado');
        }

        return $this->respond([
            'status' => 'success',
            'user'   => $userPayload,
        ]);
    }
}
