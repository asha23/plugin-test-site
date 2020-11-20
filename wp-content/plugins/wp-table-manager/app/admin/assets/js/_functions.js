import alternating from "./_alternating"
import wptmPreview from "./_wptm";
import {initHandsontable} from "./_initHandsontable";

var F_name = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
var M_name = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];
var l_name = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var D_name = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// set value for an html switch-button element from Style object
function updateSwitchButtonFromStyleObject(styleObj, prop, that, defaultValue, callback) {
    if (checkObjPropertyNested(styleObj, prop)) {
        defaultValue = styleObj[prop];
    }
    that.val(defaultValue == 1 ? 'yes' : 'no').prop("checked", defaultValue == 1);

    if (typeof callback !== 'undefined') {
        callback.call(that);
    }
}

// set value for an html input element from cellStyle object
function updateParamFromStyleObject(styleObj, prop, that, defaultValue, callback) {
    if (checkObjPropertyNested(styleObj, prop)) {
        that.val(styleObj[prop]);
    } else {
        that.val(defaultValue);
    }
    if (typeof callback !== 'undefined') {
        callback.call(that);
    }
}

// set value for an html input element from cellStyle object
function updateParamFromStyleObjectSelectBox(styleObj, prop, that, defaultValue, callback) {
    if (checkObjPropertyNested(styleObj, prop)) {
        defaultValue = styleObj[prop];
    }
    that.data('value', defaultValue);

    that.prev('.wptm_select_box_before').text(that.find('li[data-value="' + defaultValue + '"]').text()).data('value', defaultValue);
    if (typeof callback !== 'undefined') {
        callback.call(that);
    }
}

function combineChangedCellIntoRow(extendData) {
    if(changedData.length < 1) {
        changedData = [{row: extendData.row, cell: [{col: extendData.col, content: extendData.content}]}];
    } else {
        var newRow = true;
        for(var i = 0; i < changedData.length; i++) {
            var rowData = changedData[i];
            if(rowData.row === extendData.row) {
                var newCell = true;
                for(var j = 0; j < rowData.cell.length; j++) {
                    var cellData = rowData.cell[j];
                    if(cellData.col === extendData.col) {
                        cellData.content = extendData.content;
                        newCell = false;
                        break;
                    }
                }
                if(newCell) {
                    rowData.cell.push({col: extendData.col, content: extendData.content});
                }
                newRow = false;
                break;
            }
        }
        if(newRow) {
            changedData.push({row: extendData.row, cell: [{col: extendData.col, content: extendData.content}]});
        }
    }
}

// check for existence of nested object key
// example: var test = {level1:{level2:{level3:'level3'}} };
// checkObjPropertyNested(test, 'level1', 'level2', 'level3'); // true
function checkObjPropertyNested(obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
}

// check for existence of nested object key and check value not empty
// example: var test = {level1:{level2:{level3:'level3'}} };
// checkObjPropertyNestedNotEmpty(test, 'level1', 'level2', 'level3'); // true
function checkObjPropertyNestedNotEmpty(obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < args.length; i++) {
        if (!obj || !obj.hasOwnProperty(args[i]) || !obj[args[i]]) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
}

/**
 * calculater height for table when change height row
 *
 * @param topElement
 * @returns {number}
 */
function calculateTableHeight(topElement) {
    var top = topElement.outerHeight() + 33, paddingBottom;
    if (canInsert == 1) {
        paddingBottom = 30; //px
    } else {
        paddingBottom = 10; //px
    }

    var windownHeight = jquery(window).height();
    var height = windownHeight - top - paddingBottom;
    return height;
}
//convert aphabel to number when get col number
function convertStringToNumber (val) {
    var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;

    for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
        result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
    }

    return result;
}

/*print getSelect cell to element*/
function getSelectedVal(dataSelect, selectRange) {
    var valueRange = '';

    if (dataSelect[1] > 25) {
        valueRange += String.fromCharCode(97) + String.fromCharCode(97 + dataSelect[1] - 26);
    } else {
        valueRange += String.fromCharCode(97 + dataSelect[1]);
    }
    valueRange += dataSelect[0] + 1;

    valueRange += ':';


    if (dataSelect[3] > 25) {
        valueRange += String.fromCharCode(97) + String.fromCharCode(97 + dataSelect[3] - 26);
    } else {
        valueRange += String.fromCharCode(97 + dataSelect[3]);
    }
    valueRange += dataSelect[2] + 1;
    selectRange.val(valueRange);
}

/*time out auto save*/
var autosaveNotification;
var getSaveAjax;

function cleanHandsontable () {
    setTimeout(function () {
        jquery(Wptm.container).handsontable('getInstance').undoRedo.clear();
    }, 500);
}

