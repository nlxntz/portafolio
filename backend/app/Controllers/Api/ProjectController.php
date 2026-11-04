<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ProjectModel;

class ProjectController extends ResourceController
{
    protected $format = 'json';

    /**
     * Listado público de proyectos (con filtros opcionales de categoría y destacado)
     */
    public function index()
    {
        $projectModel = new ProjectModel();

        $category = $this->request->getGet('category');
        $featured = $this->request->getGet('featured');

        $builder = $projectModel->orderBy('sort_order', 'ASC')->orderBy('created_at', 'DESC');

        if (!empty($category) && $category !== 'all') {
            $builder->where('category', $category);
        }

        if ($featured !== null) {
            $builder->where('is_featured', (int) $featured);
        }

        $projects = $builder->findAll();

        // Procesar tech_list
        $data = array_map(function ($project) {
            $project['tech_list'] = array_values(array_filter(array_map('trim', explode(',', $project['tech_stack'] ?? ''))));
            return $project;
        }, $projects);

        return $this->respond([
            'status' => 'success',
            'data'   => $data,
        ]);
    }

    /**
     * Detalle de un proyecto por ID o por Slug
     */
    public function show($id = null)
    {
        $projectModel = new ProjectModel();

        $project = is_numeric($id)
            ? $projectModel->find($id)
            : $projectModel->where('slug', $id)->first();

        if (!$project) {
            return $this->failNotFound('Proyecto no encontrado.');
        }

        $project['tech_list'] = array_values(array_filter(array_map('trim', explode(',', $project['tech_stack'] ?? ''))));

        return $this->respond([
            'status' => 'success',
            'data'   => $project,
        ]);
    }

    /**
     * Crear nuevo proyecto (Admin)
     */
    public function create()
    {
        $projectModel = new ProjectModel();
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        // Generar slug si no se envía
        if (empty($input['slug']) && !empty($input['title'])) {
            $input['slug'] = url_title($input['title'], '-', true);
        }

        if (!$projectModel->insert($input)) {
            return $this->failValidationErrors($projectModel->errors());
        }

        $id = $projectModel->getInsertID();
        $newProject = $projectModel->find($id);
        $newProject['tech_list'] = array_values(array_filter(array_map('trim', explode(',', $newProject['tech_stack'] ?? ''))));

        return $this->respondCreated([
            'status'  => 'success',
            'message' => 'Proyecto creado con éxito.',
            'data'    => $newProject,
        ]);
    }

    /**
     * Actualizar proyecto (Admin)
     */
    public function update($id = null)
    {
        $projectModel = new ProjectModel();
        $project = $projectModel->find($id);

        if (!$project) {
            return $this->failNotFound('Proyecto no encontrado.');
        }

        $input = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (!$projectModel->update($id, $input)) {
            return $this->failValidationErrors($projectModel->errors());
        }

        $updated = $projectModel->find($id);
        $updated['tech_list'] = array_values(array_filter(array_map('trim', explode(',', $updated['tech_stack'] ?? ''))));

        return $this->respond([
            'status'  => 'success',
            'message' => 'Proyecto actualizado.',
            'data'    => $updated,
        ]);
    }

    /**
     * Eliminar proyecto (Admin)
     */
    public function delete($id = null)
    {
        $projectModel = new ProjectModel();
        $project = $projectModel->find($id);

        if (!$project) {
            return $this->failNotFound('Proyecto no encontrado.');
        }

        $projectModel->delete($id);

        return $this->respondDeleted([
            'status'  => 'success',
            'message' => 'Proyecto eliminado correctamente.',
        ]);
    }

    /**
     * Subir imagen para un proyecto
     */
    public function uploadImage()
    {
        $file = $this->request->getFile('image');

        if (!$file || !$file->isValid()) {
            return $this->fail('No se recibió una imagen válida.');
        }

        $validMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
        if (!in_array($file->getMimeType(), $validMimeTypes)) {
            return $this->fail('Formato de imagen inválido (solo PNG, JPG, WEBP, GIF).');
        }

        $newName = $file->getRandomName();
        $uploadPath = ROOTPATH . 'public/uploads/projects';

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $file->move($uploadPath, $newName);

        $imageUrl = base_url('uploads/projects/' . $newName);

        return $this->respond([
            'status'   => 'success',
            'image_url' => $imageUrl,
            'filename'  => $newName,
        ]);
    }
}
