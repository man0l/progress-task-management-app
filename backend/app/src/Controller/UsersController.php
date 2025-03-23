<?php

namespace App\Controller;

use App\Service\Api\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Form\UserType;
use App\Dto\User as UserDto;
use Symfony\Component\HttpFoundation\Request;

final class UsersController extends AbstractController
{
    #[Route('/users', name: 'app_users')]
    public function index(User $user): Response
    {
        $users = $user->getUsers();
        return $this->render('users/index.html.twig', [
            'users' => $users,
        ]);
    }

    #[Route('/users/add', name: 'app_users_add', methods: ['GET'])]
    public function add(): Response
    {
        $form = $this->createForm(UserType::class, null, [
            'action' => $this->generateUrl('app_users_add_post'),
            'method' => 'POST',
            'is_create' => true,
        ]);
        return $this->render('users/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/users/add', name: 'app_users_add_post', methods: ['POST'])]
    public function addPost(Request $request, User $userApi): Response
    {
        $form = $this->createForm(UserType::class, null, [
            'is_create' => true,
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $formData = $form->getData();
                $user = new UserDto(
                    id: 0, // temporary ID, will be replaced by the API
                    email: $formData['email'],
                    password: $formData['password']
                );
                $userApi->createUser($user);
                $this->addFlash('success', 'User created successfully!');
                return $this->redirectToRoute('app_users');
            } catch (\Exception $e) {
                $this->addFlash('error', 'Failed to create user: ' . $e->getMessage());
            }
        } else if ($form->isSubmitted()) {
            $this->addFlash('error', 'Please correct the errors in the form');
        }

        return $this->render('users/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/users/edit/{id}', name: 'app_users_edit', methods: ['GET'])]
    public function edit(int $id, User $userApi): Response
    {        
        $user = $userApi->getUser($id);
        
        $formData = [
            'email' => $user->email
        ];
        
        $form = $this->createForm(UserType::class, $formData, [
            'action' => $this->generateUrl('app_users_edit_post', ['id' => $id]),
            'method' => 'POST',
            'is_create' => false,
        ]);

        return $this->render('users/add.html.twig', [
            'form' => $form->createView(),
            'user' => $user,
        ]);
    }

    #[Route('/users/edit/{id}', name: 'app_users_edit_post', methods: ['POST'])]
    public function editPost(int $id, Request $request, User $userApi): Response
    {
        $user = $userApi->getUser($id);
        
        $form = $this->createForm(UserType::class, null, [
            'is_create' => false,
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $formData = $form->getData();
                $updatedUser = new UserDto(
                    id: $user->id,
                    email: $formData['email']
                );
                
                $userApi->updateUser($updatedUser);
                
                $this->addFlash('success', 'User updated successfully!');
                return $this->redirectToRoute('app_users');
            } catch (\Exception $e) {
                $this->addFlash('error', 'Failed to update user: ' . $e->getMessage());
            }
        } else if ($form->isSubmitted()) {
            $this->addFlash('error', 'Please correct the errors in the form');
        }

        return $this->render('users/add.html.twig', [
            'form' => $form->createView(),
            'user' => $user,
        ]);
    }

    #[Route('/users/delete/{id}', name: 'app_users_delete', methods: ['DELETE'])]
    public function delete(int $id, User $userApi): Response
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $user = $userApi->getUser($id);

            if ($user->email === $this->getUser()->getUserIdentifier()) {
                return $this->json(['error' => 'Cannot delete your own account'], 400);
            }

            $userApi->deleteUser($user);
            return $this->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Failed to delete user: ' . $e->getMessage()], 400);
        }
    }
}