/*saving table*/
function saveChanges(autosave, ajaxCallback) {
    var $ = window.jquery;

    if (!(window.Wptm.can.edit || (window.Wptm.can.editown && data.author === window.Wptm.author))) {
        return;
    }
    //check save calculate date
    if (window.table_function_data.check_value_data === false) {
        setTimeout(function () {
            $('#saveErrorTable').animate({'top': '+=75px', 'opacity': '1'}, 500).delay(2000).animate({
                'top': '-=75px',
                'opacity': '0'
            }, 1000);
        }, 1000);
        window.table_function_data.check_value_data = true;
        return;
    }

    if ((typeof autosave == 'undefined' && !enable_autosave) || autosave === false) {
        checkTimeOut = false;
        return;
    }
    if (!checkTimeOut) {
        clearTimeout(getSaveAjax);
    }

    checkTimeOut = false;

    var delay_time = enable_autosave ? 5000 : 0;

    if (autosave === true) {
        delay_time = 100;
    }

    getSaveAjax = setTimeout(function () {
        /*check have the change Alternate*/
        if (_.size(window.table_function_data.checkChangeAlternate) > 0) {
            window.Wptm.style.cells = $.extend({}, alternating.reAlternateColor());
        }

        var save_data;
        if (table_function_data.save_table_params.length > 0) {
            save_data = JSON.stringify(table_function_data.save_table_params);
        } else {
            save_data = JSON.stringify(saveData);
        }

        var jsonVar = {
            jform: {
                datas: save_data,
                style: JSON.stringify({'table': window.Wptm.style.table, 'cols': window.Wptm.style.cols, 'rows': window.Wptm.style.rows}),
                css: window.Wptm.css,
                params: (window.Wptm.type !== 'html') ? {"mergeSetting": JSON.stringify(window.Wptm.mergeCellsSetting), "headerOption": 1} : {
                    "mergeSetting": JSON.stringify(window.Wptm.mergeCellsSetting),
                    "hyperlink": JSON.stringify(window.Wptm.hyperlink),
                    "headerOption": window.Wptm.headerOption
                },
                count: {'countRows': $(window.Wptm.container).handsontable('countRows'), 'countCols': $(window.Wptm.container).handsontable('countCols')}
            },
            id: window.Wptm.id
        };

        window.Wptm.style = cleanStyle(window.Wptm.style, $(window.Wptm.container).handsontable('countRows'), $(window.Wptm.container).handsontable('countCols'));
        window.table_function_data.old_slection = window.table_function_data.selection;

        $.ajax({
            url: wptm_ajaxurl + "task=table.save",
            dataType: "json",
            type: "POST",
            data: jsonVar,
            beforeSend: function () {
                wptm_element.settingTable.find('.wptm_save_error').addClass('wptm_hiden');
                wptm_element.settingTable.find('.wptm_saving').html('<span>' + wptmText.SAVING + '</span>');
                wptm_element.settingTable.find('.wptm_saving').removeClass('wptm_hiden');
                window.table_function_data.firstRender = false;
            },
            success: function (datas) {
                if (datas.response === true) {
                    wptm_element.settingTable.find('.wptm_save_error').addClass('wptm_hiden');
                    wptm_element.settingTable.find('.wptm_saving').html('<span>' + wptmText.ALL_CHANGES_SAVED + '</span>');
                    setTimeout(function () {
                        wptm_element.settingTable.find('.wptm_saving').addClass('wptm_hiden');
                    }, 1500);

                    //empty data in saveData
                    if (table_function_data.save_table_params.length > 0) {
                        table_function_data.save_table_params = [];
                    } else {
                        saveData = [];
                    }
                    update_after_save(datas.datas);
                } else {
                    bootbox.alert(datas.response, wptmText.Ok);
                }
                if (typeof ajaxCallback == 'function') {
                    ajaxCallback(window.Wptm.id)
                }
                window.table_function_data.firstRender = true;
            },
            error: function (jqxhr, textStatus, error) {
                bootbox.alert(textStatus + " : " + error, wptmText.Ok);
            }
        });
        checkTimeOut = true;
    }, delay_time);
}

/**
 * convert cell data by column type
 *
 * @param position cell position
 * @param value    New value
 * @returns {string|boolean}
 */
function cell_type_to_column (position, value) {
    if (typeof Wptm.style.table.col_types[position[1]] !== 'undefined') {
        if (value === null) {
            value = '';
        }
        var length = value.length;
        var type_column = Wptm.style.table.col_types[position[1]];
        var date_string;
        switch (type_column) {
            case 'varchar':
                if (length > 255) {
                    return false;
                }
                break;
            case 'int':
                if (value === '') {
                    value = '0';
                }
                if (value.replace(/[ |0-9]+/g, '') !== '') {
                    return false;
                }
                break;
            case 'float':
                if (value === '') {
                    value = '0';
                }
                if (isNaN(parseFloat(value))) {
                    return false;
                }
                break;
            case 'date':
                if (value !== '') {
                    date_string = convertDate(["Y", "m", "d"], value.match(/[a-zA-Z0-9|+|-|\\]+/g), true);
                    if (date_string === false) {
                        return false;
                    }
                    if (date_string === '00/00/0000 0:00:00 ') {
                        return '0000-00-00';
                    }
                    date_string = new Date(date_string);
                    if (isNaN(date_string.getTime())) {
                        return false;
                    }
                    return date_string.getUTCFullYear() + '-' + ((date_string.getMonth() < 10) ? '0' + (date_string.getMonth() + 1) : date_string.getMonth() + 1) + '-' + date_string.getDate();
                } else {
                    return '0000-00-00';
                }
                break;
            case 'datetime':
                if (value !== '') {
                    date_string = convertDate(["Y", "m", "d", "h", "i", "s"], value.match(/[a-zA-Z0-9|+|-|\\]+/g), true);
                    if (date_string === false) {
                        return false;
                    }
                    if (date_string === '00/00/0000 0:00:00 ') {
                        return '0000-00-00 00:00:00';
                    }
                    date_string = new Date(date_string);
                    if (isNaN(date_string.getTime())) {
                        return false;
                    }
                    return date_string.getUTCFullYear() + '-' + ((date_string.getMonth() < 10) ? '0' + (date_string.getMonth() + 1) : date_string.getMonth() + 1) + '-' + date_string.getDate() + ' ' + date_string.getHours() + ':' + date_string.getMinutes() + ':' + date_string.getSeconds();
                } else {
                    return '0000-00-00 00:00:00';
                }
                break;
            case 'text':
                if (length > 65000) {
                    return false;
                }
                break;
        }
    }
    return true;
}

/**
 * Update some value in Wptm after saving ajax
 * @param datas
 */
