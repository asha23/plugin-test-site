<?php
/* Based on some work of wp Data Tables plugin */

/**
 * WP Table Manager
 *
 * @package WP Table Manager
 * @author  Joomunited
 * @version 1.0
 */

use Joomunited\WPFramework\v1_0_5\Model;
use Joomunited\WPFramework\v1_0_5\Factory;

defined('ABSPATH') || die();

/**
 * Class WptmModelDbtable
 */
class WptmModelDbtable extends Model
{
    /*     * * For the WP DB type query ** */
    /**
     * Select arr
     *
     * @var array
     */
    private $select_arr = array();

    /**
     * Where arr
     *
     * @var array
     */
    private $where_arr = array();

    /**
     * Group arr
     *
     * @var array
     */
    private $group_arr = array();

    /**
     * From arr
     *
     * @var array
     */
    private $from_arr = array();

    /**
     * Inner join arr
     *
     * @var array
     */
    private $inner_join_arr = array();

    /**
     * Left join
     *
     * @var array
     */
    private $left_join_arr = array();

    /**
     * Check have group
     *
     * @var boolean
     */
    private $has_groups = false;

    /**
     * Query data
     *
     * @var string
     */
    private $query = '';

    /**
     * Get list sql table
     *
     * @return array
     */
    public function listMySQLTables()
    {

        $tables = array();
        global $wpdb;
        $result = $wpdb->get_results('SHOW TABLES', ARRAY_N);

        // Formatting the result to plain array
        foreach ($result as $row) {
            $tables[] = $row[0];
        }

        return $tables;
    }

    /**
     * Return a list of columns for the selected tables
     *
     * @param array $tables Data table
     *
     * @return array
     */
    public static function listMySQLColumns($tables)
    {
        $columns = array('all_columns' => array(), 'sorted_columns' => array());
        if (!empty($tables)) {
            global $wpdb;
            foreach ($tables as $table) {
                $columns['sorted_columns'][$table] = array();

                //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- $table is name table in database, it already escaped
                $table_columns = $wpdb->get_results('SHOW COLUMNS FROM ' . $table, ARRAY_A);

                foreach ($table_columns as $table_column) {
                    $columns['sorted_columns'][$table][] = $table . '.' . $table_column['Field'];
                    $columns['all_columns'][] = $table . '.' . $table_column['Field'];
                }
            }
        }

        return $columns;
    }

    /**
     * Checks that the table and column are valid and exist in the database.
     *
     * @param array  $table_data Data table
     * @param string $value      Value need to check
     *
     * @return boolean
     */
    public function checkValidValue($table_data, $value = '')
    {
        $value_arr = explode('.', $value);
        if ($value === '' || empty($value_arr) || $value_arr === null || count($value_arr) < 2) {
            return false;
        }
        $tables = $table_data['tables'];

        if (!in_array($value_arr[0], $tables)) {
            return false;
        }
        $columns = self::listMySQLColumns(array($value_arr[0]));
        if (!in_array($value, $columns['all_columns'])) {
            return false;
        }
        return true;
    }

