<?php
/**
 * WP Table Manager
 *
 * @package WP Table Manager
 * @author  Joomunited
 * @version 1.0
 */
use Joomunited\WPFramework\v1_0_5\Application;
use Joomunited\WPFramework\v1_0_5\Model;

//-- No direct access
defined('ABSPATH') || die();

/**
 * Class WptmHelper
 */
class WptmHelper
{
    /**
     * Result Calculator
     *
     * @var string
     */
    protected static $resultCalc;
    /**
     * Date formats
     *
     * @var string
     */
    public $date_formats;
    /**
     * Symbol position
     *
     * @var string
     */
    public $symbol_position;
    /**
     * Currency symbol
     *
     * @var string
     */
    public $currency_symbol;
    /**
     * Decimal symbol
     *
     * @var string
     */
    public $decimal_symbol;
    /**
     * Decimal count
     *
     * @var string
     */
    public $decimal_count;
    /**
     * Thousand symbol
     *
     * @var string
     */
    public $thousand_symbol;
    /**
     * Date var
     *
     * @var array
     */
    protected static $date;
    /**
     * Number cells in calculator
     *
     * @var integer
     */
    protected static $n;

    /**
     * Compile style table/chart
     *
     * @param object $table     Data table
     * @param array  $styles    Style table
     * @param string $customCss Custom css
     *
     * @return boolean
     */
    public static function compileStyle($table, $styles, $customCss)
    {
        $folder = wp_upload_dir();
        $folder = $folder['basedir'] . DIRECTORY_SEPARATOR . 'wptm' . DIRECTORY_SEPARATOR;
        if (!file_exists($folder)) {
            mkdir($folder, 0777, true);
        }

        $file = $folder . $table->id . '_' . $table->hash . '.css';

        if (!file_exists($file)) {
            $files = glob($folder . $table->id . '_*.css');
            foreach ($files as $f) {
                unlink($f);
            }
        } else {
            return true;
        }
        $folder_admin = dirname(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin';
        require_once $folder_admin . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'lessc.inc.php';
        if (!class_exists('csstidy')) {
            require_once $folder_admin . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'csstidy' . DIRECTORY_SEPARATOR . 'class.csstidy.php';
        }

        $countStyles = count($styles);
        $contents    = array();
        $contents[0] = '';

        for ($i = 0; $i < $countStyles; $i ++) {
            $style = $styles[$i];
            $less  = new lessc;

            try {
                $contents[$i] = $less->compile('#wptmtable' . $table->id . '.wptmtable {' . $style . '}');
            } catch (Exception $exc) {
                return false;
            }

            try {
                $customContent = $less->compile('#wptmtable' . $table->id . '.wptmtable table {' . $customCss . '}');
            } catch (Exception $exc) {
                $customContent = '';
            }

            $contents[$i] .= $customContent;
            $csstidy      = new csstidy();
            $csstidy->parse($contents[$i]);

            $less->setFormatter('compressed');

            try {
                //phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped -- The inner variables were esc
                $contents[$i] = $less->compile($csstidy->print->plain());
            } catch (Exception $exc) {
                return false;
            }
        }

        if (isset($contents[1])) {
            $content = implode($contents);
        } else {
            $content = $contents[0];
        }

        $style = $table->style;
        $alignCss = '';
        $table_align = !isset($style->table->table_align) ? 'left' : $style->table->table_align;
        switch ($table_align) {
            case 'left':
                $alignCss .= 'margin : 0 auto 0 0';
                break;
            case 'right':
                $alignCss .= 'margin : 0 0 0 auto';
                break;
            case 'none':
                break;
            case 'center':
            default:
                $alignCss .= 'margin : 0 auto 0 auto';
                break;
        }
        $content .= '#wptmtable' . $table->id . '.wptmtable .dataTables_scrollHead .dataTables_scrollHeadInner { '. $alignCss .' }';

        if (!file_put_contents($file, $content)) {
            return false;
        }
        return true;
    }

    /**
     * Check .cc or .html file exist
     *
     * @param string  $id     Table id
     * @param string  $hash   Table hash
     * @param boolean $isHtml Check html file or css file
     *
     * @return boolean
     */
    public function checkFileExists($id, $hash, $isHtml)
    {
        $folder = wp_upload_dir();
        $folder = $folder['basedir'] . DIRECTORY_SEPARATOR . 'wptm' . DIRECTORY_SEPARATOR;
        if (!file_exists($folder)) {
            mkdir($folder, 0777, true);
            return false;
        }
        if ($isHtml) {
            $file = $folder . $id . '_' . $hash . '.html';
        } else {
            $file = $folder . $id . '_' . $hash . '.css';
        }

        if (!file_exists($file)) {
            if ($isHtml) {
                $files = glob($folder . $id . '_*.html');
            } else {
                $files = glob($folder . $id . '_*.css');
            }
            foreach ($files as $f) {
                unlink($f);
            }
        } else {
            return true;
        }
        return false;
    }

    /**
     * Render style table
     *
     * @param object $table Data table
     *
     * @return boolean|array
     */
    public function styleRender($table)
    {
        $file = $this->checkFileExists($table->id, $table->hash, false);
        if ($file) {
            return true;
        }
        $style = $table->style;
        $contents = array();

        $style_tooltip = array();
        if ($style === null) {
            $contents[0] = '';
        } else {
            $contentTable = 'table {';
            //render global table params
            if (isset($style->table->alternate_row_odd_color) && $style->table->alternate_row_odd_color) {
                $contentTable .= 'tr:nth-child(even) td {background-color: ' . $style->table->alternate_row_odd_color . ';}';
            }
            if (isset($style->table->alternate_row_even_color) && $style->table->alternate_row_even_color) {
                $contentTable .= 'tr:nth-child(odd) td {background-color: ' . $style->table->alternate_row_even_color . ';}';
            }
            if (isset($style->table->row_border) && $style->table->row_border) {
                $contentTable .= 'tr td {border-bottom: ' . $style->table->row_border . ';}';
            }

            //render global cols
            foreach ($style->cols as $numberCol => $col) {
                if (!empty($col)) {
                    $firstCol = is_object($col) ? $col->{1} : $col[1];
                    $contentTable .= '.dtc' . (int) ($numberCol) . ' {';
                    if (isset($firstCol->width)) {
                        $contentTable .= ' width: ' . (int) $firstCol->width . 'px; min-width: ' . (int) $firstCol->width . 'px;';
                    }

                    foreach ($firstCol as $numberStyleCol => $styleCol) {
                        if ($numberStyleCol !== 'width') {
                            $contentTable .= $this->addStyleColsRows(
                                $styleCol,
                                null,
                                null,
                                $numberStyleCol
                            );
                        }
                    }
                    $contentTable .= '}';
                }
            }

            //render global rows
            if (!(!isset($style->table->allRowHeight) || $style->table->allRowHeight === '')) {
                $contentTable .= ' td, th {height: ' . (int)$style->table->allRowHeight . 'px;}';
            }
            foreach ($style->rows as $numberRow => $row) {
                $contentTable .= '.dtr' . (int)$numberRow . ' {';

                if (is_object($row) && isset($row->{1}->height)) {
                    $styleRows = $row->{1};
                    $contentTable .= ' height: ' . (int)$row->{1}->height . 'px;';
                } elseif (is_array($row) && isset($row[1]->height)) {
                    $styleRows = $row[1];
                    $contentTable .= ' height: ' . (int)$row[1]->height . 'px;';
                } else {
                    $styleRows = null;
                }

                if ($styleRows !== null) {
                    foreach ($styleRows as $numberStyleRow => $styleRow) {
                        if ($numberStyleRow !== 'height') {
                            $contentTable .= $this->addStyleColsRows(
                                $styleRow,
                                null,
                                null,
                                $numberStyleRow
                            );
                        }
                    }
                }

                $contentTable .= '}';
            }

            if ($table->type === 'mysql') {
                if (isset($style->table->allAlternate)) {
                    $contentTable .= 'tbody tr.odd td {background-color: '.$style->table->allAlternate->old.'}';
                    $contentTable .= 'tbody tr.even td {background-color: '.$style->table->allAlternate->even.'}';
                    if ($style->table->allAlternate->header) {
                        $contentTable .= 'thead tr:first-child th {background-color: '.$style->table->allAlternate->header.'}';
                    }
                }
            }

            $content2 = '';
            if (isset($style->table->width) && $style->table->width > 0) {
                $content2 .= '& {width : ' . $style->table->width . 'px;}';
            }

            if (!isset($style->table->table_align)) {
                $style->table->table_align = 'center';
            }

            switch ($style->table->table_align) {
                case 'left':
                    $content2 .= '& {margin : 0 auto 0 0 }';
                    break;
                case 'right':
                    $content2 .= '& {margin : 0 0 0 auto }';
                    break;
                case 'none':
                    break;
                case 'center':
                default:
                    $content2 .= '& {margin : 0 auto 0 auto }';
                    break;
            }
            $content2 .= '}';

            $i = 0;
            $content = '';
            $alternateColorValue = !empty($style->table->alternateColorValue) ? $style->table->alternateColorValue : null;

            foreach ($style->cells as $cell) {
                $rowStyle = null;
                $colStyle = null;
                if (isset($style->rows->{(int)($cell[0])})) {
                    $rowStyle = is_object($style->rows->{(int)($cell[0])}) ? $style->rows->{(int)($cell[0])}->{1} : $style->rows->{(int)($cell[0])}[1];
                }
                if (isset($style->cols->{(int)($cell[1])})) {
                    $colStyle = is_object($style->cols->{(int)($cell[1])}) ? $style->cols->{(int)($cell[1])}->{1} : $style->cols->{(int)($cell[1])}[1];
                }

                $cell_style = '';
                //render global table params
                $AlternateColor = null;
                if (isset($cell[2]['AlternateColor'])) {
                    if (is_object($alternateColorValue) && isset($alternateColorValue->{$cell[2]['AlternateColor']})) {
                        $AlternateColor = $alternateColorValue->{$cell[2]['AlternateColor']};
                    } elseif (is_array($alternateColorValue) && isset($alternateColorValue[$cell[2]['AlternateColor']])) {
                        $AlternateColor = $alternateColorValue[$cell[2]['AlternateColor']];
                    }
                }

                if (isset($AlternateColor)) {
                    $numberRow = 0;
                    if ($AlternateColor->header === '') {
                        $numberRow = -1;
                    }
                    switch ($cell[0]) {
                        case $AlternateColor->selection[0]:
                            if ($AlternateColor->header === '') {
                                $cell_style .= 'background-color: ' . $AlternateColor->even . '; ';
                            } else {
                                $cell_style .= 'background-color: ' . $AlternateColor->header . '; ';
                            }
                            break;
                        case $AlternateColor->selection[2]:
                            if ($AlternateColor->footer === '') {
                                if (($cell[0] - (int)($AlternateColor->selection[0] + $numberRow)) % 2) {
                                    $cell_style .= 'background-color: ' . $AlternateColor->even . '; ';
                                } else {
                                    $cell_style .= 'background-color: ' . $AlternateColor->old . '; ';
                                }
                            } else {
                                $cell_style .= 'background-color: ' . $AlternateColor->footer . '; ';
                            }
                            break;
                        default:
                            if (($cell[0] - (int)($AlternateColor->selection[0] + $numberRow)) % 2) {
                                $cell_style .= 'background-color: ' . $AlternateColor->even . '; ';
                            } else {
                                $cell_style .= 'background-color: ' . $AlternateColor->old . '; ';
                            }
                            break;
                    }
                }

                $cell_style .= $this->addStyleColsRows(
                    isset($colStyle) && isset($colStyle->cell_background_color) ? $colStyle->cell_background_color : null,
                    isset($rowStyle) && isset($rowStyle->cell_background_color) ? $rowStyle->cell_background_color : null,
                    $cell,
                    'cell_background_color'
                );

                foreach ($cell[2] as $keyStyleCell => $styleCell) {
                    if (in_array($keyStyleCell, array(
                        'cell_border_top',
                        'cell_border_right',
                        'cell_border_bottom',
                        'cell_border_left',
                        'cell_font_family',
                        'cell_font_size',
                        'cell_font_color',
                        'cell_font_bold',
                        'cell_font_italic',
                        'cell_font_underline',
                        'cell_text_align',
                        'cell_padding_left',
                        'cell_vertical_align',
                        'cell_padding_top',
                        'cell_padding_right',
                        'cell_padding_bottom',
                        'cell_background_radius_left_top',
                        'cell_background_radius_right_top',
                        'cell_background_radius_right_bottom',
                        'cell_background_radius_left_bottom',
                        'cell_border_bottom'))) {
                        $cell_style .= $this->addStyleColsRows(
                            isset($colStyle) && isset($colStyle->{$keyStyleCell}) ? $colStyle->{$keyStyleCell} : null,
                            isset($rowStyle) && isset($rowStyle->{$keyStyleCell}) ? $rowStyle->{$keyStyleCell} : null,
                            $cell,
                            $keyStyleCell
                        );
                    }
                }

                $content .= '.dtr'.(int)($cell[0]).'.dtc'.(int)($cell[1]).' {'. $cell_style . '}';
                if (isset($cell[2]['tooltip_width']) && !empty($cell[2]['tooltip_width'])) {
                    $style_tooltip[(int) ($cell[0]) . '_'. (int) ($cell[1])] = $cell[2]['tooltip_width'];
                }
                $i++;
                if ($i > 0 && $i % 1000 === 0) {
                    $contents[$i / 1000 - 1] = $contentTable . $content . $content2;
                    $content = '';
                }
            }

            $count_content = count($contents);
            $contents[$count_content] = $contentTable . $content . $content2;
        }
        require_once dirname(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'site' . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'wptmHelper.php';
        self::compileStyle($table, $contents, $table->css);

        $data_return = array(
            'tooltip' => $style_tooltip
        );

        return array ('data' => $data_return);
    }

    /**
     * Merge style col, row, cell
     *
     * @param string $cols Col  style
     * @param string $rows Row  style
     * @param array  $cell List style
     * @param string $key  Name style
     *
     * @return string
     */
    public function addStyleColsRows($cols, $rows, $cell, $key)
    {
        if (isset($cell) && isset($cell[2][$key]) && false !== $cell[2][$key]) {
            $value = $cell[2][$key];
        } elseif (isset($rows)) {
            $value = $rows;
        } elseif (isset($cols)) {
            $value = $cols;
        }
        $content = '';
        if (isset($value)) {
            switch ($key) {
                case 'cell_background_color':
                    if ($value !== '') {
                        $content = ' background-color: ' . $value . '; ';
                    }
                    break;
                case 'cell_border_top':
                    $check = explode(' ', $value);
                    if ($check[0] !== 'none' && $value !== '') {
                        $content = ' border-top: ' . $value . '; ';
                    }
                    break;
                case 'cell_border_right':
                    $check = explode(' ', $value);
                    if ($check[0] !== 'none' && $value !== '') {
                        $content = ' border-right: ' . $value . '; ';
                    }
                    break;
                case 'cell_border_bottom':
                    $check = explode(' ', $value);
                    if ($check[0] !== 'none' && $value !== '') {
                        $content = ' border-bottom: ' . $value . '; ';
                    }
                    break;
                case 'cell_border_left':
                    $check = explode(' ', $value);
                    if ($check[0] !== 'none' && $value !== '') {
                        $content = ' border-left: ' . $value . '; ';
                    }
                    break;
                case 'cell_font_family':
                    if ($value !== '') {
                        $content = ' font-family: ' . $value . '; ';
                    }
                    break;
                case 'cell_font_size':
                    if ($value !== '') {
                        $content = ' font-size: ' . $value . 'px;';
                    }
                    break;
                case 'cell_font_color':
                    if ($value !== '') {
                        $content = ' color: ' . $value . '; ';
                    }
                    break;
                case 'cell_font_bold':
                    $content = ' font-weight: bold;';
                    break;
                case 'cell_font_italic':
                    $content = ' font-style: italic;';
                    break;
                case 'cell_font_underline':
                    $content = ' text-decoration: underline;';
                    break;
                case 'cell_text_align':
                    if ($value !== '') {
                        $content = ' text-align: ' . $value . '; ';
                    }
                    break;
                case 'cell_vertical_align':
                    if ($value !== '') {
                        $content = ' vertical-align: ' . $value . '; ';
                    }
                    break;
                case 'cell_padding_left':
                    if ($value !== '') {
                        $content = ' padding-left: ' . $value . 'px;';
                    }
                    break;
                case 'cell_padding_top':
                    if ($value !== '') {
                        $content = ' padding-top: ' . $value . 'px;';
                    }
                    break;
                case 'cell_padding_right':
                    if ($value !== '') {
                        $content = ' padding-right: ' . $value . 'px;';
                    }
                    break;
                case 'cell_padding_bottom':
                    if ($value !== '') {
                        $content = ' padding-bottom: ' . $value . 'px;';
                    }
                    break;
                case 'cell_background_radius_left_top':
                    if ($value !== '') {
                        $content = ' border-top-left-radius: ' . $value . 'px;';
                    }
                    break;
                case 'cell_background_radius_right_top':
                    if ($value !== '') {
                        $content = ' border-top-right-radius: ' . $value . 'px;';
                    }
                    break;
                case 'cell_background_radius_right_bottom':
                    if ($value !== '') {
                        $content = ' border-bottom-right-radius: ' . $value . 'px;';
                    }
                    break;
                case 'cell_background_radius_left_bottom':
                    if ($value !== '') {
                        $content = ' border-bottom-left-radius: ' . $value . 'px;';
                    }
                    break;
            }
        }

        return $content;
    }

    /**
     * Render html
     *
     * @param object  $table        Data table
     * @param array   $configParams Config param data
     * @param array   $dataStyle    Data style(tooltip, ...)
     * @param string  $table_hash   Hash string
     * @param boolean $getData      Get data or build header only. Default true
     *
     * @return boolean
     */
    public function htmlRender($table, $configParams, $dataStyle, $table_hash, $getData = true)
    {
        $folder = wp_upload_dir();
        $folder = $folder['basedir'] . DIRECTORY_SEPARATOR . 'wptm' . DIRECTORY_SEPARATOR;
        if (!empty($dataStyle['tooltip'])) {
            $data_tooltip = $dataStyle['tooltip'];
        }
        if (!file_exists($folder)) {
            mkdir($folder, 0777, true);
        }

        $file = $folder . $table->id . '_' . $table_hash . '.html';
        $tblStyles = $table->style;
        if (!isset($tblStyles->table)) {
            $tblStyles->table = new stdClass();
        }

        if ($getData &&  (empty($table->datas) || $table->datas === '' || !is_array($table->datas))) {
            return true;
        }

        $datas = null;
        if ($getData && isset($table->datas)) {
            $datas = $table->datas;
        }

        //header
        if (!isset($tblStyles->table->headerOption) || (int)$tblStyles->table->headerOption < 1) {//header not exist
            $heads = 1;
            if (isset($datas[0])) {
                $header_data = array($datas[0]);
            } elseif (!empty($tblStyles->table->header_data)) {
                $header_data = $tblStyles->table->header_data;
            } else {
                $header_data = null;
            }
        } else {
            $heads = (int)$tblStyles->table->headerOption;
            if (isset($tblStyles->table->header_data[(int)$tblStyles->table->headerOption - 1])) {
                $header_data = $tblStyles->table->header_data;
            } else {//header_data not exist
                $header_data = array();
                for ($header_number = 0; $header_number < $tblStyles->table->headerOption; $header_number++) {
                    $header_data[$header_number] = $datas[$header_number];
                }
            }
        }

        if (!$getData && is_null($datas)) {
            $datas = $header_data;
        }

        if (!file_exists($file)) {
            $files = glob($folder . $table->id . '_*.html');
            foreach ($files as $f) {
                unlink($f);
            }
        } else {
            // sync google sheet automatically on front-end
            $fetchNewData = false;
            $app = Application::getInstance('Wptm');
            if ($app->isSite()) {
                $modelConfig = Model::getInstance('configSite');
                $params = $modelConfig->getConfig();

                if (isset($params['sync_periodicity']) && (string) $params['sync_periodicity'] !== '0') {
                    if ((isset($tblStyles->table->spreadsheet_url) && $tblStyles->table->spreadsheet_url !== ''
                            && isset($tblStyles->table->auto_sync) && (int)$tblStyles->table->auto_sync === 1)
                        || (isset($tblStyles->table->excel_url) && $tblStyles->table->excel_url !== ''
                            && isset($tblStyles->table->excel_auto_sync) && (int)$tblStyles->table->excel_auto_sync === 1)) {
                        $modifed = filemtime($file);
                        $time_now = (int) strtotime(date('Y-m-d H:i:s'));

                        if (($time_now - $modifed) / 3600 >= (float)$params['sync_periodicity']) {
                            $fetchNewData = true;

                            // fetch new data
                            require_once $app->getPath() . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR . 'controllers' . DIRECTORY_SEPARATOR . 'excel.php';
                            $excel = new WptmControllerExcel();
                            $excel->synControl($table, 0);

                            // get new data
                            /* @var WptmModelTable $model */
                            $model = Model::getInstance('table');
                            $table = $model->getItem($table->id, $getData, true, null, false);
                            $tblStyles = $table->style;
                            $datas = $table->datas;
                        }
                    }
                }
            }

            if (!$fetchNewData && $table->type === 'html') {
                return true;
            }
        }

        $count_Col = 0;
        $colWidths = array();
        foreach ($tblStyles->cols as $col) {
            if (!empty($col)) {
                $firstCol = is_object($col) ? $col->{1} : $col[1];
                $zeroCol = is_object($col) ? (string)$col->{0} : (string)$col[0];
                if (isset($firstCol->width)) {
                    $colWidths[$zeroCol] = $firstCol->width;
                }
                $count_Col++;
            }
        }
        $encodeColWidths = htmlspecialchars(json_encode($colWidths));
        //responsive type
        if (isset($tblStyles->table->responsive_type) && (string)$tblStyles->table->responsive_type === 'hideCols') {
            $responsive_type = 'hideCols';
        } else {
            $responsive_type = 'scroll';
        }
        if (!isset($tblStyles->table->freeze_col)) {
            $tblStyles->table->freeze_col = 0;
        }
        if (!isset($tblStyles->table->freeze_row)) {
            $tblStyles->table->freeze_row = 0;
        }

        //filters and sort
        if (!isset($tblStyles->table->enable_filters)) {
            $tblStyles->table->enable_filters = 0;
        }
        if (isset($tblStyles->table->use_sortable) && (int) $tblStyles->table->use_sortable === 1) {
            $sortable = true;
        } else {
            $sortable = false;
        }
        $default_order_sortable = isset($tblStyles->table->default_order_sortable) ? (int)$tblStyles->table->default_order_sortable : 0;
        $default_sort = isset($tblStyles->table->default_sortable) ? (int)$tblStyles->table->default_sortable : 0;

        //pagination
        $limit = isset($tblStyles->table->limit_rows) ? (int)$tblStyles->table->limit_rows : 0;
        $enable_pagination = isset($tblStyles->table->enable_pagination) ? (int)$tblStyles->table->enable_pagination : 0;

        //convert to tableshorter dateformat
        $dateFormat = isset($tblStyles->table->date_formats) ? $this->convertDateFormat($tblStyles->table->date_formats) : 'mmddyyyy';

        //merge cells
        if (isset($tblStyles->table->mergeSetting)) {
            $mergeSetting = is_string($tblStyles->table->mergeSetting) ? json_decode($tblStyles->table->mergeSetting, true) : $tblStyles->table->mergeSetting;
        } else {
            $mergeSetting = array();
        }

        //hyperlink cells
        if (isset($tblStyles->table->hyperlink) && is_string($tblStyles->table->hyperlink)) {
            $tableHyperlink = json_decode($tblStyles->table->hyperlink);
        } elseif (!isset($tblStyles->table->hyperlink)) {
            $tableHyperlink = new stdClass();
        } else {
            $tableHyperlink = $tblStyles->table->hyperlink;
        }

        $tblCls = ($sortable ? 'sortable' : '');
        $tableDataAttr = array();

        $res_prioritys = array();
        if ($responsive_type === 'hideCols') {
            foreach ($tblStyles->cols as $col) {
                if (is_object($col)) {
                    $firstCol = $col->{1};
                    $colZero = $col->{0};
                } else {
                    $firstCol = $col[1];
                    $colZero = $col[0];
                }
                if (isset($firstCol->res_priority)) {
                    $res_prioritys[(string) $colZero] = ((string)$firstCol->res_priority === 'persistent') ? 'persistent' : (int) $firstCol->res_priority;
                }
            }
            $tableDataAttr[] = 'data-responsive="true"';
            $tableDataAttr[] = 'data-hideCols="true"';
            $tableDataAttr[] = 'data-hideColslanguage="'.esc_html__('Columns', 'wptm').'"';
        } else {
            $tableDataAttr[] = 'data-responsive="false"';
            $tableDataAttr[] = 'data-hideCols="false"';

            if (($tblStyles->table->freeze_row) || ($tblStyles->table->freeze_col)) {
                $tblCls .= ' fxdHdrCol';
            }
        }

        $content = '<div class="wptmresponsive dataTables-wptmtable wptmtable" id="wptmtable' . (int) $table->id . '" data-tableid="wptmTbl' . (int) $table->id . '">';

        // Table type
        if ($table->type === 'html') {
            $tableDataAttr[] = 'data-type="html"';
        } else {
            $tableDataAttr[] = 'data-type="mysql"';
        }
        //pagination
        if (!$enable_pagination || !$limit) {
            $tblCls .= ' disablePager';
        }
        if ($enable_pagination && $limit) {
//            if (($rows - 1) > $limit) {
            $tableDataAttr[] = 'data-paging="true"';
            $tableDataAttr[] = 'data-page-length="' . $limit . '"';
//            } else {
//                $tableDataAttr[] = 'data-paging="false"';
//            }
        } else {
            $tableDataAttr[] = 'data-paging="false"';
        }

        //searching
        if ($tblStyles->table->enable_filters) {
            $tblCls .= ' filterable';
        } elseif ($enable_pagination && $limit) {
            $tblCls .= ' enablePager';
        }
        $tableDataAttr[] = ($tblStyles->table->enable_filters) ? 'data-searching="true"' : 'data-searching="false"';

        $tableDataAttr[] = $sortable ? 'data-ordering="true"' : 'data-ordering="false"';
        if ($sortable) {
            $default_order_sortable_str = ($default_order_sortable === 1) ? 'asc' : 'desc';
            $tableDataAttr[] = 'data-ordertarget="'.$default_sort.'"';
            $tableDataAttr[] = 'data-ordervalue="'.$default_order_sortable_str.'"';
        }

        if (!isset($tblStyles->table->table_height)) {
            $tblStyles->table->table_height = 0;
        }

        //scrolling
        if ($responsive_type === 'scroll') {
            if ($tblStyles->table->table_height !== 0 && $tblStyles->table->table_height !== '') {
                $table_height = $tblStyles->table->table_height . 'px';
            } else {
                $table_height = 'auto';
            }
            $tableDataAttr[] = 'data-scroll-x="true"';
            $tableDataAttr[] = 'data-scroll-collapse="true"';
            if ($tblStyles->table->freeze_col) {
                //freeze column
                $tableDataAttr[] = 'data-freezecol="'.$tblStyles->table->freeze_col.'"';
            }

            if ($tblStyles->table->freeze_row > 0) {
                if (isset($table_height)) {
                    $tableDataAttr[] = 'data-scroll-y="' . $table_height . '"';
                }
                //freeze row
                $tableDataAttr[] = 'data-freezerow="true"';
            } elseif ($table_height !== 'auto') {
                //fix height when not freeze row
                $fix_height = 'wptmtable' . (int) $table->id . ' .dataTables_wrapper > .dataTables_scroll {max-height:' . $table_height .';overflow: auto;}';
                if ($tblStyles->table->freeze_col) {
                    $fix_height = 'wptmtable' . (int) $table->id . ' .dataTables_wrapper > .DTFC_ScrollWrapper {max-height:' . $table_height .';overflow: auto;}';
                }
            } elseif ($table_height === 'auto') {
                //fix height when not freeze row
                $fix_height = 'wptmtable' . (int) $table->id . ' .dataTables_wrapper > .dataTables_scroll {max-height: unset;overflow: auto;}';
                if ($tblStyles->table->freeze_col) {
                    $fix_height = 'wptmtable' . (int) $table->id . ' .dataTables_wrapper > .DTFC_ScrollWrapper {max-height: unset;overflow: auto;}';
                }
            }
        }
        $table_align = !isset($tblStyles->table->table_align) ? 'left' : $tblStyles->table->table_align;
        $tableDataAttr[] = 'data-align="'.$table_align.'"';
        $tableDataAttrStr = implode(' ', $tableDataAttr);

        $content .= '<table id="wptmTbl' . (int)$table->id . '" data-id="' . $table->id . '" '.$tableDataAttrStr.' data-colwidths="' . $encodeColWidths . '" class="' . $tblCls . '">';

        $rowNb = 0;
        $limit_rows = 0;

        if (!isset($this->date_formats) || $this->date_formats === '') {
            $this->date_formats    = (!empty($configParams['date_formats'])) ? $configParams['date_formats'] : 'Y-m-d';
            $this->date_formats    = (!empty($tblStyles->table->date_formats)) ? $tblStyles->table->date_formats : $this->date_formats;
        }
        if (!isset($this->symbol_position) || $this->symbol_position === '') {
            $this->symbol_position = (!empty($configParams['symbol_position'])) ? $configParams['symbol_position'] : 0;
            $this->symbol_position = (!empty($tblStyles->table->symbol_position)) ? $tblStyles->table->symbol_position : $this->symbol_position;
        }
        if (!isset($this->currency_symbol) || $this->currency_symbol === '') {
            $this->currency_symbol = (!empty($configParams['currency_sym'])) ? $configParams['currency_sym'] : '$';
            $this->currency_symbol = (!empty($tblStyles->table->currency_symbol)) ? $tblStyles->table->currency_symbol : $this->currency_symbol;
//            $this->currency_symbol = str_replace(' ', '', $this->currency_symbol);
        }
        if (!isset($this->decimal_symbol) || $this->decimal_symbol === '') {
            $this->decimal_symbol  = (!empty($configParams['decimal_sym'])) ? $configParams['decimal_sym'] : '.';
            $this->decimal_symbol  = (!empty($tblStyles->table->decimal_symbol)) ? $tblStyles->table->decimal_symbol : $this->decimal_symbol;
        }
        if (!isset($this->decimal_count) || $this->decimal_count === '') {
            $this->decimal_count   = (!empty($configParams['decimal_count'])) ? $configParams['decimal_count'] : 0;
            $this->decimal_count   = (!empty($tblStyles->table->decimal_count)) ? $tblStyles->table->decimal_count : $this->decimal_count;
        }
        if (!isset($this->thousand_symbol) || $this->thousand_symbol === '') {
            $this->thousand_symbol = (!empty($configParams['thousand_sym'])) ? $configParams['thousand_sym'] : ',';
            $this->thousand_symbol = (!empty($tblStyles->table->thousand_symbol) || $tblStyles->table->thousand_symbol === '') ? $tblStyles->table->thousand_symbol : $this->thousand_symbol;
        }

        // Fix Col width issue for Mac
        $firstRow = $datas[0];
        $content .= '<colgroup>';
        $countFirstRow = count($firstRow);
        for ($colNb = 0; $colNb < $countFirstRow; $colNb ++) {
            $content .= '<col data-dtr="' . $rowNb . '" data-dtc="' . $colNb . '" class="dtc' . $colNb . '">';
        }
        $content .= '</colgroup>';
        if ($datas !== null) {
            foreach ($datas as $k => $row) {
                if (!empty($tblStyles->table->limit_rows)) {
                    $limit_rows ++;
                }

                if ($rowNb === 0) {
                    $content .= '<thead>';
                } elseif ($rowNb !== 0 && $rowNb === $heads) {
                    $content .= '<tbody>';
                }

                if ($rowNb === 0) {
                    $content .= '<tr class="wptm-header-cells-index dnone">';
                    $headerColNb = 0;
                    foreach ($row as $col_value) {
                        $content .= '<th rowspan="1" colspan="1" data-dtr="' . $rowNb . '" data-dtc="' . $headerColNb . '" class="dtr' . $rowNb . ' dtc' . $headerColNb . '">';
                        $content .= '';
                        $content .= '</th>';
                        $headerColNb++;
                    }
                    $content .= '</tr>';
                }

                // when have pagination---> freeze_row = limit_rows (joomla)
                if ($limit_rows <= $tblStyles->table->freeze_row) {
                    $content .= '<tr class=" row' . $rowNb . '">';
                } else {
                    $content .= '<tr class="droptable_none row' . $rowNb . '">';
                }
                $colNb = 0;
                foreach ($row as $k => $col) {
                    $dataSortAttr = '';
                    $cellHtml = '';
                    if ($heads > $rowNb && $header_data !== null) {//in header
                        $col = $header_data[$rowNb][$k];
                    }
                    if (isset($col[0]) && $col[0] === '=') {
                        $calculaterCell = $this->calculaterCell($datas, $col);
                        if (is_array($calculaterCell)) {
                            $calculaterCell = 'NaN';
                        }
                        $cellHtml .= $calculaterCell;
                    } elseif (isset($tblStyles->cells[$rowNb . '!' . $colNb])
                        && isset($tblStyles->cells[$rowNb . '!' . $colNb][2]['cell_type'])
                        && (string)$tblStyles->cells[$rowNb . '!' . $colNb][2]['cell_type'] === 'html') {
                        if (isset($tableHyperlink->{$rowNb . '!' . $colNb})) {
                            $checkHtml = strpos($col, $tableHyperlink->{$rowNb . '!' . $colNb}->hyperlink);
                        } else {
                            $checkHtml = false;
                        }
                        if (isset($tableHyperlink->{$rowNb . '!' . $colNb}) && $checkHtml === false) {
                            $cellHtml .= '<a target="_blank" href="' . $tableHyperlink->{$rowNb . '!' . $colNb}->hyperlink . '">' . $col . '</a>';
                        } else {
                            $cellHtml .= $col;
                        }
                    } else {
                        $cellHtml .= nl2br($col);
                    }

                    $isDateFormat = $this->validateDate($col, $this->date_formats);
                    if ($isDateFormat) {
                        $newDate = DateTime::createFromFormat($this->date_formats, $col);
                        $dataSortAttr = 'data-sort="'.$newDate->getTimestamp().'"';
                    }

                    $mergeInfoAndCheckMerge = $rowNb >= $heads ? self::checkMergeInfo($rowNb, $colNb, $mergeSetting, false) : self::checkMergeInfo($rowNb, $colNb, $mergeSetting, true);
                    $mergeInfo              = $mergeInfoAndCheckMerge[0];
                    $mergeSetting           = $mergeInfoAndCheckMerge[1];

                    if ($mergeInfo !== false) {
                        if ($rowNb >= $heads) {
                            $content .= '<td ' . $mergeInfo . ' ' . $dataSortAttr .' class="dtr' . $rowNb . ' dtc' . $colNb . '">';
                        } else {
                            $dataPriority = !empty($res_prioritys) && isset($res_prioritys[$colNb]) ? 'data-priority="'.$res_prioritys[$colNb].'"' : 'data-priority="0"';
                            $content   .= '<th ' . $mergeInfo . ' '.$dataPriority.' class="dtr' . $rowNb . ' dtc' . $colNb . '">';
                        }
                        if (isset($tblStyles->cells[$rowNb . '!' . $colNb]) && isset($tblStyles->cells[$rowNb . '!' . $colNb][2]['tooltip_content']) && (string) $tblStyles->cells[$rowNb . '!' . $colNb][2]['tooltip_content'] !== '') {
                            if (!empty($data_tooltip[$rowNb . '_' . $colNb])) {
                                $content .= '<span class="wptm_tooltip ">' . $cellHtml . '<span class="wptm_tooltipcontent" data-width="' . $data_tooltip[$rowNb . '_' . $colNb] . '">' . $tblStyles->cells[$rowNb . '!' . $colNb][2]['tooltip_content'] . '</span></span>';
                            } else {
                                $content .= '<span class="wptm_tooltip ">' . $cellHtml . '<span class="wptm_tooltipcontent">' . $tblStyles->cells[$rowNb . '!' . $colNb][2]['tooltip_content'] . '</span></span>';
                            }
                        } else {
                            $content .= $cellHtml;
                        }

                        if ($rowNb < $heads) {
                            $content .= '</th>';
                        } else {
                            $content .= '</td>';
                        }
                    }
                    $colNb ++;
                }

                if ($rowNb === $heads - 1) {
                    $content .= '</thead>';
                } else {
                    $content .= '</tr>';
                }

//                if ($rowNb === 0) {

//                    $content .= '<tr class="wptm-header-cells-index dnone">';
//                    $headerColNb = 0;
//                    foreach ($row as $col_value) {
//                        $content .= '<th rowspan="1" colspan="1" data-dtr="' . $rowNb . '" data-dtc="' . $headerColNb . '" class="dtr' . $rowNb . ' dtc' . $headerColNb . '">';
//                        $content .= '';
//                        $content .= '</th>';
//                        $headerColNb++;
//                    }
//                    $content .= '</tr>';
//                }

                $rowNb ++;
            }
        }

        $content .= '</tbody>';

        $content .= '</table></div>';
        if (isset($fix_height)) {
            $content .= '<style>' . $fix_height . '</style>';
        }
        if ($table->type === 'html') {//html table
            if (!file_put_contents($file, esc_html($content))) {
                echo 'error saving file!';
                return false;
            }
        } else {
            return $content;
        }

        return true;
    }

    /**
     * Setup some params for wptm helper
     *
     * @param array $params Table params
     *
     * @return void
     */
    public function setup($params)
    {
        Application::getInstance('Wptm');
        /* @var WptmModelConfigsite $configModel */
        $configModel = Model::getInstance('configsite');
        $configParams = $configModel->getConfig();

        $this->date_formats    = (!empty($configParams['date_formats'])) ? $configParams['date_formats'] : 'Y-m-d';
        $this->date_formats    = (!empty($params->date_formats)) ? $params->date_formats : $this->date_formats;

        $this->symbol_position = (!empty($configParams['symbol_position'])) ? $configParams['symbol_position'] : 0;
        $this->symbol_position = (!empty($params->symbol_position)) ? $params->symbol_position : $this->symbol_position;

        $this->currency_symbol = (!empty($configParams['currency_sym'])) ? $configParams['currency_sym'] : '$';
        $this->currency_symbol = (!empty($params->currency_symbol)) ? $params->currency_symbol : $this->currency_symbol;
        $this->currency_symbol = str_replace(' ', '', $this->currency_symbol);

        $this->decimal_symbol  = (!empty($configParams['decimal_sym'])) ? $configParams['decimal_sym'] : '.';
        $this->decimal_symbol  = (!empty($params->decimal_symbol)) ? $params->decimal_symbol : $this->decimal_symbol;

        $this->decimal_count   = (!empty($configParams['decimal_count'])) ? $configParams['decimal_count'] : 0;
        $this->decimal_count   = (!empty($params->decimal_count)) ? $params->decimal_count : $this->decimal_count;

        $this->thousand_symbol = (!empty($configParams['thousand_sym'])) ? $configParams['thousand_sym'] : ',';
        $this->thousand_symbol = (!empty($params->thousand_symbol) || $params->thousand_symbol === '') ? $params->thousand_symbol : $this->thousand_symbol;
    }
    /**
     * Caculate Functions for cells
     *
     * @param array $datas     Data range
     * @param array $valueCell Value cell
     *
     * @return string
     */
    public function calculaterCell($datas, $valueCell)
    {
        $value_missing = array();
        $value_missing['col'] = null;
        $value_missing['row'] = null;
        $string_currency_symbol = '/[' . str_replace(',', '|', $this->currency_symbol) . ']/';
        $string_unit = str_replace(',', '|^', $this->currency_symbol);
        $string_unit = '/[^a-zA-Z|' . $string_unit . ']/';
        $text_replace_unit_function = '/[^ |' . str_replace(',', '|^', $this->currency_symbol) . ']/';

        $htmlCell = '';
        if (preg_match('@^=(DATE|DAY|DAYS|DAYS360|AND|OR|XOR|SUM|MULTIPLY|DIVIDE|COUNT|MIN|MAX|AVG|CONCAT|date|day|days|days360|and|or|xor|sum|multiply|divide|count|min|max|avg|concat)\\((.*?)\\)$@', $valueCell, $matches)) {
            $cells      = explode(';', $matches[2]);
            $values     = array();
            $checkIsDay = (count(explode('DAY', $matches[1])) === 2) ? true : false;
            $value_unit = '';

            foreach ($cells as $cell) {
                $vals     = explode(':', $cell);
                if (count($vals) === 1) { //single cell
                    preg_match_all('@([a-zA-Z]+)([0-9]+)@', $cell, $val0);
                    $data = '';
                    if ($val0[0] !== array()) {
                        $count = count($val0[0]);
                        for ($i = 0; $i < $count; $i ++) {
                            if (!isset($datas[$val0[2][$i] - 1]) || !isset($datas[$val0[2][$i] - 1][self::convertAlpha(strtoupper($val0[1][$i])) - 1])) {//check exist cell
                                $value_missing['col'][] = self::convertAlpha(strtoupper($val0[1][$i])) - 1;
                                $value_missing['row'][] = $val0[2][$i] - 1;
                                continue;
                            }
                            $d    = $datas[$val0[2][$i] - 1][self::convertAlpha(strtoupper($val0[1][$i])) - 1];
                            $unit = $d;
                            if ($d !== null) {
                                if ($i === 0) {
                                    $data = str_replace($val0[0][$i], $d, $cell);
                                } else {
                                    $data = str_replace($val0[0][$i], $d, $data);
                                }
                            }
                        }
                    } else {
                        $data = $cell;
                        $unit = $cell;
                    }
                    if ($value_missing['row'] !== null) {//check exist cell
                        continue;
                    }

                    if (strtoupper($matches[1]) !== 'CONCAT') {
                        $d = preg_replace($string_currency_symbol, '', $data);
                        if ($checkIsDay === false) {
                            if ($this->thousand_symbol === ',') {
                                $d = preg_replace('/,/', '', $d);
                            } elseif ($this->thousand_symbol === '.') {
                                $d = preg_replace('/\./', '', $d);
                            }

                            $d = ($this->decimal_symbol === ',') ? preg_replace('/,/', '.', $d) : $d;
                        }
                    } else {
                        $d = $data;
                    }
                    preg_match_all('/<=|>=|!=|>|<|=/', $d, $math1);
                    $math2 = $math1[0];
                    if (!empty($math2)) {
                        $d = preg_replace('/[ |A-Za-z]+/', '', $d);
                        switch ($math2[0]) {
                            case '<=':
                                $varNumber = explode('<=', $d);
                                $number    = (int) ($varNumber[0]) <= (int) ($varNumber[1]);
                                $number    = ($number === true) ? 'true' : 'false';
                                break;
                            case '>=':
                                $varNumber = explode('>=', $d);
                                $number    = (int) ($varNumber[0]) >= (int) ($varNumber[1]);
                                $number    = ($number === true) ? 'true' : 'false';
                                break;
                            case '=':
                                $varNumber = explode('=', $d);
                                $number    = (int) ($varNumber[0]) === (int) ($varNumber[1]);
                                $number    = ($number === true) ? 'true' : 'false';
                                break;
                            case '!=':
                                $varNumber = explode('!=', $d);
                                $number    = (int) ($varNumber[0]) !== (int) ($varNumber[1]);
                                $number    = ($number === true) ? 'true' : 'false';
                                break;
                            case '<':
                                $varNumber = explode('<', $d);
                                $number    = (int) ($varNumber[0]) < (int) ($varNumber[1]);
                                $number    = ($number === true) ? 'true' : 'false';

                                break;
                            case '>':
                                $varNumber = explode('>', $d);
                                $number    = (int) ($varNumber[0]) > (int) ($varNumber[1]);
                                $number    = ($number === true) ? 'true' : 'false';

                                break;
                            default:
                                $number = $d;
                                break;
                        }
                    } else {
                        $number = $d;
                    }
                    $values[] = $number;

                    if (strtoupper($matches[1]) === 'DIVIDE' || strtoupper($matches[1]) === 'MULTIPLY') {
                        $value_unit = $value_unit !== '' ? $value_unit : (($unit !== null) ? preg_replace($text_replace_unit_function, '', $unit) : '');
                    } else {
                        $value_unit = ($unit !== null) ? preg_replace($text_replace_unit_function, '', $unit) : '';
                    }
                } else { //range
                    preg_match('@([a-zA-Z]+)([0-9]+)@', $vals[0], $val1);
                    preg_match('@([a-zA-Z]+)([0-9]+)@', $vals[1], $val2);
                    if ($val1 !== array() && $val2 !== array()) {
                        if ($checkIsDay === true && $val1[2] > $val2[2]) {
                            $val3 = $val1;
                            $val1 = $val2;
                            $val2 = $val3;
                        }

                        for ($il = $val1[2] - 1; $il <= $val2[2] - 1; $il ++) {
                            $convertVal1 = self::convertAlpha($val1[1]) - 1;
                            $convertVal2 = self::convertAlpha($val2[1]) - 1;
                            for ($ik = $convertVal1; $ik <= $convertVal2; $ik ++) {
                                if (!isset($datas[$il]) || !isset($datas[$il][$ik])) {//check exist cell
                                    $value_missing['col'][] = $ik;
                                    $value_missing['row'][] = $il;
                                    continue;
                                }
                                if (strtoupper($matches[1]) !== 'CONCAT') {
                                    $number = preg_replace($string_currency_symbol, '', $datas[$il][$ik]);
                                    if ($checkIsDay === false) {
                                        $number = ($this->thousand_symbol === ',') ? preg_replace('/,/', '', $number) : (($this->thousand_symbol === '.') ? preg_replace('/\./', '', $number) : $number);
                                        $number = ($this->decimal_symbol === ',') ? preg_replace('/,/', '.', $number) : $number;
                                    }
                                } else {
                                    $number = $datas[$il][$ik];
                                }
                                $values[] = $number;
                                $unit     = $datas[$il][$ik];

                                if (strtoupper($matches[1]) === 'MULTIPLY') {
                                    $value_unit = $value_unit !== '' ? $value_unit : (($unit !== null) ? preg_replace($text_replace_unit_function, '', $unit) : '');
                                } else {
                                    $value_unit = ($unit !== null) ? preg_replace($text_replace_unit_function, '', $unit) : '';
                                }
                            }
                        }
                        if ($value_missing['row'] !== null) {
                            continue;
                        }
                        if (!empty($val3) && $val3 === $val2) {
                            $values_data = $values[0];
                            $values[0]   = $values[1];
                            $values[1]   = $values_data;
                        }
                    } else {
                        $values[] = $cell;
                    }
                }
            }

            if ($value_missing['row'] !== null) {
                return $value_missing;
            }

            preg_match_all('/[A-Z|\\\|a-z]+/', $this->date_formats, $date_formats);

            switch (strtoupper($matches[1])) {
                case 'DATE':
                    $htmlCell = $this->dateCalculation($values, $date_formats, $number);
                    break;
                case 'DAY':
                    $htmlCell = $this->dayCalculation($values, $date_formats);
                    break;
                case 'DAYS':
                    $htmlCell = $this->daysCalculation($values, $date_formats);
                    break;
                case 'DAYS360':
                    $htmlCell = $this->days360Calculation($values, $date_formats);
                    break;
                case 'AND':
                    $htmlCell = $this->andCalculation($values);
                    break;
                case 'OR':
                    $htmlCell = $this->orCalculation($values);
                    break;
                case 'XOR':
                    $htmlCell = $this->xorCalculation($values);
                    break;
                case 'SUM':
                    $htmlCell = $this->sumCalculation($values, $value_unit);
                    break;
                case 'MULTIPLY':
                    $htmlCell = $this->multiplyCalculation($values, $value_unit);
                    break;
                case 'DIVIDE':
                    $htmlCell = $this->divideCalculation($values, $value_unit);
                    break;
                case 'COUNT':
                    $htmlCell = $this->countCalculation($values);
                    break;
                case 'MIN':
                    $htmlCell = $this->minCalculation($values, $value_unit);
                    break;
                case 'MAX':
                    $htmlCell = $this->maxCalculation($values, $value_unit);
                    break;
                case 'AVG':
                    $htmlCell = $this->avgCalculation($values, $value_unit);
                    break;
                case 'CONCAT':
                    $htmlCell = $this->concatCalculation($values);
                    break;
            }
        }
        return $htmlCell;
    }

    /**
     * Date calculater function
     *
     * @param string $values       Cell value
     * @param array  $date_formats Date format
     * @param string $number       Number value
     *
     * @return string
     */
    public function dateCalculation($values, $date_formats, $number)
    {
        $M_name = array('', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec');
        $D_name = array('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat');

        $cellHtml = '';
        if (count($values) === 1) {
            preg_match_all('/[a-zA-Z0-9|+|-|\\\]+/', $number, $values);
        }
        $text_date = $this->convertDay($values, $date_formats[0], false);
        if ($text_date !== false) {
            $date_string = date_create($text_date);
            if ($date_string !== false) {
                preg_match_all('/[^A-Z|^\\\|^a-z]+/', $this->date_formats, $format_resultCalc);
                $date_string = getdate($date_string->getTimestamp());
                $date        = array();
                $date['D']   = $D_name[$date_string['wday']];
                $date['l']   = $date_string['weekday'];
                $date['j']   = $date_string['mday'];
                $date['d']   = ((int) $date_string['mday'] < 10) ? '0' . $date_string['mday'] : $date_string['mday'];
                $date['F']   = $date_string['month'];
                $date['M']   = $M_name[$date_string['mon']];
                $date['n']   = $date_string['mon'];
                $date['m']   = ((int) $date_string['mon'] < 10) ? '0' . $date_string['mon'] : $date_string['mon'];
                $date['Y']   = $date_string['year'];
                $date['y']   = (int) $date_string['year'] % 100;
                foreach ($date_formats[0] as $date_format => $key) {
                    if (strpos($key, '\\') !== false
                        || in_array($key, array('a', 'A', 'g', 'G', 'h', 'H', 'i', 's', 'T')) !== false
                    ) {
                        $date[$key] = $values[$date_format];
                    }
                    $cellHtml .= '' . $date[$key] . (!empty($format_resultCalc[0][$date_format]) ? $format_resultCalc[0][$date_format] : '');
                }
            } else {
                return 'NaN';
            }
        } else {
            return 'NaN';
        }
        return $cellHtml;
    }

    /**
     * Day calculater function
     *
     * @param array $values       Value cell
     * @param array $date_formats Date format
     *
     * @return array|string
     */
    public function dayCalculation($values, $date_formats)
    {
        $date_format = $date_formats[0];
        preg_match_all('/[a-zA-Z0-9|+|-|\\\]+/', $values[0], $number);
        $text_date = $this->convertDay($number[0], $date_format, true);
        if ($text_date !== false) {
            $date1            = date_create($text_date);
            $cellHtml = getdate($date1->getTimestamp());
            $cellHtml = $cellHtml['mday'];
        } else {
            $cellHtml = 'NaN';
        }

        return $cellHtml;
    }

    /**
     * Days calculater function
     *
     * @param array $values       Value cell
     * @param array $date_formats Date format
     *
     * @return float|integer|string
     */
    public function daysCalculation($values, $date_formats)
    {
        try {
            $class = $this;
            $date_format = $date_formats[0];
            $resultCalc = array();
            $resultCalc = array_map(function ($foo) use ($class, $date_format, $resultCalc) {
                preg_match_all('/[a-zA-Z0-9|+|-|\\\]+/', $foo, $number);
                $text_date = $class->convertDay($number[0], $date_format, true);
                $date = new DateTime($text_date);
                $resultCalc[] = $date->getTimestamp();
                return $resultCalc;
            }, $values);
            if (isset($resultCalc[0][0]) && isset($resultCalc[1][0])) {
                return ($resultCalc[0][0] - $resultCalc[1][0]) / (24 * 3600);
            }
            return 'NaN';
        } catch (Exception $exc) {
            return 'NaN';
        }
    }

    /**
     * Days360 calculater function
     *
     * @param array $values       Value cell
     * @param array $date_formats Date format
     *
     * @return float|integer|string
     */
    public function days360Calculation($values, $date_formats)
    {
        self::$resultCalc = 1;
        $countValue       = count($values);
        $result = array();
        for ($i = 0; $i < $countValue; $i ++) {
            preg_match_all('/[a-zA-Z0-9|+|-|\\\]+/', $values[$i], $number);
            $text_date = $this->convertDay($number[0], $date_formats[0], true);
            if ($text_date !== false) {
                $result[$i] = getdate(date_create($text_date)->getTimestamp());
            } else {
                self::$resultCalc = 'NaN';
                break;
            }
        }
        if (self::$resultCalc !== 'NaN') {
            if ($result[0]['year'] > $result[1]['year']) {
                self::$resultCalc = - 1;
            }
            $result[0]['mday'] = ($result[0]['mday'] === 31) ? 30 : $result[0]['mday'];
            $result[1]['mday'] = ($result[1]['mday'] === 31) ? 30 : $result[1]['mday'];
            self::$resultCalc  = (($result[1]['year'] - $result[0]['year'] - 1) * 360) + ((13 - $result[0]['mon']) * 30 - $result[0]['mday']) + (($result[1]['mon'] - 1) * 30 + $result[1]['mday']);
        }
        return (int) self::$resultCalc;
    }

    /**
     * And calculater
     *
     * @param array $values Cell value
     *
     * @return string
     */
    public function andCalculation($values)
    {
        $resultCalc = new stdClass();
        $resultCalc->value = true;
        array_map(function ($foo) use ($resultCalc) {
            $resultCalc->value = $resultCalc->value && (($foo === 'true') ? true : false);
        }, $values);
        return ($resultCalc->value === true) ? 'true' : 'false';
    }

    /**
     * Or calculater
     *
     * @param array $values Cell value
     *
     * @return string
     */
    public function orCalculation($values)
    {
        $resultCalc = new stdClass();
        $resultCalc->value = 0;
        array_map(function ($foo) use ($resultCalc) {
            $resultCalc->value += ($foo === 'true') ? 1 : 0;
        }, $values);
        return ($resultCalc->value > 0) ? 'true' : 'false';
    }

    /**
     * Xor calculater
     *
     * @param array $values Cell value
     *
     * @return string
     */
    public function xorCalculation($values)
    {
        $resultCalc = new stdClass();
        $resultCalc->value = 2;
        array_map(function ($foo) use ($resultCalc) {
            $resultCalc->value += ($foo === 'true') ? 1 : 0;
        }, $values);
        return (($resultCalc->value % 2) === 1) ? 'true' : 'false';
    }

    /**
     * Sum calculater
     *
     * @param array  $values     Cell value
     * @param string $value_unit Value unit
     *
     * @return string
     */
    public function sumCalculation($values, $value_unit)
    {
        $resultCalc = new stdClass();
        $resultCalc->resultCalc = 0;
        array_map(function ($foo) use ($resultCalc) {
            $foo = preg_replace('/[ ]+/', '', $foo);
            if (is_numeric($foo)) {
                $resultCalc->resultCalc = $resultCalc->resultCalc + $foo;
            }
        }, $values);

        return $this->formatSymbols($resultCalc->resultCalc, $value_unit !== '' ? $this->currency_symbol : '');
    }

    /**
     * Multiply calculater
     *
     * @param array  $values     Cell value
     * @param string $value_unit Value unit
     *
     * @return string
     */
    public function multiplyCalculation($values, $value_unit)
    {
        $resultCalc = new stdClass();
        $resultCalc->resultCalc = 1;
        array_map(function ($foo) use ($resultCalc) {
            $foo = preg_replace('/[ ]+/', '', $foo);
            if (is_numeric($foo)) {
                $resultCalc->resultCalc = $resultCalc->resultCalc * $foo;
            }
        }, $values);

        return $this->formatSymbols($resultCalc->resultCalc, $value_unit !== '' ? $this->currency_symbol : '');
    }

    /**
     * Divide calculater
     *
     * @param array  $values     Cell value
     * @param string $value_unit Value unit
     *
     * @return string
     */
    public function divideCalculation($values, $value_unit)
    {
        $resultCalc = new stdClass();
        $resultCalc->resultCalc = 0;

        $count = count($values);
        if ($count !== 2) {
            return 'NaN';
        }
        $values[1] = preg_replace('/[ ]+/', '', $values[1]);

        if (!is_numeric($values[1]) || (int)$values[1] === 0 || $values[1] === '') {
            return 'NaN';
        }

        $values[0] = preg_replace('/[ |A-Za-z]+/', '', $values[0]);

        if (!is_numeric($values[0])) {
            return 'NaN';
        }

        $resultCalc->resultCalc = $values[0] / $values[1];

        return $this->formatSymbols($resultCalc->resultCalc, $value_unit !== '' ? $this->currency_symbol : '');
    }

    /**
     * Count calculater
     *
     * @param array $values Cell value
     *
     * @return string
     */
    public function countCalculation($values)
    {
        $resultCalc = new stdClass();
        $resultCalc->value = 0;
        array_map(function ($foo) use ($resultCalc) {
            $foo = preg_replace('/[ |A-Za-z]+/', '', $foo);
            if (is_numeric($foo)) {
                $resultCalc->value ++;
            }
        }, $values);

        return $resultCalc->value;
    }

    /**
     * Min calculater
     *
     * @param array  $values     Cell value
     * @param string $value_unit Value unit
     *
     * @return string
     */
    public function minCalculation($values, $value_unit)
    {
        $resultCalc = new stdClass();
        $resultCalc->value = null;
        array_map(function ($foo) use ($resultCalc) {
            $foo = preg_replace('/[ |A-Za-z]+/', '', $foo);
            if (is_numeric($foo)) {
                if ($resultCalc->value === null || $resultCalc->value > $foo) {
                    $resultCalc->value = $foo;
                }
            }
        }, $values);

        return $this->formatSymbols($resultCalc->value, $value_unit !== '' ? $this->currency_symbol : '');
    }


    /**
     * Max calculater
     *
     * @param array  $values     Cell value
     * @param string $value_unit Value unit
     *
     * @return string
     */
    public function maxCalculation($values, $value_unit)
    {
        $resultCalc = new stdClass();
        $resultCalc->value = null;
        array_map(function ($foo) use ($resultCalc) {
            $foo = preg_replace('/[ |A-Za-z]+/', '', $foo);
            if (is_numeric($foo)) {
                if ($resultCalc->value === null || $resultCalc->value < $foo) {
                    $resultCalc->value = $foo;
                }
            }
        }, $values);

        return $this->formatSymbols($resultCalc->value, $value_unit !== '' ? $this->currency_symbol : '');
    }

    /**
     * Avg calculater
     *
     * @param array  $values     Cell value
     * @param string $value_unit Value unit
     *
     * @return string
     */
    public function avgCalculation($values, $value_unit)
    {
        $resultCalc = new stdClass();
        $resultCalc->resultCalc = 0;
        $resultCalc->n = 0;
        array_map(function ($foo) use ($resultCalc) {
            $foo = preg_replace('/[ ]+/', '', $foo);
            if (is_numeric($foo)) {
                $resultCalc->resultCalc += $foo;
                $resultCalc->n ++;
            }
        }, $values);
        if ($resultCalc->n > 0) {
            $resultCalc->resultCalc = $resultCalc->resultCalc / $resultCalc->n;
        }

        return $this->formatSymbols($resultCalc->resultCalc, $value_unit !== '' ? $this->currency_symbol : '');
    }

    /**
     * Concat calculater
     *
     * @param array $values Cell value
     *
     * @return string
     */
    public function concatCalculation($values)
    {
        $resultCalc = new stdClass();
        $resultCalc->resultCalc = '';

        array_map(function ($foo) use ($resultCalc) {
            if (isset($foo[0]) && (string) $foo[0] !== '=') {
                $resultCalc->resultCalc .= (string) $foo;
            }
        }, $values);

        return $resultCalc->resultCalc;
    }

    /**
     * Check valid date with date format
     *
     * @param string $date   Date
     * @param string $format PHP date format
     *
     * @return boolean
     */
    public function validateDate($date, $format = 'Y-m-d')
    {
        $d = DateTime::createFromFormat($format, $date);
        // The Y ( 4 digits year ) returns TRUE for any integer with any number of digits so changing the comparison from == to === fixes the issue.
        return $d && $d->format($format) === $date;
    }

    /**
     * Convert php date format to tableSorter date format
     *
     * @param string $dateFormat PHP date format
     *
     * @return string
     */
    public function convertDateFormat($dateFormat)
    {
        $dateFormat = strtolower($dateFormat);
        $d1 = strpos($dateFormat, 'd');
        $m1 = strpos($dateFormat, 'm');
        $y1 = strpos($dateFormat, 'y');

        $tempArr = array();
        if ($d1 !== false) {
            $tempArr[$d1] = 'dd';
        }
        if ($m1 !== false) {
            $tempArr[$m1] = 'mm';
        }
        if ($y1 !== false) {
            $tempArr[$y1] = 'yyyy';
        }

        ksort($tempArr);
        return implode('', array_values($tempArr));
    }

    /**
     * Convert string to m/d/Y
     *
     * @param array   $number      Var of date
     * @param array   $date_format Date format
     * @param boolean $timezone    Check used timezone
     *
     * @return boolean|string
     */
    public function convertDay($number, $date_format, $timezone)
    {
        $F_name     = array('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december');
        $M_name     = array('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec');
        $date_array = array();
        $date       = array();
        $number     = (!!$number) ? $number : array();
        if (count($date_format) !== count($number)) {
            return false;
        }

        $countFormatDate = count($date_format);
        for ($n = 0; $n < $countFormatDate; $n ++) {
            $number[$n] = (!!$number[$n]) ? $number[$n] : '';
            if ($date_format[$n] === 'd' || $date_format[$n] === 'j') {
                $date_array[2] = ($number[$n] !== '') ? $number[$n] : 0;
            } elseif ($date_format[$n] === 'S' || $date_format[$n] === 'jS' || $date_format[$n] === 'dS') {
                preg_match_all('/[0-9]+/', $number[$n], $date[2]);
                $date_array[2] = $date[2][0][0];
            } elseif ($date_format[$n] === 'm' || $date_format[$n] === 'n') {
                $date_array[1] = $number[$n];
            } elseif ($date_format[$n] === 'F') {
                $date_array[1] = array_search(strtolower($number[$n]), $F_name) + 1;
            } elseif ($date_format[$n] === 'M') {
                $date_array[1] = array_search(strtolower($number[$n]), $M_name) + 1;
            } elseif ($date_format[$n] === 'Y' || $date_format[$n] === 'y') {
                $date_array[3] = $number[$n];
            } elseif (strtolower($date_format[$n]) === 'g' || strtolower($date_format[$n]) === 'h') {
                $date_array[4] = $number[$n];
            } elseif (strtolower($date_format[$n]) === 'ga' || strtolower($date_format[$n]) === 'ha') {
                preg_match_all('/[0-9]+/', $number[$n], $date[4]);
                $number[$n]    = preg_replace('/[0-9]+/', '', $number[$n]);
                $date_array[4] = (strtolower($number[$n]) === 'am') ? (int) $date[4][0][0] : (int) $date[4][0][0] + 12;
            } elseif (strtolower($date_format[$n]) === 'a') {
                $date_array[7] = $number[$n];
            } elseif (strtolower($date_format[$n]) === 'i' || strtolower($date_format[$n]) === 'ia') {
                preg_match_all('/[0-9]+/', $number[$n], $date[5]);
                $date_array[5] = $date[5][0][0];
            } elseif (strtolower($date_format[$n]) === 's' || strtolower($date_format[$n]) === 'sa') {
                preg_match_all('/[0-9]+/', $number[$n], $date[6]);
                $date_array[6] = $date[6][0][0];
            } elseif ($date_format[$n] === 'T') {
                $date_array[8] = $number[$n];
            } elseif ($date_format[$n] === 'r') {
                if (array_search(strtolower($number[$n]), $F_name) + 1 > 0) {
                    $date_array[1] = array_search(strtolower($number[$n]), $F_name) + 1;
                } else {
                    $date_array[1] = array_search(strtolower($number[$n]), $M_name) + 1;
                }
                return $date_array[1] . '/' . $number[1] . '/' . $number[3] . ' ' . $number[4] . ':' . $number[5] . ':' . $number[6] . ' ' . $number[7];
            }
        }
        if ($date_array[3] === '' || $date_array[2] === '' || $date_array[2] > 31 || $date_array[1] > 12) {
            return false;
        }

        $date_array[4] = (!empty($date_array[4])) ? (int) $date_array[4] : '00';
        $date_array[5] = (!empty($date_array[5])) ? (int) $date_array[5] : '00';
        $date_array[6] = (!empty($date_array[6])) ? (int) $date_array[6] : '00';
        $date_array[7] = (!empty($date_array[7])) ? $date_array[7] : '';
        $date_array[8] = (!empty($date_array[8])) ? $date_array[8] : '';
        $date_array[8] = ($timezone === true) ? $date_array[8] : '';
        if (strtolower($date_array[7]) === 'pm') {
            $date_array[4] = $date_array[4] + 12;
        }
        return (int) $date_array[1] . '/' . (int) $date_array[2] . '/' . $date_array[3] . ' ' . $date_array[4] . ':' . $date_array[5] . ':' . $date_array[6] . $date_array[8];
    }

    /**
     * Convert var calculator by format
     *
     * @param integer|null $resultCalc Var calculator
     * @param string       $value_unit Value unit
     *
     * @return string
     */
    public function formatSymbols($resultCalc, $value_unit)
    {
        if ($resultCalc === null) {
            return 'NaN';
        }
        $decimal_count    = $this->decimal_count;
        $array_resultCalc = str_split((string) round($resultCalc, $decimal_count));
        $decimal          = array_search('.', $array_resultCalc);
        $decimal          = ($decimal !== false) ? $decimal : count($array_resultCalc);
        if ($decimal === count($array_resultCalc)) {
            $array_resultCalc[count($array_resultCalc)] = $this->decimal_symbol;
        }

        $data = '';
        $j    = ($decimal > 3) ? $decimal % 3 : - 1;
        if ($array_resultCalc[0] === '-') {
            $j                   = ($decimal - 1 > 3) ? ($decimal - 1) % 3 + 1 : - 1;
            $array_resultCalc[0] = (int) $this->symbol_position === 0 ? $array_resultCalc[0] . $value_unit : $array_resultCalc[0];
        } else {
            $array_resultCalc[0] = (int) $this->symbol_position === 0 ? $value_unit . $array_resultCalc[0] : $array_resultCalc[0];
        }
        $decimal1 = $decimal;
        for ($i = 0; $i < $decimal1 + 1 + $decimal_count; $i ++) {
            if ($i + 1 === $j && $array_resultCalc[$i] !== '-') {
                $data .= $array_resultCalc[$i] ? $array_resultCalc[$i] . $this->thousand_symbol : $array_resultCalc[$i];
            } elseif ($j !== - 1 && $i + 1 - $j !== 0 && ($i + 1 - $j) % 3 === 0 && $i < $decimal - 1) {
                $data .= $array_resultCalc[$i] . $this->thousand_symbol;
            } elseif ($i === $decimal && $decimal_count !== 0) {
                $data .= $this->decimal_symbol;
            } elseif (empty($array_resultCalc[$i])) {
                $data .= '0';
            } elseif ($array_resultCalc[$i] !== $this->decimal_symbol) {
                $data .= $array_resultCalc[$i];
            }
        }
        return ((int) $this->symbol_position === 0) ? $data : $data . ' ' . $value_unit;
    }

    /**
     * Check merge cell
     *
     * @param integer $rowNb         Row
     * @param integer $colNb         Col NB
     * @param array   $mergeSettings Setting
     * @param boolean $removeSpan    Remove tag span
     *
     * @return array|boolean
     */
    private static function checkMergeInfo($rowNb, $colNb, $mergeSettings, $removeSpan = false)
    {
        $result = array('', $mergeSettings);
        $count = count($mergeSettings);
        if (!is_array($mergeSettings) || $count === 0) {
            return $result;
        }

        foreach ($mergeSettings as $key => $ms) {
            if (is_object($ms)) {
                $merge = (array)$ms;
                $mergeSettings[$key] = $merge;
            } else {
                $merge = $ms;
            }

            if ((int) $merge['row'] === (int) $rowNb && (int) $merge['col'] === (int) $colNb) {
                $rowSpan = intval($merge['rowspan']) > 1 ? ' rowspan="' . $merge['rowspan'] . '"' : '';
                $colSpan = intval($merge['colspan']) > 1 ? ' colspan="' . $merge['colspan'] . '"' : '';
                $result[0] = $colSpan . $rowSpan;
            } elseif ($merge['row'] <= $rowNb && $rowNb < $merge['row'] + $merge['rowspan'] && $merge['col'] <= $colNb && $colNb < $merge['col'] + $merge['colspan']) {
                if ($removeSpan === true) {
                    $result[0] = false;
                    return $result;
                } else {
                    $result[0] = ' style="display: none"';
                }
            }
        }

        return $result;
    }

    /**
     * Get val cell
     *
     * @param string $col Position of cell
     *
     * @return integer
     */
    private static function convertAlpha($col)
    {
        $col = str_pad($col, 2, '0', STR_PAD_LEFT);
        $i   = ((string) $col[0] === '0') ? 0 : (ord($col[0]) - 64) * 26;
        $i   += ord($col[1]) - 64;

        return $i;
    }
}