function update_after_save(datas) {
    if (typeof datas.type !== 'undefined') {
        jquery.each(datas.type, function (i, v) {
            switch (i) {
                case "set_columns_types":
                    var selected = [];

                    jquery.each(window.table_function_data.old_slection, function (i, v) {
                        if (typeof Wptm.headerOption !== 'undefined') {
                            if (v[0] < parseInt(Wptm.headerOption)) {
                                v[0] = parseInt(Wptm.headerOption);
                            }
                        }
                        selected[i] = v;
                    });

                    change_value_cells(selected, v, 'col%key');
                    break;
                case "update_params":
                    var params = jquery.parseJSON(v);
                    if (typeof params.headerOption !== 'undefined') {
                        Wptm.headerOption = parseInt(params.headerOption);
                    } else {
                        Wptm.headerOption = 1;
                    }
                    try {
                        Wptm.mergeCellsSetting = jquery.parseJSON(params.mergeSetting);
                        if (Wptm.mergeCellsSetting == null) {
                            Wptm.mergeCellsSetting = [];
                        }
                    } catch (e) {
                        Wptm.mergeCellsSetting = [];
                    }
                    //not update header_data, it was updated
                    if (typeof params.header_data !== 'undefined') {
                        var old_header_data = Wptm.style.table.header_data;
                        delete params.header_data;
                    }
                    window.Wptm.style.table = jquery.extend({}, params);
                    window.Wptm.style.table.header_data = old_header_data;
                    break;
            }
        });

        if (typeof table_function_data.fetch_data !== 'undefined') {
            wptmPreview.fetchSpreadsheet(table_function_data.fetch_data);
        }
    }
}

/**
 * change cells value when add function in toolbar
 *
 * @param selection
 * @param values
 * @param keyColum
 */
function change_value_cells(selection, values, keyColum) {
    table_function_data.data_argument = [];
    var i, j, jj, value;
    if (selection === null) {
        selection = table_function_data.selection;
    }

    for (jj = 0; jj < table_function_data.selectionSize; jj++) {
        for (i = selection[jj][0]; i <= selection[jj][2]; i++) {
            for (j = selection[jj][1]; j <= selection[jj][3]; j++) {
                if (Array.isArray(values)) {
                    value = values[i][keyColum.replace('%key', j)];
                    table_function_data.data_argument.push([i, j, value, 'wptm_change_value_after_set_columns_types']);
                } else {
                    value = values;
                    table_function_data.data_argument.push([i, j, value]);
                }
                Wptm.datas[i][j] = value;
            }
        }
    }

    if (table_function_data.changeTheme) {
        wptmPreview.updatepreview(Wptm.id);
    }
    if (table_function_data.data_argument.length < 5) {//if cells number < 5 then setDataAtCell() is more performance
        window.jquery(window.Wptm.container).data('handsontable').setDataAtCell(table_function_data.data_argument);
    } else {
        window.jquery(window.Wptm.container).data('handsontable').loadData(Wptm.datas);
    }
}

//function in table DB
function loadTableContructor() {
    var $ = window.jquery;
    var id_table = $('li.wptmtable.active').data('id-table');
    var table_type = $('li.wptmtable.active').data('table-type');
    var $mainTable = $("#mainTable");
    $mainTable.find(".tabDataSource").hide();
    $mainTable.find(".groupTable" + id_table).show();
    if (table_type == 'mysql') {
        if ($("#tabDataSource_" + id_table).length == 0) {
            var firstTab = $mainTable.find('li').get(0);
            $(firstTab).after('<li><a data-toggle="tab" id="tabDataSource_' + id_table + '" class="tabDataSource groupTable' + id_table + '" href="#dataSource_' + id_table + '">Data Source</a></li>');
            $('#mainTabContent.tab-content').append('<div class="db_table tab-pane" id="dataSource_' + id_table + '">' +
                '<div class="dataSourceContainer" style="padding-top:10px" ></div></div>');

            $.ajax({
                url: wptm_ajaxurl + "view=dbtable&id_table=" + id_table,
                type: "GET"
            }).done(function (data) {
                $("#dataSource_" + id_table).html(data);
            });
        }
    }
    //do nothing
}

// Build column selection for default sort parameter
function default_sortable(tableData) {
    var $ = window.jquery;
    if (tableData && typeof tableData[0] !== 'undefined') {
        var $jform_default_sortable = $('#content_popup_hide').find('.select_columns');
        var $jform_reponsive_table = $('#content_popup_hide').find('#responsive_table table tbody');
        var $jform_column_type_table = $('#content_popup_hide').find('#column_type_table table tbody');
        $jform_default_sortable.contents('li').remove();
        $jform_reponsive_table.html('');
        $jform_column_type_table.html('');
        var html = '';
        var html2 = '';
        var column_type_html = '';
        var ii = 0;

        var responsive_priority = '';
        for (var number = 0; number < (window.Wptm.max_Col > 12 ? window.Wptm.max_Col : 12); number++) {
            responsive_priority += '<li data-value="' + number + '">' + number + '</li>\n';
        }

        $.each(tableData[0], function (i, e) {
            var table_headers = jQuery(Wptm.container).handsontable('getColHeader');
            var header = table_headers[i];
            html += '<li data-value="' + ii + '">' + header + '</li>';

            html2 += '<tr data-col="' + ii + '">';
            html2 += '<td><label>' + header + '</label></td>';
            html2 += '<td><span class="responsive_priority popup_select mb-0 wptm_select_box_before"></span><ul class="wptm_select_box">\n'
                + responsive_priority +
                '</ul></td>';
            html2 += '</tr>';

            column_type_html += '<tr data-col="' + ii + '">';
            column_type_html += '<td><label>' + header + '</label></td>';
            column_type_html += '<td><span class="column_type popup_select mb-0 wptm_select_box_before"></span><ul class="wptm_select_box">\n' +
                '                        <li data-value="varchar">'+wptmContext.column_type_varchar+'</li>\n' +
                '                        <li data-value="int">'+wptmContext.column_type_int+'</li>\n' +
                '                        <li data-value="float">'+wptmContext.column_type_float+'</li>\n' +
                '                        <li data-value="date">'+wptmContext.column_type_date+'</li>\n' +
                '                        <li data-value="datetime">'+wptmContext.column_type_datetime+'</li>\n' +
                '                        <li data-value="text">'+wptmContext.column_type_text+'</li>\n' +
                '                    </ul></td>';
            column_type_html += '</tr>';
            ii++;
        });
        $(html).appendTo($jform_default_sortable);
        $jform_default_sortable.trigger("liszt:updated");
        $(html2).appendTo($jform_reponsive_table);
        $jform_reponsive_table.trigger("liszt:updated");
        $(column_type_html).appendTo($jform_column_type_table);
        $jform_column_type_table.trigger("liszt:updated");
    }
}

