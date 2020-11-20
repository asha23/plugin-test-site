import tableFunction from "./_functions";

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

        if (tableFunction.checkObjPropertyNestedNotEmpty( Wptm.style.cols, col, 1)) {
            cellStyle[2] = jquery.extend([], Wptm.style.cols[col][1]);
        }
        if (tableFunction.checkObjPropertyNestedNotEmpty( Wptm.style.rows, row, 1)) {
            cellStyle[2] = jquery.extend([], cellStyle[2], Wptm.style.rows[row][1]);
        }

        if (tableFunction.checkObjPropertyNested(Wptm.style,'cells', row + "!" + col, 2)) {
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
            if (tableFunction.checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_type')) {
                celltype = cellStyle[2].cell_type;
            } else if (typeof cellStyle[2].cell_type !== 'undefined') {
                delete cellStyle[2].cell_type;
            }
            if (tableFunction.checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_background_color')) {
                css["background-color"] = cellStyle[2].cell_background_color;
            }
            if (tableFunction.checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_top')) {
                css["border-top"] = cellStyle[2].cell_border_top;
            }
            if (tableFunction.checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_top_start')) {
                if (0 == row) {
                    css["border-top"] = cellStyle[2].cell_border_top_start;
                }
            }
            if (tableFunction.checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_right')) {
                css["border-right"] = cellStyle[2].cell_border_right;
            }
            if (tableFunction.checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_bottom')) {
                css["border-bottom"] = cellStyle[2].cell_border_bottom;
            }
            if (tableFunction.checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_bottom_end')) {
                if (_.size(Wptm.style.rows) - 1 == row) {
                    css["border-bottom"] = cellStyle[2].cell_border_bottom_end;
                }
            }
            if (tableFunction.checkObjPropertyNestedNotEmpty(cellStyle,2,'cell_border_left')) {
                css["border-left"] = cellStyle[2].cell_border_left;
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_font_bold') && cellStyle[2].cell_font_bold === true) {
                css["font-weight"] = "bold";
            } else {
                delete css["font-weight"];
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_font_italic') && cellStyle[2].cell_font_italic === true) {
                css["font-style"] = "italic";
            } else {
                delete css["font-style"];
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_font_underline') && cellStyle[2].cell_font_underline === true) {
                css["text-decoration"] = "underline";
            } else {
                delete css["text-decoration"];
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_text_align')) {
                css["text-align"] = cellStyle[2].cell_text_align;
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_vertical_align')) {
                css["vertical-align"] = cellStyle[2].cell_vertical_align;
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_font_family')) {
                css["font-family"] = cellStyle[2].cell_font_family;
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_font_size')) {
                css["font-size"] = cellStyle[2].cell_font_size + "px";
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_font_color')) {
                css["color"] = cellStyle[2].cell_font_color;
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_padding_left')) {
                css["padding-left"] = cellStyle[2].cell_padding_left + "px";
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_padding_top')) {
                css["padding-top"] = cellStyle[2].cell_padding_top + "px";
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_padding_right')) {
                css["padding-right"] = cellStyle[2].cell_padding_right + "px";
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_padding_bottom')) {
                css["padding-bottom"] = cellStyle[2].cell_padding_bottom + "px";
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_background_radius_left_top')) {
                css["border-top-left-radius"] = cellStyle[2].cell_background_radius_left_top + "px";
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_background_radius_right_top')) {
                css["border-top-right-radius"] = cellStyle[2].cell_background_radius_right_top + "px";
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_background_radius_right_bottom')) {
                css["border-bottom-right-radius"] = cellStyle[2].cell_background_radius_right_bottom + "px";
            }
            if (tableFunction.checkObjPropertyNested(cellStyle,2,'cell_background_radius_left_bottom')) {
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
                                datas = Wptm.container.handsontable('getDataAtCell', val1[2] - 1, tableFunction.convertAlpha(val1[1].toUpperCase()) - 1);
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
                        rCells = Wptm.container.handsontable('getData', val1[2] - 1, tableFunction.convertAlpha(val1[1]) - 1, val2[2] - 1, tableFunction.convertAlpha(val2[1]) - 1);
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
                        if (tableFunction.convertDate(function_data.date_format, cells[ij].match(/[a-zA-Z0-9|+|-|\\]+/g), true) !== false) {
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
                            var date_string = tableFunction.convertDate(function_data.date_format, values, false);
                            date_string = date_string !== false ? new Date(date_string) : check_value_data = false;

                            //convert values --> (string) date pursuant date_format have timezone
                            var date_string_timezone = tableFunction.convertDate(function_data.date_format, values, true);
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
                                    var string_day = tableFunction.convertDate(function_data.date_format, number, false);
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
                                    var string_day = tableFunction.convertDate(function_data.date_format, number, true);
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
                                    var string_day = tableFunction.convertDate(function_data.date_format, number, true);
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
                        resultCalc = tableFunction.formatSymbols(
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
                            resultCalc = tableFunction.formatSymbols(
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

                        resultCalc = tableFunction.formatSymbols(
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
                        resultCalc = tableFunction.formatSymbols(
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
                        resultCalc = tableFunction.formatSymbols(
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
                        resultCalc = tableFunction.formatSymbols(
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

export default {
    render,
    evaluateFormulas,
}
