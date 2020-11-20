/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/admin/assets/js/_alternating.js":
/*!*********************************************!*\
  !*** ./app/admin/assets/js/_alternating.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_functions */ "./app/admin/assets/js/_functions.js");
//alternate color handling functions


const alternating = {
    /**
     * Check that the selection matches the saved alternate values
     *
     * @param selection
     * @param oldAlternate
     * @returns {*}
     */
    setNumberAlternate : (selection, oldAlternate) => {
        var count = _.size(oldAlternate);

        window.jquery.each(oldAlternate, function (i, v) {
            if (typeof v.selection !== 'undefined') {
                if (v.selection[0] == selection[0] &&
                    v.selection[1] == selection[1] &&
                    v.selection[2] == selection[2] &&
                    v.selection[3] == selection[3]) {
                    count = i;
                }
            } else {
                return count;
            }
        });

        return count;
    },
    /**
     * when select alternating_color
     *
     * @param value
     * @param selection
     * @param count
     */
    selectAlternatingColor : (value, selection, count) => {//when select alternating_color
        //ij is row, ik is coll
        var ij, ik;
        var beforeChange = window.jquery.extend({}, window.Wptm.style.cells);
        var size = _.size(window.table_function_data.checkChangeAlternate);
        window.table_function_data.checkChangeAlternate[size] = {};

        for (ij = selection[0]; ij <= selection[2]; ij++) {
            for (ik = selection[1]; ik <= selection[3]; ik++) {
                if (typeof (beforeChange[ij + "!" + ik]) !== 'undefined') {
                    window.table_function_data.checkChangeAlternate[size][ij + "!" + ik] = beforeChange[ij + "!" + ik][2].AlternateColor;
                    beforeChange[ij + "!" + ik][2] = window.jquery.extend(beforeChange[ij + "!" + ik][2], {AlternateColor: count});
                } else { //cell not have style
                    beforeChange[ij + "!" + ik] = [ij, ik, {}];
                    beforeChange[ij + "!" + ik][2] = {AlternateColor: count};
                }
                if (typeof window.table_function_data.checkChangeAlternate[size][ij + "!" + ik] === 'undefined' || window.table_function_data.checkChangeAlternate[size][ij + "!" + ik] === null) {
                    window.table_function_data.checkChangeAlternate[size][ij + "!" + ik] = -1;
                }
            }
        }

        window.Wptm.style.cells = beforeChange;

        var listChangeAlternate = [];
        var i = count, oldCount = count;
        window.table_function_data.changeAlternate = [];
        for (var ii = count - 1; ii >= 0; ii--) {
            var check = 1;
            if(value[ii].selection[0] >= value[i].selection[0]) {
                check++;
            }

            if(value[ii].selection[1] >= value[i].selection[1]) {
                check++;
            }

            if(value[ii].selection[2] <= value[i].selection[2]) {
                check++;
            }

            if(value[ii].selection[3] <= value[i].selection[3]) {
                check++;
            }

            if (check === 5) {
                value[ii] = value[count];
                listChangeAlternate[ii] = count;
                if (typeof listChangeAlternate[count] !== 'undefined') {
                    listChangeAlternate[ii] = listChangeAlternate[count];
                    delete listChangeAlternate[count];
                }
                delete value[count];
                count--;
                i = ii;
            }
        }
        for (var j = 0; j < oldCount; j ++) {
            if (typeof listChangeAlternate[j] !== 'undefined') {
                window.table_function_data.changeAlternate[listChangeAlternate[j]] = j;
            }
        }
        window.table_function_data.alternateIndex = count;
        window.table_function_data.alternateSelection = selection;
    },
    /**
     * Cancel alternateColor
     */
    reAlternateColor : () => {
        var styleCells = {};
        styleCells = window.jquery.extend({}, Wptm.style.cells);

        for (var i = _.size(window.table_function_data.checkChangeAlternate) - 1; i >= 0; i--) {
            window.jquery.map(window.table_function_data.checkChangeAlternate[i], function (v, ii) {
                if (typeof styleCells[ii] !== 'undefined') {
                    if (v !== -1) {
                        styleCells[ii][2].AlternateColor = v;
                    } else {
                        delete styleCells[ii][2].AlternateColor;
                    }
                }
            });
        }

        window.table_function_data.checkChangeAlternate = [];
        return styleCells;
    },
    /**
     * Set alternate color by alternate_row_odd_color option(in params)
     *
     * @param styleRows style.rows
     * @param Wptm
     * @param $element
     */
    setAlternateColor : (styleRows, Wptm, $element) => {
        Wptm.style.table.alternateColorValue = {};

        if (typeof Wptm.container !== 'undefined') {
            var countCols = Wptm.container.handsontable('countCols');
            var countRows = Wptm.container.handsontable('countRows');
        } else {/*get count cols, rows when handsontable not activated*/
            countCols = Wptm.datas[0].length - 1;
            countRows = Wptm.datas.length - 1;
        }

        var checkExistAlternateOld = 0;
        var checkExistAlternateEven = 0;

        if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(Wptm.style.table, 'alternate_row_odd_color') && Wptm.style.table.alternate_row_odd_color) {
            checkExistAlternateOld = 1;
            // Wptm.style.table.alternate_row_odd_color;
        }
        if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(Wptm.style.table, 'alternate_row_even_color') && Wptm.style.table.alternate_row_even_color) {
            checkExistAlternateEven = 1;
            // Wptm.style.table.alternate_row_even_color;
        }

        var header = '';
        if (styleRows !== null && typeof styleRows[0][1].cell_background_color !== 'undefined') {
            header = styleRows[0][1].cell_background_color;
        }

        if (checkExistAlternateEven + checkExistAlternateOld > 0) {
            Wptm.style.table.alternateColorValue = {};
            Wptm.style.table.alternateColorValue[0] = {};
            Wptm.style.table.alternateColorValue[0].selection = [0, 0, countRows, countCols];
            Wptm.style.table.alternateColorValue[0].footer = '';
            Wptm.style.table.alternateColorValue[0].even = checkExistAlternateEven === 1 ? Wptm.style.table.alternate_row_even_color : '#ffffff';
            Wptm.style.table.alternateColorValue[0].header = header;
            Wptm.style.table.alternateColorValue[0].old = checkExistAlternateOld === 1 ? Wptm.style.table.alternate_row_odd_color : '#ffffff';
            Wptm.style.table.alternateColorValue[0].default = '' + header + '|' + Wptm.style.table.alternateColorValue[0].even + '|' + Wptm.style.table.alternateColorValue[0].old + '|' + '';
            saveData.push({action: 'style', selection: [[0, 0, countRows, countCols]], style: {AlternateColor: 0}});
        }

        Wptm.style.table.alternate_row_even_color = null;
        Wptm.style.table.alternate_row_odd_color = null;

        if (typeof Wptm.style.table.alternateColorValue[0] !== 'undefined') {
            var ij, ik;
            for (ij = 0; ij <= countRows; ij++) {
                for (ik = 0; ik <= countCols; ik++) {
                    if (typeof (Wptm.style.cells[ij + "!" + ik]) !== 'undefined') {
                        Wptm.style.cells[ij + "!" + ik][2].AlternateColor = 0;
                    } else {
                        Wptm.style.cells[ij + "!" + ik] = [ij, ik, {}];
                        Wptm.style.cells[ij + "!" + ik][2] = jQuery.extend({}, {AlternateColor: 0});
                    }
                    if (header !== '' && ij === 0) {
                        delete Wptm.style.cells[ij + "!" + ik][2].cell_background_color;
                    }
                }
            }
        }

        window.Wptm = window.jquery.extend({}, Wptm);
    },
    /**
     * add new alternate to saving function and Wptm.style.table
     */
    applyAlternate : function () { //save oldAlternate value to Wptm and save
        window.Wptm.style.table.alternateColorValue = window.jquery.extend({}, window.table_function_data.oldAlternate);
        window.Wptm.style.table.allAlternate = window.jquery.extend({}, window.table_function_data.allAlternate);

        if(window.table_function_data.alternateIndex !== '') {
            window.table_function_data.save_table_params.push({action: 'style', selection: [window.table_function_data.alternateSelection], style: {AlternateColor: window.table_function_data.alternateIndex}});
        }
        window.table_function_data.checkChangeAlternate = [];

        _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges(true);
        this.siblings('.colose_popup').trigger('click');
    },
    /**
     * set the change options of altenate when selector cell/change rangeLabe
     * @param Wptm
     * @param $
     */
    affterRangeLabe : function (Wptm, $) {
        try {
            var rangeLabel = this.find('.cellRangeLabelAlternate').val();
            rangeLabel = rangeLabel.replace(/[ ]+/g, "").toUpperCase();
            var arrayRange = rangeLabel.split(":");
            if (arrayRange.length > 1) {
                var selection = [];
                selection.push(parseInt(arrayRange[0].split(/[ |A-Za-z]+/g)[1]) - 1);
                selection.push(_functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertStringToNumber(arrayRange[0].split(/[ |1-9]+/g)[0]) - 1);
                selection.push(parseInt(arrayRange[1].split(/[ |A-Za-z]+/g)[1]) - 1);
                selection.push(_functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertStringToNumber(arrayRange[1].split(/[ |1-9]+/g)[0]) - 1);
                if (Wptm.type === 'mysql') {
                    if (selection[2] + selection[0] === 0) {
                        this.find('.wptm_range_labe_show').removeClass('wptm_hiden');
                    } else {
                        this.find('.wptm_range_labe_show').addClass('wptm_hiden');
                    }
                }
                $(Wptm.container).handsontable("selectCell", selection[0], selection[1], selection[2], selection[3]);

                if (typeof this.find('.cellRangeLabelAlternate').data('text_change') !== 'undefined') {
                    if (this.find('.cellRangeLabelAlternate').hasClass('select_row')) {
                        if (selection[0] === selection[2]) {
                            $(this.find('.cellRangeLabelAlternate').data('text_change')).text(wptmContext.rows_height);
                        } else {
                            $(this.find('.cellRangeLabelAlternate').data('text_change')).text(wptmContext.rows_height_start + (selection[0] + 1) + '-' + (selection[2] + 1));
                        }
                    } else if (this.find('.cellRangeLabelAlternate').hasClass('select_column')) {
                        $(this.find('.cellRangeLabelAlternate').data('text_change')).text(wptmContext.columns_width_start
                            + arrayRange[0].split(/[ |1-9]+/g)[0] + '-' + arrayRange[1].split(/[ |1-9]+/g)[0]);
                    } else {
                        $(this.find('.cellRangeLabelAlternate').data('text_change')).text(rangeLabel);
                    }
                }
            }
        } catch (err) {}
    },
    /**
     * active alternating
     *
     * @param format
     */
    getActiveFormatColor: (format) => {
        $alternating_color.find('.formatting_style .pane-color-tile').each(function () {
            if (window.jquery(this).find('.pane-color-tile-1').data('value') === format.even) {
                if (window.jquery(this).find('.pane-color-tile-2').data('value') === format.old) {
                    var check = 0;
                    if (format.header !== '') {
                        check = format.header === window.jquery(this).find('.pane-color-tile-header').data('value') ? 1 : -1;
                    } else {
                        check = 1;
                    }

                    if (format.footer !== '') {
                        check = format.footer === window.jquery(this).find('.pane-color-tile-footer').data('value') ? check : -1;
                    }

                    switch (check) {
                        case 1:
                            window.jquery(this).addClass('active');
                            break;
                        case -1:
                            // No active
                            break;
                    }
                }
            }
        });
    },
    /**
     * handsontable render after set alternating
     */
    renderCell : () => { //render cells
        window.jquery(window.Wptm.container).handsontable('render');
    }
}

/* harmony default export */ __webpack_exports__["default"] = (alternating);


/***/ }),

/***/ "./app/admin/assets/js/_changeTheme.js":
/*!*********************************************!*\
  !*** ./app/admin/assets/js/_changeTheme.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alternating__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_alternating */ "./app/admin/assets/js/_alternating.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_functions */ "./app/admin/assets/js/_functions.js");
/* harmony import */ var _toolbarOptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_toolbarOptions */ "./app/admin/assets/js/_toolbarOptions.js");




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

                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].mergeCollsRowsstyleToCells();

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

                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].pullDims(Wptm, $, false);

                    Wptm.container.handsontable('updateSettings', Wptm.updateSettings);

                    setTimeout(function () {
                        saveData = [];
                        if (typeof (window.Wptm.style.table.alternateColorValue) === 'undefined' || typeof window.Wptm.style.table.alternateColorValue[0] === 'undefined') {
                            // alternating.setAlternateColor(style.rows);
                            _alternating__WEBPACK_IMPORTED_MODULE_0__["default"].setAlternateColor(Wptm.style.rows, window.Wptm, window.wptm_element);
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].cleanHandsontable();
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
                    },200);

                    if (table_function_data.selectionSize > 0) { //when have select cell
                        _toolbarOptions__WEBPACK_IMPORTED_MODULE_2__["default"].loadSelection($, Wptm, table_function_data.selection);
                    }
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].parseCss($);
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

/* harmony default export */ __webpack_exports__["default"] = (change_theme);


/***/ }),

/***/ "./app/admin/assets/js/_chart.js":
/*!***************************************!*\
  !*** ./app/admin/assets/js/_chart.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_functions */ "./app/admin/assets/js/_functions.js");
/* harmony import */ var _alternating__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_alternating */ "./app/admin/assets/js/_alternating.js");



/* Chart functions */
var DropChart = {};
DropChart.default = {
    "dataUsing": "row",
    "switchDataUsing": true,
    "useFirstRowAsLabels": true,
    "width": 500,
    "height": 375,
    "chart_align": "center",
    "scaleShowGridLines": false,
    "scaleBeginAtZero": false,
};
DropChart.default.colors = "#DCDCDC,#97BBCD,#4C839E";
DropChart.default.pieColors = "#F7464A,#46BFBD,#FDB45C,#949FB1,#4D5360";
DropChart.datas = {};

