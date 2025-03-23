<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use App\Dto\User as UserDto;
use Symfony\Component\Validator\Constraints\NotBlank;

class AssignType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {

        $builder
            ->add('assignee', ChoiceType::class, [
                'choices' => $this->transformUsers($options['data']['users']),
                'constraints' => [
                    new NotBlank(),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }

    /**
     * Transform the users
     * 
     * @param UserDto[] $users
     * @return array<string, int>
     */
    private function transformUsers(array $users): array
    {
        $choices = [];
        foreach ($users as $user) {
            $choices[$user->email] = $user->id;
        }
        return $choices;
    }
}
