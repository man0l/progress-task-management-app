<?php

namespace App\Service\Api;

use App\Dto\User as UserDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;
use App\Contracts\Api\UserInterface;
use App\Exceptions\ApiException;

class User implements UserInterface {
    public function __construct(
        private HttpClientInterface $client
    ) {}

    public function getUsers(): array {
        try {
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
        } catch (\Exception $e) {
            throw new ApiException('Failed to get users: ' . $e->getMessage());
        }
    }

    public function getUser(int $id): UserDto {
        try {
            $response = $this->client->request('GET', '/users/' . $id);
            $data = $response->toArray();

            if ($response->getStatusCode() !== 200) {
                throw new ApiException($data['msg'] ?? 'Failed to get user');
            }

            if (!isset($data['id']) || !isset($data['email'])) {
                throw new ApiException('Invalid user data received from API');
            }

            return new UserDto(
                id: $data['id'],
                email: $data['email']
            );
        } catch (\Exception $e) {
            throw new ApiException('Failed to get user: ' . $e->getMessage());
        }
    }

    public function createUser(UserDto $user): UserDto {
        try {
            $response = $this->client->request('POST', '/users', [
                'json' => [
                    'email' => $user->email,
                    'password' => $user->password
                ]
            ]);

            $data = $response->toArray();

            if ($response->getStatusCode() !== 200) {
                throw new ApiException($data['msg'] ?? 'Failed to create user');
            }

            return new UserDto(
                id: $data['id'],
                email: $data['email']
            );
        } catch (\Exception $e) {
            throw new ApiException('Failed to create user: ' . $e->getMessage());
        }
    }

    public function updateUser(UserDto $user): UserDto {
        try {
            $response = $this->client->request('PUT', '/users/' . $user->id, [
                'json' => [
                    'email' => $user->email
                ]
            ]);

            $data = $response->toArray();

            if ($response->getStatusCode() !== 200) {
                throw new ApiException($data['msg'] ?? 'Failed to update user');
            }

            return new UserDto(
                id: $data['id'],
                email: $data['email']
            );
        } catch (\Exception $e) {
            throw new ApiException('Failed to update user: ' . $e->getMessage());
        }
    }

    public function deleteUser(UserDto $user): void {
        try {
            $response = $this->client->request('DELETE', '/users/' . $user->id);

            if ($response->getStatusCode() !== 200) {
                $data = $response->toArray();
                throw new ApiException($data['msg'] ?? 'Failed to delete user');
            }
        } catch (\Exception $e) {
            throw new ApiException('Failed to delete user: ' . $e->getMessage());
        }
    }
}