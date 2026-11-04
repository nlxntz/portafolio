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
        $rawHeader = '';

        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            $rawHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }

        if (empty($rawHeader)) {
            if ($serverHeader = $request->getServer('HTTP_AUTHORIZATION')) {
                $rawHeader = (string) $serverHeader;
            } elseif ($headerObj = $request->header('Authorization')) {
                $rawHeader = method_exists($headerObj, 'getValueLine') ? $headerObj->getValueLine() : (string) $headerObj;
            }
        }

        if (empty($rawHeader)) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['status' => 'error', 'message' => 'Token de autorización no proporcionado.']);
        }

        // Buscar el token después de 'Bearer' usando expresión regular resistente
        if (!preg_match('/Bearer\s+(\S+)/i', $rawHeader, $matches)) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['status' => 'error', 'message' => 'Formato de token inválido. Se espera: Bearer <token>']);
        }

        $jwtToken = $matches[1];
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
