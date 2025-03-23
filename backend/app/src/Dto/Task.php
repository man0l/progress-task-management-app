<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class Task {
    public function __construct(
        #[Assert\NotBlank]
        public int $id,
        public ?int $user_id = null,
        public ?string $user = null,
        #[Assert\NotBlank]
        #[Assert\Length(min: 3, max: 255)]
        public string $title,
        #[Assert\NotBlank]
        #[Assert\Length(min: 3, max: 255)]
        public string $description,
        #[Assert\NotBlank]
        public bool $completed,
        #[Assert\NotBlank]
        public string $created_at,
        #[Assert\NotBlank]
        public string $updated_at
    ) {}
}