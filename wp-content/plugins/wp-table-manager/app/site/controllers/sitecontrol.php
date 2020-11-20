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
use Joomunited\WPFramework\v1_0_5\Model;
use Joomunited\WPFramework\v1_0_5\Application;

defined('ABSPATH') || die();

/**
 * Class WptmControllerExcel
 */
class WptmControllerSiteControl extends Controller
{
    /**
     * Function export file .xml in frontend
     *
     * @return void
     */
    public function export()
    {
        $app   = Application::getInstance('Wptm', __FILE__, 'admin');
        $id    = Utilities::getInt('id', 'GET');
        $model = Model::getInstance('table');
        $table = $model->getItem($id, true, true, null, false);

        if (isset($table) && isset($table->style) && is_string($table->style)) {
            $style = json_decode($table->style);
        } else {
            $style = $table->style;
        }

        if (isset($style) && isset($style->table->download_button) && $style->table->download_button) {
            require_once $app->getPath() . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR . 'controllers' . DIRECTORY_SEPARATOR . 'excel.php';
            $excel = new WptmControllerExcel();
            $excel->export($table);
        } else {
            $this->exitStatus(false, esc_attr__('File not found or You do not have permission to download the file.', 'wptm'));
        }
    }

    /**
     * Exit a request serving a json result
     *
     * @param string $status Exit status
     * @param array  $datas  Echoed datas
     *
     * @since 1.0.3
     *
     * @return void
     */
    protected function exitStatus($status = '', $datas = array())
    {
        $response = array('response' => $status, 'datas' => $datas);
        echo json_encode($response);
        die();
    }
}
