import tableFunction from "./_functions";
import alternating from "./_alternating";

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
        tableFunction.showChartOrTable(true, $('#list_chart').find('.chart-menu[data-id="' + Wptm.chart_active + '"]'));
    }

    $wptm_top_chart.find('.edit').unbind('click').on('click', function (e) {
        $wptm_top_chart.find('.wptm_name_edit').addClass('rename');
        $wptm_top_chart.find('.wptm_name_edit').trigger('click');
    });

    $wptm_top_chart.find('.wptm_name_edit').click(function () {
        if (!$(this).hasClass('editable')) {
            tableFunction.setText.call(
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
                alternating.affterRangeLabe.call(wptm_element.chartTabContent, window.Wptm, window.jquery);
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
                    tableFunction.showChartOrTable(true, $('#list_chart').find('.chart-menu').eq(count));
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
                    var unit = tableFunction.stringReplace(cellsData[i][j], true);
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
                            rowData[j] = tableFunction.getCellData(cells[i][j]);
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
            arr[c] = tableFunction.stringReplace(arr[c], false);
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
        if (typeof (Cells[r]) === 'string' && isNaN(parseInt(tableFunction.stringReplace(Cells[r], false)))) {
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
        data[j] = tableFunction.getCellData(row[j]);
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

export default DropChart
