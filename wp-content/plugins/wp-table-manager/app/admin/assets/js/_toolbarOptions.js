import wptmPreview from "./_wptm";
import tableFunction from "./_functions";
import change_theme from "./_changeTheme";
import alternating from "./_alternating";
import DropChart from "./_chart";

//Control functions when select table items
const selectOption = function () {
    var wptm_element = window.wptm_element;
    var popupOption = {};
    var render = false;
    var autoRender;
    var check_saving;
    var new_col_types = [];
    var changed_cols = [];

    if (!(window.Wptm.can.edit || (window.Wptm.can.editown && data.author === window.Wptm.author))) {
        return false;
    }

    if (Wptm.max_Col * Wptm.max_row < 1) {
        return false;
    }

    custom_select_box.call(window.jquery('#setting-cells .wptm_select_box_before'), window.jquery);

    wptm_element.primary_toolbars.find('.table_option:not(.menu_loading)').unbind('change click').on('change click', function (e) {
        var function_data = window.table_function_data;
        var Wptm = window.Wptm;
        var $ = window.jquery;

        var popup = $.extend({}, {});
        var html = '';
        //for undo
        // var oldStyle = JSON.parse(JSON.stringify(Wptm.style));
        //for mergecells
        // var ht = Wptm.container.handsontable('getInstance');

        /*click cell*/
        switch ($(this).attr('name')) {
            case 'rename_menu':
                tableFunction.setText.call(
                    $(this),
                    wptm_element.primary_toolbars.find('.wptm_name_edit'),
                    '#primary_toolbars .wptm_name_edit',
                    {'url': wptm_ajaxurl + "task=table.setTitle&id=" + Wptm.id + '&title=', 'selected': true}
                );
                break;
            case 'save_menu':
                tableFunction.saveChanges(true);
                break;
            case 'export_menu':
                // if (Wptm.type == 'mysql') {
                //     return false;
                // }
                html = '';
                html += '<div>';
                html += '<div  class="popup_top border_top">';
                html += '<span>' + wptmText.import_export_style + ' :</span>';
                html += '</div>';
                html += '<span class="popup_select style_export wptm_select_box_before" data-value="1">' + wptmText.import_export_data_styles + '</span>';
                html += '<ul class="wptm_select_box">';
                html += '<li data-value="1">' + wptmText.import_export_data_styles + '</li>';
                html += '<li data-value="0">' + wptmText.import_export_data_only + '</li>';
                html += '</ul>';
                html += '<div><input type="button" class="wptm_button wptm_done" value="Export excel" id="export_excel"></div>';
                html += '</div>';
                popup = {
                    'html': $(html),
                    'selector': {'export_excel': '.style_export'},
                    'showAction': function () {
                        custom_select_box.call(this.find('.style_export'), $);
                    },
                    'option': {'export_excel': 1},
                };
                wptm_popup(wptm_element.wptm_popup, popup, false);

                //Export-excel
                $('#export_excel').bind('click', function (e) {
                    var format = default_value.export_excel_format;
                    var url = wptm_ajaxurl + 'task=excel.export&id=' + idTable + '&format_excel=' + format;

                    url = url + '&onlydata=' + popup.option['export_excel'];

                    $.fileDownload(url, {
                        failCallback: function (html, url) {
                            bootbox.alert(html, wptmText.Ok);
                        }
                    });
                });
                break;
            case 'source_menu':
                var curr_page = window.location.href;
                var cells = curr_page.split("?");
                var new_url;
                if (canInsert) {
                    new_url = cells[0] + '?page=wptm&type=dbtable&id_table=' + idTable + '&noheader=1&caninsert=1';
                } else {
                    new_url = cells[0] + '?page=wptm&type=dbtable&id_table=' + idTable;
                }
                window.location = new_url;
                break;
            case 'select_theme_menu':
                if (Wptm.type == 'mysql') {
                    return false;
                }
                popup = {
                    'html': wptm_element.content_popup_hide.find('#table_styles')
                };

                wptm_popup(wptm_element.wptm_popup, popup, true);

                wptm_element.wptm_popup.find('#table_styles a').click(function () {
                    e.preventDefault();
                    var cellsData = Wptm.container.handsontable('getData');
                    var ret = true;
                    var nbCols = 0;
                    var id = $(this).data('id');

                    //check table data exist
                    $.each(cellsData, function (index, value) {
                        nbCols = value.length;
                        $.each(value, function (i, v) {
                            if (v && v.toString().trim() !== '') {
                                ret = false;
                                return false;
                            }
                        });
                    });

                    change_theme(ret, id, cellsData);
                })
                break;
            case 'alternate_menu':
                popup = {
                    'html': wptm_element.content_popup_hide.find('#alternating_color'),
                    'showAction': function () {
                        var selection, reSelection, valueRange;
                        valueRange = ''
                        if (Wptm.type === 'mysql') {
                            Wptm.container.handsontable("selectAll");
                            selection = $.extend([], function_data.selection[0]);
                        } else {
                            if (typeof function_data.selection === 'undefined' || function_data.selection === undefined || function_data.selection === false) { //if unselected cells
                                var i;
                                if (_.size(function_data.oldAlternate) < 1 || typeof Wptm.style.table.alternateColorValue === 'undefined') {
                                    selection = [0, 0, _.size(Wptm.style.cols) - 1, _.size(Wptm.style.rows) - 1];
                                    valueRange = 'a1:';
                                    //remove undefined cols in array
                                    var cols = [];
                                    for (i = 0; i < _.size(Wptm.style.cols); i++) {
                                        if (typeof Wptm.style.cols[i] !== 'undefined' && Wptm.style.cols[i] !== undefined && Wptm.style.cols[i] !== null) {
                                            cols[i] = Wptm.style.cols[i];
                                        }
                                    }
                                    Wptm.style.cols = cols;

                                    valueRange += String.fromCharCode(97 + _.size(Wptm.style.cols) - 1);
                                    valueRange += _.size(Wptm.style.rows);
                                }
                            } else {
                                selection = $.extend([], function_data.selection[0]);
                                // check if selecting more than 3 rows then process
                                var selection_rows = selection[2] - selection[0];
                                if (selection_rows >= 2) {
                                    if (_.size(function_data.oldAlternate) >= 1 || typeof Wptm.style.table.alternateColorValue !== 'undefined') {
                                        for (var i = 0; i < _.size(function_data.oldAlternate); i++) {
                                            var oldAlternateData = function_data.oldAlternate[i];
                                            var isSameSelection = tableFunction.isSameArray(selection, oldAlternateData.selection);
                                            if (isSameSelection) {
                                                var colorData = oldAlternateData.default.split('|');
                                                var dftAlternateHeader = colorData[0];
                                                var dftAlternateTile1 = colorData[1];
                                                var dftAlternateTile2 = colorData[2];
                                                var dftAlternateFooter = colorData[3];
                                                var currTile = this.find('.pane-color-tile[data-tile-header="' + dftAlternateHeader + '"][data-tile-1="' + dftAlternateTile1 + '"][data-tile-2="' + dftAlternateTile2 + '"][data-tile-footer="' + dftAlternateFooter + '"]');
                                                currTile.addClass('active');
                                                if (oldAlternateData.header !== '') {
                                                    this.find('.banding-header-checkbox').trigger('click');
                                                }
                                                if (oldAlternateData.footer !== '') {
                                                    this.find('.banding-footer-checkbox').trigger('click');
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (function_data.selectionSize > 0) {
                            selection = $.extend([], function_data.selection[0]);
                            for (i = 0; i < function_data.selectionSize; i++) {
                                if (function_data.selection[i][0] < selection[0]) {
                                    selection[0] = function_data.selection[i][0];
                                }
                                if (function_data.selection[i][1] < selection[1]) {
                                    selection[1] = function_data.selection[i][1];
                                }
                                if (function_data.selection[i][2] > selection[2]) {
                                    selection[2] = function_data.selection[i][2];
                                }
                                if (function_data.selection[i][3] > selection[3]) {
                                    selection[3] = function_data.selection[i][3];
                                }
                            }
                            valueRange += String.fromCharCode(97 + selection[1]) + (selection[0] + 1)
                                + ':' + String.fromCharCode(97 + selection[3]) + (selection[2] + 1);
                        }

                        if (valueRange !== '') {
                            this.find('.cellRangeLabelAlternate').val(valueRange);
                            this.find('#get_select_cells').trigger('click');
                        }

                        this.find('.formatting_style .pane-color-tile').on('click', (e) => {
                            var that = $(e.currentTarget);
                            //check exist selector and
                            selection = $.extend([], function_data.selection[0]);

                            if (typeof selection[1] !== 'undefined' && Math.abs(selection[0] - selection[2]) > 1) {
                                if (Wptm.type === 'mysql') { //alternate for all cell
                                    function_data.allAlternate = {};
                                    function_data.allAlternate.even = that.data('tile-1');
                                    function_data.allAlternate.old = that.data('tile-2');
                                    function_data.allAlternate.header = that.data('tile-header');
                                    function_data.allAlternate.footer = that.data('tile-footer');
                                    function_data.allAlternate.default = '' + function_data.allAlternate.header + '|' + function_data.allAlternate.even + '|' + function_data.allAlternate.old + '|' + function_data.allAlternate.footer;

                                    if (this.find('.banding-header-checkbox:checked').length < 1) {
                                        function_data.allAlternate.header = '';
                                    }

                                    if (this.find('.banding-footer-checkbox:checked').length < 1) {
                                        function_data.allAlternate.footer = '';
                                    }
                                    alternating.renderCell();
                                } else {
                                    var count = alternating.setNumberAlternate(selection, function_data.oldAlternate);

                                    /*create/reset oldAlternate[count]*/
                                    function_data.oldAlternate[count] = {};
                                    function_data.oldAlternate[count].selection = selection;
                                    function_data.oldAlternate[count].even = that.data('tile-1');
                                    function_data.oldAlternate[count].old = that.data('tile-2');
                                    function_data.oldAlternate[count].header = that.data('tile-header');
                                    function_data.oldAlternate[count].footer = that.data('tile-footer');

                                    function_data.oldAlternate[count].default = '' + function_data.oldAlternate[count].header + '|' + function_data.oldAlternate[count].even + '|' + function_data.oldAlternate[count].old + '|' + function_data.oldAlternate[count].footer;

                                    if (this.find('.banding-header-checkbox:checked').length < 1) {
                                        function_data.oldAlternate[count].header = '';
                                    }

                                    if (this.find('.banding-footer-checkbox:checked').length < 1) {
                                        function_data.oldAlternate[count].footer = '';
                                    }
                                    alternating.selectAlternatingColor(function_data.oldAlternate, selection, count),
                                        alternating.renderCell();
                                }

                                this.find('.pane-color-tile.active').removeClass('active');
                                that.addClass('active');
                            }
                            return false;
                        });

                        this.find('.banding-header-footer-checkbox-wrapper input').on('click', (e) => {
                            selection = $.extend([], function_data.selection[0]);
                            if (typeof selection[1] !== 'undefined' && Math.abs(selection[0] - selection[2]) > 1) {
                                if (Wptm.type === 'mysql') { //alternate for all cell
                                    if (typeof function_data.allAlternate.default !== 'undefined') {
                                        var defaultStyle = function_data.allAlternate.default.split("|");

                                        if (this.find('.banding-header-checkbox:checked').length > 0) {
                                            function_data.allAlternate.header = defaultStyle[0];
                                        } else {
                                            function_data.allAlternate.header = '';
                                        }

                                        if (this.find('.banding-footer-checkbox:checked').length > 0) {
                                            function_data.allAlternate.footer = defaultStyle[3];
                                        } else {
                                            function_data.allAlternate.footer = '';
                                        }
                                        alternating.renderCell();
                                    }
                                } else {
                                    var oldCount = _.size(function_data.oldAlternate);
                                    var count = alternating.setNumberAlternate(selection, function_data.oldAlternate);
                                    if (oldCount !== count) {
                                        var defaultStyle = [];
                                        if (typeof function_data.oldAlternate[count].default !== 'undefined') {
                                            defaultStyle = function_data.oldAlternate[count].default.split("|");
                                        } else {
                                            if (this.find('.pane-color-tile.active').length > 0) {
                                                defaultStyle[0] = this.find('.pane-color-tile.active').find('.pane-color-tile-header').data('value');
                                                defaultStyle[3] = this.find('.pane-color-tile.active').find('.pane-color-tile-footer').data('value');
                                            } else {
                                                defaultStyle[0] = function_data.oldAlternate[count].header;
                                                defaultStyle[3] = function_data.oldAlternate[count].footer;
                                            }
                                        }
                                        if (this.find('.banding-header-checkbox:checked').length > 0) {
                                            function_data.oldAlternate[count].header = defaultStyle[0];
                                        } else {
                                            function_data.oldAlternate[count].header = '';
                                        }

                                        if (this.find('.banding-footer-checkbox:checked').length > 0) {
                                            function_data.oldAlternate[count].footer = defaultStyle[3];
                                        } else {
                                            function_data.oldAlternate[count].footer = '';
                                        }

                                        function_data.oldAlternate[count].default = '' + defaultStyle[0] + '|' + function_data.oldAlternate[count].even + '|' + function_data.oldAlternate[count].old + '|' + defaultStyle[3];

                                        alternating.selectAlternatingColor(function_data.oldAlternate, selection, count),
                                            alternating.renderCell();
                                    }
                                }
                            }
                            return true;
                        });

                        this.find('#alternate_color_done').click((e) => {
                            e.preventDefault();
                            alternating.applyAlternate.call(this);
                        });
                        return true;
                    },
                    'cancelAction': function () {
                        if (_.size(function_data.checkChangeAlternate) > 0) {
                            if (Wptm.type === 'mysql') { //alternate for all cell
                                function_data.allAlternate = {};
                            } else {
                                Wptm.style.cells = $.extend({}, alternating.reAlternateColor());
                                function_data.oldAlternate = $.extend({}, Wptm.style.table.alternateColorValue);
                            }

                            alternating.renderCell();
                        }
                        return true;
                    }
                };
                if (Wptm.type === 'mysql') {
                    wptm_popup(wptm_element.wptm_popup, popup, true, false);
                } else {
                    wptm_popup(wptm_element.wptm_popup, popup, true, true);
                }
                break;
            case 'resize_column':
                popup = {
                    'html': wptm_element.content_popup_hide.find('#column_size_menu'),
                    'inputEnter': true,
                    'showAction': function () {
                        var selection = function_data.selection;
                        var change_selected = false;
                        for (var i = 0; i < selection.length; i++) {
                            if (Wptm.newSelect === 'col') {
                                if (selection[i][0] !== 0 || selection[i][2] !== Wptm.max_row - 1) {
                                    function_data.selection.splice(i, 1);
                                    change_selected = true;
                                }
                            }
                        }

                        this.find('#jform_row_height-lbl').closest('.control-group').addClass('wptm_hiden');
                        this.find('.popup_top span').text(wptmContext.columns_width_start);
                        if (function_data.selectionSize > 1) {
                            this.find('#jform_col_width-lbl').text(wptmContext.columns_width_start);
                        }

                        if (function_data.selectionSize < 2) {
                            if (selection[0][1] !== selection[0][3]) {//columns
                                var text = [];
                                if (selection[0][1] > 25) {
                                    text[0] = String.fromCharCode(65) + String.fromCharCode(65 + selection[0][1] - 26);
                                } else {
                                    text[0] = String.fromCharCode(65 + selection[0][1]);
                                }
                                if (selection[0][3] > 25) {
                                    text[1] = String.fromCharCode(65) + String.fromCharCode(65 + selection[0][3] - 26);
                                } else {
                                    text[1] = String.fromCharCode(65 + selection[0][3]);
                                }
                                this.find('#jform_col_width-lbl')
                                    .text(wptmContext.columns_width_start + text[0] + '-' + text[1]);
                            }
                        }

                        this.find('.cellRangeLabelAlternate').addClass('select_column').data('text_change', '#jform_col_width-lbl');
                        if (change_selected) {
                            $(Wptm.container).handsontable("selectCells", function_data.selection);
                            tableFunction.getSelectedVal(function_data.selection[selection.length - 1], this.find('.cellRangeLabelAlternate'));
                        }
                        return true;
                    },
                    'submitAction': function () {
                        var col_width_val = this.find('#cell_col_width').val();
                        selection = function_data.selection;
                        var i = -1;
                        var ii = 0;
                        if (typeof selection !== 'undefined' && selection !== undefined && function_data.selectionSize > 0) {
                            for (ii = 0; ii < function_data.selectionSize; ii++) {
                                for (i = selection[ii][1]; i <= selection[ii][3]; i++) {
                                    if (typeof Wptm.style.cols[i] === 'undefined' ||  Wptm.style.cols[i] === null) {
                                        Wptm.style.cols[i] = [i, {width: parseInt(col_width_val)}];
                                    }
                                    Wptm.style.cols[i][1].width = parseInt(col_width_val);
                                }
                            }
                            i++;
                        }
                        if (i !== -1) { //have changing
                            table_function_data.needSaveAfterRender = true;
                            tableFunction.pullDims(Wptm, $);
                        }

                        this.siblings('.colose_popup').trigger('click');
                        tableFunction.saveChanges(true);
                        return true;
                    },
                    'cancelAction': function () {
                        wptm_element.wptm_popup.find('.content').contents().remove();
                        return true;
                    }
                };
                if (Wptm.type === 'mysql') {
                    wptm_popup(wptm_element.wptm_popup, popup, true, false);
                } else {
                    wptm_popup(wptm_element.wptm_popup, popup, true, true);
                }
                break;
            case 'resize_row':
                popup = {
                    'html': wptm_element.content_popup_hide.find('#column_size_menu'),
                    'inputEnter': true,
                    'showAction': function () {
                        var selection = function_data.selection;
                        var change_selected = false;
                        for (var i = 0; i < selection.length; i++) {
                            if (Wptm.newSelect === 'row') {
                                if (selection[i][1] !== 0 || selection[i][3] !== Wptm.max_Col - 1) {
                                    function_data.selection.splice(i, 1);
                                    change_selected = true;
                                }
                            }
                        }

                        this.find('#jform_col_width-lbl').closest('.control-group').addClass('wptm_hiden');
                        this.find('.popup_top span').text(wptmContext.rows_height_start);
                        if (Wptm.type === 'mysql') {
                            this.find('#all_cell_row_height').closest('.control-group').removeClass('wptm_hiden');
                            this.find('#jform_row_height-lbl').text(wptmContext.row_height + ' (header):');
                            this.find('#all_cell_row_height').val(Wptm.style.table.allRowHeight);
                        } else {
                            if (function_data.selectionSize > 1) {
                                this.find('#jform_row_height-lbl').text(wptmContext.rows_height);
                            } else {
                                if (selection[0][0] !== selection[0][2]) {//rows
                                    this.find('#jform_row_height-lbl')
                                        .text(wptmContext.rows_height_start + (selection[0][0] + 1) + '-' + (selection[0][2] + 1));
                                }
                            }
                        }

                        this.find('.cellRangeLabelAlternate').addClass('select_row').data('text_change', '#jform_row_height-lbl')
                        if (change_selected) {
                            $(Wptm.container).handsontable("selectCells", function_data.selection);
                            tableFunction.getSelectedVal(function_data.selection[selection.length - 1], this.find('.cellRangeLabelAlternate'));
                        }
                        return true;
                    },
                    'submitAction': function () {
                        var row_height_val = this.find('#cell_row_height').val();
                        var all_row_height_val = this.find('#all_cell_row_height').val();
                        selection = function_data.selection;
                        var i = -1;
                        var ii = 0;
                        if (typeof selection !== 'undefined' && selection !== undefined && function_data.selectionSize > 0) {
                            for (ii = 0; ii < function_data.selectionSize; ii++) {
                                for (i = selection[ii][0]; i <= selection[ii][2]; i++) {
                                    if (Wptm.type !== 'mysql') {
                                        if (typeof Wptm.style.rows[i] === 'undefined') {
                                            Wptm.style.rows[i] = [i, {height: parseInt(row_height_val)}];
                                        }
                                        Wptm.style.rows[i][1].height = parseInt(row_height_val);
                                    }
                                }
                            }
                            if (Wptm.type == 'mysql') {
                                Wptm.style.rows[0][1].height = row_height_val;
                                Wptm.style.table = tableFunction.fillArray(Wptm.style.table, {allRowHeight: parseFloat(all_row_height_val)});
                            }
                            i++;
                        }
                        if (i !== -1) { //have changing
                            table_function_data.needSaveAfterRender = true;
                            tableFunction.pullDims(Wptm, $);
                        }

                        this.siblings('.colose_popup').trigger('click');
                        tableFunction.saveChanges(true);
                        return true;
                    },
                    'cancelAction': function () {
                        wptm_element.wptm_popup.find('.content').contents().remove();
                        return true;
                    }
                };
                if (Wptm.type === 'mysql') {
                    wptm_popup(wptm_element.wptm_popup, popup, true, false);
                } else {
                    wptm_popup(wptm_element.wptm_popup, popup, true, true);
                }
                break;
            case 'header_option_menu':
                popup = {
                    'html': wptm_element.content_popup_hide.find('#header_option'),
                    'showAction': function() {
                        var length = -1;
                        for (var i = 4; i > 0; i--) {
                            if (typeof Wptm.datas[i] !== 'undefined') {
                                for (var ii = 0; ii < Wptm.datas[i].length; ii++) {
                                    if (Wptm.datas[i][ii] !== '') {
                                        length = i;
                                        break;
                                    }
                                }
                            }
                            if (length > -1) {
                                break;
                            }
                        }
                        this.find('#number_first_rows').next().find('li[data-value=' + (length + 1) + ']').nextAll().hide();
                        tableFunction.updateParamFromStyleObjectSelectBox(Wptm, 'headerOption', this.find('#number_first_rows').next('.wptm_select_box'), length + 1 > 0 ? 1 : 0);
                        if (Wptm.type == 'mysql') {
                            this.find('#number_first_rows').addClass('no_active');
                        } else {
                            custom_select_box.call(this.find('#number_first_rows'), $);
                        }
                        //freeze_row
                        var freeze_row = parseInt(Wptm.style.table.freeze_row) > 0 ? 1 : 0;
                        tableFunction.updateSwitchButtonFromStyleObject({'freeze_row': freeze_row}, 'freeze_row', this.find('#freeze_row'), '0');
                    },
                    'submitAction': function () {
                        if (Wptm.type !== 'mysql') {
                            if (this.find('#number_first_rows').data('value') !== '') {
                                if (this.find('#number_first_rows').data('value') != Wptm.headerOption) {
                                    saveData.push({
                                        action: 'set_header_option',
                                        value: this.find('#number_first_rows').data('value')
                                    });
                                }
                                Wptm.headerOption = parseInt(this.find('#number_first_rows').data('value'));
                            }
                        }

                        Wptm.style.table.freeze_row = this.find("#freeze_row").is(":checked") ? 1 : 0;
                        if (Wptm.style.table.freeze_row > 0) {
                            $(Wptm.container).handsontable('updateSettings', {fixedRowsTop: Wptm.headerOption});
                        } else {
                            $(Wptm.container).handsontable('updateSettings', {fixedRowsTop: 0});
                        }

                        tableFunction.saveChanges(true);
                        this.siblings('.colose_popup').trigger('click');

                        return true;
                    },
                    'cancelAction': function () {
                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'sort_menu':
                popup = {
                    'html': wptm_element.content_popup_hide.find('#sortable_table'),
                    'showAction': function () {
                        tableFunction.updateSwitchButtonFromStyleObject(Wptm.style.table, 'use_sortable', this.find('#use_sortable'), '0');
                        tableFunction.updateParamFromStyleObjectSelectBox(Wptm.style.table, 'default_order_sortable', this.find('#default_order_sortable').next('.wptm_select_box'), '');
                        tableFunction.updateParamFromStyleObjectSelectBox(Wptm.style.table, 'default_sortable', this.find('#default_sortable').next('.wptm_select_box'), '');
                        custom_select_box.call(this.find('#default_order_sortable'), $);
                        custom_select_box.call(this.find('#default_sortable'), $);

                        return true;
                    },
                    'submitAction': function () {
                        Wptm.style.table.use_sortable = this.find("#use_sortable").is(":checked") ? 1 : 0;
                        if (Wptm.style.table.use_sortable == 1) {
                            wptm_element.primary_toolbars.find('.sort_menu').parent().addClass('selected');
                        } else {
                            wptm_element.primary_toolbars.find('.sort_menu').parent().removeClass('selected');
                        }

                        if (this.find('#default_order_sortable').data('value') !== '') {
                            Wptm.style.table.default_order_sortable = this.find('#default_order_sortable').data('value');
                        }
                        Wptm.style.table.default_sortable = this.find('#default_sortable').data('value');
                        this.siblings('.colose_popup').trigger('click');
                        tableFunction.saveChanges(true);
                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'filters_menu':
                if ($(this).parent().hasClass('selected')) {
                    Wptm.style.table.enable_filters = 0;
                    $(this).parent().removeClass('selected');
                } else {
                    Wptm.style.table.enable_filters = 1;
                    $(this).parent().addClass('selected');
                }
                tableFunction.saveChanges(true);
                break;
            case 'column_type_menu':
                tableFunction.default_sortable(window.Wptm.datas);
                popup = {
                    'html': wptm_element.content_popup_hide.find('#column_type_table'),
                    'showAction': function () {
                        var col_types = Wptm.style.table.col_types;

                        this.find('tbody tr').each(function () {
                            var i = $(this).data('col');
                            col_types[i] = typeof col_types[i] !== 'undefined' ? col_types[i].toLowerCase() === 'varchar(255)' ? 'varchar' : col_types[i].toLowerCase() : 'varchar';
                            if (Wptm.type === 'mysql') {
                                $(this).find('.wptm_select_box_before').addClass('no_active').text(col_types[i]);
                            } else {
                                tableFunction.updateParamFromStyleObjectSelectBox(col_types, i, $(this).find('.wptm_select_box'), 'varchar');
                                custom_select_box.call($(this).find('.column_type'), $);
                            }
                        });
                    },
                    'submitAction': function () {
                        var cols_selected = [];
                        if (Wptm.type !== 'mysql') {
                            this.find('tbody tr').each(function () {
                                var i = $(this).data('col');
                                var that = $(this).find('.wptm_select_box_before');
                                if (that.data('value') !== '') {
                                    if (that.data('value') != Wptm.style.table.col_types[i]) {
                                        cols_selected[i] = that.data('value');
                                    }
                                    Wptm.style.table.col_types[i] = that.data('value');
                                }
                            });

                            if (cols_selected.length > 0) {
                                saveData.push({
                                    action: 'set_columns_types',
                                    value: cols_selected
                                });
                            }
                            tableFunction.cleanHandsontable();
                            tableFunction.saveChanges(true);
                        }
                        this.siblings('.colose_popup').trigger('click');

                        return true;
                    },
                    'cancelAction': function () {
                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'responsive_menu':
                tableFunction.default_sortable(window.Wptm.datas);
                popup = {
                    'html': wptm_element.content_popup_hide.find('#responsive_table'),
                    'selector': {
                        'responsive_type': '#responsive_type',
                        'table_height': '#table_height',
                        'freeze_col': '#freeze_col',
                        'responsive_col': '#responsive_col',
                        'responsive_priority': '#responsive_priority'
                    },
                    'option': {
                        'responsive_type': Wptm.style.table.responsive_type,
                        'freeze_col': Wptm.style.table.freeze_col,
                        'table_height': Wptm.style.table.table_height,
                    },
                    'showAction': function () {
                        tableFunction.updateParamFromStyleObjectSelectBox(popup.option, 'responsive_type', this.find('#responsive_type').next('.wptm_select_box'), 'scroll');
                        custom_select_box.call(this.find('#responsive_type'), $);

                        tableFunction.updateParamFromStyleObjectSelectBox(popup.option, 'freeze_col', this.find('#freeze_col').next('.wptm_select_box'), '0');
                        custom_select_box.call(this.find('#freeze_col'), $);

                        tableFunction.updateParamFromStyleObject(popup.option, 'table_height', this.find('#table_height'), '0');

                        this.find('table tr .responsive_priority').each(function () {
                            custom_select_box.call($(this), $);
                        });

                        popup.inputAction.call(this, 'responsive_type');
                        check_saving = false;
                    },
                    'submitAction': function () {
                        Wptm.style.table.responsive_type = this.find('#responsive_type').data('value');
                        Wptm.style.table.freeze_col = this.find("#freeze_col").data('value');
                        Wptm.style.table.table_height = this.find("#table_height").val();
                        this.siblings('.colose_popup').trigger('click');
                        tableFunction.saveChanges(true);
                        return true;
                    },
                    'inputAction': function (selector) {
                        if (selector === 'responsive_type') {
                            if (popup.option.responsive_type === 'scroll') {
                                this.find('.hiding').hide();
                                this.find('.scrolling').show();
                            } else {
                                this.find('.hiding').show();
                                this.find('.scrolling').hide();

                                tableFunction.responsive_col.call(this.find('#responsive_col'), Wptm);
                            }
                        }

                        //scrolling
                        if (selector === 'freeze_col') {
                            if (parseInt(popup.option.freeze_col) === 0) {
                                $(Wptm.container).handsontable('updateSettings', {
                                    manualColumnFreeze: false,
                                    fixedColumnsLeft: 0
                                });
                            } else {
                                $(Wptm.container).handsontable('updateSettings', {
                                    manualColumnFreeze: true,
                                    fixedColumnsLeft: popup.option.freeze_col
                                });
                            }
                        }

                        for (var i = 0; i < _.size(Wptm.style.cols); i++) {
                            if(typeof Wptm.style.cols[i] !== 'undefined' && Wptm.style.cols[i] !== null) {
                                var col_priority = typeof Wptm.style.cols[i][1].res_priority !== 'undefined' ? Wptm.style.cols[i][1].res_priority: 0;
                                if (typeof col_priority !== 'undefined') {
                                    var curr_col = wptm_element.wptm_popup.find('table tbody tr').eq(i);
                                    curr_col.find('.responsive_priority').text(col_priority).data('value', col_priority);
                                }
                            }
                        }
                        $('.responsive_priority').unbind('change').on('change', (e) => {
                            var col = $(e.target).closest('tr').data('col');

                            if (typeof Wptm.style.cols[col] !== 'undefined' && Wptm.style.cols[col] !== null && $(e.target).val() !== Wptm.style.cols[col].res_priority) {
                                check_saving = true;
                            }
                            Wptm.style.cols = tableFunction.fillArray(Wptm.style.cols, {res_priority: $(e.target).data('value')}, col);
                        });
                    },
                    'cancelAction': function () {
                        for (var key in popup.option) {
                            if (popup.option[key] !== Wptm.style.table[key]) {
                                check_saving = false;
                                break;
                            }
                        }
                        if (check_saving) {
                            Wptm.style.table = $.extend({}, Wptm.style.table, popup.option), tableFunction.saveChanges();
                        }
                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'pagination_menu':
                popup = {
                    'html': wptm_element.content_popup_hide.find('#pagination_table'),
                    'showAction': function () {
                        tableFunction.updateSwitchButtonFromStyleObject(Wptm.style.table, 'enable_pagination', this.find('#enable_pagination'), '0');

                        tableFunction.updateParamFromStyleObjectSelectBox(Wptm.style.table, 'limit_rows', this.find('#limit_rows').next('.wptm_select_box'), 0);
                        custom_select_box.call(this.find('#limit_rows'), $);

                        return true;
                    },
                    'submitAction': function () {
                        Wptm.style.table.limit_rows = this.find('#limit_rows').data('value');
                        Wptm.style.table.enable_pagination = this.find("#enable_pagination").is(":checked") ? 1 : 0;
                        if (Wptm.style.table.enable_pagination == 1) {
                            wptm_element.primary_toolbars.find('.pagination_menu').parent().addClass('selected');
                        } else {
                            wptm_element.primary_toolbars.find('.pagination_menu').parent().removeClass('selected');
                        }
                        this.siblings('.colose_popup').trigger('click');
                        tableFunction.saveChanges(true);
                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'date_menu':
                popup = {
                    'html': wptm_element.content_popup_hide.find('#date_menu'),
                    'inputEnter': true,
                    'render': true,
                    'showAction': function () {
                        tableFunction.updateParamFromStyleObject(Wptm.style.table, 'date_formats', this.find('#date_format'), '');

                        this.find('.select_date_format li').unbind('click').on('click', (e) => {
                            $(e.currentTarget).siblings('.active').removeClass('active');
                            var date_format = $(e.currentTarget).addClass('active').data('value');
                            if (typeof date_format !== 'undefined' && date_format !== '') {
                                this.find('#date_format').val(date_format);
                            }
                        });
                        return true;
                    },
                    'submitAction': function () {
                        if (this.find('#date_format').val() !== '') {
                            Wptm.style.table.date_formats = this.find('#date_format').val();
                        }

                        function_data = tableFunction.createRegExpFormat(function_data, false, Wptm.style.table.date_formats);
                        table_function_data.needSaveAfterRender = true;
                        this.siblings('.colose_popup').trigger('click');
                        tableFunction.saveChanges(true);
                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'curency_menu':
                popup = {
                    'html': wptm_element.content_popup_hide.find('#curency_menu'),
                    'render': true,
                    'inputEnter': true,
                    'selector': {
                        'symbol_position': '#symbol_position'
                    },
                    'option': {
                        'symbol_position': Wptm.style.table.symbol_position
                    },
                    'showAction': function () {
                        tableFunction.updateParamFromStyleObject(Wptm.style.table, 'currency_symbol', this.find('#currency_symbol'), '');
                        tableFunction.updateParamFromStyleObjectSelectBox(Wptm.style.table, 'symbol_position', this.find('#symbol_position').next('.wptm_select_box'), '');
                        custom_select_box.call(this.find('#symbol_position'), $);

                        this.find('.select_curency_menu li').unbind('click').on('click', (e) => {
                            $(e.currentTarget).siblings('.active').removeClass('active');
                            var currency_symbol = $(e.currentTarget).addClass('active').data('currency_sym');
                            if (typeof currency_symbol !== 'undefined' && currency_symbol !== '') {
                                this.find('#currency_symbol').val(currency_symbol);
                            }

                            var symbol_position = $(e.currentTarget).data('symbol_position');
                            if (typeof symbol_position !== 'undefined' && symbol_position !== '') {
                                this.find('#symbol_position').data('value', symbol_position).text(symbol_position == 1 ? 'After': 'Before').change();
                            }
                        });
                        return true;
                    },
                    'submitAction': function () {
                        if (this.find('#currency_symbol').val() !== '') {
                            Wptm.style.table.currency_symbol = this.find('#currency_symbol').val();
                        }
                        function_data = tableFunction.createRegExpFormat(function_data, Wptm.style.table.currency_symbol, false);

                        Wptm.style.table = $.extend({}, Wptm.style.table, popup.option);
                        table_function_data.needSaveAfterRender = true;
                        this.siblings('.colose_popup').trigger('click');
                        tableFunction.saveChanges(true);
                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'decimal_menu':
                popup = {
                    'html': wptm_element.content_popup_hide.find('#decimal_menu'),
                    'render': true,
                    'inputEnter': true,
                    'showAction': function () {
                        tableFunction.updateParamFromStyleObject(Wptm.style.table, 'thousand_symbol', this.find('#thousand_symbol'), '');
                        tableFunction.updateParamFromStyleObject(Wptm.style.table, 'decimal_symbol', this.find('#decimal_symbol'), '');
                        tableFunction.updateParamFromStyleObject(Wptm.style.table, 'decimal_count', this.find('#decimal_count'), '');
                        this.find('.select_decimal_menu li').unbind('click').on('click', (e) => {
                            $(e.currentTarget).siblings('.active').removeClass('active');
                            var thousand_symbol = $(e.currentTarget).addClass('active').data('thousand_symbol');
                            if (typeof thousand_symbol !== 'undefined') {
                                this.find('#thousand_symbol').val(thousand_symbol).change();
                            }

                            var decimal_symbol = $(e.currentTarget).data('decimal_symbol');
                            if (typeof decimal_symbol !== 'undefined') {
                                this.find('#decimal_symbol').val(decimal_symbol).change();
                            }

                            var decimal_count = $(e.currentTarget).data('decimal_count');
                            if (typeof decimal_count !== 'undefined' && decimal_count !== '') {
                                this.find('#decimal_count').val(decimal_count).change();
                            } else {
                                this.find('#decimal_count').val(0).change();
                            }
                        });
                        return true;
                    },
                    'submitAction': function () {
                        if (typeof this.find('#decimal_symbol').val() !== 'undefined') {
                            Wptm.style.table.decimal_symbol = this.find('#decimal_symbol').val();
                        }
                        if (typeof this.find('#decimal_count').val() !== 'undefined') {
                            Wptm.style.table.decimal_count = this.find('#decimal_count').val() == '' ? 0: this.find('#decimal_count').val();
                        }
                        if (typeof this.find('#thousand_symbol').val() !== 'undefined') {
                            Wptm.style.table.thousand_symbol = this.find('#thousand_symbol').val();
                        }
                        table_function_data.needSaveAfterRender = true;
                        this.siblings('.colose_popup').trigger('click');
                        tableFunction.saveChanges(true);

                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'google_sheets_menu':
                if (Wptm.type == 'mysql') {
                    return false;
                }
                popup = {
                    'html': wptm_element.content_popup_hide.find('#google_sheets_menu'),
                    'inputEnter': true,
                    'showAction': function () {
                        this.find('#fetch_browse').hide();
                        this.find('#jform_excel_url-lbl').hide();
                        this.find('#import_style').parent().hide();
                        tableFunction.updateSwitchButtonFromStyleObject(Wptm.style.table, 'auto_sync', this.find('#auto_sync'), '0');
                        tableFunction.updateSwitchButtonFromStyleObject(Wptm.style.table, 'download_button', this.find('#download_button'), '0');
                        tableFunction.updateSwitchButtonFromStyleObject(Wptm.style.table, 'spreadsheet_style', this.find('#spreadsheet_style'), '0');

                        tableFunction.updateParamFromStyleObject(Wptm.style.table, 'spreadsheet_url', this.find('#spreadsheet_url'), '');
                        check_saving = 0;

                        this.find('#fetch_google').unbind('click').on('click', (e) => {
                            Wptm.style.table.spreadsheet_url = this.find("#spreadsheet_url").val();
                            if (Wptm.style.table.spreadsheet_url === '' || Wptm.style.table.spreadsheet_url === undefined) {
                                return false;
                            }

                            Wptm.style.table.spreadsheet_style = this.find("#spreadsheet_style").is(":checked") ? 1 : 0;
                            Wptm.style.table.auto_sync = this.find("#auto_sync").is(":checked") ? 1 : 0;
                            if (Wptm.style.table.auto_sync === 1) {
                                Wptm.style.table.excel_auto_sync = 0;
                            }
                            Wptm.style.table.download_button = this.find("#download_button").is(":checked") ? 1 : 0;

                            var data = {'type': 'spreadsheet'};
                            table_function_data.fetch_data = data;

                            tableFunction.saveChanges(true);
                            return true;
                        });
                        return true;
                    },
                    'submitAction': function () {
                        Wptm.style.table.spreadsheet_url = this.find("#spreadsheet_url").val();

                        Wptm.style.table.spreadsheet_style = this.find("#spreadsheet_style").is(":checked") ? 1 : 0;

                        Wptm.style.table.auto_sync = this.find("#auto_sync").is(":checked") ? 1 : 0;
                        if (Wptm.style.table.auto_sync === 1) {
                            Wptm.style.table.excel_auto_sync = 0;
                        }

                        Wptm.style.table.download_button = this.find("#download_button").is(":checked") ? 1 : 0;
                        check_saving = 1;

                        this.siblings('.colose_popup').trigger('click');
                        return true;
                    },
                    'cancelAction': function () {
                        if (check_saving === 1) {
                            tableFunction.saveChanges(true);
                        }
                        return true;
                    },
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'synchronization_menu':
                if (Wptm.type == 'mysql') {
                    return false;
                }
                popup = {
                    'html': wptm_element.content_popup_hide.find('#google_sheets_menu'),
                    'inputEnter': true,
                    'showAction': function () {
                        this.find('#jform_spreadsheet_url-lbl').hide();
                        this.find("#download_button").closest('.control-group').hide();
                        if (typeof default_value.enable_import_excel !== 'undefined'
                            && default_value.enable_import_excel == '1') {
                            this.find('#google_sheets_menu .control-group').eq(0).before(wptm_element.content_popup_hide.find('#import_excel'));
                            this.find('#google_sheets_menu').addClass('excel_syn');
                        }
                        tableFunction.updateSwitchButtonFromStyleObject(Wptm.style.table, 'excel_auto_sync', this.find('#auto_sync'), '0');
                        tableFunction.updateSwitchButtonFromStyleObject(Wptm.style.table, 'excel_spreadsheet_style', this.find('#spreadsheet_style'), '0');

                        tableFunction.updateParamFromStyleObject(Wptm.style.table, 'excel_url', this.find('#spreadsheet_url'), '');
                        check_saving = 0;

                        this.find('#fetch_google').unbind('click').on('click', (e) => {
                            Wptm.style.table.excel_url = this.find("#spreadsheet_url").val();
                            if (Wptm.style.table.excel_url === '' || Wptm.style.table.excel_url === undefined) {
                                return false;
                            }

                            Wptm.style.table.excel_spreadsheet_style = this.find("#spreadsheet_style").is(":checked") ? 1 : 0;
                            Wptm.style.table.excel_auto_sync = this.find("#auto_sync").is(":checked") ? 1 : 0;
                            if (Wptm.style.table.excel_auto_sync === 1) {
                                Wptm.style.table.auto_sync = 0;
                            }

                            var data = {'type': 'excel'};
                            table_function_data.fetch_data = data;

                            tableFunction.saveChanges(true);
                            return true;
                        });

                        custom_select_box.call(this.find('#import_style'), $);
                        return true;
                    },
                    'submitAction': function () {
                        Wptm.style.table.excel_auto_sync = this.find("#auto_sync").is(":checked") ? 1 : 0;
                        if (Wptm.style.table.excel_auto_sync === 1) {
                            Wptm.style.table.auto_sync = 0;
                        }
                        Wptm.style.table.excel_spreadsheet_style = this.find("#spreadsheet_style").is(":checked") ? 1 : 0;

                        Wptm.style.table.excel_url = this.find("#spreadsheet_url").val();

                        check_saving = 1;
                        this.siblings('.colose_popup').trigger('click');
                        return true;
                    },
                    'cancelAction': function () {
                        this.find('#import_excel').appendTo(wptm_element.content_popup_hide);
                        if (check_saving === 1) {
                            tableFunction.saveChanges(true);
                        }
                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'new_chart_menu':
                DropChart.functions.addChart();
                break;
            case 'view_chart_menu':
                if (Wptm.dataChart.length > 0) {
                    wptm_element.settingTable.find('.ajax_loading').addClass('loadding').removeClass('wptm_hiden');
                    $(this).closest('li').addClass('menu_loading');
                    tableFunction.showChartOrTable(true, jquery('#list_chart').find('.chart-menu').eq(0));
                } else {
                    bootbox.alert(wptmText.CHART_NOT_EXIST, wptmText.GOT_IT);
                }
                break;
            case 'editToolTip':
                var content = $('#tooltip_content').val();

                if (typeof content !== 'undefined') {
                    var i, j;
                    var selection = table_function_data.selection[0];
                    var width = $('#tooltip_width').val();
                    for (i = selection[0]; i <= selection[2]; i++) {
                        for (j = selection[1]; j <= selection[3]; j++) {
                            if (width !== '') {
                                Wptm.style.cells = tableFunction.fillArray(Wptm.style.cells, {
                                    tooltip_content: content,
                                    tooltip_width: width
                                }, i, j);
                            } else {
                                Wptm.style.cells = tableFunction.fillArray(Wptm.style.cells, {tooltip_content: content}, i, j);
                            }
                            if (i == selection[2] && j == selection[3]) {
                                saveData.push({action: 'style', selection: table_function_data.selection, style: {
                                        tooltip_content: content,
                                        tooltip_width: width
                                    }});
                                tableFunction.saveChanges();
                            }
                        }
                    }
                }
                break;
        }
        return false;
    });

    //select option in sub-menu(first top menu)
    wptm_element.primary_toolbars.find('.has_sub_menu ul li').on('change click', function () {
        if (!(window.Wptm.can.edit || (window.Wptm.can.editown && data.author === window.Wptm.author))) {
            return false;
        }

        var function_data = window.table_function_data;
        var Wptm = window.Wptm;
        var $ = window.jquery;
        var option_name = $(this).parents('.sub-menu').siblings('.table_option');
        switch (option_name.attr('name')) {
            case 'align_menu':
                Wptm.style.table.table_align = $(this).attr('name').toString();
                $(this).siblings('.selected').removeClass('selected');
                $(this).addClass('selected');
                break;
        }
        return true;
    });

    wptm_element.primary_toolbars.find('a.cell_option').unbind('click').on('click', function (e) {
        e.preventDefault();

        render = second_menu.call(this, render);
        clearTimeout(autoRender);

        autoRender = setTimeout(function () {
            if (render === true) {
                table_function_data.needSaveAfterRender = true;
                window.jquery(window.Wptm.container).data('handsontable').render();
            }
            render = false;
        }, 200);
    });

    wptm_element.primary_toolbars.find('.cell_option').unbind('change').on('change', function (e) {
        e.preventDefault();

        render = second_menu.call(this, render);
        clearTimeout(autoRender);

        autoRender = setTimeout(function () {
            if (render === true) {
                table_function_data.needSaveAfterRender = true;
                window.jquery(window.Wptm.container).data('handsontable').render();
            }
            render = false;
        }, 200);
    });

    //select calculator function
    wptm_element.primary_toolbars.find('.calculater_function').unbind('click').on('click', function (e) {
        e.preventDefault();
        if (Wptm.type !== 'html') {
            return;
        }
        var $ = window.jquery;

        var selection = $.extend({}, table_function_data.selection);
        var calculater = $(this).data('calculater');

        tableFunction.change_value_cells(selection, '=' + calculater + '()');
        var CellValue = document.getElementById('CellValue');

        wptm_element.cellValue.focus().val('=' + calculater + '()');

        if (CellValue) {
            if (typeof CellValue.setSelectionRange === 'function') {
                var x = calculater.length + 2;
                CellValue.setSelectionRange(x, x);
            }
            wptm_element.cellValue.click();
        }
    });

    //change value cells by #CellValue
    wptm_element.cellValue.on('keyup', function (e) {
        if (e.keyCode === 13 && Wptm.type == 'html') {
            tableFunction.change_value_cells(table_function_data.selection, wptm_element.cellValue.val());
            var $ = window.jquery;
            var selection = table_function_data.selection;

            if (typeof selection[1] === 'undefined'
                && typeof selection[0][2] !== 'undefined'
                && selection[0][0] === selection[0][2]
                && selection[0][1] === selection[0][3]) {
                if (typeof Wptm.datas[selection[0][0] + 1] === 'undefined') {
                    $(Wptm.container).handsontable("selectCell", 0, selection[0][1] + 1, 0, selection[0][3] + 1);
                } else {
                    $(Wptm.container).handsontable("selectCell", selection[0][0] + 1, selection[0][1], selection[0][2] + 1, selection[0][3]);
                }
            }
        }
        return true;
    });
};

//event change value option in cell_menu
function second_menu(render) {
    if (!(window.Wptm.can.edit || (window.Wptm.can.editown && data.author === window.Wptm.author))) {
        return false;
    }

    if (table_function_data.selectOption) {
        return false;
    }

    var Wptm = window.Wptm;
    var $ = window.jquery;
    var value;
    var parentLi = $(this).parents('.cells_option');
    var i;
    table_function_data.option_selected_mysql = '';

    var selection = $.extend({}, table_function_data.selection);

    if (Wptm.type === 'mysql') {
        for (i = 0; i < table_function_data.selectionSize; i++) {
            if (selection[i][0] + selection[i][2] !== 0) {//not cell in header
                selection[i][0] = selection[i][0] > 0 ? 1 : selection[i][0];
                selection[i][2] = _.size(Wptm.style.rows) - 1;
                table_function_data.option_selected_mysql = jquery(this).attr('name');
            }
        }
    }

    if (typeof selection[0][1] === 'undefined') {
        return;
    }
    switch ($(this).attr('name')) {
        case 'cell_font_family':
            tableFunction.getFillArray(selection, Wptm, {cell_font_family: $(this).data('value')});
            render = true;
            break;
        case 'cell_font_size':
            tableFunction.getFillArray(selection, Wptm, {cell_font_size: $(this).val()});
            render = true;
            break;
        case 'cell_format_bold':
            if (parentLi.find('.active').length < 1) {
                value = true;
                parentLi.find('.cell_option').addClass('active');
            } else {
                value = false;
                parentLi.find('.active').removeClass('active');
            }

            tableFunction.getFillArray(selection, Wptm, {cell_font_bold: value});
            render = true;
            break;
        case 'cell_font_underline':
            if (parentLi.find('.active').length < 1) {
                value = true;
                parentLi.find('.cell_option').addClass('active');
            } else {
                value = false;
                parentLi.find('.active').removeClass('active');
            }
            tableFunction.getFillArray(selection, Wptm, {cell_font_underline: value});
            render = true;
            break;
        case 'cell_font_italic':
            if (parentLi.find('.active').length < 1) {
                value = true;
                parentLi.find('.cell_option').addClass('active');
            } else {
                value = false;
                parentLi.find('.active').removeClass('active');
            }
            tableFunction.getFillArray(selection, Wptm, {cell_font_italic: value});
            render = true;
            break;
        case 'cell_background_color':
            value = $(this).val();
            tableFunction.getFillArray(selection, Wptm, {cell_background_color: value});
            $(this).parents('.wp-picker-container').find('.wp-color-result').css('color', value);
            render = true;
            break;
        case 'cell_font_color':
            value = $(this).val();
            tableFunction.getFillArray(selection, Wptm, {cell_font_color: value});
            $(this).parents('.wp-picker-container').find('.wp-color-result').css('color', value);
            render = true;
            break;
        case 'format_align_left':
            wptm_element.primary_toolbars.find('a[name="format_align_left"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_center"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_right"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_justify"]').removeClass('active');
            tableFunction.getFillArray(selection, Wptm, {cell_text_align: 'left'});
            render = true;
            break;
        case 'format_align_center':
            wptm_element.primary_toolbars.find('a[name="format_align_left"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_center"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_right"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_justify"]').removeClass('active');
            tableFunction.getFillArray(selection, Wptm, {cell_text_align: 'center'});
            render = true;
            break;
        case 'format_align_right':
            wptm_element.primary_toolbars.find('a[name="format_align_left"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_center"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_right"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_justify"]').removeClass('active');
            tableFunction.getFillArray(selection, Wptm, {cell_text_align: 'right'});
            render = true;
            break;
        case 'format_align_justify':
            wptm_element.primary_toolbars.find('a[name="format_align_left"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_center"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_right"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_justify"]').addClass('active');
            tableFunction.getFillArray(selection, Wptm, {cell_text_align: 'justify'});
            render = true;
            break;
        case 'vertical_align_bottom':
            wptm_element.primary_toolbars.find('a[name="vertical_align_bottom"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_middle"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_top"]').removeClass('active');
            tableFunction.getFillArray(selection, Wptm, {cell_vertical_align: 'bottom'});
            render = true;
            break;
        case 'vertical_align_middle':
            wptm_element.primary_toolbars.find('a[name="vertical_align_bottom"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_middle"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_top"]').removeClass('active');
            tableFunction.getFillArray(selection, Wptm, {cell_vertical_align: 'middle'});
            render = true;
            break;
        case 'vertical_align_top':
            wptm_element.primary_toolbars.find('a[name="vertical_align_bottom"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_middle"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_top"]').addClass('active');
            tableFunction.getFillArray(selection, Wptm, {cell_vertical_align: 'top'});
            render = true;
            break;
        case 'padding_border':
            var popup;
            popup = {
                'html': wptm_element.content_popup_hide.find('#padding_border'),
                'showAction': function () {
                    var size_selection = table_function_data.selectionSize - 1;
                    var cellStyle = window.Wptm.style.cells[selection[size_selection][0] + '!' + selection[size_selection][1]][2];

                    tableFunction.updateParamFromStyleObject(cellStyle, 'cell_padding_left', this.find('#jform_cell_padding_left'), 0);
                    tableFunction.updateParamFromStyleObject(cellStyle, 'cell_padding_top', this.find('#jform_cell_padding_top'), 0);
                    tableFunction.updateParamFromStyleObject(cellStyle, 'cell_padding_right', this.find('#jform_cell_padding_right'), 0);
                    tableFunction.updateParamFromStyleObject(cellStyle, 'cell_padding_bottom', this.find('#jform_cell_padding_bottom'), 0);

                    tableFunction.updateParamFromStyleObject(cellStyle, 'cell_background_radius_left_top', this.find('#jform_cell_background_radius_left_top'), 0);
                    tableFunction.updateParamFromStyleObject(cellStyle, 'cell_background_radius_right_top', this.find('#jform_cell_background_radius_right_top'), 0);
                    tableFunction.updateParamFromStyleObject(cellStyle, 'cell_background_radius_right_bottom', this.find('#jform_cell_background_radius_right_bottom'), 0);
                    tableFunction.updateParamFromStyleObject(cellStyle, 'cell_background_radius_left_bottom', this.find('#jform_cell_background_radius_left_bottom'), 0);

                    this.find('.observeChanges').unbind('change').on('change', (e) => {
                        var name = $(e.currentTarget).attr('name');
                        var value = $(e.currentTarget).val();
                        switch (name) {
                            case 'jform[jform_cell_padding_left]':
                                tableFunction.getFillArray(selection, Wptm, {cell_padding_left: value});
                                break;
                            case 'jform[jform_cell_padding_top]':
                                tableFunction.getFillArray(selection, Wptm, {cell_padding_top: value});
                                break;
                            case 'jform[jform_cell_padding_right]':
                                tableFunction.getFillArray(selection, Wptm, {cell_padding_right: value});
                                break;
                            case 'jform[jform_cell_padding_bottom]':
                                tableFunction.getFillArray(selection, Wptm, {cell_padding_bottom: value});
                                break;
                            case 'jform[jform_cell_background_radius_left_top]':
                                tableFunction.getFillArray(selection, Wptm, {cell_background_radius_left_top: value});
                                break;
                            case 'jform[jform_cell_background_radius_right_top]':
                                tableFunction.getFillArray(selection, Wptm, {cell_background_radius_right_top: value});
                                break;
                            case 'jform[jform_cell_background_radius_right_bottom]':
                                tableFunction.getFillArray(selection, Wptm, {cell_background_radius_right_bottom: value});
                                break;
                            case 'jform[jform_cell_background_radius_left_bottom]':
                                tableFunction.getFillArray(selection, Wptm, {cell_background_radius_left_bottom: value});
                                break;
                        }
                    });
                    return true;
                },
                'submitAction': function () {
                    this.siblings('.colose_popup').trigger('click');
                    tableFunction.saveChanges();
                    return true;
                },
                'cancelAction': function () {
                    window.jquery(window.Wptm.container).data('handsontable').render();
                    return true;
                }
            };
            wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
            break;
        case 'cell_type':
            if (Wptm.type !== 'mysql') {
                if (parentLi.find('.active').length < 1) {
                    tableFunction.getFillArray(selection, Wptm, {cell_type: 'html'}, "set_cells_type");
                    parentLi.find('.cell_option').addClass('active');

                    // add cell type == text for column selected
                    var i, jj;
                    var cols_selected = [];

                    for (jj = 0; jj < table_function_data.selectionSize; jj++) {
                        for (i = table_function_data.selection[jj][1]; i <= table_function_data.selection[jj][3]; i++) {
                            cols_selected[i] = 'text';
                            Wptm.style.table.col_types[i] = 'text';
                        }
                    }

                    saveData.push({
                        action: 'set_columns_types',
                        value: cols_selected
                    });
                    tableFunction.saveChanges(true);
                } else {
                    tableFunction.getFillArray(selection, Wptm, {cell_type: null}, "set_cells_type");
                    parentLi.find('.active').removeClass('active');
                }
                tableFunction.cleanHandsontable();
                render = true;
            }
            break;
        case 'border_color':
            value = $(this).val();
            // tableFunction.getFillArray(selection, Wptm, {cell_font_color: value});
            $(this).parents('.wp-picker-container').find('.wp-color-result').css('color', value);
            render = true;
            break;
        case 'border_all':
            if ($(this).hasClass('active')) {
                tableFunction.getFillArray(selection, Wptm, {cell_border_left: ''});
                tableFunction.getFillArray(selection, Wptm, {cell_border_top: ''});
                tableFunction.getFillArray(selection, Wptm, {cell_border_right: ''});
                tableFunction.getFillArray(selection, Wptm, {cell_border_bottom: ''});
                $(this).removeClass('active');
            } else {
                border_cell(selection, Wptm, 'cell_border_left', 'cell_border_top', 'cell_border_right', 'cell_border_bottom');
                $(this).addClass('active');
            }
            render = true;
            break;
        case 'border_top':
            var border_selection = {};
            for (i = 0; i < table_function_data.selectionSize; i++) {
                border_selection[i] = [selection[i][0], selection[i][1], selection[i][0], selection[i][3]];;
            }
            var parameter;
            if (table_function_data.option_selected_mysql !== '' && typeof table_function_data.option_selected_mysql !== 'undefined') {
                parameter = 'cell_border_top_start';
            } else {
                parameter = 'cell_border_top';
            }
            if ($(this).hasClass('active')) {
                var x = {};
                x[parameter] = '';
                tableFunction.getFillArray(border_selection, Wptm, x);
                $(this).removeClass('active');
            } else {
                border_cell(border_selection, Wptm, parameter);
                $(this).addClass('active');
            }
            render = true;
            break;
        case 'border_bottom':
            var border_selection = {};
            for (i = 0; i < table_function_data.selectionSize; i++) {
                border_selection[i] = [selection[i][2], selection[i][1], selection[i][2], selection[i][3]];
            }
            var parameter;
            if (table_function_data.option_selected_mysql !== '' && typeof table_function_data.option_selected_mysql !== 'undefined') {
                parameter = 'cell_border_bottom_end';
            } else {
                parameter = 'cell_border_bottom';
            }
            if ($(this).hasClass('active')) {
                var x = {};
                x[parameter] = '';
                tableFunction.getFillArray(border_selection, Wptm, x);
                $(this).removeClass('active');
            } else {
                border_cell(border_selection, Wptm, parameter);
                $(this).addClass('active');
            }
            render = true;
            break;
        case 'border_left':
            var border_selection = {};
            for (i = 0; i < table_function_data.selectionSize; i++) {
                border_selection[i] = [selection[i][0], selection[i][1], selection[i][2], selection[i][1]];
            }
            if ($(this).hasClass('active')) {
                tableFunction.getFillArray(border_selection, Wptm, {cell_border_left: ''});
                $(this).removeClass('active');
            } else {
                border_cell(border_selection, Wptm, 'cell_border_left');
                $(this).addClass('active');
            }
            render = true;
            break;
        case 'border_right':
            var border_selection = {};
            for (i = 0; i < table_function_data.selectionSize; i++) {
                border_selection[i] = [selection[i][0], selection[i][3], selection[i][2], selection[i][3]];
            }
            if ($(this).hasClass('active')) {
                tableFunction.getFillArray(border_selection, Wptm, {cell_border_right: ''});
                $(this).removeClass('active');
            } else {
                border_cell(border_selection, Wptm, 'cell_border_right');
                $(this).addClass('active');
            }
            render = true;
            break;
        case 'border_horizontal':
            var border_selection = {};

            for (i = 0; i < table_function_data.selectionSize; i++) {
                if (selection[i][0] === selection[i][2]) {
                    return false;
                } else {
                    border_selection[i] = [selection[i][0], selection[i][1], selection[i][2] - 1, selection[i][3]];
                }
            }

            if ($(this).hasClass('active')) {
                tableFunction.getFillArray(border_selection, Wptm, {cell_border_bottom: ''});
                $(this).removeClass('active');
            } else {
                border_cell(border_selection, Wptm, 'cell_border_bottom');
                $(this).addClass('active');
            }
            render = true;
            break;
        case 'border_clear':
            tableFunction.getFillArray(selection, Wptm, {cell_border_left: ''});
            tableFunction.getFillArray(selection, Wptm, {cell_border_top: ''});
            tableFunction.getFillArray(selection, Wptm, {cell_border_right: ''});
            tableFunction.getFillArray(selection, Wptm, {cell_border_bottom: ''});
            if (table_function_data.option_selected_mysql !== '' && typeof table_function_data.option_selected_mysql !== 'undefined') {
                tableFunction.getFillArray(selection, Wptm, {cell_border_top_start: ''});
                tableFunction.getFillArray(selection, Wptm, {cell_border_bottom_end: ''});
            }

            // Get cells range above selection
            var topCellsSelections = {};
            Object.keys(selection).map(function(key, index) {
                var x = selection[key][0] - 1 > 0 ? selection[key][0] - 1 : 0;
                topCellsSelections[key] = [x, selection[key][1], x, selection[key][3]];
            });
            tableFunction.getFillArray(topCellsSelections, Wptm, {cell_border_bottom: ''});

            var leftCellsSelections = {};
            var fillLeftCells = true;
            Object.keys(selection).map(function(key, index) {
                var y = selection[key][1] - 1 > 0 ? selection[key][1] - 1 : 0;
                leftCellsSelections[key] = [selection[key][0], y, selection[key][2], y];
                if (parseInt(selection[key][1]) === 0) {
                    fillLeftCells = false;
                }
            });
            if (fillLeftCells) {
                tableFunction.getFillArray(leftCellsSelections, Wptm, {cell_border_right: ''});
            }

            render = true;
            break;
        case 'border_vertical':
            var border_selection = {};
            for (i = 0; i < table_function_data.selectionSize; i++) {
                if (selection[i][1] === selection[i][3]) {
                    return false;
                } else {
                    border_selection[i] = [selection[i][0], selection[i][1], selection[i][2], selection[i][3] - 1];
                }
            }

            if ($(this).hasClass('active')) {
                tableFunction.getFillArray(border_selection, Wptm, {cell_border_right: ''});
                $(this).removeClass('active');
            } else {
                border_cell(border_selection, Wptm, 'cell_border_right');
                $(this).addClass('active');
            }
            render = true;
            break;
        case 'border_inner':
            var new_selection = [];
            new_selection['bottom'] = [];
            new_selection['right'] = [];
            for (i = 0; i < table_function_data.selectionSize; i++) {
                new_selection['bottom'][i] = $.extend([], selection[i]);
                new_selection['right'][i] = $.extend([], selection[i]);
                if (selection[i][1] === selection[i][3]) {
                    return false;
                } else {
                    new_selection['right'][i][3] = selection[i][3] - 1;
                }
                if (selection[i][0] === selection[i][2]) {
                    return false;
                } else {
                    new_selection['bottom'][i][2] = selection[i][2] - 1;
                }
            }
            if ($(this).hasClass('active')) {
                tableFunction.getFillArray(new_selection['right'], Wptm, {cell_border_right: ''});
                tableFunction.getFillArray(new_selection['bottom'], Wptm, {cell_border_bottom: ''});
                $(this).removeClass('active');
            } else {
                border_cell(new_selection['bottom'], Wptm, 'cell_border_bottom');
                border_cell(new_selection['right'], Wptm, 'cell_border_right');
                $(this).addClass('active');
            }
            render = true;
            break;
        case 'border_outer':
            var val, ij, ik;
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                val = 'no_active';
            } else {
                $(this).addClass('active');
                val = 'active';
            }
            $.map(selection, function (v) {
                if (v[1] === v[3]) {
                    return false;
                }
                if (v[0] === v[2]) {
                    return false;
                }
                if (val === 'no_active') {
                    for (ij = v[0]; ij <= v[2]; ij++) {
                        tableFunction.fillArray(Wptm.style.cells, {cell_border_left: ''}, ij, v[1]);
                        tableFunction.fillArray(Wptm.style.cells, {cell_border_right: ''}, ij, v[3]);
                    }
                    for (ik = v[0]; ik <= v[2]; ik++) {
                        tableFunction.fillArray(Wptm.style.cells, {cell_border_top: ''}, v[0], ik);
                        tableFunction.fillArray(Wptm.style.cells, {cell_border_bottom: ''}, v[2], ik);
                    }
                } else {
                    border_cell([[v[0], v[3], v[2], v[3]]], Wptm, 'cell_border_right');
                    border_cell([[v[0], v[1], v[2], v[1]]], Wptm, 'cell_border_left');
                    border_cell([[v[2], v[1], v[2], v[3]]], Wptm, 'cell_border_bottom');
                    border_cell([[v[0], v[1], v[0], v[3]]], Wptm, 'cell_border_top');
                }
            });

            render = true;
            break;
        case 'border_solid':
            $(this).siblings('.border_style.active').removeClass('active');
            $(this).addClass('active');

            render = true;
            break;
        case 'border_dashed':
            $(this).siblings('.border_style.active').removeClass('active');
            $(this).addClass('active');

            render = true;
            break;
        case 'border_dotted':
            $(this).siblings('.border_style.active').removeClass('active');
            $(this).addClass('active');

            render = true;
            break;
        case 'border_width_1':
            $(this).siblings('.border_width.active').removeClass('active');
            $(this).addClass('active');

            render = true;
            break;
        case 'border_width_2':
            $(this).siblings('.border_width.active').removeClass('active');
            $(this).addClass('active');

            render = true;
            break;
        case 'border_width_3':
            $(this).siblings('.border_width.active').removeClass('active');
            $(this).addClass('active');

            render = true;
            break;
        case 'merge_cell':
            if ((selection[0][3] - selection[0][1] + selection[0][2] - selection[0][0]) < 1) {
                return false;
            }
            if (table_function_data.selectionSize > 1) {//if selection > 1 when not merge and select selection[0]
                $(Wptm.container).handsontable("selectCell", selection[0][0], selection[0][1], selection[0][2], selection[0][3]);
                return false;
            }
            if ($(this).hasClass('active')) {
                $(Wptm.container).handsontable('getInstance').getPlugin('mergeCells').unmergeSelection();
                $(this).removeClass('active');
            } else {
                $(Wptm.container).handsontable('getInstance').getPlugin('mergeCells').mergeSelection();
                $(this).addClass('active');
            }
            break;
    }
    return render;
}

/**
 * Convert border value for cell
 *
 * @param selection Selected cells
 * @param Wptm
 */
function border_cell(selection, Wptm) {
    var border_color = wptm_element.primary_toolbars.find('#border_color').val();
    if (typeof border_color === 'undefined' || border_color === '') {
        border_color = 'rgba(0, 0, 0, 0)';
    }
    var cell_border_style = 'solid';
    var width = '1';
    switch (wptm_element.primary_toolbars.find('#cell_border_style a.border_style.active').attr('name')) {
        case 'border_solid':
            cell_border_style = 'solid';
            break;
        case 'border_dashed':
            cell_border_style = 'dashed';
            break;
        case 'border_dotted':
            cell_border_style = 'dotted';
            break;
    }
    switch (wptm_element.primary_toolbars.find('#cell_border_style a.border_width.active').attr('name')) {
        case 'border_width_1':
            width = '1';
            break;
        case 'border_width_2':
            width = '2';
            break;
        case 'border_width_3':
            width = '3';
            break;
    }
    Array.prototype.slice.call(arguments, 2).map(function (foo) {
        switch (foo) {
            case 'cell_border_top':
                // Get cells range above selection
                var topCellsSelections = {};
                Object.keys(selection).map(function(key, index) {
                    var x = selection[key][0] - 1 > 0 ? selection[key][0] - 1 : 0;
                    topCellsSelections[key] = [x, selection[key][1], x, selection[key][3]];
                });
                tableFunction.getFillArray(topCellsSelections, Wptm, {cell_border_bottom: '' + width + 'px ' + cell_border_style + ' ' + border_color});
                break;
            case 'cell_border_left':
                // Get cells range left selection
                var leftCellsSelections = {};
                var fillLeftCells = true;
                Object.keys(selection).map(function(key, index) {
                    var y = selection[key][1] - 1 > 0 ? selection[key][1] - 1 : 0;
                    if (parseInt(selection[key][1]) === 0) {
                        fillLeftCells = false;
                    }
                    leftCellsSelections[key] = [selection[key][0], y, selection[key][2], y];
                });
                if (fillLeftCells) {
                    tableFunction.getFillArray(leftCellsSelections, Wptm, {cell_border_right: '' + width + 'px ' + cell_border_style + ' ' + border_color});
                }
                break;
        }
        var value = {};
        value[foo] = '' + width + 'px ' + cell_border_style + ' ' + border_color;
        tableFunction.getFillArray(selection, Wptm, value);
    });

}

/*
popup and action for this
wptm_popup     #wptm_popup
popup          object data popup
clone          check clone content in popup
selector_cells get selector cells to popup window
submit_button  get submit button to popup window
*/
function wptm_popup(wptm_popup, popup, clone, selector_cells, submit_button) {
    wptm_popup.find('.content').contents().remove();
    var over_popup = wptm_popup.siblings('#over_popup');
    if (!clone) {
        var that = wptm_popup.find('.content').append(popup.html);
    } else {
        var that = wptm_popup.find('.content').append(popup.html.clone());
        // window.jquery(html).appendTo(window.jquerywptm_popup.find('.content'));
    }

    if (selector_cells === true) {
        wptm_popup.find('.content .popup_top').after(window.wptm_element.content_popup_hide.find('#select_cells').clone());
        var function_data = window.table_function_data;
        if (typeof function_data.selection !== 'undefined' && function_data.selection[0] !== undefined && _.size(function_data.selection[0]) > 0) {
            tableFunction.getSelectedVal(function_data.selection[0], that.find('.cellRangeLabelAlternate'));
        }
    }

    if (submit_button === true) {
        that.find('>div').append(window.wptm_element.content_popup_hide.find('#submit_button').clone());
    }
    wptm_popup.animate({'opacity': '1'}, 10);

    wptm_popup.show();
    over_popup.show();

    //selection cells
    that.find('#get_select_cells').unbind('click').on('click', function () {
        alternating.affterRangeLabe.call(that, window.Wptm, window.jquery);
        that.find('.cellRangeLabelAlternate').val();
    });
    that.find('.cellRangeLabelAlternate').on('keyup', function (e) {
        if (e.which == 13) {
            alternating.affterRangeLabe.call(that, window.Wptm, window.jquery);
        }
    });

    /*action when show popup*/
    if (typeof popup.showAction !== 'undefined') {
        popup.showAction.call(that);
    }

    /*action selector*/
    if (typeof popup.selector !== 'undefined') {
        var select = select_input_popup.bind(popup, that);
        select();
    }

    /*action enter input*/
    if (popup.inputEnter) {
        that.find('input').on('keyup', function (e, i) {
            if (e.keyCode === 13) {
                if (typeof popup.submitAction !== 'undefined') {
                    popup.submitAction.call(that);
                } else {
                    jquery(this).trigger('change');
                }
                wptm_popup.find('.colose_popup').trigger('click');
            }
            return true;
        });
    }

    /*click done button*/
    that.find('#popup_done').unbind('click').on('click', function (e) {
        e.preventDefault();
        if (typeof popup.submitAction !== 'undefined') {
            popup.submitAction.call(that);
        }
        return false;
    });

    /*click cancel button*/
    that.find('#popup_cancel').unbind('click').on('click', function (e) {
        e.preventDefault();
        if (typeof popup.cancelAction !== 'undefined') {
            wptm_popup.animate({'opacity': '0'}, 10);
            popup.cancelAction.call(that);
        }
        setTimeout(function () {
            wptm_popup.hide();
            over_popup.hide();
        }, 200);
        return false;
    });

    //action colose
    wptm_popup.find('.colose_popup').unbind('click').on('click', function (e) {
        e.preventDefault();
        if (typeof popup.cancelAction !== 'undefined') {
            wptm_popup.animate({'opacity': '0'}, 10);
            popup.cancelAction.call(that);
        }

        if (typeof popup.render !== 'undefined' && popup.render === true) {
            window.jquery(window.Wptm.container).data('handsontable').render();
        }

        setTimeout(function () {
            wptm_popup.hide();
            over_popup.hide();
        }, 200);
        return false;
    });
    over_popup.unbind('click').on('click', function (e) {
        e.preventDefault();
        wptm_popup.find('.colose_popup').trigger('click');
        return false;
    });

    //set top for popup
    //wptm_popup.css('top', (over_popup.outerHeight() - wptm_popup.outerHeight()) / 2);

    return false;
}

/**
 * Selector Control function in popup
 *
 * @param that Wptm_popup.find('.content')
 */
var select_input_popup = function (that) {
    if (typeof this.selector !== 'undefined') {
        window.jquery.each(this.selector, (i, e) => {
            that.find(e).change((e) => {
                if (typeof this.option[i] !== 'undefined') {
                    this.option[i] = window.jquery(e.currentTarget).val();
                }
                if (typeof this.inputAction !== 'undefined') {
                    this.inputAction.call(that, i);
                }
            });
        });
    }
}

/**
 * add value for table_function_data.selection and table_function_data.selectionSize
 *
 * @returns {*}
 */
var getSelector = function () {
    var selection = [];
    // if (typeof selection === 'undefined' || selection === undefined || !selection) {
    selection = window.jquery(window.Wptm.container).handsontable('getSelected');//get all cells selected ex:[[0,0,1,9],[3,0,3,9]]
    // }
    if (selection !== false && typeof selection !== 'undefined' && selection.length > 0) {
        //check when handsontable('getSelected') return array[0] = array;
        window.table_function_data.selectionSize = _.size(selection);
        for (var i = 0; i < table_function_data.selectionSize; i++) {
            if (selection[i][0] > selection[i][2]) {
                selection[i] = [selection[i][2], selection[i][3], selection[i][0], selection[i][1]];
            }
            if (selection[i][1] > selection[i][3]) {
                selection[i] = [selection[i][0], selection[i][3], selection[i][2], selection[i][1]];
            }
        }
        window.table_function_data.selection = selection;
    } else {
        window.table_function_data.selection = false;
        window.table_function_data.selectionSize = 0;
    }
    return selection;
}

/**
 * Update status item in cell_menu and table_menu by cell selected
 *
 * @param $
 * @param Wptm
 * @param selection Cell selected
 *
 * @returns {boolean}
 */
var loadSelection = function ($, Wptm, selection) {
    selection = getSelector();
    if (!selection) {
        return true;
    }
    //show value cell to #CellValue when selector a cell
    var size_selection = table_function_data.selectionSize - 1;

    if (selection[size_selection][0] === selection[size_selection][2] && selection[size_selection][1] === selection[size_selection][3]) {
        wptm_element.cellValue.val(Wptm.datas[selection[size_selection][0]][selection[size_selection][1]]);
    } else {
        wptm_element.cellValue.val('');
    }

    //set value option by selection
    updateOptionValTable($, Wptm, selection);

    updateOptionValCell($, Wptm, selection);
    //Todo: populate jform_responsive_col

    return true;
}

/**
 * Update status item in table_menu by cell seletoed
 *
 * @param $
 * @param Wptm
 * @param selection
 */
function updateOptionValTable($, Wptm, selection) {
    if (tableFunction.checkObjPropertyNested(Wptm.style, 'table')) {
        var styleTable = Wptm.style.table;
        var wptm_element = window.wptm_element;
        var selector;
        $.each(styleTable, function (index, value) {
            switch (index) {
                case 'enable_filters':
                    selector = wptm_element.settingTable.find('.filters_menu');
                    if (value === 1 || value === '1') {
                        selector.parent().addClass('selected');
                    } else {
                        selector.parent().removeClass('selected');
                    }
                    break;
                case 'enable_pagination':
                    selector = wptm_element.settingTable.find('.pagination_menu');
                    if (value === 1 || value === '1') {
                        selector.parent().addClass('selected');
                    } else {
                        selector.parent().removeClass('selected');
                    }
                    break;
                case 'use_sortable':
                    selector = wptm_element.settingTable.find('.sort_menu');
                    if (value === 1 || value === '1') {
                        selector.parent().addClass('selected');
                    } else {
                        selector.parent().removeClass('selected');
                    }
                    break;
                case 'table_align':
                    if (value !== '') {
                        selector = wptm_element.settingTable.find('.align_menu').siblings('.sub-menu').find('li[name="' + value + '"]');
                        selector.siblings('li.selected').removeClass('selected');
                        selector.addClass('selected');
                    }
                    break;
                case 'col_types':
                    if (typeof table_function_data.selection[0] !== 'undefined') {
                        var first_column_selected = table_function_data.selection[0][1];
                        if (typeof value[first_column_selected] !== 'undefined') {
                            table_function_data.type_column_selected = value[first_column_selected];
                        }
                    }
                    break;
                default:
                    break;
            }
        });
    } else {

    }
}

/**
 * Update status item in cell_menu by cell seletoed
 *
 * @param $
 * @param Wptm
 * @param selection
 */
function updateOptionValCell($, Wptm, selection) {
    var colsStyle = Wptm.style.cols;
    var cellsStyle = Wptm.style.cells;
    var rowsStyle = Wptm.style.rows;
    var size_selection = table_function_data.selectionSize - 1;
    if (size_selection < 0) {//not cell selected
        return;
    }
    var endCell = [selection[size_selection][2], selection[size_selection][3]];
    var end_cell = selection[size_selection][2] + '!' + selection[size_selection][3];

    if (!tableFunction.checkObjPropertyNested(Wptm.style, 'cells')) {//fix when Wptm.style.cells not exist
        Wptm.style.cells = {};
    }

    window.table_function_data.selectOption = true;//if == true then not click function
    var cell_style = {};

    if (typeof colsStyle[selection[size_selection][3]] !== 'undefined') {
        cell_style = $.extend({}, colsStyle[selection[size_selection][3]][1]);
    }
    if (typeof rowsStyle[selection[size_selection][2]] !== 'undefined') {
        cell_style = $.extend({}, cell_style, rowsStyle[selection[size_selection][2]][1]);
    }

    if (tableFunction.checkObjPropertyNested(Wptm.style, 'cells', end_cell, 2)) {
        if ((Wptm.type === 'html' || selection[size_selection][2] === 0) && typeof cellsStyle[end_cell] !== 'undefined') {
            cell_style = $.extend({}, cell_style, cellsStyle[end_cell][2]);
        }
    } else {//fix when Wptm.style.cells[endCell] not exist
        tableFunction.getFillArray(selection, Wptm, {});
    }

    //tooltip
    var $tooltip_content = $('#tooltip_content');
    if ($tooltip_content.length > 0) {
        tableFunction.updateParamFromStyleObject(cell_style, 'tooltip_width', $('#tooltip_width'), 0);

        tinyMCE.EditorManager.execCommand('mceRemoveEditor', true, 'tooltip_content');
        tableFunction.updateParamFromStyleObject(cell_style, 'tooltip_content', $('#tooltip_content'), "");
        var contenNeedToset = $('#tooltip_content').val();

        var initTT = tinymce.extend({}, tinyMCEPreInit.mceInit['tooltip_content']);
        try {
            tinymce.init(initTT);
        } catch (e) {
        }

        //add tinymce to this
        tinyMCE.EditorManager.execCommand('mceAddEditor', true, 'tooltip_content');
        if (tinyMCE.EditorManager.get('tooltip_content') != null) {
            var ttEditor = tinyMCE.EditorManager.get('tooltip_content');
            if (ttEditor && ttEditor.getContainer()) {
                ttEditor.setContent(contenNeedToset);
            }
        }
    }

    tableFunction.updateParamFromStyleObjectSelectBox(cell_style, 'cell_font_family', wptm_element.primary_toolbars.find('#cell_font_family'), 'inherit');
    tableFunction.updateParamFromStyleObject(cell_style, 'cell_font_size', wptm_element.primary_toolbars.find('#cell_font_size'), 13);
    tableFunction.updateParamFromStyleObject(cell_style, 'cell_font_bold', wptm_element.primary_toolbars.find('#cell_format_bold'), false, function () {
        active_table_option(this);
    });

    tableFunction.updateParamFromStyleObject(cell_style, 'cell_font_underline', wptm_element.primary_toolbars.find('#cell_format_underlined'), false,
        function () {
            active_table_option(this);
        }
    );
    tableFunction.updateParamFromStyleObject(cell_style, 'cell_font_italic', wptm_element.primary_toolbars.find('#cell_format_italic'), false,
        function () {
            active_table_option(this);
        }
    );
    tableFunction.updateParamFromStyleObject(cell_style, 'cell_background_color', wptm_element.primary_toolbars.find('#cell_background_color'), '',
        function () {
            var color = cell_style.cell_background_color;
            this.wpColorPicker('color', color);
            this.parents('.wp-picker-container').find('.wp-color-result').css('color', color);
        }
    );
    tableFunction.updateParamFromStyleObject(cell_style, 'cell_font_color', wptm_element.primary_toolbars.find('#cell_font_color'), '',
        function () {
            var color = cell_style.cell_font_color;
            this.wpColorPicker('color', color);
            this.parents('.wp-picker-container').find('.wp-color-result').css('color', color);
        }
    );
    tableFunction.updateParamFromStyleObject(cell_style, 'cell_text_align', wptm_element.primary_toolbars.find('#cell_text_align'), 'left', function () {
        var value = typeof cell_style.cell_text_align === 'undefined' ? '' : cell_style.cell_text_align;

        wptm_element.primary_toolbars.find('a[name="format_align_left"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="format_align_center"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="format_align_right"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="format_align_justify"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="format_align_' + value + '"]').addClass('active');
    });
    tableFunction.updateParamFromStyleObject(cell_style, 'cell_vertical_align', wptm_element.primary_toolbars.find('#cell_vertical_align'), 'middle', function () {
        var value = typeof cell_style.cell_vertical_align === 'undefined' ? cell_style.cell_vertical_align = 'top' : cell_style.cell_vertical_align;

        wptm_element.primary_toolbars.find('a[name="vertical_align_bottom"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="vertical_align_middle"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="vertical_align_top"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="vertical_align_' + value + '"]').addClass('active');
    });
    tableFunction.updateParamFromStyleObject(cell_style, 'cell_type', wptm_element.primary_toolbars.find('#cell_type'), '', function () {
        var value = cell_style.cell_type;
        if (typeof value === 'undefined' || value === '' || value === null) {
            wptm_element.primary_toolbars.find('#cell_type').removeClass('active');
        } else {
            wptm_element.primary_toolbars.find('#cell_type').addClass('active');
        }
    });
    wptm_element.primary_toolbars.find('#cell_border').find('a').each(function () {
        $(this).removeClass('active');
    });

    var mergeCellRanger = {
        'col': selection[size_selection][1],
        'colspan': selection[size_selection][3] - selection[size_selection][1] + 1,
        'row': selection[size_selection][0],
        'rowspan': selection[size_selection][2] - selection[size_selection][0] + 1
    };
    if (Wptm.mergeCellsSetting.some(function (mergeCellsSetting) {
        return mergeCellsSetting.col === mergeCellRanger.col && mergeCellsSetting.row === mergeCellRanger.row;
    })) {
        wptm_element.primary_toolbars.find('#merge_cell').addClass('active');
    } else {
        wptm_element.primary_toolbars.find('#merge_cell').removeClass('active');
    }

    window.table_function_data.selectOption = false;
    //get size(height, width) end cells
    tableFunction.getSizeCells($, Wptm, endCell);
}


function active_table_option(that) {
    if (that.val() === true) {
        that.addClass('active');
    } else {
        that.removeClass('active');
    }
}

/**
 * Create custom select box
 *
 * @param $
 * @param select_function cell function when click select
 */
function custom_select_box ($, select_function) {
    $(this).on('click', function (e) {
        $('#mybootstrap').find('.wptm_select_box').each(function () {
            $(this).hide();
            $(this).siblings('.show').removeClass('show');
        });
        var position = $(this).position();

        if ($(this).hasClass('show')) {
            $(this).next().hide();
            $(this).removeClass('show');
            $(document).unbind('click.wptm_select_box');
            return;
        }

        var $that = $(this).addClass('show');
        var $select = $(this).next().css({top: position.top + 40, left: position.left, 'min-width': $that.outerWidth()}).show();

        $select.find('li').unbind('click').on('click', function (e) {
            $select.data('value', $(this).data('value')).change();
            $that.val($(this).data('value')).text($(this).text()).data('value', $(this).data('value')).change();

            if (typeof select_function !== 'undefined') {
                select_function.bind($(this).data('value'));
            }
            $('#mybootstrap').find('.wptm_select_box').hide();
        });

        $(document).bind('click.wptm_select_box', (e) => {
            if (!$(e.target).is($(this))) {
                $select.hide();
                $that.removeClass('show');
                $(document).unbind('click.wptm_select_box');
            }
        });
    });
}

export default {selectOption, loadSelection, updateOptionValTable}
