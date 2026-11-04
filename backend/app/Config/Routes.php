<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Ruta raíz informativa
$routes->get('/', function () {
    return service('response')->setJSON([
        'status'  => 'online',
        'message' => 'API de Portafolio - Nicolás Lintz',
        'version' => '1.0.0',
    ]);
});

// -------------------------------------------------------------
// GRUPO API
// -------------------------------------------------------------
$routes->group('api', function ($routes) {

    // --- Rutas Públicas ---
    $routes->post('auth/login', 'Api\AuthController::login');
    $routes->get('projects', 'Api\ProjectController::index');
    $routes->get('projects/(:any)', 'Api\ProjectController::show/$1');
    $routes->post('contact', 'Api\ContactController::create');

    // --- Rutas Protegidas (Requieren token JWT) ---
    $routes->group('', ['filter' => 'jwt'], function ($routes) {
        // Auth Me
        $routes->get('auth/me', 'Api\AuthController::me');

        // Admin Dashboard
        $routes->get('admin/dashboard', 'Api\DashboardController::stats');

        // Admin Projects CRUD
        $routes->post('admin/projects/upload', 'Api\ProjectController::uploadImage');
        $routes->post('admin/projects', 'Api\ProjectController::create');
        $routes->put('admin/projects/(:num)', 'Api\ProjectController::update/$1');
        $routes->delete('admin/projects/(:num)', 'Api\ProjectController::delete/$1');

        // Admin Messages
        $routes->get('admin/messages', 'Api\ContactController::index');
        $routes->patch('admin/messages/(:num)/toggle-read', 'Api\ContactController::toggleRead/$1');
        $routes->delete('admin/messages/(:num)', 'Api\ContactController::delete/$1');
    });
});
