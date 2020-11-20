<?php

namespace ArloSeed\Utils;

class AcfPluginBundle
{

    public function init()
    {
        $this->check_acf();
    }

    public function check_acf()
    {
        if(in_array('advanced-custom-fields-pro/acf.php', apply_filters('active_plugins', get_option('active_plugins')))){ 
            return;
        }

        if(in_array('advanced-custom-fields-pro/acf.php', apply_filters('active_plugins', get_option('active_plugins')))){ 
            return;
        }

        if (!class_exists('acf')) {
            $this->insert_plugin();
        } else {
            return;
        }
    }

    public function insert_plugin()
    {
        add_filter('acf/settings/url', [$this, 'acf_settings_url']);
        add_filter('acf/settings/show_admin', [$this, 'acf_settings_show_admin']);
        include_once( get_stylesheet_directory() . '/resources/advanced-custom-fields/acf.php' );
    }

    public function acf_settings_url($url) 
    {
        $url = get_stylesheet_directory_uri() . '/resources/advanced-custom-fields/';
        return $url;
    }

    function acf_settings_show_admin( $show_admin ) {
       return true;
    }
}