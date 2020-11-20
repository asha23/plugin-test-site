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
 * Class WptmControllerTable
 * function of table
 */
class WptmControllerTable extends Controller
{

    /**
     * Check role user for table
     *
     * @param string $id    Id of table|category
     * @param string $check Var check function get checkRoleTable
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
        $wptm_edit_category = current_user_can('wptm_edit_category');
        $wptm_edit_own_category = current_user_can('wptm_edit_own_category');
        $idUser = (string) get_current_user_id();

        if ($check === 'getListTable') {
            if ($wptm_edit_category) {
                return 1;
            }

            if (!$wptm_edit_own_category) {
                return 0;
            }

            $modelCategories = $this->getModel('categories');
            $category = $modelCategories->getCategories($id);
            $category_role = json_decode($category->params);
            $category_role = $category_role->role->{0};

            if ($category_role === (int) $idUser) {
                return 1;
            }
        } elseif ($check === 'delete' && !empty($wptm_delete_tables)) {
            return 1;
        } elseif ($check === 'new' && !empty($wptm_create_tables)) {
            return 1;
        } elseif ($check === 'save' && !empty($wptm_edit_tables)) {
            return 1;
        } elseif ($check === 'save' && !empty($wptm_edit_own_tables)) {
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
     * Save data table
     *
     * @return void
     */
    public function save()
    {
        $id_table   = Utilities::getInt('id', 'POST');
        $datas      = Utilities::getInput('jform', 'POST', 'none');
        $check_role = $this->checkRoleTable($id_table, 'save');
        if ($check_role === 0) {
            $this->exitStatus(__('error while saving table', 'wptm'));
        }
        $model = $this->getModel();
        if ($model->save((int) $id_table, $datas)) {
            $params = $model->getTableParams($id_table, '');
            $this->exitStatus(true, array('id' => $id_table, 'type' => array('update_params' => stripslashes_deep($params))));
        } else {
            $this->exitStatus(__('error while saving table', 'wptm'));
        }
    }

    /**
     * Create new table
     *
     * @return void
     */
    public function add()
    {
        $id_category = Utilities::getInt('id_category');
        $check_role  = $this->checkRoleTable((int) $id_category, 'new');
        if ($check_role === 0) {
            $this->exitStatus(__('error while adding table', 'wptm'));
        }
        $model = $this->getModel();
        $data    = $model->add($id_category);
        if ($data[0]) {
            $date = $this->convertDate(date('Y-m-d H:i:s'));
            $this->exitStatus(true, array('id' => $data[0], 'title' => __('New table', 'wptm'), 'position' => $data[1], 'modified_time' => $date, 'type' => 'html'));
        }
        $this->exitStatus(__('error while adding table', 'wptm'));
    }

    /**
     * Copy table
     *
     * @return void
     */
    public function copy()
    {
        $id         = Utilities::getInt('id');
        $check_role = $this->checkRoleTable((int) $id, 'new');
        if ($check_role === 0) {
            $this->exitStatus(__('error while coppy table', 'wptm'));
        }
        $model   = $this->getModel();
        $newItem = $model->copy($id);
        if ($newItem) {
            $table = $model->getItem($newItem);
            $table->author_name = get_userdata((int)$table->author)->user_nicename;
            $this->exitStatus(true, array('id' => $table->id, 'author_name' => $table->author_name,
                                          'title' => $table->title, 'author' => $table->author, 'type' => $table->type,
                                          'position' => $table->position, 'created_time' => $this->convertDate($table->created_time)));
        }
        $this->exitStatus(__('error while adding table', 'wptm'));
    }

    /**
     * Delete table
     *
     * @return void
     */
    public function delete()
    {
        if (isset($_POST['option_nonce']) && wp_verify_nonce(sanitize_key($_POST['option_nonce']), 'option_nonce')) {
            $id         = Utilities::getInput('id', 'POST', 'none');
            $check_role = $this->checkRoleTable((int) $id, 'delete');
            if ($check_role === 0) {
                $this->exitStatus(__('You don\'t have permission to delete table', 'wptm'));
            }
            $model  = $this->getModel();
            $result = $model->delete($id);
            if ($result) {
                $this->exitStatus(true);
            }
        }
        $this->exitStatus(__('An error occurred!', 'wptm'));
    }

