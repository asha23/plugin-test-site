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
use Joomunited\WPFramework\v1_0_5\Application;

defined('ABSPATH') || die();

/**
 * Class WptmControllerExcel
 */
class WptmControllerExcel extends Controller
{
    /**
     * Error message
     *
     * @var string $error_message error_message
     */
    private $error_message = '';

    /**
     * Allowed ext
     *
     * @var array $allowed_ext allowed_ext
     */
    private $allowed_ext = array('xls', 'xlsx');

    /**
     * Max rows columns
     *
     * @var array $maxCell allowed_ext
     */
    private $maxCell = array();

    /**
     * Function import excell
     *
     * @return void
     */
    public function import()
    {
        $json = array();
        $file = Utilities::getInput('file', 'POST', 'string');
        $upload_dir = wp_upload_dir();
        $targetPath = $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'wptm' . DIRECTORY_SEPARATOR;

        if ($file) {
            $file = $targetPath . $file;
        } else {
            $file = $this->uploadFileExcel();
        }
        if ($file) {
            $id_table = Utilities::getInt('id_table', 'POST');
            $onlydata = Utilities::getInt('onlydata', 'POST');
            $onlydata = $onlydata === 0 ? false : true;

            $ignoreCheck = Utilities::getInt('ignoreCheck', 'POST');

            $modelTable = $this->getModel('table');
            $tableContent = (array)$modelTable->getItem($id_table, false, true);

            if ($onlydata) {//render new style
                $modelTable->deleteOldStyle($id_table);
                $tableContent['style'] = new stdClass();
                $tableContent['style']->rows = new stdClass();
                $tableContent['style']->cols = new stdClass();
            } else {
                if (!isset($tableContent['style'])) {
                    $tableContent['style'] = new stdClass();
                }

                if (!isset($tableContent['style']->rows)) {
                    $tableContent['style']->rows = new stdClass();
                }
                if (!isset($tableContent['style']->cols)) {
                    $tableContent['style']->cols = new stdClass();
                }
            }

            $doUpdate = false;

            $readFileExcel = $this->readFileExcel($file, true, false, $tableContent['params'], $onlydata);

            if (isset($readFileExcel['status']) && $readFileExcel['status']) {
                $doUpdate = true;
            } elseif (isset($readFileExcel['text'])) {
                $this->exitStatus(esc_attr($readFileExcel['text']));
            } elseif (is_string($readFileExcel)) {
                $this->exitStatus(esc_attr($readFileExcel));
            } else {
                $this->exitStatus($this->error_message !== '' ? $this->error_message : __('There was an error importing the file', 'wptm'));
            }

            $tableContent['datas'] = $readFileExcel['data']['data'];
            $tableContent['params']->mergeSetting = $readFileExcel['data']['mergeSetting'];

            if ($onlydata) {
                $tableContent['params']->cell_types = $readFileExcel['data']['typeCells'];
                $tableContent['style']->rows = $readFileExcel['data']['style']['rows'];
                $tableContent['style']->cols = $readFileExcel['data']['style']['cols'];
                $tableContent['style'] = json_encode($tableContent['style']);

                $tableContent['styleCells'] = $readFileExcel['data']['style']['cell'];
            }

            $tableContent['numberRow'] = count($tableContent['datas']);
            $tableContent['numberCol'] = count($tableContent['datas'][0]);

            $count = count($readFileExcel['data']['hyperlink']);
            if ($readFileExcel['data']['hyperlink'] !== false) {
                if ($count > 0) {
                    $tableContent['params']->cell_types = $this->changeHyperlinksTable($tableContent['params']->cell_types, $readFileExcel['data']['hyperlink']);
                }
            }
            $tableContent['params']->hyperlink = $readFileExcel['data']['hyperlink'];

            $tableContent['action'] = 'insert';

            if (file_exists($file)) {
                unlink($file);
            }

            if ($doUpdate) {
                //add table header = 1
                $header = 1;
                $tableContent['params']->headerOption = $header;
                $tableContent['params']->header_data = array();
                for ($i = 0; $i < $header; $i++) {
                    $tableContent['params']->header_data[] = $tableContent['datas'][$i];
                }

                if ($modelTable->saveTableSynfile($id_table, $tableContent)) {
                    $updated = true;
                } else {
                    $error = array(
                        'error' => $this->error_message,
                        'text' => __('error while saving table', 'wptm')
                    );
                    $this->exitStatus($error);
                }
            }
            $this->exitStatus(true);
        } else {
            $this->exitStatus($this->error_message);
        }
    }

    /**
     * Function change type cell value to string and replace ',' to ';' in calculate cell
     *
     * @param array $datas      Data cell
     * @param array $valueDatas Data cell value
     * @param array $maxCell    Max number row and col
     *
     * @return mixed
     */
    public function changeValueCalculateCell($datas, $valueDatas, $maxCell)
    {
        for ($i = 0; $i < $maxCell['row']; $i++) {
            $datas[$i] = array_map(
                function ($data, $valueData) {
                    $data = (string)$data;
                    $key = substr($data, 0, 1);
                    $pattern = '@^=(DATE|DAY|DAYS|DAYS360|AND|OR|XOR|SUM|COUNT|MIN|MAX|AVG|CONCAT|date|day|days|days360|and|or|xor|sum|count|min|max|avg|concat)\\((.*?)\\)$@';
                    if ($key === '=' && preg_match($pattern, $data, $matches)) {
                        $data = str_replace(',', ';', $data);
                    } else {
                        $data = $valueData;
                    }

                    return (string)$data;
                },
                $datas[$i],
                $valueDatas[$i]
            );
        }

        return $datas;
    }

    /**
     * Function replace ';' to ',' of cell value in calculate cell
     *
     * @param array $datas   Data cell
     * @param array $maxCell Max number row and col
     *
     * @return mixed
     */
    public function renderValueCalculateCell($datas, $maxCell)
    {
        for ($i = 0; $i < $maxCell['row']; $i++) {
            $datas[$i] = array_map(
                function ($data) {
                    $data = (string)$data;
                    $key = substr($data, 0, 1);
                    $pattern = '@^=(DATE|DAY|DAYS|DAYS360|AND|OR|XOR|SUM|COUNT|MIN|MAX|AVG|CONCAT|date|day|days|days360|and|or|xor|sum|count|min|max|avg|concat)\\((.*?)\\)$@';
                    if ($key === '=' && preg_match($pattern, $data, $matches)) {
                        $data = str_replace(';', ',', $data);
                    }

                    return $data;
                },
                $datas[$i]
            );
        }

        return $datas;
    }

    /**
     * Function creator array list data merge cell
     *
     * @param array $mergeRanges Value return $sheetActive->getMergeCells
     *
     * @return array
     */
    public function getMergeCell($mergeRanges)
    {
        $mergeSettings = array();

        foreach ($mergeRanges as $mergeRange) {
            list($tlCell, $rbCell) = explode(':', $mergeRange);

            list($tl_cNb, $tl_rNb) = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::coordinateFromString($tlCell);
            list($br_cNb, $br_rNb) = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::coordinateFromString($rbCell);
            $tl_cNb = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($tl_cNb);
            $br_cNb = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($br_cNb);

            $mergeSetting = new stdClass();
            $mergeSetting->row = $tl_rNb - 1;
            $mergeSetting->col = $tl_cNb - 1;
            $mergeSetting->rowspan = $br_rNb - $tl_rNb + 1;
            $mergeSetting->colspan = $br_cNb - $tl_cNb + 1;
            $mergeSettings[] = $mergeSetting;
        }

        return $mergeSettings;
    }

    /**
     * Convert utf8
     *
     * @param array $array Array
     *
     * @return mixed
     */
    public function utf8Converter($array)
    {
        ini_set('mbstring.substitute_character', 'none');
        array_walk_recursive($array, function (&$item, $key) {
            if (!mb_detect_encoding($item, 'utf-8', true)) {
                $item = mb_convert_encoding($item, 'UTF-8', 'UTF-8');
            }
        });

        return $array;
    }