DropChart.functions = {};

//get list chart of table
DropChart.functions.loadCharts = function () {
    var $ = jquery;

    if (typeof idTable !== 'undefined' && idTable !== '') {
        var url = wptm_ajaxurl + "view=charts&format=json&id_table=" + idTable;
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
        }).done(function (data) {
            var i = 0;
            for (i = 0; i < data.length; i++) {
                var cells = $.parseJSON(data[i].datas);
                if ($.isArray(cells) !== false || cells.length !== 0) {
                    DropChart.datas[data[i].id] = {
                        author: data[i].author,
                        config: $.parseJSON(data[i].config),
                        data: cells,
                        title: data[i].title,
                        type: data[i].type,
                    };
                    $('#list_chart').append('<li class="chart-menu" data-id="' + data[i].id + '"><a>' + data[i].title + '</a></li>');
                }
            }
            wptm_chart();
        });
    }
}

function wptm_chart(first_load) {
    var $ = jquery;
    var $wptm_top_chart = $('#wptm_chart').find('.wptm_left_content .wptm_top_chart');
    $('#list_chart').find('.chart-menu').unbind('click').on('click', function (e) {
        var chart_name = '';
        if (!$(this).data('id')) {
            $(this).closest('.chart-menu').siblings('.chart-menu').removeClass('active');
            var chart_id = $(this).closest('.chart-menu').data('id');
            $(this).closest('.chart-menu').addClass('active');
            chart_name = $(this).text();
        } else {
            $(this).siblings('.chart-menu').removeClass('active');
            var chart_id = $(this).data('id');
            $(this).addClass('active');
            chart_name = $(this).find('a').text();
        }
        $wptm_top_chart.find('.wptm_name_edit').text(chart_name);

        if ($('#inserttable').length > 0) {
            Wptm.chart_active = chart_id;
            $('#inserttable').removeClass("no_click").data('type', 'chart').attr('data-type', 'chart').text(insert_chart);
        }

        if(first_load) {
            DropChart.functions.render(chart_id, false, first_load);
        } else {
            DropChart.functions.render(chart_id);
        }
        return;
    });

    if (typeof Wptm.chart_active !== 'undefined' && parseInt(Wptm.chart_active) > 0) {
        if ($('.over_popup').length > 0) {
            $('.over_popup').hide();
        }
        _functions__WEBPACK_IMPORTED_MODULE_0__["default"].showChartOrTable(true, $('#list_chart').find('.chart-menu[data-id="' + Wptm.chart_active + '"]'));
    }

    $wptm_top_chart.find('.edit').unbind('click').on('click', function (e) {
        $wptm_top_chart.find('.wptm_name_edit').addClass('rename');
        $wptm_top_chart.find('.wptm_name_edit').trigger('click');
    });

    $wptm_top_chart.find('.wptm_name_edit').click(function () {
        if (!$(this).hasClass('editable')) {
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].setText.call(
                $(this),
                $wptm_top_chart.find('.wptm_name_edit'),
                '#wptm_chart .wptm_name_edit',
                {
                    'url': wptm_ajaxurl + "task=chart.setTitle&id=" + DropChart.id_chart + '&title=',
                    'selected': true,
                    'action': function (obj) {
                        if (arguments[0] != '') {
                            $('#list_chart').find('.chart-menu.active a').text(arguments[0]);
                        }
                    }
                }
            );
        }
    });

    $wptm_top_chart.find('.trash').unbind('click').on('click', function (e) {
        var that = this;
        var list_chart = $('#list_chart');
        bootbox.confirm(wptmText.JS_WANT_DELETE + "\"" + $(this).siblings('.wptm_name_edit').text().trim() + '"?', wptmText.Cancel, wptmText.Ok, function (result) {
            if (result === true) {
                $.ajax({
                    url: wptm_ajaxurl + "task=chart.delete&id=" + DropChart.id_chart,
                    type: "POST",
                    dataType: "json",
                    success: function (datas) {
                        if (datas.response === true) {
                            list_chart.find('li.chart-menu[data-id="' + DropChart.id_chart + '"]').remove();
                            wptm_element.wptmContentChart.find('canvas.wptm_chart_' + DropChart.id_chart).remove();
                            if (list_chart.find('li.chart-menu').length > 1) {
                                list_chart.find('.chart-menu').eq(0).trigger('click');
                            } else {
                                list_chart.find('.current_table').trigger('click');
                            }
                        } else {
                            bootbox.alert(datas.response, wptmText.Ok);
                        }
                    },
                    error: function (jqxhr, textStatus, error) {
                        bootbox.alert(textStatus, wptmText.Ok);
                    }
                });
                return false;
            }
        });
    });
    wptm_element.chartTabContent.find('.copy_shortcode').unbind('click').on('click', function (e) {
        wptm_element.chartTabContent.find('.controls[name="shortcode"] input').select();
        document.execCommand('copy');
    });
    Wptm.dataChart = $.extend([], DropChart.datas);
}

function updateOption(chartData) {
    var $ = jquery;
    //get cell range label to input selected range and add range to handsontable
    var selection = DropChart.helper.getCellRangeLabel(DropChart.cells);
    var cellRangeLabel = Handsontable.helper.spreadsheetColumnLabel(selection[1]) + '' + (selection[0] + 1);
    cellRangeLabel += ":" + Handsontable.helper.spreadsheetColumnLabel(selection[3]) + '' + (selection[2] + 1);
    wptm_element.chartTabContent.find('.cellRangeLabelAlternate').val(cellRangeLabel);
    Wptm.container.handsontable("selectCell", selection[0], selection[1], selection[2], selection[3]);

    if (typeof chartData.type !== 'undefined') {
        wptm_element.chartTabContent.find('.controls[name="type"]').find('img').each(function () {
            $(this).removeClass('active');
            if ($(this).attr('alt') === chartData.type) {
                $(this).addClass('active');
            }
        });

        var $dataset_select = wptm_element.chartTabContent.find('.controls[name="dataset_select"] select');
        var $dataset_color = wptm_element.chartTabContent.find('.controls[name="dataset_color"] input.minicolors');
        $dataset_select.html("");
        if (DropChart.type == "Line" || DropChart.type == "Bar" || DropChart.type == "Radar") {
            for (var i = 0; i < DropChart.datasets.length; i++) {
                $dataset_select.append('<option value="' + i + '">' + DropChart.datasets[i].label + '</option>');
            }
            $dataset_select.trigger('liszt:updated');
            $dataset_color.wpColorPicker('color', DropChart.config.colors.split(",")[0]);
        } else {
            var chartData = {};
            chartData.datasets = DropChart.datasets;
            chartData.labels = DropChart.labels;
            var pieDatas = convertForPie(chartData, DropChart.config.pieColors);
            for (var i = 0; i < pieDatas.length; i++) {
                $dataset_select.append('<option value="' + i + '">' + pieDatas[i].label + '</option>');
            }
            $dataset_select.trigger('liszt:updated');
            $dataset_color.wpColorPicker('color', pieDatas[0].color);
        }
    }

    if (typeof DropChart.id_chart !== 'undefined') {
        wptm_element.chartTabContent.find('.controls[name="shortcode"] input').val('[wptm id-chart=' + DropChart.id_chart + ']');
    }
    if (typeof DropChart.config.dataUsing !== 'undefined') {
        wptm_element.chartTabContent.find('.controls[name="dataUsing"] select').val(DropChart.config.dataUsing).change();
    }
    if (typeof DropChart.config.useFirstRowAsLabels !== 'undefined') {
        wptm_element.chartTabContent.find('.controls[name="useFirstRowAsLabels"] input')
            .val(DropChart.config.useFirstRowAsLabels === true ? 'yes' : 'no').prop("checked", DropChart.config.useFirstRowAsLabels);
    }
    if (typeof DropChart.config.width !== 'undefined') {
        wptm_element.chartTabContent.find('.controls[name="width"] input').val(DropChart.config.width).change();
    }
    if (typeof DropChart.config.height !== 'undefined') {
        wptm_element.chartTabContent.find('.controls[name="height"] input').val(DropChart.config.height).change();
    }
    if (typeof DropChart.config.chart_align !== 'undefined') {
        wptm_element.chartTabContent.find('.controls[name="chart_align"] select').val(DropChart.config.chart_align).change();
        wptm_element.wptmContentChart.css('text-align', DropChart.config.chart_align);
    }
    DropChart.optionsChanged = true
}

//action option changing
function initChartObserver() {
    if (!(Wptm.can.edit || (Wptm.can.editown && data.author === Wptm.author))) {
        return false;
    }
    var $ = jquery;

    $('#wptm_chart .option_chart').unbind('change').on('change', function (e) {
        if (DropChart.optionsChanged !== true) {
            return;
        }
        var dropChart = DropChart.datas[DropChart.id_chart];

        switch ($(this).parents('.controls').attr('name')) {
            case 'Shortcode':
                break;
            case 'dataUsing':
                dropChart.config.dataUsing = $(this).val();
                var dataSets = DropChart.functions.getDataSets(DropChart.cells, dropChart.config.dataUsing);
                DropChart.datasets = addChartStyles(dataSets[0], dropChart.config.colors);  // dataSets[0];
                if (dropChart.config.useFirstRowAsLabels) {
                    DropChart.labels = dataSets[1];
                } else {
                    DropChart.labels = DropChart.helper.getEmptyArray(dataSets[1].length);
                }
                DropChart.functions.render(DropChart.id_chart, false, true);
                break;
            case 'useFirstRowAsLabels':
                if ($(this).is(":checked")) {
                    dropChart.config.useFirstRowAsLabels = true;
                } else {
                    dropChart.config.useFirstRowAsLabels = false;
                }
                var dataSets = DropChart.functions.getDataSets(DropChart.cells, dropChart.config.dataUsing);
                DropChart.datasets = addChartStyles(dataSets[0], dropChart.config.colors);  // dataSets[0];
                if (dropChart.config.useFirstRowAsLabels) {
                    DropChart.labels = dataSets[1];
                } else {
                    DropChart.labels = DropChart.helper.getEmptyArray(dataSets[1].length);
                }
                DropChart.functions.render(DropChart.id_chart, false, true);
                break;
            case 'width':
                dropChart.config.width = parseInt($(this).val());
                DropChart.functions.render(DropChart.id_chart, true, true);
                break;
            case 'height':
                dropChart.config.height = parseInt($(this).val());
                DropChart.functions.render(DropChart.id_chart, true, true);
                break;
            case 'chart_align':
                dropChart.config.chart_align = $(this).val();
                if (dropChart.config.chart_align !== 'none') {
                    wptm_element.wptmContentChart.css('text-align', dropChart.config.chart_align);
                } else {
                    wptm_element.wptmContentChart.css('text-align', 'left');
                }
                break;
            case 'dataset_select':
                var index = parseInt($(this).val());
                var $dataset_color = wptm_element.chartTabContent.find('.controls[name="dataset_color"] input.minicolors');
                if (DropChart.type == "Line" || DropChart.type == "Bar" || DropChart.type == "Radar") {
                    if (dropChart.config.colors.split(",").length > index) {
                        $dataset_color.wpColorPicker('color', dropChart.config.colors.split(",")[index]);
                    } else {
                        $dataset_color.wpColorPicker('color', "");
                    }
                } else {
                    if (dropChart.config.pieColors.split(",").length > index) {
                        $dataset_color.wpColorPicker('color', dropChart.config.pieColors.split(",")[index]);
                    } else {
                        $dataset_color.wpColorPicker('color', "");
                    }
                }
                DropChart.functions.render(DropChart.id_chart, true, true);
                break;
            case 'dataset_color':
                var index = parseInt(wptm_element.chartTabContent.find('.controls[name="dataset_select"] select').val());
                if (DropChart.type == "Line" || DropChart.type == "Bar" || DropChart.type == "Radar") {
                    var colors = dropChart.config.colors.split(",");
                    if (colors.length > index) {
                        colors[index] = $(this).val();
                    }
                    dropChart.config.colors = colors.join(",");
                    var dataSets = DropChart.functions.getDataSets(DropChart.cells, dropChart.config.dataUsing);
                    DropChart.datasets = addChartStyles(dataSets[0], dropChart.config.colors);
                } else {
                    var pieColors = dropChart.config.pieColors.split(",");
                    if (pieColors.length <= index) {
                        var maxLabels = DropChart.labels.length;
                        var maxPieColors = pieColors.length;
                        var i;
                        for (i = 0; i < maxLabels; i++) {
                            pieColors[i] = pieColors[i % maxPieColors];
                        }
                    }
                    pieColors[index] = $(this).val();
                    dropChart.config.pieColors = pieColors.join(",");
                }
                DropChart.functions.render(DropChart.id_chart, true, true);
                break;
            default:
                break;
        }
    });

    $('#wptm_chart .option_chart').unbind('click').on('click', function (e) {
        if (DropChart.optionsChanged !== true) {
            return;
        }
        var dropChart = DropChart.datas[DropChart.id_chart];

        switch ($(this).parents('.controls').attr('name')) {
            case 'type':
                changeStyleChart($(this).data('id'));
                break;
            case 'changerChart':
                _alternating__WEBPACK_IMPORTED_MODULE_1__["default"].affterRangeLabe.call(wptm_element.chartTabContent, window.Wptm, window.jquery);
                changerRangeChart();
                break;
            default:
                break;
        }
    });
}

function changeStyleChart(charttype_id) {
    var $ = jquery;
    var id_chart = DropChart.id_chart;
    $.ajax({
        url: wptm_ajaxurl + "view=charttype&format=json&id=" + charttype_id,
        type: 'POST'
    }).done(function (data) {
        if (typeof (data) === 'object') {
            //local save
            $.extend(DropChart.datas[id_chart].config, $.parseJSON(data.config));
            DropChart.datas[id_chart].type = data.name;

            DropChart.functions.render(id_chart, false, true);
        }
    });
}

