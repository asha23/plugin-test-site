<?php
/**
 * WP Table Manager
 *
 * @package WP Table Manager
 * @author  Joomunited
 * @version 1.0
 */

use Joomunited\WPFramework\v1_0_5\Application;
use Joomunited\WPFramework\v1_0_5\Factory;

$icon = array(
    'ok'    => '<div class="controls"><i class="material-icons system-checkbox material-icons-success">check_circle</i></div>',
    'alert' => '<div class="controls"><i class="material-icons system-checkbox material-icons-alert">info</i></div>',
    'info'  => '<div class="controls"><img class="system-checkbox material-icons-info bell" src="' . plugins_url('../../assets/images/icon-notification.png', __DIR__) . '" /></div>'
);

$extension_array = array(
    array(
        'id'      => 'curl',
        'title'   => 'Php_Curl',
        'tooltip' => __('PHP extension Curl is NOT detected. The cache preloading feature will not work (preload a page cache automatically after a cache purge)', 'wptm')
    ),
    array(
        'id'      => 'zlib',
        'title'   => 'ext-zlib',
        'tooltip' => __('PHP extension ext-zlib is NOT detected. The function to sync with google sheet, or import, export excel file will not work', 'wptm')
    ),
    array(
        'id'      => 'xml',
        'title'   => 'ext-xml',
        'tooltip' => __('PHP extension ext-xml is NOT detected. The function to sync with google sheet, or import, export excel file will not work', 'wptm')
    ),
    array(
        'id'      => 'zip',
        'title'   => 'ext-zip',
        'tooltip' => __('PHP extension ext-zip is NOT detected. The function to sync with google sheet, or import, export excel file will not work', 'wptm')
    ),
    array(
        'id'      => 'mbstring',
        'title'   => 'ext-mbstring',
        'tooltip' => __('PHP extension ext-mbstring is NOT detected. The function to sync with google sheet, or import, export excel file will not work', 'wptm')
    )
);

/**
 * Parse module info.
 * Based on https://gist.github.com/sbmzhcn/6255314
 *
 * @return array
 */
function parsePhpinfo()
{
    ob_start();
    //phpcs:ignore WordPress.PHP.DevelopmentFunctions.prevent_path_disclosure_phpinfo -- Get info modules of phpinfo
    phpinfo(INFO_MODULES);
    $s = ob_get_contents();
    ob_end_clean();
    $s     = strip_tags($s, '<h2><th><td>');
    $s     = preg_replace('/<th[^>]*>([^<]+)<\/th>/', '<info>\1</info>', $s);
    $s     = preg_replace('/<td[^>]*>([^<]+)<\/td>/', '<info>\1</info>', $s);
    $t     = preg_split('/(<h2[^>]*>[^<]+<\/h2>)/', $s, - 1, PREG_SPLIT_DELIM_CAPTURE);
    $r     = array();
    $count = count($t);
    $p1    = '<info>([^<]+)<\/info>';
    $p2    = '/' . $p1 . '\s*' . $p1 . '\s*' . $p1 . '/';
    $p3    = '/' . $p1 . '\s*' . $p1 . '/';
    for ($i = 1; $i < $count; $i ++) {
        if (preg_match('/<h2[^>]*>([^<]+)<\/h2>/', $t[$i], $matchs)) {
            $name = trim($matchs[1]);
            $vals = explode("\n", $t[$i + 1]);
            foreach ($vals as $val) {
                if (preg_match($p2, $val, $matchs)) { // 3cols
                    $r[$name][trim($matchs[1])] = array(trim($matchs[2]), trim($matchs[3]));
                } elseif (preg_match($p3, $val, $matchs)) { // 2cols
                    $r[$name][trim($matchs[1])] = trim($matchs[2]);
                }
            }
        }
    }

    return $r;
}

