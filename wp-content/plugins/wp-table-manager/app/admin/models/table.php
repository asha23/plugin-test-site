<?php
/**
 * WP Table Manager
 *
 * @package WP Table Manager
 * @author  Joomunited
 * @version 1.0
 */

use Joomunited\WPFramework\v1_0_5\Model;

defined('ABSPATH') || die();

/**
 * Class WptmModelTable
 */
class WptmModelTable extends Model
{
    /**
     * Save table
     *
     * @param integer $id_table Id table
     * @param array   $datas    Data table
     *
     * @return false|integer
     */
    public function saveTableSynfile($id_table, $datas)
    {
        global $wpdb;

        if (!isset($datas['css'])) {
            $datas['css'] = '';
        }

        if (isset($datas['style'])) {
            if (is_string($datas['style'])) {
                $styles = json_decode(stripslashes_deep($datas['style']));
            } else {
                $styles = $datas['style'];
            }

            if (isset($styles->table)) {
                foreach ($styles->table as $key => $table) {
                    if (!isset($datas['params']->{$key})) {
                        $datas['params']->{$key} = $table;
                    }
                }
            }
            unset($styles->table);
            $data = array('modified_time' => date('Y-m-d H:i:s'), 'css' => $datas['css'], 'hash' => strtotime(date('Y-m-d H:i:s')), 'params' => $datas['params'], 'style' => json_encode(stripslashes_deep($styles)));
        } else {
            $data = array('modified_time' => date('Y-m-d H:i:s'), 'css' => $datas['css'], 'hash' => strtotime(date('Y-m-d H:i:s')), 'params' => $datas['params']);
        }

        $result = $this->updateTableDatas($id_table, $datas);
        $this->updateCellsStyle($id_table, $datas);

        $countCol = count($datas['datas'][0]);
        $col_types = $this->checkLengthColumn($wpdb->prefix . 'wptm_tbl_' . $id_table, $countCol);

        if ($col_types !== false) {
            $data['params']->col_types = $col_types;
        }

        $data['params'] = json_encode($data['params']);

        $result = $wpdb->update(
            $wpdb->prefix . 'wptm_tables',
            $data,
            array('ID' => (int)$id_table)
        );

        if ($result === false && $datas['action'] === 'insert') {
            return false;
        }

        if ($result === false) {
            echo esc_sql($wpdb->last_query);
            exit();
        }
        if ((int)$result === 0) {
            $result = $id_table;
        }

        return $result;
    }
    /**
     * Save table
     *
     * @param integer $id_table Id table
     * @param array   $datas    Data table 1597132316
     *
     * @return false|integer
     */
    public function save($id_table, $datas)
    {
        global $wpdb;
        if (empty($datas['datas'])) {
            $result = $wpdb->update(
                $wpdb->prefix . 'wptm_tables',
                array('modified_time' => date('Y-m-d H:i:s'), 'css' => $datas['css'], 'hash' => strtotime(date('Y-m-d H:i:s'))),
                array('ID' => (int)$id_table)
            );
        } else {
            $old_params = json_decode($this->getTableParams($id_table, ''), true);
            if (isset($datas['style']) && is_string($datas['style'])) {
                $styles = json_decode(stripslashes_deep($datas['style']));
                $new_params = array_merge((array)$styles->table, $datas['params']);
                unset($styles->table);
                unset($styles->cells);
                $params = array_merge($old_params, $new_params);
                $data = array('modified_time' => date('Y-m-d H:i:s'), 'hash' => strtotime(date('Y-m-d H:i:s')), 'css' => $datas['css'], 'params' => json_encode($params), 'style' => json_encode(stripslashes_deep($styles)));
            } else {
                $new_params = array_merge($old_params, $datas['params']);
                $data = array('modified_time' => date('Y-m-d H:i:s'), 'hash' => strtotime(date('Y-m-d H:i:s')), 'css' => $datas['css'], 'params' => json_encode($new_params));
            }
            $result = $wpdb->update(
                $wpdb->prefix . 'wptm_tables',
                $data,
                array('ID' => (int)$id_table)
            );
            $this->updateTableDatas($id_table, $datas, $new_params);
        }
        if ($result === false) {
            echo esc_sql($wpdb->last_query);
            exit();
        }
        if ((int)$result === 0) {
            $result = $id_table;
        }

        return $result;
    }

    /**
     * Check row exist
     *
     * @param string  $table_name Table name
     * @param integer $rowLine    Number row
     *
     * @return string|null
     */
    public function checkRowExists($table_name, $rowLine)
    {
        global $wpdb;
        $result = $wpdb->get_var(
            $wpdb->prepare(
                'SELECT id FROM ' . $table_name . ' WHERE line=%d',
                $rowLine
            )
        );
        return $result;
    }

