<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ProjectModel;
use App\Models\MessageModel;

class DashboardController extends ResourceController
{
    protected $format = 'json';

    public function stats()
    {
        $projectModel = new ProjectModel();
        $messageModel = new MessageModel();

        $totalProjects = $projectModel->countAllResults();
        $featuredProjects = $projectModel->where('is_featured', 1)->countAllResults();

        $totalMessages = $messageModel->countAllResults();
        $unreadMessages = $messageModel->where('is_read', 0)->countAllResults();

        $latestMessages = $messageModel->orderBy('created_at', 'DESC')->findAll(5);

        return $this->respond([
            'status' => 'success',
            'data'   => [
                'total_projects'    => $totalProjects,
                'featured_projects' => $featuredProjects,
                'total_messages'    => $totalMessages,
                'unread_messages'   => $unreadMessages,
                'latest_messages'   => $latestMessages,
            ],
        ]);
    }
}
