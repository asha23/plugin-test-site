<?php
/**
 * WP Table Manager
 *
 * @package WP Table Manager
 * @author  Joomunited
 * @version 1.0
 */

use Joomunited\WPFramework\v1_0_5\Controller;
use Joomunited\WPFramework\v1_0_5\Utilities;

defined('ABSPATH') || die();

/**
 * Class WptmControllerCategory
 * Function create, copy, set title category
 */
class WptmControllerCategory extends Controller
{
    /**
     * Create category
     *
     * @return void
     */
    public function addCategory()
    {
        $wptm_create_category = current_user_can('wptm_create_category');
        if (!empty($wptm_create_category)) {
            $name    = Utilities::getInput('name', 'POST', 'string');
            $parent  = Utilities::getInt('parent', 'POST');
            $owner   = Utilities::getInt('owner', 'POST');
            $model = $this->getModel();
            $id    = $model->addCategory($name, $owner);
            if ($id) {
                $model = $this->getModel('categories');
                if ($model->move($id, $parent, 'first-child')) {
                    $this->exitStatus(true, array('id' => $id));
                }
            }
        }

        $this->exitStatus(__('error while adding category', 'wptm'));
    }

    /**
     * Copy category
     *
     * @return void
     */
    public function copy()
    {
        $wptm_create_category = current_user_can('wptm_create_category');
        if (!empty($wptm_create_category)) {
            $id      = Utilities::getInt('id');
            $model   = $this->getModel();
            $newItem = $model->copy($id);
            if ($newItem) {
                $table = $model->getItem($newItem);
                $this->exitStatus(true, array('id' => $table->id, 'title' => $table->title));
            }
        }
        $this->exitStatus(__('error while adding table', 'wptm'));
    }

    /**
     * Set title
     *
     * @return void
     */
    public function setTitle()
    {
        $id        = Utilities::getInt('id_category');
        $new_title = Utilities::getInput('title', 'GET', 'string');
        $model     = $this->getModel();
        $id        = $model->setTitle($id, $new_title);
        if ($id) {
            $this->exitStatus(true);
        }
        $this->exitStatus(__('An error occurred!', 'wptm'));
    }
}