    /**
     * Create CSS style
     *
     * @param PhpOffice\PhpSpreadsheet\Style\Style $pStyle PhpOffice\PhpSpreadsheet\Style\Style
     *
     * @return array
     */
    private function createCSSStyleExel(PhpOffice\PhpSpreadsheet\Style\Style $pStyle)
    {
        // Construct CSS
        $css = '';

        $css = array_merge(
            $this->createCSSStyleAlignmentExcel($pStyle->getAlignment()),
            $this->createCSSStyleBordersExcel($pStyle->getBorders()),
            $this->createCSSStyleFontExcel($pStyle->getFont()),
            $this->createCSSStyleFillExcel($pStyle->getFill())
        );

        // Return
        return $css;
    }

    /**
     * Create CSS style (PhpSpreadsheet style alignment)
     *
     * @param PhpOffice\PhpSpreadsheet\Style\Alignment $getAlignment PhpOffice\PhpSpreadsheet\Style\Alignment
     *
     * @return array
     */
    private function createCSSStyleAlignmentExcel(PhpOffice\PhpSpreadsheet\Style\Alignment $getAlignment)
    {
        // Construct CSS
        $css = array();

        // Create CSS
        $css['cell_vertical_align'] = $this->mapVAlignExcel($getAlignment->getVertical());
        $textAlign = $this->mapHAlignExcel($getAlignment->getHorizontal());
        if ($textAlign) {
            $css['cell_text_align'] = $textAlign;
            if (in_array($textAlign, array('left', 'right'))) {
                $css['cell_padding_' . $textAlign] = (string)((int)$getAlignment->getIndent() * 9) . 'px';
            }
        }

        // Return
        return $css;
    }

    /**
     * Create CSS style (PhpSpreadsheet style font)
     *
     * @param PhpOffice\PhpSpreadsheet\Style\Font $pStyle PhpOffice\PhpSpreadsheet\Style\Font
     *
     * @return array
     */
    private function createCSSStyleFontExcel(PhpOffice\PhpSpreadsheet\Style\Font $pStyle)
    {
        // Construct CSS
        $css = array();

        // Create CSS
        if ($pStyle->getBold()) {
            $css['cell_font_bold'] = true;
        }
        if ((string)$pStyle->getUnderline() !== PhpOffice\PhpSpreadsheet\Style\Font::UNDERLINE_NONE && $pStyle->getStrikethrough()) {
            $css['cell_font_underline'] = true;
        } elseif ((string)$pStyle->getUnderline() !== PhpOffice\PhpSpreadsheet\Style\Font::UNDERLINE_NONE) {
            $css['cell_font_underline'] = true;
        } elseif ($pStyle->getStrikethrough()) {
            $css['cell_font_underline'] = false;
        }
        if ($pStyle->getItalic()) {
            $css['cell_font_italic'] = true;
        }

        $css['cell_font_color'] = '#' . $pStyle->getColor()->getRGB();
        $css['cell_font_family'] = $pStyle->getName();
        $css['cell_font_size'] = floor($pStyle->getSize() * 96 / 72); //points = pixels * 72 / 96
        // Return
        return $css;
    }

    /**
     * Create CSS style (PhpSpreadsheet style borders)
     *
     * @param PhpOffice\PhpSpreadsheet\Style\Borders $pStyle PhpOffice\PhpSpreadsheet\Style\Borders
     *
     * @return array
     */
    private function createCSSStyleBordersExcel(PhpOffice\PhpSpreadsheet\Style\Borders $pStyle)
    {
        // Construct CSS
        $css = array();

        // Create CSS
        $css['cell_border_bottom'] = $this->createCSSStyleBorderExcel($pStyle->getBottom());
        $css['cell_border_top'] = $this->createCSSStyleBorderExcel($pStyle->getTop());
        $css['cell_border_left'] = $this->createCSSStyleBorderExcel($pStyle->getLeft());
        $css['cell_border_right'] = $this->createCSSStyleBorderExcel($pStyle->getRight());

        // Return
        return $css;
    }

    /**
     * Create CSS style (PhpSpreadsheet style border)
     *
     * @param PhpOffice\PhpSpreadsheet\Style\Border $pStyle PhpOffice\PhpSpreadsheet\Style\Border
     *
     * @return string
     */
    private function createCSSStyleBorderExcel(PhpOffice\PhpSpreadsheet\Style\Border $pStyle)
    {
        // Create CSS
        // $css = $this->mapBorderStyleExcel($pStyle->getBorderStyle()) . ' #' . $pStyle->getColor()->getRGB();
        // Create CSS - add !important to non-none border styles for merged cells
        $borderStyle = $this->mapBorderStyleExcel($pStyle->getBorderStyle());
        $css = $borderStyle . ' #' . $pStyle->getColor()->getRGB() . (($borderStyle === 'none') ? '' : ' !important');

        // Return
        return $css;
    }

    /**
     * Create CSS style (PhpSpreadsheet style fill)
     *
     * @param PhpOffice\PhpSpreadsheet\Style\Fill $pStyle PhpOffice\PhpSpreadsheet\Style\Fill
     *
     * @return array
     */
    private function createCSSStyleFillExcel(PhpOffice\PhpSpreadsheet\Style\Fill $pStyle)
    {
        // Construct HTML
        $css = array();

        // Create CSS
        $value = $pStyle->getFillType() === PhpOffice\PhpSpreadsheet\Style\Fill::FILL_NONE ?
            '' : '#' . $pStyle->getStartColor()->getRGB();
        $css['cell_background_color'] = $value;

        // Return
        return $css;
    }

    /**
     * Map VAlign
     *
     * @param string $vAlign Vertical alignment
     *
     * @return string
     */
    private function mapVAlignExcel($vAlign)
    {
        switch ($vAlign) {
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_BOTTOM:
                return 'bottom';
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP:
                return 'top';
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER:
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_JUSTIFY:
                return 'middle';
            default:
                return 'baseline';
        }
    }

    /**
     * Map HAlign
     *
     * @param string $hAlign Horizontal alignment
     *
     * @return string|false
     */
    private function mapHAlignExcel($hAlign)
    {
        switch ($hAlign) {
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_GENERAL:
                return false;
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT:
                return 'left';
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT:
                return 'right';
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER:
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER_CONTINUOUS:
                return 'center';
            case \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_JUSTIFY:
                return 'justify';
            default:
                return false;
        }
    }

    /**
     * Map border style
     *
     * @param integer $borderStyle Sheet index
     *
     * @return string
     */
    private function mapBorderStyleExcel($borderStyle)
    {
        switch ($borderStyle) {
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_NONE:
                return 'none';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DASHDOT:
                return '1px dashed';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DASHDOTDOT:
                return '1px dotted';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DASHED:
                return '1px dashed';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DOTTED:
                return '1px dotted';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DOUBLE:
                return '3px double';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_HAIR:
                return '1px solid';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM:
                return '2px solid';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUMDASHDOT:
                return '2px dashed';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUMDASHDOTDOT:
                return '2px dotted';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUMDASHED:
                return '2px dashed';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_SLANTDASHDOT:
                return '2px dashed';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THICK:
                return '3px solid';
            case PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN:
                return '1px solid';
            default:
                return '1px solid'; // map others to thin
        }
    }

    /**
     * Upload file excel
     *
     * @return boolean|string
     */
    private function uploadFileExcel()
    {
        if (!empty($_FILES)) {
            $tempFile = $_FILES['file'];
            //check file extension
            $tempFile['name'] = html_entity_decode($tempFile['name']);
            $ext = strtolower(pathinfo($tempFile['name'], PATHINFO_EXTENSION));
            $newname = uniqid() . '.' . $ext;
            if (!in_array($ext, $this->allowed_ext)) {
                $this->error_message = __('Wrong file extension', 'wptm');

                return false;
            }

            $upload_dir = wp_upload_dir();
            $targetPath = $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'wptm' . DIRECTORY_SEPARATOR;
            if (!file_exists($targetPath)) {
                mkdir($targetPath, 0777, true);
                $data = '<html><body bgcolor="#FFFFFF"></body></html>';
                $file = fopen($targetPath . 'index.html', 'w');
                fwrite($file, $data);
                fclose($file);
            }

            $targetFile = $targetPath . $newname;
            if (!move_uploaded_file($tempFile['tmp_name'], $targetFile)) {
                $this->error_message = __('Error orcured when retrieving file to temporary folder', 'wptm');

                return false;
            } else {
                return $targetFile;
            }
        } else {
            $this->error_message = __('Please choose a file before submit!', 'wptm');

            return false;
        }
    }