function changerRangeChart() {
    var $ = jquery;
    var id_chart = DropChart.id_chart;
    var dataChart = DropChart.datas[id_chart];

    var dataCell = DropChart.functions.validateChartData();
    if (dataCell === false) {
        bootbox.alert(wptmText.CHART_INVALID_DATA, wptmText.GOT_IT);
    } else {
        dataChart.data = dataCell;
        DropChart.changer = true;
        DropChart.functions.render(id_chart, false, true);
    }
}

function convertForPie(lineChartData, colors) {
    if (lineChartData.datasets.length == 0) {
        return false;
    }
    var datas = [];
    var dataset = lineChartData.datasets[0].data;

    for (var i = 0; i < dataset.length; i++) {
        var data = {};
        data.value = Number(dataset[i]);
        data.label = lineChartData.labels[i];
        data.color = getColor(i, colors);
        data.highlight = DropChart.helper.ColorLuminance(data.color, 0.3);
        datas[i] = data;
    }

    return datas;
}

function getStyleSet(i, colors) {
    var styleSet = {};

    var color = getColor(i, colors);
    if (color != "") {
        styleSet.fillColor = DropChart.helper.convertHex(color, 20);
        styleSet.strokeColor = DropChart.helper.convertHex(color, 50);
        styleSet.pointColor = DropChart.helper.convertHex(color, 100);
        styleSet.pointColor = "#fff";
        styleSet.pointHighlightFill = "#fff";
        styleSet.pointColor = DropChart.helper.convertHex(color, 100);
    }

    return styleSet;
}

function getColor(i, colors) {
    var result = "";
    var arrColors = colors.split(",");
    var len = arrColors.length;
    if (len > 0) {
        result = arrColors[i % len];
    }

    return result;
}

function addChartStyles(dataSets, colors) {
    var result = [];
    var dataset, styleSet;
    for (var i = 0; i < dataSets.length; i++) {
        dataset = dataSets[i];
        styleSet = getStyleSet(i, colors);
        jquery.extend(dataset, styleSet);
        result.push(dataset);
    }

    return result;
}

DropChart.functions.addChart = function () {
    if ((typeof idTable !== 'undefined' && idTable !== '') || table_function_data.selectionSize < 2) {
        var $ = jquery;
        var selection = DropChart.functions.validateChartData();

        if (selection === false) {
            bootbox.alert(wptmText.CHART_INVALID_DATA + '<img src="' + wptm_admin_asset + '/images/Create-chart.gif" style="width: 100%;margin-top: 20px"/>', wptmText.GOT_IT);
            return;
        }

        $.ajax({
            url: wptm_ajaxurl + "task=chart.add&id_table=" + idTable,
            type: "POST",
            dataType: "json",
            data: {datas: JSON.stringify(selection)},
            beforeSend: function () {
                wptm_element.settingTable.find('.ajax_loading').addClass('loadding').removeClass('wptm_hiden');
                wptm_element.primary_toolbars.find('.new_chart_menu').closest('li').addClass('menu_loading');
            },
            success: function (datas) {
                wptm_element.settingTable.find('.ajax_loading').removeClass('loadding').addClass('wptm_hiden');
                if (datas.response === true) {
                    var count = $('#list_chart').find('li.chart-menu').length;
                    var data_chart = datas.datas;
                    $('#list_chart').append('<li class="chart-menu" data-id="' + data_chart.id + '"><a>' + data_chart.title + '</a></li>');
                    DropChart.datas[data_chart.id] = {
                        config: DropChart.default,
                        data: $.parseJSON(data_chart.datas),
                        title: data_chart.title,
                        type: "Line",
                    };
                    wptm_chart(true);
                    _functions__WEBPACK_IMPORTED_MODULE_0__["default"].showChartOrTable(true, $('#list_chart').find('.chart-menu').eq(count));
                } else {
                    bootbox.alert(datas.response, wptmText.Ok);
                }
            },
            error: function (jqxhr, textStatus, error) {
                wptm_element.settingTable.find('.ajax_loading').removeClass('loadding').addClass('wptm_hiden');
                bootbox.alert(textStatus + " : " + error, wptmText.Ok);
            }
        });
    } else {
        bootbox.alert(wptmText.CHART_INVALID_DATA, wptmText.GOT_IT);
    }
}

DropChart.functions.render = function (chart_id, re_render, save_chart) {
    var $ = jquery;
    DropChart.id_chart = chart_id;
    var datas = DropChart.datas[chart_id];
    DropChart.cells = datas.data;

    try {
        DropChart.config = $.extend({}, DropChart.default, datas.config);
    } catch (e) {
        DropChart.config = $.extend({}, DropChart.default, $.parseJSON(datas.config));
    }

    if (datas.config === null) {
        datas.config = $.extend({}, DropChart.default);
    }

    //destroy old chart version
    if (DropChart.chart) {
        DropChart.chart.clear();
        DropChart.chart.destroy();
    }

    var chartData = {};
    var dataSets = DropChart.functions.getDataSets(DropChart.cells, DropChart.config.dataUsing);

    if (typeof dataSets[0] !== 'undefined') {
        chartData.datasets = addChartStyles(dataSets[0], DropChart.config.colors);
    }

    var change_dataUsing = false;
    //if dataUsing = row/column can't create chart,then convert dataUsing to column/row
    if (dataSets.length === 0 || chartData.datasets.length === 0) {
        if (DropChart.config.dataUsing === 'column') {
            DropChart.config.dataUsing = 'row';
            datas.config.dataUsing = 'row';
        } else {
            DropChart.config.dataUsing = 'column';
            datas.config.dataUsing = 'column';
        }

        dataSets = DropChart.functions.getDataSets(DropChart.cells, DropChart.config.dataUsing);
        chartData.datasets = addChartStyles(dataSets[0], DropChart.config.colors);
        change_dataUsing = true;
    }

    var cellsData = DropChart.helper.getRangeData(DropChart.cells);

    var canSwitch = DropChart.helper.canSwitchRowCol(cellsData);
    if (canSwitch == 3) { //both row and col data valid
        DropChart.config.switchDataUsing = true;
        datas.config.switchDataUsing = true;
    } else {
        DropChart.config.switchDataUsing = false;
        datas.config.switchDataUsing = false;
        if (canSwitch == 2) {  //only row data valid, then convert dataUsing to row
            if (DropChart.config.dataUsing !== 'row') {
                change_dataUsing = true;
            }
            DropChart.config.dataUsing = 'row';
            datas.config.dataUsing = 'row';
        } else { //only row data valid, then convert dataUsing to row
            if (DropChart.config.dataUsing !== 'column') {
                change_dataUsing = true;
            }
            DropChart.config.dataUsing = 'column';
            datas.config.dataUsing = 'column';
        }
    }

    if (change_dataUsing) {
        wptm_element.chartTabContent.find('.controls[name="dataUsing"] span.wptm_notice').show();
        setTimeout(function () {
            wptm_element.chartTabContent.find('.controls[name="dataUsing"] span.wptm_notice').hide();
        }, 2000);
    }

    if (DropChart.config.useFirstRowAsLabels) {
        chartData.labels = dataSets[1];
    } else {
        chartData.labels = DropChart.helper.getEmptyArray(dataSets[1].length);
    }

    //hiden all canvas except chart_id
    wptm_element.wptmContentChart.find('.canvas').addClass('wptm_hiden');
    var $canvas = wptm_element.wptmContentChart.find('canvas.wptm_chart_' + chart_id);
    if ($canvas.length < 1 || re_render) {
        $canvas.remove();
        $canvas = $('<canvas class="canvas wptm_chart_' + chart_id + '" width="' + DropChart.config.width + '" height="' + DropChart.config.height + '"   ><canvas>')
            .appendTo(wptm_element.wptmContentChart);
    } else {
        $canvas.width(DropChart.config.width);
        $canvas.height(DropChart.config.height);
    }
    $canvas.removeClass('wptm_hiden');
    var ctx = $canvas.get(0).getContext("2d");

    DropChart.labels = chartData.labels;
    DropChart.datasets = chartData.datasets;

    if (DropChart.datasets.length > 0) {
        var value_unit = '';
        if (typeof DropChart.value_unit_chart === 'undefined') {
            DropChart.value_unit_chart = [];
        }
        if (typeof DropChart.value_unit_chart[chart_id] !== 'undefined') {
            value_unit = DropChart.value_unit_chart[chart_id];
        } else {
            for (var i = 0; i < cellsData.length; i++) {
                for (var j = 0; j < cellsData[i].length; j++) {
                    var unit = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].stringReplace(cellsData[i][j], true);
                    if (typeof cellsData[i][j] !== 'undefined' && typeof cellsData[i][j] !== 'string' && cellsData[i][j] !== null) {
                        cellsData[i][j] = cellsData[i][j].toString();
                    } else if (cellsData[i][j] === null) {
                        cellsData[i][j] = '0';
                    }
                    if (
                        typeof cellsData[i][j] !== 'undefined'
                        && unit === Wptm.style.table.currency_symbol
                        && cellsData[i][j] !== null
                        && !isNaN(parseInt(cellsData[i][j].replace(unit, '')))
                    ) {
                        value_unit = Wptm.style.table.currency_symbol;
                    }
                }
            }
        }

        var string = (parseInt(Wptm.style.table.symbol_position) === 1)
            ? "(Number(value).toFixed(" + Wptm.style.table.decimal_count + ")).toString().replace(/\\./g, '" + Wptm.style.table.decimal_symbol + "').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '" + Wptm.style.table.thousand_symbol + "') + ' " + value_unit + "'"
            : "'" + value_unit + "' + (Number(value).toFixed(" + Wptm.style.table.decimal_count + ")).toString().replace(/\\./g, '" + Wptm.style.table.decimal_symbol + "').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '" + Wptm.style.table.thousand_symbol + "')";
        if (value_unit === '') {
            string = "Number(value)";
        }
        DropChart.config.scaleLabel = "<%= " + string + "%>";
        DropChart.config.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= " + string + "%>";
        DropChart.config.multiTooltipTemplate = "<%= datasetLabel %>: <%= " + string + "%>";
    } else {
        bootbox.alert(wptmText.CHART_INVALID_DATA, wptmText.GOT_IT);
    }
    try {
        DropChart.value_unit_chart[chart_id] = value_unit;
        DropChart.config.scaleBeginAtZero = false;//fix the original value of the shaft
        DropChart.type = datas.type;

        switch (DropChart.type) {
            case 'PolarArea':
                DropChart.chart = new Chart(ctx).PolarArea(convertForPie(chartData, DropChart.config.pieColors), DropChart.config);
                break;

            case 'Pie':
                DropChart.chart = new Chart(ctx).Pie(convertForPie(chartData, DropChart.config.pieColors), DropChart.config);
                break;

            case 'Doughnut':
                DropChart.chart = new Chart(ctx).Doughnut(convertForPie(chartData, DropChart.config.pieColors), DropChart.config);
                break;

            case 'Bar':
                DropChart.chart = new Chart(ctx).Bar(chartData, DropChart.config);
                break;

            case 'Radar':
                DropChart.chart = new Chart(ctx).Radar(chartData, DropChart.config);
                break;

            case 'Line':
            default:
                DropChart.chart = new Chart(ctx).Line(chartData, DropChart.config);
                break;
        }

        DropChart.optionsChanged = false;
        //update val of selector to chart option
        if (!re_render) {
            updateOption(datas);
        } else {
            DropChart.optionsChanged = true;
        }
        initChartObserver();
        if (save_chart) {
            DropChart.functions.save();
        }
    } catch (e) {}
}

DropChart.functions.save = function () {
    if (!(Wptm.can.edit || (Wptm.can.editown && data.author === Wptm.author))) {
        return;
    }

    var $ = jQuery;
    var jsonVar = {
        jform: {
            type: DropChart.type,
            config: JSON.stringify(DropChart.config)
        },
        id: DropChart.id_chart
    };

    if (DropChart.changer === true) {
        jsonVar.jform.datas = JSON.stringify(DropChart.cells);
        DropChart.changer = false;
    }
    var $saving = $('.wptm_top_chart .saving');
    $saving.html(wptmText.SAVING);
    $saving.animate({'opacity': '1'}, 200);
    $.ajax({
        url: wptm_ajaxurl + "task=chart.save",
        dataType: "json",
        type: "POST",
        data: jsonVar,
        success: function (datas) {
            if (datas.response === true) {
                $saving.html(wptmText.ALL_CHANGES_SAVED).delay(500).animate({'opacity': '0'}, 200);
            } else {
                $saving.animate({'opacity': '0'}, 200);
                bootbox.alert(datas.response, wptmText.Ok);
            }
        },
        error: function (jqxhr, textStatus, error) {
            $saving.animate({'opacity': '0'}, 200);
            bootbox.alert(textStatus + " : " + error, wptmText.Ok);
        }
    });
}

DropChart.functions.getDataSets = function (cells, dataUsing) {
    var currency_symbol = typeof Wptm.style.table.currency_symbol === 'undefined'
        ? default_value.currency_symbol
        : Wptm.style.table.currency_symbol;
    var datasets = [];
    var axisLabels = [];
    var grapLabels = [];
    var dataset = {};

    if (!dataUsing) {
        dataUsing = "row";
    }
    var cellsData = DropChart.helper.getRangeData(cells);

    if (cellsData.length === 0) {
        return false;
    }

    if (dataUsing === "row") {
        if (DropChart.config.useFirstRowAsLabels) {
            axisLabels = cellsData[0];
        }
        //get valid chart data area
        var result = DropChart.functions.getValidChartData(cellsData);
        // axis X label
        if (DropChart.config.useFirstRowAsLabels) {
            var tempArr = [];
            for (var j = 0; j < result[1].length; j++) {
                tempArr.push(axisLabels[result[1][j]]);
            }
            axisLabels = tempArr;
        } else {
            axisLabels = DropChart.helper.getEmptyArray(result[1].length);
        }
        // dataset label
        for (var j = 0; j < result[2].length; j++) {
            grapLabels.push(cellsData[result[2][j]][0]);
        }
    } else {
        var rCellsData = DropChart.helper.transposeArr(cellsData);
        if (DropChart.config.useFirstRowAsLabels) {
            axisLabels = rCellsData[0];
        }
        //get valid chart data area
        var result = DropChart.functions.getValidChartData(rCellsData);

        // axis X label
        if (DropChart.config.useFirstRowAsLabels) {
            var tempArr = [];
            for (var j = 0; j < result[1].length; j++) {
                tempArr.push(axisLabels[result[1][j]]);
            }
            axisLabels = tempArr;
        } else {
            axisLabels = DropChart.helper.getEmptyArray(result[1].length);
        }
        // dataset label
        for (var j = 0; j < result[2].length; j++) {
            grapLabels.push(rCellsData[result[2][j]][0]);
        }
    }

    for (var i = 0; i < result[0].length; i++) {
        dataset = {};
        dataset.data = DropChart.helper.convertToNumber(result[0][i]);
        dataset.label = grapLabels[i];
        datasets.push(dataset);
    }

    return [datasets, axisLabels, grapLabels];
}

