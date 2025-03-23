<?php

namespace App\Service\Api;

use App\Dto\User as UserDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;
use App\Contracts\Api\UserInterface;

class User implements UserInterface {
    public function __construct(
        private HttpClientInterface $client,
    ) {}

    public function getUsers(): array {
        
        $response = $this->client->request('GET', '/users');
        
        $users = $response->toArray();
        
        if (empty($users['users']) || !is_array($users['users'])) {
            return [];
        }
        
        return array_map(function (array $user) {
            return new UserDto(
                id: $user['id'],
                email: $user['email']
            );
        }, $users['users']);
        
    }
}