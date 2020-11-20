/**
 * Wptm
 *
 * We developed this code with our hearts and passion.
 * We hope you found it useful, easy to understand and to customize.
 * Otherwise, please feel free to contact us at contact@joomunited.com *
 * @package Wptm
 * @copyright Copyright (C) 2014 JoomUnited (http://www.joomunited.com). All rights reserved.
 * @copyright Copyright (C) 2014 Damien Barrère (http://www.crac-design.com). All rights reserved.
 * @license GNU General Public License version 2 or later; http://www.gnu.org/licenses/gpl-2.0.html
 */
import tableFunction from "./_functions";
import {initHandsontable, getMergeCells, calHeightTable} from "./_initHandsontable";
import alternating from "./_alternating";
import selectOption from "./_toolbarOptions"
import DropChart from "./_chart";

jQuery('title').text(wptmText.EDIT_TABLE_TITLE_TAG);

jQuery(window).bind('beforeunload', function(){
    if(!checkTimeOut)
        return true;
});

jQuery(document).ready(function ($) {
    window.jquery = $;

    var popup = $("#wptm_popup").draggable({
        containment: "#pwrapper",
        drag: function( event, ui ) {
            $(this).css('transform', 'none');
        },
    });

    $('.tip').tooltipster({
        theme: 'tooltipster-borderless',
        delay: 100,
        distance: 5,
    });
    $(document).on('click', '.search-open-btn', function (e) {
        var btn = $(this);
        var search_menu = btn.closest('.search-menu');
        if (!search_menu.hasClass("open")) {
            search_menu.addClass("open");
        }
    });
    $(document).on('mouseup', function (e) {
        var container = $(".search-menu");
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0 && container.hasClass("open")) {
            container.removeClass("open");
        }
    });
    $('.wp-color-result-text').each(function () {
        var tip = $(this).closest('.cells_option').attr('title');
        $(this).attr('title', tip).tooltipster({
            theme: 'tooltipster-borderless',
            delay: 0,
            distance: 5,
        });
    });
    if (typeof (Wptm) == 'undefined') {
        Wptm = {};
        Wptm.can = {};
        Wptm.can.create = true;
        Wptm.can.edit = true;
        Wptm.can.delete = true;
        Wptm.selection = {};
        Wptm.value_unit_chart = [];
        Wptm.hyperlink = {};
    } else {
        Wptm.value_unit_chart = [];
    }
    Wptm.updateSettings = {};

    if (typeof (Wptm.can) == 'undefined') {
        Wptm.can = {};
        Wptm.can.create = true;
        Wptm.can.edit = true;
        Wptm.can.delete = true;
        Wptm.hyperlink = {};
    }

    if (typeof (wptm_isAdmin) == 'undefined') {
        wptm_isAdmin = false;
    }
    Wptm.clearHandsontable = true;

    window.wptm_element = {
        wpreview: $('#wptm-toolbars'),
        primary_toolbars: $('#primary_toolbars'),
        mainTabContent: $('#mainTabContent'),
        tableContainer: $('#tableContainer'),
        wptm_popup: $('#wptm_popup'),
        content_popup_hide: $('#content_popup_hide'),
        cellValue: $('#CellValue'),
        settingCells: $('#setting-cells'),
        settingTable: $('#table-setting'),
        nameTable: $('#name-table'),
        alternating_color: $('#alternating_color'),
        editToolTip: $('#editToolTip'),
        saveToolTipbtn: $('#saveToolTipbtn'),
        chartTabContent: $('#chartTabContent'),
        wptmContentChart: $('#wptm_chart .wptm_content_chart'),
    };

    //saving all function data
    window.table_function_data = {
        replace_unit: {},
        text_replace_unit: '',
        text_replace_unit_function: '',
        date_format: [],
        check_value_data: true,
        string_currency_symbols: '',
        selectFetch: {},
        allAlternate: {},
        oldAlternate: {},
        changeAlternate: [],
        checkChangeAlternate: [],
        selection: [],
        styleToRender: '',
        content: '',
        needSaveAfterRender: false,
        alternateIndex: '',
        alternateSelection: [],
        save_table_params: [],
        firstRender: false
    };

    // is writing
    if (typeof idUser !== 'undefined' && idUser !== null) {
        var listUserEdit = {};
    }

    /* init menu actions */

    window.default_value = $.extend({}, {
        'use_sortable': '0',
        'default_sortable': '0',
        'default_order_sortable': '1',
        'table_align': 'center',
        'responsive_type': 'scroll',
        'freeze_col': 0,
        'table_height': 0,
        'freeze_row': 0,
        'enable_filters': 0,
        'enable_pagination': 0,
        'allRowHeight': '',
        'spreadsheet_url': '',
        'spreadsheet_style': 0,
        'auto_sync': 0,
        'download_button': 0,
        'col_types': ["varchar","varchar","varchar","varchar","varchar","varchar","varchar","varchar","varchar","varchar"]
    }, default_value);

    if (typeof idTable !== 'undefined' && idTable !== '') {
        updatepreview(idTable);

        if ($('.wptm-page').length > 0 && $('#adminmenuwrap').length > 0) {
            Scrollbar.init(document.querySelector('#adminmenuwrap'), {
                damping: 0.5,
                thumbMinSize: 10,
                alwaysShowTracks: false
            });
        }
    }

    //create new table
    wptm_element.primary_toolbars.find('.new_table_menu').on('click', function (e) {
        e.preventDefault();

        if (!(Wptm.can.create)) {
            return;
        }

        if (!wptm_permissions.can_create_tables) {
            bootbox.alert(wptm_permissions.translate.wptm_create_tables, wptmText.Ok);
            return false;
        }

        var id_category = Wptm.category;
        var curr_page = window.location.href;
        var cells = curr_page.split("?");

        $.ajax({
            url: wptm_ajaxurl + "task=table.add&id_category=" + id_category,
            type: "POST",
            dataType: "json",
            success: function (datas) {
                if (datas.response === true) {
                    var new_url = cells[0] + '?page=wptm&id_table=' + datas.datas.id;
                    window.open(new_url);
                } else {
                    bootbox.alert(datas.response, wptmText.Ok);
                }
            },
            error: function (jqxhr, textStatus, error) {
                bootbox.alert(textStatus + " : " + error, wptmText.Ok);
            }
        });
        return false;
    });

    //Import Excel
    //Init call back when file is uploaded successful
    Dropzone.options.procExcel = {
        maxFiles: 1,
        //acceptedFiles: 'xls,xlsx',
        init: function () {
            //Update form action
            this.on("addedfile", function (file) {
                var dotPos = file.name.lastIndexOf('.') + 1;
                var ext = file.name.substr(dotPos, file.name.length - dotPos);

                if (ext !== 'xls' && ext !== 'xlsx') {
                    bootbox.alert(wptmText.CHOOSE_EXCEL_FIE_TYPE, wptmText.Ok);
                    this.options.autoProcessQueue = false;
                    this.removeFile(file);
                    //return false;
                } else {
                    if (this.options.autoProcessQueue === false) {
                        this.options.autoProcessQueue = true;
                    }
                }

            });

            this.on("sending", function (file, xhr, formData) {
                //Add table id to formData
                $("#jform_id_table").val(idTable);
                formData.append('id_table', idTable);

                formData.append('onlydata', wptm_element.wptm_popup.find("#import_style").val());

                // Show the total progress bar when upload starts
                //this.options.uploadprogress(file);
                wptm_element.wptm_popup.find(".progress").show();
                wptm_element.wptm_popup.find(".progress-bar-success").css('width', 30 + '%');
                wptm_element.wptm_popup.find(".progress-bar-success").css('opacity', 1);
                // And disable the start button
                //file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
            });

            this.on("success", function (file, responseText) {
                wptm_element.wptm_popup.find(".progress").fadeOut(1000);
                var responseObj = JSON.parse(responseText);
                wptm_element.wptm_popup.find('.colose_popup').trigger('click');
                if (responseObj.response === true) {
                    if (typeof responseObj.datas.too_large !== 'undefined') {

                        bootbox.confirm(responseObj.datas.msg, wptmText.Cancel, wptmText.Ok, function (result) {

                            if (result === true) {
                                var jsonVar = {
                                    id_table: responseObj.datas.id,
                                    onlydata: responseObj.datas.onlydata,
                                    file: encodeURI(responseObj.datas.file),
                                    ignoreCheck: 1
                                };
                                $.ajax({
                                    url: wptm_ajaxurl + "task=excel.import",
                                    type: 'POST',
                                    data: jsonVar,
                                    success: function (datas) {
                                        location.reload();
                                    }
                                })
                            } else {
                                //do nothing
                            }
                        });

                    } else {
                        location.reload();
                    }
                } else {
                    bootbox.alert(responseObj.response, wptmText.Ok);
                }
            });

            this.on('complete', function (file) {
                this.removeFile(file);
                setTimeout(function () {
                    wptm_element.wptm_popup.find(".progress-bar-success").css('width', 0);
                }, 6000);
            });
            // Update the total progress bar
            this.on("uploadprogress", function (file, progress) {
                wptm_element.wptm_popup.find(".progress-bar-success").css('width', progress + "%");
            });
        }
    };
});

