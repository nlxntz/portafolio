<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\MessageModel;
use Config\Services;

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

        // 1. Honeypot básico antispam: si el campo 'website' tiene contenido, es un bot
        if (!empty($input['website'])) {
            return $this->respond([
                'status'  => 'success',
                'message' => '¡Tu mensaje ha sido recibido con éxito!',
            ]);
        }

        // 2. Guardar en Base de Datos MySQL
        if (!$messageModel->insert($input)) {
            return $this->failValidationErrors($messageModel->errors());
        }

        $insertedId = $messageModel->getInsertID();

        // 3. Intentar enviar notificación por correo electrónico (sin bloquear si SMTP no está configurado)
        $this->sendEmailNotification($input);

        return $this->respondCreated([
            'status'     => 'success',
            'message'    => '¡Gracias por contactarme! He recibido tu mensaje y te responderé a la brevedad.',
            'message_id' => $insertedId,
        ]);
    }

    /**
     * Enviar notificación por email al propietario del portafolio
     */
    private function sendEmailNotification(array $data)
    {
        try {
            $email = Services::email();

            $smtpUser = env('email.SMTPUser', 'lintznicolas2@gmail.com');
            $toEmail  = env('CONTACT_NOTIFICATION_EMAIL', 'lintznicolas2@gmail.com');

            $name    = esc($data['name'] ?? 'Visitante');
            $sender  = esc($data['email'] ?? 'no-reply@portafolio.local');
            $subject = esc($data['subject'] ?? 'Nuevo mensaje de contacto en tu Portafolio');
            $body    = nl2br(esc($data['message'] ?? ''));

            $email->setFrom($smtpUser, "Portafolio — {$name}");
            $email->setTo($toEmail);
            $email->setReplyTo($sender, $name);
            $email->setSubject("📩 [Portafolio] {$subject} — de {$name}");

            $htmlMessage = "
                <div style='font-family: Arial, sans-serif; background-color: #0b0b14; color: #e2e8f0; padding: 30px; border-radius: 12px; max-width: 600px;'>
                    <h2 style='color: #c084fc; border-bottom: 1px solid #2e2e48; padding-bottom: 10px; margin-top: 0;'>
                        Nuevo mensaje de contacto
                    </h2>
                    <p style='margin: 8px 0;'><strong>Nombre:</strong> {$name}</p>
                    <p style='margin: 8px 0;'><strong>Correo:</strong> <a href='mailto:{$sender}' style='color: #818cf8;'>{$sender}</a></p>
                    <p style='margin: 8px 0;'><strong>Asunto:</strong> {$subject}</p>
                    <div style='margin-top: 20px; padding: 15px; background-color: #16162a; border-left: 4px solid #9333ea; border-radius: 6px;'>
                        <p style='margin: 0; font-size: 14px; line-height: 1.6;'>{$body}</p>
                    </div>
                    <p style='margin-top: 25px; font-size: 11px; color: #64748b; text-align: center;'>
                        Enviado automáticamente desde tu Portafolio Web (CodeIgniter 4 + Angular)
                    </p>
                </div>
            ";

            $email->setMessage($htmlMessage);
            $email->setMailType('html');

            // Enviamos de forma asíncrona / silenciosa
            @$email->send(false);
        } catch (\Throwable $e) {
            log_message('error', 'Error al enviar email de contacto: ' . $e->getMessage());
        }
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
