<?php

namespace App\Service\Api;

use App\Contracts\Api\LoginInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class Login implements LoginInterface {
    public function __construct(
        private HttpClientInterface $api
    ) {}

    public function login(string $email, string $password): array {
        
        $response = $this->api->request('POST', '/login', [
            'json' => ['email' => $email, 'password' => $password]
        ]);        

        $result = $response->getContent(false);
        $result = json_decode($result);

        if ($response->getStatusCode() !== 200) {
            return [
                'success' => false,
                'message' => isset($result->msg) ? $result->msg : 'Login failed',
                'access_token' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Login successful',
            'access_token' => $result->access_token
        ];
    }
}