//Call ajax to get all data of table, add value to Wptm, table_function_data
function updatepreview(id, ajaxCallBack) {
    /*remove after change theme*/
    delete table_function_data.changeTheme;
    var url = wptm_ajaxurl + "view=table&format=json&id=" + id;
    var $ = jquery;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
    }).done(function (data) {
        //TODO: check user role table
        Wptm.id = id;
        Wptm.title = data.title;
        /*not change data cell(in db table)*/
        Wptm.type = 'html';
        Wptm.category = data.id_category;

        /*set height rows variable*/
        Wptm.rowsHeight = {};
        Wptm.table_height = 0;

        Wptm.hyperlink = {};
        if (typeof data.type !== 'undefined') {
            Wptm.type = data.type;
        } else {
            Wptm.type = (typeof data.params.table_type !== 'undefined') ? data.params.table_type : Wptm.type;
        }

        if (data.datas === '' || data.datas === false) {
            delete Wptm.datas;
            Wptm.datas = [
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""]
            ];
        } else {
            data.datas = JSON.stringify(data.datas);
            try {
                Wptm.datas = JSON.parse(data.datas);
            } catch (err) {
                Wptm.datas = [
                    ["", "", "", "", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", "", "", "", ""]
                ];
            }
        }

        Wptm.style = $.parseJSON(data.style);

        Wptm.css = data.css.replace(/\\n/g, "\n");

        if (data.params === "" || data.params === null || data.params.length == 0) {
            Wptm.mergeCellsSetting = [];
            Wptm.headerOption = 1;
        } else {
            if (typeof (data.params) == 'string') {
                data.params = $.parseJSON(data.params);
            }

            if (typeof data.params.headerOption !== 'undefined') {
                Wptm.headerOption = parseInt(data.params.headerOption);
            } else {
                Wptm.headerOption = 1;
            }

            if (typeof data.params.hyperlink !== 'undefined') {
                if (typeof data.params.hyperlink === 'string') {
                    data.params.hyperlink = $.parseJSON(data.params.hyperlink);
                }
                Wptm.hyperlink = data.params.hyperlink;
                $.each(data.params.hyperlink, function (index, value) {
                    var rowCol = index.split("!");
                    if(typeof Wptm.datas[rowCol[0]] !== 'undefined') {
                        Wptm.datas[rowCol[0]][rowCol[1]] = '<a target="_blank" href="' + value.hyperlink + '">' + value.text + '</a>';
                    }
                });
            }

            try {
                if (typeof data.params.mergeSetting === 'string') {
                    Wptm.mergeCellsSetting = $.parseJSON(data.params.mergeSetting);
                } else if (typeof data.params.mergeSetting === 'object') {
                    Wptm.mergeCellsSetting = data.params.mergeSetting;
                }
                if (Wptm.mergeCellsSetting == null) {
                    Wptm.mergeCellsSetting = [];
                }
            } catch (e) {
                Wptm.mergeCellsSetting = [];
            }
        }

        /*set default table data*/
        if (typeof (Wptm.style) === 'undefined' || Wptm.style === null) {
            $.extend(Wptm, {
                style: {
                    table: {},
                    rows: {},
                    cols: {},
                    cells: {}
                },
                css: ''
            });
        }

        if (typeof (Wptm.style.rows) === 'undefined' || Wptm.style.rows === null) {
            Wptm.style.rows = {};
        }
        if (typeof (Wptm.style.cols) === 'undefined' || Wptm.style.cols === null) {
            Wptm.style.cols = {};
            for (var number_col in Wptm.datas[0]) {
                Wptm.style.cols[number_col] = [parseInt(number_col), {res_priority: parseInt(number_col)}];
            }
        } else {
            for (var number_col in Wptm.datas[0]) {
                if (typeof window.Wptm.style.cols[number_col] === 'undefined' || window.Wptm.style.cols[number_col] === null) {
                    Wptm.style.cols[number_col] = [parseInt(number_col), {res_priority: parseInt(number_col)}];
                } else  if (typeof window.Wptm.style.cols[number_col][1].res_priority === 'undefined') {
                    Wptm.style.cols[number_col][1].res_priority =  parseInt(number_col);
                }
            }
        }
        if (typeof (Wptm.style.cells) === 'undefined' || Wptm.style.cells === null) {
            Wptm.style.cells = {};
        }

        tableFunction.mergeCollsRowsstyleToCells();

        Wptm.style.table = $.extend({}, window.default_value, Wptm.style.table);

        if (typeof table_function_data.auto_sync !== 'undefined') {
            Wptm.style.table.auto_sync = table_function_data.auto_sync;
            Wptm.style.table.spreadsheet_style = table_function_data.spreadsheet_style;
            Wptm.style.table.spreadsheet_url = table_function_data.spreadsheet_url;
            delete table_function_data.auto_sync;
        }

        if (Wptm.style.table.spreadsheet_url !== '' && Wptm.style.table.spreadsheet_url.indexOf("docs.google.com/spreadsheet") === -1) {//when first auto syn after update 2.7.0
            if (table_function_data.auto_sync == 1) {
                Wptm.style.table.excel_auto_sync = 1;
                Wptm.style.table.auto_sync = 0;
                Wptm.style.table.excel_spreadsheet_style = Wptm.style.table.spreadsheet_style;
            }
            Wptm.style.table.excel_url = table_function_data.spreadsheet_url;
            table_function_data.spreadsheet_url = '';
            Wptm.style.table.spreadsheet_url = '';
        }

        if (Wptm.headerOption > 0 && (typeof Wptm.style.table.header_data === 'undefined' || Wptm.style.table.header_data.length < Wptm.headerOption)) {
            Wptm.style.table.header_data = [];
            for (var j = 0; j < Wptm.headerOption; j++) {
                Wptm.style.table.header_data[j] = Wptm.datas[j];
            }
        }

        window.table_function_data = tableFunction.createRegExpFormat(table_function_data, Wptm.style.table.currency_symbol, Wptm.style.table.date_formats);

        window.Wptm = $.extend({}, window.Wptm, Wptm);

        $('#jform_css').val(Wptm.css);
        $('#jform_css').change();
        tableFunction.parseCss($);

        var handRisize, clearHandRisize;
        window.onresize = function () {
            if (!clearHandRisize) {
                clearTimeout(handRisize);
            }

            clearHandRisize = false;
            handRisize = setTimeout(function () {
                var height = tableFunction.calculateTableHeight(window.jquery('#wptm-toolbars'));
                jquery(Wptm.container).handsontable('updateSettings', {height: height});
                clearHandRisize = true;
            }, 500);
        };

        if (typeof (Wptm.style.table.alternateColorValue) === 'undefined' || typeof Wptm.style.table.alternateColorValue[0] === 'undefined') {
            var styleRows = null;
            alternating.setAlternateColor(styleRows, window.Wptm, window.wptm_element);
        }

        if (_.size(window.table_function_data.oldAlternate) < 1) {
            window.table_function_data.oldAlternate = $.extend({}, Wptm.style.table.alternateColorValue);
        }

        if (_.size(window.table_function_data.allAlternate) < 1) {
            window.table_function_data.allAlternate = $.extend({}, Wptm.style.table.allAlternate);
        }

        //update option table
        selectOption.updateOptionValTable($, window.Wptm, [0, 0, 0, 0]);

        codemirror_tooltip($);

        $('#list_chart').find('.current_table a').text(Wptm.title);
        if (Wptm.type !== 'html') {
            wptm_element.primary_toolbars.find('.wptm_name_edit').after('<div class="wptm_warning"><p>' + wptmText.notice_msg_table_database + '</p></div>');
            wptm_element.settingTable.find('.table-menu a.source_menu').parent().show();
            if (Wptm.style.table.allRowHeight < 10 || isNaN(Wptm.style.table.allRowHeight)) {
                Wptm.style.table.allRowHeight = 30;
            }
        } else {
            wptm_element.settingTable.find('.table-menu a.source_menu').parent().hide();
        }
        /*render table */
        initHandsontable(Wptm.datas);
        wptm_element.primary_toolbars.find('.wptm_name_edit').click(function () {
            if (!$(this).hasClass('editable')) {
                tableFunction.setText.call(
                    $(this),
                    wptm_element.primary_toolbars.find('.wptm_name_edit'),
                    '#primary_toolbars .wptm_name_edit',
                    {'url': wptm_ajaxurl + "task=table.setTitle&id=" + Wptm.id + '&title=', 'selected': true}
                );
            }
        });

        $(window).bind('keydown', function(event) {//CTRL + S
            if (!(event.which == 83 && (event.ctrlKey || event.metaKey)) && !(event.which == 19)) return true;
            tableFunction.saveChanges(true);
            event.preventDefault();
            return false;
        });
    });
}

