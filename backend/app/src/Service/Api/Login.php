<?php

namespace App\Service\Api;

use App\Contracts\Api\Login as LoginContract;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use App\Exceptions\ApiException;
class Login implements LoginContract {
    public function __construct(
        private HttpClientInterface $client
    ) {}

    public function login(string $email, string $password): string {
        $response = $this->client->request('POST', '/login', [
            'json' => ['email' => $email, 'password' => $password]
        ]);

        if ($response->getStatusCode() !== 200) {
            throw new ApiException('Failed to login');
        }

        return $response->getContent();
    }
}
