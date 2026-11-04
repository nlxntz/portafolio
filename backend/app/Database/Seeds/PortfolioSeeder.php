<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run()
    {
        // -------------------------------------------------------------
        // SEED: USUARIO ADMINISTRADOR
        // -------------------------------------------------------------
        $userModel = $this->db->table('users');
        $userModel->truncate();

        $userModel->insert([
            'username'      => 'admin',
            'email'         => 'lintznicolas2@gmail.com',
            'password_hash' => password_hash('Admin@2026!', PASSWORD_BCRYPT),
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ]);

        // -------------------------------------------------------------
        // SEED: PROYECTOS INICIALES
        // -------------------------------------------------------------
        $projectModel = $this->db->table('projects');
        $projectModel->truncate();

        $projects = [
            [
                'title'       => 'Gestión Hospitalaria de Pacientes',
                'slug'        => 'gestion-hospitalaria-pacientes',
                'category'    => 'Full Stack',
                'summary'     => 'Sistema de gestión de pacientes y citas clínicas con arquitectura desacoplada y contenedores Docker.',
                'description' => 'Plataforma completa para la administración de expedientes clínicos, control de citas y seguimiento de tratamientos. Implementado con una API RESTful en CodeIgniter 4 consumida por una SPA reactiva en Angular.',
                'tech_stack'  => 'CodeIgniter 4, Angular, PHP 8, MySQL, Docker, Tailwind CSS',
                'image_url'   => '',
                'github_url'  => 'https://github.com/nlxntz/prueba-tecnica-pacientes',
                'live_url'    => '',
                'is_featured' => 1,
                'sort_order'  => 1,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'title'       => 'Sistema de Inventario TI — Portuaria Corral',
                'slug'        => 'inventario-portuaria-corral',
                'category'    => 'ERP & Gestión',
                'summary'     => 'Control de activos tecnológicos, mantenimiento de servidores y alertas inteligentes para entorno portuario.',
                'description' => 'Sistema desarrollado para la gestión y seguimiento del inventario de infraestructura TI de Portuaria Corral. Incluye bitácora de mantenimiento correctivo/preventivo y control de disponibilidad de hardware crítico.',
                'tech_stack'  => 'PHP, MySQL, JavaScript, Windows Server, Bootstrap',
                'image_url'   => '',
                'github_url'  => 'https://github.com/nlxntz/portuaria-corral-inventario',
                'live_url'    => '',
                'is_featured' => 1,
                'sort_order'  => 2,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'title'       => 'Modelo Predictivo de Costos Médicos & Diabetes',
                'slug'        => 'modelo-predictivo-salud',
                'category'    => 'Inteligencia Artificial',
                'summary'     => 'Modelos de machine learning de regresión y clasificación para análisis de salud y estimación de seguros.',
                'description' => 'Proyecto de ciencia de datos que entrena algoritmos de regresión lineal y clasificación para predecir el impacto de variables fisiológicas en los costos de pólizas médicas y el diagnóstico preventivo de diabetes.',
                'tech_stack'  => 'Python, Scikit-Learn, Pandas, NumPy, Jupyter',
                'image_url'   => '',
                'github_url'  => 'https://github.com/nlxntz/Ev2_AIA',
                'live_url'    => '',
                'is_featured' => 1,
                'sort_order'  => 3,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'title'       => 'Reconocimiento de Lenguaje de Señas',
                'slug'        => 'lenguaje-senas-vision-artificial',
                'category'    => 'Visión Artificial',
                'summary'     => 'Detección y traducción de gestos de manos en tiempo real mediante computer vision.',
                'description' => 'Sistema interactivo que procesa flujos de video mediante cámaras para reconocer patrones biomecánicos de manos y traducir gestos del lenguaje de señas a texto y comandos audibles.',
                'tech_stack'  => 'Python, OpenCV, MediaPipe, Deep Learning',
                'image_url'   => '',
                'github_url'  => 'https://github.com/nlxntz/proyecto_lenguaje_senas',
                'live_url'    => '',
                'is_featured' => 1,
                'sort_order'  => 4,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
        ];

        $projectModel->insertBatch($projects);
    }
}
