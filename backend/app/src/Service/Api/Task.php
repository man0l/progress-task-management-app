<?php

namespace App\Service\Api;

use App\Contracts\Api\Task as TaskContract;
use App\Dto\Task as TaskDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use App\Exceptions\ApiException;

class Task implements TaskContract {
    public function __construct(
        private HttpClientInterface $client
    ) {}

    public function getTasks(): array {
        $tasks = $this->client->request('GET', '/tasks')->toArray();

        return array_map(function (array $task) {
            return new TaskDto(
                title: $task['title'],
                description: $task['description'],
                completed: $task['completed']
            );
        }, $tasks);
    }

    public function getTask(string $id): TaskDto {
        $response = $this->client->request('GET', '/tasks/' . $id);

        if ($response->getStatusCode() === 200) {

            $data = $response->toArray();

            return new TaskDto(
                title: $data['title'],
                description: $data['description'],
                completed: $data['completed']
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

        $response = $this->client->request('PUT', '/tasks/' . $task->title, [
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

        $response = $this->client->request('DELETE', '/tasks/' . $task->title);

        if ($response->getStatusCode() !== 200) {
            throw new ApiException('Failed to delete task');
        }
    }
}