<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\MessageModel;

class ContactController extends ResourceController
{
    protected $format = 'json';

    /**
     * Endpoint público para enviar mensaje desde la landing page
     */
    public function create()
    {
        $messageModel = new MessageModel();
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        // Honeypot básico antispam: si el campo 'website' tiene contenido, es un bot
        if (!empty($input['website'])) {
            return $this->respond([
                'status'  => 'success',
                'message' => '¡Tu mensaje ha sido recibido con éxito!',
            ]);
        }

        if (!$messageModel->insert($input)) {
            return $this->failValidationErrors($messageModel->errors());
        }

        return $this->respondCreated([
            'status'  => 'success',
            'message' => '¡Gracias por contactarme! He recibido tu mensaje y te responderé a la brevedad.',
        ]);
    }

    /**
     * Listado de mensajes recibidos (Admin)
     */
    public function index()
    {
        $messageModel = new MessageModel();
        $messages = $messageModel->orderBy('created_at', 'DESC')->findAll();

        return $this->respond([
            'status' => 'success',
            'data'   => $messages,
        ]);
    }

    /**
     * Marcar mensaje como leído / no leído (Admin)
     */
    public function toggleRead($id = null)
    {
        $messageModel = new MessageModel();
        $message = $messageModel->find($id);

        if (!$message) {
            return $this->failNotFound('Mensaje no encontrado.');
        }

        $newStatus = $message['is_read'] ? 0 : 1;
        $messageModel->update($id, ['is_read' => $newStatus]);

        return $this->respond([
            'status'  => 'success',
            'is_read' => $newStatus,
            'message' => $newStatus ? 'Mensaje marcado como leído.' : 'Mensaje marcado como no leído.',
        ]);
    }

    /**
     * Eliminar mensaje (Admin)
     */
    public function delete($id = null)
    {
        $messageModel = new MessageModel();
        $message = $messageModel->find($id);

        if (!$message) {
            return $this->failNotFound('Mensaje no encontrado.');
        }

        $messageModel->delete($id);

        return $this->respondDeleted([
            'status'  => 'success',
            'message' => 'Mensaje eliminado.',
        ]);
    }
}
