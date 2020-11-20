/**
 * Created by USER on 12/03/2018.
 */
jQuery(document).ready(function($) {
    var $controlFormatStyle = $('#control_format_style');
    var $list_format_style  = $controlFormatStyle.find('#list_format_style');
    var $new_format_style   = $controlFormatStyle.find('#new_format_style');
    var $set_color          = $controlFormatStyle.find('#set_color');
    var $save_format_style  = $controlFormatStyle.find('#save_format_style');
    var active_format_color = '';

    //create new .pane-color-tile
    $new_format_style.find('.create_format_style').on('click', function () {
        var number_format = $list_format_style.find('.pane-color-tile').length;
        var $html = $('<div class="pane-color-tile td_' + number_format + '">' +
            '<div class="pane-color-tile-header pane-color-tile-band" style="background-color:#ffffff" data-value="#ffffff"></div>' +
            '<div class="pane-color-tile-1 pane-color-tile-band" style="background-color:#ffffff" data-value="#ffffff"></div>' +
            '<div class="pane-color-tile-2 pane-color-tile-band" style="background-color:#ffffff" data-value="#ffffff"></div>' +
            '<div class="pane-color-tile-footer pane-color-tile-band" style="background-color:#ffffff" data-value="#ffffff"></div>' +
            '</div>');
        $html.appendTo($list_format_style);

        /*active new .pane-color-tile*/
        set_active_format_style();
        $list_format_style.find('.td_' + number_format).trigger('click');
    });

    //remove .pane-color-tile
    $new_format_style.find('.remove_format_style').on('click', function () {
        if ($new_format_style.find('.hide_set_format_style').hasClass('show')) {
            $new_format_style.find('.hide_set_format_style').trigger('click');
        }
        $controlFormatStyle.find('.pane-color-tile.active').remove();
        save_format_style();
    });

    //click active .pane-color-tile
    var set_active_format_style = function () {
        $controlFormatStyle.find('.pane-color-tile').on('click', function () {
            $(this).siblings('.active').removeClass('active');
            if (!$new_format_style.find('.hide_set_format_style').hasClass('show')) {
                $new_format_style.find('.hide_set_format_style').trigger('click');
            }
            $(this).addClass('active');
            reset_color_picket($(this));
        });
    };

    set_active_format_style();

    //set color picket when select format style
    var reset_color_picket = function (e) {
        active_format_color = '';
        e.find('.pane-color-tile-band').each(function (i) {
            active_format_color += i === 0 ? '' : '|';
            active_format_color += $(this).data('value');
            $set_color.find('.wp-picker-container:eq(' + i + ') input.wp-color-field').val($(this).data('value')).change();
        });
    };

    var get_color_picket = function (e, v, reset) {
        if (reset === '0' || e.hasClass('pane-set-color-header')) {
            $list_format_style.find('.active').find('.pane-color-tile-header').css('background-color', v).data('value', v);
        }
        if (reset === '1' || e.hasClass('pane-set-color-1')) {
            $list_format_style.find('.active').find('.pane-color-tile-1').css('background-color', v).data('value', v);
        }
        if (reset === '2' || e.hasClass('pane-set-color-2')) {
            $list_format_style.find('.active').find('.pane-color-tile-2').css('background-color', v).data('value', v);
        }
        if (reset === '3' || e.hasClass('pane-set-color-footer')) {
            $list_format_style.find('.active').find('.pane-color-tile-footer').css('background-color', v).data('value', v);
        }
    };

    //select color
    $('.wp-color-field').wpColorPicker({
        width: 180,
        change: function(e, i){
            get_color_picket($(this), i.color.toString(), '');
        },
        clear: function (e) {
            get_color_picket($(this).siblings('label').find('input'), '#ffffff', '');
        }
    });

    $('.wp-picker-container').find('button.button span.wp-color-result-text').text('');/*fix wptm-color-picker text in wp version 5.5*/

    /*save the change format style*/
    var save_format_style = function () {
        var dataFormatStyle = '';
        $list_format_style.find('.pane-color-tile').find('.pane-color-tile-band').each(function (i) {
            dataFormatStyle += (i !== 0 ? '|' : '') + $(this).data('value');
        }),
            $('#alternate_color').val(dataFormatStyle);

        active_format_color = '';
    };
    $save_format_style.find('input:eq(0)').on('click', function () {
        $new_format_style.find('.hide_set_format_style').trigger('click');
        var html = '<span style="color: #ff8726; float: right;">' + wptmText.save_alternate + '</span>';
        $controlFormatStyle.find('.label_text').append(html);
        setTimeout(function () {
            $controlFormatStyle.find('.label_text span').remove();
        }, 2000);
        save_format_style();
    });

    /*remove the change format style*/
    var cancel_format_style = function () {
        active_format_color.split('|').map(function (color, number) {
            get_color_picket($controlFormatStyle, color, number.toString());
        }),
            reset_color_picket($list_format_style.find('.active')),
            $controlFormatStyle.find('.pane-color-tile.active').removeClass('active');
    };
    $save_format_style.find('input:eq(1)').on('click', function () {
        if (active_format_color !== '') {
            $new_format_style.find('.hide_set_format_style').trigger('click');
            cancel_format_style();
        }
    });

    $new_format_style.find('.hide_set_format_style').toggle(
        function () {
            $(this).val('Hide').removeClass('show');
            $set_color.hide();
            $save_format_style.hide();
        },
        function() {
            $(this).val('Show').addClass('show');
            $set_color.css('display', 'grid');
            $save_format_style.show();
        }
    );
    $('.hide_set_format_style').trigger('click');

    $('.ju-settings-option.decimal_sym').find('.ju-select').on('change', function () {
        var decimal_sym = $(this).val();

        if ($('.ju-settings-option.thousand_sym').find('.ju-select').val() === decimal_sym) {
            if (decimal_sym === '.') {
                $('.ju-settings-option.thousand_sym').find('.ju-select').val(',').change();
            } else {
                $('.ju-settings-option.thousand_sym').find('.ju-select').val('.').change();
            }
        }
    });

    $('.ju-settings-option.thousand_sym').find('.ju-select').on('change', function () {
        var thousand_sym = $(this).val();

        if ($('.ju-settings-option.decimal_sym').find('.ju-select').val() === thousand_sym) {
            if (thousand_sym === ',') {
                $('.ju-settings-option.decimal_sym').find('.ju-select').val('.').change();
            } else {
                $('.ju-settings-option.decimal_sym').find('.ju-select').val(',').change();
            }
        }
    });

    //separate the main settings
    var $wptm_settings = $('#wptm_settings');
    function show_hiden_option(that) {
        var container_show = that.attr('href');
        $('.ju-right-panel').find('.wptm_show_hiden_option').each(function () {
            var list_option = $(this).data('option').split('|');
            var i;
            if ($(this).is(container_show)) {
                for (i in list_option) {
                    $wptm_settings.find('.' + list_option[i]).show();
                }
            } else {
                for (i in list_option) {
                    $wptm_settings.find('.' + list_option[i]).hide();
                }
            }
        });
    }
    show_hiden_option($wptm_settings.find('.ju-top-tabs').find('a.active'));

    $wptm_settings.find('.ju-top-tabs').find('a.link-tab').click(function (e) {
        show_hiden_option($(this));
    });
    $('.ju-menu-tabs').find('a.link-tab').click(function (e) {
        if ($(this).attr('href') === '#wptm_settings' && !$(this).hasClass('active')) {
            show_hiden_option($($(this).attr('href')).find('.ju-top-tabs a.active'));
        }
    });

    /*resize window*/
    var $main = $('.ju-main-wrapper');
    var $ju_left_panel = $('.ju-main-wrapper > .ju-left-panel');
    function display_left_menu () {
        if (parseInt($( window ).width()) < 960 && $main.find('.wptm_show_cat').length < 1) {
            $wptm_show_cat = $('<div class="wptm_show_cat"><i class="dashicons dashicons-leftright"></i></div>').prependTo($main);
            $ju_left_panel.width(0).show();
            $wptm_show_cat.toggle(
                function () {
                    $(this).val('Hide').addClass('show').animate({left: '280px'}, "slow");
                    $ju_left_panel.show().animate({width: '300px', opacity: '1'}, "slow");
                },
                function () {
                    $(this).val('Show').removeClass('show').animate({left: '-25px'}, "slow");
                    $ju_left_panel.animate({
                        width: '0px',
                        opacity: '0'
                    }, "slow").delay(10).animate({'opacity': '1'}, 10);
                }
            );
        } else if (parseInt($( window ).width()) > 960 && $main.find('.wptm_show_cat').length > 0) {
            $main.find('.wptm_show_cat').remove();
            $ju_left_panel.width(300).show();
        }
    }
    display_left_menu();
    $( window ).resize(function() {
        display_left_menu();
    });
});
