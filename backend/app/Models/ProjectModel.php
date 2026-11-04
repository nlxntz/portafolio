<?php

namespace App\Models;

use CodeIgniter\Model;

class ProjectModel extends Model
{
    protected $table            = 'projects';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'title',
        'slug',
        'category',
        'summary',
        'description',
        'tech_stack',
        'image_url',
        'github_url',
        'live_url',
        'is_featured',
        'sort_order',
    ];

    protected bool $allowEmptyInserts = false;

    // Fechas
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Reglas de validación
    protected $validationRules = [
        'title'    => 'required|min_length[3]|max_length[200]',
        'slug'     => 'required|min_length[3]|max_length[200]|is_unique[projects.slug,id,{id}]',
        'category' => 'permit_empty|max_length[100]',
    ];

    /**
     * Obtener proyectos con su lista de tecnologías procesada como array
     */
    public function getProjectsWithTechList(bool $onlyFeatured = false): array
    {
        $builder = $this->orderBy('sort_order', 'ASC')->orderBy('created_at', 'DESC');
        if ($onlyFeatured) {
            $builder->where('is_featured', 1);
        }
        $projects = $builder->findAll();

        return array_map(function ($project) {
            $project['tech_list'] = array_values(array_filter(array_map('trim', explode(',', $project['tech_stack'] ?? ''))));
            return $project;
        }, $projects);
    }
}
