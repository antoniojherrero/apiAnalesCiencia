<?php

namespace TDW\ACiencia\Entity;

/**
 * @Enum({ "active", "inactive", "unauthorized" })
 */
enum Status: string{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case UNAUTHORIZED = 'unauthorized';

    public const ALL_VALUES = [ 'reader', 'writer', 'unauthorized' ];
}