import alternating from "./_alternating";
import tableFunction from "./_functions";
import selectOption from "./_toolbarOptions"

//change default theme to table, get ajax
function change_theme(ret, id, cellsData) {
    var $ = window.jquery;

    bootbox.confirm(wptmText.WARNING_CHANGE_THEME, wptmText.Cancel, wptmText.Ok, function (result) {
        if (result) {
            $.ajax({
                url: wptm_ajaxurl + "view=style&format=json&id=" + id +"&id-table=" + Wptm.id,
                type: 'POST',
                dataType: 'json',
            }).done(function (data) {
                if (typeof (data) === 'object') {
                    saveData=[];
                    Wptm.mergeCellsSetting = [];
                    window.Wptm.style.table = {};

                    //backup old style
                    var oldStyle = JSON.parse(JSON.stringify(window.Wptm.style));
                    delete window.Wptm.style;
                    //Apply cols and row style to cells
                    var style;
                    window.Wptm.style = style = $.parseJSON(data.style);
                    window.Wptm.datas = data.datas;

                    window.Wptm.css = data.css.replace(/\\n/g, "\n");
                    $('#jform_css').val(window.Wptm.css);
                    $('#jform_css').change();

                    tableFunction.mergeCollsRowsstyleToCells();

                    //re-apply responsive parameters
                    if (typeof oldStyle.table.responsive_type !== "undefined") {
                        window.Wptm.style.table.responsive_type = oldStyle.table.responsive_type;
                    }

                    // add default val to window.Wptm.style.table
                    window.Wptm.style.table = $.extend({}, default_value, window.Wptm.style.table);

                    var colIndex, col, row;
                    for (col in style.cols) {
                        colIndex = style.cols[col][0];
                        if (typeof oldStyle.cols[colIndex] !== "undefined" && typeof oldStyle.cols[colIndex][1]["res_priority"] !== "undefined") {
                            if (typeof window.Wptm.style.cols[colIndex] == "undefined") {
                                window.Wptm.style.cols[colIndex] = [colIndex, {}];
                            }
                        }
                    }

                    //If no content we can set our own cols and rows size
                    for (row in style.rows) {
                        if (typeof (style.rows[row]) !== 'undefined' && (typeof (style.rows[row][1].height) !== 'undefined')) {
                            if (typeof (window.Wptm.style.rows[style.rows[row][0]]) === 'undefined') {
                                window.Wptm.style.rows[style.rows[row][0]] = [row, {}];
                            }
                            window.Wptm.style.rows[style.rows[row][0]][1].height = style.rows[row][1].height;
                        }
                    }
                    for (col in style.cols) {
                        if (typeof (style.cols[col]) !== 'undefined' && (typeof (style.cols[col][1].width) !== 'undefined')) {
                            if (typeof (window.Wptm.style.cols[style.cols[col][0]]) === 'undefined') {
                                window.Wptm.style.cols[style.cols[col][0]] = [col, {}];
                            }
                            window.Wptm.style.cols[style.cols[col][0]][1].width = style.cols[col][1].width;
                        }
                    }

                    Wptm.updateSettings.mergeCells = $.extend([], Wptm.mergeCellsSetting);
                    Wptm.updateSettings.data = $.extend([], data.datas);

                    tableFunction.pullDims(Wptm, $, false);

                    Wptm.container.handsontable('updateSettings', Wptm.updateSettings);

                    setTimeout(function () {
                        saveData = [];
                        if (typeof (window.Wptm.style.table.alternateColorValue) === 'undefined' || typeof window.Wptm.style.table.alternateColorValue[0] === 'undefined') {
                            // alternating.setAlternateColor(style.rows);
                            alternating.setAlternateColor(Wptm.style.rows, window.Wptm, window.wptm_element);
                        }

                        window.table_function_data.oldAlternate = {};
                        if (_.size(window.table_function_data.oldAlternate) < 1) {
                            window.table_function_data.oldAlternate = $.extend({}, window.Wptm.style.table.alternateColorValue);
                        }
                        window.table_function_data.checkChangeAlternate = [];

                        window.jquery(window.Wptm.container).handsontable('render');

                        Wptm.updateSettings = $.extend({}, {});
                        if (typeof data.update_type_columns !== 'undefined') {
                            saveData.push({
                                action: 'set_columns_types',
                                value: data.update_type_columns
                            });
                            Wptm.style.table.col_types = data.update_type_columns;

                            Wptm.headerOption = 1;
                            Wptm.hyperlink = typeof Wptm.style.table.hyperlink !== 'undefined' ? Wptm.style.table.hyperlink : {};
                            Wptm.mergeCellsSetting = typeof Wptm.style.table.mergeCellsSetting !== 'undefined' ? Wptm.style.table.mergeCellsSetting : [];
                        }
                        table_function_data.changeTheme = true;
                        tableFunction.cleanHandsontable();
                        tableFunction.saveChanges(true);
                    },200);

                    if (table_function_data.selectionSize > 0) { //when have select cell
                        selectOption.loadSelection($, Wptm, table_function_data.selection);
                    }
                    tableFunction.parseCss($);
                } else {
                    bootbox.alert(data, wptmText.Ok);
                }
                $('#wptm_popup').find('.colose_popup').trigger('click');
            });
        } else {
            $('#wptm_popup').find('.colose_popup').trigger('click');
        }
    });
}

export default change_theme