    /**
     * Return a build query and preview table
     *
     * @param array $table_data Data table
     *
     * @return array
     */
    public function generateQueryAndPreviewdata($table_data)
    {
        global $wpdb;
        foreach ($table_data as $key => &$value) {
            if (is_array($value)) {
                foreach ($value as &$v) {
                    if (is_array($v)) {
                        foreach ($v as &$v1) {
                            $v1 = str_replace('`', '&#x60;', htmlentities(htmlspecialchars($v1)));
                        }
                    } else {
                        $v = str_replace('`', '&#x60;', htmlentities(htmlspecialchars($v)));
                    }
                }
            } else {
                $value = str_replace('`', '&#x60;', htmlentities(htmlspecialchars($value)));
            }
        }
        $this->table_data = apply_filters('wdt_before_generate_mysql_based_query', $table_data);
        if (!isset($this->table_data['where_conditions'])) {
            $this->table_data['where_conditions'] = array();
        }

        if (isset($this->table_data['grouping_rules'])) {
            $this->has_groups = true;
        }

        if (!isset($table_data['mysql_columns'])) {
            $table_data['mysql_columns'] = array();
        }

        // Initializing structure for the SELECT part of query
        $this->prepareMySQLSelectBlock();

        // Initializing structure for the WHERE part of query
        $this->prepareMySQLWhereBlock();

        // Prepare the GROUP BY block
        $this->prepareMySQLGroupByBlock();

        // Prepare the join rules
        $this->prepareMySQLJoinedQueryStructure();

        // Prepare the query itself
        $this->query = $this->buildMySQLQuery();

        if (isset($this->table_data['default_ordering']) && $this->table_data['default_ordering'] && $this->checkValidValue($this->table_data, $this->table_data['default_ordering'])) {
            $default_ordering_dir = strtolower($this->table_data['default_ordering_dir']) !== 'asc' && strtolower($this->table_data['default_ordering_dir']) !== 'desc' ? 'asc' : $this->table_data['default_ordering_dir'];
            $this->query .= ' Order by ' . esc_sql($this->table_data['default_ordering']) . ' ' . esc_sql($default_ordering_dir);
        }

        if (preg_match('/union/i', $this->query)) {
            $result = false;
        } else {
            $result = array(
                'query' => $this->query,
                'preview' => $this->getQueryPreview()
            );
        }

        return $result;
    }
    /**
     * Generate the sample table with 5 rows from MySQL query
     *
     * @return string|void
     */
    public function getQueryPreview()
    {
        global $wpdb;

        //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- query already escaped
        $result = $wpdb->get_results($this->query . ' LIMIT 10', ARRAY_A);

        if (!empty($result)) {
            $headers = isset($this->table_data['custom_titles']) ? $this->table_data['custom_titles'] : $this->table_data['mysql_columns'];
            ob_start();
            include(WPTM_PLUGIN_DIR . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . 'dbtable' . DIRECTORY_SEPARATOR . 'tpl' . DIRECTORY_SEPARATOR . 'table_preview.inc.php');
            $ret_val = ob_get_contents();
            ob_end_clean();
        } else {
            $ret_val = __('No results found', 'wptm');
        }
        return $ret_val;
    }

    /**
     * Helper function to generate the fields structure from MySQL tables
     *
     * @return void
     */
    private function prepareMySQLSelectBlock()
    {
        foreach ($this->table_data['mysql_columns'] as $key => $mysql_column) {
            $mysql_column_arr = explode('.', esc_sql($mysql_column));
            if (!isset($this->select_arr[$mysql_column_arr[0]])) {
                $this->select_arr[$mysql_column_arr[0]] = array();
            }
            if (isset($this->table_data['custom_titles'][$key])) {
                $this->select_arr[$mysql_column_arr[0]][] = esc_sql($mysql_column) . ' `' . esc_sql($this->table_data['custom_titles'][$key]) . '`';
            } else {
                $this->select_arr[$mysql_column_arr[0]][] = esc_sql($mysql_column);
            }
            // From
            if (!in_array($mysql_column_arr[0], $this->from_arr)) {
                $this->from_arr[] = $mysql_column_arr[0];
            }
        }
    }

    /**
     * Prepare a Where block for MySQL based
     *
     * @return void
     */
    private function prepareMySQLWhereBlock()
    {
        if (empty($this->table_data['where_conditions'])) {
            return;
        }

        foreach ($this->table_data['where_conditions'] as $where_condition) {
            if ($where_condition['column'] === '' || $where_condition['value'] === '') {
                continue;
            }
            $where_column_arr = explode('.', esc_sql($where_condition['column']));
            if (!in_array($where_column_arr[0], $this->from_arr)) {
                $this->from_arr[] = $where_column_arr[0];
            }

            if ($this->checkValidValue($this->table_data, $where_condition['column'])) {
                $this->where_arr[$where_column_arr[0]][] = self::buildWhereCondition(
                    esc_sql($where_condition['column']),
                    esc_sql($where_condition['operator']),
                    esc_sql($where_condition['value'])
                );
            }
        }
    }

    /**
     * Prepare a GROUP BY block for MySQL based
     *
     * @return void
     */
    private function prepareMySQLGroupByBlock()
    {
        if (!$this->has_groups) {
            return;
        }

        foreach ($this->table_data['grouping_rules'] as $grouping_rule) {
            if (empty($grouping_rule) || !$this->checkValidValue($this->table_data, $grouping_rule)) {
                continue;
            }
            $this->group_arr[] = esc_sql($grouping_rule);
        }
    }

