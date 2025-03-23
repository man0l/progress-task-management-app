<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class User {
    public function __construct(
        #[Assert\NotBlank]
        public int $id,
        #[Assert\NotBlank]
        #[Assert\Email]
        public string $email,
    ) {}
}