jQuery(document).ready(function ($) {
    $wptm_bottom_toolbar = $('#wptm_bottom_toolbar');
    $wptm_table_list = $('#mybootstrap .wptm_table_list');

    $('#wpfooter').hide();

    if ($('#mybootstrap').hasClass('wptm-tables')) {
        $('body').css({overflow: 'hidden'});

        $wptm_bottom_toolbar.appendTo($wptm_table_list);

        if ($wptm_table_list.find('.dd-item.selected').length < 1) {
            $wptm_bottom_toolbar.find('#inserttable').addClass("no_click");
        }

        $wptm_bottom_toolbar.find('#inserttable').on('hover', function () {
            if (Wptm.table > 0) {
                $wptm_bottom_toolbar.find('#inserttable').removeClass("no_click");
            }
        });

        $wptm_bottom_toolbar.find('.wptm_back_list').hide();
        $wptm_bottom_toolbar.find('#inserttable').on("click", function () {
            inserttable($(this));
        });
    } else if($('#mybootstrap').hasClass('wptm-page')) {
        $wptm_bottom_toolbar.find('#inserttable').on("click", function () {
            inserttable($(this));
        });
        var Scrollbar = window.Scrollbar;
        Scrollbar.initAll({
            damping: 0.5,
            thumbMinSize: 10,
            alwaysShowTracks: true
        });
    } else if($('#mybootstrap').hasClass('wptm-db')) {
        $wptm_bottom_toolbar.find('#inserttable').on("click", function () {
            inserttable($(this));
        });
    }

    /**
     * Insert the current table into a content editor
     */
    function inserttable (that) {
        var id;
        if (that.data('type') === 'chart') {
            if (parseInt(chart_active) > 0) {
                var table_id = typeof Wptm.id !== 'undefined' ? Wptm.id : Wptm.table;
                code = '<img src="' + wptm_dir + '/app/admin/assets/images/t.gif"' +
                    ' data-wptmtable="' + table_id + '"' +
                    ' data-wptm-chart="' + chart_active + '"' +
                    'style="background: url(' + wptm_dir + '/app/admin/assets/images/chart.png) no-repeat scroll center center #D6D6D6;' +
                    'border: 2px dashed #888888;' +
                    'height: 150px;' +
                    'border-radius: 10px;' +
                    'width: 99%;" />';
                window.parent.tinyMCE.execCommand('mceInsertContent', false, code);
            }
        } else {
            var table = $wptm_table_list.find('.dd-item.selected');
            if (table.length < 1 && typeof Wptm !== 'undefined' &&  typeof Wptm.id !== 'undefined') {
                table = {0: Wptm.id};
            }

            if (typeof constructedTableData !== 'undefined' && parseInt(constructedTableData.id_table) > 0) {
                table = {0: constructedTableData.id_table};
            }

            $.each(table, function () {
                if (parseInt(this) > 0) {
                    id = this;
                } else {
                    id = $(this).data('id-table');
                }
                var code = '<img src="' + wptm_dir + '/app/admin/assets/images/t.gif"' +
                    'data-wptmtable="' + id + '"' +
                    'style="background: url(' + wptm_dir + '/app/admin/assets/images/spreadsheet.png) no-repeat scroll center center #D6D6D6;' +
                    'border: 2px dashed #888888;' +
                    'height: 150px;' +
                    'border-radius: 10px;' +
                    'width: 99%;" />';
                window.parent.tinyMCE.execCommand('mceInsertContent', false, code);
            });

        }
        jQuery("#lean_overlay", window.parent.document).fadeOut(300);
        jQuery('#wptmmodal', window.parent.document).fadeOut(300);
        return false;
    }
});