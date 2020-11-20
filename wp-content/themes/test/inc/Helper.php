<?php

namespace ArloSeed;

class Helper
{
    public function get_field_partial($partial)
    {
        $partial = str_replace('.', '/', $partial);
        return include(get_stylesheet_directory_uri() . "/inc/Fields/{$partial}.php");
    }
}