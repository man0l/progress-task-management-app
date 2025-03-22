<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use App\Security\User;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\UnencryptedToken;

class JWTExpirationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private TokenStorageInterface $tokenStorage,
        private UrlGeneratorInterface $urlGenerator,
        private RequestStack $requestStack
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::REQUEST => 'onKernelRequest'];
    }
    
    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $currentRoute = $request->getPathInfo();

        if (in_array($currentRoute, ['/login', '/logout'], true)) {
            return;
        }
        
        $token = $this->tokenStorage->getToken();
        if (null === $token) {
            return;
        }

        $user = $token->getUser();
        if (!$user instanceof User) {
            return;
        }
        
        $jwtToken = $user->getJwtToken();
        if (empty($jwtToken)) {
            return;
        }
        
        if ($this->isTokenExpired($jwtToken)) {
            $this->deauthenticateUser($request);
            
            $response = new RedirectResponse($this->urlGenerator->generate('app_login'));
            $event->setResponse($response);
        }
    }
    
    private function deauthenticateUser($request): void
    {
        $this->tokenStorage->setToken(null);
        
        $session = $this->requestStack->getSession();
        $session->invalidate();        
    }
    
    private function isTokenExpired(string $jwtToken): bool
    {

        $parser = new Parser(new JoseEncoder());
        $parsedToken = $parser->parse($jwtToken);
        
        if ($parsedToken instanceof UnencryptedToken) {
            $claims = $parsedToken->claims();
            
            if ($claims->has('exp')) {
                $expTime = $claims->get('exp');
                $now = new \DateTimeImmutable();
                
                if ($expTime instanceof \DateTimeInterface) {
                    $expTimestamp = $expTime->getTimestamp();
                } else {
                    $expTimestamp = (int) $expTime;
                }
                
                return $now->getTimestamp() > $expTimestamp;
            }
        }

        return true;
    }
}