/*render data table, cells, rows, cols*/
function cleanStyle(style, nbRows, nbCols) {
    for (var col in style.cols) {
        if (!style.cols[col] || style.cols[col][0] >= nbCols) {
            delete style.cols[col];
        }
    }
    for (var row in style.rows) {
        if (!style.rows[row] || style.rows[row][0] >= nbRows) {
            delete style.rows[row];
        }
    }
    for (var cell in style.cells) {
        if (style.cells[cell][0] >= nbRows || style.cells[cell][1] >= nbCols) {
            delete style.cells[cell];
        }
    }
    var propertiesPos, cells;
    for (var obj in style) {
        if (obj == 'table') {
            continue;
        }
        for (cells in style[obj]) {
            propertiesPos = style[obj][cells].length - 1;
            for (var property in style[obj][cells][propertiesPos]) {
                if (style[obj][cells][propertiesPos][property] === null) {
                    delete style[obj][cells][propertiesPos][property];
                }
            }
        }
    }
    return style;
}

/*change text table name, chart name*/
function setText($name_edit, press_enter_selector, obj) {
    unbindall();
    /*select rename table*/
    var oldTitle = $name_edit.text();
    var wptm_name_edit = document.querySelector('.rename.wptm_name_edit');
    $name_edit.attr('contentEditable', true).focus();

    $name_edit.not('.editable').bind('click.mm', hstop);  //let's click on the editable object
    jquery(press_enter_selector).bind('keydown.mm', enterKey); //let's press enter to validate new title'
    jquery('*').not('.wptm_name_edit').bind('click.mm', houtside);

    // $name_edit.addClass('editable');
    if (obj.selected) {
        $name_edit.trigger('click.mm');
    }

    function unbindall(reselectCell) {
        $name_edit.not('.editable').unbind('click.mm', hstop);  //let's click on the editable object
        jquery(press_enter_selector).unbind('keydown.mm', enterKey); //let's press enter to validate new title'
        jquery('*').not('.wptm_name_edit').unbind('click.mm', houtside);
        $name_edit.attr('contentEditable', false);

        if (reselectCell && typeof table_function_data.selection[0][1] !== 'undefined') {//reselect cell after enter/esc name table
            var selection = window.jquery(window.Wptm.container).handsontable('getSelected');
            window.jquery(Wptm.container).handsontable("selectCell", selection[0][0], selection[0][1], selection[0][0], selection[0][1]);
        }
    }

    //Validation
    function hstop(e) {
        event.stopPropagation();
        $name_edit.addClass('editable');
        if (wptm_name_edit !== null) {
            wptm_name_edit.focus();
        }
        return false;
    }

    function enterKey(e) {
        e.stopImmediatePropagation();
        if (e.which == 13) {
            e.preventDefault();
            $name_edit.removeClass('editable');
            updateTitle($name_edit.text(), jquery);
            unbindall(true);
        }
        if (e.which == 27) {
            e.preventDefault();
            $name_edit.text(oldTitle);
            $name_edit.removeClass('editable');
            unbindall(true);
        }
        $name_edit.removeClass('rename');
    }

    function houtside(e) {
        if ($name_edit.hasClass('editable') && !$name_edit.hasClass('rename')) {
            $name_edit.removeClass('editable');
            updateTitle($name_edit.text(), jquery);
            unbindall(true);
            $name_edit.removeClass('rename');
        }
        return false;
    }

    function updateTitle(title, $) {
        if (!(Wptm.can.edit || (Wptm.can.editown && data.author === Wptm.author))) {
            return false;
        }

        if (oldTitle === title) {
            return false;
        }

        if (title.trim() !== '' && typeof obj.url !== 'undefined') {
            obj.url += title;
            $.ajax({
                url: obj.url,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    wptm_element.settingTable.find('.wptm_saving div').removeClass('wptm_hiden');
                },
                success: function (datas) {
                    if (datas.response === true) {
                        $name_edit.text(title);
                        if ($('#pwrapper').hasClass('wptm_hiden')) {
                            $('#list_chart').find('.chart-menu.active a').text(title);
                        } else {
                            $('#list_chart').find('.current_table a').text(title);
                        }
                        if (typeof obj.action !== 'undefined') {
                            obj.action(title);
                        }
                        wptm_element.settingTable.find('.wptm_saving').removeClass('wptm_hiden');
                        setTimeout(function () {
                            wptm_element.settingTable.find('.wptm_saving').addClass('wptm_hiden');

                            localStorage.setItem('wptm_change_table_name', JSON.stringify({'id': Wptm.id,'title': title, 'modified_time': datas.datas.modified_time}));
                        }, 1500);
                    } else {
                        $name_edit.text(oldTitle);
                        bootbox.alert(datas.response, wptmText.Ok);
                    }
                },
                error: function (jqxhr, textStatus, error) {
                    $name_edit.text(oldTitle);
                    bootbox.alert(textStatus, wptmText.Ok);
                }
            });
        } else {
            $name_edit.text(oldTitle);
            return false;
        }
        $name_edit.css('white-space', 'normal');
        setTimeout(function () {
            $name_edit.css('white-space', '');
        }, 200);
    }
};