    /**
     * Update data to main table
     *
     * @param integer    $id_table   Table id
     * @param array      $datas      Data cell
     * @param array|null $styleTable Style table
     *
     * @return boolean
     */
    public function updateTableDatas($id_table, $datas, $styleTable = null)
    {
        global $wpdb;
        $wpdb->hide_errors();

        $table_name = $wpdb->prefix . 'wptm_tbl_' . $id_table;

        if (is_array($datas['datas'])) {
            $curr_data = $datas['datas'];
        } else {
            $curr_data = json_decode(stripslashes($datas['datas']));
        }

        if (isset($datas['action']) && $datas['action'] === 'insert') {
            if (!isset($datas['type']) || $datas['type'] === 'html') {
                $wpdb->update(
                    $wpdb->prefix . 'wptm_tables',
                    array(
                        'mysql_table_name' => $table_name
                    ),
                    array(
                        'id' => $id_table
                    )
                );
                //remove old table
                $wpdb->query('DROP TABLE IF EXISTS ' . $table_name);
                $this->deleteTblInDb($wpdb->prefix . 'wptm_tbl_' . $id_table);

                //create new table
                $countCol = count($curr_data[0]);

                $columns = array();
                $column = ' (line';
                for ($i = 1; $i <= $countCol; $i++) {
                    $columnDefault = array('name' => 'col' . $i, 'type' => 'mediumtext');
                    $columns[] = $columnDefault;
                    $column .= ',col' . $i;
                }
                $column .= ')';

                $result = $this->createTblInDb('wptm_tbl_' . $id_table, $columns);

                if ($result) {
                    $max_allowed_packet = $wpdb->get_row(
                        "SHOW VARIABLES LIKE 'max_allowed_packet'"
                    );

                    $data_insert = $this->createStringDataCells($curr_data, 100, $max_allowed_packet->Value);

                    $countRow = count($data_insert);
                    for ($i = 0; $i <= $countRow; $i++) {
                        if (isset($data_insert[$i]) && $data_insert[$i] !== '') {
                            $result = $wpdb->query(
                                'insert into ' . $table_name . $column . ' values ' . $data_insert[$i]
                            );
                        }

                        if (!$result) {
                            return false;
                        }
                    }
                }
            } else {
                $wpdb->update(
                    $wpdb->prefix . 'wptm_tables',
                    array(
                        'mysql_query' => $datas['datas']
                    ),
                    array(
                        'id' => $id_table
                    )
                );
            }
        } else {
            $max_row = (int)$datas['count']['countRows'];
            $max_col = (int)$datas['count']['countCols'];
            foreach ($curr_data as $data) {
                switch ($data->action) {
                    case 'edit_cell':
                        $col_name = 'col' . ($data->col + 1);
                        $row_exists = $this->checkRowExists($table_name, $data->row);

                        if ($row_exists === null) {
                            $wpdb->insert(
                                $table_name,
                                array(
                                    'line' => $data->row,
                                    $col_name => $data->content
                                )
                            );
                        } else {
                            $wpdb->update(
                                $table_name,
                                array(
                                    'line' => $data->row,
                                    $col_name => $data->content
                                ),
                                array(
                                    'line' => $data->row,
                                )
                            );
                        }
                        $params = json_decode($this->getTableParams($id_table, ''), true);

                        if (isset($params['headerOption']) && $params['headerOption'] > 0 && $data->row < $params['headerOption']) {
                            if (count($params['header_data'][$data->row]) < $max_col) {
                                $params['header_data'][$data->row] = array_fill(0, $max_col, '');
                            }
                            $params['header_data'][$data->row][$data->col] = $data->content;
                            try {
                                $wpdb->update(
                                    $wpdb->prefix . 'wptm_tables',
                                    array(
                                        'params' => json_encode($params)
                                    ),
                                    array(
                                        'id' => $id_table
                                    )
                                );
                            } catch (Exception $e) {
                                $this->exitStatus(__('An error occurred!', 'wptm'));
                            }
                        }
                        break;
                    case 'create_col':
                        $add_cols = array();
                        for ($i = 0; $i < $data->amount; $i++) {
                            if ($data->index + $i === 0) {
                                array_push($add_cols, 'ADD COLUMN `col' . ($data->index + 1 + $i) . '` varchar(255) AFTER `line`');
                            } else {
                                array_push($add_cols, 'ADD COLUMN `col' . ($data->index + 1 + $i) . '` varchar(255) AFTER `col' . ($data->index + $i) . '`');
                            }
                        }
                        $new_cols_names = array();
                        $columns = $this->getTableDataColumns($table_name);
                        foreach ($columns as $k => $column) {
                            $db_col_index = (int)substr($column->Field, 3);
                            if ($db_col_index >= $data->index + 1) {
                                array_push($new_cols_names, 'CHANGE `' . $column->Field . '` `col' . ($k + 1 + $data->amount) . '` ' . $column->Type);
                            }
                        }
                        $check = $wpdb->query(
                            'ALTER TABLE ' . $table_name . ' ' . implode(', ', $new_cols_names)
                        );
                        if ($check) {
                            $wpdb->query(
                                'ALTER TABLE ' . $table_name . ' ' . implode(', ', $add_cols)
                            );
                        }

                        //add new columns to header/stylecells
                        $this->updateStyleAddColRow($id_table, $data->index, $data->amount, $data->left, 'col');
                        break;
                    case 'del_col':
                        $this->deleteColumns($data, $table_name);
                        $this->updateStyleRemoveColRow($id_table, $data->index, $data->amount, 'col', $data->old_columns);
                        break;
                    case 'create_row':
                        $this->addRows($data, $table_name);

                        //add new columns to header/stylecells
                        $this->updateStyleAddColRow($id_table, $data->index, $data->amount, $data->above, 'row');
                        break;
                    case 'del_row':
                        $this->removeRows($data, $table_name);
                        $this->updateStyleRemoveColRow($id_table, $data->index, $data->amount, 'row', $data->old_rows);
                        break;
                    case 'style':
                        $dataRange = new stdClass();
                        foreach ($data->selection as $range) {
                            $dataRange->row_start = $range[0] + 1;
                            $dataRange->row_end = (int)$range[2] + 1 >= $max_row ? 0 : $range[2] + 1;
                            $dataRange->col_start = $range[1] + 1;
                            $dataRange->col_end = (int)$range[3] + 1 >= $max_col ? 0 : $range[3] + 1;
                            $dataRange->style = $data->style;
                            $this->updateStyle($dataRange, $id_table);
                        }
                        break;
                    case 'set_column_type':
                        $type = $this->getColType($data->type);
                        $cols = array();
                        $count = count($data->cols);
                        for ($i = 0; $i < $count; $i++) {
                            array_push($cols, 'MODIFY COLUMN `col' . ($data->cols[$i] + 1) . '` ' . $type);
                        }
                        $check = $wpdb->query(
                            'ALTER TABLE ' . $table_name . ' ' . implode(', ', $cols)
                        );

                        if ($check) {
                            $this->updateColumnsTypes($id_table, $table_name, array('cols' => $data->cols, 'type' => $data->type));
                        } else {
                            $this->exitStatus(__('An error occurred!', 'wptm'));
                        }
                        break;
                    case 'set_columns_types':
                        $cols = array();
                        $return_cols = array();
                        foreach ($data->value as $index => $type_col) {
                            if ($type_col !== null) {
                                $type_col = $this->getColType($type_col);
                                array_push($cols, 'MODIFY COLUMN `col' . ((int)$index + 1) . '` ' . $type_col);
                                array_push($return_cols, 'col' . ($index + 1) . ' as col' . $index);
                            }
                        }
                        try {
                            $wpdb->query(
                                'ALTER TABLE ' . $table_name . ' ' . implode(', ', $cols)
                            );
                            $data_columns = $wpdb->get_results(
                                'SELECT ' . implode(', ', $return_cols) . ' FROM ' . $table_name . ' Order by line ASC'
                            );
                            if ($data_columns) {
                                $old_params = $this->getTableParams($id_table, '');
                                $this->exitStatus(true, array('id' => $id_table, 'type' => array('set_columns_types' => $data_columns, 'update_params' => stripslashes_deep($old_params))));
                            }
                        } catch (Exception $e) {
                            $this->exitStatus(__('An error occurred!', 'wptm'));
                        }
                        break;
                    case 'set_cells_type':
                        $dataRangeCellTypes = array();
                        $table_params = $this->getTableParams($id_table, '');
                        $table_params = json_decode($table_params, true);
                        $maxLengthCellTypes = count($table_params['cell_types']);

                        if (isset($table_params['cell_types'])) {//update cell_types
                            foreach ($table_params['cell_types'] as $k => $range) {
                                $dataRangeCellTypes[$range[0] . '|' . $range[1] . '|' . $range[2] . '|' . $range[3]] = $k;
                            }
                        } else {//new cell_types
                            $table_params['cell_types'] = array();
                        }

                        foreach ($data->selection as $range) {
                            $row_start = $range[0];
                            $row_range = (int)$range[2] - (int)$row_start + 1;
                            $col_start = $range[1];
                            $col_range = (int)$range[3] - (int)$col_start + 1;
                            $key = $row_start . '|' . $col_start . '|' . $row_range . '|' . $col_range;

                            if (isset($dataRangeCellTypes[$key])) {
                                $table_params['cell_types'][$dataRangeCellTypes[$key]][4] = $data->style->cell_type === 'html' ? 'html' : '';
                            } else {
                                $table_params['cell_types'][$maxLengthCellTypes] = array($row_start, $col_start, $row_range, $col_range, $data->style->cell_type === 'html' ? 'html' : '');
                                $dataRangeCellTypes[$key] = $maxLengthCellTypes;
                                $maxLengthCellTypes++;
                            }
                        }

//                        foreach ($data->selection as $range) {
//                            $row_start = $range[0];
//                            $row_range = (int)$range[2] - (int)$row_start + 1;
//                            $col_start = $range[1];
//                            $col_range = (int)$range[3] - (int)$col_start + 1;
//                            $key = $row_start . '|' . $col_start . '|' . $row_range . '|' . $col_range;
//
//                            if (isset($dataRangeCellTypes[$key]) && $data->style->cell_type !== 'html') {
//                                unset($table_params['cell_types'][$dataRangeCellTypes[$key]]);
//                            }
//                            if ($data->style->cell_type === 'html') {
//                                $table_params['cell_types'][$key] = [$row_start, $col_start, $row_range, $col_range];
//                                $dataRangeCellTypes[$key] = $key;
//                            }
//                        }

                        try {
                            $wpdb->update(
                                $wpdb->prefix . 'wptm_tables',
                                array(
                                    'params' => json_encode($table_params)
                                ),
                                array(
                                    'id' => $id_table
                                )
                            );
                        } catch (Exception $e) {
                            $this->exitStatus(__('An error occurred!', 'wptm'));
                        }
                        break;
                    case 'change_cells_value':
                        $row_start = $data->range[0][0];
                        $row_end = $data->range[0][2];
                        $col_start = $data->range[0][1];
                        $col_end = $data->range[0][3];
                        for ($i = $row_start; $i <= $row_end; $i++) {
                            for ($j = $col_start; $j <= $col_end; $j++) {
                                $col_name = 'col' . ($j + 1);
                                $row_exists = $this->checkRowExists($table_name, $i);
                                if ($row_exists === null) {
                                    $wpdb->insert(
                                        $table_name,
                                        array(
                                            'line' => $i,
                                            $col_name => $data->content
                                        )
                                    );
                                } else {
                                    $wpdb->update(
                                        $table_name,
                                        array(
                                            'line' => $i,
                                            $col_name => $data->content
                                        ),
                                        array(
                                            'line' => $i,
                                        )
                                    );
                                }
                            }
                        }
                        break;
                    case 'set_header_option':
                        $headerOption = $data->value;

                        $header_data = $this->getTableData($table_name, array( 'where' => ' line < ' . (int)$headerOption));
                        $params = json_decode($this->getTableParams($id_table, ''), true);

                        $count = count($header_data);
                        if ($count > 0) {
                            $params['header_data'] = $header_data;
                        }

                        try {
                            $wpdb->update(
                                $wpdb->prefix . 'wptm_tables',
                                array(
                                    'params' => json_encode($params)
                                ),
                                array(
                                    'id' => $id_table
                                )
                            );
                        } catch (Exception $e) {
                            $this->exitStatus(__('An error occurred!', 'wptm'));
                        }
                        break;
                }
            }
        }
        return true;
    }

