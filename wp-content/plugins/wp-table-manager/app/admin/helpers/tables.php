<?php
/**
 * WP Table Manager
 *
 * @package WP Table Manager
 * @author  Joomunited
 * @version 1.0
 */

/**
 * Class WptmTablesHelper
 */
class WptmTablesHelper
{
    /**
     * Convert an object of files to a multidimentional array
     *
     * @param array /object $tables Table array
     *
     * @return array
     */
    public static function categoryObject($tables)
    {
        $ordered = array();
        foreach ($tables as $table) {
            $ordered[$table->id_category][] = $table;
        }
        return $ordered;
    }

    /**
     * Convert a list of charts to a multidimentional array
     *
     * @param array /object $charts Chart array
     *
     * @return array
     */
    public static function categoryCharts($charts)
    {
        $ordered = array();
        foreach ($charts as $chart) {
            $chart->modified_time = self::convertDate($chart->modified_time);
            $ordered[$chart->id_table][] = $chart;
        }
        return $ordered;
    }

    /**
     * Function convert date string to date format
     *
     * @param string $date Date string
     *
     * @return string
     */
    public static function convertDate($date)
    {
        if (get_option('date_format', null) !== null) {
            $date = date_create($date);
            $date = date_format($date, get_option('date_format') . ' ' . get_option('time_format'));
        }
        return $date;
    }
    /**
     * Parse data table
     *
     * @param object $item Data Table
     *
     * @return array
     */
    public static function parseItem($item)
    {
        $newData = array();
        $newData['type'] = isset($item->type) ? $item->type : $item->params->table_type;

        if ($newData['type'] === 'html') {
            //convert data cells
            $newData['datas'] = json_decode($item->datas);
        } else {
            $newData['datas'] = $item->datas;
        }

        /*convert param*/
        $newData['params'] = new stdClass();
        if (isset($item->params)) {
            $newData['params'] = $item->params;
        }
        if (isset($item->style->table)) {
            foreach ($item->style->table as $key => $table) {
                if (!isset($newData['params']->{$key})) {
                    $newData['params']->{$key} = $table;
                    if ($key === 'freeze_row' && (int)$table > 0) {
                        $newData['params']->{$key} = 1;
                        $newData['params']->headerOption = (int)$table;
                    }
                }
            }
        }
        /*convert style*/
        $newData['style'] = new stdClass();
        $newData['style']->rows = isset($item->style->rows) ? $item->style->rows : new stdClass();
        $newData['style']->cols = isset($item->style->cols) ? $item->style->cols : new stdClass();
        $newData['style'] = json_encode($newData['style']);
        $newData['numberRow'] = count($newData['datas']);
        $newData['numberCol'] = count($newData['datas'][0]);

        $newData['css'] = $item->css;

        if (isset($item->style->cells)) {
            $styleCells = self::mergeStyleCell($item->style->cells, $newData['numberRow'], $newData['numberCol']);
            $newData['styleCells'] = $styleCells['styleCells'];
            $newData['params']->cell_types = $styleCells['typeCells'];
        }
        return $newData;
    }

    /**
     * Create range style cells
     *
     * @param object  $cells Style cells
     * @param integer $row   Style row
     * @param integer $col   Style col
     *
     * @return array
     */
    public static function mergeStyleCell($cells, $row, $col)
    {
        $data = array();
        $content = array();
        $typeCells = array();

        for ($i = 0; $i < $row; $i++) {
            for ($j = 0; $j < $col; $j++) {
                if (isset($cells->{$i . '!' . $j})) {
                    $cell = $cells->{$i . '!' . $j};

                    $content[$cell[0] . '|' . $cell[1]] = array($cell[0],$cell[0],$cell[1],$cell[1]);
                    if (isset($cell[2]->width)) {
                        unset($cell[2]->width);
                    }
                    if (isset($cell[2]->height)) {
                        unset($cell[2]->height);
                    }
                    if (isset($cell[2]->cell_type)) {
                        if ($cell[2]->cell_type === 'html') {
                            $typeCells[] = array($cell[0], $cell[1], 1, 1, 'html');
                        } elseif ($cell[2]->cell_type === null) {
                            $typeCells[] = array($cell[0], $cell[1], 1, 1, '');
                        }
                        unset($cell[2]->cell_type);
                    }
                    array_push($content[$cell[0] . '|' . $cell[1]], json_encode($cell[2]));
                    if (isset($content[$cell[0] . '|' . ($cell[1] - 1)])) {
                        $cell_before = $content[$cell[0] . '|' . ($cell[1] - 1)];
                        if (!isset($cell_before[4])) {
                            $cell_before = $content[$cell_before[0] . '|' . $cell_before[2]];
                        }
                        if ($cell_before[4] === $content[$cell[0] . '|' . $cell[1]][4]) {
                            $content[$cell_before[0] . '|' . $cell_before[2]][3] = $content[$cell[0] . '|' . $cell[1]][3];
                            $data[$cell_before[0] . '|' . $cell_before[2]][3] = $content[$cell[0] . '|' . $cell[1]][3];
                            $content[$cell[0] . '|' . $cell[1]][2] = $cell_before[2];
                            unset($content[$cell[0] . '|' . $cell[1]][4]);
                        }
                    }
                    if (isset($content[$cell[0] . '|' . $cell[1]][4])) {
                        $data[$cell[0] . '|' . $cell[1]] = $content[$cell[0] . '|' . $cell[1]];
                    }
                }
            }
        }

        $content = array();
        foreach ($data as $cell) {
            if (isset($data[($cell[0] - 1) . '|' . $cell[2]])) {
                $cell_before = $data[($cell[0] - 1) . '|' . $cell[2]];
                if (!isset($cell_before[4])) {
                    $cell_before = $data[$cell_before[0] . '|' . $cell_before[2]];
                }
                if ($cell_before[4] === $cell[4] && $cell_before[3] === $cell[3]) {
                    $data[$cell_before[0] . '|' . $cell_before[2]][1] = $cell[1];
                    $content[$cell_before[0] . '|' . $cell_before[2]][1] = $cell[1];
                    $data[$cell[0] . '|' . $cell[2]][0] = $cell_before[0];
                    unset($data[$cell[0] . '|' . $cell[2]][4]);
                }
            }
            if (isset($data[$cell[0] . '|' . $cell[2]][4])) {
                $content[$cell[0] . '|' . $cell[2]] = $data[$cell[0] . '|' . $cell[2]];
            }
        }

        $style_cells = array();
        foreach ($content as $cell) {
            $cell[0]++;
            $cell[1]++;
            $cell[2]++;
            $cell[3]++;
            $style_cells[($cell[0] + 1). '|' . ($cell[2] + 1)] = $cell;
        }

        return array('styleCells'=>$style_cells, 'typeCells'=> $typeCells);
    }

    /**
     * Change theme to table
     *
     * @param object $item Data theme
     *
     * @return array
     */
    public static function changeThemeToTable($item)
    {
        $item->datas  = $item->data;
        $item->type   = 'html';
        $item->params = new stdClass();

        if ($item->style === '') {
            $item->style = new stdClass();
        } else {
            $item->style = json_decode(stripslashes_deep($item->style));
        }

        $newData = self::parseItem($item);

        return $newData;
    }
}
