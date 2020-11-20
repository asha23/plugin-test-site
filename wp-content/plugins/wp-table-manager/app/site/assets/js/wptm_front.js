(function ($) {
    var getScrollbarWidth = function (selector) {
        var scrollWidth;
        if (typeof selector.get(0) === 'undefined') {
            scrollWidth = 0;
        } else {
            scrollWidth = selector.get(0).offsetWidth - selector.get(0).clientWidth;
            if (scrollWidth === 0) {
                scrollWidth = 20;
            }
        }
        return scrollWidth;
    };
    var addMarginTopToFixedColumn = function (currentTable, numberRows) {
        var scrollWrapper = currentTable.closest(".DTFC_ScrollWrapper");
        if (scrollWrapper.length < 1) {
            scrollWrapper = currentTable.closest(".dataTables_wrapper");
        }

        var totalRowHeight = scrollWrapper
            .find(".DTFC_TopBodyWrapper")
            .outerHeight();

        var leftScroll = scrollWrapper.find(".DTFC_LeftBodyLiner table");
        leftScroll.css({
            marginTop: totalRowHeight + "px",
        });
    };
    var filterDelay = null;
    var filterDelayInterval = 250;


    var cloneFixedTopWrapper = function (currentTable, numberRows, numCols) {
        var scrollWrapper = currentTable.closest(".DTFC_ScrollWrapper");
        if (scrollWrapper.length < 1) {
            scrollWrapper = currentTable.closest(".dataTables_wrapper");
        }

        var scrollBody = scrollWrapper
            .find(".dataTables_scroll")
            .find(".dataTables_scrollBody");
        var topWrapper = scrollWrapper.find(".dataTables_scroll").clone();
        var tableScrollHeaderHeight = scrollWrapper
            .find(".dataTables_scrollHead")
            .outerHeight();

        topWrapper.removeClass("dataTables_scroll").addClass("DTFC_TopWrapper");
        topWrapper.css({
            position: "absolute",
            top: tableScrollHeaderHeight + "px",
            left: "0px",
            width: "100%",
            paddingRight: getScrollbarWidth(scrollBody) + "px",
            height: "1px",
        });
        //change scroll head class
        topWrapper
            .find(".dataTables_scrollHead")
            .addClass("DTFC_TopHeadWrapper")
            .removeClass("dataTables_scrollHead")
            .attr("style", "")
            .css({
                position: "relative",
                top: "0",
                left: "0",
                height: "0",
                overflow: "hidden",
            });
        topWrapper
            .find(".DTFC_TopHeadWrapper table")
            .addClass("DTFC_Cloned")
            .unwrap()
            .wrap('<div class="DTFC_TopHeadLiner"></div>');
        topWrapper.find(".DTFC_TopHeadWrapper table thead tr").css({
            height: 0,
        });

        var totalRowHeight = 0;

        var datatableScroll = scrollWrapper.find(".dataTables_scroll");
        var datatableScrollBody = datatableScroll.find(".dataTables_scrollBody");
        var datatableScrollBodyTable = datatableScrollBody.find("table");

        for (var i = 0; i < numberRows; i++) {
            var dataScrollRow = scrollWrapper
                .find(".dataTables_scrollBody table tbody tr")
                .eq(i);
            totalRowHeight += dataScrollRow.outerHeight();
            datatableScrollBodyTable.find("tbody tr").eq(i).addClass("hidden_row");
        }

        topWrapper
            .find(".dataTables_scrollBody")
            .addClass("DTFC_TopBodyWrapper")
            .removeClass("dataTables_scrollBody")
            .attr("style", "")
            .css({
                position: "relative",
                top: "0",
                left: "0",
                height: totalRowHeight + "px",
                overflow: "hidden",
            });
        topWrapper
            .find(".DTFC_TopBodyWrapper table")
            .removeAttr("id")
            .addClass("DTFC_Cloned")
            .wrap('<div class="DTFC_TopBodyLiner"></div>');
        topWrapper.find(".DTFC_TopBodyLiner").css({
            overflowX: "scroll",
        });
        topWrapper.find(".DTFC_TopBodyLiner table thead tr").addClass('hidden_row');
        topWrapper.find(".DTFC_TopBodyLiner table tbody tr.droptable_none").remove();

        topWrapper.appendTo(scrollWrapper);

        //set margin top for original table
        datatableScrollBodyTable.css({
            marginTop: totalRowHeight + "px",
        });

        if (numCols > 0) {
            var topLeftWrapper = scrollWrapper.find(".DTFC_TopWrapper").clone();
            topLeftWrapper
                .addClass("DTFC_TopLeftWrapper")
                .removeClass("DTFC_TopWrapper");
            topLeftWrapper.css({
                padding: 0,
                width: scrollWrapper.find(".DTFC_LeftWrapper").width() + "px",
            });
            topLeftWrapper
                .find(".DTFC_TopBodyLiner")
                .addClass("DTFC_TopLeftBodyLiner")
                .removeClass("DTFC_TopBodyLiner");

            topLeftWrapper.appendTo(scrollWrapper);
        }

        var mainScroll = scrollWrapper.find(".dataTables_scrollBody");
        var topBodyScroll = scrollWrapper.find(".DTFC_TopBodyLiner");
        mainScroll.scroll(function () {
            topBodyScroll.scrollLeft($(this).scrollLeft());
        });

        // initFilterRow(tableDom);
    };

    var calculateHeaderColspanResponsive = function (table, tableDom, colWidths) {
        var header = tableDom.find('thead .row0').eq(0);
        var colspans = [];
        table.columns().every(function (index) {
            var currFirstColWidth = 0;
            var thCol = header.find('th[data-dtc="' + index + '"]');
            var nextColIndexes = [];
            if (thCol.attr('colspan') > 1) {
                var currColIndex = thCol.data('dtc');
                var numberColspan = thCol.attr('colspan');
                colspans.push([currColIndex]);
                nextColIndexes.push(currColIndex);
                for (var i = 0; i < numberColspan; i++) {
                    i++;
                    var nextColIndex = currColIndex + i;
                    nextColIndexes.push(nextColIndex);
                }
            }
        });
    };

    var hideFilterOnResponsive = function (table, tableDom) {
        var filterRow = tableDom.find(".wptm-filter-row");
        table.columns().every(function (index) {
            var thCol = filterRow.find('th[data-dtc="' + index + '"]');
            if (thCol.length < 1) {
                thCol = filterRow.find('th.dtc' + index);
            }
            if (this.responsiveHidden()) {
                thCol.css({display: ""});
            } else {
                thCol.css({display: "none"});
            }
        });
    };

    $(window).resize(function () {
        $(".wptmtable").each(function (index, obj) {
            var wptmtable = $(obj);
            var table_id = wptmtable.data("tableid");
            var currTable = $("#" + table_id);
            var tableWrapper = currTable.closest(".dataTables_wrapper");
            var wptmtable = tableWrapper.parent();

            var colWidths = currTable.data('colwidths');
            var totalWidth = 0;

            if (typeof colWidths !== "undefined") {
                for (var i = 0; i < colWidths.length; i++) {
                    totalWidth += colWidths[i];
                }
            }

            if (currTable.data("responsive")) {
                if (totalWidth > 0) {
                    if (wptmtable.width() >= totalWidth) {
                        tableWrapper.css('width', currTable.data('tablewidth'));
                    } else {
                        tableWrapper.css("width", "100%");
                        currTable.css("width", "100%");
                    }
                }
            } else {
                if (tableWrapper.width() >= tableWrapper.parent().width()) {
                    tableWrapper.css("width", "100%");
                    if (tableWrapper.width() >= currTable.width()) {
                        tableWrapper.css("width", currTable.width());
                    }
                } else {
                    var scrollBarWidth = getScrollbarWidth(
                        currTable.closest(".dataTables_scroll").find(".dataTables_scrollBody")
                    );
                    tableWrapper.css("width", currTable.width() + scrollBarWidth);
                }
            }
        });
    });
    var keyupDelay = function (callback, ms) {
        var timer = 0;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    };
    $(document).ready(function () {
        $(".wptmtable").each(function (index, obj) {
            var wptmtable = $(obj);
            var table_id = wptmtable.data("tableid");
            var tableOptions = {};
            var tableDom = $("#" + table_id);
            if (!tableDom.length) {
                return;
            }
            var table_id_num = tableDom.data('id');
            var colWidths = tableDom.data('colwidths');

            tableDom.attr("data-tablewidth", tableDom.width());


            tableOptions.orderCellsTop = false;
            tableOptions.dom = '<"top">rt<"bottom"pl><"clear">';
            var tableLanguage = {};
            if (tableDom.data("hidecols")) {
                tableOptions.dom = '<"top">Bfrt<"bottom"pl><"clear">';
                tableOptions.buttons = ["colvis"];
                tableLanguage.buttons = {colvis: tableDom.data("hidecolslanguage")};
            }
            tableLanguage.lengthMenu =
                '<select><option value="10">10</option><option value="20">20</option><option value="40">40</option><option value="-1">All</option></select>';

            if (tableDom.data("paging")) {
                tableOptions.pagingType = "full_numbers";
                //if (tableDom.data("type") === 'html') {
                    tableOptions.processing = true;
                    tableOptions.serverSide = true;
                    tableOptions.createdRow = function( row, data, dataIndex ) {
                        var keys = Object.keys(data);
                        $(row).addClass( 'row' + data.DT_RowId );
                        keys.forEach(function (key, index) {
                            if (key !== 'DT_RowId') {
                                var cRow = $(row).find('td:nth-child(' + (parseInt(key) + 1).toString() + ')');
                                if (cRow.length) {
                                    cRow.addClass('dtr' + data.DT_RowId).addClass('dtc' + key);
                                }
                            }
                        });

                    };
                    tableOptions.ajax = {
                        'url': wptm_ajaxurl + 'task=table.loadPage&id=' + table_id_num,
                        'type': 'POST',
                        'dataFilter': function(json){
                            var json = jQuery.parseJSON(json);
                            var data = {};
                            data.recordsTotal = json.data.total;
                            data.recordsFiltered = json.data.filteredTotal;
                            data.data = json.data.rows;
                            data.page = json.data.page;
                            data.draw = json.data.draw;

                            return JSON.stringify(data); // return JSON string
                        }
                    };
                    tableOptions.fnDrawCallback = function( oSettings ) {
                        wptm_tooltip();
                        setTimeout(function() {
                            $('.dataTables_wrapper .dataTables_scrollBody thead').hide();
                            $('.DTFC_LeftBodyWrapper thead').hide();
                        }, 500);
                    };
                //}

                tableOptions.lengthMenu = [
                    [10, 20, 40, -1],
                    [10, 20, 40, "All"],
                ];
                tableLanguage.paginate = {
                    first:
                        "<i class='icon-step-backward glyphicon glyphicon-step-backward'></i>",
                    previous:
                        "<i class='icon-arrow-left glyphicon glyphicon-backward'></i>",
                    next: "<i class='icon-arrow-right glyphicon glyphicon-forward'></i>",
                    last:
                        "<i class='icon-step-forward glyphicon glyphicon-step-forward'></i>",
                };
            }
            tableOptions.fnInitComplete = function( settings, json ) {
                setTimeout(function() {
                    $('.dataTables_wrapper .dataTables_scrollBody thead').hide();
                    $('.DTFC_LeftBodyWrapper thead').hide();
                }, 500);
            };
            tableOptions.language = tableLanguage;

            var initFilterRow = function(tableDom) {
                // Apply the search
                if (tableDom.hasClass("filterable")) {
                    addFilterRowToTable(tableDom);
                }
            };
            var addFilterRowToTable = function(tbl) {
                // Add an input to latest th in header
                tbl.find("thead tr:not(.wptm-header-cells-index):last-child th").each(function(i) {
                    var thContent = $(this).html();
                    var inputHtml = '<br><input onClick="var event = arguments[0] || window.event;event.stopPropagation();" type="text" name="wtmp_col_filter" class="wptm-d-block wptm-filter-input stop-propagation" data-index="' + i + '" value="" />';
                    $(this).html(thContent + inputHtml);
                });
            };


            if (tableDom.data("ordering")) {
                tableOptions.ordering = true;
                var dataOrder = [];
                dataOrder.push(tableDom.data("ordertarget"));
                dataOrder.push(tableDom.data("ordervalue"));
                tableOptions.order = dataOrder;
            }

            initFilterRow($(tableDom));

            var table = tableDom.DataTable(tableOptions);

            $(table.table().container()).on('keyup change', 'input.wptm-filter-input', function (e)
            {
                e.stopPropagation();
                columnFilter(table, $(this).data('index'), $(this).val());
            });

            if (typeof tableDom.data("freezecol") !== "undefined") {
                new $.fn.dataTable.FixedColumns(table, {
                    leftColumns: tableDom.data("freezecol"),
                });
            }

            var columnFilter = function (table, columnIndex, val) {
                if (table.column(columnIndex).search() !== val) {
                    window.clearTimeout(filterDelay);
                    filterDelay = window.setTimeout(function() {
                        table.column(columnIndex).search(val).draw();
                    }, filterDelayInterval);
                }
            };

            if (tableDom.data("responsive") === true) {
                if ($(".wptm-filter-row").length > 0) {
                    hideFilterOnResponsive(table, tableDom);
                }
                //calculateHeaderColspanResponsive(table, tableDom, colWidths);
                table.on("responsive-resize", function () {
                    if ($(".wptm-filter-row").length > 0) {
                        hideFilterOnResponsive(table, tableDom);
                    }
                });
            }

            // Change div table wrapper width
            var tableWrapper = tableDom.closest(".dataTables_wrapper");
            var tableAlign = tableDom.data("align");
            var margin = "0 0 0 auto";
            if (tableAlign === "center") {
                margin = "0 auto";
            } else if (tableAlign === "left") {
                margin = "0 auto 0 0";
            }

            var totalWidth = 0;

            if (typeof colWidths !== "undefined") {
                for (var i = 0; i < colWidths.length; i++) {
                    totalWidth += colWidths[i];
                }
            }


            if (tableDom.data("responsive")) {
                if (totalWidth > 0) {
                    if (tableWrapper.parent().width() >= totalWidth) {
                        tableWrapper.css('width', totalWidth + 'px');
                        tableDom.css('width', '100%');
                    } else {
                        tableWrapper.css("width", "100%");
                        tableDom.css("width", "100%");
                    }
                }
            } else {
                var width_content = tableDom.width();
                var scrollBarWidth = getScrollbarWidth(
                  tableDom.closest(".dataTables_scroll").find(".dataTables_scrollBody")
                );

                if (tableWrapper.width() >= tableWrapper.parent().width()) {
                    tableWrapper.css("width", "100%");
                    if (tableWrapper.width() >= width_content) {
                        width_content = width_content + scrollBarWidth;
                    } else {
                        width_content = tableWrapper.width() + 10;
                    }
                    tableWrapper.css("width", width_content);
                } else {
                    tableWrapper.css("width", width_content + scrollBarWidth);
                }
            }
            tableWrapper.css("margin", margin);

            // if (typeof tableDom.data("freezerow") !== "undefined") {
            //     var numRow = tableDom.data("freezerow") - 1;
            //     var numCol =
            //         typeof tableDom.data("freezecol") !== "undefined"
            //             ? tableDom.data("freezecol")
            //             : 0;
            //     if (numRow > 0) {
            //         cloneFixedTopWrapper(tableDom, numRow, numCol);
            //     }
            // }


            table.rows(".hidden_row").remove().draw();

            // if (numCol > 0) {
            //     addMarginTopToFixedColumn(tableDom, numRow);
            // }

            // table.on("draw.dt", function () {
            //     addMarginTopToFixedColumn(tableDom, numRow);
            // });

            if (!tableDom.data("paging")) {
                tableDom
                    .closest(".wptmtable")
                    .find(".dataTables_info")
                    .css("display", "none");
            }
            // // Sorting
            // var header = tableDom
            //     .closest(".wptmtable")
            //     .find(".dataTables_scroll .dataTables_scrollHeadInner .row0")
            //     .eq(0);
            // var header_indexes = tableDom
            //     .closest(".wptmtable")
            //     .find(".dataTables_scroll .dataTables_scrollHeadInner .wptm-header-cells-index");
            // if (tableDom.closest(".wptmtable").find(".dataTables_scroll").length === 0) {
            //     header = tableDom
            //         .closest(".wptmtable")
            //         .find("table.dataTable .row0")
            //         .eq(0);
            //     header_indexes = tableDom
            //         .closest(".wptmtable")
            //         .find("table.dataTable .wptm-header-cells-index");
            // }
            // if (header.length > 0) {
            //     header.find("th").each(function (thIndex, thObj) {
            //         var headerCell = $(thObj);
            //         if (Number(headerCell.attr("colspan")) > 1) {
            //             var dtr = headerCell.data("dtr");
            //             var dtc = headerCell.data("dtc");
            //             var headerTh = header_indexes.find(
            //                 "th[data-dtr=" + dtr + "][data-dtc=" + dtc + "]"
            //             );
            //             if (headerTh.length > 0) {
            //                 var thIdxClasses = headerTh.attr("class").split(" ");
            //                 for (var i = 0; i < thIdxClasses.length; i++) {
            //                     if ($.inArray("sorting", thIdxClasses) !== -1) {
            //                         var sortClass = "sorting";
            //                     } else {
            //                         var matches = /^sorting\_(.+)/.exec(thIdxClasses[i]);
            //                         if (matches != null) {
            //                             var sortClass = matches[0];
            //                         }
            //                     }
            //                 }
            //                 headerCell
            //                     .removeClass("sorting sorting_asc sorting_desc")
            //                     .addClass(sortClass);
            //             }
            //             headerCell.on("click", function () {
            //                 if (header_indexes.length > 0) {
            //                     header_indexes.find("th").each(function (thIdxIndex, thIdxObj) {
            //                         if (
            //                             $(thIdxObj).data("dtr") === dtr &&
            //                             $(thIdxObj).data("dtc") === dtc
            //                         ) {
            //                             $(thIdxObj).trigger("click");
            //                             var thIdxClasses = $(thIdxObj).attr("class").split(" ");
            //                             for (var i = 0; i < thIdxClasses.length; i++) {
            //                                 var matches = /^sorting\_(.+)/.exec(thIdxClasses[i]);
            //                                 if (matches != null) {
            //                                     var sortClass = matches[0];
            //                                 }
            //                             }
            //                             headerCell
            //                                 .removeClass("sorting sorting_asc sorting_desc")
            //                                 .addClass(sortClass);
            //                         }
            //                     });
            //                 }
            //             });
            //         }
            //     });
            // }

            var hightLight = tableDom.closest(".wptm_table").data("hightlight");
            if (typeof hightLight === "undefined") {
                hightLight = tableDom.closest(".wptm_dbtable").data("highlight");
            }
            var classHightLight = "droptables-highlight-vertical";
            if (hightLight === 1) {
                table.on("mouseenter", "td", function () {
                    if (typeof table.cell(this).index() !== "undefined") {
                        var colIdx = table.cell(this).index().column;
                        var rowIdx = table.cell(this).index().row;
                        var affectedRow = 0;
                        var affectedCol = table.cell(this).index().column;

                        $(table.cells().nodes()).removeClass(
                            "droptables-highlight-vertical"
                        );
                        $(table.column(colIdx).nodes()).addClass(
                            "droptables-highlight-vertical"
                        );

                        table.row(rowIdx).every(function () {
                            var row = $(this.node());
                            row.find("td").addClass("droptables-highlight-vertical");
                            affectedRow = row.find("td").data("dtr");
                        });
                        var leftWrapperTable = tableDom
                            .closest(".dataTables_wrapper")
                            .find(".DTFC_LeftBodyLiner table");
                        var topWrapperTable = tableDom
                            .closest(".dataTables_wrapper")
                            .find(".DTFC_TopBodyLiner table");
                        if (leftWrapperTable.length > 0) {
                            leftWrapperTable.find("td").removeClass(classHightLight);
                            leftWrapperTable
                                .find(".dtr" + affectedRow)
                                .addClass(classHightLight);
                        }
                        if (topWrapperTable.length > 0) {
                            topWrapperTable.find("td").removeClass(classHightLight);
                            topWrapperTable
                                .find(".dtc" + affectedCol)
                                .addClass(classHightLight);
                        }
                    }
                });
                table.on("mouseleave", "td", function () {
                    if (typeof table.cell(this).index() !== "undefined") {
                        $(table.cells().nodes()).removeClass(
                            "droptables-highlight-vertical"
                        );

                        var leftWrapperTable = tableDom
                            .closest(".dataTables_wrapper")
                            .find(".DTFC_LeftBodyLiner table");
                        var topWrapperTable = tableDom
                            .closest(".dataTables_wrapper")
                            .find(".DTFC_TopBodyLiner table");
                        if (leftWrapperTable.length > 0) {
                            leftWrapperTable.find("td").removeClass(classHightLight);
                        }
                        if (topWrapperTable.length > 0) {
                            topWrapperTable.find("td").removeClass(classHightLight);
                        }
                    }
                });
            }
        });
        setTimeout(function () {
            wptm_tooltip();
        }, 100);

        function wptm_tooltip() {
            $(".wptm_tooltip ").each(function () {
                var that = $(this);
                $(that).tipso({
                    useTitle: false,
                    tooltipHover: true,
                    background: "#000000",
                    color: "#ffffff",
                    offsetY: 0,
                    width: $(that).find(".wptm_tooltipcontent").data("width"),
                    content: $(that).find(".wptm_tooltipcontent").html(),
                    onShow: function (ele, tipso, obj) {
                        //calculate top tipso_bubble when set width
                        var size = realHeight(obj.tooltip());
                        $(obj.tipso_bubble[0]).css(
                            "top",
                            obj.tipso_bubble[0].offsetTop +
                            (size.height - obj.tipso_bubble.outerHeight())
                        );
                    },
                });
            });

            function realHeight(obj) {
                var clone = obj.clone();
                clone.css("visibility", "hidden");
                $("body").append(clone);
                var height = clone.outerHeight();
                var width = clone.outerWidth();
                clone.remove();
                return {
                    width: width,
                    height: height,
                };
            }
        }

        $(".wptm_table .download_wptm")
            .unbind("click")
            .click(function () {
                var id_table = $(this).parents(".wptm_table").data("id");
                var url =
                    $(this).data("href") +
                    "task=sitecontrol.export&id=" +
                    id_table +
                    "&format_excel=xlsx&onlydata=0";
                $.fileDownload(url, {
                    failCallback: function (html, url) {
                    },
                });
            });
    });
})(jQuery);