//get valid chart data area
// return: valid data , col indexes, row indexes
DropChart.functions.getValidChartData = function (cellsData) {
    var i, tempIndexes;
    var results = [];
    var resultIndexes = [];
    var rowIndexes = [];
    for (i = 0; i < cellsData[0].length; i++) {
        resultIndexes.push(i);
    }

    for (i = 0; i < cellsData.length; i++) {
        if (DropChart.helper.isValidRow(cellsData[i])) {
            results.push(cellsData[i]);
            rowIndexes.push(i);
            tempIndexes = DropChart.helper.getValidIndexes(cellsData[i]);
            resultIndexes = DropChart.helper.intersection(tempIndexes, resultIndexes);
        }
    }
    var tempArr = [];

    for (i = 0; i < results.length; i++) {
        tempArr = [];
        for (var j = 0; j < tempIndexes.length; j++) {
            tempArr.push(results[i][tempIndexes[j]]);
        }
        results[i] = tempArr;
    }
    return [results, resultIndexes, rowIndexes];
}

DropChart.functions.checkValidRowData = function (array) {
    return !array.some(function (value, index, array) {
        return value !== array[0];
    });
}

DropChart.functions.validateChartData = function () {
    var selection = table_function_data.selection[0], rValid, cValid, emptyRow;
    //no cell selected or only one cell
    if (selection.length == 0 || selection[0] == selection[2] || selection[1] == selection[3]) {
        return false;
    }

    var cellRange = new Array();
    var Cells = Wptm.container.handsontable('getData', selection[0], selection[1], selection[2], selection[3]);
    //Check row
    rValid = DropChart.helper.hasNumbericRow(Cells);
    var rCells;
    if (!rValid) {
        //check column
        rCells = DropChart.helper.transposeArr(Cells);
        cValid = DropChart.helper.hasNumbericRow(rCells);

        if (!cValid) { //ignore first row and column
            cValid = DropChart.helper.hasNumbericRowCol(rCells[0]);
            if (!cValid) {
                cValid = DropChart.helper.hasNumbericRowCol(rCells[1]);
            }
            var subCells = DropChart.helper.removeFirstRowColumn(rCells);
            if (subCells.length <= 0) return false;
        }
    }

    if (rValid || cValid) {
        //read data
        for (var r = 0; r < Cells.length; r++) {
            if (!DropChart.functions.checkValidRowData(Cells[r])) {
                cellRange[r] = new Array();
                for (var c = 0; c < Cells[r].length; c++) {
                    cellRange[r][c] = (selection[0] + r) + ":" + (selection[1] + c);
                }
            }
        }
        var newCellRange = cellRange.filter(function (el) {
            return el != null && el !== '';
        });
        return newCellRange;
    } else {
        return false;
    }
}

//check val of cells to chart of table
DropChart.functions.validateCharts = function (change) {
    var result = true;
    var $ = jQuery;
    var editCell = change[0] + ":" + change[1];

    $.each(DropChart.datas, function (chart_id, chart) {
        if (chart_id) {
            var cells = chart.data;
            if (DropChart.helper.inArrays(editCell, cells)) {
                var cellsData = [];
                for (var i = 0; i < cells.length; i++) {
                    var rowData = [];
                    for (var j = 0; j < cells[i].length; j++) {
                        if (cells[i][j] != editCell) {
                            rowData[j] = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].getCellData(cells[i][j]);
                        } else {
                            rowData[j] = change[3];//new value
                        }
                    }
                    cellsData[i] = rowData;
                }

                if (!validateDataForChart(cellsData)) {
                    result = false;
                }
            }
        }
    });

    return result;
}

function validateDataForChart(Cells) {
    var rValid, rCells, cValid, subCells, rsubCells;
    //Check row
    rValid = DropChart.helper.hasNumbericRow(Cells);
    if (!rValid) {
        //check column
        rCells = DropChart.helper.transposeArr(Cells);
        cValid = DropChart.helper.hasNumbericRow(rCells);
        if (!cValid) { //ignore first row and column

            subCells = DropChart.helper.removeFirstRowColumn(rCells);
            if (subCells.length <= 0) return false;

            rValid = DropChart.helper.hasNumbericRow(subCells);
            if (!rValid) {
                rsubCells = DropChart.helper.transposeArr(subCells);
                cValid = DropChart.helper.hasNumbericRow(rsubCells);
            }
        }
    }

    return (rValid || cValid);
}

DropChart.helper = {}

//get index of valid number in the array
DropChart.helper.getValidIndexes = function (arr) {
    var currency_symbol = typeof Wptm.style.table.currency_symbol === 'undefined'
        ? default_value.currency_symbol
        : Wptm.style.table.currency_symbol;
    var thousand_symbol = typeof Wptm.style.table.thousand_symbol === 'undefined'
        ? default_value.thousand_symbol
        : Wptm.style.table.thousand_symbol;

    // var thousand_re = new RegExp(thousand_symbol,"g");
    var thousand_re = new RegExp('[' + thousand_symbol + ']', "g");
    var i, v, x1;
    var result = [];

    for (i = 0; i < arr.length; i++) {

        v = arr[i] ? arr[i].toString() : "";
        x1 = v.replace(currency_symbol, '');
        x1 = x1.replace(thousand_re, '');
        x1 = x1.replace(/[\\.|+|,| ]/g, '');
        x1 = x1.replace(/-/g, '');
        x1 = x1.replace(/[0-9]/g, '');
        if (x1 === '') {
            result.push(i);
        }
    }
    return result;
}

//get intersection values of two array
DropChart.helper.intersection = function (a, b) {
    var rs = [];
    for (var i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) != -1) {
            rs.push(a[i]);
        }
    }
    return rs;
};


DropChart.helper.isNumbericArray = function (arr) {
    var valid = true;
    for (var c = 0; c < arr.length; c++) {
        if (isNaN(arr[c])) {
            valid = false;
        }
    }

    return valid;
};

DropChart.helper.convertToNumber = function (arr) {
    var result = [];
    for (var c = 0; c < arr.length; c++) {
        // if (!isNaN(arr[c])) {
        if (typeof arr[c] === 'string') {
            arr[c] = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].stringReplace(arr[c], false);
        }
        result.push(arr[c]);
        // }
    }
    return result;
};

DropChart.helper.transposeArr = function (arr) {
    if (typeof arr === "undefined" || arr.length === 0) {
        return [];
    }
    return Object.keys(arr[0]).map(function (c) {
        return arr.map(function (r) {
            return r[c];
        });
    });
}
DropChart.helper.inArrays = function (c, cells) {
    var result = false;
    for (var r = 0; r < cells.length; r++) {
        if (cells[r].indexOf(c) > -1) {
            result = true;
        }
    }

    return result;
}


// there is at least 2 number
DropChart.helper.isValidRow = function (arr) {
    var currency_symbol = typeof Wptm.style.table.currency_symbol === 'undefined'
        ? default_value.currency_symbol
        : Wptm.style.table.currency_symbol;
    var thousand_symbol = typeof Wptm.style.table.thousand_symbol === 'undefined'
        ? default_value.thousand_symbol
        : Wptm.style.table.thousand_symbol;

    var thousand_re = new RegExp('[' + thousand_symbol + ']', "g");
    var i, v, x1, count = 0;

    for (i = 0; i < arr.length; i++) {
        v = arr[i] ? arr[i].toString() : "";
        if (v !== '') {
            x1 = v.replace(currency_symbol, '');
            x1 = x1.replace(thousand_re, '');
            x1 = x1.replace(/[\\.|+|,| ]/g, '');
            x1 = x1.replace(/-/g, '');
            x1 = x1.replace(/[0-9]/g, '');
            if (x1 === '') {
                count++;
            }
        }
    }
    return (count > 1);
}

DropChart.helper.hasNumbericRow = function (Cells) {
    var rValid = false;
    if (typeof Cells === "undefined") {
        return false;
    }

    for (var r = 0; r < Cells.length; r++) {
        if (DropChart.helper.isValidRow(Cells[r])) {
            rValid = true;
            break;
        }
    }
    return rValid;
}

// check val int cel in row
DropChart.helper.hasNumbericRowCol = function (Cells) {
    var rValid = true;
    var rNaN = 0;
    if (typeof Cells === "undefined") {
        return false;
    }
    for (var r = 0; r < Cells.length; r++) {
        var valid = true;
        if (typeof (Cells[r]) === 'string' && isNaN(parseInt(_functions__WEBPACK_IMPORTED_MODULE_0__["default"].stringReplace(Cells[r], false)))) {
            valid = false;
        }

        if (!valid) {
            rNaN++;
        }
    }

    if (rNaN === Cells.length) {
        rValid = false;
    }
    return rValid;
}

DropChart.helper.getRowData = function (row) {
    var data = [];
    for (var j = 0; j < row.length; j++) {
        data[j] = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].getCellData(row[j]);
    }

    return data;
}

DropChart.helper.getRangeData = function (cells) {
    var datas = [];
    for (var i = 0; i < cells.length; i++) {
        datas[i] = DropChart.helper.getRowData(cells[i]);
    }

    return datas;
}

DropChart.helper.getCellRangeLabel = function (cells) {
    var data = [];
    var firstCell = cells[0][0];
    var lastRow = cells[cells.length - 1];
    var lastCell = lastRow[lastRow.length - 1];

    var pos = firstCell.split(":");
    data[0] = parseInt(pos[0]);
    data[1] = parseInt(pos[1]);

    pos = lastCell.split(":");
    data[2] = parseInt(pos[0]);
    data[3] = parseInt(pos[1]);
    return data;
}

DropChart.helper.canSwitchRowCol = function (cellsData) {
    var result = -1;
    var rValid = false;
    var cValid = false;
    if (DropChart.helper.hasNumbericRow(cellsData)) {
        rValid = true;
    }
    var rCellsData = DropChart.helper.transposeArr(cellsData);
    if (DropChart.helper.hasNumbericRow(rCellsData)) {
        cValid = true;
    }

    if (rValid && cValid) {
        result = 3;
    } else if (rValid) {
        result = 2;
    } else if (cValid) {
        result = 1;
    } else {
        // invalid data
        result = -1;
    }

    return result;
}

DropChart.helper.removeFirstRowColumn = function (cells) {
    cells.shift();
    if (cells.length > 0) {
        cells = DropChart.helper.transposeArr(cells);
        cells.shift();
    }

    return cells;
}
DropChart.helper.getEmptyArray = function (len) {
    var result = [];
    for (var i = 0; i < len; i++) {
        result[i] = "    ";
    }
    return result;
}

DropChart.helper.convertHex = function (hex, opacity) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
}

DropChart.helper.ColorLuminance = function (hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

/* harmony default export */ __webpack_exports__["default"] = (DropChart);


/***/ }),

/***/ "./app/admin/assets/js/_customRenderer.js":
/*!************************************************!*\
  !*** ./app/admin/assets/js/_customRenderer.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_functions */ "./app/admin/assets/js/_functions.js");


/*month text and aug calculator cell*/
var F_name = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
var M_name = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];
var l_name = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var D_name = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var regex2 = new RegExp('([a-zA-Z]+)([0-9]+)');
var regex3 = new RegExp('([a-zA-Z]+)([0-9]+)', 'g');
/* List of supported formulas */
var regex = new RegExp('^=(DATE|DAY|DAYS|DAYS360|AND|OR|XOR|SUM|MULTIPLY|DIVIDE|COUNT|MIN|MAX|AVG|CONCAT|date|day|days|days360|and|or|xor|sum|multiply|divide|count|min|max|avg|concat)\\((.*?)\\)$');
/**
 * function render cell when handsontable render, call in handsontable.renderer
 *
 * @param instance
 * @param td             cell element
 * @param row            now number
 * @param col            col number
 * @param prop
 * @param value          cell value
 * @param cellProperties
 * @returns {*}
 */