    /**
     * Change title table
     *
     * @return void
     */
    public function setTitle()
    {
        $id         = Utilities::getInt('id');
        $check_role = $this->checkRoleTable((int) $id, 'save');
        if ($check_role === 0) {
            $this->exitStatus(__('You don\'t have permission to set title table', 'wptm'));
        }
        $new_title = Utilities::getInput('title', 'GET', 'string');
        $model     = $this->getModel();
        $result    = $model->setTitle($id, $new_title);
        if ($result !== false) {
            $date = $this->convertDate(date('Y-m-d H:i:s'));
            $this->exitStatus(true, array('modified_time' => $date));
        }
        $this->exitStatus(__('An error occurred!', 'wptm'));
    }

    /**
     * Change order tables
     *
     * @return void
     */
    public function order()
    {
        $idTable = Utilities::getInput('table', 'GET', 'string');
        $cat = Utilities::getInput('cat', 'GET', 'string');
        $before = Utilities::getInput('before', 'GET', 'string');

        $modelTables = $this->getModel('tables');
        $tables = $modelTables->getItems($cat);
        $model  = $this->getModel();

        $count = count($tables);
        $newPosition = 999999;
        $oldPosition = 999999;
        $reverse_loop = false;

        for ($i = 0; $i < $count; $i++) {
            if ((int)$before === 0) {
                $newPosition = 1;
            } elseif ((int)$before === (int)$tables[$i]->id) {
                $newPosition = $tables[$i]->position + 1;
            }

            if ($reverse_loop === false) {
                if ((int)$idTable === (int)$tables[$i]->id) {
                    $oldPosition = $tables[$i]->position;
                    if ($newPosition > $oldPosition) {
                        $newPosition = 0;
                        $reverse_loop = true;
                        for ($j = $count - 1; $j > $i; $j--) {
                            if ((int)$before === (int)$tables[$j]->id) {
                                $newPosition = $tables[$j]->position;
                                $result = $model->setPosition($tables[$i]->id, $newPosition);
                            }

                            if ($newPosition !== 0) {
                                $result = $model->setPosition($tables[$j]->id, $j);
                            }
                        }
                    } else {
                        $result = $model->setPosition($tables[$i]->id, $newPosition);
                    }
                }
            }

            if ($reverse_loop === false) {
                if ((int)$idTable !== (int)$tables[$i]->id) {
                    if ($newPosition <= $tables[$i]->position && $tables[$i]->position <= $oldPosition) {
                        $result = $model->setPosition($tables[$i]->id, $i + 1);
                    }
                }
            }
        }

        if ($result === false) {
            $this->exitStatus(__('An error occurred!', 'wptm'));
        }

        $this->exitStatus(true);
    }

    /**
     * Set category parent of table
     *
     * @return void
     */
    public function changeCategory()
    {
        $id_table = Utilities::getInt('id');
        $category = Utilities::getInt('category');
        $model    = $this->getModel();
        $result   = $model->setCategory($id_table, $category);
        if ($result !== false) {
            $this->exitStatus(true);
        } else {
            $this->exitStatus(__('An error occurred!', 'wptm'));
        }
    }
    /**
     * Get list tables
     *
     * @return void
     */
    public function getListTables()
    {
        if (isset($_POST['option_nonce']) && wp_verify_nonce(sanitize_key($_POST['option_nonce']), 'option_nonce')) {
            $id_cat = Utilities::getInput('id', 'POST', 'string');
            $check_role = $this->checkRoleTable($id_cat, 'getListTable');

            if ((int)$check_role === 1) {
                $modelTables = $this->getModel('tables');
                if ((int)$id_cat === 0) {
                    $id_cat = 'all';
                }
                if (!current_user_can('wptm_access_database_table')) {
                    $type = new stdClass();
                    $type->type = 'html';
                    $tables = $modelTables->getItems($id_cat, $type);
                } else {
                    $tables = $modelTables->getItems($id_cat);
                }
                if ($tables) {
                    $count = count($tables);
                    for ($i = 0; $i < $count; $i++) {
                        $tables[$i]->modified_time = $this->convertDate($tables[$i]->modified_time);
                        $tables[$i]->author_name = get_userdata((int)$tables[$i]->author)->user_nicename;
                    }
                    $this->exitStatus(true, array('id' => $id_cat, 'tables' => $tables));
                }
                $this->exitStatus(true, array('id' => $id_cat, 'tables' => array()));
            }
            $this->exitStatus(__('You don\'t have permission to edit category', 'wptm'));
        }
        $this->exitStatus(__('error while getting tables', 'wptm'));
    }

