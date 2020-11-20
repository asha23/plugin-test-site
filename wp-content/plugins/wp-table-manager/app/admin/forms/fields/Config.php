<?php
/**
 * WP Table Manager
 *
 * @package WP Table Manager
 * @author  Joomunited
 * @version 1.0
 */

namespace Joomunited\WP_Table_Manager\Admin\Fields;

use Joomunited\WPFramework\v1_0_5\Field;
use Joomunited\WPFramework\v1_0_5\Factory;

defined('ABSPATH') || die();

/**
 * Class Category
 */
class Config extends Field
{
    /**
     * Display all categories
     *
     * @param array $field Data field
     * @param array $datas Full datas
     *
     * @return string
     */
    public function getfield($field, $datas)
    {
        $attributes = $field['@attributes'];
        $html       = '';
        $tooltip    = isset($attributes['tooltip']) ? $attributes['tooltip'] : '';
        $html       .= '<div class="ju-settings-option ' . $attributes['name'] . '">';
        if (!empty($attributes['label']) && (string) $attributes['label'] !== '' &&
            !empty($attributes['name']) && (string) $attributes['name'] !== ''
        ) {
            $label = (string) $attributes['label'];
            $html .= '<label class="ju-setting-label" for="' . $attributes['name'] . '"';
            if (isset($attributes['tooltip'])) {
                $html .= '><span data-toggle="tooltip" data-placement="top" title="' . esc_attr($attributes['tooltip'], 'wptm') . '"';
                $html .= '>' . esc_attr($label, 'wptm') . '</span></label>';
            } else {
                $html .= '>' . esc_attr($label, 'wptm') . '</label>';
            }
        }
        $html .= '<div class="controls ' . $attributes['name'] . '">';
        if ($attributes['name'] === 'alternate_color') {
            $html .= $this->renderContentAlternate($attributes);
        } elseif ($attributes['name'] === 'hightlight') {
            $html .= $this->renderContentHightlight($field, $datas);
        }
        if (!empty($attributes['help']) && (string) $attributes['help'] !== '') {
            $html .= '<p class="help-block">' . $attributes['help'] . '</p>';
        }
        $html .= '</div></div>';
        return $html;
    }
    /**
     * Render content
     *
     * @param array $fields Data field
     * @param array $datas  Full datas
     *
     * @return string
     */
    public function renderContentHightlight($fields, $datas)
    {
        $html = '';
        $cleanfield = $fields;
        unset($cleanfield['@attributes']);
        if (!empty($cleanfield[0])) {
            foreach ($cleanfield[0] as $child) {
                $field = array_keys($child);
                if (!empty($child[${'field'}[0]]['@attributes']['namespace'])) {
                    if (!empty($child[${'field'}[0]]['@attributes']['type'])) {
                        $class = ucfirst($child[${'field'}[0]]['@attributes']['type']);
                    } else {
                        $class = ucfirst($field[0]);
                    }

                    if (!empty($child[${'field'}[0]]['@attributes']['name'])) {
                        if (isset($datas) && !empty($datas[$child[${'field'}[0]]['@attributes']['name']])) {
                            $child[${'field'}[0]]['@attributes']['value'] = $datas[$child[${'field'}[0]]['@attributes']['name']];
                        }
                        if (!empty($child[${'field'}[0]]['@attributes']['namespace'])) {
                            $class = $child[${'field'}[0]]['@attributes']['namespace'] . $class;
                        } else {
                            $class = '\Joomunited\WPFramework\v1_0_5\Fields\\' . $class;
                        }
                        if (class_exists($class, true)) {
                            $c = new $class;
                            $html .=  $c->getfield($child[$field[0]], isset($this->datas)?$this->datas:null);
                        }
                    }
                }
            }
        }
        return $html;
    }