    /**
     * Update style when add cols or rows
     *
     * @param integer $id_table Id table
     * @param integer $index    Index
     * @param integer $length   Length
     * @param boolean $before   Check add before or after
     * @param string  $colRow   Number col row
     *
     * @return boolean
     */
    public function updateStyleAddColRow($id_table, $index, $length, $before, $colRow)
    {
        global $wpdb;
        $range_style = $wpdb->prefix . 'wptm_range_styles';
        if (!$before) {
            $index = $index - $length;
        }

        $params = json_decode($this->getTableParams($id_table, ''), true);

        //update params cell_types
        if (isset($params['cell_types'])) {
            $new_cell_types = array();
            $count = 0;
            $count_cell_typ = count($params['cell_types']);
            for ($i = 0; $i < $count_cell_typ; $i++) {
                $cell_type = $params['cell_types'][$i];
                if ($colRow === 'col') {
                    $data = $this->updateStyleRanger($index, $length, (int)$cell_type[1] + 1, (int)$cell_type[3] + (int)$cell_type[1], true);
                    if ($data[0] === true) {
                        $new_cell_types[$count] = array($cell_type[0], $data[1] - 1, $cell_type[2], $data[2] - $data[1] + 1, $cell_type[4]);
                    } else {
                        $new_cell_types[$count] = $cell_type;
                    }
                    if (isset($data[3]['start'])) {
                        $count++;
                        $new_cell_types[$count] = array($cell_type[0],$data[3]['start'] - 1,$cell_type[2],$data[3]['end'] - $data[3]['start'] + 1, $cell_type[4]);
                    }
                }
                if ($colRow === 'row') {
                    $data = $this->updateStyleRanger($index, $length, (int)$cell_type[0] + 1, (int)$cell_type[2] + (int)$cell_type[0], true);

                    if ($data[0] === true) {
                        $new_cell_types[$count] = array($data[1] - 1, $cell_type[1], $data[2] - $data[1] + 1, $cell_type[3], $cell_type[4]);
                    } else {
                        $new_cell_types[$count] = $cell_type;
                    }
                    if (isset($data[3]['start'])) {
                        $count++;
                        $new_cell_types[$count] = array($data[3]['start'] - 1,$cell_type[1],$data[3]['end'] - $data[3]['start'] + 1,$cell_type[3], $cell_type[4]);
                    }
                }
                $count++;
            }
            try {
                $params['cell_types'] = $new_cell_types;
                $wpdb->update(
                    $wpdb->prefix . 'wptm_tables',
                    array(
                        'params' => json_encode($params)
                    ),
                    array(
                        'id' => $id_table
                    )
                );
            } catch (Exception $e) {
                $this->exitStatus(__('An error occurred!', 'wptm'));
            }
        }

        //upload style range
        $query = 'SELECT * FROM ' . $wpdb->prefix . 'wptm_range_styles as t WHERE t.id_table = ' . (int)$id_table . ' Order by t.id ASC';
        //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- sql already escaped
        $result = $wpdb->query($query);
        if ($result === false) {
            return false;
        }
        $old_style = $wpdb->get_results($query);
        $new_ranger = array();

        foreach ($old_style as $style) {
            $check = false;
            if ($colRow === 'col') {
                $data = $this->updateStyleRanger($index, $length, (int)$style->col_start, (int)$style->col_end, true);
                //($check, $row_start, $row_end, $new_ranger);
                if ($data[0] === true) {
                    $check = true;
                    $style->col_start = $data[1];
                    $style->col_end = $data[2];
                }
                if (isset($data[3]['start'])) {
                    $new_ranger[] = '(' . $id_table . ',' . $style->row_start . ',' . $style->row_end . ',' . $data[3]['start'] . ',' . $data[3]['end'] . ",'" . $style->style . "')";
                }
            }
            if ($colRow === 'row') {
                $data = $this->updateStyleRanger($index, $length, (int)$style->row_start, (int)$style->row_end, true);
                //($check, $row_start, $row_end, $new_ranger);
                if ($data[0] === true) {
                    $check = true;
                    $style->row_start = $data[1];
                    $style->row_end = $data[2];
                }
                if (isset($data[3]['start'])) {
                    $new_ranger[] = '(' . $id_table . ',' . $data[3]['start'] . ',' . $data[3]['end'] . ',' . $style->col_start . ',' . $style->col_end . ",'" . $style->style . "')";
                }
            }

            if ($check) {
                $wpdb->update(
                    $range_style,
                    array(
                        'col_start' => $style->col_start,
                        'col_end' => $style->col_end,
                        'row_start' => $style->row_start,
                        'row_end' => $style->row_end,
                    ),
                    array(
                        'id' => $style->id
                    )
                );
            }
        }
        if (count($new_ranger) > 0) {
            $result = $wpdb->query(
                'insert into ' . $range_style . ' (id_table,row_start,row_end,col_start,col_end,style) values ' . implode(',', $new_ranger)
            );
        }
    }

    /**
     * Update style ranger
     *
     * @param integer $index       Index
     * @param integer $length      Length
     * @param integer $row_start   Start row or col
     * @param integer $row_end     End row or col
     * @param boolean $addOrRemove Check remove or add row|col
     * @param integer $max_count   Max number column or row
     *
     * @return array
     */
    public function updateStyleRanger($index, $length, $row_start, $row_end, $addOrRemove, $max_count = 0)
    {
        $new_ranger = array();
        $check = false;
        if ($addOrRemove) {//add
            if ($row_start - 1 >= $index + $length) {//++
                $check = true;
                $row_end = $row_end === 0 ? 0 : $row_end + $length;
                $row_start = $row_start + $length;
            } elseif ($row_start - 1 >= $index && $row_start - 1 < $index + $length) {//++ and copy
                $check = true;

                $new_ranger['start'] = $row_start;
                $new_ranger['end'] = $row_end - 1 >= $index + $length || $row_end === 0 ? $index + $length : $row_end;

                $row_end = $row_end === 0 ? 0 : $row_end + $length;
                $row_start = $row_start + $length;
            } elseif ($row_start - 1 < $index) {
                if ($row_end - 1 >= $index + $length) {
                    $check = true;
                    $row_end = $row_end + $length;
                } elseif ($row_end - 1 < $index + $length && $row_end - 1 >= $index) {
                    $new_ranger['start'] = $index + $length + 1;
                    $new_ranger['end'] = $row_end + $length;
                }
            }
        } else {//remove
            $new_ranger['delete'] = false;
            if ($row_start - 1 >= $index + $length) {//--
                $check = true;
                $row_end = $row_end === 0 ? 0 : $row_end - $length;
                $row_start = $row_start - $length;
            } elseif ($row_start - 1 >= $index && $row_start - 1 < $index + $length) {//++ and copy
                if ($row_end  - 1 >= $index + $length) {
                    $check = true;
                    $row_start = $index + 1;
                    $row_end = $row_end - $length;
                } elseif ($row_end === 0 && $max_count > $index + $length) {
                    $check = true;
                    $row_start = $index + 1;
                } else {//remove
                    $new_ranger['delete'] = true;
                }
            } elseif ($row_start - 1 < $index) {
                if ($row_end - 1 >= $index) {
                    $check = true;
                    $row_end = $row_end - 1 >= $index + $length ? $row_end - $length : $index;
                }
            }
        }

        return array($check, $row_start, $row_end, $new_ranger);
    }

    /**
     * Update style when remove cols or rows
     *
     * @param integer $id_table         Id table
     * @param integer $index            Index
     * @param integer $length           Length
     * @param string  $colRow           Check remove column or row
     * @param array   $count_row_column Number col row
     *
     * @return boolean
     */
    public function updateStyleRemoveColRow($id_table, $index, $length, $colRow, $count_row_column)
    {
        global $wpdb;
        $range_style = $wpdb->prefix . 'wptm_range_styles';

        $params = json_decode($this->getTableParams($id_table, ''), true);

        //update params cell_types
        if (isset($params['cell_types'])) {
            $count = 0;
            $count_cell_typ = count($params['cell_types']);
            $new_cell_type = array();
            for ($i = 0; $i < $count_cell_typ; $i++) {
                $cell_type = $params['cell_types'][$i];
                if ($colRow === 'col') {
                    $data = $this->updateStyleRanger($index, $length, (int)$cell_type[1] + 1, (int)$cell_type[3] + (int)$cell_type[1], false, $count_row_column);

                    if ($data[0]) {
                        $new_cell_type[$count] = array($cell_type[0], $data[1] - 1, $cell_type[2], $data[2] - $data[1] + 1, $cell_type[4]);
                    } elseif (!$data[3]['delete']) {
                        $new_cell_type[$count] = $cell_type;
                    }
                }
                if ($colRow === 'row') {
                    $data = $this->updateStyleRanger($index, $length, (int)$cell_type[0] + 1, (int)$cell_type[2] + (int)$cell_type[0], false, $count_row_column);
                    if ($data[0]) {
                        $new_cell_type[$count] = array($data[1] - 1, $cell_type[1], $data[2] - $data[1] + 1, $cell_type[3], $cell_type[4]);
                    } elseif (!$data[3]['delete']) {
                        $new_cell_type[$count] = $cell_type;
                    }
                }
                $count++;
            }
            unset($params['cell_types']);
            $params['cell_types'] = $new_cell_type;

            try {
                $wpdb->update(
                    $wpdb->prefix . 'wptm_tables',
                    array(
                        'params' => json_encode($params)
                    ),
                    array(
                        'id' => $id_table
                    )
                );
            } catch (Exception $e) {
                $this->exitStatus(__('An error occurred!', 'wptm'));
            }
        }

        //upload style range
        $query = 'SELECT * FROM ' . $wpdb->prefix . 'wptm_range_styles as t WHERE t.id_table = ' . (int)$id_table . ' Order by t.id ASC';
        //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- sql already escaped
        $result = $wpdb->query($query);
        if ($result === false) {
            return false;
        }
        $old_style = $wpdb->get_results($query);

        foreach ($old_style as $style) {
            $check = false;
            if ($colRow === 'col') {
                $data = $this->updateStyleRanger($index, $length, (int)$style->col_start, (int)$style->col_end, false, $count_row_column);
                //($check, $row_start, $row_end, $new_ranger);
                if ($data[0] === true) {
                    $check = true;
                    $style->col_start = $data[1];
                    $style->col_end = $data[2];
                }
                if ($data[3]['delete']) {
                    $wpdb->delete(
                        $range_style,
                        array('id' => $style->id)
                    );
                }
            }
            if ($colRow === 'row') {
                $data = $this->updateStyleRanger($index, $length, (int)$style->row_start, (int)$style->row_end, false, $count_row_column);
                //($check, $row_start, $row_end, $new_ranger);
                if ($data[0] === true) {
                    $check = true;
                    $style->row_start = $data[1];
                    $style->row_end = $data[2];
                }
                if ($data[3]['delete']) {
                    $wpdb->delete(
                        $range_style,
                        array('id' => $style->id)
                    );
                }
            }

            if ($check) {
                $wpdb->update(
                    $range_style,
                    array(
                        'col_start' => $style->col_start,
                        'col_end' => $style->col_end,
                        'row_start' => $style->row_start,
                        'row_end' => $style->row_end,
                    ),
                    array(
                        'id' => $style->id
                    )
                );
            }
        }
    }

