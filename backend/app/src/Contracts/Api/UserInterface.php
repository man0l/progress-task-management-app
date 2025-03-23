<?php

namespace App\Contracts\Api;

use App\Dto\User as UserDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;

interface UserInterface {
    /**
     * @param string $token
     */
    public function __construct(HttpClientInterface $client);
    /**
     * @return UserDto[]
     */
    public function getUsers(): array;
}