    /**
     * Prepares the structure of the JOIN rules for MySQL based tables
     *
     * @return void
     */
    private function prepareMySQLJoinedQueryStructure()
    {
        if (!isset($this->table_data['join_rules'])) {
            return;
        }

        if (count($this->from_arr) > 1) {
            foreach ($this->table_data['join_rules'] as $join_rule) {
                if (empty($join_rule['initiator_column']) || empty($join_rule['connected_column']) || !in_array($join_rule['initiator_table'], $this->from_arr)) {
                    continue;
                }

                $connected_column_arr = explode('.', esc_sql($join_rule['connected_column']));
                if ($this->checkValidValue($this->table_data, esc_sql($join_rule['initiator_table']) . '.' . esc_sql($join_rule['initiator_column'])) && $this->checkValidValue(esc_sql($join_rule['connected_column']), $this->table_data)) {
                    if (in_array($connected_column_arr[0], $this->from_arr) && count($this->from_arr) > 1) {
                        if ((string)$join_rule['type'] === 'left') {
                            $this->left_join_arr[$connected_column_arr[0]] = $connected_column_arr[0];
                        } else {
                            $this->inner_join_arr[$connected_column_arr[0]] = $connected_column_arr[0];
                        }
                        unset($this->from_arr[array_search($connected_column_arr[0], $this->from_arr)]);
                    } else {
                        if ((string)$join_rule['type'] === 'left') {
                            $this->left_join_arr[$connected_column_arr[0]] = $connected_column_arr[0];
                        } else {
                            $this->inner_join_arr[$connected_column_arr[0]] = $connected_column_arr[0];
                        }
                    }

                    $this->where_arr[$connected_column_arr[0]][] = self::buildWhereCondition(
                        esc_sql($join_rule['initiator_table']) . '.' . esc_sql($join_rule['initiator_column']),
                        'eq',
                        esc_sql($join_rule['connected_column']),
                        false
                    );
                } else {
                    break;
                }
            }
        }
    }

    /**
     * Prepares the query text for MySQL based table
     *
     * @return string
     */
    private function buildMySQLQuery()
    {
        // Build the final output
        $query = 'SELECT ';
        $i = 0;
        foreach ($this->select_arr as $table_alias => $select_block) {
            $query .= implode(",\n       ", $select_block);
            $i++;
            if ($i < count($this->select_arr)) {
                $query .= ",\n       ";
            }
        }
        $query .= "\n FROM ";
        $query .= implode(', ', $this->from_arr) . "\n";

        if (!empty($this->inner_join_arr)) {
            $i = 0;
            foreach ($this->inner_join_arr as $table_alias => $inner_join_block) {
                $query .= '  INNER JOIN ' . $inner_join_block . "\n";
                if (!empty($this->where_arr[$table_alias])) {
                    $query .= '     ON ' . implode("\n     AND ", $this->where_arr[$table_alias]) . "\n";
                    unset($this->where_arr[$table_alias]);
                }
            }
        }

        if (!empty($this->left_join_arr)) {
            foreach ($this->left_join_arr as $table_alias => $left_join_block) {
                $query .= '  LEFT JOIN ' . $left_join_block . "\n";
                if (!empty($this->where_arr[$table_alias])) {
                    $query .= '     ON ' . implode("\n     AND ", $this->where_arr[$table_alias]) . "\n";
                    unset($this->where_arr[$table_alias]);
                }
            }
        }
        if (!empty($this->where_arr)) {
            $query .= "WHERE 1=1 \n   AND ";
            $i = 0;
            foreach ($this->where_arr as $table_alias => $where_block) {
                $query .= implode("\n   AND ", $where_block);
                $i++;
                if ($i < count($this->where_arr)) {
                    $query .= "\n   AND ";
                }
            }
        }

        if (!empty($this->group_arr)) {
            $query .= "\nGROUP BY " . implode(', ', $this->group_arr);
        }
        return $query;
    }


    /**
     * Prepares the structure of the WHERE rules for MySQL based tables
     *
     * @param string  $leftOperand  Left Operand
     * @param string  $operator     Operator
     * @param string  $rightOperand Right Operand
     * @param boolean $isValue      Value
     *
     * @return string
     */
    public static function buildWhereCondition($leftOperand, $operator, $rightOperand, $isValue = true)
    {
        $rightOperand = stripslashes_deep($rightOperand);
        $wrap = $isValue ? "'" : '';
        switch ($operator) {
            case 'eq':
                return $leftOperand . ' = ' . $wrap . $rightOperand . $wrap;
            case 'neq':
                return $leftOperand . ' != ' . $wrap . $rightOperand . $wrap;
            case 'gt':
                return $leftOperand . ' > ' . $wrap . $rightOperand . $wrap;
            case 'gtoreq':
                return $leftOperand . ' >= ' . $wrap . $rightOperand . $wrap;
            case 'lt':
                return $leftOperand . ' < ' . $wrap . $rightOperand . $wrap;
            case 'ltoreq':
                return $leftOperand . ' <= ' . $wrap . $rightOperand . $wrap;
            case 'in':
                return $leftOperand . ' IN (' . $rightOperand . ')';
            case 'like':
                return $leftOperand . ' LIKE ' . $wrap . $rightOperand . $wrap;
            case 'plikep':
                return $leftOperand . ' LIKE ' . $wrap . '%' . $rightOperand . '%' . $wrap;
        }
    }