var render = function (instance, td, row, col, prop, value, cellProperties) {
    var Wptm = window.Wptm;
    var function_data = window.table_function_data;
    var css = {};
    var celltype = '';
    if (typeof (Wptm.style.cells) !== 'undefined') {
        //Cells rendering
        var cellStyle = [];

        if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty( Wptm.style.cols, col, 1)) {
            cellStyle[2] = jquery.extend([], Wptm.style.cols[col][1]);
        }
        if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty( Wptm.style.rows, row, 1)) {
            cellStyle[2] = jquery.extend([], cellStyle[2], Wptm.style.rows[row][1]);
        }

        if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(Wptm.style,'cells', row + "!" + col, 2)) {
            if (Wptm.type === 'html' || row == 0) {
                cellStyle[2] = jquery.extend({}, cellStyle[2],  Wptm.style.cells[row + "!" + col][2]);
            }
        }

        if (typeof (cellStyle[2]) !== 'undefined') {
            if (typeof cellStyle[2].AlternateColor !== 'undefined' || typeof function_data.allAlternate.default !== 'undefined') {
                var numberRow = 0;
                css["background-color"] = '';
                if (typeof function_data.allAlternate.default !== 'undefined') {
                    if (function_data.allAlternate.header === '') {
                        numberRow = -1;
                    }
                    switch (row) {
                        case 0:
                            if (function_data.allAlternate.header === '') {
                                css["background-color"] = function_data.allAlternate.even;
                            } else {
                                css["background-color"] = function_data.allAlternate.header;
                            }
                            break;
                        case _.size(Wptm.style.rows) - 1:
                            if (function_data.allAlternate.footer === '') {
                                if ((row - parseInt(0 + numberRow)) % 2) {
                                    css["background-color"] = function_data.allAlternate.even;
                                } else {
                                    css["background-color"] = function_data.allAlternate.old;
                                }
                            } else {
                                css["background-color"] = function_data.allAlternate.footer;
                            }
                            break;
                        default:
                            if ((row - parseInt(0 + numberRow)) % 2) {
                                css["background-color"] = function_data.allAlternate.even;
                            } else {
                                css["background-color"] = function_data.allAlternate.old;
                            }
                            break;
                    }
                } else {
                    var Value = function_data.oldAlternate[cellStyle[2].AlternateColor];
                    if (typeof Value === 'undefined') {
                        if (typeof function_data.changeAlternate[cellStyle[2].AlternateColor] !== 'undefined' || function_data.changeAlternate.length < 1) {
                            cellStyle[2].AlternateColor = function_data.changeAlternate[cellStyle[2].AlternateColor];
                            Value = function_data.oldAlternate[cellStyle[2].AlternateColor];
                        }
                    }

                    if (typeof Value !== 'undefined') {
                        if (Value.header === '') {
                            numberRow = -1;
                        }
                        switch (row) {
                            case parseInt(Value.selection[0]):
                                if (Value.header === '') {
                                    css["background-color"] = Value.even;
                                } else {
                                    css["background-color"] = Value.header;
                                }
                                break;
                            case parseInt(Value.selection[2]):
                                if (Value.footer === '') {
                                    if ((row - parseInt(Value.selection[0] + numberRow)) % 2) {
                                        css["background-color"] = Value.even;
                                    } else {
                                        css["background-color"] = Value.old;
                                    }
                                } else {
                                    css["background-color"] = Value.footer;
                                }
                                break;
                            default:
                                if ((row - parseInt(Value.selection[0] + numberRow)) % 2) {
                                    css["background-color"] = Value.even;
                                } else {
                                    css["background-color"] = Value.old;
                                }
                                break;
                        }
                    } else {
                        delete cellStyle[2].AlternateColor;
                    }
                }
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_type')) {
                celltype = cellStyle[2].cell_type;
            } else if (typeof cellStyle[2].cell_type !== 'undefined') {
                delete cellStyle[2].cell_type;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_background_color')) {
                css["background-color"] = cellStyle[2].cell_background_color;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_top')) {
                css["border-top"] = cellStyle[2].cell_border_top;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_top_start')) {
                if (0 == row) {
                    css["border-top"] = cellStyle[2].cell_border_top_start;
                }
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_right')) {
                css["border-right"] = cellStyle[2].cell_border_right;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_bottom')) {
                css["border-bottom"] = cellStyle[2].cell_border_bottom;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_bottom_end')) {
                if (_.size(Wptm.style.rows) - 1 == row) {
                    css["border-bottom"] = cellStyle[2].cell_border_bottom_end;
                }
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_left')) {
                css["border-left"] = cellStyle[2].cell_border_left;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_font_bold') && cellStyle[2].cell_font_bold === true) {
                css["font-weight"] = "bold";
            } else {
                delete css["font-weight"];
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_font_italic') && cellStyle[2].cell_font_italic === true) {
                css["font-style"] = "italic";
            } else {
                delete css["font-style"];
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_font_underline') && cellStyle[2].cell_font_underline === true) {
                css["text-decoration"] = "underline";
            } else {
                delete css["text-decoration"];
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_text_align')) {
                css["text-align"] = cellStyle[2].cell_text_align;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_vertical_align')) {
                css["vertical-align"] = cellStyle[2].cell_vertical_align;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_font_family')) {
                css["font-family"] = cellStyle[2].cell_font_family;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_font_size')) {
                css["font-size"] = cellStyle[2].cell_font_size + "px";
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_font_color')) {
                css["color"] = cellStyle[2].cell_font_color;
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_padding_left')) {
                css["padding-left"] = cellStyle[2].cell_padding_left + "px";
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_padding_top')) {
                css["padding-top"] = cellStyle[2].cell_padding_top + "px";
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_padding_right')) {
                css["padding-right"] = cellStyle[2].cell_padding_right + "px";
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_padding_bottom')) {
                css["padding-bottom"] = cellStyle[2].cell_padding_bottom + "px";
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_background_radius_left_top')) {
                css["border-top-left-radius"] = cellStyle[2].cell_background_radius_left_top + "px";
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_background_radius_right_top')) {
                css["border-top-right-radius"] = cellStyle[2].cell_background_radius_right_top + "px";
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_background_radius_right_bottom')) {
                css["border-bottom-right-radius"] = cellStyle[2].cell_background_radius_right_bottom + "px";
            }
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(cellStyle,2,'cell_background_radius_left_bottom')) {
                css["border-bottom-left-radius"] = cellStyle[2].cell_background_radius_left_bottom + "px";
            }
        }

        //render style for table
        window.jquery(td).css(css);
        if (Object.keys(css).length > 0) {
            function_data.styleToRender += '.dtr' + row + '.dtc' + col + '{';
            window.jquery.each(css, function (index, value) {
                function_data.styleToRender += index + ':' + value + ';';
            });
            function_data.styleToRender += '}';
        }
    }

    switch (celltype) {
        case 'html':
            var escaped = Handsontable.helper.stringify(value);
            //escaped = strip_tags(escaped, '<div><span><img><em><b><a>'); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
            td.innerHTML = escaped;
            window.jquery(td).addClass('isHtmlCell');
            break;
        default:
            window.jquery(td).removeClass('isHtmlCell');
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            break;
    }


    /* Calculs rendering */
    if (typeof Wptm.style.table.date_formats === 'undefined') {
        Wptm.style.table.date_formats = window.default_value.date_formats;
    }

    if (typeof (value) === 'string' && value[0] === '=') {
        evaluateFormulas(td, value, Wptm, function_data);
    }

    window.jquery(td).addClass('dtr' + row + ' dtc' + col);

    return td;
};

