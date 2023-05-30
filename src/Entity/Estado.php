<?php

/**
 * src/Entity/Estado.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Entity;

/**
 * @Enum({ "active", "inactive", "unauthorized" })
 */
enum Estado: string{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case UNAUTHORIZED = 'unauthorized';

    public const ALL_VALUES = [ 'reader', 'writer', 'unauthorized' ];
}