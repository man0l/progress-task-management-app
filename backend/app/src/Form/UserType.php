<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('email', EmailType::class, [
            'label' => 'Email',
            'constraints' => [
                new NotBlank(),
                new Email(),
            ],
        ]);

        // Only add password field for new users (when creating)
        if ($options['is_create']) {
            $builder->add('password', PasswordType::class, [
                'label' => 'Password',
                'constraints' => [
                    new NotBlank(),
                    new Length(['min' => 6]),
                ],
                'attr' => [
                    'placeholder' => 'Enter password'
                ]
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null,
            'allow_extra_fields' => true,
            'empty_data' => [],
            'error_bubbling' => false,
            'attr' => [
                'novalidate' => 'novalidate',
            ],
            'is_create' => false, // Default to update mode
        ]);
    }
}