// Evaluate formula in cell then set value to td
function evaluateFormulas (td, value, Wptm, function_data) {
    var check_value_data = true;

    if (typeof (value) === 'string' && value[0] === '=') {
        var error = false;
        var result = regex.exec(value);
        var v;
        if (result !== null) {
            // get function caculate cells
            // caculater(result, );
            var cells = result[2].split(";");
            var values = [];
            var rCells = [];
            var val1, val2, number;
            // check calculate date
            var check_isDay = (result[1].split("DAY").length === 2);
            var value_unit = '';
            for (var ij = 0; ij < cells.length; ij++) {
                var vals = cells[ij].split(":");
                var datas = '';
                var data = '';
                if (vals.length === 1) { //single cell
                    //cut vals[0] when number cell, ex: B1 >= B2
                    var val1s = vals[0].match(regex3);

                    if (val1s !== null) {
                        for (var i = 0; i < val1s.length; i++) {
                            //ex: B1 -> B, 1, B1
                            val1 = regex2.exec(val1s[i]);
                            if (val1 !== null) {
                                datas = Wptm.container.handsontable('getDataAtCell', val1[2] - 1, _functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertAlpha(val1[1].toUpperCase()) - 1);
                                if (datas !== null && typeof datas !== 'undefined') {
                                    if (i === 0) {
                                        data = vals[0].replace(val1s[i], datas);
                                    } else {
                                        data = data.replace(val1s[i], datas);
                                    }
                                } else {
                                    datas = data = '';
                                }
                            } else {
                                check_value_data = false;
                            }
                        }
                    } else {
                        data = datas = vals[0];
                    }

                    if (val1 !== null && data !== null) {
                        // removed currency symbols
                        var math1;
                        if (result[1].toUpperCase() !== 'CONCAT') {
                            math1 = data.replace(function_data.replace_unit, "");
                            //remove thousand symbols, change decimal symbols
                            if (check_isDay === false) {
                                math1 = (Wptm.style.table.thousand_symbol === ',')
                                    ? math1.replace(/[,]+/g, "")
                                    : (Wptm.style.table.thousand_symbol === '.'
                                        ? math1.replace(/[\.]+/g, "") : math1.replace(/[ ]+/g, ""));
                                math1 = (Wptm.style.table.decimal_symbol === ',')
                                    ? (Wptm.style.table.thousand_symbol === ' ' ? math1.replace(/[\.]+/g, "").replace(/[,]+/g, ".") : math1.replace(/[,]+/g, "."))
                                    : (Wptm.style.table.thousand_symbol === ' ' ? math1.replace(/[,]+/g, "") : math1);
                            }
                        } else {
                            math1 = data;
                        }
                        // cut math1 when have <= || ...
                        var math2 = math1.match(/<=|>=|!=|>|<|=/g);

                        if (math2 !== null) {
                            math1 = math1.replace(/[ |A-Za-z]+/g, "");
                            switch (math2[0]) {
                                case '<=':
                                    number = Number(math1.split('<=')[0]) <= Number(math1.split('<=')[1]);
                                    break;
                                case '>=':
                                    number = Number(math1.split('>=')[0]) >= Number(math1.split('>=')[1]);
                                    break;
                                case '=':
                                    number = Number(math1.split('=')[0]) === Number(math1.split('=')[1]);
                                    break;
                                case '!=':
                                    number = Number(math1.split('!=')[0]) !== Number(math1.split('!=')[1]);
                                    break;
                                case '<':
                                    number = Number(math1.split('<')[0]) < Number(math1.split('<')[1]);
                                    break;
                                case '>':
                                    number = Number(math1.split('>')[0]) > Number(math1.split('>')[1]);
                                    break;
                                default :
                                    number = math1;
                                    break;
                            }
                        } else {
                            number = math1;
                        }

                        values.push(number);
                    }
                    if (result[1].toUpperCase() === 'DIVIDE' || result[1].toUpperCase() === 'MULTIPLY') {
                        value_unit = value_unit !== '' ? value_unit : (typeof datas !== 'undefined') ? datas.toString().replace(function_data.text_replace_unit_function, "") : '';
                    } else {
                        value_unit = (typeof datas !== 'undefined') ? datas.toString().replace(function_data.text_replace_unit_function, "") : '';
                    }
                } else { //range
                    val1 = regex2.exec(vals[0]);
                    val2 = regex2.exec(vals[1]);
                    if (val1 !== null && val2 !== null) {
                        rCells = Wptm.container.handsontable('getData', val1[2] - 1, _functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertAlpha(val1[1]) - 1, val2[2] - 1, _functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertAlpha(val2[1]) - 1);
                        for (var il = 0; il < rCells.length; il++) {
                            for (var ik = 0; ik < rCells[il].length; ik++) {
                                if (rCells[il][ik] !== null && typeof rCells[il][ik] !== 'undefined') {
                                    if (result[1].toUpperCase() !== 'CONCAT') {
                                        number = rCells[il][ik].replace(function_data.replace_unit, "");
                                        if (check_isDay === false) {
                                            number = (Wptm.style.table.thousand_symbol === ',')
                                                ? number.replace(/[,]+/g, "")
                                                : (Wptm.style.table.thousand_symbol === '.'
                                                    ? number.replace(/[\.]+/g, "") : number.replace(/[ ]+/g, ""));
                                            number = (Wptm.style.table.decimal_symbol === ',')
                                                ? (Wptm.style.table.thousand_symbol === ' ' ? number.replace(/[\.]+/g, "").replace(/[,]+/g, ".") : number.replace(/[,]+/g, "."))
                                                : (Wptm.style.table.thousand_symbol === ' ' ? number.replace(/[,]+/g, "") : number);
                                        }
                                    } else {
                                        number = rCells[il][ik];
                                    }
                                    values.push(number);
                                    datas = rCells[il][ik];
                                } else {
                                    values.push('');
                                }

                                if (result[1].toUpperCase() === 'MULTIPLY') {
                                    value_unit = value_unit !== '' ? value_unit : (typeof datas !== 'undefined') ? datas.toString().replace(function_data.text_replace_unit_function, "") : '';
                                } else {
                                    value_unit = (typeof datas !== 'undefined') ? datas.toString().replace(function_data.text_replace_unit_function, "") : '';
                                }
                            }
                        }
                        if (check_isDay === true && Number(val2[2]) < Number(val1[2])) {
                            var data_values = values[0];
                            values[0] = values[1];
                            values[1] = data_values;
                        }
                    } else {
                        if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertDate(function_data.date_format, cells[ij].match(/[a-zA-Z0-9|+|-|\\]+/g), true) !== false) {
                            values.push(cells[ij]);
                        } else {
                            check_value_data = false;
                        }
                    }
                }
            }

            if (check_value_data === true) {
                var resultCalc;
                var date1 = 0;
                switch (result[1].toUpperCase()) {
                    case 'DATE':
                        if (values !== []) {
                            if (values.length === 1) {
                                values = values[0].match(/[a-zA-Z0-9|+|-|\\]+/g);
                            }
                            //convert values --> (string) date pursuant date_format not have timezone
                            var date_string = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertDate(function_data.date_format, values, false);
                            date_string = date_string !== false ? new Date(date_string) : check_value_data = false;

                            //convert values --> (string) date pursuant date_format have timezone
                            var date_string_timezone = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertDate(function_data.date_format, values, true);
                            date_string_timezone = date_string_timezone !== false ? new Date(date_string_timezone) : check_value_data = false;
                            if (date_string_timezone && date_string_timezone.getDate() > 0 && check_value_data !== false) {
                                var format_resultCalc = Wptm.style.table.date_formats.split(/[a-zA-Z|\\]+/g);
                                var date = [];

                                date['month'] = date_string.getMonth();
                                date['date'] = date_string.getDate();
                                date['day'] = date_string.getDay();
                                date['year'] = date_string.getUTCFullYear();

                                date['D'] = D_name[date['day']];
                                date['l'] = l_name[date['day']];
                                date['j'] = date['date'];
                                date['d'] = (Number(date['date']) < 10) ? '0' + date['date'] : date['date'];
                                date['F'] = F_name[date['month']];
                                date['M'] = M_name[date['month']];
                                date['n'] = Number(date['month']) + 1;
                                date['m'] = (Number(date['month']) < 10) ? '0' + (Number(date['month']) + 1) : Number(date['month']) + 1;
                                date['Y'] = date['year'];
                                date['y'] = Number(date['year']) % 100;

                                resultCalc = format_resultCalc[0];
                                window.jquery.each(function_data.date_format, function (i, v) {
                                    if (v.indexOf("\\") !== -1 || window.jquery.inArray(v, ["a", "A", "g", "G", "h", "H", "i", "s", "T"]) !== -1) {
                                        date[v] = values[i];
                                    }
                                    resultCalc += date[v] + format_resultCalc[i + 1];
                                });
                            } else {
                                resultCalc = 'NaN';
                                check_value_data = false;
                            }
                        } else {
                            resultCalc = 'NaN';
                            check_value_data = false;
                        }
                        break;
                    case 'DAY':
                        resultCalc = 0;
                        if (check_value_data !== false) {
                            values.map(function (foo) {
                                if (foo !== false) {
                                    v = foo.replace(val1s, datas);
                                    var number = v.match(/[a-zA-Z0-9|+|-|\\]+/g);
                                    var string_day = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertDate(function_data.date_format, number, false);
                                    if (string_day !== false) {
                                        date1 = new Date(string_day);
                                        if (!isNaN(date1.getTime())) {
                                            resultCalc = date1.getDate();
                                        } else {
                                            resultCalc = 'NaN';
                                            check_value_data = false;
                                        }
                                    } else {
                                        resultCalc = 'NaN';
                                        check_value_data = false;
                                    }
                                } else {
                                    resultCalc = 'NaN';
                                    check_value_data =false;
                                }
                            });
                        } else {
                            resultCalc = 'NaN';
                        }
                        break;
                    case 'DAYS':
                        resultCalc = 0;
                        if (check_value_data !== false) {
                            values.map(function (foo) {
                                if (foo !== false) {
                                    v = foo;
                                    var number = v.match(/[a-zA-Z0-9|+|-|\\]+/g);
                                    var string_day = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertDate(function_data.date_format, number, true);
                                    if (string_day !== false) {
                                        date1 = new Date(string_day);
                                        if (!isNaN(date1.getTime())) {
                                            date1 = -1 * (date1 / (3600 * 1000 * 24));
                                            resultCalc = date1 - resultCalc;
                                        } else {
                                            resultCalc = 'NaN';
                                            check_value_data = false;
                                        }
                                    } else {
                                        resultCalc = 'NaN';
                                        check_value_data = false;
                                    }
                                } else {
                                    resultCalc = 'NaN';
                                    check_value_data = false;
                                }
                            });
                        } else {
                            resultCalc = 'NaN';
                        }
                        if (resultCalc !== 'NaN') {
                            resultCalc = (Math.floor(resultCalc) < 0 && resultCalc !== Math.floor(resultCalc)) ? Math.floor(resultCalc) + 1 : Math.floor(resultCalc);
                        }
                        break;
                    case 'DAYS360':
                        resultCalc = 0;
                        if (check_value_data !== false) {
                            var month = [];
                            var year = [];
                            var days = [];
                            values.map(function (foo) {
                                if (foo !== false) {
                                    resultCalc++;
                                    v = foo;
                                    var number = v.match(/[a-zA-Z0-9|+|-|\\]+/g);
                                    var string_day = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].convertDate(function_data.date_format, number, true);
                                    if (string_day !== false) {
                                        date1 = new Date(string_day);
                                        if (!isNaN(date1.getTime())) {
                                            days[resultCalc] = date1.getDate();
                                            month[resultCalc] = date1.getMonth();
                                            year[resultCalc] = date1.getFullYear();
                                        }
                                    }
                                }
                            });
                            if (year.length > 1) {
                                if (year[2] < year[1]) {
                                    year[2] = year[1] + year[2];
                                    year[1] = year[2] - year[1];
                                    year[2] = year[2] - year[1];
                                    month[2] = month[1] + month[2];
                                    month[1] = month[2] - month[1];
                                    month[2] = month[2] - month[1];
                                    days[2] = days[1] + days[2];
                                    days[1] = days[2] - days[1];
                                    days[2] = days[2] - days[1];
                                    year[4] = -1;
                                } else {
                                    year[4] = 1;
                                }
                                year[3] = 0;

                                for (i = year[1]; i < year[2]; i++) {
                                    year[3] += 1;
                                }
                                days[1] = (days[1] === 31) ? 30 : days[1];
                                days[2] = (days[2] === 31) ? 30 : days[2];
                                resultCalc = year[4] * (((year[3] - 1) * 360) + ((13 - month[1]) * 30 - days[1]) + ((month[2] - 1) * 30 + days[2]));
                                check_value_data = !isNaN(resultCalc);
                            } else {
                                resultCalc = 'NaN';
                                check_value_data = false;
                            }
                        } else {
                            resultCalc = 'NaN';
                        }
                        break;
                    case 'AND':
                        resultCalc = 1;
                        values.map(function (foo) {
                            v = Number(foo);
                            resultCalc = resultCalc * v;
                        });
                        resultCalc = (resultCalc === 1) ? 'true' : 'false';
                        break;
                    case 'OR':
                        resultCalc = 0;
                        values.map(function (foo) {
                            v = Number(foo);
                            resultCalc += v;
                        });
                        resultCalc = (resultCalc > 0) ? 'true' : 'false';
                        break;
                    case 'XOR':
                        resultCalc = 2;
                        values.map(function (foo) {
                            v = Number(foo);
                            resultCalc += v;
                        });
                        resultCalc = ((resultCalc % 2) === 1) ? 'true' : 'false';
                        break;
                    case 'SUM':
                        resultCalc = 0;

                        values.map(function (foo) {
                            if (foo !== false) {
                                v = Number(foo);
                                if (!isNaN(v)) {
                                    resultCalc = resultCalc + v;
                                }
                            }
                        });
                        resultCalc = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].formatSymbols(
                            resultCalc,
                            Wptm.style.table.decimal_count,
                            Wptm.style.table.thousand_symbol,
                            Wptm.style.table.decimal_symbol,
                            Wptm.style.table.symbol_position,
                            value_unit !== '' ? Wptm.style.table.currency_symbol : ''
                        );
                        break;
                    case 'MULTIPLY':
                        resultCalc = 1;
                        values.map(function (foo) {
                            if (foo !== false) {
                                v = Number(foo);
                                if (!isNaN(v)) {
                                    resultCalc = resultCalc * v;
                                } else {
                                    check_value_data = false;
                                }
                            }
                        });

                        if (!check_value_data) {
                            resultCalc = 'NaN';
                        } else {
                            resultCalc = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].formatSymbols(
                                resultCalc,
                                Wptm.style.table.decimal_count,
                                Wptm.style.table.thousand_symbol,
                                Wptm.style.table.decimal_symbol,
                                Wptm.style.table.symbol_position,
                                value_unit !== '' ? Wptm.style.table.currency_symbol : ''
                            );
                        }
                        break;
                    case 'DIVIDE':
                        resultCalc = '';

                        if (values.length !== 2) {
                            resultCalc = 'NaN';
                            check_value_data = false;
                            break;
                        }

                        values[1] = Number(values[1]);

                        if (isNaN(values[1]) || values[1] == 0 ||  values[1] == '') {
                            resultCalc = 'NaN';
                            check_value_data = false;
                            break;
                        }

                        values[0] = Number(values[0]);

                        if (isNaN(values[0])) {
                            resultCalc = 'NaN';
                            check_value_data = false;
                            break;
                        }

                        resultCalc = values[0] / values[1];

                        resultCalc = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].formatSymbols(
                            resultCalc,
                            Wptm.style.table.decimal_count,
                            Wptm.style.table.thousand_symbol,
                            Wptm.style.table.decimal_symbol,
                            Wptm.style.table.symbol_position,
                            value_unit !== '' ? Wptm.style.table.currency_symbol : ''
                        );
                        break;
                    case 'COUNT':
                        resultCalc = 0;
                        values.map(function (foo) {
                            if (foo !== false) {
                                foo = foo.replace(/[ |A-Za-z]+/g, "");
                                v = Number(foo);
                                if (!isNaN(v) && foo !== '') {
                                    resultCalc = resultCalc + 1;
                                }
                            }
                        });
                        break;
                    case 'MIN':
                        resultCalc = null;
                        values.map(function (foo) {
                            if (foo !== false) {
                                foo = foo.replace(/[ |A-Za-z]+/g, "");
                                v = Number(foo);
                                if (!isNaN(v) && foo !== '') {
                                    if (resultCalc === null || resultCalc > v) {
                                        resultCalc = v;
                                    }
                                }
                            }
                        });
                        resultCalc = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].formatSymbols(
                            resultCalc,
                            Wptm.style.table.decimal_count,
                            Wptm.style.table.thousand_symbol,
                            Wptm.style.table.decimal_symbol,
                            Wptm.style.table.symbol_position,
                            value_unit !== '' ? Wptm.style.table.currency_symbol : ''
                        );
                        break;
                    case 'MAX':
                        resultCalc = null;
                        values.map(function (foo) {
                            if (foo !== false) {
                                foo = foo.replace(/[ |A-Za-z]+/g, "");
                                v = Number(foo);
                                if (!isNaN(v)) {
                                    if (resultCalc === null || resultCalc < v) {
                                        resultCalc = v;
                                    }
                                }
                            }
                        });
                        resultCalc = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].formatSymbols(
                            resultCalc,
                            Wptm.style.table.decimal_count,
                            Wptm.style.table.thousand_symbol,
                            Wptm.style.table.decimal_symbol,
                            Wptm.style.table.symbol_position,
                            value_unit !== '' ? Wptm.style.table.currency_symbol : ''
                        );
                        break;
                    case 'AVG':
                        resultCalc = 0;
                        var n = 0;
                        values.map(function (foo) {
                            if (foo !== false) {
                                v = Number(foo);
                                if (!isNaN(v) && foo !== '') {
                                    resultCalc = resultCalc + v;
                                    n++;
                                }
                            }
                        });
                        if (n > 0) {
                            resultCalc = resultCalc / n;
                        }
                        resultCalc = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].formatSymbols(
                            resultCalc,
                            Wptm.style.table.decimal_count,
                            Wptm.style.table.thousand_symbol,
                            Wptm.style.table.decimal_symbol,
                            Wptm.style.table.symbol_position,
                            value_unit !== '' ? Wptm.style.table.currency_symbol : ''
                        );
                        break;
                    case 'CONCAT':
                        resultCalc = '';
                        values.map(function (foo) {
                            resultCalc = resultCalc + foo;
                        });
                        break;
                }
            }
        }
        if (check_value_data === true) {
            window.jquery(td).text(resultCalc);
        } else {
            function_data.check_value_data = check_value_data;
        }
    }
};

/* harmony default export */ __webpack_exports__["default"] = ({
    render,
    evaluateFormulas,
});


/***/ }),

/***/ "./app/admin/assets/js/_functions.js":
/*!*******************************************!*\
  !*** ./app/admin/assets/js/_functions.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alternating__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_alternating */ "./app/admin/assets/js/_alternating.js");
/* harmony import */ var _wptm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_wptm */ "./app/admin/assets/js/_wptm.js");
/* harmony import */ var _initHandsontable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_initHandsontable */ "./app/admin/assets/js/_initHandsontable.js");




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
            window.Wptm.style.cells = $.extend({}, _alternating__WEBPACK_IMPORTED_MODULE_0__["default"].reAlternateColor());
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
            _wptm__WEBPACK_IMPORTED_MODULE_1__["default"].fetchSpreadsheet(table_function_data.fetch_data);
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
        _wptm__WEBPACK_IMPORTED_MODULE_1__["default"].updatepreview(Wptm.id);
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

/* harmony default export */ __webpack_exports__["default"] = ({
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
});


/***/ }),

/***/ "./app/admin/assets/js/_initHandsontable.js":
/*!**************************************************!*\
  !*** ./app/admin/assets/js/_initHandsontable.js ***!
  \**************************************************/
