//setTimeout change height table by rows height
import tableFunction from "./_functions";
import selectOption from "./_toolbarOptions";
import customRenderer from "./_customRenderer";
import DropChart from "./_chart";

/**
 * Call handsontable lib
 *
 * @param datas Wptm.datas
 */
function initHandsontable(datas) {
    var checkScroll = false;
    var autoScroll;
    window.Wptm.container = window.wptm_element.tableContainer;
    var modifyRow = null;
    var totalRows = datas.length;

    window.Wptm.container.handsontable({
        data: datas,
        startRows: 5,
        startCols: 5,
        editor: window.CustomEditor,
        search: true,
        renderAllRows: false,
        fillHandle: false,//turn off autofill (because the merged cell, html cell ... cannot be obtained)
        colHeaders: true,
        rowHeaders: true,
        autoRowSize: false,
        autoColSize: false,
        renderer: customRenderer.render,
        height: tableFunction.calculateTableHeight(window.jquery('#wptm-toolbars')),
        afterInit: function () {
            DropChart.functions.loadCharts();
            Wptm.container.handsontable("selectCell", 0, 0, 0, 0);
            window.table_function_data.firstRender = true;
        },
        beforeRender: function (isForced) {
            window.table_function_data.styleToRender = '';
        },
        beforeChange: function (changes, source) {
            if (source === 'auto_convert_data') {
                return;
            }

            for (var i = changes.length - 1; i >= 0; i--) {
                if (jquery('#list_chart').find('.chart-menu').length > 0) {//check chart exist
                    if (!DropChart.functions.validateCharts(changes[i])) {
                        bootbox.alert(wptmText.CHANGE_INVALID_CHART_DATA, wptmText.Ok);
                        return false;
                    }
                }
            }
        },
        afterRender: function (isForced) {
            var parser = new (less.Parser);
            var Wptm = window.Wptm;
            var $ = window.jquery;

            window.table_function_data.content = '#mainTabContent .handsontable .ht_master .htCore {' + window.table_function_data.styleToRender + '}';
            if (Wptm.style.table.responsive_type == 'scroll' && Wptm.style.table.freeze_row) {
                window.table_function_data.content += ' #mainTabContent .handsontable .ht_clone_top .htCore {' + window.table_function_data.styleToRender + '}';
            }
            if (Wptm.style.table.responsive_type == 'scroll' && Wptm.style.table.freeze_col) {
                window.table_function_data.content += ' #mainTabContent .handsontable .ht_clone_left .htCore {' + window.table_function_data.styleToRender + '}';
            }
            if (Wptm.style.table.responsive_type == 'scroll' && Wptm.style.table.freeze_row && Wptm.style.table.freeze_col) {
                window.table_function_data.content += ' #mainTabContent .handsontable .ht_clone_corner .htCore {' + window.table_function_data.styleToRender + '}';
            }

            parser.parse(window.table_function_data.content, function (err, tree) {
                if (err) {
                    //Here we can throw the erro to the user
                    return false;
                } else {
                    Wptm.css = $('#jform_css').val();
                    if ($('#headMainCss').length === 0) {
                        $('head').append('<style id="headMainCss"></style>');
                    }
                    $('#headMainCss').text(tree.toCSS());
                    return true;
                }
            });
            if ($('#content_popup_hide').find('select.select_columns option').length < 1) {
                // Build column selection for default sort parameter
                tableFunction.default_sortable(window.Wptm.datas);
            }
            //set Wptm.style.rows , Wptm.style.cols value
            tableFunction.pushDims($, Wptm);

            if (table_function_data.needSaveAfterRender === true) {
                tableFunction.saveChanges();
                table_function_data.needSaveAfterRender = false;
            }
        },
        afterChange: function (change, source) {//play when change content cell
            if (typeof table_function_data.data_argument !== 'undefined' && source === 'loadData') {
                source = 'edit';
                change = jquery.extend([], table_function_data.data_argument);
            }
            //fix handsontable merge cells remove data of cells
            if ((source === 'MergeCells' || source === 'populateFromArray')&& typeof change.length !== 'undefined') {
                for (i = 0; i < change.length; i++) {
                    if (change[i][2] !== null && change[i][3] === null) {
                        Wptm.datas[change[i][0]][change[i][1]] = change[i][2];
                    }
                }
            }

            if (source === 'loadData' || source === 'populateFromArray' || !(window.Wptm.can.edit || (window.Wptm.can.editown && data.author === window.Wptm.author))) {
                return; //don't save this change
            }
            //validate data cells when mergeCells
            if (change) {
                var i;
                var notSaveData;
                for (i = 0; i < change.length; i++) {
                    if (source === 'CopyPaste.paste' || source === 'edit' || source === 'UndoRedo.undo' || source === 'UndoRedo.redo') {
                        notSaveData = true;
                        if (typeof change[i][3] === 'undefined' || change[i][3] === 'wptm_change_value_after_set_columns_types') {
                            change[i][3] = change[i][2];//loadData when edit cells > 5ommit
                            notSaveData = false;
                        }
                        if (change[i][3] === change[i][4]) {
                            notSaveData = false;
                        }
                        if (typeof Wptm.headerOption == 'undefined' || change[i][0] >= Wptm.headerOption) {//check cell in table header
                            if (typeof change[i][3] !== 'undefined' && change[i][3] !== null) {
                                var value = tableFunction.cell_type_to_column(change[i], change[i][3]);

                                if (value === false) {
                                    wptm_element.mainTabContent.find('td.dtr' + change[i][0] + '.dtc' + change[i][1]).addClass('invalid_data');
                                    bootbox.alert(wptmText.CHANGE_INVALID_CELL_DATA, wptmText.Ok);
                                    return;
                                } else {
                                    wptm_element.mainTabContent.find('td.dtr' + change[i][0] + '.dtc' + change[i][1]).removeClass('invalid_data');
                                    if (value !== true) {
                                        if (notSaveData) {
                                            saveData.push({action: 'edit_cell', row: change[i][0], col: change[i][1], content: value});
                                            if (Wptm.headerOption > 0 && change[i][0] < Wptm.headerOption) {
                                                Wptm.style.table.header_data[change[i][0]][change[i][1]] = value;
                                            }
                                        }
                                        window.Wptm.container.handsontable('setDataAtCell', change[i][0], change[i][1], value, 'auto_convert_data');
                                    } else {
                                        if (notSaveData) {
                                            saveData.push({action: 'edit_cell', row: change[i][0], col: change[i][1], content: change[i][3]});
                                            if (Wptm.headerOption > 0 && change[i][0] < Wptm.headerOption) {
                                                Wptm.style.table.header_data[change[i][0]][change[i][1]] = change[i][3];
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            if (notSaveData) {
                                saveData.push({action: 'edit_cell', row: change[i][0], col: change[i][1], content: change[i][3]});
                                if (Wptm.headerOption > 0 && change[i][0] < Wptm.headerOption) {
                                    Wptm.style.table.header_data[change[i][0]][change[i][1]] = change[i][3];
                                }
                            }
                        }
                    }
                }
            }

            clearTimeout(tableFunction.autosaveNotification);

            var action = ['CopyPaste.paste', 'edit', 'UndoRedo.undo', 'UndoRedo.redo'];
            if (action.includes(source) && typeof change[0] !== 'undefined' && typeof change[0][2] !== 'undefined') {
                table_function_data.needSaveAfterRender = change[0][2] === change[0][3] ? false : true;
            }

            if (table_function_data.needSaveAfterRender === true) {
                tableFunction.saveChanges();
                table_function_data.needSaveAfterRender = false;
            }
        },
        afterCreateRow: function (index, amount) {
            var selector = table_function_data.selection[table_function_data.selectionSize - 1];
            var $ = jquery;
            var Wptm = window.Wptm;
            var above = selector[0] === index ? true : false;//check above/below

            if (typeof (Wptm.style.cells) !== 'undefined') {
                var newCells = {};
                var cell, i, cells;

                for (cell in Wptm.style.cells) {
                    cells = Wptm.style.cells[cell];
                    if (cells[0] >= index) {//rows >= index
                        newCells[parseInt(cells[0] + amount) + '!' + cells[1]]
                            = [cells[0] + amount, cells[1], $.extend({}, cells[2])];
                    }
                    if (cells[0] < index) {//rows < index
                        newCells[cell]
                            = [cells[0], cells[1], $.extend({}, cells[2])];
                    }
                    if (cells[0] <= selector[2] && selector[0] <= cells[0]) {//new rows copy style of selector
                        newCells[parseInt(cells[0] - selector[0] + index) + '!' + cells[1]]
                            = [parseInt(cells[0] - selector[0] + index), cells[1], $.extend({}, cells[2])];
                    }
                }
                Wptm.style.cells = $.extend({}, newCells);

                if (typeof Wptm.style.table.alternateColorValue !== 'undefined') {//update Wptm.style.table.alternateColorValue by index, amount
                    var alternateColorValue = Wptm.style.table.alternateColorValue;
                    for (i in alternateColorValue) {
                        if (above) {//above
                            if (alternateColorValue[i].selection[0] >= index + amount) { // alternateColorValue > new rows
                                alternateColorValue[i].selection[0] = alternateColorValue[i].selection[0] + amount;
                                alternateColorValue[i].selection[2] = alternateColorValue[i].selection[2] + amount;
                            }
                            if (alternateColorValue[i].selection[0] < index + amount && alternateColorValue[i].selection[2] >= index) {
                                alternateColorValue[i].selection[2] = alternateColorValue[i].selection[2] + amount;
                            }
                        } else {//below
                            if (alternateColorValue[i].selection[0] >= index) { // alternateColorValue > new rows
                                alternateColorValue[i].selection[0] = alternateColorValue[i].selection[0] + amount;
                                alternateColorValue[i].selection[2] = alternateColorValue[i].selection[2] + amount;
                            }
                            if (alternateColorValue[i].selection[0] < index && alternateColorValue[i].selection[2] >= selector[0]) {
                                alternateColorValue[i].selection[2] = alternateColorValue[i].selection[2] + amount;
                            }
                        }
                    }
                }
            }

            if (typeof (Wptm.style.rows) !== 'undefined') {
                // index, amount
                var new_data = $.extend({}, Wptm.style.rows);
                var jj;
                if (selector[0] === index) {//left
                    for (jj = index; jj < _.size(Wptm.style.rows); jj++) {
                        new_data[jj + amount] = [jj + amount, {}];
                        new_data[jj + amount][1] = $.extend({}, Wptm.style.rows[jj][1]);
                    }
                } else {
                    for (jj = index; jj < _.size(Wptm.style.rows) + amount; jj++) {
                        new_data[jj] = [jj, {}];
                        new_data[jj][1] = $.extend({}, Wptm.style.rows[jj - amount][1]);
                    }
                }

                Wptm.style.rows = $.extend({}, new_data);
            }

            if (parseInt(Wptm.headerOption) > 0) {
                delete Wptm.style.table.header_data;
                Wptm.style.table.header_data = [];
                for (var j = 0; j < Wptm.headerOption; j++) {
                    Wptm.style.table.header_data[j] = Wptm.datas[j];
                }
            }
            saveData.push({action: 'create_row', index: index, amount: amount, above: above});

            // update merged row index and get tableFunction.saveChanges();
            updateMergeCells(window.table_function_data.firstRender);
            tableFunction.cleanHandsontable();
        },
        afterRemoveRow: function (index, amount) {
            var selector = table_function_data.selection[table_function_data.selectionSize - 1];
            var $ = jquery;
            var Wptm = window.Wptm;
            if (typeof (Wptm.style.cells) !== 'undefined') {
                var newCells = {};
                var cell, i, cells;

                for (cell in Wptm.style.cells) {
                    cells = Wptm.style.cells[cell];
                    if (cells[0] > index + amount - 1) {
                        newCells[parseInt(cells[0] - amount) + '!' + cells[1]]
                            = [cells[0] - amount, cells[1], $.extend({}, cells[2])];
                    }
                    if (cells[0] < index) {
                        newCells[cell]
                            = [cells[0], cells[1], $.extend({}, cells[2])];
                    }
                }
                Wptm.style.cells = $.extend({}, newCells);

                if (typeof Wptm.style.table.alternateColorValue !== 'undefined') {//update Wptm.style.table.alternateColorValue by index, amount
                    var alternateColorValue = Wptm.style.table.alternateColorValue;
                    for (i in alternateColorValue) {
                        if (alternateColorValue[i].selection[2] >= index && alternateColorValue[i].selection[2] <= (index + amount - 1)) {
                            alternateColorValue[i].selection[2] = index - 1;//selection[2] in selector
                        }
                        if (alternateColorValue[i].selection[2] >= index + amount) {
                            alternateColorValue[i].selection[2] = alternateColorValue[i].selection[2] - amount;//selection[2] > selector
                        }
                        if (alternateColorValue[i].selection[0] >= index && alternateColorValue[i].selection[0] < (index + amount)) {
                            alternateColorValue[i].selection[0] = index;//selection[0] in selector
                        }
                        if (alternateColorValue[i].selection[0] >= index + amount) {
                            alternateColorValue[i].selection[0] = alternateColorValue[i].selection[0] - amount;//selection[0] > selector
                        }
                        if (alternateColorValue[i].selection[0] > alternateColorValue[i].selection[2]) {//alternateColor in selector
                            delete alternateColorValue[i];
                        }
                    }
                }
            }

            if (typeof (Wptm.style.rows) !== 'undefined') {
                // index, amount
                var new_data = $.extend({}, Wptm.style.rows);
                var jj;
                for (jj = index; jj < _.size(Wptm.style.rows); jj++) {
                    if (typeof (Wptm.style.rows[jj + amount]) !== 'undefined') {
                        new_data[jj] = [jj, {}];
                        new_data[jj][1] = $.extend({}, Wptm.style.rows[jj][1]);
                    } else {
                        delete new_data[jj];
                    }
                }
                Wptm.style.rows = $.extend({}, new_data);
            }

            //remove col in header table
            if (parseInt(Wptm.headerOption) > 0) {
                delete Wptm.style.table.header_data;
                Wptm.style.table.header_data = [];
                for (var j = 0; j < Wptm.headerOption; j++) {
                    Wptm.style.table.header_data[j] = Wptm.datas[j];
                }
            }

            saveData.push({action: 'del_row', index: index, amount: amount, old_rows: $(window.Wptm.container).handsontable('countRows') + amount});
            // update merged row index and get tableFunction.saveChanges();
            updateMergeCells(window.table_function_data.firstRender);
            tableFunction.cleanHandsontable();
        },
        afterCreateCol: function (index, amount) {
            var selector = table_function_data.selection[table_function_data.selectionSize - 1];
            var $ = jquery;
            var Wptm = window.Wptm;
            var left = selector[1] === index ? true : false;//check insert left/right

            if (typeof (Wptm.style.cells) !== 'undefined') {
                var newCells = {};
                var cell, i, cells;

                for (cell in Wptm.style.cells) {
                    cells = Wptm.style.cells[cell];
                    if (cells[1] >= index) {//cols >= index
                        newCells[cells[0] + '!' + parseInt(cells[1] + amount)]
                            = [cells[0], cells[1] + amount, $.extend({}, cells[2])];
                    }
                    if (cells[1] < index) {//cols < index
                        newCells[cell]
                            = [cells[0], cells[1], $.extend({}, cells[2])];
                    }
                    if (cells[1] <= selector[3] && selector[1] <= cells[1]) {//new cols copy style of selector
                        newCells[cells[0] + '!' + parseInt(cells[1] - selector[1] + index)]
                            = [cells[0], parseInt(cells[1] - selector[1] + index), $.extend({}, cells[2])];
                    }
                }
                Wptm.style.cells = $.extend({}, newCells);

                if (typeof Wptm.style.table.alternateColorValue !== 'undefined') {//update Wptm.style.table.alternateColorValue by index, amount
                    var alternateColorValue = Wptm.style.table.alternateColorValue;
                    for (i in alternateColorValue) {
                        if (left) {//insert left
                            if (alternateColorValue[i].selection[1] >= index) { // alternateColorValue > new rows
                                alternateColorValue[i].selection[1] = alternateColorValue[i].selection[1] + amount;
                                alternateColorValue[i].selection[3] = alternateColorValue[i].selection[3] + amount;
                            }
                            if (alternateColorValue[i].selection[1] < index && alternateColorValue[i].selection[3] >= index) {
                                alternateColorValue[i].selection[3] = alternateColorValue[i].selection[3] + amount;
                            }
                        } else {//insert right
                            if (alternateColorValue[i].selection[1] >= index) { // alternateColorValue > new rows
                                alternateColorValue[i].selection[1] = alternateColorValue[i].selection[1] + amount;
                                alternateColorValue[i].selection[3] = alternateColorValue[i].selection[3] + amount;
                            }
                            if (alternateColorValue[i].selection[1] < index && alternateColorValue[i].selection[3] >= index) {
                                alternateColorValue[i].selection[3] = alternateColorValue[i].selection[3] + amount;
                            }
                        }
                    }
                }
            }

            if (typeof (Wptm.style.cols) !== 'undefined') {
                // index, amount
                var new_data = $.extend({}, Wptm.style.cols);
                var jj;
                if (selector[1] === index) {//left
                    for (jj = index; jj < _.size(Wptm.style.cols); jj++) {
                        new_data[jj + amount] = [jj + amount, {}];
                        new_data[jj + amount][1] = $.extend({}, Wptm.style.cols[jj][1]);
                    }
                } else {
                    for (jj = index; jj < _.size(Wptm.style.cols) + amount; jj++) {
                        new_data[jj] = [jj, {}];
                        new_data[jj][1] = $.extend({}, Wptm.style.cols[jj - amount][1]);
                    }
                }

                Wptm.style.cols = $.extend({}, new_data);
            }

            for (var i = index; i <= (index + amount - 1) ; i++) {
                Wptm.style.table.col_types.splice(i, 0, 'varchar');
            }

            if (parseInt(Wptm.headerOption) > 0) {
                delete Wptm.style.table.header_data;
                Wptm.style.table.header_data = [];
                for (var j = 0; j < Wptm.headerOption; j++) {
                    Wptm.style.table.header_data[j] = Wptm.datas[j];
                }
            }

            // Build column selection for default sort parameter
            tableFunction.default_sortable(window.Wptm.datas);

            window.jquery(window.Wptm.container).handsontable('render');
            saveData.push({action: 'create_col', index: index, amount: amount, left: left});

            // update merged row index and get tableFunction.saveChanges();
            updateMergeCells(window.table_function_data.firstRender);
            tableFunction.cleanHandsontable();
        },
        afterRemoveCol: function (index, amount) {
            var selector = table_function_data.selection[table_function_data.selectionSize - 1];
            var $ = jquery;
            var Wptm = window.Wptm;
            if (typeof (Wptm.style.cells) !== 'undefined') {
                var newCells = {};
                var cell, i, cells;

                for (cell in Wptm.style.cells) {
                    cells = Wptm.style.cells[cell];
                    if (cells[1] > index + amount - 1) {
                        newCells[cells[0] + '!' + parseInt(cells[1] - amount)]
                            = [cells[0], cells[1] - amount, $.extend({}, cells[2])];
                    }
                    if (cells[1] < index) {
                        newCells[cell]
                            = [cells[0], cells[1], $.extend({}, cells[2])];
                    }
                }
                Wptm.style.cells = $.extend({}, newCells);

                if (typeof Wptm.style.table.alternateColorValue !== 'undefined') {//update Wptm.style.table.alternateColorValue by index, amount
                    var alternateColorValue = Wptm.style.table.alternateColorValue;
                    for (i in alternateColorValue) {
                        if (alternateColorValue[i].selection[3] >= index && alternateColorValue[i].selection[3] <= (index + amount - 1)) {
                            alternateColorValue[i].selection[3] = index - 1;//selection[3] in selector
                        }
                        if (alternateColorValue[i].selection[3] >= index + amount) {
                            alternateColorValue[i].selection[3] = alternateColorValue[i].selection[3] - amount;//selection[3] > selector
                        }
                        if (alternateColorValue[i].selection[1] >= index && alternateColorValue[i].selection[1] < (index + amount)) {
                            alternateColorValue[i].selection[1] = index;//selection[0] in selector
                        }
                        if (alternateColorValue[i].selection[1] >= index + amount) {
                            alternateColorValue[i].selection[1] = alternateColorValue[i].selection[1] - amount;//selection[0] > selector
                        }
                        if (alternateColorValue[i].selection[1] > alternateColorValue[i].selection[3]) {//alternateColor in selector
                            delete alternateColorValue[i];
                        }
                    }
                }
            }

            if (typeof (Wptm.style.cols) !== 'undefined') {
                // index, amount
                var new_data = $.extend({}, Wptm.style.cols);
                var jj;
                for (jj = index; jj < _.size(Wptm.style.cols); jj++) {
                    if (typeof (Wptm.style.cols[jj + amount]) !== 'undefined' && Wptm.style.cols[jj + amount] !== null) {
                        new_data[jj] = [jj, {}];
                        new_data[jj][1] = $.extend({}, Wptm.style.cols[jj][1]);
                    } else {
                        delete new_data[jj];
                    }
                }
                Wptm.style.cols = $.extend({}, new_data);
            }

            for (var i = (index + amount - 1); i >= index ; i--) {
                Wptm.style.table.col_types.splice(i, 1);
            }

            //remove col in header table
            if (parseInt(Wptm.headerOption) > 0) {
                delete Wptm.style.table.header_data;
                Wptm.style.table.header_data = [];
                for (var j = 0; j < Wptm.headerOption; j++) {
                    Wptm.style.table.header_data[j] = Wptm.datas[j];
                }
            }

            // Build column selection for default sort parameter
            tableFunction.default_sortable(window.Wptm.datas);
            jquery(Wptm.container).data('handsontable').render();
            saveData.push({action: 'del_col', index: index, amount: amount, old_columns: $(window.Wptm.container).handsontable('countCols') + amount});

            updateMergeCells(window.table_function_data.firstRender);
            tableFunction.cleanHandsontable();
        },
        afterColumnResize: function (col, width) {
            tableFunction.saveChanges();
        },
        beforeRowResize: function (currentRow, newSize, isDoubleClick) {
            if (modifyRow !== null) {//currentRow is current size row
                Wptm.style.rows[modifyRow][1].height = newSize;
            }
        },
        modifyRow: function (row) {
            modifyRow = row;
        },
        afterRowResize: function (row1, height) {
            Wptm.style.rows[row1][1].height = height;

            tableFunction.saveChanges();
        },
        afterSelection: function (r, c, r2, c2, preventScrolling, selectionLayerLevel) {
            selectOption.loadSelection(window.jquery, window.Wptm, [r, c, r2, c2]);
            Wptm.max_Col = Wptm.datas[0].length;
            Wptm.max_row = Wptm.datas.length;
            if (r * r2 == 0 && (r2 + r) == (Wptm.max_row - 1)) {
                Wptm.newSelect = 'col';
            } else if (c * c2 == 0 && (c2 + c) == Wptm.max_Col - 1) {
                Wptm.newSelect = 'row';
            } else {
                delete Wptm.newSelect;
            }
        },
        afterScrollHorizontally: function () {
            //change position of Editors when ScrollHorizontally
            checkScroll = true;
            clearTimeout(autoScroll);
            autoScroll = setTimeout(function () {
                checkScroll = afterScrollEditors(checkScroll);
            }, 200);
        },
        afterScrollVertically: function () {
            //change position of Editors when ScrollHorizontally
            checkScroll = true;
            clearTimeout(autoScroll);
            autoScroll = setTimeout(function () {
                checkScroll = afterScrollEditors(checkScroll);
            }, 200);
        },
        afterMergeCells: function () {
            updateMergeCells(window.table_function_data.firstRender);
        },
        afterUnmergeCells: function () {
            updateMergeCells(window.table_function_data.firstRender);
        },
        colWidths: function (index) {
            if (tableFunction.checkObjPropertyNested(window.Wptm.style, 'cols', index, 1, 'width')) {
                return window.Wptm.style.cols[index][1].width;
            } else if (typeof window.Wptm.style.cols === 'object' && (typeof window.Wptm.style.cols[index] === 'undefined' || typeof window.Wptm.style.cols[index][1].width === 'undefined')) {
                return 100;
            }
        },
        rowHeights: function (index) {
            // Table rows is large than 1000, set default row height to 30
            if (totalRows >= 1000) {
                return 30;
            }

            if (tableFunction.checkObjPropertyNestedNotEmpty(window.Wptm.style, 'rows', index, 1, 'height')) {
                return window.Wptm.style.rows[index][1].height;
            } else {
                var h;
                if (typeof Wptm.style.table.allRowHeight !== 'undefined' && Wptm.style.table.allRowHeight !== '') {
                    h = Wptm.style.table.allRowHeight;
                } else {
                    h = window.Wptm.container.find('.ht_master .htCore tbody tr').eq(index).height();
                }
                return h;
            }
        },
        fixedRowsTop: (window.Wptm.style.table.responsive_type == 'scroll' && parseInt(window.Wptm.style.table.freeze_row) > 0) ? window.Wptm.headerOption : 0,
        fixedColumnsLeft: (window.Wptm.style.table.responsive_type == 'scroll') ? parseInt(window.Wptm.style.table.freeze_col) : 0,
        manualColumnResize: (window.Wptm.can.edit || (window.Wptm.can.editown && data.author === window.Wptm.author)),
        manualRowResize: (window.Wptm.can.edit || (window.Wptm.can.editown && data.author === window.Wptm.author)),
        outsideClickDeselects: false,
        columnSorting: false,
        // columns: function(index) {
        //     var col_types = Wptm.style.table.col_types;
        //     col_types[index] = typeof col_types[index] !== 'undefined' ? col_types[index].toUpperCase() === 'VARCHAR(255)' ? 'varchar' : col_types[index] : 'varchar';
        //     switch (col_types[index]) {
        //         case 'varchar':
        //             col_types[index] = 'text';
        //             break;
        //         case 'int':
        //             col_types[index] = 'numeric';
        //             break;
        //         case 'float':
        //             col_types[index] = 'text';
        //             break;
        //         case 'date':
        //             col_types[index] = 'date';
        //             break;
        //         case 'datetime':
        //             col_types[index] = 'time';
        //             break;
        //         case 'text':
        //             col_types[index] = 'text';
        //             break;
        //     }
        //     return {
        //         type: col_types[index],
        //         readOnly: index < 1
        //     }
        // },
        undo: true,
        mergeCells: window.Wptm.mergeCellsSetting,
        readOnly: (((window.Wptm.can.edit || (window.Wptm.can.editown && data.author === window.Wptm.author)) && window.Wptm.type === 'html') ? false : true),
        contextMenu: (((window.Wptm.can.edit || (window.Wptm.can.editown && data.author === window.Wptm.author)) && window.Wptm.type === 'html')
            ? {
                items: {
                    "cut": {
                        name: wptmContext.cut,
                        hidden: function () {
                            if (Wptm.max_Col * Wptm.max_row > 0) {
                                return false;
                            }
                            return true;
                        }
                    },
                    "copy": {
                        name: wptmContext.copy,
                        hidden: function () {
                            if (Wptm.max_Col * Wptm.max_row > 0) {
                                return false;
                            }
                            return true;
                        }
                    },
                    "remove": {
                        name: wptmContext.remove,
                        key: 'remove',
                        submenu: {
                            items: [
                                {
                                    key: "remove:remove_row",
                                    name: wptmContext.remove_rows,
                                    callback: function (key, selection, clickEvent) {
                                        var selection = table_function_data.selection;
                                        var i;
                                        for (i = 0; i < table_function_data.selectionSize; i++) {
                                            if (selection[i][2] != null || selection[i][0] != selection[i][2]) {
                                                window.Wptm.container.handsontable('alter', 'remove_row', selection[i][0], selection[i][2] - selection[i][0] + 1);
                                            } else {
                                                window.Wptm.container.handsontable('alter', 'remove_row', selection[i][0]);
                                            }
                                        }
                                    },
                                },
                                {
                                    key: "remove:remove_col",
                                    name: wptmContext.remove_cols,
                                    callback: function (key, options) {
                                        var selection = table_function_data.selection;
                                        var i;
                                        for (i = 0; i < table_function_data.selectionSize; i++) {
                                            if (selection[i][3] != null || selection[i][1] != selection[i][3]) {
                                                window.Wptm.container.handsontable('alter', 'remove_col', selection[i][1], selection[i][3] - selection[i][1] + 1);
                                            } else {
                                                window.Wptm.container.handsontable('alter', 'remove_col', selection[i][1]);
                                            }
                                        }
                                    },
                                }],
                        },
                        hidden: function () {
                            if (Wptm.max_Col * Wptm.max_row > 0) {
                                return false;
                            }
                            return true;
                        }
                    },
                    "---------": {},
                    "rows_size": {
                        name: function () {
                            if (typeof Wptm.newSelect !== 'undefined') {
                                var selectSize = table_function_data.selection[table_function_data.selectionSize - 1];
                                if (Wptm.newSelect === 'row') {
                                    if (selectSize[0] !== selectSize[2]) {
                                        return '<span>' + wptmContext.define + 's ' + (selectSize[0] + 1) + '-' + (selectSize[2] + 1) + '</span>';
                                    }
                                    return '<span>' + wptmContext.define + '</span>';
                                } else {
                                    if (selectSize[1] !== selectSize[3]) {
                                        return '<span>' + wptmContext.define + 's ' + String.fromCharCode(65 + selectSize[1]) + '-' + String.fromCharCode(65 + selectSize[3]) + '</span>';
                                    }
                                    return '<span>' + wptmContext.defineColumn + '</span>';
                                }
                            }
                        },
                        callback: function (key, selection, clickEvent) {
                            if (Wptm.newSelect === 'row') {
                                wptm_element.primary_toolbars.find('.table_option[name="resize_row"]').trigger('click');
                            } else {
                                wptm_element.primary_toolbars.find('.table_option[name="resize_column"]').trigger('click');
                            }
                            return true;
                        },
                        hidden: function () {
                            if (typeof Wptm.newSelect !== 'undefined' && Wptm.max_Col * Wptm.max_row > 0) {
                                return false;
                            }
                            return true;
                        }
                    },
                    "insert": {
                        name: wptmContext.insert,
                        key: 'insert',
                        submenu: {
                            items: [
                                {
                                    key: "insert:row_above",
                                    name: wptmContext.insert_above,
                                    callback: function (key, options) {
                                        var selection = table_function_data.selection[table_function_data.selectionSize - 1];
                                        if (selection[2] != null || selection[0] != selection[2]) {
                                            window.Wptm.container.handsontable('alter', 'insert_row', selection[0], selection[2] - selection[0] + 1);
                                        } else {
                                            window.Wptm.container.handsontable('alter', 'insert_row', selection[0]);
                                        }
                                    },
                                    hidden: function () {
                                        if (Wptm.max_Col > 0) {
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                {
                                    key: "insert:row_below",
                                    name: wptmContext.insert_below,
                                    callback: function (key, options) {
                                        var selection = table_function_data.selection[table_function_data.selectionSize - 1];
                                        if (selection[2] != null || selection[0] != selection[2]) {
                                            window.Wptm.container.handsontable('alter', 'insert_row', selection[2] + 1, selection[2] - selection[0] + 1);
                                        } else {
                                            window.Wptm.container.handsontable('alter', 'insert_row', selection[2] + 1);
                                        }
                                    },
                                    hidden: function () {
                                        if (Wptm.max_Col > 0) {
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                {
                                    key: "insert:col_left",
                                    name: wptmContext.insert_left,
                                    callback: function (key, options) {
                                        var selection = table_function_data.selection[table_function_data.selectionSize - 1];
                                        if (selection[3] != null || selection[1] != selection[3]) {
                                            window.Wptm.container.handsontable('alter', 'insert_col', selection[1], selection[3] - selection[1] + 1);
                                        } else {
                                            window.Wptm.container.handsontable('alter', 'insert_col', selection[1]);
                                        }
                                    },
                                    hidden: function () {
                                        if (Wptm.max_row > 0) {
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                {
                                    key: "insert:col_right",
                                    name: wptmContext.insert_right,
                                    callback: function (key, options) {
                                        var selection = table_function_data.selection[table_function_data.selectionSize - 1];
                                        if (selection[3] != null || selection[1] != selection[3]) {
                                            window.Wptm.container.handsontable('alter', 'insert_col', selection[3] + 1, selection[3] - selection[1] + 1);
                                        } else {
                                            window.Wptm.container.handsontable('alter', 'insert_col', selection[3] + 1);
                                        }
                                    },
                                    hidden: function () {
                                        if (Wptm.max_row > 0) {
                                            return false;
                                        }
                                        return true;
                                    }
                                }],
                        }
                    },
                    "undo": {
                        name: wptmContext.undo,
                        hidden: function () {
                            if (Wptm.max_Col * Wptm.max_row > 0) {
                                return false;
                            }
                            return true;
                        }
                    },
                    "redo": {
                        name: wptmContext.redo,
                        hidden: function () {
                            if (Wptm.max_Col * Wptm.max_row > 0) {
                                return false;
                            }
                            return true;
                        }
                    },
                    "mergeCells": {
                        // name: wptmContext.merge,
                    },
                    "Add tooltip": {
                        name: wptmContext.tooltip,
                        callback: function (key, selection, clickEvent) {
                            wptm_element.editToolTip.trigger('click');
                        },
                        hidden: function () {
                            if (Wptm.max_Col * Wptm.max_row < 1) {
                                return true;
                            }
                            if (table_function_data.selectionSize > 1
                                || (table_function_data.selection[0][2] - table_function_data.selection[0][0] > 0
                                    || table_function_data.selection[0][3] - table_function_data.selection[0][1] > 0)) {
                                return true;
                            }
                            return false;
                        }
                    },
                    "Column type": {
                        name: wptmContext.column_type,
                        key: 'column_type',
                        submenu: {
                            items: [
                                {
                                    key: "column_type:varchar",
                                    name: function () {
                                        if (typeof table_function_data.type_column_selected !== 'undefined' && (table_function_data.type_column_selected === 'varchar' || table_function_data.type_column_selected.toLowerCase() === 'varchar(255)')) {
                                            return '<span class="selected">' + wptmContext.column_type_varchar + '</span>';
                                        } else {
                                            return '<span>' + wptmContext.column_type_varchar + '</span>';
                                        }
                                    },
                                    callback: function (key, options) {
                                        bootbox.confirm(wptmText.ALERT_CHANGE_COLUMN_TYPE, wptmText.Cancel, wptmText.Ok, function (result) {
                                            if (result === true) {
                                                var cols_selected = [];
                                                var i, jj;
                                                for (jj = 0; jj < table_function_data.selectionSize; jj++) {
                                                    for (i = table_function_data.selection[jj][1]; i <= table_function_data.selection[jj][3]; i++) {
                                                        cols_selected[i] = 'varchar';
                                                        Wptm.style.table.col_types[i] = 'varchar';
                                                    }
                                                }

                                                // saveData.push({action: 'set_column_type', cols: unique_cols_selected, type: 'varchar'});
                                                saveData.push({
                                                    action: 'set_columns_types',
                                                    value: cols_selected
                                                });
                                                tableFunction.cleanHandsontable();
                                                tableFunction.saveChanges(true);
                                            }
                                        });
                                    },
                                },
                                {
                                    key: "column_type:int",
                                    name: function () {
                                        if (typeof table_function_data.type_column_selected !== 'undefined' && table_function_data.type_column_selected === 'int') {
                                            return '<span class="selected">' + wptmContext.column_type_int + '</span>';
                                        } else {
                                            return '<span>' + wptmContext.column_type_int + '</span>';
                                        }
                                    },
                                    callback: function (key, options) {
                                        bootbox.confirm(wptmText.ALERT_CHANGE_COLUMN_TYPE, wptmText.Cancel, wptmText.Ok, function (result) {
                                            if (result === true) {
                                                var cols_selected = [];
                                                var i, jj;
                                                for (jj = 0; jj < table_function_data.selectionSize; jj++) {
                                                    for (i = table_function_data.selection[jj][1]; i <= table_function_data.selection[jj][3]; i++) {
                                                        cols_selected[i] = 'int';
                                                        Wptm.style.table.col_types[i] = 'int';
                                                    }
                                                }

                                                // saveData.push({action: 'set_column_type', cols: unique_cols_selected, type: 'varchar'});
                                                saveData.push({
                                                    action: 'set_columns_types',
                                                    value: cols_selected
                                                });
                                                tableFunction.cleanHandsontable();
                                                tableFunction.saveChanges(true);
                                            }
                                        });
                                    },
                                },
                                {
                                    key: "column_type:float",
                                    name: function () {
                                        if (typeof table_function_data.type_column_selected !== 'undefined' && table_function_data.type_column_selected === 'float') {
                                            return '<span class="selected">' + wptmContext.column_type_float + '</span>';
                                        } else {
                                            return '<span>' + wptmContext.column_type_float + '</span>';
                                        }
                                    },
                                    callback: function (key, options) {
                                        bootbox.confirm(wptmText.ALERT_CHANGE_COLUMN_TYPE, wptmText.Cancel, wptmText.Ok, function (result) {
                                            if (result === true) {
                                                var cols_selected = [];
                                                var i, jj;
                                                for (jj = 0; jj < table_function_data.selectionSize; jj++) {
                                                    for (i = table_function_data.selection[jj][1]; i <= table_function_data.selection[jj][3]; i++) {
                                                        cols_selected[i] = 'float';
                                                        Wptm.style.table.col_types[i] = 'float';
                                                    }
                                                }

                                                // saveData.push({action: 'set_column_type', cols: unique_cols_selected, type: 'varchar'});
                                                saveData.push({
                                                    action: 'set_columns_types',
                                                    value: cols_selected
                                                });
                                                tableFunction.cleanHandsontable();
                                                tableFunction.saveChanges(true);
                                            }
                                        });

                                    },
                                },
                                {
                                    key: "column_type:date",
                                    name: function () {
                                        if (typeof table_function_data.type_column_selected !== 'undefined' && table_function_data.type_column_selected === 'date') {
                                            return '<span class="selected">' + wptmContext.column_type_date + '</span>';
                                        } else {
                                            return '<span>' + wptmContext.column_type_date + '</span>';
                                        }
                                    },
                                    callback: function (key, options) {
                                        bootbox.confirm(wptmText.ALERT_CHANGE_COLUMN_TYPE, wptmText.Cancel, wptmText.Ok, function (result) {
                                            if (result === true) {
                                                var cols_selected = [];
                                                var i, jj;
                                                for (jj = 0; jj < table_function_data.selectionSize; jj++) {
                                                    for (i = table_function_data.selection[jj][1]; i <= table_function_data.selection[jj][3]; i++) {
                                                        cols_selected[i] = 'date';
                                                        Wptm.style.table.col_types[i] = 'date';
                                                    }
                                                }

                                                // saveData.push({action: 'set_column_type', cols: unique_cols_selected, type: 'varchar'});
                                                saveData.push({
                                                    action: 'set_columns_types',
                                                    value: cols_selected
                                                });
                                                tableFunction.cleanHandsontable();
                                                tableFunction.saveChanges(true);
                                            }
                                        });

                                    },
                                },
                                {
                                    key: "column_type:datetime",
                                    name: function () {
                                        if (typeof table_function_data.type_column_selected !== 'undefined' && table_function_data.type_column_selected === 'datetime') {
                                            return '<span class="selected">' + wptmContext.column_type_datetime + '</span>';
                                        } else {
                                            return '<span>' + wptmContext.column_type_datetime + '</span>';
                                        }
                                    },
                                    callback: function (key, options) {
                                        bootbox.confirm(wptmText.ALERT_CHANGE_COLUMN_TYPE, wptmText.Cancel, wptmText.Ok, function (result) {
                                            if (result === true) {
                                                var cols_selected = [];
                                                var i, jj;
                                                for (jj = 0; jj < table_function_data.selectionSize; jj++) {
                                                    for (i = table_function_data.selection[jj][1]; i <= table_function_data.selection[jj][3]; i++) {
                                                        cols_selected[i] = 'datetime';
                                                        Wptm.style.table.col_types[i] = 'datetime';
                                                    }
                                                }

                                                // saveData.push({action: 'set_column_type', cols: unique_cols_selected, type: 'varchar'});
                                                saveData.push({
                                                    action: 'set_columns_types',
                                                    value: cols_selected
                                                });
                                                tableFunction.cleanHandsontable();
                                                tableFunction.saveChanges(true);
                                            }
                                        });

                                    },
                                },
                                {
                                    key: "column_type:text",
                                    name: function () {
                                        if (typeof table_function_data.type_column_selected !== 'undefined' && table_function_data.type_column_selected === 'text') {
                                            return '<span class="selected">' + wptmContext.column_type_text + '</span>';
                                        } else {
                                            return '<span>' + wptmContext.column_type_text + '</span>';
                                        }
                                    },
                                    callback: function (key, options) {
                                        bootbox.confirm(wptmText.ALERT_CHANGE_COLUMN_TYPE, wptmText.Cancel, wptmText.Ok, function (result) {
                                            if (result === true) {
                                                var cols_selected = [];
                                                var i, jj;
                                                for (jj = 0; jj < table_function_data.selectionSize; jj++) {
                                                    for (i = table_function_data.selection[jj][1]; i <= table_function_data.selection[jj][3]; i++) {
                                                        cols_selected[i] = 'text';
                                                        Wptm.style.table.col_types[i] = 'text';
                                                    }
                                                }

                                                // saveData.push({action: 'set_column_type', cols: unique_cols_selected, type: 'varchar'});
                                                saveData.push({
                                                    action: 'set_columns_types',
                                                    value: cols_selected
                                                });
                                                tableFunction.cleanHandsontable();
                                                tableFunction.saveChanges(true);
                                            }
                                        });

                                    },
                                },
                            ]
                        },
                        hidden: function () {
                            if (Wptm.max_Col * Wptm.max_row < 1) {
                                return true;
                            }
                            if (table_function_data.selectionSize > 1 || table_function_data.selection[0][3] - table_function_data.selection[0][1] > 0) {
                                return true;
                            }
                            return false;
                        }
                    }
                }
            }
            : {
                items: {
                    "rows_size": {
                        name: function () {
                            if (typeof Wptm.newSelect !== 'undefined') {
                                var selectSize = table_function_data.selection[table_function_data.selectionSize - 1];
                                if (Wptm.newSelect === 'row') {
                                    if (selectSize[0] !== selectSize[2]) {
                                        return '<span>' + wptmContext.define + 's ' + (selectSize[0] + 1) + '-' + (selectSize[2] + 1) + '</span>';
                                    }
                                    return '<span>' + wptmContext.define + '</span>';
                                } else {
                                    if (selectSize[1] !== selectSize[3]) {
                                        return '<span>' + wptmContext.define + 's ' + String.fromCharCode(65 + selectSize[1]) + '-' + String.fromCharCode(65 + selectSize[3]) + '</span>';
                                    }
                                    return '<span>' + wptmContext.defineColumn + '</span>';
                                }
                            }
                        },
                        callback: function (key, selection, clickEvent) {
                            if (Wptm.newSelect === 'row') {
                                wptm_element.primary_toolbars.find('.table_option[name="resize_row"]').trigger('click');
                            } else {
                                wptm_element.primary_toolbars.find('.table_option[name="resize_column"]').trigger('click');
                            }
                            return true;
                        },
                        hidden: function () {
                            if (Wptm.max_Col * Wptm.max_row > 0) {
                                return false;
                            }
                            if (typeof Wptm.newSelect !== 'undefined') {
                                return false;
                            }
                            return true;
                        }
                    },
                    "Add tooltip": {
                        name: wptmContext.tooltip,
                        callback: function (key, selection, clickEvent) {
                            wptm_element.editToolTip.trigger('click');
                        },
                        hidden: function () {
                            if (Wptm.max_Col * Wptm.max_row < 1) {
                                return true;
                            }
                            if (table_function_data.selectionSize > 1
                                || (table_function_data.selection[0][2] - table_function_data.selection[0][0] > 0
                                    || table_function_data.selection[0][3] - table_function_data.selection[0][1] > 0)) {
                                return true;
                            }
                            return false;
                        }
                    }
                }
            })
    });

    // search key
    wptm_element.primary_toolbars.find('.search-menu').find('#dp-form-search').on('keyup', function (event) {
        if (event.keyCode === 13) {
            wptm_element.primary_toolbars.find('.search-menu').find('.search_table').trigger('click');
        } else if (jquery(this).val() === '') {
            wptm_element.primary_toolbars.find('.search-menu').find('.search_table').trigger('click');
        }
    });

    wptm_element.primary_toolbars.find('.search-menu').find('.search_table').click(function () {
        var textSearch = wptm_element.primary_toolbars.find('.search-menu').find('#dp-form-search');
        var queryResult = jquery(Wptm.container).data('handsontable').getPlugin('search').query(textSearch.val());
        jquery(Wptm.container).data('handsontable').render();
    });

    wptm_element.primary_toolbars.find('.search-menu').find('.reload_search').click(function () {
        wptm_element.primary_toolbars.find('.search-menu').find('#dp-form-search').val('');
        wptm_element.primary_toolbars.find('.search-menu').find('.search_table').trigger('click');
    });

    /*select menu option function*/
    selectOption.selectOption();

    /*more function Eg: rename table*/
    window.wptm_element.primary_toolbars.find('.wptm_name_edit').text(window.Wptm.title);
}

/*
* function change Wptm.mergeCellsSetting when mergecell/unMergeCell action
*/
function getMergeCells(argument, checkUnmerge) {
    if (typeof window.table_function_data.mergeCells === 'undefined') {
        window.table_function_data.mergeCells = [];
        if (window.Wptm.mergeCellsSetting.length > 0) {
            var i;
            for (i = 0; i < window.Wptm.mergeCellsSetting.length; i++) {
                window.table_function_data.mergeCells['d' + window.Wptm.mergeCellsSetting[i].row + window.Wptm.mergeCellsSetting[i].col] = window.Wptm.mergeCellsSetting[i];
            }
        }
    }
    if (checkUnmerge) {
        for (i in table_function_data.mergeCells) {
            if (argument[0].from.row <= table_function_data.mergeCells[i].row
                && table_function_data.mergeCells[i].row <= argument[0].to.row
                && argument[0].from.col <= table_function_data.mergeCells[i].col
                && table_function_data.mergeCells[i].col <= argument[0].to.col) {
                delete table_function_data.mergeCells[i];
            }
        }
    } else {
        var key = 'd' + argument[0].from.row + argument[0].from.col;
        table_function_data.mergeCells[key] = argument[1];
    }
}

/*
* Function update mergecells when change rows and cols
* */
function updateMergeCells(firstRender) {
    window.Wptm.mergeCellsSetting = [];
    var ht = jquery(Wptm.container).handsontable('getInstance');
    var mergeSetting = ht.getPlugin('mergeCells').mergedCellsCollection;
    var i = 0;

    if (mergeSetting.mergedCells.length < 1) {//save
        tableFunction.saveChanges();
    }

    for (i = 0; i < mergeSetting.mergedCells.length; i++) {
        window.Wptm.mergeCellsSetting[i] = {
            col: mergeSetting.mergedCells[i].col,
            colspan: mergeSetting.mergedCells[i].colspan,
            row: mergeSetting.mergedCells[i].row,
            rowspan: mergeSetting.mergedCells[i].rowspan
        };
    }

    if (firstRender) {
        tableFunction.saveChanges(firstRender);
    }
}

/*
* calculator height table container
* style: style of table,
* getRowsHeight: true(get getRowHeight), false(not get getRowHeight),
* top: true(get height of ht_clone_top), false(not get height of ht_clone_top)
* */
function calHeightTable(style, getRowsHeight, top, rowRender) {
    var rows = style.rows.length;
    if (rows === undefined) {
        rows = Object.keys(style.rows).length;
    }

    var height = 0;
    var htCloneTop = window.wptm_element.tableContainer.find('.ht_clone_top');

    if (getRowsHeight) {
        for (var i = 0; i < rows; i++) {
            window.Wptm.rowsHeight[i] = window.Wptm.container.handsontable('getRowHeight', i);
            height += window.Wptm.rowsHeight[i];
        }
    } else {
        //remove setTimeout when resize rows
        // clearTimeout(window.setHeightTable);

        height = window.Wptm.table_height;
        var newHeight = window.Wptm.container.handsontable('getRowHeight', rowRender);
        if (typeof window.Wptm.rowsHeight[rowRender] === 'undefined') {
            window.Wptm.rowsHeight[rowRender] = 0;
        }
        height += newHeight - window.Wptm.rowsHeight[rowRender];
        window.Wptm.rowsHeight[rowRender] = newHeight;
    }

    if (top) {
        height += htCloneTop.outerHeight();
    }
    return height;
}

/**
 * Set position for html cell editer popup
 *
 * @param checkScroll Check whether to perform
 * @returns {boolean}
 */
function afterScrollEditors (checkScroll) {
    var handsontableInputHolder = wptm_element.tableContainer.find('.handsontableInputHolder');
    if (checkScroll === true && (handsontableInputHolder.hasClass('wptm_set_top') || handsontableInputHolder.hasClass('wptm_set_left'))) {
        var position = handsontableInputHolder.position();

        var $table = wptm_element.tableContainer.find('.wtHider');

        if (handsontableInputHolder.hasClass('wptm_set_top')) {
            var tdOffsetTop = handsontableInputHolder.data('tdOffsetTop');
            var outerHeight = handsontableInputHolder.outerHeight();
            var heightTable = wptm_element.tableContainer.outerHeight() > $table.outerHeight() ? wptm_element.tableContainer.outerHeight() : $table.outerHeight();
            var new_top = tdOffsetTop + outerHeight - heightTable + 10;

            if (new_top > 0) {
                handsontableInputHolder.css({top: position.top - new_top});
            }
        }
        if (handsontableInputHolder.hasClass('wptm_set_left')) {
            var tdOffsetLeft = handsontableInputHolder.data('tdOffsetLeft');
            var outerWidth = handsontableInputHolder.outerWidth();
            var widthTable = wptm_element.tableContainer.outerWidth() > $table.outerWidth() ? wptm_element.tableContainer.outerWidth() : $table.outerWidth();
            var new_left = tdOffsetLeft + outerWidth - widthTable + 10;

            if (new_left > 0) {
                handsontableInputHolder.css({left: position.left - new_left});
            }
        }
    }
    return false;
}

export {initHandsontable, getMergeCells, calHeightTable}
