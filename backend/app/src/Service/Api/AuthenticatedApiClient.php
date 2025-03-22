<?php

namespace App\Service\Api;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Symfony\Contracts\HttpClient\ResponseStreamInterface;
use Symfony\Bundle\SecurityBundle\Security;
use App\Security\User;

class AuthenticatedApiClient implements HttpClientInterface
{
    private HttpClientInterface $apiClient;
    private Security $security;

    public function __construct(
        HttpClientInterface $api,
        Security $security,
        string $apiUrl
    ) {
        $this->apiClient = $api->withOptions([
            'base_uri' => $apiUrl,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]
        ]);
        $this->security = $security;
    }

    public function request(string $method, string $url, array $options = []): ResponseInterface
    {
        $options = $this->addAuthorizationHeader($options);
        return $this->apiClient->request($method, $url, $options);
    }

    public function stream($responses, ?float $timeout = null): ResponseStreamInterface
    {
        return $this->apiClient->stream($responses, $timeout);
    }

    public function withOptions(array $options): static
    {
        $clone = clone $this;
        $clone->apiClient = $this->apiClient->withOptions($options);
        return $clone;
    }

    private function addAuthorizationHeader(array $options): array
    {
        $user = $this->security->getUser();
        
        if ($user instanceof User && method_exists($user, 'getJwtToken') && $user->{'getJwtToken'}()) {

            $token = $user->{'getJwtToken'}();

            $options['headers'] = array_merge(
                $options['headers'] ?? [],
                ['Authorization' => 'Bearer ' . $token]
            );
        }
        
        return $options;
    }
} 