/*! exports provided: initHandsontable, getMergeCells, calHeightTable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initHandsontable", function() { return initHandsontable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMergeCells", function() { return getMergeCells; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calHeightTable", function() { return calHeightTable; });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_functions */ "./app/admin/assets/js/_functions.js");
/* harmony import */ var _toolbarOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toolbarOptions */ "./app/admin/assets/js/_toolbarOptions.js");
/* harmony import */ var _customRenderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_customRenderer */ "./app/admin/assets/js/_customRenderer.js");
/* harmony import */ var _chart__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_chart */ "./app/admin/assets/js/_chart.js");
//setTimeout change height table by rows height





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
        renderer: _customRenderer__WEBPACK_IMPORTED_MODULE_2__["default"].render,
        height: _functions__WEBPACK_IMPORTED_MODULE_0__["default"].calculateTableHeight(window.jquery('#wptm-toolbars')),
        afterInit: function () {
            _chart__WEBPACK_IMPORTED_MODULE_3__["default"].functions.loadCharts();
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
                    if (!_chart__WEBPACK_IMPORTED_MODULE_3__["default"].functions.validateCharts(changes[i])) {
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
                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].default_sortable(window.Wptm.datas);
            }
            //set Wptm.style.rows , Wptm.style.cols value
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].pushDims($, Wptm);

            if (table_function_data.needSaveAfterRender === true) {
                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges();
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
                                var value = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cell_type_to_column(change[i], change[i][3]);

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

            clearTimeout(_functions__WEBPACK_IMPORTED_MODULE_0__["default"].autosaveNotification);

            var action = ['CopyPaste.paste', 'edit', 'UndoRedo.undo', 'UndoRedo.redo'];
            if (action.includes(source) && typeof change[0] !== 'undefined' && typeof change[0][2] !== 'undefined') {
                table_function_data.needSaveAfterRender = change[0][2] === change[0][3] ? false : true;
            }

            if (table_function_data.needSaveAfterRender === true) {
                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges();
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
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
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
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
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
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].default_sortable(window.Wptm.datas);

            window.jquery(window.Wptm.container).handsontable('render');
            saveData.push({action: 'create_col', index: index, amount: amount, left: left});

            // update merged row index and get tableFunction.saveChanges();
            updateMergeCells(window.table_function_data.firstRender);
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
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
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].default_sortable(window.Wptm.datas);
            jquery(Wptm.container).data('handsontable').render();
            saveData.push({action: 'del_col', index: index, amount: amount, old_columns: $(window.Wptm.container).handsontable('countCols') + amount});

            updateMergeCells(window.table_function_data.firstRender);
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
        },
        afterColumnResize: function (col, width) {
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges();
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

            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges();
        },
        afterSelection: function (r, c, r2, c2, preventScrolling, selectionLayerLevel) {
            _toolbarOptions__WEBPACK_IMPORTED_MODULE_1__["default"].loadSelection(window.jquery, window.Wptm, [r, c, r2, c2]);
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
            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(window.Wptm.style, 'cols', index, 1, 'width')) {
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

            if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNestedNotEmpty(window.Wptm.style, 'rows', index, 1, 'height')) {
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
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges(true);
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
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges(true);
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
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges(true);
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
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges(true);
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
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges(true);
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
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].cleanHandsontable();
                                                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges(true);
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
    _toolbarOptions__WEBPACK_IMPORTED_MODULE_1__["default"].selectOption();

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
        _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges();
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
        _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges(firstRender);
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




/***/ }),

/***/ "./app/admin/assets/js/_toolbarOptions.js":
/*!************************************************!*\
  !*** ./app/admin/assets/js/_toolbarOptions.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wptm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_wptm */ "./app/admin/assets/js/_wptm.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_functions */ "./app/admin/assets/js/_functions.js");
/* harmony import */ var _changeTheme__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_changeTheme */ "./app/admin/assets/js/_changeTheme.js");
/* harmony import */ var _alternating__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_alternating */ "./app/admin/assets/js/_alternating.js");
/* harmony import */ var _chart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_chart */ "./app/admin/assets/js/_chart.js");






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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].setText.call(
                    $(this),
                    wptm_element.primary_toolbars.find('.wptm_name_edit'),
                    '#primary_toolbars .wptm_name_edit',
                    {'url': wptm_ajaxurl + "task=table.setTitle&id=" + Wptm.id + '&title=', 'selected': true}
                );
                break;
            case 'save_menu':
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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

                    Object(_changeTheme__WEBPACK_IMPORTED_MODULE_2__["default"])(ret, id, cellsData);
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
                                            var isSameSelection = _functions__WEBPACK_IMPORTED_MODULE_1__["default"].isSameArray(selection, oldAlternateData.selection);
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
                                    _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].renderCell();
                                } else {
                                    var count = _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].setNumberAlternate(selection, function_data.oldAlternate);

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
                                    _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].selectAlternatingColor(function_data.oldAlternate, selection, count),
                                        _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].renderCell();
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
                                        _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].renderCell();
                                    }
                                } else {
                                    var oldCount = _.size(function_data.oldAlternate);
                                    var count = _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].setNumberAlternate(selection, function_data.oldAlternate);
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

                                        _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].selectAlternatingColor(function_data.oldAlternate, selection, count),
                                            _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].renderCell();
                                    }
                                }
                            }
                            return true;
                        });

                        this.find('#alternate_color_done').click((e) => {
                            e.preventDefault();
                            _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].applyAlternate.call(this);
                        });
                        return true;
                    },
                    'cancelAction': function () {
                        if (_.size(function_data.checkChangeAlternate) > 0) {
                            if (Wptm.type === 'mysql') { //alternate for all cell
                                function_data.allAlternate = {};
                            } else {
                                Wptm.style.cells = $.extend({}, _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].reAlternateColor());
                                function_data.oldAlternate = $.extend({}, Wptm.style.table.alternateColorValue);
                            }

                            _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].renderCell();
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
                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getSelectedVal(function_data.selection[selection.length - 1], this.find('.cellRangeLabelAlternate'));
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
                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].pullDims(Wptm, $);
                        }

                        this.siblings('.colose_popup').trigger('click');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getSelectedVal(function_data.selection[selection.length - 1], this.find('.cellRangeLabelAlternate'));
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
                                Wptm.style.table = _functions__WEBPACK_IMPORTED_MODULE_1__["default"].fillArray(Wptm.style.table, {allRowHeight: parseFloat(all_row_height_val)});
                            }
                            i++;
                        }
                        if (i !== -1) { //have changing
                            table_function_data.needSaveAfterRender = true;
                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].pullDims(Wptm, $);
                        }

                        this.siblings('.colose_popup').trigger('click');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObjectSelectBox(Wptm, 'headerOption', this.find('#number_first_rows').next('.wptm_select_box'), length + 1 > 0 ? 1 : 0);
                        if (Wptm.type == 'mysql') {
                            this.find('#number_first_rows').addClass('no_active');
                        } else {
                            custom_select_box.call(this.find('#number_first_rows'), $);
                        }
                        //freeze_row
                        var freeze_row = parseInt(Wptm.style.table.freeze_row) > 0 ? 1 : 0;
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateSwitchButtonFromStyleObject({'freeze_row': freeze_row}, 'freeze_row', this.find('#freeze_row'), '0');
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

                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateSwitchButtonFromStyleObject(Wptm.style.table, 'use_sortable', this.find('#use_sortable'), '0');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObjectSelectBox(Wptm.style.table, 'default_order_sortable', this.find('#default_order_sortable').next('.wptm_select_box'), '');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObjectSelectBox(Wptm.style.table, 'default_sortable', this.find('#default_sortable').next('.wptm_select_box'), '');
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
                break;
            case 'column_type_menu':
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].default_sortable(window.Wptm.datas);
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
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObjectSelectBox(col_types, i, $(this).find('.wptm_select_box'), 'varchar');
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
                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].cleanHandsontable();
                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].default_sortable(window.Wptm.datas);
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObjectSelectBox(popup.option, 'responsive_type', this.find('#responsive_type').next('.wptm_select_box'), 'scroll');
                        custom_select_box.call(this.find('#responsive_type'), $);

                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObjectSelectBox(popup.option, 'freeze_col', this.find('#freeze_col').next('.wptm_select_box'), '0');
                        custom_select_box.call(this.find('#freeze_col'), $);

                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(popup.option, 'table_height', this.find('#table_height'), '0');

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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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

                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].responsive_col.call(this.find('#responsive_col'), Wptm);
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
                            Wptm.style.cols = _functions__WEBPACK_IMPORTED_MODULE_1__["default"].fillArray(Wptm.style.cols, {res_priority: $(e.target).data('value')}, col);
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
                            Wptm.style.table = $.extend({}, Wptm.style.table, popup.option), _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges();
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateSwitchButtonFromStyleObject(Wptm.style.table, 'enable_pagination', this.find('#enable_pagination'), '0');

                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObjectSelectBox(Wptm.style.table, 'limit_rows', this.find('#limit_rows').next('.wptm_select_box'), 0);
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(Wptm.style.table, 'date_formats', this.find('#date_format'), '');

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

                        function_data = _functions__WEBPACK_IMPORTED_MODULE_1__["default"].createRegExpFormat(function_data, false, Wptm.style.table.date_formats);
                        table_function_data.needSaveAfterRender = true;
                        this.siblings('.colose_popup').trigger('click');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(Wptm.style.table, 'currency_symbol', this.find('#currency_symbol'), '');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObjectSelectBox(Wptm.style.table, 'symbol_position', this.find('#symbol_position').next('.wptm_select_box'), '');
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
                        function_data = _functions__WEBPACK_IMPORTED_MODULE_1__["default"].createRegExpFormat(function_data, Wptm.style.table.currency_symbol, false);

                        Wptm.style.table = $.extend({}, Wptm.style.table, popup.option);
                        table_function_data.needSaveAfterRender = true;
                        this.siblings('.colose_popup').trigger('click');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(Wptm.style.table, 'thousand_symbol', this.find('#thousand_symbol'), '');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(Wptm.style.table, 'decimal_symbol', this.find('#decimal_symbol'), '');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(Wptm.style.table, 'decimal_count', this.find('#decimal_count'), '');
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);

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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateSwitchButtonFromStyleObject(Wptm.style.table, 'auto_sync', this.find('#auto_sync'), '0');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateSwitchButtonFromStyleObject(Wptm.style.table, 'download_button', this.find('#download_button'), '0');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateSwitchButtonFromStyleObject(Wptm.style.table, 'spreadsheet_style', this.find('#spreadsheet_style'), '0');

                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(Wptm.style.table, 'spreadsheet_url', this.find('#spreadsheet_url'), '');
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

                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateSwitchButtonFromStyleObject(Wptm.style.table, 'excel_auto_sync', this.find('#auto_sync'), '0');
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateSwitchButtonFromStyleObject(Wptm.style.table, 'excel_spreadsheet_style', this.find('#spreadsheet_style'), '0');

                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(Wptm.style.table, 'excel_url', this.find('#spreadsheet_url'), '');
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

                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
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
                            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
                        }
                        return true;
                    }
                };
                wptm_popup(wptm_element.wptm_popup, popup, true, false, true);
                break;
            case 'new_chart_menu':
                _chart__WEBPACK_IMPORTED_MODULE_4__["default"].functions.addChart();
                break;
            case 'view_chart_menu':
                if (Wptm.dataChart.length > 0) {
                    wptm_element.settingTable.find('.ajax_loading').addClass('loadding').removeClass('wptm_hiden');
                    $(this).closest('li').addClass('menu_loading');
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].showChartOrTable(true, jquery('#list_chart').find('.chart-menu').eq(0));
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
                                Wptm.style.cells = _functions__WEBPACK_IMPORTED_MODULE_1__["default"].fillArray(Wptm.style.cells, {
                                    tooltip_content: content,
                                    tooltip_width: width
                                }, i, j);
                            } else {
                                Wptm.style.cells = _functions__WEBPACK_IMPORTED_MODULE_1__["default"].fillArray(Wptm.style.cells, {tooltip_content: content}, i, j);
                            }
                            if (i == selection[2] && j == selection[3]) {
                                saveData.push({action: 'style', selection: table_function_data.selection, style: {
                                        tooltip_content: content,
                                        tooltip_width: width
                                    }});
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges();
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

        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].change_value_cells(selection, '=' + calculater + '()');
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
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].change_value_cells(table_function_data.selection, wptm_element.cellValue.val());
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
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_font_family: $(this).data('value')});
            render = true;
            break;
        case 'cell_font_size':
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_font_size: $(this).val()});
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

            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_font_bold: value});
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
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_font_underline: value});
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
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_font_italic: value});
            render = true;
            break;
        case 'cell_background_color':
            value = $(this).val();
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_background_color: value});
            $(this).parents('.wp-picker-container').find('.wp-color-result').css('color', value);
            render = true;
            break;
        case 'cell_font_color':
            value = $(this).val();
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_font_color: value});
            $(this).parents('.wp-picker-container').find('.wp-color-result').css('color', value);
            render = true;
            break;
        case 'format_align_left':
            wptm_element.primary_toolbars.find('a[name="format_align_left"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_center"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_right"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_justify"]').removeClass('active');
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_text_align: 'left'});
            render = true;
            break;
        case 'format_align_center':
            wptm_element.primary_toolbars.find('a[name="format_align_left"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_center"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_right"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_justify"]').removeClass('active');
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_text_align: 'center'});
            render = true;
            break;
        case 'format_align_right':
            wptm_element.primary_toolbars.find('a[name="format_align_left"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_center"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_right"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_justify"]').removeClass('active');
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_text_align: 'right'});
            render = true;
            break;
        case 'format_align_justify':
            wptm_element.primary_toolbars.find('a[name="format_align_left"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_center"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_right"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="format_align_justify"]').addClass('active');
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_text_align: 'justify'});
            render = true;
            break;
        case 'vertical_align_bottom':
            wptm_element.primary_toolbars.find('a[name="vertical_align_bottom"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_middle"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_top"]').removeClass('active');
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_vertical_align: 'bottom'});
            render = true;
            break;
        case 'vertical_align_middle':
            wptm_element.primary_toolbars.find('a[name="vertical_align_bottom"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_middle"]').addClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_top"]').removeClass('active');
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_vertical_align: 'middle'});
            render = true;
            break;
        case 'vertical_align_top':
            wptm_element.primary_toolbars.find('a[name="vertical_align_bottom"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_middle"]').removeClass('active');
            wptm_element.primary_toolbars.find('a[name="vertical_align_top"]').addClass('active');
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_vertical_align: 'top'});
            render = true;
            break;
        case 'padding_border':
            var popup;
            popup = {
                'html': wptm_element.content_popup_hide.find('#padding_border'),
                'showAction': function () {
                    var size_selection = table_function_data.selectionSize - 1;
                    var cellStyle = window.Wptm.style.cells[selection[size_selection][0] + '!' + selection[size_selection][1]][2];

                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cellStyle, 'cell_padding_left', this.find('#jform_cell_padding_left'), 0);
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cellStyle, 'cell_padding_top', this.find('#jform_cell_padding_top'), 0);
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cellStyle, 'cell_padding_right', this.find('#jform_cell_padding_right'), 0);
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cellStyle, 'cell_padding_bottom', this.find('#jform_cell_padding_bottom'), 0);

                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cellStyle, 'cell_background_radius_left_top', this.find('#jform_cell_background_radius_left_top'), 0);
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cellStyle, 'cell_background_radius_right_top', this.find('#jform_cell_background_radius_right_top'), 0);
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cellStyle, 'cell_background_radius_right_bottom', this.find('#jform_cell_background_radius_right_bottom'), 0);
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cellStyle, 'cell_background_radius_left_bottom', this.find('#jform_cell_background_radius_left_bottom'), 0);

                    this.find('.observeChanges').unbind('change').on('change', (e) => {
                        var name = $(e.currentTarget).attr('name');
                        var value = $(e.currentTarget).val();
                        switch (name) {
                            case 'jform[jform_cell_padding_left]':
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_padding_left: value});
                                break;
                            case 'jform[jform_cell_padding_top]':
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_padding_top: value});
                                break;
                            case 'jform[jform_cell_padding_right]':
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_padding_right: value});
                                break;
                            case 'jform[jform_cell_padding_bottom]':
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_padding_bottom: value});
                                break;
                            case 'jform[jform_cell_background_radius_left_top]':
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_background_radius_left_top: value});
                                break;
                            case 'jform[jform_cell_background_radius_right_top]':
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_background_radius_right_top: value});
                                break;
                            case 'jform[jform_cell_background_radius_right_bottom]':
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_background_radius_right_bottom: value});
                                break;
                            case 'jform[jform_cell_background_radius_left_bottom]':
                                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_background_radius_left_bottom: value});
                                break;
                        }
                    });
                    return true;
                },
                'submitAction': function () {
                    this.siblings('.colose_popup').trigger('click');
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges();
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
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_type: 'html'}, "set_cells_type");
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
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].saveChanges(true);
                } else {
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_type: null}, "set_cells_type");
                    parentLi.find('.active').removeClass('active');
                }
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].cleanHandsontable();
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_left: ''});
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_top: ''});
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_right: ''});
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_bottom: ''});
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(border_selection, Wptm, x);
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(border_selection, Wptm, x);
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(border_selection, Wptm, {cell_border_left: ''});
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(border_selection, Wptm, {cell_border_right: ''});
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(border_selection, Wptm, {cell_border_bottom: ''});
                $(this).removeClass('active');
            } else {
                border_cell(border_selection, Wptm, 'cell_border_bottom');
                $(this).addClass('active');
            }
            render = true;
            break;
        case 'border_clear':
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_left: ''});
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_top: ''});
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_right: ''});
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_bottom: ''});
            if (table_function_data.option_selected_mysql !== '' && typeof table_function_data.option_selected_mysql !== 'undefined') {
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_top_start: ''});
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {cell_border_bottom_end: ''});
            }

            // Get cells range above selection
            var topCellsSelections = {};
            Object.keys(selection).map(function(key, index) {
                var x = selection[key][0] - 1 > 0 ? selection[key][0] - 1 : 0;
                topCellsSelections[key] = [x, selection[key][1], x, selection[key][3]];
            });
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(topCellsSelections, Wptm, {cell_border_bottom: ''});

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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(leftCellsSelections, Wptm, {cell_border_right: ''});
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(border_selection, Wptm, {cell_border_right: ''});
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(new_selection['right'], Wptm, {cell_border_right: ''});
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(new_selection['bottom'], Wptm, {cell_border_bottom: ''});
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
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].fillArray(Wptm.style.cells, {cell_border_left: ''}, ij, v[1]);
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].fillArray(Wptm.style.cells, {cell_border_right: ''}, ij, v[3]);
                    }
                    for (ik = v[0]; ik <= v[2]; ik++) {
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].fillArray(Wptm.style.cells, {cell_border_top: ''}, v[0], ik);
                        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].fillArray(Wptm.style.cells, {cell_border_bottom: ''}, v[2], ik);
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
                _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(topCellsSelections, Wptm, {cell_border_bottom: '' + width + 'px ' + cell_border_style + ' ' + border_color});
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
                    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(leftCellsSelections, Wptm, {cell_border_right: '' + width + 'px ' + cell_border_style + ' ' + border_color});
                }
                break;
        }
        var value = {};
        value[foo] = '' + width + 'px ' + cell_border_style + ' ' + border_color;
        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, value);
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
            _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getSelectedVal(function_data.selection[0], that.find('.cellRangeLabelAlternate'));
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
        _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].affterRangeLabe.call(that, window.Wptm, window.jquery);
        that.find('.cellRangeLabelAlternate').val();
    });
    that.find('.cellRangeLabelAlternate').on('keyup', function (e) {
        if (e.which == 13) {
            _alternating__WEBPACK_IMPORTED_MODULE_3__["default"].affterRangeLabe.call(that, window.Wptm, window.jquery);
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
    if (_functions__WEBPACK_IMPORTED_MODULE_1__["default"].checkObjPropertyNested(Wptm.style, 'table')) {
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

    if (!_functions__WEBPACK_IMPORTED_MODULE_1__["default"].checkObjPropertyNested(Wptm.style, 'cells')) {//fix when Wptm.style.cells not exist
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

    if (_functions__WEBPACK_IMPORTED_MODULE_1__["default"].checkObjPropertyNested(Wptm.style, 'cells', end_cell, 2)) {
        if ((Wptm.type === 'html' || selection[size_selection][2] === 0) && typeof cellsStyle[end_cell] !== 'undefined') {
            cell_style = $.extend({}, cell_style, cellsStyle[end_cell][2]);
        }
    } else {//fix when Wptm.style.cells[endCell] not exist
        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getFillArray(selection, Wptm, {});
    }

    //tooltip
    var $tooltip_content = $('#tooltip_content');
    if ($tooltip_content.length > 0) {
        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'tooltip_width', $('#tooltip_width'), 0);

        tinyMCE.EditorManager.execCommand('mceRemoveEditor', true, 'tooltip_content');
        _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'tooltip_content', $('#tooltip_content'), "");
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

    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObjectSelectBox(cell_style, 'cell_font_family', wptm_element.primary_toolbars.find('#cell_font_family'), 'inherit');
    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'cell_font_size', wptm_element.primary_toolbars.find('#cell_font_size'), 13);
    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'cell_font_bold', wptm_element.primary_toolbars.find('#cell_format_bold'), false, function () {
        active_table_option(this);
    });

    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'cell_font_underline', wptm_element.primary_toolbars.find('#cell_format_underlined'), false,
        function () {
            active_table_option(this);
        }
    );
    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'cell_font_italic', wptm_element.primary_toolbars.find('#cell_format_italic'), false,
        function () {
            active_table_option(this);
        }
    );
    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'cell_background_color', wptm_element.primary_toolbars.find('#cell_background_color'), '',
        function () {
            var color = cell_style.cell_background_color;
            this.wpColorPicker('color', color);
            this.parents('.wp-picker-container').find('.wp-color-result').css('color', color);
        }
    );
    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'cell_font_color', wptm_element.primary_toolbars.find('#cell_font_color'), '',
        function () {
            var color = cell_style.cell_font_color;
            this.wpColorPicker('color', color);
            this.parents('.wp-picker-container').find('.wp-color-result').css('color', color);
        }
    );
    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'cell_text_align', wptm_element.primary_toolbars.find('#cell_text_align'), 'left', function () {
        var value = typeof cell_style.cell_text_align === 'undefined' ? '' : cell_style.cell_text_align;

        wptm_element.primary_toolbars.find('a[name="format_align_left"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="format_align_center"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="format_align_right"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="format_align_justify"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="format_align_' + value + '"]').addClass('active');
    });
    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'cell_vertical_align', wptm_element.primary_toolbars.find('#cell_vertical_align'), 'middle', function () {
        var value = typeof cell_style.cell_vertical_align === 'undefined' ? cell_style.cell_vertical_align = 'top' : cell_style.cell_vertical_align;

        wptm_element.primary_toolbars.find('a[name="vertical_align_bottom"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="vertical_align_middle"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="vertical_align_top"]').removeClass('active');
        wptm_element.primary_toolbars.find('a[name="vertical_align_' + value + '"]').addClass('active');
    });
    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].updateParamFromStyleObject(cell_style, 'cell_type', wptm_element.primary_toolbars.find('#cell_type'), '', function () {
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
    _functions__WEBPACK_IMPORTED_MODULE_1__["default"].getSizeCells($, Wptm, endCell);
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

/* harmony default export */ __webpack_exports__["default"] = ({selectOption, loadSelection, updateOptionValTable});


/***/ }),