    /**
     * Crate string cells data before query
     *
     * @param array   $curr_data          Data cells
     * @param integer $length             Length
     * @param integer $max_allowed_packet Max allowed packet
     *
     * @return array
     */
    public function createStringDataCells($curr_data, $length, $max_allowed_packet)
    {
        global $wpdb;
        $data = array();
        $countRow = count($curr_data);
        $first_rows = $countRow % $length;//0
        $number_query = ($countRow / $length);//20
        $maxRowInsert = 0;

        $countCol = count($curr_data[0]);
        $stringPrepare = '';
        for ($ii = 0; $ii < $countCol; $ii++) {
            $stringPrepare .= ',%s';
        }
        $stringPrepare .= ')';

        for ($i = 0; $i <= $number_query; $i++) {
            $string = '';
            for ($j = $maxRowInsert; $j < $i * $length + $first_rows; $j++) {
                if ($string !== '') {
                    $string .= ',';
                }

                $string .= '(' . $j;
                $string .= $wpdb->prepare(
                    $stringPrepare,
                    $curr_data[$j]
                );
            }
            $maxRowInsert = $i * $length + $first_rows;

            if ($string !== '') {
                $size = strlen($string);
                if ($size < ((int)$max_allowed_packet - 10)) {//
                    $data[$i] = $string;
                } else {
                    return $this->createStringDataCells($curr_data, 2, $max_allowed_packet);
                }
            }
        }
        return $data;
    }

    /**
     * Check max length for columns content
     *
     * @param string  $name_table Table name
     * @param integer $columns    Number column
     *
     * @return array|boolean
     */
    public function checkLengthColumn($name_table, $columns)
    {
        global $wpdb;
        $cols = array();
        $col_type = array();

        for ($i = 1; $i <= $columns; $i++) {
            $result = $wpdb->query(
                'SELECT MAX(LENGTH(col' . $i . ')) as number FROM ' . $name_table
            );
            if ($result) {
                $result = $wpdb->get_row(
                    'SELECT MAX(LENGTH(col' . $i . ')) as number FROM ' . $name_table
                );
                $max = $result->number;
                if ($max < 250) {//varchar
                    array_push($cols, 'MODIFY COLUMN `col' . $i . '` VARCHAR(255)');
                    $col_type[] = 'VARCHAR(255)';
                } elseif ($max < 65000) {//text
                    array_push($cols, 'MODIFY COLUMN `col' . $i . '` TEXT');
                    $col_type[] = 'TEXT';
                } else {
                    array_push($cols, 'MODIFY COLUMN `col' . $i . '` MEDIUMTEXT');
                    $col_type[] = 'MEDIUMTEXT';
                }
            }
        }
        $check = $wpdb->query(
            'ALTER TABLE ' . $name_table . ' ' . implode(', ', $cols)
        );

        if ($check) {
            return $col_type;
        } else {
            return false;
        }
    }

    /**
     * Replace type column
     *
     * @param string $data Column type
     *
     * @return string
     */
    public function getColType($data)
    {
        if ($data === 'int') {
            $type = 'INT(11)';
        } elseif ($data === 'float') {
            $type = 'DECIMAL(16,3)';
        } elseif ($data === 'date') {
            $type = 'DATE';
        } elseif ($data === 'datetime') {
            $type = 'DATETIME';
        } elseif ($data === 'text') {
            $type = 'TEXT';
        } else {
            $type = 'VARCHAR(255)';
        }

        return $type;
    }

    /**
     * Update columns type
     *
     * @param integer $id_table   Table id
     * @param string  $table_name Table name
     * @param array   $data       Data table
     *
     * @return void
     */
    public function updateColumnsTypes($id_table, $table_name, $data)
    {
        global $wpdb;
        $cols = array();
        $columns = $this->getTableDataColumns($table_name);
        foreach ($columns as $k => $column) {
            if (in_array($k, $data['cols'])) {
                $cols[$k] = $data['type'];
            }
        }
        $col_types = $this->getTableParams($id_table, 'col_types');
        $table_params = $this->getTableParams($id_table, '');
        if (empty($col_types)) {
            $table_params = json_decode($table_params);
            $cols = $this->getTableDataColumns($table_name);
            $new_col_types = array();
            foreach ($cols as $k => $col) {
                if (preg_match('/varchar/i', $col->Type)) {
                    $new_col_types[$k] = 'varchar';
                } elseif (preg_match('/int/i', $col->Type)) {
                    $new_col_types[$k] = 'int';
                } elseif (preg_match('/decimal/i', $col->Type)) {
                    $new_col_types[$k] = 'float';
                } elseif (preg_match('/text/i', $col->Type)) {
                    $new_col_types[$k] = 'text';
                } elseif (preg_match('/date/i', $col->Type)) {
                    $new_col_types[$k] = 'date';
                } elseif (preg_match('/datetime/i', $col->Type)) {
                    $new_col_types[$k] = 'datetime';
                } else {
                    $new_col_types[$k] = 'varchar';
                }
            }
            $table_params->col_types = $new_col_types;
            $wpdb->update(
                $wpdb->prefix . 'wptm_tables',
                array(
                    'params' => json_encode($table_params)
                ),
                array(
                    'id' => $id_table
                )
            );
        } else {
            $table_params = json_decode($table_params);
            $count = count($table_params->col_types);
            for ($i = 0; $i < $count; $i++) {
                foreach ($cols as $k => $col) {
                    if ($i === $k) {
                        $table_params->col_types[$i] = $col;
                    } else {
                        continue;
                    }
                }
            }
            $wpdb->update(
                $wpdb->prefix . 'wptm_tables',
                array(
                    'params' => json_encode($table_params)
                ),
                array(
                    'id' => $id_table
                )
            );
        }
    }

