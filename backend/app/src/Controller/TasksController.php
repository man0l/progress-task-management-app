<?php

namespace App\Controller;

use App\Contracts\Api\TaskInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Form\TaskType;
use Symfony\Component\HttpFoundation\Request;
use App\Dto\Task;
use App\Form\AssignType;
use App\Contracts\Api\UserInterface;

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
                    id: 0,
                    user_id: null,
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

    #[Route('/tasks/edit/{id}', name: 'app_tasks_edit', methods: ['GET'])]
    public function edit(TaskInterface $taskApi, Request $request, int $id): Response
    {
        $task = $taskApi->getTask($id);
        
        $formData = [
            'title' => $task->title,
            'description' => $task->description,
            'completed' => $task->completed,
        ];
        
        $form = $this->createForm(TaskType::class, $formData, [
            'action' => $this->generateUrl('app_tasks_edit_post', ['id' => $id]),
            'method' => 'POST',
        ]);

        return $this->render('tasks/add.html.twig', [
            'form' => $form->createView(),
            'task' => $task,
        ]);
    }

    #[Route('/tasks/edit/{id}', name: 'app_tasks_edit_post', methods: ['POST'])]
    public function editPost(TaskInterface $taskApi, Request $request, int $id): Response
    {
        $task = $taskApi->getTask($id);
        
        $form = $this->createForm(TaskType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $formData = $form->getData();
                
                $updatedTask = new Task(
                    id: $task->id,
                    user_id: $task->user_id ?? null,
                    user: $task->user ?? null,
                    title: $formData['title'],
                    description: $formData['description'],
                    completed: $formData['completed'] ?? false,
                    created_at: $task->created_at,
                    updated_at: (new \DateTime())->format('c')
                );
                
                $taskApi->updateTask($updatedTask);
                
                $this->addFlash('success', 'Task updated successfully!');
                return $this->redirectToRoute('app_tasks');
            } catch (\Exception $e) {
                $this->addFlash('error', 'Failed to update task: ' . $e->getMessage());
            }
        } else if ($form->isSubmitted()) {
            $this->addFlash('error', 'Please correct the errors in the form');
        }

        return $this->render('tasks/add.html.twig', [
            'form' => $form->createView(),
            'task' => $task,
        ]);
    }

    #[Route('/tasks/delete/{id}', name: 'app_tasks_delete', methods: ['DELETE'])]
    public function delete(TaskInterface $taskApi, Request $request, int $id): Response
    {
        $task = $taskApi->getTask($id);
        $taskApi->deleteTask($task);

        return $this->json(['message' => 'Task deleted successfully']);
    }

    #[Route('/tasks/assign/{id}', name: 'app_tasks_assign', methods: ['GET'])]
    public function assign(TaskInterface $taskApi, UserInterface $userApi, int $id): Response
    {
        $task = $taskApi->getTask($id);
        $users = $userApi->getUsers();
        
        $form = $this->createForm(AssignType::class, ['users' => $users], [
            'action' => $this->generateUrl('app_tasks_assign_post', ['id' => $id]),
            'method' => 'POST',
        ]);

        return $this->render('tasks/assign.html.twig', [
            'task' => $task,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/tasks/assign/{id}', name: 'app_tasks_assign_post', methods: ['POST'])]
    public function assignPost(TaskInterface $taskApi, UserInterface $userApi, Request $request, int $id): Response
    {
        $task = $taskApi->getTask($id);
        $users = $userApi->getUsers();

        $form = $this->createForm(AssignType::class, ['users' => $users]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $formData = $form->getData();
                $taskApi->assignTask($task, $formData['assignee']);
                $this->addFlash('success', 'Task assigned successfully!');
            } catch (\Exception $e) {
                $this->addFlash('error', 'Failed to assign task: ' . $e->getMessage());
            }
        } else if ($form->isSubmitted()) {
            $this->addFlash('error', 'Please correct the errors in the form');
            return $this->render('tasks/assign.html.twig', [
                'task' => $task,
                'form' => $form->createView(),
            ]);
        }

        return $this->redirectToRoute('app_tasks');
    }

    #[Route('/tasks/complete/{id}', name: 'app_tasks_complete', methods: ['POST'])]
    public function complete(TaskInterface $taskApi, Request $request, int $id): Response
    {
        $data = json_decode($request->getContent(), true);
        $completed = $data['completed'] ?? false;
        
        $task = $taskApi->getTask($id);
        $task->completed = $completed;
        $taskApi->updateTask($task);

        return $this->json(['message' => 'Task status updated successfully']);
    }
}
