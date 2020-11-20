<?php
/**
 * Plugin Name: WP Table Manager
 * Plugin URI: http://www.joomunited.com/wordpress-products/wp-table-manager
 * Description: WP Table Manager, a new way to manage tables in WordPress
 * Author: Joomunited
 * Version: 2.7.2
 * Tested up to: 5.5.1
 * Text Domain: wptm
 * Domain Path: /app/languages
 * Author URI: http://www.joomunited.com
 */

//Check plugin requirements
if (version_compare(PHP_VERSION, '5.6', '<')) {
    if (!function_exists('wptm_disable_plugin')) {
        /**
         * Function disable plugin
         *
         * @return void
         */
        function wptm_disable_plugin()
        {
            if (current_user_can('activate_plugins') && is_plugin_active(plugin_basename(__FILE__))) {
                deactivate_plugins(__FILE__);
                //phpcs:ignore WordPress.Security.NonceVerification.Recommended -- unset active status plugin
                unset($_GET['activate']);
            }
        }
    }

    if (!function_exists('wptm_show_error')) {
        /**
         * Function show error
         *
         * @return void
         */
        function wptm_show_error()
        {
            echo '<div class="error"><p><strong>WP Table Manager</strong> need at least PHP 5.6 version, please update php before installing the plugin.</p></div>';
        }
    }

    //Add actions
    add_action('admin_init', 'wptm_disable_plugin');
    add_action('admin_notices', 'wptm_show_error');

    //Do not load anything more
    return;
}

//Include the jutranslation helpers
include_once('jutranslation' . DIRECTORY_SEPARATOR . 'jutranslation.php');
\Joomunited\WPTableManager\Jutranslation\Jutranslation::init(__FILE__, 'wptm', 'WP Table Manager', 'wptm', 'app' . DIRECTORY_SEPARATOR . 'languages' . DIRECTORY_SEPARATOR . 'wptm-en_US.mo');

include_once('framework' . DIRECTORY_SEPARATOR . 'ju-libraries.php');

// Prohibit direct script loading
defined('ABSPATH') || die('No direct script access allowed!');
if (!defined('WPTM_PLUGIN_FILE')) {
    define('WPTM_PLUGIN_FILE', __FILE__);
}
if (!defined('WPTM_PLUGIN_DIR')) {
    define('WPTM_PLUGIN_DIR', plugin_dir_path(__FILE__));
}
define('WP_TABLE_MANAGER_PLUGIN_URL', plugin_dir_url(__FILE__));
if (!defined('WPTM_VERSION')) {
    define('WPTM_VERSION', '2.7.2');
}

include_once('app' . DIRECTORY_SEPARATOR . 'install.php');
include_once('app' . DIRECTORY_SEPARATOR . 'autoload.php');

use Joomunited\WPFramework\v1_0_5\Application;

//Initialise the application
$app = Application::getInstance('Wptm', __FILE__);
$app->init();

if (is_admin()) {
    add_filter('mce_external_plugins', 'wptm_mce_external_plugins2');
    if (!function_exists('wptm_mce_external_plugins2')) {
        /**
         * Function wptm_mce_external_plugins2
         *
         * @param array $plugins Plugins
         *
         * @return mixed
         */
        function wptm_mce_external_plugins2($plugins)
        {
            $plugins['wpedittable'] = WP_TABLE_MANAGER_PLUGIN_URL . 'app/admin/assets/plugins/wpedittable/plugin.js';
            return $plugins;
        }
    }

    if (!defined('JU_BASE')) {
        define('JU_BASE', 'https://www.joomunited.com/');
    }

    $remote_updateinfo = JU_BASE . 'juupdater_files/wp-table-manager.json';
    //end config

    require 'juupdater/juupdater.php';
    $UpdateChecker = Jufactory::buildUpdateChecker(
        $remote_updateinfo,
        __FILE__
    );
}
