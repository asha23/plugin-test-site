<?php
/**
 * WP Table Manager
 *
 * @package WP Table Manager
 * @author  Joomunited
 * @version 1.0
 */

use Joomunited\WPFramework\v1_0_5\View;
use Joomunited\WPFramework\v1_0_5\Utilities;

defined('ABSPATH') || die();

/**
 * Class wptmViewTable
 */
class WptmViewTable extends View
{
    /**
     * Render
     *
     * @param null $tpl Tpl
     *
     * @return void
     */
    public function render($tpl = null)
    {
        $id    = Utilities::getInt('id');
        $model = $this->getModel('table');
        $item  = $model->getItem($id);
        $item->style = json_encode($item->style);
        echo json_encode($item);
        die();
    }
}