    /**
     * Function export
     *
     * @param null|array $dataTable Data table export
     *
     * @return void
     */
    public function export($dataTable = null)
    {
        $file = $this->makeFileExcel($dataTable);
        if ($file && is_readable($file)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename=' . basename($file));
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            readfile($file);

            if (file_exists($file)) {
                unlink($file);
            }
        } else {
            $this->exitStatus(sprintf('%s', $this->error_message));
        }
        die();
    }

    /**
     * Function make file
     *
     * @param null|array $dataTable Data table export
     *
     * @return boolean|resource|string
     */
    private function makeFileExcel($dataTable)
    {
        $format_excel = Utilities::getInput('format_excel');
        $id = Utilities::getInt('id', 'GET');
        $onlydata = Utilities::getInt('onlydata', 'GET');
        if ($dataTable === null) {
            $modelTable = $this->getModel('table');
            $tableContent = $modelTable->getItem($id, true, true, null, false);
        } else {
            $tableContent = $dataTable;
        }

        $folder_admin = dirname(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin';
        require_once $folder_admin . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'phpspreadsheet' . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $activeSheet = $spreadsheet->getActiveSheet();

        $activeSheet->fromArray($tableContent->datas);
        $this->maxCell = $activeSheet->getHighestRowAndColumn();
        $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($this->maxCell['column']);

        $datas = $this->renderValueCalculateCell($tableContent->datas, $this->maxCell);

        $activeSheet->fromArray($datas);

        if ($format_excel === 'xlsx') {
            $activeSheet->rangeToArray('A1:' . $this->maxCell['column'] . $this->maxCell['row'], '', false);
        } else {
            $data = $activeSheet->rangeToArray('A1:' . $this->maxCell['column'] . $this->maxCell['row'], '', true);
            $activeSheet->fromArray($data);
        }

        if ($onlydata && $onlydata === 1) {
            $style_row = array();
            $style_column = array();
            /*set style table*/
            if (isset($tableContent->style->table)) {
                $tableStyles = (array)$tableContent->style->table;
                if (!empty($tableStyles)) {
                    $activeSheet = $this->setStyleTable($activeSheet, $tableStyles);
                }
            } else {
                $tableStyles = array();
            }

            /*set width columns*/
            if (isset($tableContent->style->cols) && !empty($tableContent->style->cols)) {
                $cI = 0;
                foreach ($tableContent->style->cols as $col) {
                    if (is_array($col) && isset($col[1]) && isset($col[1]->width)) {
                        $activeSheet->getColumnDimensionByColumn($cI + 1)->setWidth(floor($col[1]->width / 10)); //Excel unit: number of characters that can be displayed with the standard font
                        $style_column[$col[0]] = (array)$col[1];
                        $activeSheet = $this->setCellStyle($activeSheet, $cI + 1, array(1, $this->maxCell['row']), (array)$col[1], $tableStyles);
                    } elseif (!is_array($col) && isset($col->{1}) && isset($col->{1}->width)) {
                        $activeSheet->getColumnDimensionByColumn($cI + 1)->setWidth(floor($col->{1}->width / 10)); //Excel unit: number of characters that can be displayed with the standard font
                        $style_column[$col->{0}] = (array)$col->{1};
                        $activeSheet = $this->setCellStyle($activeSheet, $cI + 1, array(1, $this->maxCell['row']), (array)$col->{1}, $tableStyles);
                    }
                    $cI++;
                }
            }

            /*set height rows*/
            if ($tableContent->type !== 'mysql' && isset($tableContent->style->rows) && !empty($tableContent->style->rows)) {
                $rI = 0;
                foreach ($tableContent->style->rows as $row) {
                    $rI++;
                    if (is_array($row) && isset($row[1]) && isset($row[1]->height)) {
                        $activeSheet->getRowDimension($rI)->setRowHeight(floor($row[1]->height / 1.333333)); //px 2 pt
                        $activeSheet = $this->setCellStyle($activeSheet, array(1, $columnIndex), $rI, (array)$row[1], $tableStyles);
                        $style_row[$row[0]] = (array)$row[1];
                    } elseif (!is_array($row) && isset($row->{1}) && isset($row->{1}->height)) {
                        $activeSheet->getRowDimension($rI)->setRowHeight(floor($row->{1}->height / 1.333333)); //px 2 pt
                        $activeSheet = $this->setCellStyle($activeSheet, array(1, $columnIndex), $rI, (array)$row->{1}, $tableStyles);
                        $style_row[$row->{0}] = (array)$row->{1};
                    }
                }
            } elseif ($tableContent->type === 'mysql') {
                if (!empty($tableContent->style->table->allRowHeight) && $tableContent->style->table->allRowHeight > 0) {
                    $rowHeight = $tableContent->style->table->allRowHeight / 1.333333;
                }

                for ($rI = 0; $rI < $this->maxCell['row']; $rI++) {
                    if (isset($tableContent->style->rows) && isset($tableContent->style->rows->{$rI})) {
                        $row = $tableContent->style->rows->{$rI};
                        if (!empty($row[1]) && !empty($row[1]->height)) {
                            $activeSheet->getRowDimension($rI + 1)->setRowHeight(floor($row[1]->height / 1.333333)); //px 2 pt
                            $style_row[$row[0]] = (array)$row[1];
                            $activeSheet = $this->setCellStyle($activeSheet, array(1, $columnIndex), $rI + 1, (array)$row[1], $tableStyles);
                        } elseif (!empty($row->{1}) && !empty($row->{1}->height)) {
                            $activeSheet->getRowDimension($rI + 1)->setRowHeight(floor($row->{1}->height / 1.333333)); //px 2 pt
                            $style_row[$row->{0}] = (array)$row->{1};
                            $activeSheet = $this->setCellStyle($activeSheet, array(1, $columnIndex), $rI + 1, (array)$row->{1}, $tableStyles);
                        } else {
                            $activeSheet->getRowDimension($rI + 1)->setRowHeight(floor($rowHeight)); //px 2 pt
                            $activeSheet = $this->setCellStyle($activeSheet, array(1, $columnIndex), $rI + 1, array(), $tableStyles);
                        }
                    } else {
                        $activeSheet = $this->setCellStyle($activeSheet, array(1, $columnIndex), $rI + 1, array(), $tableStyles);
                    }
                }
            }

            /*set style cells*/
            if (isset($tableContent->style->cells)) {
                $cellStyles = $tableContent->style->cells;
                if (!empty($cellStyles)) {
                    foreach ($cellStyles as $key => $cellCss) {
                        $check_valid_cells = explode('!', $key);
                        if (isset($check_valid_cells[0]) && (int)$check_valid_cells[0] >= 0 && isset($cellCss[2])) {
                            $cellCss[2] = array_merge(
                                isset($style_row[$check_valid_cells[0]]) ? $style_row[$check_valid_cells[0]] : array(),
                                isset($style_column[$check_valid_cells[1]]) ? $style_column[$check_valid_cells[1]] : array(),
                                $cellCss[2]
                            );
                            $activeSheet = $this->setCellStyle($activeSheet, $check_valid_cells[1] + 1, $check_valid_cells[0] + 1, $cellCss[2], $tableStyles);
                        }
                    }
                }
            }

            if (gettype($tableContent->params) === 'string') {
                $tableParams = json_decode($tableContent->params, true);
            } else {
                $tableParams = json_encode($tableContent->params);
                $tableParams = json_decode($tableParams, true);
            }

            if (isset($tableParams['mergeSetting'])) {
                $mergeSettings = json_decode($tableParams['mergeSetting'], true);
            } else {
                $mergeSettings = array();
            }

            if (!empty($mergeSettings)) {
                foreach ($mergeSettings as $mergeSetting) {
                    $activeSheet->mergeCellsByColumnAndRow($mergeSetting['col'] + 1, $mergeSetting['row'] + 1, $mergeSetting['col'] + $mergeSetting['colspan'], $mergeSetting['row'] + $mergeSetting['rowspan']);
                }
            }
        }

        if ($format_excel === 'xlsx') {
            $objWriter = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        } elseif ($format_excel === 'xls') {
            $objWriter = new \PhpOffice\PhpSpreadsheet\Writer\Xls($spreadsheet);
        }

        $upload_dir = wp_upload_dir();
        $targetPath = $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'wptm' . DIRECTORY_SEPARATOR;

        if (!file_exists($targetPath)) {
            mkdir($targetPath, 0777, true);
            $data = '<html><body bgcolor="#FFFFFF"></body></html>';
            $file = fopen($targetPath . 'index.html', 'w');
            fwrite($file, $data);
            fclose($file);
        }

        $tableContent->title = strtolower(preg_replace('/[^a-z0-9_]+/i', '_', $tableContent->title));
        $file = $targetPath . DIRECTORY_SEPARATOR . $tableContent->title . '_' . $id . '.' . $format_excel;

        try {
            $objWriter->save($file);
        } catch (Exception $e) {
            $this->error_message = __('Error occurred when creating file to export! <br/>Please try again.', 'wptm');
        }

        if (!file_exists($file) || !is_readable($file)) {
            $this->error_message = __('Error occurred when creating file to export! <br/>Please try again.', 'wptm');

            return false;
        }

        return $file;
    }

    /**
     * Function set style of table(freeze_row, col, symbol...)
     *
     * @param object $activeSheet ActiveSheet
     * @param array  $tableStyle  Data style table
     *
     * @return mixed
     */
    public function setStyleTable($activeSheet, $tableStyle)
    {
        /*freeze col and arow*/
        if (isset($tableStyle['freeze_col']) && $tableStyle['freeze_col']) {
            $freeze_col = (int)$tableStyle['freeze_col'] + 1;
        } else {
            $freeze_col = 1;
        }

        if (isset($tableStyle['freeze_row']) && $tableStyle['freeze_row']) {
            $freeze_row = (int)$tableStyle['freeze_row'] + 1;
        } else {
            $freeze_row = 1;
        }

        if ($freeze_row * $freeze_col !== 1) {
            $activeSheet->freezePaneByColumnAndRow($freeze_col, $freeze_row);
        }

        return $activeSheet;
    }

    /**
     * Function set style for cell
     *
     * @param object        $activeSheet ActiveSheet
     * @param integer|array $col         Col
     * @param integer|array $row         Row
     * @param array         $css         Css
     * @param array         $tableStyles Data option table
     *
     * @return mixed
     */
    public function setCellStyle($activeSheet, $col, $row, $css, $tableStyles)
    {
        $selection = array();
        if (is_array($row)) {
            $selection[1] = $row[0];//row start
            $selection[3] = $row[1];//row end
        } else {
            $selection[1] = $row;
            $selection[3] = $row;
        }
        if (is_array($col)) {
            $selection[0] = $col[0];//column start
            $selection[2] = $col[1];//column end
        } else {
            $selection[0] = $col;
            $selection[2] = $col;
        }
        $getStyle = $activeSheet->getStyleByColumnAndRow($selection[0], $selection[1], $selection[2], $selection[3]);

        //font
        if (isset($css['cell_font_bold']) && $css['cell_font_bold']) {
            $getStyle->getFont()->setBold(true);
        }
        if (isset($css['cell_font_underline']) && $css['cell_font_underline']) {
            $getStyle->getFont()->setUnderline(true);
        }
        if (isset($css['cell_font_italic']) && $css['cell_font_italic']) {
            $getStyle->getFont()->setItalic(true);
        }
        if (isset($css['cell_font_color']) && $css['cell_font_color']) {
            $getStyle->getFont()->getColor()->setRGB(str_replace('#', '', $css['cell_font_color']));
        }
        if (isset($css['cell_font_family']) && $css['cell_font_family']) {
            $getStyle->getFont()->setName($css['cell_font_family']);
        }
        if (isset($css['cell_font_size']) && $css['cell_font_size']) {
            $getStyle->getFont()->setSize($css['cell_font_size'] * 72 / 96); //points = pixels * 72 / 96
        }

        //Alignment
        if (isset($css['cell_vertical_align']) && $css['cell_vertical_align']) {
            if ($css['cell_vertical_align'] === 'middle') {
                $vertical = 'center';
            } else {
                $vertical = $css['cell_vertical_align'];
            }
            $getStyle->getAlignment()->setVertical($vertical);
        }
        if (isset($css['cell_text_align']) && $css['cell_text_align']) {
            $horizontal = $css['cell_text_align'];
            $getStyle->getAlignment()->setHorizontal($horizontal);
        }

        //Fill
        if (!isset($css['cell_background_color']) || isset($css['cell_background_color']) && $css['cell_background_color'] === '') {
            if (isset($tableStyles['allAlternate']) && isset($tableStyles['allAlternate']->old)) {
                if (is_array($col)) {
                    if ($selection[1] % 2 === (($tableStyles['allAlternate']->header !== '') ? 0 : 1)) {
                        $css['cell_background_color'] = $tableStyles['allAlternate']->even;
                    } else {
                        $css['cell_background_color'] = $tableStyles['allAlternate']->old;
                    }
                    if ($selection[1] === 1 && $tableStyles['allAlternate']->header !== '') {
                        $css['cell_background_color'] = $tableStyles['allAlternate']->header;
                    } elseif ($this->maxCell['row'] === $selection[1] && $tableStyles['allAlternate']->footer !== '') {
                        $css['cell_background_color'] = $tableStyles['allAlternate']->footer;
                    }
                }
            } else {
                if (isset($css['AlternateColor'])) {
                    $css['cell_background_color'] = $this->getAlternateColor($selection[1] - 1, $css, $tableStyles);
                }
            }
        }

        if (isset($css['cell_background_color'])) {
            $fill_color = str_replace('#', '', $css['cell_background_color']);
            if ($fill_color === null || $fill_color === '') {
                $fill_color = 'ffffff';
            }
            $getStyle->getFill()->setFillType(PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID);
            $getStyle->getFill()->getStartColor()->setRGB($fill_color);
        }

        //Border
        if (isset($css['cell_border_bottom']) && $css['cell_border_bottom']) {
            list($bWidth, $bStyle, $bColor) = array_merge(explode(' ', $css['cell_border_bottom']), array('', ''));
            if ($bColor !== '') {
                $borderStyle = $this->getBorderStyle($bWidth, $bStyle);
                $getStyle->getBorders()->getBottom()->setBorderStyle($borderStyle);
                $bColor = str_replace('#', '', trim($bColor));
                $getStyle->getBorders()->getBottom()->getColor()->setRGB($bColor);
            }
        }

        if (isset($css['cell_border_top']) && $css['cell_border_top']) {
            list($bWidth, $bStyle, $bColor) = array_merge(explode(' ', $css['cell_border_top']), array('', ''));
            if ($bColor !== '') {
                $borderStyle = $this->getBorderStyle($bWidth, $bStyle);
                $getStyle->getBorders()->getTop()->setBorderStyle($borderStyle);
                $bColor = str_replace('#', '', trim($bColor));
                $getStyle->getBorders()->getTop()->getColor()->setRGB($bColor);
            }
        }

        if (isset($css['cell_border_left']) && $css['cell_border_left']) {
            list($bWidth, $bStyle, $bColor) = array_merge(explode(' ', $css['cell_border_left']), array('', ''));
            if ($bColor !== '') {
                $borderStyle = $this->getBorderStyle($bWidth, $bStyle);
                $getStyle->getBorders()->getLeft()->setBorderStyle($borderStyle);
                $bColor = str_replace('#', '', trim($bColor));
                $getStyle->getBorders()->getLeft()->getColor()->setRGB($bColor);
            }
        }

        if (isset($css['cell_border_right']) && $css['cell_border_right']) {
            list($bWidth, $bStyle, $bColor) = array_merge(explode(' ', $css['cell_border_right']), array('', ''));
            if ($bColor !== '') {
                $borderStyle = $this->getBorderStyle($bWidth, $bStyle);
                $getStyle->getBorders()->getRight()->setBorderStyle($borderStyle);
                $bColor = str_replace('#', '', trim($bColor));
                $getStyle->getBorders()->getRight()->getColor()->setRGB($bColor);
            }
        }

        return $activeSheet;
    }

    /**
     * Function set background color cell by alternate color
     *
     * @param integer $row         Row number
     * @param array   $css         Data css cell
     * @param array   $tableStyles Table styles
     *
     * @return string
     */
    public function getAlternateColor($row, $css, $tableStyles)
    {
        $fill_color = '';
        if (!isset($tableStyles['alternateColorValue'])) {
            return '';
        } else {
            if (is_array($tableStyles['alternateColorValue'])) {
                $alternateColorValue = (array)$tableStyles['alternateColorValue'][$css['AlternateColor']];
            } else {
                $alternateColorValue = (array)$tableStyles['alternateColorValue']->{$css['AlternateColor']};
            }
            if (empty($alternateColorValue)) {
                return '';
            }
        }

        $numberRow = 0;
        if ($alternateColorValue['header'] === '') {
            $numberRow = -1;
        }
        switch ($row) {
            case $alternateColorValue['selection'][0]:
                if ($numberRow === -1) {
                    $fill_color .= $alternateColorValue['even'];
                } else {
                    $fill_color .= $alternateColorValue['header'];
                }
                break;
            case $alternateColorValue['selection'][2]:
                if ($alternateColorValue['footer'] === '') {
                    if (($row - (int)($alternateColorValue['selection'][0] + $numberRow)) % 2) {
                        $fill_color .= $alternateColorValue['even'];
                    } else {
                        $fill_color .= $alternateColorValue['old'];
                    }
                } else {
                    $fill_color .= $alternateColorValue['footer'];
                }
                break;
            default:
                if (($row - (int)($alternateColorValue['selection'][0] + $numberRow)) % 2) {
                    $fill_color .= $alternateColorValue['even'];
                } else {
                    $fill_color .= $alternateColorValue['old'];
                }
                break;
        }

        return $fill_color;
    }

    /**
     * Function get Border Style cell
     *
     * @param integer $bWidth Width
     * @param string  $bStyle Style
     *
     * @return string
     */
    public function getBorderStyle($bWidth, $bStyle)
    {
        $borderStyle = PhpOffice\PhpSpreadsheet\Style\Border::BORDER_NONE;
        $bStyle = trim($bStyle);
        $bWidth = (int)$bWidth;
        if ($bWidth > 1) {
            switch ($bStyle) {
                case 'solid':
                    $borderStyle = PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM;
                    break;
                case 'dashed':
                    $borderStyle = PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUMDASHED;
                    break;
                case 'dotted':
                    $borderStyle = PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUMDASHDOT;
                    break;
            }
        } elseif ((int)$bWidth === 1) {
            switch ($bStyle) {
                case 'solid':
                    $borderStyle = PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN;
                    break;
                case 'dashed':
                    $borderStyle = PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DASHED;
                    break;
                case 'dotted':
                    $borderStyle = PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DOTTED;
                    break;
            }
        } else {
            $borderStyle = PhpOffice\PhpSpreadsheet\Style\Border::BORDER_NONE;
        }

        return $borderStyle;
    }

    /**
     * Function syncSpreadsheet
     *
     * @return boolean|integer
     */
    public function syncSpreadsheet()
    {
        $modelTable = $this->getModel('tables');
        $tables = $modelTable->getItems();

        $count = 0;
        foreach ($tables as $table) {
            if ($table->type === 'html') {
                $count = $this->synControl($table, $count);
            }
        }

        return $count; //number of table synced
    }

    /**
     * SyncSpreadsheet control function (googleSpreadsheet / import excel)
     *
     * @param object  $table Table Data
     * @param integer $count Table number
     *
     * @return integer
     */
    public function synControl($table, $count)
    {
        if (is_string($table->style)) {
            $tblStyles = new stdClass();
            $tblStyles->table = json_decode($table->params);
        } else {
            $tblStyles = $table->style;
        }
        if (isset($tblStyles->table)) {
            if (isset($tblStyles->table->auto_sync)
                && (int)$tblStyles->table->auto_sync === 1
                && isset($tblStyles->table->spreadsheet_url)
                && $tblStyles->table->spreadsheet_url) {
                $spreadsheet_url = $tblStyles->table->spreadsheet_url;
                $spreadsheet_style = isset($tblStyles->table->spreadsheet_style) ? (int)$tblStyles->table->spreadsheet_style : 0;
                if (strpos($spreadsheet_url, 'docs.google.com/spreadsheet') !== false) {
                    $syncType = 'spreadsheet';
                } else {
                    $syncType = 'excel';
                }
                if ($this->updateTableFromSpreadsheet($table->id, $spreadsheet_url, $spreadsheet_style, $syncType)) {
                    $count++;
                }
            }

            if (isset($tblStyles->table->excel_auto_sync)
                && (int)$tblStyles->table->excel_auto_sync === 1
                && isset($tblStyles->table->excel_url)
                && $tblStyles->table->excel_url) {
                $spreadsheet_url = $tblStyles->table->excel_url;
                $spreadsheet_style = isset($tblStyles->table->excel_spreadsheet_style) ? (int)$tblStyles->table->excel_spreadsheet_style : 0;
                if (strpos($spreadsheet_url, 'docs.google.com/spreadsheet') !== false) {
                    $syncType = 'spreadsheet';
                } else {
                    $syncType = 'excel';
                }
                if ($this->updateTableFromSpreadsheet($table->id, $spreadsheet_url, $spreadsheet_style, $syncType)) {
                    $count++;
                }
            }
        }
        return $count;
    }

    /**
     * Function fetch Spread sheet
     *
     * @return void
     */
    public function fetchSpreadsheet()
    {
        $id_table = Utilities::getInt('id', 'POST');
        $autoSync = Utilities::getInt('sync', 'POST');
        $fetchStyle = Utilities::getInt('style', 'POST');
        $syncType = Utilities::getInput('syncType', 'POST');//fetch excel/google
        $spreadsheet_url = Utilities::getInput('spreadsheet_url', 'POST', 'none');

        if ($id_table && $spreadsheet_url) {
            $update = $this->updateTableFromSpreadsheet($id_table, $spreadsheet_url, $fetchStyle, $syncType);
            if (!$update) {
                $this->exitStatus(__('error while saving table', 'wptm'));
            } else {
                $this->exitStatus(true, array(
                    'sync' => $autoSync,
                    'style' => $fetchStyle,
                    'spreadsheet_url' => $spreadsheet_url
                ));
            }
        }

        $this->exitStatus(true, array(
            'sync' => $autoSync,
            'style' => $fetchStyle,
            'spreadsheet_url' => $spreadsheet_url
        ));
    }

    /**
     * Function update Table From Spread sheet
     *
     * @param integer $id_table        Id of table
     * @param string  $spreadsheet_url Url
     * @param integer $fetchStyle      Fetch style table
     * @param string  $syncType        Fetch from google or excel
     *
     * @return boolean
     */
    public function updateTableFromSpreadsheet($id_table, $spreadsheet_url, $fetchStyle, $syncType)
    {
        Application::getInstance('Wptm');
        /* @var WptmModelTable $modelTable */
        $modelTable = $this->getModel('table');
        if (!$modelTable) {
            // call this function from site
            require_once dirname(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'table.php';
            $modelTable = new WptmModelTable();
        }

        if ($fetchStyle === 1) {//render new style
            $tableContent = (array)$modelTable->getItem($id_table, false, true);

            $modelTable->deleteOldStyle($id_table);
            $tableContent['style'] = new stdClass();
            $tableContent['style']->rows = new stdClass();
            $tableContent['style']->cols = new stdClass();
        } else {
            $tableContent = (array)$modelTable->getItem($id_table, false, false);
        }
        $doUpdate = false;

        $folder_admin = dirname(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin';
        require_once $folder_admin . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'phpspreadsheet' . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

        if (strpos($spreadsheet_url, 'docs.google.com/spreadsheet') !== false) {
            $syncType = 'spreadsheet';

            //convert to url export csv
            $url_arr = explode('/', $spreadsheet_url);
            array_pop($url_arr);
            $csv_url = implode('/', $url_arr) . '/pub?hl=en_US&single=true&output=csv';

            $url_query = parse_url($spreadsheet_url, PHP_URL_QUERY);
            if (!empty($url_query)) {
                parse_str($url_query, $url_query_params);
                if (isset($url_query_params['gid'])) {
                    $csv_url .= '&gid=' . $url_query_params['gid'];
                }
            }

            /*download file .csv*/
            $file = $this->getCsvDataFromUrl($csv_url, $spreadsheet_url);

            if ($file !== false) {
                $readFileExcel = $this->readFileExcel($file, true, false, $tableContent['params'], $fetchStyle === 1);
                if (isset($readFileExcel['status']) && $readFileExcel['status']) {
                    $doUpdate = true;
                } elseif (isset($readFileExcel['text'])) {
                    $this->exitStatus(esc_attr($readFileExcel['text']));
                } elseif (is_string($readFileExcel)) {
                    $this->exitStatus(esc_attr($readFileExcel));
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            $syncType = 'excel';
            //download file
            $file = $this->downloadFileExcel($spreadsheet_url);

            if ($file) {
                $readFileExcel = $this->readFileExcel($file, true, false, $tableContent['params'], $fetchStyle === 1);
                if (isset($readFileExcel['status']) && $readFileExcel['status']) {
                    $doUpdate = true;
                } elseif (isset($readFileExcel['text'])) {
                    $this->exitStatus(esc_attr($readFileExcel['text']));
                } elseif (is_string($readFileExcel)) {
                    $this->exitStatus(esc_attr($readFileExcel));
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        $updated = false;
        if (isset($readFileExcel)) {
            $tableContent['datas'] = $readFileExcel['data']['data'];
            $tableContent['params']->mergeSetting = $readFileExcel['data']['mergeSetting'];

            if ($syncType === 'spreadsheet') {
                $tableContent['params']->spreadsheet_style = $fetchStyle;
                $spreadsheet_url = str_replace('%20', ' ', $spreadsheet_url);
                $tableContent['params']->spreadsheet_url = $spreadsheet_url;
            } else {
                $tableContent['params']->excel_spreadsheet_style = $fetchStyle;
                $spreadsheet_url = str_replace('%20', ' ', $spreadsheet_url);
                $tableContent['params']->excel_url = $spreadsheet_url;
            }

            if ($fetchStyle === 1) {
                $tableContent['params']->cell_types = $readFileExcel['data']['typeCells'];
                $tableContent['style']->rows = $readFileExcel['data']['style']['rows'];
                $tableContent['style']->cols = $readFileExcel['data']['style']['cols'];
                $tableContent['style'] = json_encode($tableContent['style']);

                $tableContent['styleCells'] = $readFileExcel['data']['style']['cell'];
            }

            $tableContent['numberRow'] = count($tableContent['datas']);
            $tableContent['numberCol'] = count($tableContent['datas'][0]);

            $count = count($readFileExcel['data']['hyperlink']);
            if ($readFileExcel['data']['hyperlink'] !== false) {
                if ($count > 0) {
                    $tableContent['params']->cell_types = $this->changeHyperlinksTable($tableContent['params']->cell_types, $readFileExcel['data']['hyperlink']);
                }
            }
            $tableContent['params']->hyperlink = $readFileExcel['data']['hyperlink'];

            $tableContent['action'] = 'insert';

            if ($doUpdate) {
                //add table header = 1
                $header = 1;
                $tableContent['params']->headerOption = $header;
                $tableContent['params']->header_data = array();
                for ($i = 0; $i < $header; $i++) {
                    $tableContent['params']->header_data[] = $tableContent['datas'][$i];
                }

                if ($modelTable->saveTableSynfile($id_table, $tableContent)) {
                    $updated = true;
                } else {
                    $this->exitStatus(__('error while saving table', 'wptm'));
                }
            }
        }

        if (file_exists($file)) {
            unlink($file);
        }

        return $updated;
    }

    /**
     * Function read data file excel(import, fetch)
     *
     * @param string  $file             Url file excel
     * @param boolean $data             Check get data cell
     * @param boolean $ignoreCheck      Ignore check
     * @param object  $tableOptionStyle Table style data option
     * @param boolean $renderStyle      Check get style table
     *
     * @return boolean|array
     */
    public function readFileExcel($file, $data, $ignoreCheck, $tableOptionStyle, $renderStyle = false)
    {
        $tableContent = array();
        $tblStyles = array();
        $hyperlinks = array();
        $cell_type = array();

        $folder_admin = dirname(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin';
        require_once $folder_admin . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'phpspreadsheet' . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

        if (!is_readable($file)) {
            return array(
                'text' => __('This file is not readable', 'wptm'),
                'file' => basename($file),
                'status' => false
            );
        }

        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file);
            //Load $inputFileName to a Spreadsheet Object
            if (!$spreadsheet->getSheetCount()) {
                return false;
            }
            $sheet = $spreadsheet->getActiveSheet();
            $maxCell = $sheet->getHighestRowAndColumn();
            // If there are more than 100 rows we need to re-check number of rows actually have data to avoid a sheet with many empty rows
            if ($maxCell['row'] > 100) {
                $valueDatas = $sheet->rangeToArray('A1:' . $maxCell['column'] . $maxCell['row'], null, false, true, false);
                //we need to first know how many rows actually have data
                $row_count = $maxCell['row'];
                // read through the data and see how many rows actually have data
                //the idea is that for every row, the first or second cell should be mandatory...
                //if we find one that is not, we stop there...
                do {
                    $row_count--;
                } while ((!$valueDatas[$row_count][0] || $valueDatas[$row_count][0] === 'NULL') &&
                (!$valueDatas[$row_count][1] || $valueDatas[$row_count][1] === 'NULL')
                );

                $maxCell['row'] = $row_count + 1;
            }

            /*convert Separator for cells*/
            if (isset($tableOptionStyle->decimal_symbol)) {
                \PhpOffice\PhpSpreadsheet\Shared\StringHelper::setDecimalSeparator($tableOptionStyle->decimal_symbol);
            } else {
                \PhpOffice\PhpSpreadsheet\Shared\StringHelper::setDecimalSeparator('.');
            }

            if (isset($tableOptionStyle->thousand_symbol)) {
                \PhpOffice\PhpSpreadsheet\Shared\StringHelper::setThousandsSeparator($tableOptionStyle->thousand_symbol);
            } else {
                \PhpOffice\PhpSpreadsheet\Shared\StringHelper::setThousandsSeparator(',');
            }

            //get style cells and FormatCode cells
            $formatCode = array();
            $maxColIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($maxCell['column']);

            if ($renderStyle) {
                $tblStyles['cols'] = new stdClass();
                $tblStyles['rows'] = new stdClass();
                $tblStyles['cell'] = array();
                for ($ri = 1; $ri <= $maxCell['row']; $ri++) {
                    for ($ci = 1; $ci <= $maxColIndex; $ci++) {
                        $column = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($ci);
                        $cellStyle = $sheet->getStyle($column . ($ri));

//                        $formatCode[$ci] = array();
//                        $formatCode[$ci][$ri] = $cellStyle->getNumberFormat()->getFormatCode();

                        /*get style for cell*/
                        $tblStyles['cell'][$ri . '|' . $ci] = array();
                        array_push($tblStyles['cell'][$ri . '|' . $ci], $ri, $ri, $ci, $ci);
                        array_push($tblStyles['cell'][$ri . '|' . $ci], json_encode($this->createCSSStyleExel($cellStyle)));

                        if ($ci + $ci > 2) {
                            $start_row1 = $ri;
                            $start_col1 = isset($tblStyles['cell'][$ri . '|' . ($ci - 1)]) ? $ci - 1 : -1;

                            if ($start_col1 !== -1 && isset($tblStyles['cell'][$start_row1 . '|' . $start_col1])) {
                                if (!isset($tblStyles['cell'][$start_row1 . '|' . $start_col1][4])) {
                                    $start_row1 = $tblStyles['cell'][$start_row1 . '|' . $start_col1][0];
                                    $start_col1 = $tblStyles['cell'][$start_row1 . '|' . $start_col1][2];
                                }
                                if ($tblStyles['cell'][$start_row1 . '|' . $start_col1][4] === $tblStyles['cell'][$ri . '|' . $ci][4]) {
                                    $tblStyles['cell'][$start_row1 . '|' . $start_col1][1] = $tblStyles['cell'][$start_row1 . '|' . $start_col1][1] < $tblStyles['cell'][$ri . '|' . $ci][1] ? $tblStyles['cell'][$ri . '|' . $ci][1] : $tblStyles['cell'][$start_row1 . '|' . $start_col1][1];
                                    $tblStyles['cell'][$start_row1 . '|' . $start_col1][3] = $tblStyles['cell'][$start_row1 . '|' . $start_col1][3] < $tblStyles['cell'][$ri . '|' . $ci][3] ? $tblStyles['cell'][$ri . '|' . $ci][3] : $tblStyles['cell'][$start_row1 . '|' . $start_col1][3];
                                    $tblStyles['cell'][$ri . '|' . $ci][0] = $tblStyles['cell'][$start_row1 . '|' . $start_col1][0];
                                    $tblStyles['cell'][$ri . '|' . $ci][1] = $tblStyles['cell'][$start_row1 . '|' . $start_col1][1];
                                    $tblStyles['cell'][$ri . '|' . $ci][2] = $tblStyles['cell'][$start_row1 . '|' . $start_col1][2];
                                    $tblStyles['cell'][$ri . '|' . $ci][3] = $tblStyles['cell'][$start_row1 . '|' . $start_col1][3];
                                    unset($tblStyles['cell'][$ri . '|' . $ci][4]);
                                }
                            }
                        }
                        if (!isset($tblStyles['cols']->{$ci - 1}[1]['width'])) {
                            $width = $sheet->getColumnDimension(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($ci))->getWidth();
                            $tblStyles['cols']->{$ci - 1}[0] = $ci - 1;
                            if ($width === -1) {
                                $width = 10;
                            }
                            $tblStyles['cols']->{$ci - 1}[1]['width'] = $width * 10;
                        }
                    }

                    $height = $sheet->getRowDimension($ri)->getRowHeight();
                    $tblStyles['rows']->{$ri - 1}[0] = $ri - 1;
                    if ($height === -1) {
                        $height = 18;
                    }
                    $tblStyles['rows']->{$ri - 1}[1]['height'] = floor($height * 1.333333); ////1 point = 1.333333 px
                }
                foreach ($sheet->getColumnDimensions() as $cd) {
                    if ($maxColIndex > \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($cd->getColumnIndex()) - 1) {
                        $tblStyles['cols']->{\PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($cd->getColumnIndex()) - 1}[1]['width'] = $cd->getWidth() * 10; //Excel unit: number of characters that can be displayed with the standard font
                    }
                }
            }

            if (isset($tblStyles['cell'])) {
                $count = count($tblStyles['cell']);
                $new_cell_style = array();
                for ($i = 0; $i < $count; $i++) {
                    $r = (int)($i / $maxColIndex);
                    $c = $i % $maxColIndex;
                    $key = ($r + 1) . '|' . ($c + 1);
                    if (isset($tblStyles['cell'][$key][4])) {
                        if (isset($tblStyles['cell'][($tblStyles['cell'][$key][0] - 1) . '|' . $tblStyles['cell'][$key][2]])) {
                            $row_before = $tblStyles['cell'][($tblStyles['cell'][$key][0] - 1) . '|' . $tblStyles['cell'][$key][2]];
                            if ($row_before[3] === $tblStyles['cell'][$key][3]) {
                                if (!isset($row_before[4])) {
                                    $row_before = $tblStyles['cell'][$row_before[0] . '|' . $row_before[2]];
                                }

                                if (!empty($row_before[4]) && $tblStyles['cell'][$key][4] === $row_before[4]) {
                                    $new_cell_style[$row_before[0] . '|' . $row_before[2]][1] = $tblStyles['cell'][$key][1];
                                    $tblStyles['cell'][$row_before[0] . '|' . $row_before[2]][1] = $tblStyles['cell'][$key][1];
                                    $tblStyles['cell'][$key][0] = $row_before[0];
                                    $tblStyles['cell'][$key][1] = $row_before[2];
                                    $tblStyles['cell'][$key][2] = $row_before[2];
                                    $tblStyles['cell'][$key][3] = $row_before[3];
                                    unset($tblStyles['cell'][$key][4]);
                                }
                            }
                        }
                        if (isset($tblStyles['cell'][$key][4])) {
                            $new_cell_style[$key] = $tblStyles['cell'][$key];
                        }
                    }
                }
                $tblStyles['cell'] = $new_cell_style;
            }

            if ($data) {
                $datas = $sheet->rangeToArray('A1:' . $maxCell['column'] . $maxCell['row'], '', false, true, false);
                $datas = $this->utf8Converter($datas);

                try {
                    $valueDatas = $sheet->rangeToArray('A1:' . $maxCell['column'] . $maxCell['row'], '', true, true, false);
                    $valueDatas = $this->utf8Converter($valueDatas);
                } catch (\Exception $e) {
                    return $e->getMessage();
                }

                if (isset($valueDatas)) {
                    /*change type cell value to string and replace ',' to ';' in calculate*/
                    $pattern = '@^=(DATE|DAY|DAYS|DAYS360|AND|OR|XOR|SUM|MULTIPLY|DIVIDE|COUNT|MIN|MAX|AVG|CONCAT|date|day|days|days360|and|or|xor|sum|multiply|divide|count|min|max|avg|concat)\\((.*?)\\)$@';
                    for ($i = 0; $i < $maxCell['row']; $i++) {
                        $count = count($datas[$i]);
                        for ($c = 0; $c < $count; $c++) {
                            $data_cell = (string)$datas[$i][$c];
                            $key = substr($data_cell, 0, 1);
                            if ($key === '=' && preg_match($pattern, $data_cell, $matches)) {
                                $datas[$i][$c] = str_replace(',', ';', $data_cell);
                            } elseif (isset($valueDatas[$i][$c]) && $valueDatas[$i][$c] !== '#NUM!') {
                                $datas[$i][$c] = $valueDatas[$i][$c];
                            }

                            if ($renderStyle && preg_match_all('@<(\w+)\b.*?>.*?</\1>@si', $data_cell, $matches2) > 0) {
                                $cell_type[] = array($i, $c, 1, 1, 'html');
                            }
                        }
                    }
//                    $datas = $this->changeValueCalculateCell($datas, $valueDatas, $maxCell);
                }
            }

            $hyperlinks = $this->getHyperlinkFromgg($file, 0);

            if (empty($datas)) {
                switch (json_last_error()) {
                    case JSON_ERROR_NONE:
                        return array('text' => ' - No errors', 'status' => false);
                    case JSON_ERROR_DEPTH:
                        return array('text' => ' - Maximum stack depth exceeded', 'status' => false);
                    case JSON_ERROR_STATE_MISMATCH:
                        return array('text' => ' - Underflow or the modes mismatch', 'status' => false);
                    case JSON_ERROR_CTRL_CHAR:
                        return array('text' => ' - Unexpected control character found', 'status' => false);
                    case JSON_ERROR_SYNTAX:
                        return array('text' => ' - Syntax error, malformed JSON', 'status' => false);
                    // phpcs:ignore PHPCompatibility.Constants.NewConstants.json_error_utf8Found -- the use of JSON_ERROR_UTF8 has check
                    case JSON_ERROR_UTF8:
                        return array(
                            'text' => ' - Malformed UTF-8 characters, possibly incorrectly encoded',
                            'status' => false
                        );
                    default:
                        return array('text' => ' - Unknown error', 'status' => false);
                }
            }
        } catch (\PhpOffice\PhpSpreadsheet\Reader\Exception $e) {
            return $e->getMessage();
        }

        //Read Merged Cells info
        $mergeSettings = array();
        $mergeRanges = $spreadsheet->getActiveSheet()->getMergeCells();
        if (count($mergeRanges)) {
            $mergeSettings = $this->getMergeCell($mergeRanges);
        }

        $tableContent = array(
            'data' => $datas,
            'style' => $tblStyles,
            'mergeSetting' => $mergeSettings,
            'typeCells' => $cell_type,
            'hyperlink' => $hyperlinks
        );

        return array('data' => $tableContent, 'status' => true);
    }

    /**
     * Add hyperlinks to table
     *
     * @param array $tableContent Data of table
     * @param array $hyperlinks   Hyperlinks data of table
     *
     * @return mixed
     */
    public function changeHyperlinksTable($tableContent, $hyperlinks)
    {
        foreach ($hyperlinks as $key => $hyperlink) {
            $keyArray = explode('!', $key);
            if (!in_array(array($keyArray[0], $keyArray[1], 1, 1, 'html'), $tableContent)) {
                $tableContent[] = array($keyArray[0], $keyArray[1], 1, 1, 'html');
            }
        }

        return $tableContent;
    }

    /**
     * Function get Data file .csv From Url
     *
     * @param string $spreadsheet_url Url
     * @param string $original_url    Original url
     *
     * @return string|boolean
     */
    public function getCsvDataFromUrl($spreadsheet_url, $original_url)
    {
        $spreadsheet_data = array();
        $csvFile = $this->downloadFileExcel($spreadsheet_url);
        $handle = fopen($csvFile, 'r');

        if ($handle !== false) {
            //phpcs:ignore Squiz.PHP.DisallowMultipleAssignments.Found -- fgetcsv return array, can not assign a value to $data before while
            while (($data = fgetcsv($handle, 1000, ',')) !== false) {
                $data = str_replace("\n", '<br/>', $data);
                $spreadsheet_data[] = $data;
            }
            fclose($handle);

            $spreadsheet_url = str_replace('output=csv', 'output=xlsx', $spreadsheet_url);
            $file = $this->downloadFileExcel($spreadsheet_url);
            /*if cann't get file from gg (first time)*/
            if ($file === false) {
                $url_query = parse_url($original_url, PHP_URL_QUERY);
                $url_arr = explode('/', $original_url);
                array_pop($url_arr);
                $csv_url = implode('/', $url_arr);

                if (!empty($url_query)) {
                    parse_str($url_query, $url_query_params);
                    if (isset($url_query_params['gid'])) {
                        $csv_url .= '/export?format=xlsx&id=' . $url_query_params['gid'];
                    }
                }
                $file = $this->downloadFileExcel($csv_url);
            }

            if (!$file) {
                return $csvFile;
            }
            unlink($csvFile);
            return $file;
        } else {
            return false;
        }
    }

    /**
     * Function get file xls from spreadsheet
     *
     * @param string $url_arr Url
     *
     * @return boolean|string
     */
    public function getFilexlsFromgg($url_arr)
    {
        $datafile = $this->getDataFromUrl($url_arr);

        if ($datafile === null) {
            return false;
        }
        $upload_dir = wp_upload_dir();
        $targetPath = $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'wptm' . DIRECTORY_SEPARATOR;
        if (file_exists($targetPath)) {
            $targetFile = $targetPath . uniqid() . '.xlsx';
        } else {
            return false;
        }
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        global $wp_filesystem;
        WP_Filesystem(); // Initial WP file system
        $wp_filesystem->put_contents(
            $targetFile,
            $datafile,
            FS_CHMOD_FILE // predefined mode settings for WP files
        );

        return $targetFile;
    }

    /**
     * Funciton get Hyperlink from file xls getSheet(0) will get a sheet first
     *
     * @param string  $targetFile Url file
     * @param integer $check      Check delete file xls
     *
     * @return array|boolean
     */
    public function getHyperlinkFromgg($targetFile, $check)
    {
        if (!is_readable($targetFile)) {
            return array(
                'text' => __('This file is not readable', 'wptm'),
                'file' => basename($targetFile),
                'status' => false
            );
        }

        $xr = new stdClass();
        $xr = \PhpOffice\PhpSpreadsheet\IOFactory::createReaderForFile($targetFile);
        $xr->setReadDataOnly(false);
        $objPHPExcel = $xr->load($targetFile);

        $worksheet = $objPHPExcel->getSheet(0);
        $sheet = $objPHPExcel->getActiveSheet();
        $maxCell = $sheet->getHighestRowAndColumn();
        $maxColIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($maxCell['column']);

        $styletable = array();
        $pattern = '@^=(HYPERLINK)\\((.*?)\\)$@';
        $pattern2 = '#\bhttps?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/))#';
        for ($ri = 1; $ri <= $maxCell['row']; $ri++) {
            for ($ci = 1; $ci <= $maxColIndex; $ci++) {
                $indexCell = $worksheet->getCell(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($ci) . $ri);
                $cell = $indexCell->getValue();
                if (preg_match($pattern, $cell, $matches)) {
                    $cells = explode(',', $matches[2]);
                    preg_match_all($pattern2, $cells[0], $val0);
                    $styletable[($ri - 1) . '!' . ($ci - 1)] = array();
                    $styletable[($ri - 1) . '!' . ($ci - 1)]['hyperlink'] = $val0[0][0];
                    $styletable[($ri - 1) . '!' . ($ci - 1)]['text'] = preg_replace('/"/', '', $cells[1]);
                }

                $getHyperlink = $indexCell->getHyperlink()->getUrl();
                if ($getHyperlink !== '' && !isset($styletable[($ri - 1) . '!' . ($ci - 1)])) {
                    $styletable[($ri - 1) . '!' . ($ci - 1)] = array();
                    $styletable[($ri - 1) . '!' . ($ci - 1)]['hyperlink'] = $getHyperlink;
                    $styletable[($ri - 1) . '!' . ($ci - 1)]['text'] = $cell;
                }
            }
        }
        if ($check === 1) {
            unlink($targetFile);
        }

        return $styletable;
    }

    /**
     * Function download file
     *
     * @param string $url Url
     *
     * @return boolean|string
     */
    public function downloadFileExcel($url)
    {
        //check file extension
        $ext = strtolower(pathinfo($url, PATHINFO_EXTENSION));
        $newname = uniqid() . '.' . $ext;
        if (strpos($url, 'docs.google.com/spreadsheet') !== false) {
            $newname = uniqid() . '.csv';
        } elseif (!in_array($ext, $this->allowed_ext)) {
            $this->error_message = __('Wrong file extension', 'wptm');

            return false;
        }

        $upload_dir = wp_upload_dir();

        $targetPath = $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'wptm' . DIRECTORY_SEPARATOR;
        if (!file_exists($targetPath)) {
            mkdir($targetPath, 0777, true);
            $data = '<html><body bgcolor="#FFFFFF"></body></html>';
            $file = fopen($targetPath . 'index.html', 'w');
            fwrite($file, $data);
            fclose($file);
        }
        $targetFile = $targetPath . $newname;


        if (!function_exists('download_url')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }
        $tmp_file = download_url($url);

        if (!file_exists($tmp_file)) {
            $this->error_message = __('Cannot download file', 'wptm');
            return false;
        } else {
            copy($tmp_file, $targetFile);
            unlink($tmp_file);
        }
        return $targetFile;
    }

    /**
     * Function get data from url
     *
     * @param string $url Url
     *
     * @return mixed|null
     * @throws Exception Error when get data
     */
    public function getDataFromUrl($url)
    {
        $ch = curl_init();
        $timeout = 10;
        $agent = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_USERAGENT, $agent);
        curl_setopt($ch, CURLOPT_REFERER, site_url());
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        $data = curl_exec($ch);
        if (curl_error($ch)) {
            $error = curl_error($ch);
            curl_close($ch);

            throw new Exception($error);
        }
        $info = curl_getinfo($ch);
        curl_close($ch);
        $statusCode = (string)$info['http_code'];

        if ($statusCode[0] === '2') {
            return $data;
        } else {
            return null;
        }
    }

    /**
     * Function csvToArray
     *
     * @param string $csv Cvs
     *
     * @return array
     */
    public function csvToArray($csv)
    {
        $arr = array();
        $lines = explode("\n", $csv);
        foreach ($lines as $row) {
            $row = str_replace('""', '\\"', $row);
            $arr[] = str_getcsv($row, ',');
        }

        return $arr;
    }
}