    /**
     * Render content
     *
     * @param array $att Data format color
     *
     * @return string
     */
    public function renderContentAlternate($att)
    {
        $default = '#bdbdbd|#ffffff|#f3f3f3|#ffffff';
        $default .= '|#4dd0e1|#ffffff|#e0f7fa|#a2e8f1';
        $default .= '|#63d297|#ffffff|#e7f9ef|#afe9ca';
        $default .= '|#f7cb4d|#ffffff|#fef8e3|#fce8b2';
        $default .= '|#f46524|#ffffff|#ffe6dd|#ffccbc';
        $default .= '|#5b95f9|#ffffff|#e8f0fe|#acc9fe';
        $default .= '|#26a69a|#ffffff|#ddf2f0|#8cd3cd';
        $default .= '|#78909c|#ffffff|#ebeff1|#bbc8ce';

        $values  = isset($att['value']) && (string) $att['value'] !== '' ? $att['value'] : $default;

        $html    = '';
        $html    .= '<div id="control_format_style">';
        $html    .= '<div class="label_text">' . __('Automatic styling', 'wptm') . ':</div>';
        $html    .= '<div class="control_value" style="display: none">';
        $html    .= '<input name = "' . $att['name'] . '" id = "' . $att['name'] . '" class="' . $att['class'] . '" value="' . $values . '">';
        $html    .= '</div>';
        $html    .= '<div id="list_format_style">';
        $arrayValue  = explode('|', $values);
        $count   = count($arrayValue);
        for ($i = 0; $i < $count / 4; $i ++) {
            $i16   = $i * 4;
            $value = array($arrayValue[$i16], $arrayValue[$i16 + 1], $arrayValue[$i16 + 2], $arrayValue[$i16 + 3]);
            $html .= $this->renderListStyle($value, $i);
        }
        $html .= '</div>';
        $html .= '<div id="new_format_style">';
        $html .= '<input type="button" class="active create_format_style" value="New">';
        $html .= '<input type="button" class="wptm_no_active remove_format_style" value="Remove">';
        $html .= '<span class="hide_set_format_style show">' . __('Show detail color', 'wptm') . '
                <i class="material-icons">keyboard_arrow_down</i>
                <i class="material-icons">keyboard_arrow_up</i></span>';
        $html .= '</div>';
        $value = array('#ffffff', '#ffffff', '#ffffff', '#ffffff');
        $html .= $this->renderListStyle($value, 'create');
        $html .= '<div id="save_format_style">';
        $html .= '<input class="ju-button orange-button" type="button" value="' . __('Done', 'wptm') . '">';
        $html .= '<input class="ju-button wptm_no_active" type="button" value="' . __('Cancel', 'wptm') . '">';
        $html .= '</div>';
        $html .= '</div>';
        return $html;
    }

    /**
     * Render list style color
     *
     * @param array   $value Style value
     * @param integer $order Order number
     *
     * @return string
     */
    public function renderListStyle($value, $order)
    {
        $html = '';
        if ($order !== 'create') {
            $html .= '<div class="pane-color-tile td_' . $order . '">';
            $html .= '<div class="pane-color-tile-header pane-color-tile-band" data-value="' . $value[0] . '" style="background-color:' . $value[0] . ';"></div>';
            $html .= '<div class="pane-color-tile-1 pane-color-tile-band" data-value="' . $value[1] . '" style="background-color:' . $value[1] . ';"></div>';
            $html .= '<div class="pane-color-tile-2 pane-color-tile-band" data-value="' . $value[2] . '" style="background-color:' . $value[2] . ';"></div>';
            $html .= '<div class="pane-color-tile-footer pane-color-tile-band" data-value="' . $value[3] . '" style="background-color:' . $value[3] . ';"></div>';
            $html .= '</div>';
        } else {
            $html .= '<div id="set_color" class="input-pane-set-color">';
            $html .= '<div class="control_value">';
            $html .= '<span>' . __('Header color', 'wptm') . '</span>';
            $html .= '<input title="" value="#ffffff" class="pane-set-color-header inputbox input-block-level wp-color-field" type="text">';
            $html .= '</div>';
            $html .= '<div class="control_value">';
            $html .= '<span>' . __('Alternate color 1', 'wptm') . '</span>';
            $html .= '<input title="" value="#ffffff" class="pane-set-color-1 inputbox input-block-level wp-color-field" type="text">';
            $html .= '</div>';
            $html .= '<div class="control_value">';
            $html .= '<span>' . __('Alternate color 2', 'wptm') . '</span>';
            $html .= '<input title="" value="#ffffff" class="pane-set-color-2 inputbox input-block-level wp-color-field" type="text">';
            $html .= '</div>';
            $html .= '<div class="control_value">';
            $html .= '<span>' . __('Footer color', 'wptm') . '</span>';
            $html .= '<input title="" value="#ffffff" class="pane-set-color-footer inputbox input-block-level wp-color-field" type="text">';
            $html .= '</div>';
            $html .= '</div>';
        }
        return $html;
    }
}
