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
 * Class wptmViewStyle
 */
class WptmViewStyle extends View
{
    /**
     * Render style
     *
     * @param null $tpl Tpl
     *
     * @return void
     */
    public function render($tpl = null)
    {
        $id       = Utilities::getInt('id');
        $id_table = Utilities::getInt('id-table');

        $model = $this->getModel('style');
        $item  = $model->getItem($id);

        require_once plugin_dir_path(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'tables.php';
        $newData = WptmTablesHelper::changeThemeToTable($item);

        $newData['action'] = 'insert';

        $model = $this->getModel('table');
        $model->deleteOldStyle($id_table);

        //add table header = 1
        $newData['params']->headerOption = 1;
        $newData['params']->header_data = array($newData['datas'][0]);

        if ($model->saveTableSynfile($id_table, $newData)) {
            $dataTable = $model->getItem($id_table);
            $dataTable->style = json_encode($dataTable->style);
            switch ($id) {
                case 1:
                    $dataTable->update_type_columns = array('text','text','text','text','text');
                    break;
                case 2:
                    $dataTable->update_type_columns = array('text','text','text','text','text');
                    break;
                case 3:
                    $dataTable->update_type_columns = array('int','varchar','varchar','int','varchar');
                    break;
                case 4:
                    $dataTable->update_type_columns = array('text','text','text');
                    break;
                case 5:
                    $dataTable->update_type_columns = array('varchar','varchar','varchar','varchar','varchar','varchar','varchar');
                    break;
                case 6:
                    $dataTable->update_type_columns = array('text','text','text','text');
                    break;
            }
        } else {
            $dataTable = array('status'=>false);
        }
        header('Content-Type: application/json; charset=utf-8', true);
        echo json_encode($dataTable);
        die();
    }
}
