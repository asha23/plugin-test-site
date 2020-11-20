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
use Joomunited\WPFramework\v1_0_5\Factory;

defined('ABSPATH') || die();

/**
 * Class WptmControllerDbtable
 */
class WptmControllerDbtable extends Controller
{
    /**
     * Check role user for table
     *
     * @param string|integer $id    Id of table
     * @param string         $check Var check function get checkRoleTable
     *
     * @return integer
     */
    private function checkRoleTable($id, $check)
    {
        global $wpdb;
        $wptm_delete_tables = current_user_can('wptm_delete_tables');
        $wptm_create_tables = current_user_can('wptm_create_tables');
        $wptm_edit_tables = current_user_can('wptm_edit_tables');
        $wptm_edit_own_tables = current_user_can('wptm_edit_own_tables');
        if ($check === 'delete' && !empty($wptm_delete_tables)) {
            return 1;
        } elseif ($check === 'new' && !empty($wptm_create_tables)) {
            return 1;
        } elseif ($check === 'save' && !empty($wptm_edit_tables)) {
            return 1;
        } elseif ($check === 'save' && !empty($wptm_edit_own_tables)) {
            $idUser = (string) get_current_user_id();
            $model  = $this->getModel();
            $data   = $model->getTableData(
                'SELECT t.author FROM ' . $wpdb->prefix . 'wptm_tables AS t  WHERE t.id = ' . $id
            );
            if ($data === false) {
                return 0;
            }
            $data = (int) $data[0]['author'] === (int) $idUser ? 1 : 0;
            return $data;
        } else {
            return 0;
        }
    }

    /**
     * Function change Tables
     *
     * @return void
     */
    public function changeTables()
    {
        $tables  = Utilities::getInput('tables', 'POST', 'none');
        $model   = $this->getModel();
        $columns = $model->listMySQLColumns($tables);

        $this->exitStatus(true, array('columns' => $columns));
    }

    /**
     * Function generateQueryAndPreviewdata
     *
     * @return void
     */
    public function generateQueryAndPreviewdata()
    {
        $table_data = Utilities::getInput('table_data', 'POST', 'none');
        $model      = $this->getModel();
        $result     = $model->generateQueryAndPreviewdata($table_data);

        $this->exitStatus(true, $result);
    }

    /**
     * Function create new table for selected mysql tables
     *
     * @return void
     */
    public function createTable()
    {
        $check_role  = $this->checkRoleTable('', 'new');
        if ($check_role === 0) {
            $this->exitStatus(__('error while adding table', 'wptm'));
        }
        $table_data = Utilities::getInput('table_data', 'POST', 'none');
        $id_cat     = Utilities::getInt('id_cat', 'POST', 'none');

        $model      = $this->getModel();
        $result     = $model->createTable($table_data, $id_cat);

        $this->exitStatus(true, $result);
    }

    /**
     * Function update table with new change
     *
     * @return void
     */
    public function updateTable()
    {
        $table_data          = Utilities::getInput('table_data', 'POST', 'none');
        $id_table            = (int) $table_data['id_table'];
        $check_role  = $this->checkRoleTable($id_table, 'save');
        if ($check_role === 0) {
            $this->exitStatus(__('error while adding table', 'wptm'));
        }
        $model               = $this->getModel();

        $result = $model->updateTable($id_table, $table_data);

        $this->exitStatus(true, $result);
    }
}