$phpInfo = parsePhpinfo();
?>
<div class="wrap wptm-config">
    <div class="ju-main-wrapper">
        <div class="ju-left-panel">
            <div class="ju-logo">
                <a href="http://linktoyourwebsite.com" target="_blank" title="Visit my site">
                    <img src="<?php echo esc_url_raw(plugins_url('../../assets/cssJU/images/logo-joomUnited-white.png', __DIR__)); ?>"
                         alt="Your Logo"/>
                </a>
            </div>
            <div class="ju-menu-search">
                <i class="mi mi-search ju-menu-search-icon"></i>
                <input type="text" class="ju-menu-search-input"
                       placeholder="<?php ucfirst(esc_attr_e('Search settings', 'wptm')); ?>"/>
            </div>
            <ul class="tabs ju-menu-tabs">
                <li class="tab">
                    <a href="#wptm_settings" class="link-tab waves-effect waves-light">
                        <i class="material-icons">home</i>
                        <?php ucfirst(esc_attr_e('Main settings', 'wptm')); ?></a></li>
                <li class="tab">
                    <a href="#wptm-user-roles" class="link-tab waves-effect waves-light user-roles">
                        <img src="<?php echo esc_url_raw(plugins_url('../../assets/images/icon-user-roles.svg', __DIR__)); ?>" class="mCS_img_loaded"><?php ucfirst(esc_attr_e('User roles', 'wptm')); ?></a></li>
                <li class="tab">
                    <a href="#wptm_translation" class="link-tab waves-effect waves-light">
                        <i class="material-icons">text_format</i>
                        <?php ucfirst(esc_attr_e('Translation', 'wptm')); ?></a></li>
                <li class="tab">
                    <a href="#wptm_check" class="link-tab waves-effect waves-light">
                        <i class="material-icons">check_circle_outline</i>
                        <?php ucfirst(esc_attr_e('System check', 'wptm')); ?></a></li>
            </ul>
        </div>

        <div class="ju-right-panel">
            <div class="ju-content-wrapper" id="wptm_settings">
                <div class="ju-top-tabs-wrapper">
                    <ul class="tabs ju-top-tabs">
                        <li class="tab active">
                            <a href="#wptm_main_settings"
                               class="link-tab"><?php esc_attr_e('Main settings', 'wptm'); ?></a>
                        </li>
                        <li class="tab">
                            <a href="#wptm_format" class="link-tab"><?php esc_attr_e('Format', 'wptm'); ?></a>
                        </li>
                    </ul>
                </div>
                <div class="ju-notice-msg ju-notice-success">
                    <p></p>
                    <i class="dashicons dashicons-dismiss ju-notice-close"></i>
                </div>
                <div class="ju-notice-msg ju-notice-error">
                    <p></p>
                    <i class="dashicons dashicons-dismiss ju-notice-close"></i>
                </div>
                <div id="wptm_main_settings" class="tab-pane wptm_show_hiden_option"
                     data-option="enable_import_excel|export_excel_format|alternate_color|hightlight|enable_autosave|open_table|sync_periodicity|enable_frontend|uninstall_delete_files">
                    <h2><?php ucfirst(esc_attr_e('Main settings', 'wptm')); ?></h2>
                </div>
                <div id="wptm_format" class="tab-pane wptm_show_hiden_option"
                     data-option="date_formats|symbol_position|decimal_sym|decimal_count|thousand_sym|currency_sym">
                    <h2><?php ucfirst(esc_attr_e('Format settings', 'wptm')); ?></h2>
                </div>
                <?php
                //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- print output from render() of framework
                echo $this->configform;
                ?>
            </div>

            <div class="ju-content-wrapper" id="wptm_translation">
                <h2><?php ucfirst(esc_attr_e('Translation', 'wptm')); ?></h2>
                <div id="wptm-jutranslation-config" class="ju-settings-option full-width">
                    <?php
                    //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- print output from render() of framework
                    echo \Joomunited\WPTableManager\Jutranslation\Jutranslation::getInput();
                    ?>
                </div>
            </div>

            <div class="ju-content-wrapper" id="wptm-user-roles">
                <h2><?php ucfirst(esc_attr_e('User Roles', 'wptm')); ?></h2>

                <div class="ju-content-wrapper full-width">
                    <?php
                    require_once dirname(WPTM_PLUGIN_FILE) . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'admin/views/config/tpl/default_role.php';
                    ?>
                </div>
            </div>


            <div class="ju-content-wrapper" id="wptm_check">
                <h2><?php ucfirst(esc_attr_e('System Check Settings', 'wptm')); ?></h2>
                <div class="text-intro">
                    <blockquote>
                        <?php esc_html_e('We have checked your server environment. 
    If you see some warning below it means that some plugin features may not work properly.
    Reload the page to refresh the results', 'wptm') ?>
                    </blockquote>
                </div>
                <div class="php_version">
                    <h3><?php ucfirst(esc_attr_e('PHP Version', 'wptm')); ?></h3>
                    <div class="ju-settings-option full-width">
                        <label class="ju-setting-label system-check-label">
                            <?php esc_html_e('PHP ', 'wptm'); ?>
                            <?php echo esc_html(PHP_VERSION) ?>
                            <?php esc_html_e('version', 'wptm'); ?>
                        </label>
                        <?php
                        if (version_compare(PHP_VERSION, '5.6.0', '>=')) {
                            //phpcs:ignore WordPress.Security.EscapeOutput -- Echo icon html
                            echo $icon['ok'];
                        } else {
                            //phpcs:ignore WordPress.Security.EscapeOutput -- Echo icon html
                            echo $icon['alert'];
                        }
                        ?>
                    </div>
                    <?php if (version_compare(PHP_VERSION, '5.6.0', '<')) : ?>
                        <p>
                            <?php esc_html_e('Your PHP version is ', 'wptm') ?>
                            <?php echo esc_html(PHP_VERSION) ?>
                            <?php esc_html_e('. to use the function to sync with google sheet, or import, export excel file, to use the function to sync with google sheet, or import, export excel file.
                             Please upgrade to php version 5.6+', 'wptm'); ?>
                        </p>
                    <?php else : ?>
                        <p style="height: auto">
                            <?php esc_html_e('Great ! Your PHP version is ', 'wptm'); ?>
                            <?php echo esc_html(PHP_VERSION) ?>
                            <?php if (version_compare(PHP_VERSION, '7.3.0', '<')) : ?>
                                <?php esc_html_e(', upgrade to PHP 7.3+ version to get an even better performance', 'wptm') ?>
                            <?php endif; ?>
                        </p>
                    <?php endif; ?>
                </div>
                <?php
                $i = 0;
                foreach ($extension_array as $v) :
                    ?>
                    <div class="<?php echo esc_attr(ucfirst($v['id'])); ?>">
                        <?php if ($i === 0) : ?>
                            <h3><?php ucfirst(esc_attr_e('Other Check', 'wptm'));
                                $i = 1; ?></h3>
                        <?php endif; ?>
                        <div class="ju-settings-option full-width">
                            <label for="<?php echo esc_attr($v['id']) ?>" class="ju-setting-label system-check-label">
                                <?php echo esc_attr(ucfirst($v['title'])); ?>
                            </label>
                            <?php
                            $checkother = false;
                            if (function_exists('get_loaded_extensions')) {
                                $phpModules = get_loaded_extensions();
                                if (in_array($v['id'], $phpModules)) {
                                    $checkother = true;
                                }
                            } else {
                                if (isset($phpInfo[$v['id']])) {
                                    $checkother = true;
                                }
                            }
                            if ($v['id'] === 'curl') {
                                //phpcs:ignore WordPress.Security.EscapeOutput -- Echo icon html
                                echo ($checkother) ? $icon['ok'] : $icon['alert'];
                            } else {
                                //phpcs:ignore WordPress.Security.EscapeOutput -- Echo icon html
                                echo ($checkother) ? $icon['ok'] : $icon['info'];
                            }
                            ?>
                        </div>
                        <?php if (!$checkother) : ?>
                            <p><?php echo esc_html($v['tooltip']); ?></p>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>
<?php wp_nonce_field('option_nonce', 'option_nonce'); ?>
<script type="text/javascript">
    ajaxurl = "<?php echo esc_url_raw(Application::getInstance('Wptm')->getAjaxUrl()); ?>";
    jQuery(document).ready(function ($) {
        $('[data-toggle="tooltip"]').tooltip();

        var wptm_ajaxurl = "<?php echo esc_url_raw(Factory::getApplication('wptm')->getAjaxUrl()); ?>";
        var $wptm_main_config = $('#wptm_settings');

        $wptm_main_config.find('.date_formats').closest('.control-group').css('margin-top', '25px');

        if ($("input[name=dropboxKey]").val() != '' && $("input[name=dropboxSecret]").val() != '') {
            $('#dropboxAuthor + .help-block').html('');
        } else {
            $("#dropboxAuthor").attr('type', 'hidden');
        }

        $('#wptm_settings form.wptmparams').submit(function (event) {
            event.preventDefault();
            var url = wptm_ajaxurl + "task=config.saveconfig";
            var jsonVar = {};
            $('#wptm_settings').find('.ju-settings-option .wptm_input').each(function (i, e) {
                if ($(this).hasClass('switch-button')) {
                    jsonVar[$(this).attr('name')] = $(this).is(":checked") ? 1 : 0;
                } else {
                    jsonVar[$(this).attr('name')] = $(this).val();
                }
            });
            jsonVar['joomunited_nonce_field'] = $('#joomunited_nonce_field').val();
            jsonVar['option_nonce'] = $('#option_nonce').val();

            $.ajax({
                url: url,
                dataType: "json",
                type: "POST",
                data: jsonVar,
                success: function (datas) {
                    if (datas.response === true) {
                        $('.ju-right-panel .ju-notice-success p').html('<?php esc_html_e('Setting have been saved!', 'wptm'); ?>');
                        $('.ju-right-panel .ju-notice-success').show().fadeIn(200);
                    } else {
                        $('.ju-right-panel .ju-notice-error p').html(datas.response);
                        $('.ju-right-panel .ju-notice-error').show().fadeIn(200);
                    }

                    $('.ju-right-panel .ju-notice-close').click(function () {
                        $(this).closest('.ju-notice-msg').fadeOut(500).hide();
                    });
                },
                error: function (jqxhr, textStatus, error) {
                    bootbox.alert(textStatus + " : " + error);
                },
            });
        });
    });
</script>