//https://gist.github.com/ncr/399624
jQuery.fn.single_double_click = function (single_click_callback, double_click_callback, timeout) {
    return this.each(function () {
        var clicks = 0, self = this;
        jQuery(this).click(function (event) {
            clicks++;
            if (clicks == 1) {
                setTimeout(function () {
                    if (clicks == 1) {
                        single_click_callback.call(self, event);
                    } else {
                        double_click_callback.call(self, event);
                    }
                    clicks = 0;
                }, timeout || 300);
            }
        });
    });
}
//add, change style for column, rows, cells
function getFillArray(selection, Wptm, value) {
    var i, ij, ik;
    if (table_function_data.option_selected_mysql !== '' && typeof table_function_data.option_selected_mysql !== 'undefined') {
        for (i = 0; i < table_function_data.selectionSize; i++) {
            for (ik = selection[i][1]; ik <= selection[i][3]; ik++) {
                Wptm.style.cols = fillArray(Wptm.style.cols, value, ik);
            }
        }
    } else {
        for (i = 0; i < table_function_data.selectionSize; i++) {
            for (ij = selection[i][0]; ij <= selection[i][2]; ij++) {
                for (ik = selection[i][1]; ik <= selection[i][3]; ik++) {
                    Wptm.style.cells = fillArray(Wptm.style.cells, value, ij, ik);
                }
            }
        }
    }

    var action = Array.prototype.slice.call(arguments, 3);

    if (action.length === 0) {
        action = 'style';
    } else {
        action = action[0];
    }

    if (saveData.length > 0) {
        var old_saveData = saveData[saveData.length - 1];
        var checkRangeStyleExists = false;
        if (action === old_saveData.action) {
            for (i = 0; i < table_function_data.selectionSize; i++) {
                if (old_saveData.selection[i][0] == selection[i][0] &&
                    old_saveData.selection[i][1] == selection[i][1] &&
                    old_saveData.selection[i][2] == selection[i][2] &&
                    old_saveData.selection[i][3] == selection[i][3]) {
                    checkRangeStyleExists = true;
                }
            }
        }

        if (checkRangeStyleExists) {
            old_saveData.style = window.jquery.extend(old_saveData.style, value);
        } else {
            if (_.size(value) > 0) {
                saveData.push({action: action, selection: selection, style: value});
            }
        }
    } else {
        if (_.size(value) > 0) {
            saveData.push({action: action, selection: selection, style: value});
        }
    }
}
//update new value for array
function fillArray(array, val, val1, val2) {
    if (typeof (val2) === 'undefined') {
        if (typeof (val1) !== 'undefined') {
            if (typeof (array[val1]) !== 'undefined') {
                array[val1][1] = window.jquery.extend(array[val1][1], val);
            } else {
                array[val1] = [val1, {}];
                array[val1][1] = val;
            }
        } else {
            array = window.jquery.extend(array, val);
        }
    } else {
        if (typeof (array[val1 + "!" + val2]) !== 'undefined') {
            array[val1 + "!" + val2][2] = window.jquery.extend(array[val1 + "!" + val2][2], val);
        } else {
            array[val1 + "!" + val2] = [val1, val2, {}];
            array[val1 + "!" + val2][2] = val;
        }
    }
    return array;
}

function toggleArray(array, val, val1, val2) {
    if (typeof (val2) === 'undefined') {
        if (typeof (array[val1]) !== 'undefined') {
            if (typeof (val) === 'object') {
                for (var key in val) {
                    if (typeof (array[val1][1][key] !== 'undefined')) {
                        array[val1][1][key] = !array[val1][1][key];
                    } else {
                        array[val1][1][key] = val[key];
                    }
                }
            } else {
                array[val1][1] = jQuery.extend(array[val1][1], val);
            }
        } else {
            array[val1] = [val1, {}];
            array[val1][1] = val;
        }
    } else {
        if (typeof (array[val1 + "!" + val2]) !== 'undefined') {
            if (typeof (val) === 'object') {
                for (var key in val) {
                    if (typeof (array[val1 + "!" + val2][2][key] !== 'undefined')) {
                        array[val1 + "!" + val2][2][key] = !array[val1 + "!" + val2][2][key];
                    } else {
                        array[val1 + "!" + val2][2][key] = val[key];
                    }
                }
            } else {
                array[val1 + "!" + val2][2] = jQuery.extend(array[val1 + "!" + val2][2], val);
            }
        } else {
            array[val1 + "!" + val2] = [val1, val2, {}];
            array[val1 + "!" + val2][2] = val;
        }
    }

    return array;
}

//Code from http://stackoverflow.com/questions/9905533/convert-excel-column-alphabet-e-g-aa-to-number-e-g-25
var convertAlpha = function (val) {
    var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;

    for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
        result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
    }

    return result;
};

