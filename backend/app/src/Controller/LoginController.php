<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Form\LoginType;
use App\Service\Api\Login;

final class LoginController extends AbstractController
{
    #[Route('/', name: 'app_default')]
    public function default(): Response
    {
        return $this->redirectToRoute('app_login');
    }

    #[Route('/login', name: 'app_login')]    
    public function index(Request $request, Login $login): Response
    {
        $form = $this->createForm(LoginType::class, null, [
            'csrf_protection' => true,
            'csrf_field_name' => '_token',
            'csrf_token_id' => 'authenticate',
            'mapped' => false,
        ]);
        
        return $this->render('login/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \Exception('Implement logout method');
    }
}
