<?php

namespace App\Controller;

use App\Contracts\Api\TaskInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TasksController extends AbstractController
{    
    #[Route('/tasks', name: 'app_tasks')]
    public function index(TaskInterface $taskApi): Response
    {        
        $tasks = $taskApi->getTasks();
            
        return $this->render('tasks/index.html.twig', [
            'controller_name' => 'TasksController',
            'tasks' => $tasks
        ]);
    }
}