function wptm_clone(v) {
    return JSON.parse(JSON.stringify(v));
}
//convert value of calculation by format selected
function formatSymbols(resultCalc, decimal_count, thousand_symbols, decimal_symbols, symbol_position, value_unit) {
    decimal_count = parseInt(decimal_count);
    if (typeof resultCalc === 'undefined') {
        return;
    }
    var negative = resultCalc < 0 ? "-" : "",
        i = parseInt(resultCalc = Math.abs(+resultCalc || 0).toFixed(decimal_count), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;

    resultCalc = (j ? i.substr(0, j) + thousand_symbols : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand_symbols) + (decimal_count ? decimal_symbols + Math.abs(resultCalc - i).toFixed(decimal_count).slice(2) : "");

    resultCalc = Number(symbol_position) === 0
        ? ((negative === "-") ? negative + value_unit : value_unit) + resultCalc
        : negative + resultCalc + ' ' + value_unit;

    return resultCalc;
};

// Convert date in date_format to the format: m/d/Y /a/t g:i A
// example: number -> array(2016,03,26)
function convertDate(date_format, number, timezone) {
    var date_array = [];
    number = (!!number) ? number : [];
    if (date_format.length !== number.length) {
        return false;
    }
    if (typeof timezone === 'undefined') {
        timezone = true;
    }
    for (var n = 0; n < date_format.length; n++) {
        number[n] = (!!number[n]) ? number[n] : '';
        if (date_format[n] === 'd' || date_format[n] === 'j') {
            date_array[2] = (number[n] !== '') ? number[n] : '';
        } else if (date_format[n] === 'S' || date_format[n] === 'jS' || date_format[n] === 'dS') {
            date_array[2] = number[n].match(/[0-9]+/g);
        } else if (date_format[n] === 'm' || date_format[n] === 'n') {
            date_array[1] = number[n];
        } else if (date_format[n] === 'F') {
            date_array[1] = F_name.indexOf(number[n].toLowerCase()) + 1;
        } else if (date_format[n] === 'M') {
            date_array[1] = M_name.indexOf(number[n].toLowerCase()) + 1;
        } else if (date_format[n].toLowerCase() === 'y') {
            date_array[3] = number[n];
        } else if (date_format[n].toLowerCase() === 'g' || date_format[n].toLowerCase() === 'h') {
            date_array[4] = Number(number[n]);
        } else if (date_format[n].toLowerCase() === 'ga' || date_format[n].toLowerCase() === 'ha') {
            date_array[4] = number[n].match(/[0-9]+/g);
            date_array[4] = (number[n].toLowerCase().match(/[a-z]+/g) === 'am') ? date_array[4] : date_array[4] + 12;
        } else if (date_format[n].toLowerCase() === 'a') {
            date_array[7] = number[n];
        } else if (date_format[n].toLowerCase() === 'i' || date_format[n].toLowerCase() === 'ia') {
            date_array[5] = number[n].match(/[0-9]+/g);
        } else if (date_format[n].toLowerCase() === 's' || date_format[n].toLowerCase() === 'sa') {
            date_array[6] = number[n].match(/[0-9]+/g);
        } else if (date_format[n] === 'T') {
            date_array[8] = number[n];
        } else if (date_format[n] === 'r') {
            if (M_name.indexOf(number[2].toLowerCase()) + 1 > 0) {
                date_array[1] = M_name.indexOf(number[2].toLowerCase()) + 1;
            } else {
                date_array[1] = F_name.indexOf(number[2].toLowerCase()) + 1;
            }
            return date_array[1] + '/' + number[1] + '/' + number[3] + ' ' + number[4] + ':' + number[5] + ':' + number[6] + ' ' + number[7];
        }
    }
    date_array[4] = (!!date_array[4]) ? date_array[4] : 0;
    date_array[5] = (!!date_array[5]) ? date_array[5] : '00';
    date_array[6] = (!!date_array[6]) ? date_array[6] : '00';
    date_array[7] = (!!date_array[7]) ? ' ' + date_array[7] : '';
    date_array[8] = (!!date_array[8]) ? ' ' + date_array[8] : '';
    date_array[8] = (timezone === true) ? ' ' + date_array[8] : '';

    if (date_array[7] !== 'undefined' && date_array[7] !== '' && date_array[4] > 12) {
        date_array[4] = date_array[4] - 12;
    }
    if (date_array[1] === 0 || date_array[2] > 31 || date_array[1] > 12) {
        return false;
    }
    return date_array[1] + '/' + date_array[2] + '/' + date_array[3] + ' ' + date_array[4] + ':' + date_array[5] + ':' + date_array[6] + date_array[7] + date_array[8];
}
//create string_currency_symbols, replace_unit, text_replace_unit, date_format RegExp string
function createRegExpFormat(table_function_data, currency_symbol, date_formats) {
    if (currency_symbol !== false) {
        table_function_data.string_currency_symbols = currency_symbol.replace(/ /g, "");
        // create string reg currency symbols
        table_function_data.replace_unit = new RegExp('[' + table_function_data.string_currency_symbols.replace(/,/g, "|") + ']', "g");

        // create string reg have not currency symbols
        table_function_data.text_replace_unit = '[^a-zA-Z|' + table_function_data.string_currency_symbols.replace(/,/g, "|^") + ']';
        table_function_data.text_replace_unit = new RegExp(table_function_data.text_replace_unit, "g");
        table_function_data.text_replace_unit_function = new RegExp('[^ |' + table_function_data.string_currency_symbols.replace(/,/g, "|^") + ']', "g");
    }
    if (date_formats !== false) {
        table_function_data.date_format = date_formats.match(/[a-zA-Z|\\]+/g);
    }
    return table_function_data;
}

// check column is int
function replaceCell($, cellsData, currency_symbol) {
    var data1 = [];
    var i = 0;
    var data2 = -1;
    var v1 = '';
    currency_symbol = new RegExp('[0-9|\.|\,|\\-|' + currency_symbol + ']', "g");

    $.each(cellsData, function (k, v) {
        v = v.toString();
        v1 = v.replace(currency_symbol, '');
        if (v1 === '') {
            data1[i] = k;
            i++;
        } else if (v !== '') {
            data2 = k;
        }
    });
    var data = [];
    data[1] = '';
    data[0] = data1;
    if (data2 !== -1) {
        data[1] = data2;
    }
    return data;
}
//get size of cell selected when open change height, row popup
function getSizeCells($, Wptm, cells) {
    if (Wptm.type === 'mysql') {
        updateParamFromStyleObject(Wptm.style.rows[0][1], 'height', $('#cell_row_height'), '30');
    } else {
        if (checkObjPropertyNested(Wptm.style.rows, cells[0], 1, 'height')) {
            $('#cell_row_height').val(Wptm.style.rows[cells[0]][1].height);
        }
    }

    if (checkObjPropertyNested(Wptm.style.cols, cells[1], 1, 'width')) {
        $('#cell_col_width').val(Wptm.style.cols[cells[1]][1].width);
    }
    if (checkObjPropertyNested(Wptm.style.table, 'allRowHeight')) {
        $('#all_cell_row_height').val(Wptm.style.table.allRowHeight);
    }
}

function pullDims(Wptm, $) {
    var args = Array.prototype.slice.call(arguments, 1);
    var cols = [];
    var rows = [];
    var row, lengthRows, lengthCols, col;

    // get count of Wptm.style.rows
    if (typeof Wptm.style.rows.length !== 'undefined') {
        lengthRows = Wptm.style.rows.length;
    } else {
        lengthRows = Object.keys(Wptm.style.rows).length;
    }

    for (row = 0; row < lengthRows; row++) {
        if (checkObjPropertyNested(Wptm.style.rows[row], 1, 'height')) {
            rows[row] = Wptm.style.rows[row][1].height;
        } else if (Wptm.type === 'mysql' && typeof Wptm.style.table.allRowHeight !== 'undefined' && Wptm.style.table.allRowHeight !== '') {
            rows[row] = Wptm.style.table.allRowHeight;
        } else {
            rows[row] = null;
        }
    }
    // get count of Wptm.style.cols

    if (typeof Wptm.style.cols.length !== 'undefined') {
        lengthCols = Wptm.style.cols.length;
    } else {
        lengthCols = Object.keys(Wptm.style.cols).length;
    }

    for (col = 0; col < lengthCols; col++) {
        if (checkObjPropertyNested(Wptm.style.cols[col], 1, 'width')) {
            cols[col] = Wptm.style.cols[col][1].width;
        } else {
            cols[col] = null;
        }
    }
    Wptm.updateSettings.colWidths = $.extend([], cols);
    Wptm.updateSettings.rowHeights = $.extend([], rows);

    if (typeof args[1] === 'undefined' || args[1] === true) {
        delete Wptm.updateSettings.colWidths;
        delete Wptm.updateSettings.manualRowResize;
        Wptm.container.handsontable('updateSettings', {colWidths: cols});
        Wptm.container.handsontable('updateSettings', {'manualRowResize': rows});
    }
}
//add row height, col width for Wptm.style
function pushDims($, Wptm) {
    //get value height rows
    var rows = $(Wptm.container).handsontable('countRows');
    var i = 0;
    var value = 0;
    for (i = 0; i < rows; i++) {
        value = $(Wptm.container).handsontable('getRowHeight', i);
        if (Wptm.type === 'html') {
            if (!value || value === 0) {
                if (typeof (Wptm.style.rows[i]) !== 'undefined' && typeof (Wptm.style.rows[i][1].height) !== 'undefined') {
                    value = parseInt(Wptm.style.rows[i][1].height);
                }
                if (value === null) {
                    value = 22;
                }
            }
        } else { //type mysql
            if (checkObjPropertyNestedNotEmpty(Wptm.style.rows[i], 1, 'height')) { //Row height is set
                value = parseInt(Wptm.style.rows[i][1].height);
            } else {
                value = null; //if aviation height is set then height === null
            }
        }

        Wptm.style.rows = fillArray(Wptm.style.rows, {height: parseInt(value)}, i);
        value = 0;
    }
    //get value width columns
    var cols = $(Wptm.container).handsontable('countCols');
    Wptm.max_Col = cols;
    Wptm.max_row = rows;

    Wptm.style.table.width = 0;
    var valueCols = 0;
    for (i = 0; i < cols; i++) {
        valueCols = $('#tableContainer').handsontable('getColWidth', i);
        if (!valueCols || valueCols === 0) {
            if (typeof (Wptm.style.cols[i]) !== 'undefined' && Wptm.style.cols[i] !== null && (typeof (Wptm.style.cols[i][1].width) !== 'undefined')) {
                valueCols = parseInt(Wptm.style.cols[i][1].width);
            } else {
                valueCols = null;
            }
        }
        if (!valueCols || valueCols === 0) {
            valueCols = 100;
        }

        Wptm.style.cols = fillArray(Wptm.style.cols, {width: parseInt(valueCols)}, i);

        Wptm.style.table.width += parseInt(valueCols);
        valueCols = 0;
    }
}
//add res priority of columns to set resposive priority popup
function responsive_col(Wptm) {
    var col = this.val();
    if (typeof (Wptm.style.cols) !== 'undefined' && typeof (Wptm.style.cols[col]) !== 'undefined' && typeof (Wptm.style.cols[col][1]) !== 'undefined' && typeof (Wptm.style.cols[col][1].res_priority) !== 'undefined') {
        var res_priority = Wptm.style.cols[col][1].res_priority;

        this.siblings('#responsive_priority').val(res_priority);
    } else {

        this.siblings('#responsive_priority').val(0);
    }
    this.siblings('#responsive_priority').trigger('liszt:updated');
}

function loading(e) {
    e.addClass('dploadingcontainer');
    e.append('<div class="dploading"></div>');
}

function rloading(e) {
    e.removeClass('dploadingcontainer');
    e.find('div.dploading').remove();
}
//add custom css for element
function parseCss($) {
    var parser = new (less.Parser);
    var content = '#mainTabContent .handsontable .ht_master .wtHider .wtSpreader .htCore tbody {' + $('#jform_css').val() + '}';
    content += '.reset {background-color: rgb(238, 238, 238);border-bottom-color: rgb(204, 204, 204);border-bottom-style: solid;border-bottom-width: 1px;border-collapse: collapse;border-left-color: rgb(204, 204, 204);border-left-style: solid;border-left-width: 1px;border-right-color: rgb(204, 204, 204);border-right-style: solid;border-right-width: 1px;border-top-color: rgb(204, 204, 204);border-top-style: solid;border-top-width: 1px;box-sizing: content-box;color: rgb(34, 34, 34);display: table-cell;empty-cells: show;font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size: 13px;font-weight: normal;line-height: 21px;outline-width: 0px;overflow-x: hidden;overflow-y: hidden;padding-bottom: 0px;padding-left: 4px;padding-right: 4px;padding-top: 0px;text-align: center;vertical-align: top;white-space: nowrap;position: relative;}';
    content += '#mainTabContent .handsontable .ht_master .wtHider .wtSpreader .htCore tbody tr th {.reset() !important;}'
    parser.parse(content, function (err, tree) {
        if (err) {
            //Here we can throw the erro to the user
            return false;
        } else {
            Wptm.css = $('#jform_css').val();
            if ($('#headCss').length === 0) {
                $('head').append('<style id="headCss"></style>');
            }
            $('#headCss').text(tree.toCSS());
            return true;
        }
    });
}

function getCellData(cellPos) {
    var pos = cellPos.split(":");
    var value = Wptm.container.handsontable('getDataAtCell', parseInt(pos[0]), parseInt(pos[1]));

    return value;
}
//replace string by decimal_symbol value and thousand_symbol value in calculation cell
function stringReplace(arr, unit) {
    var thousand_symbol = (!Wptm.style.table.thousand_symbol) ? default_value.thousand_symbol : Wptm.style.table.thousand_symbol;
    var decimal_symbol = (!Wptm.style.table.decimal_symbol) ? default_value.decimal_symbol : Wptm.style.table.decimal_symbol;
    if (typeof arr === 'number') {
        return arr;
    }
    var thousand_re = new RegExp('[' + thousand_symbol + ']', "g");
    // var thousand_re = new RegExp(thousand_symbol,"g");
    if (typeof arr !== 'undefined' && arr !== '' && arr !== null) {
        if (unit === true) {
            if (typeof arr !== 'string') {
                arr = arr.toString();
            }
            arr = arr.replace(table_function_data.text_replace_unit, "");
        } else {
            arr = arr.replace(table_function_data.replace_unit, "");
            arr = arr.replace(thousand_re, "");
            // arr = (thousand_symbol === ',') ? arr.replace(/,/g, "") : (thousand_symbol === '.' ? arr.replace(/\./g, "") : arr);
            arr = (decimal_symbol === ',') ? arr.replace(/,/g, ".") : arr;
        }
    } else {
        arr = '';
    }
    return arr;
}
//Toggle between the charts and the table
function showChartOrTable(showChart, $chart) {
    if (showChart) {//show chart
        jquery('#wptm_chart').removeClass('wptm_hiden');
        jquery('#pwrapper').addClass('wptm_hiden');
        $chart.trigger('click');
        jquery('#list_chart').find('.current_table').unbind('click').on('click', showChartOrTable.bind(this, false));
    } else {//show table
        if (jquery('#inserttable').length > 0) {
            Wptm.chart_active = 0;
            jquery('#inserttable').removeClass("no_click").data('type', 'table').attr('data-type', 'table').text(insert_table);
        }
        jquery('#wptm_chart').addClass('wptm_hiden');
        jquery('#pwrapper').removeClass('wptm_hiden');
        Wptm.container.handsontable('render');
    }
    wptm_element.primary_toolbars.find('.menu_loading').closest('li').removeClass('menu_loading');
    wptm_element.settingTable.find('.ajax_loading').removeClass('loadding').addClass('wptm_hiden');
}

function ripple_button(that) {
    that.find(".wptm_ripple").click(function (e) {
        // Remove any old one
        jquery(".ripple").remove();

        // Setup
        var posX = jquery(this).offset().left,
            posY = jquery(this).offset().top,
            buttonWidth = jquery(this).width(),
            buttonHeight = jquery(this).height();

        // Add the element
        jquery(this).prepend("<span class='ripple'></span>");

        // Make it round!
        if (buttonWidth >= buttonHeight) {
            buttonHeight = buttonWidth;
        } else {
            buttonWidth = buttonHeight;
        }

        // Get the center of the element
        var x = e.pageX - posX - buttonWidth / 2;
        var y = e.pageY - posY - buttonHeight / 2;


        // Add the ripples CSS and start the animation
        jquery(".ripple").css({
            width: buttonWidth,
            height: buttonHeight,
            top: y + 'px',
            left: x + 'px'
        }).addClass("rippleEffect");
    });
}

function isSameArray(array1, array2) {
    return array1.length === array2.length && array1.every(function (element, index) {
        return element === array2[index];
    });
}
//mer rows, columns style to cells style
function mergeCollsRowsstyleToCells() {
    var style = jquery.extend({}, window.Wptm.style);
    jquery.each(style.cols, function (col, cValue) {
        jquery.each(style.rows, function (row, rValue) {
            var styleCell = {};

            if (typeof (window.Wptm.style.cells[row + '!' + col]) === 'undefined') {
                window.Wptm.style.cells[row + '!' + col] = [row, col, {}];
            }
            if (typeof (style.rows[row]) !== 'undefined' && style.cols[col] !== null && Object.keys(style.rows[row][1]).length !== 0) {
                styleCell =  jquery.extend({}, styleCell, rValue[1]);
            }
            if (typeof (style.cols[col]) !== 'undefined' && style.cols[col] !== null && Object.keys(style.cols[col][1]).length !== 0) {
                styleCell =  jquery.extend({}, styleCell, cValue[1]);
            }
            window.Wptm.style.cells[row + '!' + col][2] = jquery.extend({}, styleCell, window.Wptm.style.cells[row + '!' + col][2]);
        });
    });
}

export default {
    setText,
    updateSwitchButtonFromStyleObject,
    updateParamFromStyleObject,
    updateParamFromStyleObjectSelectBox,
    checkObjPropertyNested,
    calculateTableHeight,
    convertStringToNumber,
    getSelectedVal,
    checkObjPropertyNestedNotEmpty,
    autosaveNotification,
    cleanHandsontable,
    saveChanges,
    cell_type_to_column,
    change_value_cells,
    default_sortable,
    convertAlpha,
    convertDate,
    formatSymbols,
    getSizeCells,
    pullDims,
    pushDims,
    getFillArray,
    fillArray,
    responsive_col,
    createRegExpFormat,
    replaceCell,
    loading,
    rloading,
    wptm_clone,
    parseCss,
    getCellData,
    stringReplace,
    showChartOrTable,
    ripple_button,
    combineChangedCellIntoRow,
    isSameArray,
    mergeCollsRowsstyleToCells
}
