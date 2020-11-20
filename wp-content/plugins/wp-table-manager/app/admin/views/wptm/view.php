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
 * Class wptmViewWptm
 */
class WptmViewWptm extends View
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
        $id_table = Utilities::getInt('id_table', 'GET');
        if (Utilities::getInput('caninsert', 'GET', 'bool')) {
            $this->caninsert = true;
        } else {
            $this->caninsert = false;
        }
        $this->charts = array();
        $this->id_charts = Utilities::getInt('chart', 'GET');


        if ($id_table !== 0) {
            $modelStyles  = $this->getModel('styles');
            $this->styles = $modelStyles->getStyles();

            $modelTable = $this->getModel('table');
            $this->table = $modelTable->getItem($id_table);

            $modelCharts      = $this->getModel('charts');
            $this->chartTypes = $modelCharts->getChartTypes();

            $this->id_table = $id_table;
        } else {
            $cid = Utilities::getInt('cid', 'GET');
            $modelCat         = $this->getModel('categories');
            $this->categories = $modelCat->getCategories();
            $this->idUser = get_current_user_id();

            if (isset($cid) && $cid !== 0) {
                $this->cid = $cid;
                setcookie('wptm_category_id', $this->cid, time() + (86400 * 30), '/');
            } else {
                if (!isset($_COOKIE['wptm_category_id'])) {
                    $this->cid = (int)$this->categories[0]->id;//when has not cid to $cid = first category
                } else {
                    $this->cid = (int)$_COOKIE['wptm_category_id'];
                }
            }

            if ($this->caninsert) {
                $modelCharts = $this->getModel('charts');
                $charts = $modelCharts->getAllCharts();
                require_once plugin_dir_path(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'tables.php';
                $this->charts = WptmTablesHelper::categoryCharts($charts);
            }
        }

        $this->convert = get_option('wptm_tables_convert', null);

        $modelConfig  = $this->getModel('config');
        $this->params = $modelConfig->getConfig();

        $this->idUser = get_current_user_id();
        parent::render($tpl);
    }
}
