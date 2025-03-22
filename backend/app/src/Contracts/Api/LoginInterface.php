<?php

namespace App\Contracts\Api;

use Symfony\Contracts\HttpClient\HttpClientInterface;

interface LoginInterface {
    /**
     * @param HttpClientInterface $client
     */
    public function __construct(HttpClientInterface $client);
    /**
     * @param string $email
     * @param string $password
     * @return array [success, message, token]
     */
    public function login(string $email, string $password): array;
}