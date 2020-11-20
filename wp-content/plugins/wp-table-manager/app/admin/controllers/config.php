<?php
/**
 * WP Table Manager
 *
 * @package WP Table Manager
 * @author  Joomunited
 * @version 1.0
 */

use Joomunited\WPFramework\v1_0_5\Controller;
use Joomunited\WPFramework\v1_0_5\Form;
use Joomunited\WPFramework\v1_0_5\Utilities;

defined('ABSPATH') || die();

/**
 * Class WptmControllerConfig
 */
class WptmControllerConfig extends Controller
{
    /**
     * Save config
     *
     * @return void
     */
    public function saveconfig()
    {
        $model = $this->getModel();

        $form = new Form();
        if (!$form->load('config')) {
            $this->exitStatus(__('error while saving setting', 'wptm'));
        }
        if (!$form->validate()) {
            $this->exitStatus(__('error while saving setting', 'wptm'));
        }
        if (isset($_POST['option_nonce']) && wp_verify_nonce(sanitize_key($_POST['option_nonce']), 'option_nonce')) {
            $datas = $form->sanitize();
            //get additional var
            if (isset($_POST['enable_hightlight'])) {
                $datas['enable_hightlight'] = $_POST['enable_hightlight'];
            }
            if (isset($_POST['tree_hightlight_color'])) {
                $datas['tree_hightlight_color'] = $_POST['tree_hightlight_color'];
            }
            if (isset($_POST['tree_hightlight_font_color'])) {
                $datas['tree_hightlight_font_color'] = $_POST['tree_hightlight_font_color'];
            }
            if (isset($_POST['hightlight_opacity'])) {
                $datas['hightlight_opacity'] = $_POST['hightlight_opacity'];
            }

            $model->save($datas);
            $this->exitStatus(true);
        }
        $this->exitStatus(__('error while saving setting', 'wptm'));
    }

    /**
     * Save role user
     *
     * @return void
     */
    public function save()
    {
        if (!isset($_POST['wptm_role_nonce']) || !check_admin_referer('wptm_role_settings', 'wptm_role_nonce') || !current_user_can('manage_options')) {
            return;
        }

        if (!isset($wp_roles)) {
            $wp_roles = new WP_Roles();
        }

        $roles       = $wp_roles->role_objects;

        if (!empty($roles)) {
            $post_type_caps =  array(
                'wptm_create_category',
                'wptm_edit_category',
                'wptm_edit_own_category',
                'wptm_delete_category',
                'wptm_create_tables',
                'wptm_edit_tables',
                'wptm_edit_own_tables',
                'wptm_delete_tables',
                'wptm_access_category',
                'wptm_access_database_table'
            );
            foreach ($roles as $user_role => $role) {
                $user_role_caps = Utilities::getInput($user_role, 'POST', 'none');
                $role_i = get_role($user_role);
                foreach ($post_type_caps as $post_cap) {
                    if (isset($user_role_caps[$post_cap]) && $user_role_caps[$post_cap] === 'on') {
                        $role_i->add_cap($post_cap);
                    } else {
                        $role_i->remove_cap($post_cap);
                    }
                }
            }
        }
        $this->redirect('admin.php?page=wptm-config');
        wp_die();
    }
}
