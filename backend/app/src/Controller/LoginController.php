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
        $form = $this->createForm(LoginType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            $response = $login->login($data['email'], $data['password']);
            
            if (!$response['success']) {
                $this->addFlash('error', $response['message']);
                return $this->redirectToRoute('app_login');
            }

            $this->addFlash('success', $response['message']);

            $request->getSession()->set('token', $response['token']);
            
            return $this->redirectToRoute('app_dashboard');
        } 

        return $this->render('login/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
