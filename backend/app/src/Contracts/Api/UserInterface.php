<?php

namespace App\Contracts\Api;

use App\Dto\User as UserDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;

interface UserInterface {
    /**
     * @param HttpClientInterface $client
     */
    public function __construct(HttpClientInterface $client);

    /**
     * @return UserDto[]
     */
    public function getUsers(): array;

    /**
     * @param int $id
     * @return UserDto
     */
    public function getUser(int $id): UserDto;

    /**
     * @param UserDto $user
     * @return UserDto
     */
    public function createUser(UserDto $user): UserDto;

    /**
     * @param UserDto $user
     * @return UserDto
     */
    public function updateUser(UserDto $user): UserDto;

    /**
     * @param UserDto $user
     * @return void
     */
    public function deleteUser(UserDto $user): void;
}