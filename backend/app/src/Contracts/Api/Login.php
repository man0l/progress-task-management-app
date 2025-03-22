<?php

namespace App\Contracts\Api;

use Symfony\Contracts\HttpClient\HttpClientInterface;

interface Login {
    /**
     * @param HttpClientInterface $client
     */
    public function __construct(HttpClientInterface $client);
    /**
     * @param string $email
     * @param string $password
     * @return string The JWT token itself
     */
    public function login(string $email, string $password): string;
}