<?php

namespace App\Controller;

use App\Contracts\Api\TaskInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Form\TaskType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use App\Dto\Task;

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

    #[Route('/tasks/add', name: 'app_tasks_add', methods: ['GET'])]
    public function add(): Response
    {
        $form = $this->createForm(TaskType::class, null, [
            'action' => $this->generateUrl('app_tasks_add_post'),
            'method' => 'POST',
        ]);

        return $this->render('tasks/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/tasks/add', name: 'app_tasks_add_post', methods: ['POST'])]
    public function addPost(TaskInterface $taskApi, Request $request): Response
    {
        $form = $this->createForm(TaskType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $formData = $form->getData();
                
                $currentTime = (new \DateTime())->format('c');
                
                $taskDto = new Task(
                    title: $formData['title'],
                    description: $formData['description'],
                    completed: $formData['completed'] ?? false,
                    created_at: $currentTime,
                    updated_at: $currentTime
                );
                
                $taskApi->createTask($taskDto);
                
                $this->addFlash('success', 'Task created successfully!');
                return $this->redirectToRoute('app_tasks');
            } catch (\Exception $e) {
                $this->addFlash('error', 'Failed to create task: ' . $e->getMessage());
            }
        } else if ($form->isSubmitted()) {
            $this->addFlash('error', 'Please correct the errors in the form');
        }

        return $this->render('tasks/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }    
}