    /**
     * Function get category id by table id
     *
     * @return void
     */
    public function getCategoryById()
    {
        if (isset($_POST['option_nonce']) && wp_verify_nonce(sanitize_key($_POST['option_nonce']), 'option_nonce')) {
            $id = Utilities::getInput('id', 'POST', 'string');
            if ((int)$id > 0) {
                $model    = $this->getModel();
                $result   = $model->getCategoryById($id);
                if ($result !== false) {
                    $data = array();
                    $data[0] = $result[0]->id_category;
                    if (isset($result[0]->type) && $result[0]->type === 'mysql') {
                        $data[1] = $this->getDbItems('getCategoryById');
                    }
                    $this->exitStatus(true, $data);
                }
            }
        }
        $this->exitStatus(__('An error occurred!', 'wptm'));
    }

    /**
     * Function get dbtable list
     *
     * @param string|null $from Function get this
     *
     * @return array
     */
    public function getDbItems($from = null)
    {
        $data = array();
        $modelTable  = $this->getModel('tables');
        $item        = $modelTable->getDbItems();
        $count = count($item);
        if ($count > 0) {//list
            $data = $item;
        }
        if (isset($from) && $from === 'getCategoryById') {
            return $data;
        } else {
            $this->exitStatus(true, $data);
        }
        $this->exitStatus(__('An error occurred!', 'wptm'));
    }

    /**
     * Function convert date string to date format
     *
     * @param string $date Date string
     *
     * @return string
     */
    public function convertDate($date)
    {
        if (get_option('date_format', null) !== null) {
            $date = date_create($date);
            $date = date_format($date, get_option('date_format') . ' ' . get_option('time_format'));
        }
        return $date;
    }

    /**
     * Function convert data < 2.7.0 to 2.7.0
     *
     * @return mixed
     */
    public function convertTable()
    {
        $item = false;
        if (isset($_POST['option_nonce']) && wp_verify_nonce(sanitize_key($_POST['option_nonce']), 'option_nonce')) {
            /*copy data*/
            $modelTable = $this->getModel();

            $item = $modelTable->backupTable();

            if ($item) {
                $item = $modelTable->changeTableData();
            }

            if ($item) {
                $item = $modelTable->createRangeStyle();
            }

            if ($item) {
                $modelTable = $this->getModel('tables');
                $item = $modelTable->getListTableById();
                $data = array('id' => $item[0]->id);

                if (isset($item[0])) {
                    update_option('wptm_tables_convert', $item[0]->id);
                }
            }
        }

        if ($item) {
            $this->exitStatus(true, $data);
        } else {
            $this->exitStatus(__('Error while convert table!', 'wptm'));
        }
    }

    /**
     * Function convert table to new data
     *
     * @return void
     */
    public function moveTable()
    {
        $item = false;
        if (isset($_POST['option_nonce']) && wp_verify_nonce(sanitize_key($_POST['option_nonce']), 'option_nonce')) {
            global $wpdb;
            $wpdb->hide_errors();

            $id = Utilities::getInput('id', 'POST', 'string');
            if ((int)$id > 0) {
                $model = $this->getModel();
                $item  = $model->getItemFromBackup($id);
                require_once plugin_dir_path(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'tables.php';
                $newData = WptmTablesHelper::parseItem($item);
                //add table header = 1
                $newData['params']->headerOption = 1;
                $newData['action'] = 'insert';

                if ($model->saveTableSynfile($id, $newData)) {
                    $item = true;
                } else {
                    $this->exitStatus(esc_attr('Error while convert table is id = ' . $id . '!', 'wptm'));
                }
            }
        }

        if ($item) {
            $after_id = -1;
            $modelTable = $this->getModel('tables');
            $item = $modelTable->getListTableById();
            $count = count($item);
            update_option('wptm_tables_convert', -2);

            for ($i = 0; $i < $count; $i++) {
                if ($item[$i]->id > $id) {
                    $after_id = $item[$i]->id;
                    update_option('wptm_tables_convert', $after_id);
                    break;
                }
            }

            /*remove data column*/
            if ($after_id === -1) {
                $modelTable->removeDataColumn();
            }

            $db_error = $wpdb->last_error;
            if ($db_error !== '') {
                $this->exitStatus(false, esc_attr('The table migration encounter a technical issue, please double check your table data integrity', 'wptm'));
            }

            $this->exitStatus(true, $after_id);
        } else {
            $this->exitStatus(esc_attr('Error while convert table is id = ' . $id . '!', 'wptm'));
        }
    }
}
