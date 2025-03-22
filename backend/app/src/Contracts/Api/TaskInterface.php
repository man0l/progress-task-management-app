<?php

namespace App\Contracts\Api;

use App\Dto\Task as TaskDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;
interface TaskInterface {
    /**
     * @param string $token
     */
    public function __construct(HttpClientInterface $client, LoggerInterface $logger);
    /**
     * @return TaskDto[]
     */
    public function getTasks(): array;
    /**
     * @param string $id
     * @return TaskDto
     */
    public function getTask(string $id): TaskDto;
    /**
     * @param TaskDto $task
     * @return TaskDto
     */
    public function createTask(TaskDto $task): TaskDto;
    /**
     * @param TaskDto $task
     * @return TaskDto
     */
    public function updateTask(TaskDto $task): TaskDto;
    /**
     * @param TaskDto $task
     * @return void
     */
    public function deleteTask(TaskDto $task): void;
}