    /**
     * Create new table for selected mysql tables
     *
     * @param array        $table_data Data table
     * @param null|integer $id_cat     Id category
     *
     * @return array
     */
    public function createTable($table_data, $id_cat = null)
    {
        global $wpdb;
        if ($id_cat !== null) {
            $id_category = $id_cat;
        } else {
            $modelCategory = Model::getInstance('category');
            $id_category = $modelCategory->addCategory('Category');
        }
        $lastPos = (int)$wpdb->get_var($wpdb->prepare('SELECT MAX(c.position) AS lastPos FROM ' . $wpdb->prefix . 'wptm_tables as c WHERE c.id_category = %d', (int)$id_category));
        $lastPos++;
        $style = json_decode('{"table":{"use_sortable":"1"},"rows":{"0":[0,{"height":30,"cell_padding_top":"3","cell_padding_right":"3","cell_padding_bottom":"3","cell_padding_left":"3","cell_font_family":"Arial","cell_font_size":"13","cell_font_color":"#333333","cell_border_bottom":"2px solid #707070","cell_background_color":"#ffffff","cell_font_bold":true,"cell_vertical_align":"middle"}]},"cols":{"0":[0,{"width":50,"cell_text_align":"center","cell_font_bold":true}],"1":[1,{"width":122,"cell_text_align":"center"}],"2":[2,{"width":137,"cell_text_align":"center"}],"3":[3,{"width":133,"cell_text_align":"center"}],"4":[4,{"width":150,"cell_text_align":"center"}],"5":[5,{"width":50,"cell_text_align":"center"}]},"cells":{}}');
        $style->table->enable_pagination = $table_data['enable_pagination'];
        $style->table->limit_rows = $table_data['limit_rows'];

        $params = $table_data;
        $params['table_type'] = 'mysql';

        //phpcs:ignore PHPCompatibility.Constants.NewConstants.json_unescaped_unicodeFound -- the use of JSON_UNESCAPED_UNICODE has check PHP version
        $data_params = json_encode($params, JSON_UNESCAPED_UNICODE);

        $wpdb->query($wpdb->prepare(
            'INSERT INTO ' . $wpdb->prefix . 'wptm_tables (id_category, title, style, mysql_query, params, created_time, modified_time, author, position, type) VALUES ( %d,%s,%s,%s,%s,%s,%s,%d,%d,%s)',
            $id_category,
            __('New table', 'wptm'),
            json_encode($style),
            $table_data['query'],
            $data_params,
            date('Y-m-d H:i:s'),
            date('Y-m-d H:i:s'),
            get_current_user_id(),
            $lastPos,
            'mysql'
        ));
        $user = get_userdata(get_current_user_id());

        $data = array('id' => $wpdb->insert_id, 'id_category' => $id_category, 'position' => $lastPos, 'title' => __('New table', 'wptm'), 'modified_time' => date(get_option('date_format') . ' ' . get_option('time_format')), 'author' => get_current_user_id(), 'type' => 'mysql', 'author_name' => $user->user_nicename);

        return $data;
    }

    /**
     * Update table with new change
     *
     * @param integer $id_table   Id table
     * @param array   $table_data Data table
     *
     * @return false|integer
     */
    public function updateTable($id_table, $table_data)
    {
        global $wpdb;

        $params = $table_data;
        $params['table_type'] = 'mysql';
        $ret = $wpdb->update(
            $wpdb->prefix . 'wptm_tables',
            array('mysql_query' => $table_data['query'],
                'params' => json_encode($params),
                'modified_time' => date('Y-m-d H:i:s')
            ),
            array('id' => $id_table)
        );

        return $ret;
    }

    /**
     * Get result data of build query
     *
     * @param string $query Query
     *
     * @return array|boolean|null|object
     */
    public function getTableData($query)
    {
        global $wpdb;
        //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- sql already escaped
        $result = $wpdb->query($query);
        if ($result === false) {
            return false;
        }
        //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- sql already escaped
        return $wpdb->get_results($query, ARRAY_A);
    }
}