/***/ "./app/admin/assets/js/_wptm.js":
/*!**************************************!*\
  !*** ./app/admin/assets/js/_wptm.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_functions */ "./app/admin/assets/js/_functions.js");
/* harmony import */ var _initHandsontable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_initHandsontable */ "./app/admin/assets/js/_initHandsontable.js");
/* harmony import */ var _alternating__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_alternating */ "./app/admin/assets/js/_alternating.js");
/* harmony import */ var _toolbarOptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_toolbarOptions */ "./app/admin/assets/js/_toolbarOptions.js");
/* harmony import */ var _chart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_chart */ "./app/admin/assets/js/_chart.js");
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

        _functions__WEBPACK_IMPORTED_MODULE_0__["default"].mergeCollsRowsstyleToCells();

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

        window.table_function_data = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].createRegExpFormat(table_function_data, Wptm.style.table.currency_symbol, Wptm.style.table.date_formats);

        window.Wptm = $.extend({}, window.Wptm, Wptm);

        $('#jform_css').val(Wptm.css);
        $('#jform_css').change();
        _functions__WEBPACK_IMPORTED_MODULE_0__["default"].parseCss($);

        var handRisize, clearHandRisize;
        window.onresize = function () {
            if (!clearHandRisize) {
                clearTimeout(handRisize);
            }

            clearHandRisize = false;
            handRisize = setTimeout(function () {
                var height = _functions__WEBPACK_IMPORTED_MODULE_0__["default"].calculateTableHeight(window.jquery('#wptm-toolbars'));
                jquery(Wptm.container).handsontable('updateSettings', {height: height});
                clearHandRisize = true;
            }, 500);
        };

        if (typeof (Wptm.style.table.alternateColorValue) === 'undefined' || typeof Wptm.style.table.alternateColorValue[0] === 'undefined') {
            var styleRows = null;
            _alternating__WEBPACK_IMPORTED_MODULE_2__["default"].setAlternateColor(styleRows, window.Wptm, window.wptm_element);
        }

        if (_.size(window.table_function_data.oldAlternate) < 1) {
            window.table_function_data.oldAlternate = $.extend({}, Wptm.style.table.alternateColorValue);
        }

        if (_.size(window.table_function_data.allAlternate) < 1) {
            window.table_function_data.allAlternate = $.extend({}, Wptm.style.table.allAlternate);
        }

        //update option table
        _toolbarOptions__WEBPACK_IMPORTED_MODULE_3__["default"].updateOptionValTable($, window.Wptm, [0, 0, 0, 0]);

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
        Object(_initHandsontable__WEBPACK_IMPORTED_MODULE_1__["initHandsontable"])(Wptm.datas);
        wptm_element.primary_toolbars.find('.wptm_name_edit').click(function () {
            if (!$(this).hasClass('editable')) {
                _functions__WEBPACK_IMPORTED_MODULE_0__["default"].setText.call(
                    $(this),
                    wptm_element.primary_toolbars.find('.wptm_name_edit'),
                    '#primary_toolbars .wptm_name_edit',
                    {'url': wptm_ajaxurl + "task=table.setTitle&id=" + Wptm.id + '&title=', 'selected': true}
                );
            }
        });

        $(window).bind('keydown', function(event) {//CTRL + S
            if (!(event.which == 83 && (event.ctrlKey || event.metaKey)) && !(event.which == 19)) return true;
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].saveChanges(true);
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
        if (_functions__WEBPACK_IMPORTED_MODULE_0__["default"].checkObjPropertyNested(Wptm.style.cells[this.row + '!' + this.col], 2, 'cell_type') && Wptm.style.cells[this.row + '!' + this.col][2].cell_type === 'html') {
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
        _functions__WEBPACK_IMPORTED_MODULE_0__["default"].parseCss($);
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
    _functions__WEBPACK_IMPORTED_MODULE_0__["default"].loading(wptm_element.wpreview);

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
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].rloading(wptm_element.wpreview);
        },
        error: function (jqxhr, textStatus, error) {
            popup_notification.html('<span class="noti_false">'+wptmText.have_error+'</span>');
            popup_notification.removeClass('wptm_hiden');
            _functions__WEBPACK_IMPORTED_MODULE_0__["default"].rloading(wptm_element.wpreview);
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

/* harmony default export */ __webpack_exports__["default"] = ({
    updatepreview,
    fetchSpreadsheet
});


/***/ }),

/***/ 0:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** multi ./app/admin/assets/js/_alternating.js ./app/admin/assets/js/_changeTheme.js ./app/admin/assets/js/_chart.js ./app/admin/assets/js/_customRenderer.js ./app/admin/assets/js/_functions.js ./app/admin/assets/js/_initHandsontable.js ./app/admin/assets/js/_toolbarOptions.js ./app/admin/assets/js/_wptm.js ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./app/admin/assets/js/_alternating.js */"./app/admin/assets/js/_alternating.js");
__webpack_require__(/*! ./app/admin/assets/js/_changeTheme.js */"./app/admin/assets/js/_changeTheme.js");
__webpack_require__(/*! ./app/admin/assets/js/_chart.js */"./app/admin/assets/js/_chart.js");
__webpack_require__(/*! ./app/admin/assets/js/_customRenderer.js */"./app/admin/assets/js/_customRenderer.js");
__webpack_require__(/*! ./app/admin/assets/js/_functions.js */"./app/admin/assets/js/_functions.js");
__webpack_require__(/*! ./app/admin/assets/js/_initHandsontable.js */"./app/admin/assets/js/_initHandsontable.js");
__webpack_require__(/*! ./app/admin/assets/js/_toolbarOptions.js */"./app/admin/assets/js/_toolbarOptions.js");
module.exports = __webpack_require__(/*! ./app/admin/assets/js/_wptm.js */"./app/admin/assets/js/_wptm.js");


/***/ })

/******/ });
//# sourceMappingURL=wptm.js.map