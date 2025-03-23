<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Contracts\Api\TaskInterface;

final class DashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(TaskInterface $taskApi): Response
    {
        $tasks = $taskApi->getTasks();
        $completedTasks = array_filter($tasks, function($task) {
            return $task->completed;
        });
        $pendingTasks = array_filter($tasks, function($task) {
            return !$task->completed;
        });

        return $this->render('dashboard/index.html.twig', [
            'controller_name' => 'DashboardController',
            'completedTasks' => count($completedTasks),
            'pendingTasks' => count($pendingTasks)
        ]);
    }
}
