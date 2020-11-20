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
class WptmControllerTable extends Controller
{
    /**
     * Get data for pagination ajax
     *
     * @param null|integer $id Table id
     *
     * @return void
     */
    public function loadPage($id = null)
    {
        global $wpdb;
        $method = 'POST'; // You can change to post for more beautiful ajax url
        if (is_null($id)) {
            $id = Utilities::getInt('id', 'GET');
        }
        $start = Utilities::getInt('start', $method);
        $limit = Utilities::getInt('length', $method);
        $columns = Utilities::getInput('columns', $method, 'none');
        $orders = Utilities::getInput('order', $method, 'none');
        $draw = Utilities::getInt('draw', $method);
        if ($start === 0) {
            $page = 1;
        } else {
            $page = ($start / $limit) + 1;
        }

        if ($page <= 0) {
            $page = 1;
        }
        Application::getInstance('Wptm');
        /* @var WptmModelTable $tableModel */
        $tableModel = $this->getModel('table');
        /* @var WptmModelDbtable $dbTableModel */
        $dbTableModel = $this->getModel('dbtable');
//        $table_name = $wpdb->prefix . 'wptm_tables';

//        $item = $wpdb->get_row($wpdb->prepare('SELECT c.* FROM ' . $table_name . ' as c WHERE c.id = %d', (int)$id), OBJECT);
//        $params = json_decode($item->params);

        $table = $tableModel->getItem($id, false, true, null, true);
        $params = $table->style->table;
        $cellsStyle = $table->style->cells;

        $headerOffset = isset($params->headerOption) ? intval($params->headerOption) : 0;
        $header_data = isset($params->header_data) ? $params->header_data : null;

        $filters = array();
        $filters['page'] = $page;
        $filters['limit'] = $limit;
        $filters['headerOffset'] = $headerOffset;
        $filters['getLine'] = true;
        if ($table->type === 'mysql') {
            if (is_object($params) && is_string($table->params)) {
                $params = json_decode($table->params, true);
            } elseif (!is_array($params)) {
                $params = json_decode(json_encode($table->params), true);
            }
            // Prepare $filters for filter and sorting in database table
            $filters['where'] = $columns;
            $filters['order'] = $orders;

            $queries = $this->regenerateQueryForAjax($params, $filters);

            $isFilter = $queries['isFilter'];
            $datas = $dbTableModel->getTableData($queries['query']);
            $datas = array_map('array_values', $datas);
            $totalRows = intval($wpdb->get_var($queries['countTotal']));
            $totalFilteredRows = intval($wpdb->get_var($queries['countFiltered']));
        } else {
            $totalRows = $tableModel->countRows($id, $table);
            $totalFilteredRows = $totalRows;
            // Where
            $where = array();
            $whereStr = '';
            if (is_array($columns) && count($columns)) {
                foreach ($columns as $index => $column) {
                    /*
                     * columns[$index][data]: 0
                     * columns[$index][name]:
                     * columns[$index][searchable]: true
                     * columns[$index][orderable]: false
                     * columns[$index][search][value]:
                     * columns[$index][search][regex]: false
                     */
                    if (isset($column['searchable']) && $column['searchable'] && isset($column['search']['value']) && $column['search']['value'] !== '') {
                        $where[] = ' col' . esc_html($column['data'] + 1) . ' LIKE \'%' . esc_html($column['search']['value']) . '%\'';
                    }
                }
                if (count($where) > 0) {
                    $whereStr .= implode(' AND', $where);
                    $totalFilteredRows = $tableModel->countFilterRows($id, $whereStr);
                }
            }

            // Order
            $order = array();
            $orderStr = '';
            if (is_array($orders) && count($orders)) {
                foreach ($orders as $index => $ord) {
                    /*
                     * order[0][column]: 0
                     * order[0][dir]: desc
                     * order[1][column]: 1
                     * order[1][dir]: asc
                     * order[$index][column]: 2
                     * order[$index][dir]: asc
                     */
                    $order[] = ' col' . esc_html(intval($ord['column']) + 1) . ' ' . strtoupper($ord['dir']);
                }
                if (count($order) > 0) {
                    $orderStr .= implode(' ,', $order);
                }
            }
            $filters['where'] = $whereStr;
            $filters['order'] = $orderStr;
            $isFilter = $whereStr === '' ? false : true;
            $datas = $tableModel->getTableData($table->mysql_table_name, $filters);
        }

        $newDatas = array();
        $startId = ($page - 1) * $limit;
        if ($page === 1) {
            $startId += $headerOffset;
        }

        if (is_array($datas) && count($datas) > 0) {
            require_once dirname(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'site' . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'wptmHelper.php';
            $wptmHelper = new WptmHelper();
            // Setup some params for wptm helper
            $wptmHelper->setup($params);

            $reGetDataCells = array();
            $reGetDataCells['col'] = array();
            $reGetDataCells['row'] = array();

            $cellReGetDatas = array();

            if ($header_data === null) {
                $numberCol = count($datas[0]);
                if ($numberCol <= 0) {
                    $num = 1;
                } else {
                    $num = $numberCol - 1;
                }
                $valueRow = array_fill(0, $num, '');
                if ($headerOffset <= 0) {
                    $num = 1;
                } else {
                    $num = $headerOffset - 1;
                }
                $header_data = array_fill(0, $num, $valueRow);
            }

            $count = count($datas) + $headerOffset;//number item in pagination + header

            $fullData = array();
            for ($i = 0; $i < $count; $i++) {
                if ($i < $headerOffset) {
                    $fullData[$i] = $header_data[$i];
                } else {
                    $key = isset($datas[$i - $headerOffset]['DT_RowId']) ? $datas[$i - $headerOffset]['DT_RowId'] : $startId + $i;
                    $fullData[$key] = $datas[$i - $headerOffset];
                }
            }

            foreach ($datas as $key => $row) {
                $newRow = new stdClass;
                $newRow->DT_RowId = isset($row['DT_RowId']) ? $row['DT_RowId'] : $startId + intval($key);
                // Remove header value
                if (intval($newRow->DT_RowId) === 0 && !$isFilter) {
                    continue;
                }
                if ($newRow->DT_RowId >= $headerOffset) {
                    foreach ($row as $k => $v) {
                        if (!empty($cellsStyle[$newRow->DT_RowId . '!' . $k]) && !empty($cellsStyle[$newRow->DT_RowId . '!' . $k][2]['tooltip_content'])) {
                            if (!empty($cellsStyle[$newRow->DT_RowId . '!' . $k][2]['tooltip_width']) && (int)$cellsStyle[$newRow->DT_RowId . '!' . $k][2]['tooltip_width'] > 0) {
                                $newRow->{$k} = '<span class="wptm_tooltip ">' . $v . '<span class="wptm_tooltipcontent" data-width="' . $cellsStyle[$newRow->DT_RowId . '!' . $k][2]['tooltip_width'] . '">' . $cellsStyle[$newRow->DT_RowId . '!' . $k][2]['tooltip_content'] . '</span></span>';
                            } else {
                                $newRow->{$k} = '<span class="wptm_tooltip ">' . $v . '<span class="wptm_tooltipcontent">' . $cellsStyle[$newRow->DT_RowId . '!' . $k][2]['tooltip_content'] . '</span></span>';
                            }
                        } else {
                            $newRow->{$k} = $v;
                        }

                        // Caculate functions
                        if (isset($v[0]) && $v[0] === '=') {
                            $calculaterCell = $wptmHelper->calculaterCell($fullData, $v);
                            if (is_array($calculaterCell)) {
                                $cellReGetDatas[] = array(count($newDatas), $k);
                                $count = count($calculaterCell['col']);
                                for ($i = 0; $i < $count; $i++) {
                                    if (!in_array($calculaterCell['col'][$i], $reGetDataCells['col'])) {
                                        $reGetDataCells['col'][] = $calculaterCell['col'][$i];
                                    }
                                }
                                $count = count($calculaterCell['row']);
                                for ($i = 0; $i < $count; $i++) {
                                    if (!in_array($calculaterCell['row'][$i], $reGetDataCells['row'])) {
                                        $reGetDataCells['row'][] = $calculaterCell['row'][$i];
                                    }
                                }
                            } else {
                                $newRow->{$k} = $calculaterCell;
                            }
                        }
                    }
                    $newDatas[] = $newRow;
                }
            }

            if (count($cellReGetDatas) > 0) {
                if ($table->type === 'html') {
                    $filters = array(
                        'where' => 'line IN (' . implode(',', $reGetDataCells['row']) . ')',
                        'limit' => -1,
                        'headerOffset' => 0,
                        'cols' => $reGetDataCells['col'],
                    );

                    $DataCells = $tableModel->getTableData($table->mysql_table_name, $filters);

                    foreach ($DataCells as $DataCell) {
                        if (!isset($fullData[$DataCell[0]])) {//line data not exist
                            $fullData[$DataCell[0]] = array();
                        }
                        foreach ($DataCell as $keyCol => $Data) {
                            if ($keyCol > 0) {
                                $fullData[$DataCell[0]][$reGetDataCells['col'][$keyCol - 1]] = $Data;
                            }
                        }
                    }

                    foreach ($cellReGetDatas as $cellReGetData) {
                        $newDatas[$cellReGetData[0]]->{$cellReGetData[1]} = $wptmHelper->calculaterCell($fullData, $newDatas[$cellReGetData[0]]->{$cellReGetData[1]});
                    }
                }
            }
        }

        $return = array(
            'draw' => $draw,
            'rows' => $newDatas,
            'page' => $page,
            'total' => intval($totalRows),
            'filteredTotal' => intval($totalFilteredRows),
        );
        wp_send_json_success($return);
        die;
    }

    /**
     * Regenerate query for ajax
     *
     * @param array $queryDatas Get data query
     * @param array $filters    Filter
     *
     * @return array
     */
    public function regenerateQueryForAjax($queryDatas, $filters)
    {
        $queries = array();
        Application::getInstance('Wptm');
        require_once(dirname(WPTM_PLUGIN_FILE) . '/app/admin/models/dbtable.php');
        // 1. Generate count total query
        $dbTableModel = new WptmModelDbtable();
        $clonedQueryDatas = $queryDatas;
        $queryData = $dbTableModel->generateQueryAndPreviewdata($clonedQueryDatas);
        $queries['countTotal'] = 'SELECT SUM(1) FROM (' . $queryData['query'] . ') AS tmp';

        // Build params for filtering data
        $columns = $queryDatas['mysql_columns'];

        $whereConditions = isset($queryDatas['where_conditions']) ? $queryDatas['where_conditions'] : array();
        $beforeWhereCount = count($whereConditions);
        // Build Order by query part
        $orderByArr = array();
        $orderStr = '';
        if (is_array($filters['order']) && count($filters['order'])) {
            foreach ($filters['order'] as $index => $ord) {
                /*
                 * order[0][column]: 0
                 * order[0][dir]: desc
                 * order[1][column]: 1
                 * order[1][dir]: asc
                 * order[$index][column]: 2
                 * order[$index][dir]: asc
                 */
                $columnIndex = intval($ord['column']);
                $columnName = isset($columns[$columnIndex]) ? $columns[$columnIndex] : false;
                $direction = strtoupper($ord['dir']);

                if (false !== $columnName) {
                    $orderByArr[] = $columnName . ' ' . $direction;
                }
            }
            if (count($orderByArr) > 0) {
                $orderStr .= implode(' ,', $orderByArr);
            }
        }

        // Build Where query part
        if (is_array($filters['where']) && count($filters['where'])) {
            foreach ($filters['where'] as $index => $column) {
                /*
                 * columns[$index][data]: 0
                 * columns[$index][name]:
                 * columns[$index][searchable]: true
                 * columns[$index][orderable]: false
                 * columns[$index][search][value]:
                 * columns[$index][search][regex]: false
                 */
                $columnIndex = intval($column['data']);
                $columnName = isset($columns[$columnIndex]) ? $columns[$columnIndex] : false;
                if (false !== $columnName && isset($column['search']['value']) && $column['search']['value'] !== '') {
                    $whereConditions[] = $this->createWhereWildcard($columnName, esc_html($column['search']['value']));
                }
            }
        }

        $queryDatas['where_conditions'] = $whereConditions;
        $afterWhereCount = count($whereConditions);

        // 2. Generate query
        $dbTableModel = new WptmModelDbtable();
        $queryData = $dbTableModel->generateQueryAndPreviewdata($queryDatas);
        $queries['query'] = $queryData['query'];
        // 3. Generate count total query
        $queries['countFiltered'] = 'SELECT SUM(1) FROM (' . $queries['query'] . ') AS tmp';

        // 4.  Change order by
        if ($orderStr !== '') {
            $queryArr = explode(' Order by ', $queries['query']);
            $queries['query'] = $queryArr[0] . ' ORDER BY ' . $orderStr;
        }

        // 2. Generate count filtered query
        // 5. Add limit query part
        $limit = isset($filters['limit']) ? $filters['limit'] : -1;
        $page = isset($filters['page']) ? $filters['page'] : 1;
        $headerOffset = isset($filers['headerOffset']) ? $filters['headerOffset'] : 1;
        $limitQuery = '';
        $queries['isFilter'] = ($afterWhereCount - $beforeWhereCount) === 0 ? false : true;
        if ($limit > -1 && wp_doing_ajax()) {
            if ($page === 1) {
                $offset = 0;
            } else {
                $offset = ($page - 1) * $limit;
            }
            if ($headerOffset > 0 && $page === 1 && !$queries['isFilter']) {
                $offset += $headerOffset;
                $limit -= $headerOffset;
            }
            // Add intval() for security reason
            $limitQuery = ' LIMIT ' . intval($offset) . ', ' . intval($limit);
        }
        $queries['query'] .= $limitQuery;

        return $queries;
    }

    /**
     * Create where wildcard
     *
     * @param string $column Column name
     * @param string $value  Value column
     *
     * @return array
     */
    private function createWhereWildcard($column, $value)
    {
        return $this->createWhere($column, 'plikep', $value);
    }

    /**
     * Create where in query
     *
     * @param string $column   Column name
     * @param string $operator Operator
     * @param string $value    Value column
     *
     * @return array
     */
    private function createWhere($column, $operator, $value)
    {
        $where = array();
        $where['column'] = $column;
        $where['operator'] = $operator;
        $where['value'] = $value;

        return $where;
    }
}
