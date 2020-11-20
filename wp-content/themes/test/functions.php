<?php

namespace ArloSeed;

require_once __DIR__ . '/vendor/autoload.php';

if (!defined('WP_ENV')) {
    define('WP_ENV', 'production');
}

$init_theme = new Init();
$init_theme->init_theme();





