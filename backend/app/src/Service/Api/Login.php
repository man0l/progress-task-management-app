<?php

namespace App\Service\Api;

use App\Contracts\Api\Login as LoginContract;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use App\Exceptions\ApiException;
class Login implements LoginContract {
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
                'message' => $result->msg,
                'token' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Login successful',
            'token' => $result->access_token
        ];
    }
}