    /**
     * Get table params
     *
     * @param integer $id_table   Table id
     * @param string  $param_name Param name
     *
     * @return array|mixed|string|null
     */
    public function getTableParams($id_table, $param_name)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'wptm_tables';
        $params = $wpdb->get_var(
            $wpdb->prepare(
                'SELECT params FROM ' . $table_name . ' WHERE id = %d',
                $id_table
            )
        );
        if (is_string($params)) {
            $params = str_replace(array("\n\r", "\r\n", "\n", "\r", '&#10;'), ' ', $params);
        }
        if ($param_name === '') {
            return $params === null ? array() : $params;
        } else {
            if ($params === null) {
                return array();
            } else {
                $params = (array)json_decode($params);
                if ($param_name !== '' && isset($params[$param_name])) {
                    return $params[$param_name];
                } else {
                    return array();
                }
            }
        }
    }

    /**
     * Check the range style exists
     *
     * @param string $row_start Row start
     * @param string $row_end   Row end
     * @param string $col_start Col start
     * @param string $col_end   Col end
     * @param string $id_table  Table id
     *
     * @return boolean|string|null
     */
    public function checkRangeStyleExists($row_start, $row_end, $col_start, $col_end, $id_table = '')
    {
        if ($id_table === '') {
            return false;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'wptm_range_styles';
        $result = $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . $table_name . ' WHERE row_start = %d AND row_end = %d AND col_start = %d AND col_end = %d AND id_table = %d',
                $row_start,
                $row_end,
                $col_start,
                $col_end,
                $id_table
            )
        );

        if ($result) {
            return $result;
        } else {
            return null;
        }
    }

    /**
     * Get lat ranger style of table
     *
     * @param string $id_table Table id
     *
     * @return array|boolean|object|void|null
     */
    public function getTableLastRange($id_table = '')
    {
        if ($id_table === '') {
            return false;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'wptm_range_styles';
        $result = $wpdb->get_row(
            $wpdb->prepare(
                'SELECT * FROM ' . $table_name . ' WHERE id_table = %d ORDER BY id DESC LIMIT 0,1',
                $id_table
            )
        );

        if ($result) {
            return $result;
        } else {
            return null;
        }
    }

    /**
     * Update style table
     *
     * @param object $data     Data
     * @param string $id_table Table id
     *
     * @return boolean
     */
    public function updateStyle($data, $id_table = '')
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'wptm_range_styles';

        if ($id_table === '' || empty($data)) {
            return false;
        }
        $range_exists = $this->checkRangeStyleExists($data->row_start, $data->row_end, $data->col_start, $data->col_end, $id_table);
        if ($range_exists === null) {
            $wpdb->insert(
                $table_name,
                array(
                    'id_table' => $id_table,
                    'row_start' => $data->row_start,
                    'row_end' => $data->row_end,
                    'col_start' => $data->col_start,
                    'col_end' => $data->col_end,
                    'style' => json_encode($data->style)
                )
            );
        } else {
            $new_style = (array)$data->style;
            $last_range = $this->getTableLastRange($id_table);

            foreach ($range_exists as $k => $value) {
                $old_styles = json_decode($value->style, true);
                $new_value_old_range = array_diff_key($old_styles, $new_style);//not overlap
                $overlap_value = array_diff_key($old_styles, $new_style);//overlap

                if (!empty($overlap_value) && !empty($new_value_old_range)) {
                    $wpdb->update(
                        $table_name,
                        array(
                            'style' => json_encode($new_value_old_range)
                        ),
                        array(
                            'row_start' => $data->row_start,
                            'row_end' => $data->row_end,
                            'col_start' => $data->col_start,
                            'col_end' => $data->col_end,
                            'id' => (int)$value->id
                        )
                    );
                }
                if (empty($new_value_old_range) && (int) $last_range->id !== (int) $value->id) {//all overlap
                    $wpdb->delete(
                        $table_name,
                        array('id' => $value->id)
                    );
                }
            }

            $old_styles = (array)json_decode($last_range->style);
            if ((int)$last_range->row_start === (int)$data->row_start
                && (int)$last_range->row_end === (int)$data->row_end
                && (int)$last_range->col_start === (int)$data->col_start
                && (int)$last_range->col_end === (int)$data->col_end) {
                $curr_styles = array_merge($old_styles, $new_style);
                $wpdb->update(
                    $table_name,
                    array(
                        'style' => json_encode($curr_styles)
                    ),
                    array(
                        'row_start' => $data->row_start,
                        'row_end' => $data->row_end,
                        'col_start' => $data->col_start,
                        'col_end' => $data->col_end,
                        'id' => (int)$value->id
                    )
                );
            } else {
                $wpdb->insert(
                    $table_name,
                    array(
                        'id_table' => $id_table,
                        'row_start' => $data->row_start,
                        'row_end' => $data->row_end,
                        'col_start' => $data->col_start,
                        'col_end' => $data->col_end,
                        'style' => json_encode($new_style)
                    )
                );
            }
        }
    }

    /**
     * Delete column(s)
     *
     * @param object $data       Data
     * @param string $table_name Table name
     *
     * @return boolean
     */
    public function deleteColumns($data, $table_name = '')
    {
        global $wpdb;

        if ($table_name === '' || empty($data)) {
            return false;
        }

        $drop_cols = array();
        for ($i = 0; $i < $data->amount; $i++) {
            array_push($drop_cols, 'DROP COLUMN `col' . ($data->index + 1 + $i) . '`');
        }
        $wpdb->query(
            'ALTER TABLE ' . $table_name .' ' . implode(', ', $drop_cols)
        );
        $new_cols_names = array();
        $columns = $this->getTableDataColumns($table_name);
        $count = count($columns);
        for ($i = 0; $i < $count; $i++) {
            $col_index = (int)substr($columns[$i]->Field, 3) - 1;
            if ($col_index >= $data->index + 1) {
                array_push($new_cols_names, 'CHANGE `' . $columns[$i]->Field . '` `col' . ($i + 1) . '` ' . $columns[$i]->Type);
            }
        }
        $wpdb->query(
            'ALTER TABLE ' . table_name . ' ' . implode(', ', $new_cols_names)
        );

        return true;
    }

    /**
     * Add more row into table in database
     *
     * @param object $data       Data
     * @param string $table_name Table name
     *
     * @return boolean
     */
    public function addRows($data, $table_name = '')
    {
        global $wpdb;
        if ($table_name === '' || empty($data)) {
            return false;
        }

        //update the rows have line value bigger than data->index
        $result = $wpdb->query(
            $wpdb->prepare(
                'UPDATE ' . $table_name . ' SET line = line + %d WHERE line >= %d',
                $data->amount,
                $data->index
            )
        );

        //insert rows into table in database
        if ($result) {
            for ($i = 0; $i < $data->amount; $i++) {
                $wpdb->insert(
                    $table_name,
                    array(
                        'line' => $data->index + $i
                    )
                );
            }
        }

        return true;
    }

    /**
     * Remove row(s) of table in database and update column line
     *
     * @param object $data       Data
     * @param string $table_name Table name
     *
     * @return boolean
     */
    public function removeRows($data, $table_name = '')
    {
        global $wpdb;

        if ($table_name === '' || empty($data)) {
            return false;
        }
        $delete_rows_lines = array();
        for ($i = 0; $i < $data->amount; $i++) {
            array_push($delete_rows_lines, $data->index + $i);
        }
        $max_row_index = $data->index + $data->amount - 1;
        $result = $wpdb->query(
            'DELETE FROM ' . $table_name . ' WHERE line IN (' . implode(', ', $delete_rows_lines) . ')'
        );
        if ($result) {
            //update line for other row
            $wpdb->query(
                $wpdb->prepare(
                    'UPDATE ' . $table_name . ' SET line = line - %d WHERE line >= %d',
                    $data->amount,
                    $max_row_index
                )
            );
        }

        return true;
    }

    /**
     * Update style to range cells table
     *
     * @param integer $id_table Id table
     * @param array   $datas    Table data
     *
     * @return void|boolean
     */
    public function updateCellsStyle($id_table, $datas)
    {
        global $wpdb;

        if (!empty($datas['styleCells']) && $datas['action'] === 'insert' && count($datas['styleCells']) > 0) {
            $string = '';

            foreach ($datas['styleCells'] as $item) {
                if ((int)$item[1] === (int)$datas['numberRow']) {//row end
                    $item[1] = 0;
                }
                if ((int)$item[3] === (int)$datas['numberCol']) {//column end
                    $item[3] = 0;
                }

                if ($string !== '') {
                    $string .= ',';
                }
                $string .= '(' . $id_table . ',' . $item[0] . ',' . $item[1] . ',' . $item[2] . ',' . $item[3] . ",'" . $item[4] . "')";
            }

            $result = $wpdb->query(
                'insert into ' . $wpdb->prefix . 'wptm_range_styles (id_table,row_start,row_end,col_start,col_end,style) values ' . $string
            );
            if (!$result) {
                return false;
            }
        }
    }

    /**
     * Get all column in current table name
     *
     * @param string  $table_name Table name
     * @param boolean $all        Get all columns
     *
     * @return array
     */
    public function getTableDataColumns($table_name, $all = false)
    {
        global $wpdb;
        $columns_query = 'SHOW COLUMNS FROM ' . $table_name;
        $columns_obj = $wpdb->get_results($columns_query);
        $columns = array();
        foreach ($columns_obj as $column_obj) {
            if (($column_obj->Field === 'ID' || $column_obj->Field === 'line') && !$all) {
                continue;
            }
            array_push($columns, $column_obj);
        }
        return $columns;
    }

    /**
     * Add new table
     *
     * @param integer $id_category Id category
     *
     * @return array
     */
    public function add($id_category)
    {
        global $wpdb;

        $defaultColTypes = array(
            'col_types' => array(
                'varchar(255)',
                'varchar(255)',
                'varchar(255)',
                'varchar(255)',
                'varchar(255)',
                'varchar(255)',
                'varchar(255)',
                'varchar(255)',
                'varchar(255)',
                'varchar(255)'
            )
        );

        $lastPos = (int)$wpdb->get_var($wpdb->prepare('SELECT MAX(c.position) AS lastPos FROM ' . $wpdb->prefix . 'wptm_tables as c WHERE c.id_category = %d', (int)$id_category));
        $lastPos++;
        $wpdb->query(
            $wpdb->prepare(
                'INSERT INTO ' . $wpdb->prefix . 'wptm_tables (id_category, title, params, created_time, modified_time, author, position, type) VALUES ( %d,%s,%s,%s,%s,%d,%d,%s)',
                $id_category,
                __('New table', 'wptm'),
                json_encode($defaultColTypes),
                date('Y-m-d H:i:s'),
                date('Y-m-d H:i:s'),
                get_current_user_id(),
                $lastPos,
                'html'
            )
        );

        $columns = array();
        for ($i = 1; $i <= 10; $i++) {
            $columnDefault = array('name' => 'col' . $i, 'type' => 'string');
            $columns[] = $columnDefault;
        }

        $result = $this->createTblInDb('wptm_tbl_' . $wpdb->insert_id, $columns);
        if ($result) {
            $updateSql = 'UPDATE ' . $wpdb->prefix . 'wptm_tables SET mysql_table_name = %s WHERE id = %d';
            $wpdb->query(
                $wpdb->prepare($updateSql, $wpdb->prefix . 'wptm_tbl_' . $wpdb->insert_id, $wpdb->insert_id)
            );
        }

        $id_table = $wpdb->insert_id;

        $result = $wpdb->query(
            'insert into ' . $wpdb->prefix . 'wptm_tbl_' . $wpdb->insert_id . " (line,col1) values (0, ''),(1, ''),(2, ''),(3, ''),(4, ''),(5, ''),(6, ''),(7, ''),(8, ''),(9, '')"
        );

        $table_name = $wpdb->prefix . 'wptm_range_styles';

        $wpdb->insert(
            $table_name,
            array(
                'id_table' => $id_table,
                'row_start' => 1,
                'row_end' => 0,
                'col_start' => 1,
                'col_end' => 0,
                'style' => '{"cell_border_left": "1px solid #d6d6d6", "cell_border_top": "1px solid #d6d6d6", "cell_border_right": "1px solid #d6d6d6", "cell_border_bottom": "1px solid #d6d6d6"}'
            )
        );

        return array($id_table, $lastPos);
    }

    /**
     * Create table in database
     *
     * @param integer $tblName Id table
     * @param array   $columns Column data
     *
     * @return boolean|integer
     */
    public function createTblInDb($tblName, $columns)
    {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        $wpdb->show_errors();

        $sql = 'CREATE TABLE ' . $wpdb->prefix . $tblName . ' (
                        ID int(11) NOT NULL AUTO_INCREMENT,
                        line int(11) NOT NULL,';

        foreach ($columns as $column) {
            $sql .= $this->sqlCreateColumn($column) . ', ';
        }

        $sql .= 'PRIMARY KEY  (id) 
                ) ' . $charset_collate . ';';
        // echo $sql; die();
        $wpdb->query($sql);

        $db_error = $wpdb->last_error;
        if ($db_error !== '') {
            $this->deleteTblInDb($wpdb->prefix . $tblName);
            throw new Exception(__('There was an error when trying to create the table on MySQL side', 'wptm') . ': ' . $db_error);
        }

        return true;
    }

    /**
     * Create columns for new table
     *
     * @param array $column Column data
     *
     * @return string
     */
    public function sqlCreateColumn($column)
    {
        $name = $column['name'];
        switch ($column['type']) {
            case 'int':
                $sql_block = $name . ' INT(11) ';
                break;

            case 'float':
                $sql_block = $name . ' DECIMAL(16,4) ';
                break;

            case 'date':
                $sql_block = $name . ' DATE ';
                break;

            case 'datetime':
                $sql_block = $name . ' DATETIME ';
                break;

            case 'text':
                $sql_block = $name . ' TEXT ';
                break;

            case 'mediumtext':
                $sql_block = $name . ' MEDIUMTEXT ';
                break;

            default:
                $sql_block = $name . ' VARCHAR(255) ';
                break;
        }

        return $sql_block;
    }

    /**
     * Also delete the style of current table in db
     *
     * @param string $table_id Table id
     *
     * @return boolean
     */
    public function deleteTblStyle($table_id = '')
    {
        if ($table_id === '') {
            return false;
        }
        global $wpdb;
        $style_table_name = $wpdb->prefix . 'wptm_range_styles';
        $result = $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $style_table_name . ' WHERE id_table = %d',
                $table_id
            )
        );
        if ($result) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Delete a table in database
     *
     * @param string $tblName Name table
     *
     * @return boolean
     */
    public function deleteTblInDb($tblName)
    {
        global $wpdb;
        $result = $wpdb->query(
            'DROP TABLE IF EXISTS ' . $tblName
        );
        return $result;
    }

    /**
     * Copy table
     *
     * @param integer $id_table Id table
     *
     * @return boolean|integer
     */
    public function copy($id_table)
    {
        global $wpdb;

        $result = $wpdb->query($wpdb->prepare('SELECT c.* FROM ' . $wpdb->prefix . 'wptm_tables as c WHERE c.id = %d', (int)$id_table));
        if ($result === false) {
            return false;
        }
        $table = $wpdb->get_row($wpdb->prepare('SELECT c.* FROM ' . $wpdb->prefix . 'wptm_tables as c WHERE c.id = %d', (int)$id_table), OBJECT);
        $wpdb->query(
            $wpdb->prepare(
                'INSERT INTO ' . $wpdb->prefix . 'wptm_tables (id_category, title, mysql_table_name, style, mysql_query, css,hash,params,created_time, modified_time, author, position, type) VALUES ( %d,%s,%s,%s,%s,%s,%s,%s,%s,%s,%d,%d,%s)',
                $table->id_category,
                $table->title . __(' (copy)', 'wptm'),
                '',
                $table->style,
                $table->mysql_query,
                $table->css,
                $table->hash,
                $table->params,
                date('Y-m-d H:i:s'),
                date('Y-m-d H:i:s'),
                get_current_user_id(),
                $table->position,
                $table->type
            )
        );
        $id_new_table = $wpdb->insert_id;

        //copy data
        if ($table->type !== 'mysql') {
            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            $result = maybe_create_table($wpdb->prefix . 'wptm_tbl_' . $id_new_table, 'CREATE TABLE ' . $wpdb->prefix . 'wptm_tbl_' . $id_new_table . ' AS SELECT * FROM ' . $wpdb->prefix . 'wptm_tbl_' . $id_table);
            //$wpdb->prefix . 'wptm_tbl_' . $id
            if ($result === false) {
                $result = $wpdb->query(
                    $wpdb->prepare(
                        'DELETE FROM ' . $wpdb->prefix . 'wptm_tables WHERE id = ' . $id_table
                    )
                );
                return false;
            }
        }

        $updateSql = 'UPDATE ' . $wpdb->prefix . 'wptm_tables SET mysql_table_name = %s WHERE id = %d';
        $wpdb->query(
            $wpdb->prepare($updateSql, $wpdb->prefix . 'wptm_tbl_' . $id_new_table, $id_new_table)
        );

        //copy style range
        $query = 'SELECT * FROM ' . $wpdb->prefix . 'wptm_range_styles as t WHERE t.id_table = ' . (int)$id_table . ' Order by t.id ASC';
        //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- sql already escaped
        $result = $wpdb->query($query);
        if ($result === false) {
            return false;
        }
        $old_style = $wpdb->get_results($query);
        $count = count($old_style);

        for ($i = 0; $i < $count; $i++) {
            $wpdb->query(
                $wpdb->prepare(
                    'INSERT INTO ' . $wpdb->prefix . 'wptm_range_styles (id_table, row_start, row_end, col_start, col_end, style) VALUES ( %d,%d,%d,%d,%d,%s)',
                    $id_new_table,
                    $old_style[$i]->row_start,
                    $old_style[$i]->row_end,
                    $old_style[$i]->col_start,
                    $old_style[$i]->col_end,
                    $old_style[$i]->style
                )
            );
        }

        return $id_new_table;
    }

    /**
     * Function delete table
     *
     * @param integer $id Id table
     *
     * @return false|integer
     */
    public function delete($id)
    {
        global $wpdb;
        $listId = json_decode($id, true);
        $count = count($listId);

        for ($i = 0; $i < $count; $i++) {
            $data = 'id = ' . $listId[$i];

            $result = $wpdb->query(
                $wpdb->prepare(
                    'DELETE FROM ' . $wpdb->prefix . 'wptm_tables WHERE ' . $data
                )
            );
            $this->deleteTblInDb($wpdb->prefix . 'wptm_tbl_' . (int)$listId[$i]);
            $this->deleteTblStyle((int)$listId[$i]);
        }

        return $result;
    }

    /**
     * Function set title of table
     *
     * @param integer $id    Id table
     * @param string  $title Title table
     *
     * @return false|integer
     */
    public function setTitle($id, $title)
    {
        global $wpdb;
        $result = $wpdb->update(
            $wpdb->prefix . 'wptm_tables',
            array('title' => $title, 'modified_time' => date('Y-m-d H:i:s')),
            array('id' => (int)$id)
        );

        return $result;
    }

    /**
     * Check if current table need load via ajax
     *
     * @param integer $id Table id
     *
     * @return boolean|integer
     */
    public function needAjaxLoad($id)
    {
        global $wpdb;

        $table = $wpdb->get_row('SELECT mysql_table_name, type, params FROM ' . $wpdb->prefix . 'wptm_tables WHERE id = ' . intval($id));
        $params = json_decode($table->params);
        $total = $this->countRows($id, $table);

        // Check paginations and limit
        $enable_pagination = isset($params->enable_pagination) && $params->enable_pagination ? true : false;
        $limit = isset($params->limit_rows) && $params->limit_rows ? intval($params->limit_rows) : 0;
        // todo: update this value when commit
        $minRows = apply_filters('wptm_minimum_rows_ajax', 50);
        if ($total > 0 && $enable_pagination && $total > $limit && $total >= $minRows) {
            return true;
        }

        return false;
    }

    /**
     * Get count filter rows
     *
     * @param integer     $id    Id table
     * @param string      $where Where in query
     * @param null|object $table Data table
     *
     * @return integer
     */
    public function countFilterRows($id, $where = '', $table = null)
    {
        global $wpdb;
        if (is_null($table)) {
            $table = $wpdb->get_row('SELECT mysql_table_name, type, params FROM ' . $wpdb->prefix . 'wptm_tables WHERE id = ' . intval($id));
        }
        $params = $table->params;
        if (is_string($params)) {
            $params = json_decode($table->params);
        }

        if ($where !== '') {
            $where = ' WHERE ' . $where;
        }
        if ($table && $table->type === 'mysql') {
            $tables = implode(', ', $params->tables);
            // todo: need to rebuild query with more options
            $total = intval($wpdb->get_var('SELECT COUNT(*) as total FROM ' . $tables . $where));
        } else {
            $total = intval($wpdb->get_var('SELECT COUNT(*) as total FROM ' . $table->mysql_table_name . $where));
        }

        return $total;
    }

    /**
     * Get count row of table
     *
     * @param integer     $id    Id table
     * @param null|object $table Table data
     *
     * @return integer
     */
    public function countRows($id, $table = null)
    {
        global $wpdb;
        if (is_null($table)) {
            $table = $wpdb->get_row('SELECT mysql_table_name, type, params FROM ' . $wpdb->prefix . 'wptm_tables WHERE id = ' . intval($id));
        }
        $params = $table->params;
        if (is_string($params)) {
            $params = json_decode($table->params);
        }

        if ($table && $table->type === 'mysql') {
            $tables = implode(', ', $params->tables);
            // todo: need to rebuild query with more options
            $total = intval($wpdb->get_var('SELECT COUNT(*) as total FROM ' . $tables));
        } else {
            $total = intval($wpdb->get_var('SELECT COUNT(*) as total FROM ' . $table->mysql_table_name));
        }

        return $total;
    }

    /**
     * Get count column of table
     *
     * @param integer     $id    Id table
     * @param null|object $table Table data
     *
     * @return boolean|integer|void
     */
    public function countColumns($id, $table = null)
    {
        global $wpdb;
        if (is_null($table)) {
            $table = $wpdb->get_row('SELECT mysql_table_name, type, params FROM ' . $wpdb->prefix . 'wptm_tables WHERE id = ' . intval($id));
        }

        if (is_null($table->mysql_table_name)) {
            return false;
        }
        $columns = $this->getTableDataColumns($table->mysql_table_name);

        if (is_array($columns) && count($columns) > 0) {
            return count($columns);
        }

        return false;
    }

    /**
     * Function get table data from wptm_backup table database
     *
     * @param integer $id Id of table
     *
     * @return array|false|mixed
     */
    public function getItemFromBackup($id)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'wptm_backup';
        $item = $wpdb->get_row($wpdb->prepare('SELECT c.* FROM ' . $table_name . ' as c WHERE c.id = %d', (int)$id), OBJECT);

        if (!$item || is_null($item)) {
            return false;
        }
        $item->params = str_replace(array("\n\r", "\r\n", "\n", "\r", '&#10;'), ' ', $item->params);
        $item->params = json_decode($item->params);

        if ($item->style === '') {
            $item->style = new stdClass();
        } else {
            $item->style = json_decode(stripslashes_deep($item->style));
        }

        $item->css = preg_replace('/\\\n/', '', $item->css);
        return stripslashes_deep($item);
    }

    /**
     * Function select table
     *
     * @param integer        $id             Id table
     * @param boolean        $get_data       Get data cell for table
     * @param boolean        $get_style_cell Get cells style for table
     * @param boolean|string $table_name     Get data from table_name/wptm_tables
     * @param boolean        $limit          Get limit cells data in db_table
     *
     * @return boolean|mixed
     */
    public function getItem($id, $get_data = true, $get_style_cell = true, $table_name = null, $limit = true)
    {
        global $wpdb;
        if ($table_name === null) {
            $table_name = $wpdb->prefix . 'wptm_tables';
        } else {
            $table_name = $wpdb->prefix . $table_name;
        }

        $item = $wpdb->get_row($wpdb->prepare('SELECT c.* FROM ' . $table_name . ' as c WHERE c.id = %d', (int)$id), OBJECT);

        if (!$item || is_null($item)) {
            return false;
        }
        $item->params = str_replace(array("\n\r", "\r\n", "\n", "\r", '&#10;'), ' ', $item->params);
        $params = json_decode($item->params);

        if ($item->style === '') {
            $item->style = new stdClass();
        } else {
            $item->style = json_decode(stripslashes_deep($item->style));
        }

        if (isset($params->query)) {
            $params->query = str_replace(array("\n\r", "\r\n", "\n", "\r", '&#10;'), ' ', $params->query);
        }

        $item->params = $params;

        if (isset($item->params->table_type) && $item->params->table_type === 'mysql' && $item->type !== 'html') {
            $item->params->col_types = $this->getTypeColumnMysql($item->params->mysql_columns, $item->params->tables);
        }

        $item->style->table = $item->params;

        if (isset($params->query) && $params->query !== '') {
            if ($limit) {
                $tableData = $this->getDbTableData(stripslashes_deep($params->query . ' Limit 50'));
            } else {
                $tableData = $this->getDbTableData(stripslashes_deep($params->query));
            }

            if (gettype($tableData) === 'array' && !empty($tableData)) {
                $cols = array_keys($tableData[0]);
                $headerCols = array();
                $i = 0;
                foreach ($cols as $col) {
                    $headerCols[$col] = $params->custom_titles[$i];
                    $i++;
                }

                array_unshift($tableData, $headerCols);
                $item->datas = $tableData;
            } else {
                $item->datas = array(
                    array('')
                );
            }
            foreach ($item->datas as $key => $datas) {
                $item->datas[$key] = array_values($datas);
            }
        } elseif (isset($item->mysql_table_name) && $item->mysql_table_name !== '' && $get_data) {
            $item->datas = $this->getTableData($item->mysql_table_name);
        }

        if (isset($item->style->table->headerOption) && $item->style->table->headerOption > 0 && isset($item->style->table->header_data)) {
            for ($i = 0; $i < $item->style->table->headerOption; $i++) {
                if (isset($item->style->table->header_data[$i])) {
                    $item->datas[$i] = $item->style->table->header_data[$i];
                }
            }
        }

        if ($get_style_cell) {
            $count = array();
            if (isset($item->datas) && $item->datas !== '' && $get_data) {
                $count['row'] = count($item->datas);
                $count['column'] = count($item->datas[0]);
            } elseif (!$get_data) {
                $count['row'] = $this->countRows($id);
                $count['column'] = $this->countColumns($id);
            }
            $item->style->cells = new stdClass();
            $item->style->cells = $this->getCellsStyle($id, $count);
            $item->style->cells = $this->mergeCellTypesIntoCells($item);
        }
        if (!$get_data && isset($item->datas)) {
            unset($item->datas);
        }
        $item->css = preg_replace('/\\\n/', '', $item->css);
        return stripslashes_deep($item);
    }

    /**
     * Get columns type in mysql table
     *
     * @param array $listColumns List column in db_table
     * @param array $listTable   List table in db_table
     *
     * @return array
     */
    public function getTypeColumnMysql($listColumns, $listTable)
    {
        global $wpdb;
        $data = array();
        $columns = array();
        foreach ($listTable as $table) {
            $columns_query = 'SHOW COLUMNS FROM ' . $table;
            $columns_obj = $wpdb->get_results($columns_query);
            $columns[$table] = array();
            foreach ($columns_obj as $column_obj) {
                $key = array_keys($listColumns, $table . '.' . $column_obj->Field);
                if (isset($key[0])) {
                    $data[$key[0]] = $column_obj->Type;
                }
            }
        }
        return $data;
    }

    /**
     * Merge style cell
     *
     * @param object $item Table data
     *
     * @return mixed
     */
    public function mergeCellTypesIntoCells($item)
    {
        $cell_types = !isset($item->params->cell_types) || $item->params->cell_types === null ? array() : (array)$item->params->cell_types;
        $count = count($cell_types);

        for ($ii = 0; $ii < $count; $ii++) {
            $cell_type = $cell_types[$ii];
            for ($i = 0; $i < $cell_type[2]; $i++) {
                for ($j = 0; $j < $cell_type[3]; $j++) {
                    $k = ($cell_type[0] + $i) . '!' . ($cell_type[1] + $j);
                    if (!isset($item->style->cells[$k])) {
                        $item->style->cells[$k] = array();
                        $item->style->cells[$k][0] = $cell_type[0] + $i;
                        $item->style->cells[$k][1] = $cell_type[1] + $j;
                        $item->style->cells[$k][2] = array();
                    }

                    if ($cell_type[4] === 'html') {
                        $item->style->cells[$k][2]['cell_type'] = 'html';
                    } else {
                        $item->style->cells[$k][2]['cell_type'] = '';
                    }
                }
            }
        }
        return $item->style->cells;
    }

    /**
     * Set position table
     *
     * @param string $id     Id table
     * @param string $tables Data position table
     *
     * @return false|integer
     */
    public function setPosition($id, $tables)
    {
        global $wpdb;

        $result = $wpdb->update(
            $wpdb->prefix . 'wptm_tables',
            array('position' => $tables, 'modified_time' => date('Y-m-d H:i:s')),
            array('id' => (int)$id)
        );

        return $result;
    }

    /**
     * Set category to table
     *
     * @param integer $id       Id table
     * @param integer $category Id category
     *
     * @return false|integer
     */
    public function setCategory($id, $category)
    {
        global $wpdb;
        $result = $wpdb->update(
            $wpdb->prefix . 'wptm_tables',
            array('id_category' => $category, 'position' => 0, 'modified_time' => date('Y-m-d H:i:s')),
            array('id' => (int)$id)
        );
        return $result;
    }

    /**
     * Get category parent to table
     *
     * @param integer $id Id table
     *
     * @return false|integer
     */
    public function getCategoryById($id)
    {
        global $wpdb;
        $query = 'SELECT t.id_category, t.type FROM ' . $wpdb->prefix . 'wptm_tables as t WHERE id = ' . $id;

        //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- No variable from user in the query
        $result = $wpdb->get_results($query);
        return $result;
    }


    /**
     * Get result style cells of table
     *
     * @param integer $id    Id table
     * @param array   $count Number row and column
     *
     * @return array|boolean
     */
    public function getCellsStyle($id, $count)
    {
        global $wpdb;
        $query = 'SELECT row_start, row_end, col_start, col_end, style FROM ' . $wpdb->prefix . 'wptm_range_styles as t WHERE t.id_table = ' . (int)$id . ' Order by t.id ASC';
        //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- sql already escaped
        $result = $wpdb->query($query);
        if ($result === false) {
            return false;
        }
        $styles = $wpdb->get_results($query, ARRAY_A);
        $cell_styles = $this->convertRangeStyleToCellStyle($styles, $count);
        //phpcs:ignore WordPress.WP.PreparedSQL.NotPrepared -- sql already escaped
        return $cell_styles;
    }

    /**
     * Convert current object to js format
     *
     * @param object $data_styles Data cells style
     * @param array  $count       Number row and column
     *
     * @return array|boolean
     */
    public function convertRangeStyleToCellStyle($data_styles, $count)
    {
        if (empty($data_styles)) {
            return array();
        }
        $styles = array();
        if (!isset($count['row'])) {
            $count['row'] = 10;
        }
        if (!isset($count['column'])) {
            $count['column'] = 10;
        }
        foreach ($data_styles as $style) {
            $row_end = 0 === (int)$style['row_end'] ? $count['row'] : $style['row_end'];
            $col_end = 0 === (int)$style['col_end'] ? $count['column'] : $style['col_end'];
            for ($i = $style['row_start'] - 1; $i <= $row_end - 1; $i++) {
                for ($j = $style['col_start'] - 1; $j <= $col_end - 1; $j++) {
                    $index = $i . '!' . $j;
                    $old_data = isset($styles[$index]) ? $styles[$index] : null;
                    if ($old_data === null) {
                        $styles[$index] = array((int)$i, (int)$j, json_decode($style['style'], true));
                    } else {
                        $new_data = json_decode($style['style']);
                        $old_data_style = $old_data[2];
                        $merged_data = array_merge((array) $old_data_style, (array) $new_data);
                        $styles[$index] = array((int)$i, (int)$j, $merged_data);
                    }
                }
            }
        }
        return $styles;
    }

    /**
     * Get result data of table
     *
     * @param string $name    Name table
     * @param array  $filters Query filters
     *
     * @return array|boolean
     */
    public function getTableData($name, $filters = array())
    {
        global $wpdb;
        $columns = array();
        if (!isset($filters['cols']) || (isset($filters['cols']) && $filters['cols'] === null)) {
            $columns_query = 'SHOW COLUMNS FROM ' . $name;
            $columns_obj = $wpdb->get_results($columns_query);
            foreach ($columns_obj as $column_obj) {
                if ($column_obj->Field === 'ID' || $column_obj->Field === 'line') {
                    continue;
                }
                $col_index = (int)substr($column_obj->Field, 3) - 1;
                array_push($columns, $column_obj->Field . ' as `a' . $col_index . '`');
            }
        } else {
            array_push($columns, 'line');
            if (isset($filters['cols']) && is_array($filters['cols']) && count($filters['cols'])) {
                foreach ($filters['cols'] as $column) {
                    array_push($columns, 'col' . ($column + 1) . ' as `a' . $column . '`');
                }
            }
        }

        if (count($columns) < 1) {
            return false;
        }
        $limitQuery = '';

        $limit = isset($filters['limit']) ? $filters['limit'] : -1;
        $page = isset($filters['page']) ? $filters['page'] : 1;
        $headerOffset = isset($filters['headerOffset']) ? $filters['headerOffset'] : 1;

        $where = (isset($filters['where']) && $filters['where'] !== '') ? ' WHERE ' . $filters['where'] : '';
        $order = (isset($filters['order']) && $filters['order'] !== '') ? ' ORDER BY ' . $filters['order'] : ' ORDER BY line ASC';

        if ($limit > -1 && wp_doing_ajax()) {
            if ($page === 1) {
                $offset = 0;
            } else {
                $offset = ($page - 1) * $limit;
            }
            if ($headerOffset > 0 && $page === 1 && $where === '') {
                $offset += $headerOffset;
                $limit -= $headerOffset;
            }
            // Add intval() for security reason
            $limitQuery = ' LIMIT ' . intval($offset) . ', ' . intval($limit);
        }
        $select = implode(',', $columns);

        if (isset($filters['getLine']) && $filters['getLine'] === true) {
            $select = ' line as DT_RowId, ' . $select;
        }
        $query = 'SELECT ' . $select . ' FROM ' . $name . $where . $order . $limitQuery;

        $data = $wpdb->get_results($query, ARRAY_A);

        if (!is_countable($data) || empty($data) || is_null($data)) {
            return false;
        }

        if (isset($filters['getLine']) && $filters['getLine'] === true) {
            // Include line as DT_RowId, use for ajax call. You will need to reset array key in use
            $data = array_map(function ($cells) {
                $DT_RowId = isset($cells['DT_RowId']) ? $cells['DT_RowId'] : false;

                if (!$DT_RowId) {
                    return $cells;
                }
                unset($cells['DT_RowId']);
                $newCells = array_values($cells);
                $newCells['DT_RowId'] = $DT_RowId;

                return $newCells;
            }, $data);
        } else {
            foreach ($data as $k => $v) {
                $data[$k] = array_values($v);
            }
        }

        return $data;
    }

    /**
     * Get result data of build query
     *
     * @param string $query Query
     *
     * @return array|boolean|null|object
     */
    public function getDbTableData($query)
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

    /**
     * Delete old style table
     *
     * @param integer $id Id table
     *
     * @return boolean
     */
    public function deleteOldStyle($id)
    {
        global $wpdb;

        $result = $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->prefix . 'wptm_range_styles WHERE id_table = %d',
                (int)$id
            )
        );

        if ($result === false) {
            return false;
        }

        $result = $wpdb->update(
            $wpdb->prefix . 'wptm_tables',
            array('style' => '', 'modified_time' => date('Y-m-d H:i:s')),
            array('id' => (int)$id)
        );
        return $result;
    }

    /**
     * Function backup data from wp_wptm_tables table
     *
     * @return boolean
     */
    public function backupTable()
    {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        global $wpdb;

        $result = maybe_create_table($wpdb->prefix . 'wptm_backup', 'CREATE TABLE ' . $wpdb->prefix . 'wptm_backup AS SELECT * FROM ' . $wpdb->prefix . 'wptm_tables');

        if ($result === false) {
            return false;
        }
        return true;
    }

    /**
     * Function create range_style table
     *
     * @return boolean
     */
    public function createRangeStyle()
    {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        $sql = 'CREATE TABLE ' . $wpdb->prefix . 'wptm_range_styles (
			id int(11) NOT NULL AUTO_INCREMENT,
		    id_table int(11) NOT NULL,
		    row_start int(11) NOT NULL,
		    row_end int(11) NOT NULL,
		    col_start int(11) NOT NULL,
		    col_end int(11) NOT NULL,
		    style text NOT NULL,
		    PRIMARY KEY  (id)
      ) ' . $charset_collate . ';';

        $result = maybe_create_table($wpdb->prefix . 'wptm_range_styles', $sql);

        if ($result === false) {
            return false;
        }

        return true;
    }

    /**
     * Function change table data
     *
     * @return boolean
     */
    public function changeTableData()
    {
        global $wpdb;
        $result = $wpdb->get_col('DESC ' . $wpdb->prefix . 'wptm_tables', 0);

        if (!empty($result)) {
            if (in_array('mysql_table_name', $result)) {
                return true;
            }
            $result = $wpdb->query(
                'ALTER TABLE ' . $wpdb->prefix . 'wptm_tables ADD COLUMN mysql_table_name VARCHAR(50) AFTER title, ADD COLUMN mysql_query TEXT AFTER style'
            );
        } else {
            return true;
        }

        if (!$result) {
            return false;
        }
        return true;
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
