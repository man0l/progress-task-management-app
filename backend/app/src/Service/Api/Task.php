<?php

namespace App\Service\Api;

use App\Contracts\Api\TaskInterface;
use App\Dto\Task as TaskDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use App\Exceptions\ApiException;
use Psr\Log\LoggerInterface;
class Task implements TaskInterface {
    public function __construct(
        private HttpClientInterface $client,
        private LoggerInterface $logger
    ) {}

    public function getTasks(): array {
        try {
            $response = $this->client->request('GET', '/tasks');
            $this->logger->info("Tasks API status code: " . $response->getStatusCode());
            
            $tasks = $response->toArray();
            $this->logger->info("Received " . count($tasks) . " tasks from API");
            // Check if tasks array is empty
            if (empty($tasks['tasks']) || !is_array($tasks['tasks'])) {
                $this->logger->info("No tasks found or invalid response format");
                return [];
            }
            
            return array_map(function (array $task) {
                return new TaskDto(
                    id: $task['id'],
                    title: $task['title'],
                    description: $task['description'],
                    completed: $task['completed'],                
                    created_at: $task['created_at'],
                    updated_at: $task['updated_at']
                );
            }, $tasks['tasks']);
        } catch (\Exception $e) {
            $this->logger->error("Error fetching tasks: " . $e->getMessage());
            throw $e;
        }
    }

    public function getTask(string $id): TaskDto {
        $response = $this->client->request('GET', '/tasks/' . $id);

        if ($response->getStatusCode() === 200) {

            $data = $response->toArray();

            return new TaskDto(
                id: $data['id'],
                title: $data['title'],
                description: $data['description'],
                completed: $data['completed'],
                created_at: $data['created_at'],
                updated_at: $data['updated_at']
            );
        }

        throw new ApiException('Failed to get task');
    }
    
    public function createTask(TaskDto $task): TaskDto {

        $response = $this->client->request('POST', '/tasks', [
            'json' => [
                'title' => $task->title,
                'description' => $task->description,
                'completed' => $task->completed
            ]
        ]);

        if ($response->getStatusCode() === 200) {
            return clone $task;
        }

        throw new ApiException('Failed to create task');
    }
    
    public function updateTask(TaskDto $task): TaskDto {

        $response = $this->client->request('PUT', '/tasks/' . $task->id, [
            'json' => [
                'title' => $task->title,
                'description' => $task->description,
                'completed' => $task->completed
            ]
        ]);

        if ($response->getStatusCode() === 200) {
            return clone $task;
        }
        
        throw new ApiException('Failed to update task');
    }
    
    public function deleteTask(TaskDto $task): void {

        $response = $this->client->request('DELETE', '/tasks/' . $task->id);

        if ($response->getStatusCode() !== 200) {
            throw new ApiException('Failed to delete task');
        }
    }
}