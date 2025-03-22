<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\CustomCredentials;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Contracts\Api\LoginInterface;
use App\Security\User;
use App\Form\LoginType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Session\FlashBagAwareSessionInterface;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Token;

class LoginAuthenticator extends AbstractLoginFormAuthenticator
{
    public function __construct(
        private UrlGeneratorInterface $urlGenerator,
        private LoginInterface $login,
        private FormFactoryInterface $formFactory,
    ) {}

    public function supports(Request $request): bool
    {        
        return $request->getPathInfo() === '/login' && $request->isMethod('POST');
    }

    public function getLoginUrl(Request $request): string
    {
        return $this->urlGenerator->generate('app_login');
    }

    public function authenticate(Request $request): Passport
    {
        $form = $this->formFactory->create(LoginType::class);
        $form->handleRequest($request);
        
        if (!$form->isSubmitted() || !$form->isValid()) {
            throw new AuthenticationException('Please fill in all fields');
        }

        $formData = $form->getData();
        $email = $formData['email'];
        $password = $formData['password'];

        $result = $this->login->login($email, $password);

        if (!$result['success']) {
            throw new AuthenticationException($result['message']);
        }
        
        $login = $request->request->all()['login'] ?? [];
        $token = is_array($login) && isset($login['_token']) ? $login['_token'] : null;
        
        if (!$token) {
            throw new AuthenticationException('Invalid CSRF token');
        }
        
        $passport = new Passport(
            new UserBadge($email, function($userIdentifier) use ($result) {
                $user = new User();
                $user->setEmail($userIdentifier);
                
                $jwtToken = $result['access_token'];
                $user->setJwtToken($jwtToken);               
                
                $parser = new Parser(new JoseEncoder());
                $parsedToken = $parser->parse($jwtToken);
                
                $roles = $this->getRolesFromToken($parsedToken);
                $user->setRoles($roles);
                
                return $user;
            }),  
            new CustomCredentials(
                function($credentials, UserInterface $user) {                    
                    return $user instanceof User && $user->getJwtToken() !== null;
                },
                $result['access_token']
            ),
            [
                new CsrfTokenBadge('authenticate', $token),
            ]
        );

        return $passport;
    }

    private function getRolesFromToken(Token $token): array
    {
        $roles = [];
        
        if ($token instanceof UnencryptedToken) {
            $claims = $token->claims();
            
            if ($claims->has('roles')) {
                $claimRoles = $claims->get('roles');
                if (is_array($claimRoles)) {
                    $roles = array_map([$this, 'mapPythonRoleToSymfony'], $claimRoles);
                } elseif (is_string($claimRoles)) {
                    $roles = [$this->mapPythonRoleToSymfony($claimRoles)];
                }
            }
        }
        
        if (empty($roles)) {
            $roles = ['ROLE_USER'];
        }
        
        return $roles;
    }
    
    private function mapPythonRoleToSymfony(string $role): string
    {
        return match ($role) {
            'admin' => 'ROLE_ADMIN',
            'user' => 'ROLE_USER',
            default => 'ROLE_USER',
        };
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return new RedirectResponse($this->urlGenerator->generate('app_dashboard'));
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        $session = $request->getSession();
        if ($session instanceof FlashBagAwareSessionInterface) 
        {
            $session->getFlashBag()->add('error', $exception->getMessage());
        }
        else
        {
            $session->set('error', $exception->getMessage());
        }
        
        return new RedirectResponse($this->urlGenerator->generate('app_login'));
    }
}