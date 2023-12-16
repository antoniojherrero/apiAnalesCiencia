<?php

/**
 * src/Entity/User.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use InvalidArgumentException;
use JetBrains\PhpStorm\ArrayShape;
use JsonSerializable;
use Stringable;
use ValueError;

#[ORM\Entity, ORM\Table(name: "user")]
#[ORM\UniqueConstraint(name: "IDX_UNIQ_USERNAME", columns: [ "username" ])]
#[ORM\UniqueConstraint(name: "IDX_UNIQ_EMAIL", columns: [ "email" ])]
class User implements JsonSerializable, Stringable
{
    #[ORM\Column(
        name: "id",
        type: "integer",
        nullable: false
    )]
    #[ORM\Id(), ORM\GeneratedValue(strategy: "IDENTITY")]
    protected int $id;

    #[ORM\Column(
        name: "username",
        type: "string",
        length: 32,
        unique: true,
        nullable: false
    )]
    protected string $username;

    #[ORM\Column(
        name: "name",
        type: "string",
        length: 32,
        nullable: false
    )]
    protected string $name;

    #[ORM\Column(
        name: "birthdate",
        type: "datetime",
        nullable: true
    )]
    protected DateTime | null $birthDate = null;

    #[ORM\Column(
        name: "email",
        type: "string",
        length: 60,
        unique: true,
        nullable: false
    )]
    protected string $email;

    #[ORM\Column(
        name: "password",
        type: "string",
        length: 60,
        nullable: false
    )]
    protected string $password_hash;

    #[ORM\Column(
        name: "role",
        type: "string",
        length: 10,
        nullable: false,
        enumType: Role::class
    )]
    protected Role $role;

    #[ORM\Column(
        name: "estado",
        type: "string",
        length: 15,
        nullable: false,
        enumType: Estado::class
    )]
    protected Estado $estado;
    /**
     * User constructor.
     *
     * @param string $username username
     * @param string $name name
     * @param DateTime|null $birthDate birthDate
     * @param string $email email
     * @param string $password password
     * @param Role|string $role Role::*
     * @param Estado|string $estado Estado::*
     * @throws InvalidArgumentException
     */
    public function __construct(
        string $username = '',
        string $name = '',
        ?DateTime $birthDate = null,
        string $email = '',
        string $password = '',
        Role|string $role = Role::READER,
        Estado|string $estado = Estado::UNAUTHORIZED
    ) {
        $this->id       = 0;
        $this->username = $username;
        $this->name     = $name;
        $this->birthDate= $birthDate;
        $this->email    = $email;
        $this->setPassword($password);
        $this->setRole($role);
        $this->estado=$estado;
    }

    /**
     * @return int User id
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * Set username
     *
     * @param string $username username
     * @return void
     */
    public function setUsername(string $username): void
    {
        $this->username = $username;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return DateTime|null
     */
    public function getBirthDate(): ?DateTime
    {
        return $this->birthDate;
    }

    /**
     * @param DateTime|null $birthDate
     */
    public function setBirthDate(?DateTime $birthDate): void
    {
        $this->birthDate = $birthDate;
    }

    /**
     * Get user e-mail
     *
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Set user e-mail
     *
     * @param string $email email
     * @return void
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    /**
     * @param Role|string $role
     * @return bool
     */
    public function hasRole(Role|string $role): bool
    {
        if (!$role instanceof Role) {
            $role = Role::from($role);
        }
        return match ($role) {
            Role::READER => true,
            Role::WRITER => ($this->role === Role::WRITER),
            default => false
        };
    }

    /**
     * @param Role|string $newRole [ Role::READER | Role::WRITER | 'reader' | 'writer' ]
     * @return void
     * @throws InvalidArgumentException
     */
    public function setRole(Role|string $newRole): void
    {
        try {
            $this->role = ($newRole instanceof Role)
                ? $newRole
                : Role::from(strtolower($newRole));
        } catch (ValueError) {
            throw new InvalidArgumentException('Invalid Role');
        }
    }

    /**
     * @return Role[] [ READER ] | [ READER , WRITER ]
     */
    public function getRoles(): array
    {
        $roles = array_filter(
            Role::cases(),
            fn($myRole) => $this->hasRole($myRole)
        );

        return $roles;
    }

    /**
     * Get the hashed password
     *
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password_hash;
    }

    /**
     * @param string $password password
     * @return void
     */
    public function setPassword(string $password): void
    {
        $this->password_hash = strval(password_hash($password, PASSWORD_DEFAULT));
    }

    /**
     * Verifies that the given hash matches the user password.
     *
     * @param string $password password
     * @return boolean
     */
    public function validatePassword(string $password): bool
    {
        return password_verify($password, $this->password_hash);
    }

    /**
     * @return Estado
     */
    public function getEstado(): Estado
    {
        return $this->estado;
    }

    /**
     * @param Estado|string $estado
     */
    public function setEstado(Estado|string $estado): void
    {
        try {
            $this->estado = ($estado instanceof Estado)
                ? $estado
                : Estado::from(strtolower($estado));
        } catch (ValueError) {
            throw new InvalidArgumentException('Invalid "Estado"');
        }
    }



    public function __toString(): string
    {
        return
            sprintf(
                '[%s: (id=%04d, username="%s", name="%s", birthDate="%s", email="%s", role="%s", estado="%s")]',
                basename(self::class),
                $this->getId(),
                $this->getUsername(),
                $this->getBirthDate()?->format('Y-m-d'),
                $this->getName(),
                $this->getEmail(),
                $this->role->name,
                $this->estado->value
            );
    }

    /**
     * @see JsonSerializable
     */
    #[ArrayShape(['user' => "array"])]
    public function jsonSerialize(): mixed
    {
        return [
            'user' => [
                'id' => $this->getId(),
                'username' => $this->getUsername(),
                'name' => $this->getName(),
                'birthDate' => $this->getBirthDate()?->format('Y-m-d'),
                'email' => $this->getEmail(),
                'password' => $this->getPassword(),
                'role' => $this->role->name,
                'estado' => $this->estado->value,
            ]
        ];
    }
}
