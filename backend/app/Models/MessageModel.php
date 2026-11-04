<?php

namespace App\Models;

use CodeIgniter\Model;

class MessageModel extends Model
{
    protected $table            = 'messages';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'name',
        'email',
        'subject',
        'message',
        'is_read',
    ];

    protected bool $allowEmptyInserts = false;

    // Fechas
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Reglas de validación
    protected $validationRules = [
        'name'    => 'required|min_length[2]|max_length[150]',
        'email'   => 'required|valid_email|max_length[150]',
        'message' => 'required|min_length[5]|max_length[5000]',
    ];
}
