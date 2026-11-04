<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JwtAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getServer('HTTP_AUTHORIZATION') ?? $request->header('Authorization');

        if (!$authHeader) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['status' => 'error', 'message' => 'Token de autorización no proporcionado.']);
        }

        $tokenString = is_object($authHeader) ? $authHeader->getValue() : (string) $authHeader;
        $tokenParts = explode(' ', trim($tokenString));

        if (count($tokenParts) !== 2 || strcasecmp($tokenParts[0], 'Bearer') !== 0) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['status' => 'error', 'message' => 'Formato de token inválido. Se espera: Bearer <token>']);
        }

        $jwtToken = $tokenParts[1];
        $secretKey = env('JWT_SECRET_KEY', 'default_secret_key_change_me');

        try {
            $decoded = JWT::decode($jwtToken, new Key($secretKey, 'HS256'));
            // Inyectamos el usuario decodificado en la request
            $request->user = $decoded;
        } catch (Exception $e) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['status' => 'error', 'message' => 'Token inválido o expirado: ' . $e->getMessage()]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed
    }
}