//custom cell editor
function codemirror_tooltip($) {
    window.CustomEditor = Handsontable.editors.TextEditor.prototype.extend();

    window.CustomEditor.prototype.init = function () {
        //Call the original createElements method
        Handsontable.editors.TextEditor.prototype.init.apply(this, arguments);
    };

    window.CustomEditor.prototype.open = function () {
        $(this.TEXTAREA).attr('id', 'editor1');
        var cell_html = false;

        if (typeof (Wptm.style.cells[this.row + '!' + this.col]) !== 'undefined' && typeof (Wptm.style.cells[this.row + '!' + this.col][2].cell_type) !== 'undefined' && Wptm.style.cells[this.row + '!' + this.col][2].cell_type === 'html') {
            cell_html = true;
            tinyMCE.EditorManager.execCommand('mceRemoveEditor', true, 'editor1');
            var init = tinymce.extend({}, tinyMCEPreInit.mceInit['editor1']);
            try {
                tinymce.init(init);
            } catch (e) {
            }

            //add tinymce to this
            tinyMCE.EditorManager.execCommand('mceAddEditor', true, 'editor1');
        } else {
            tinyMCE.EditorManager.execCommand('mceRemoveEditor', true, 'editor1');
        }
        Handsontable.editors.TextEditor.prototype.open.apply(this, arguments);

        // change width of popup when click html cell
        if (cell_html) {
            wptm_element.tableContainer.find('.mce-tinymce.mce-container').css({
                'width': wptm_element.tableContainer.width() / 3 + 'px',
                'min-width': '350px'
            })
                .parents('.handsontableInputHolder').css('visibility', 'visible');

            // reset position handsontableInputHolder when this be hidden
            var tdOffset = Handsontable.dom.offset(this.TD);
            var offsetTable = wptm_element.tableContainer.offset();

            var $table = $(wptm_element.tableContainer).find('.wtHider');
            var heightTable = wptm_element.tableContainer.outerHeight() > $table.outerHeight() ? wptm_element.tableContainer.outerHeight() : $table.outerHeight();
            var widthTable = wptm_element.tableContainer.outerWidth() > $table.outerWidth() ? wptm_element.tableContainer.outerWidth() : $table.outerWidth();

            setTimeout(function () {
                var handsontableInputHolder =  wptm_element.tableContainer.find('.handsontableInputHolder');
                handsontableInputHolder.removeClass('wptm_set_top').removeClass('wptm_set_left');

                var height = handsontableInputHolder.outerHeight();
                var width = handsontableInputHolder.outerWidth();
                var offset = handsontableInputHolder.position();

                var position = {};
                var new_top = tdOffset.top - offsetTable.top + height - heightTable + 10;
                var new_left = tdOffset.left - offsetTable.left + width - widthTable + 10;

                if (new_top > 0) {
                    position.top = offset.top - new_top;
                    handsontableInputHolder.css(position).addClass('wptm_set_top').data('tdOffsetTop', tdOffset.top - offsetTable.top);
                }
                if (new_left > 0) {
                    position.left = offset.left - new_left;
                    handsontableInputHolder.css(position).addClass('wptm_set_left').data('tdOffsetLeft', tdOffset.left - offsetTable.left);
                }
            }, 100);

            var that = this;

            $('#wpcontent').unbind('click').click(function(e) {
                var target = $(e.target);
                if (target.parents('.handsontableInputHolder').length < 1 && that.instance.rootElement.classList.contains('notCloseEditer')) {
                    $(that.instance.rootElement).removeClass('notCloseEditer');
                    document.documentElement.dispatchEvent(new Event('mousedown'));
                }
            });

            $(that.TEXTAREA_PARENT).unbind('click').on('click', function() {
                $(that.instance.rootElement).addClass('notCloseEditer');
            });

            $('#adminmenumain').unbind('click').click(function() {
                $(that.instance.rootElement).removeClass('notCloseEditer');
                document.documentElement.dispatchEvent(new Event('mousedown'));
            });

        } else {
            wptm_element.tableContainer.find('.handsontableInputHolder').css('position', 'absolute').css('visibility', 'visible');
        }
    };

    window.CustomEditor.prototype.getValue = function () {
        if (typeof (tinyMCE) !== 'undefined' && tinyMCE.EditorManager.get('editor1')) {
            return tinyMCE.EditorManager.get('editor1').getContent();
        } else {
            return Handsontable.editors.TextEditor.prototype.getValue.apply(this, arguments);
        }
    };

    window.CustomEditor.prototype.setValue = function (newValue) {
        if (typeof (tinyMCE) !== 'undefined' && tinyMCE.EditorManager.get('editor1')) {
            tinyMCE.EditorManager.get('editor1').setContent(newValue);
        } else {
            return Handsontable.editors.TextEditor.prototype.setValue.apply(this, arguments);
        }
    };

    window.CustomEditor.prototype.close = function () {
        if (tableFunction.checkObjPropertyNested(Wptm.style.cells[this.row + '!' + this.col], 2, 'cell_type') && Wptm.style.cells[this.row + '!' + this.col][2].cell_type === 'html') {
            // updateDimession();
        }
        wptm_element.tableContainer.find('.handsontableInputHolder').css('visibility', 'hidden');

        window.currentCell = null;
        return Handsontable.editors.TextEditor.prototype.close.apply(this, arguments);
    };

    //codemirror
    var myTextArea = document.getElementById("jform_css");
    var myCssEditor = CodeMirror.fromTextArea(myTextArea, {mode: "css", lineNumbers: true, theme: '3024-night'});
    var ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var wh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if (window.parent) {
        ww = window.parent.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        wh = window.parent.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    myCssEditor.setSize(ww * 50 / 100, wh - 500);

    wptm_element.primary_toolbars.find('.custom-menu').wptm_leanModal({
        top: 200,
        background: '#ffffff',
        closeButton: '#cancelCssbtn',
        beforeShow: function () {
            var selection = table_function_data.selection;
            var ht = jQuery(Wptm.container).handsontable('getInstance');
            ht.updateSettings({
                cells: function (row, col, prop) {
                    if (selection[0][0] === row && selection[0][1] === col) {
                        var cellProperties = {};

                        cellProperties.readOnly = true;
                        return cellProperties;
                    }
                }
            });
            window.jquery(Wptm.container).handsontable("selectCell", selection[0][0], selection[0][1], selection[0][0], selection[0][1]);
        },
        before_colose_modal: function () {
            var selection = table_function_data.selection;

            var ht = jQuery(Wptm.container).handsontable('getInstance');
            ht.updateSettings({
                cells: function (row, col, prop) {
                    if (selection[0][0] === row && selection[0][1] === col) {
                        var cellProperties = {};

                        cellProperties.readOnly = false;
                        return cellProperties;
                    }
                }
            });
            window.jquery(Wptm.container).handsontable("selectCell", selection[0][0], selection[0][1], selection[0][0], selection[0][1]);
        },
        modalShow: function () {
            myCssEditor.refresh();
            myCssEditor.focus();
        }
    });

    $(myTextArea).on('change', function () {
        myCssEditor.setValue($(myTextArea).val().replace(/\\n/g, "\n"));
    });

    // myCssEditor.on("blur", function() {
    $("#saveCssbtn").click(function () {
        myCssEditor.save();
        tableFunction.parseCss($);
        $(myTextArea).trigger("propertychange");
        //close leanModal
        $("#lean_overlay").fadeOut(200);
        $("#wptm_customCSS").css({"display": "none"})
    });

    wptm_element.editToolTip.wptm_leanModal({
        top: 100, background: '#ffffff', closeButton: '#cancelToolTipbtn', modalShow: function () {
        }
    });

    wptm_element.saveToolTipbtn.click(function () {
        var ttEditor = tinyMCE.EditorManager.get('tooltip_content');
        ttEditor.save();
        $("#tooltip_content").trigger("change");
        //close leanModal
        $("#lean_overlay").fadeOut(200);

        $("#wptm_editToolTip").css({"display": "none"});
        $('#edit_toolTip').trigger('change');
    })

    tinyMCEPreInit.mceInit['editor1'] = tinyMCEPreInit.mceInit['wptmditor'];
    tinyMCEPreInit.mceInit['tooltip_content'] = tinyMCEPreInit.mceInit['wptm_tooltip'];
    tinyMCE.EditorManager.execCommand('mceRemoveEditor', true, 'wptmditor');
    $('#wp-wptmditor-wrap').hide();
}

//fetch google sheet, import file excel
function fetchSpreadsheet(obj) {
    tableFunction.loading(wptm_element.wpreview);

    var auto_sync, spreadsheet_style, url;
    var $close_popup = wptm_element.wptm_popup.find('.colose_popup');
    var loader = wptm_element.wptm_popup.find('.lds-ring');
    var popup_notification = wptm_element.wptm_popup.find('.popup_notification');

    if (obj.type === 'spreadsheet') {
        url = encodeURI(Wptm.style.table.spreadsheet_url);
        auto_sync = Wptm.style.table.auto_sync != '1' ? 0 : 1;
        spreadsheet_style = Wptm.style.table.spreadsheet_style != '1' ? 0 : 1;
        if (url.indexOf("docs.google.com/spreadsheet") === -1) {
            bootbox.alert(wptmText.error_link_google_sync, wptmText.GOT_IT);
            Wptm.style.table.spreadsheet_url = '';
            return;
        }

        //check publish link
        var end_link = url.split('?');
        var end_link0 = end_link[0].slice(-5);

        if (end_link0.match(/html|csv|pdf|xlsx/gi) === null && (typeof end_link[1] !== "undefined" && end_link[1].match(/html|csv|pdf|xlsx/gi) === null)) {
            bootbox.alert(wptmText.error_link_google_sync, wptmText.GOT_IT);
            Wptm.style.table.spreadsheet_url = '';
            return;
        }
    } else {
        url = encodeURI(Wptm.style.table.excel_url);
        auto_sync = Wptm.style.table.excel_auto_sync != '1' ? 0 : 1;
        spreadsheet_style = Wptm.style.table.excel_spreadsheet_style != '1' ? 0 : 1;
        if (url.indexOf("docs.google.com/spreadsheet") !== -1) {
            bootbox.alert(wptmText.error_link_import_sync, wptmText.GOT_IT);
            Wptm.style.table.excel_url = '';
            return;
        }
    }

    var jsonVar = {
        spreadsheet_url: url,
        id: Wptm.id,
        sync: auto_sync,
        syncType: obj.type,
        style: spreadsheet_style
    };
    delete table_function_data.fetch_data;

    jquery.ajax({
        url: wptm_ajaxurl + "task=excel.fetchSpreadsheet&id=" + Wptm.id,
        type: "POST",
        data: jsonVar,
        beforeSend: function() {
            loader.removeClass('wptm_hiden');
            popup_notification.addClass('wptm_hiden');
        },
        success: function (datas) {
            loader.addClass('wptm_hiden');
            var result = jQuery.parseJSON(datas);
            if (result.response === true) {
                if (obj.type === 'spreadsheet') {
                    // table_function_data.auto_sync = result.datas.sync;
                    table_function_data.spreadsheet_style = result.datas.style;
                    table_function_data.spreadsheet_url = Wptm.style.table.spreadsheet_url;
                } else {
                    // table_function_data.excel_auto_sync = result.datas.sync;
                    table_function_data.excel_spreadsheet_style = result.datas.style;
                    table_function_data.excel_url = Wptm.style.table.excel_url;
                }
                updatepreview(Wptm.id);
                popup_notification.html('<span class="noti_success">'+wptmText.DATA_HAS_BEEN_FETCHED+'</span>');
                popup_notification.removeClass('wptm_hiden');
                $close_popup.trigger('click');
            } else {
                popup_notification.html('<span class="noti_false">'+result.response+'</span>');
                popup_notification.removeClass('wptm_hiden');
            }
            tableFunction.rloading(wptm_element.wpreview);
        },
        error: function (jqxhr, textStatus, error) {
            popup_notification.html('<span class="noti_false">'+wptmText.have_error+'</span>');
            popup_notification.removeClass('wptm_hiden');
            tableFunction.rloading(wptm_element.wpreview);
        }
    });
}

function updateDimession() {
    var rows = [];
    var i = 0;
    for (var row in Wptm.style.rows) {
        var h = jQuery('#tableContainer .ht_master .htCore tr').eq(i + 1).height();
        rows[row] = h;
        i++;
    }

    jQuery(Wptm.container).handsontable('updateSettings', {rowHeights: rows});

    var ht = jQuery(Wptm.container).handsontable('getInstance');
    ht.runHooks('afterRowResize');
}

export default {
    updatepreview,
    fetchSpreadsheet
};
