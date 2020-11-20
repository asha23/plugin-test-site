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

jQuery(document).ready(function ($) {
    if (table_id === '')
        jQuery('title').text(wptmText.TABLE_CREATION_WIZARD_TITLE_TAG);
    else
        jQuery('title').text(wptmText.TABLE_EDIT_WIZARD_TITLE_TAG);

    var $wptm_mysql_tables = $('#wptm_mysql_tables');
    var $wptm_mysql_tables_columns = $('#wptm_mysql_tables_columns');
    var $wptm_mysql_tables_columns_title = $('#wptm_mysql_tables_columns_title');
    var $wptm_mysql_tables_columns_title_list = $('#wptm_mysql_tables_columns_title table tbody');
    var $wptm_mysql_default_ordering = $('#wptm_mysql_default_ordering');
    var $wptm_mysql_table_pagination = $('#wptm_mysql_table_pagination');
    var $wptm_mysql_number_of_rows = $('#wptm_mysql_number_of_rows');
    var $wptm_define_mysql_relations = $('.wptm_define_mysql_relations');
    var $wptm_define_mysql_conditions = $('.wptm_define_mysql_conditions');
    var $wptm_define_mysql_grouping = $('.wptm_define_mysql_grouping');
    var $wptm_previewTable = $('.wptm_previewTable');
    var $wptm_mysqlRelationBlock = $('#wptm-template-mysqlRelationBlock');

    var Scrollbar = window.Scrollbar;
    Scrollbar.initAll({
        damping: 0.5,
        thumbMinSize: 10,
        alwaysShowTracks: true
    });

    if ($('#adminmenuwrap').length > 0) {
        $('#adminmenuwrap').addClass('smooth-scrollbar');
        Scrollbar.init(document.querySelector('#adminmenuwrap'), {
            damping: 0.5,
            thumbMinSize: 10,
            alwaysShowTracks: false
        });
    }

    // Add smooth scrolling to all links
    $("a.btn-next-step").on('click', function (event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 500, function () {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });

    if ($wptm_mysql_tables_columns.find('.uploader').outerHeight() > $wptm_mysql_tables_columns.outerHeight()) {
        $wptm_mysql_tables_columns.addClass('margin_left');
    }

    $wptm_mysql_tables.find('.mysql_table').on('click', function () {
        var that = $(this);
        if (that.hasClass('active')) {
            that.removeClass('active');
        } else {
            that.addClass('active');
        }

        var selected_tables = {};
        $wptm_mysql_tables.find('.mysql_table.active').each(function (i) {
            selected_tables[i] = $(this).data('value');
        });
        constructedTableData.tables = selected_tables;
        jsonVar = {
            'tables': selected_tables
        };

        $.ajax({
            url: wptm_ajaxurl + "task=dbtable.changeTables",
            type: "POST",
            data: jsonVar
        }).done(function (data) {
            var result = jQuery.parseJSON(data);
            if (result.response === true) {
                var columns;
                columns = result.datas.columns;

                $wptm_mysql_tables_columns.find('.uploader').html('');
                var col;
                for (i = 0; i < columns.all_columns.length; i++) {
                    col = columns.all_columns[i];
                    $wptm_mysql_tables_columns.find('.uploader').append('<div data-value="' + col + '" class="mysql_option mysql_column">' +
                        '<span>' + col + '</span></div>');
                }
                $.each(constructedTableData.mysql_columns, function () {
                    $wptm_mysql_tables_columns.find('.uploader .mysql_option[data-value="' + this + '"]').addClass('active');
                });
                var curr_columns = [];
                $wptm_mysql_tables_columns.find('.mysql_column.active').each(function (idx, obj) {
                    curr_columns.push($(obj).data('value'));
                });
                constructedTableData.mysql_columns = curr_columns;
                render_custom_title_column();

                $wptm_define_mysql_relations.find('div.mysqlRelationsContainer > div').remove();
                $wptm_define_mysql_relations.hide();

                if ($wptm_mysql_tables_columns.find('.uploader').outerHeight() > $wptm_mysql_tables_columns.outerHeight()) {
                    $wptm_mysql_tables_columns.addClass('margin_left');
                } else {
                    $wptm_mysql_tables_columns.removeClass('margin_left');
                }

                if (_.size(selected_tables) > 1) {
                    var conditions_columns = {post_type_columns: []};
                    // Generate HTML block for relations constructor
                    for (var i in columns.sorted_columns) {
                        var mysql_table_block = {table: i, columns: [], other_table_columns: []};
                        for (var col_index in columns.sorted_columns[i]) {
                            conditions_columns.post_type_columns.push(columns.sorted_columns[i][col_index]);
                        }
                        for (var j in columns.sorted_columns) {
                            if (i === j) {
                                for (var k in columns.sorted_columns[i]) {
                                    mysql_table_block.columns.push(columns.sorted_columns[i][k].replace(i + '.', ''));
                                }
                                continue;
                            }
                            for (var k in columns.sorted_columns[j]) {
                                mysql_table_block.other_table_columns.push(columns.sorted_columns[j][k]);
                            }
                        }

                        var mysqlRelationBlockTemplate = $wptm_mysqlRelationBlock.html();
                        var template = Handlebars.compile(mysqlRelationBlockTemplate);
                        var relationBlockHtml = template(mysql_table_block);
                        $wptm_define_mysql_relations.find('div.mysqlRelationsContainer').append(relationBlockHtml);

                    }
                    $wptm_define_mysql_relations.show();
                    $wptm_define_mysql_conditions.find('.whereConditionColumn').each(function() {
                        var old_val = $(this).val();
                        $(this).empty();
                        for(var i in conditions_columns.post_type_columns) {
                            $(this).append('<option value="' + conditions_columns.post_type_columns[i] + '" >' + conditions_columns.post_type_columns[i] + '</option>');
                        }
                        $(this).val(old_val);
                    });
                }
                if (_.size(selected_tables) > 0) {
                    $('.please_select_table').hide();
                } else {
                    $('.please_select_table').show();
                    $wptm_define_mysql_conditions.find('.whereConditionColumn').each(function() {
                        $(this).empty();
                    });
                }
            } else {
                bootbox.alert(result.response);
            }
        });
    });
    /**
     * Add the selected MySQL columns to the constructed table data
     */
    $wptm_mysql_tables_columns.on('click', '.mysql_column', function () {
        var that = $(this);
        if (that.hasClass('active')) {
            that.removeClass('active');
            var index = constructedTableData.mysql_columns.indexOf($(this).data('value'));
            if (index > -1) {
                constructedTableData.mysql_columns.splice(index, 1);
            }
        } else {
            that.addClass('active');
            if (typeof constructedTableData.mysql_columns === 'undefined') {
                constructedTableData.mysql_columns = []
            }
            constructedTableData.mysql_columns.push($(this).data('value'));
        }
        render_custom_title_column();
    });

    function render_conditions_values() {

    }

    function render_custom_title_column() {
        constructedTableData.columnCount = _.size(constructedTableData.mysql_columns);
        $wptm_mysql_tables_columns_title.find('.column_title').appendTo($('.custom_title_column'));
        old_default_ordering = $wptm_mysql_default_ordering.find('#wptm_mysql_default_ordering_column').val();
        $wptm_mysql_default_ordering.find('#wptm_mysql_default_ordering_column').empty();
        $('.wptm_define_mysql_grouping').find('.groupingRuleColumn').empty();
        if (constructedTableData.columnCount > 0) {
            for (var i = 0; i < constructedTableData.columnCount; i++) {
                column_id = constructedTableData.mysql_columns[i].replace(".", "_");
                $('.custom_title_column').find('#wptm_row_' + column_id).appendTo($wptm_mysql_tables_columns_title_list);
                if ($wptm_mysql_tables_columns_title_list.find('#wptm_column_' + column_id).length === 0) {
                    $wptm_mysql_tables_columns_title_list.append('<tr class="wptm_row column_title" id="wptm_row_' + column_id + '"><td><label>' + constructedTableData.mysql_columns[i] + ' </label></td><td><input type="text" name="" id="wptm_column_' + column_id + '" class="" value=""  /></td></tr>');
                }

                $wptm_mysql_default_ordering.find('#wptm_mysql_default_ordering_column').append('<option value="' + constructedTableData.mysql_columns[i] + '" >' + constructedTableData.mysql_columns[i] + '</option>');
                $('.wptm_define_mysql_grouping').find('.groupingRuleColumn').each(function() {
                    $(this).append('<option value="' + constructedTableData.mysql_columns[i] + '" >' + constructedTableData.mysql_columns[i] + '</option>');
                });
            }

            $wptm_mysql_default_ordering.find('#wptm_mysql_default_ordering_column').val(old_default_ordering);
        }
    }

    $('.wptm_mysql_tables_columns').find('ul li:not(.border_active)').on('click', function () {
        if (!$(this).hasClass('active')) {
            var left = $(this).position().left;
            $(this).siblings('.border_active').animate({'left': left + 'px'});
        }
    })

    /**
     * Add a "WHERE" condition to the WP POSTS based table
     */
    $wptm_define_mysql_conditions.on('click', '#wptm_mysql_add_where_condition', function (e) {
        e.preventDefault();
        var whereBlockTemplate = $('#whereConditionTemplate').html();
        var template = Handlebars.compile(whereBlockTemplate);

        var where_block = {
            post_type_columns: $wptm_mysql_tables_columns.find('div.mysql_column').map(function () {
                return $(this).data('value');
            }).toArray()
        };
        var whereBlockHtml = template(where_block);
        $wptm_define_mysql_conditions.find('div.mysqlConditionsContainer').append(whereBlockHtml);

    });

    /**
     * Delete a "WHERE" condition
     */
    $(document).on('click', 'button.deleteConditionPosts', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(this).closest('div.post_where_blocks').remove();
    });

    /**
     * Add a grouping rule for MySQL based tables
     */
    $wptm_define_mysql_grouping.on('click', '#wptm_mysql_add_grouping_rule', function (e) {
        e.preventDefault();

        // Generate HTML block for the grouping rule constructor
        var grouping_rule_block = {post_type_columns: []};

        grouping_rule_block.post_type_columns = $wptm_mysql_tables_columns.find('div.mysql_column.active').map(function () {
            return $(this).data('value');
        }).toArray();

        var groupingRuleBlockTemplate = $('#groupingRuleTemplate').html();
        var template = Handlebars.compile(groupingRuleBlockTemplate);
        var groupingRuleHtml = template(grouping_rule_block);

        $wptm_define_mysql_grouping.find('div.mysqlGroupingContainer').append(groupingRuleHtml);
    });
    /**
     * Delete a grouping rule
     */
    $(document).on('click', 'button.deleteGroupingRulePosts', function (e) {
        e.preventDefault();
        $(this).closest('div.post_grouping_rule_blocks').remove();
    });

    function check_selected_table_and_column() {
        var flag = true;
        var number_table = $('#wptm_mysql_tables').find('.mysql_table.active');
        var number_column = $('#wptm_mysql_tables_columns').find('.mysql_column.active');
        if (number_table.length < 1) {
            flag = false;
        }
        if (number_column.length < 1) {
            flag = false;
        }
        return flag;
    }

    function check_duplicate_column_name() {
        var names = [];
        var obj = {};
        var message = wptmText.THE_TITLES_OF_THE_COLUMNS_MAY_NOT_BE_SAME;
        var column_wrapper = $('#wptm_mysql_tables_columns_title');
        $('.columns_title-error').remove();
        column_wrapper.find('table tr').each(function() {
            var curr = $(this);
            if(curr.find('input[type="text"]').val() !== '') {
                names.push(curr.find('input[type="text"]').val());
            }
        });
        names.forEach(function (item) {
            if(!obj[item])
                obj[item] = 0;
            obj[item] += 1;
        });
        for (var prop in obj) {
            if(obj[prop] >= 2) {
                column_wrapper.parent().prepend('<div class="columns_title-error"><span style="background: #D54E21;color: #fff;font-size: 0.7em;padding: 0 5px;">'+message+'</span></div>');
                return true;
            }
        }

        return false;
    }

    function set_constructed_table_data() {
        constructedTableData.join_rules = [];
        constructedTableData.where_conditions = [];
        constructedTableData.grouping_rules = [];
        /*custom title */
        constructedTableData.custom_titles = [];
        var i;
        for (i = 0; i < _.size(constructedTableData.mysql_columns); i++) {
            column_id = constructedTableData.mysql_columns[i].replace(".", "_");
            if ($wptm_mysql_tables_columns_title.find('#wptm_column_' + column_id).val()) {
                constructedTableData.custom_titles.push($wptm_mysql_tables_columns_title.find('#wptm_column_' + column_id).val());
            } else {
                constructedTableData.custom_titles.push(constructedTableData.mysql_columns[i]);
            }
        }

        constructedTableData.default_ordering = $wptm_mysql_default_ordering.find('#wptm_mysql_default_ordering_column').val();
        constructedTableData.default_ordering_dir = $wptm_mysql_default_ordering.find('#wptm_mysql_default_ordering_dir input:checked').val();
        constructedTableData.enable_pagination = $wptm_mysql_table_pagination.is(":checked") ? 1 : 0;
        constructedTableData.limit_rows = $wptm_mysql_number_of_rows.find('input:checked').val();

        /**
         * Join rules
         */
        $wptm_define_mysql_relations.find('.mysqlRelationsContainer').find('.mysql_table_blocks').each(function () {
            var join_rule = {};
            join_rule.initiator_table = $(this).find('select.relationInitiatorColumn').data('table');
            join_rule.initiator_column = $(this).find('select.relationInitiatorColumn').val();
            join_rule.connected_column = $(this).find('select.relationConnectedColumn').val();
            join_rule.type = $(this).find('select.innerjoin').val();
            constructedTableData.join_rules.push(join_rule);
        });

        /**
         * Where block
         */
        $wptm_define_mysql_conditions.find('.mysqlConditionsContainer').find('.post_where_blocks').each(function () {
            var where_condition = {};
            where_condition.column = $(this).find('select.whereConditionColumn').val();
            where_condition.operator = $(this).find('select.whereOperator').val();
            where_condition.value = $(this).find('input[type="text"]').val();
            constructedTableData.where_conditions.push(where_condition);
        });

        /**
         * Grouping rules
         */
        $wptm_define_mysql_grouping.find('.mysqlGroupingContainer').find('.post_grouping_rule_blocks select').each(function () {
            constructedTableData.grouping_rules.push($(this).val());
        });
    }

    $(document).on('click', '#btn_preview', function (e) {
        e.preventDefault();

        var selected_table = check_selected_table_and_column();
        if (!selected_table) {
            return false;
        }

        var duplicate_column_name = check_duplicate_column_name();
        if(duplicate_column_name) {
            $('#btn_back2column_titles').trigger('click');
            return false;
        }

        set_constructed_table_data();

        $.ajax({
            url: wptm_ajaxurl + "task=dbtable.generateQueryAndPreviewdata",
            data: {
                table_data: constructedTableData
            },
            type: 'post',
            dataType: 'json',
            success: function (result) {
                if (result.response && result.datas !== false) {
                    data = result.datas;
                    constructedTableData.query = data.query;
                    $wptm_previewTable.html(data.preview);
                }
            }
        })
    });

    $(document).on('click', '#btn_tableCreate', function (e) {
        e.preventDefault();

        var selected_table = check_selected_table_and_column();
        if (!selected_table) {
            return false;
        }

        var duplicate_column_name = check_duplicate_column_name();
        if(duplicate_column_name) {
            $('#btn_back2column_titles').trigger('click');
            return false;
        }

        set_constructed_table_data();
        $.ajax({
            url: wptm_ajaxurl + "task=dbtable.generateQueryAndPreviewdata",
            data: {
                table_data: constructedTableData
            },
            type: 'post',
            dataType: 'json',
            success: function (result) {
                if (result.response && result.datas !== false) {
                    data = result.datas;
                    constructedTableData.query = data.query;
                    $.ajax({
                        url: wptm_ajaxurl + "task=dbtable.createTable",
                        data: {
                            table_data: constructedTableData,
                            id_cat: id_cat
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (result) {
                            if (result.response) {
                                localStorage.setItem('new_db_table', JSON.stringify(result.datas));

                                window.location.href = 'admin.php?page=wptm&id_table=' + result.datas.id;
                            }
                        }
                    });
                }
            }
        });
    });

    $(document).on('click', '#btn_tableUpdate', function (e) {
        e.preventDefault();

        var selected_table = check_selected_table_and_column();
        if (!selected_table) {
            return false;
        }

        var duplicate_column_name = check_duplicate_column_name();
        if(duplicate_column_name) {
            $('#btn_back2column_titles').trigger('click');
            return false;
        }

        set_constructed_table_data();

        $.ajax({
            url: wptm_ajaxurl + "task=dbtable.generateQueryAndPreviewdata",
            data: {
                table_data: constructedTableData
            },
            type: 'post',
            dataType: 'json',
            success: function (result) {
                if (result.response && result.datas !== false) {
                    data = result.datas;
                    constructedTableData.query = data.query;
                    $.ajax({
                        url: wptm_ajaxurl + "task=dbtable.updateTable",
                        data: {
                            table_data: constructedTableData
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (result) {
                            if (result.response) {
                                if (typeof caninsert !== 'undefined' && caninsert) {
                                    window.location.href = 'admin.php?page=wptm&id_table=' + constructedTableData.id_table + '&noheader=1&caninsert=1';
                                } else {
                                    window.location.href = 'admin.php?page=wptm&id_table=' + constructedTableData.id_table;
                                }
                            }
                        }
                    })
                }
            }
        });

    });

    $(document).on('keyup', '.search_table', function (e) {
        var key_search = $(this).val();
        search_items($('#' + $(this).data('search')).find('.mysql_option'), key_search, 'wptm_hiden', false);
    });

    function search_items($option, text, classText, compare) {
        $option.each(function () {
            $(this).removeClass(classText);

            if (text !== '') {
                var value = false;
                if ($(this).data('value').search(text) !== -1) {
                    value = compare ? true : false;
                } else {
                    value = compare ? false : true;
                }
                if (value) {
                    $(this).addClass(classText);
                }
            }
        });
    }

    /*list db table*/
    if ($('.wptm-tables').length > 0) {
        var $tables = $('#list_tables');
        var $wptm_toolbar = $('.wptm_db_table .wptm_toolbar');
        var $content_popup_hide = $('#content_popup_hide');

        var list_user = {};

        /*
        popup and action for this
        wptm_popup     #wptm_popup
        popup          object data popup
        clone          check clone content in popup
        submit_button  get submit button to popup window
        */
        function wptm_popup(wptm_popup, popup, clone, submit_button) {
            wptm_popup.find('.content').contents().remove();
            var over_popup = wptm_popup.siblings('#over_popup');
            if (!clone) {
                var that = wptm_popup.find('.content').append(popup.html);
            } else {
                var that = wptm_popup.find('.content').append(popup.html.clone());
            }

            if (submit_button === true) {
                that.find('>div').append($('#submit_button').clone());
            }

            wptm_popup.show();
            over_popup.show();

            //set top for popup
            wptm_popup.css('top', (over_popup.outerHeight() - wptm_popup.outerHeight()) / 2);

            /*action when show popup*/
            if (typeof popup.showAction !== 'undefined') {
                popup.showAction.call(that);
            }

            /*action selector*/
            if (typeof popup.selector !== 'undefined') {
                popup.selector.call(that);
            }

            /*action enter input*/
            if (popup.inputEnter) {
                that.find('input').on('keyup', function (e) {
                    if (e.keyCode === 13) {
                        that.find('#popup_done').trigger('click');
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
                    popup.cancelAction.call(that);
                }
                wptm_popup.hide();
                over_popup.hide();
                return false;
            });

            //action colose
            wptm_popup.find('.colose_popup').unbind('click').on('click', function (e) {
                e.preventDefault();
                if (typeof popup.cancelAction !== 'undefined') {
                    popup.cancelAction.call(that);
                }
                wptm_popup.hide();
                over_popup.hide();
                return false;
            });
            over_popup.unbind('click').on('click', function (e) {
                e.preventDefault();
                wptm_popup.find('.colose_popup').trigger('click');
                return false;
            });
            return false;
        }

        /**
         * Get list user and set default value
         *
         * @param role User id
         */
        function get_list_user(role) {
            var owner_category = this.find('#owner_category');
            $.ajax({
                url: wptm_ajaxurl + "task=user.getListUser",
                dataType: "json",
                type: "POST",
                data: {
                    'option_nonce': $('#option_nonce').val(),
                },
                success: function (datas) {
                    if (datas.response === true) {
                        if (datas.datas.length > 0) {
                            list_user = $.extend({}, {});
                            for (var user in datas.datas) {
                                owner_category.append('<option value="' + datas.datas[user].id + '">' + datas.datas[user].name + '</option>');
                                list_user[datas.datas[user].id] = $.extend({}, datas.datas[user]);
                            }
                            owner_category.val(role);
                        }
                    }
                },
                error: function (jqxhr, textStatus, error) {
                    bootbox.alert(textStatus + " : " + error, wptmText.Ok);
                }
            });
        }

        function setTitleTable(tr, name, id_table) {
            if (name.trim() !== '') {
                var url = wptm_ajaxurl + "task=table.setTitle&id=" + id_table + '&title=' + name;

                $.ajax({
                    url: url,
                    type: "POST",
                    dataType: "json",
                    success: function (datas) {
                        if (datas.response === true) {
                            tr.find('span.title').text(name);
                        } else {
                            bootbox.alert(datas.response, wptmText.Ok);
                        }
                        $tables.trigger("update");
                    },
                    error: function (jqxhr, textStatus, error) {
                        bootbox.alert(textStatus, wptmText.Ok);
                    }
                });
            }
        }

        function saveRoleTable(tr, role, id_table) {
            var jsonVar = {
                data: JSON.stringify({0: role}),
                id: id_table,
                type: 1
            };
            $.ajax({
                url: wptm_ajaxurl + "task=user.save",
                dataType: "json",
                type: "POST",
                data: jsonVar,
                success: function (datas) {
                    if (typeof list_user !== 'undefined' && typeof list_user[role] !== 'undefined') {
                        tr.find('.author_table span').text(list_user[role].name);
                        tr.data('role', role);
                    }
                    $tables.trigger("update");
                },
                error: function (jqxhr, textStatus, error) {
                    bootbox.alert(textStatus + " : " + error, wptmText.Ok);
                }
            });
        }

        function delete_table(that) {
            var id_table = that.data('id-table') + '|';

            $.ajax({
                url: wptm_ajaxurl + "task=table.delete",
                type: "POST",
                data: {
                    'id': id_table,
                    'option_nonce': $('#option_nonce').val(),
                },
                success: function (datas) {
                    var result;
                    result = $.parseJSON(datas);
                    if (result.response === true) {
                        that.remove();
                        $tables.trigger("update");
                    } else {
                        bootbox.alert(result.response, wptmText.Ok);
                    }
                },
                error: function (jqxhr, textStatus, error) {
                    bootbox.alert(textStatus, wptmText.Ok);
                }
            });
        }

        function get_quest_delete(that) {
            if (!wptm_permissions.can_delete_tables) {
                bootbox.alert(wptm_permissions.translate.wptm_delete_tables, wptmText.Ok);
                return false;
            }
            if (typeof that == 'undefined' && $tables.find('tbody tr.selected').length < 1) {
                return false;
            }
            var popup = {
                'html': $content_popup_hide.find('#delete_tables'),
                'showAction': function () {
                    this.find('.wptm_done').addClass('wptm_red');
                    this.find('.wptm_cancel').addClass('wptm_grey');
                    this.find('#popup_done').text(wptmText.Delete);
                    this.siblings('.colose_popup').hide();

                    if ($tables.find('tr.selected').length > 1) {
                        this.find('.delete_table').text(wptmText.delete_table);
                        this.find('.delete_table_question').text(wptmText.delete_table_question);
                    }
                    return true;
                },
                'submitAction': function () {
                    if (typeof that !== 'undefined') {
                        delete_table($(that));
                    } else {
                        $tables.find('tbody tr.selected').each(function () {
                            delete_table($(this));
                        });
                    }
                    this.siblings('.colose_popup').trigger('click');
                    return true;
                }
            };
            wptm_popup($('#wptm_popup'), popup, true, true);
        }

        function status_noti(status, text) {
            var status_e = $('#savedInfoTable');
            if (1) {
                status_e = $('#savedInfoTable');
            } else {
                status_e = $('#saveErrorTable');
            }
            status_e.text(text);

            setTimeout(function () {
                status_e.animate({'bottom': '+=25px', 'opacity': '1'}, 500).delay(2000).animate({
                    'bottom': '-=25px',
                    'opacity': '0'
                }, 1000);
            }, 1000);
        }

        /*create new <tr/> table*/
        function add_new_tr(value) {
            var html = '';
            html += '<tr class="dd-item hasRole" data-id-table="' + value.id + '" data-role="' + value.author + '">';

            html += '<td class="dd-content table_name"><i class="wptm_icon_tables"></i>';
            html += '<div>';
            html += '<a class="t" href="' + wptm_table_url + 'id_table=' + value.id + '" target="_blank"><span class="title dd-handle">' + value.title + '</span></a>';
            html += '<a class="edit tooltip"></a>';
            html += '<a class="copy tooltip"></a>';
            html += '<a class="trash tooltip"></a>';
            html += '<a class="data_source tooltip"></a>';
            html += '</div>';
            html += ' </td>';

            html += '<td>' + value.modified_time + '</td>';
            html += '<td class="dd-content author_table"><span>' + value.author_name + '</span></td>';

            html += '<td class="dd-content shortcode"><div><span>[wptm id=' + value.id + ']</span>' +
                '<span class="button wptm_icon_tables copy_text tooltip"></span></div></td>';

            html += '</tr>';
            $tables.find('tbody').append(html);
        }

        function listTables() {
            $tables.trigger("update");

            //active table
            $tables.find('.dd-item').unbind('click').click(function (e) {
                if (!(e.ctrlKey || e.metaKey)) {
                    $(this).siblings('.dd-item.selected').removeClass('selected');
                }
                $(this).addClass('selected');

                e.stopPropagation();
            });

            /**
             * create new db_table
             */
            $wptm_toolbar.find('.create_table').on('click', function () {
                if (!wptm_permissions.can_create_tables) {
                    bootbox.alert(wptm_permissions.translate.can_create_tables, wptmText.Ok);
                    return false;
                }

                var curr_page = window.location.href;
                var cells = curr_page.split("?");
                var new_url = cells[0] + '?page=wptm&type=dbtable&action=create';
                // window.location = new_url;
                window.open(new_url);
            });

            /**
             * delete db_table
             */
            $wptm_toolbar.find('.delete').on('click', function () {
                get_quest_delete();
            });

            $tables.find('.table_name .edit').unbind('click').on('click', function (e) {
                if (!wptm_permissions.can_edit_tables) {
                    bootbox.alert(wptm_permissions.translate.can_edit_tables, wptmText.Ok);
                    return false;
                }
                var that = $(this).closest('tr');
                var popup = {
                    'html': $content_popup_hide.find('#re_name'),
                    'inputEnter': true,
                    'showAction': function () {
                        this.find('.wptm_done').addClass('wptm_blu');
                        this.find('.wptm_cancel').addClass('wptm_grey');
                        this.find('input[name="re_name"]').val(that.find('.table_name .title').text()).focus();
                        this.find('#submit_button').addClass('wptm_center');

                        return true;
                    },
                    'submitAction': function () {
                        var name = this.find('input[name="re_name"]').val();
                        if (name.trim() !== '') {
                            var url = wptm_ajaxurl + "task=table.setTitle&id=" + that.data('id-table') + '&title=' + name;

                            $.ajax({
                                url: url,
                                type: "POST",
                                dataType: "json",
                                success: function (datas) {
                                    if (datas.response === true) {
                                        that.find('.title').text(name);
                                        that.find('td').eq(1).text(datas.datas.modified_time);
                                        $tables.trigger("update");
                                        status_noti(1, wptmText.noti_table_renamed);
                                    } else {
                                        status_noti(0, datas.response);
                                    }
                                },
                                error: function (jqxhr, textStatus, error) {
                                    status_noti(0, textStatus);
                                }
                            });
                        }
                        this.siblings('.colose_popup').trigger('click');
                        return true;
                    }
                };
                wptm_popup($('#wptm_popup'), popup, true, true);
            });

            /**
             * copy table
             */
            $tables.find('.table_name .copy').unbind('click').on('click', function (e) {
                var that = $(this).closest('tr');
                var id_table = that.data('id-table');
                if (id_table !== null && id_table !== '') {
                    if (!wptm_permissions.can_create_tables) {
                        bootbox.alert(wptm_permissions.translate.wptm_create_tables, wptmText.Ok);
                        return false;
                    }

                    $('#over_popup').css({'opacity': 0.4}).addClass('loadding').show();

                    $.ajax({
                        url: wptm_ajaxurl + "task=table.copy&id=" + id_table,
                        type: "POST",
                        dataType: "json",
                        success: function (datas) {
                            $('#over_popup').css({'opacity': 0.4}).removeClass('loadding').hide();
                            if (datas.response === true) {
                                var data = {};
                                data = {
                                    author: wptm_user_id,
                                    author_name: wptm_user,
                                    id: datas.datas.id,
                                    modified_time: datas.datas.created_time,
                                    position: datas.datas.position,
                                    title: datas.datas.title
                                };
                                add_new_tr(data);

                                $tables.trigger("update");
                                listTables();
                                status_noti(1, wptmText.copy_success);
                            } else {
                                status_noti(0, datas.response);
                            }
                        },
                        error: function (jqxhr, textStatus, error) {
                            bootbox.alert(textStatus, wptmText.Ok);
                        }
                    });
                }
                return false;
            });

            //delete table
            $tables.find('.table_name .trash').unbind('click').on('click', function (e) {
                var that = $(this).closest('tr');
                get_quest_delete(that);
            });

            //data source
            $tables.find('.table_name .data_source').unbind('click').on('click', function (e) {
                if (!wptm_permissions.can_edit_tables) {
                    bootbox.alert(wptm_permissions.translate.can_edit_tables, wptmText.Ok);
                    return false;
                }

                window.location = wptm_db_table + 'id_table=' + $(this).closest('tr').data('id-table');
            });

            $tables.find('.copy_text').unbind('click').on('click', function (e) {
                var copyText = $(this).siblings('span');
                // var copyText = $(this).siblings('span').css({'background': '#499ac3'});
                var textArea = document.createElement("textarea");
                textArea.value = copyText.text();
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("Copy");
                textArea.remove();
                // setTimeout(function () {
                //     copyText.css({'background': 'rgba(0, 0, 0, 0)'});
                // }, 500);
            });

            $tables.tablesorter({
                theme: "bootstrap",
                widthFixed: true,
                headerTemplate: '{content} {icon}',
                widgets: ["uitheme", "zebra"],
                dateFormat: 'ddmmyyyy',
                cssIcon: '',
                imgAttr: 'src',
                headers: {
                    '.disable_sort': {
                        sorter: false
                    }
                },
                sortList: [[0, 0]]
            });

            function search_items(table, text, position_col) {
                var i;
                if (text !== '') {
                    table.find('tbody tr').each(function () {
                        $(this).addClass('wptm_hiden');
                        for (i = 0; i < position_col.length; i++) {
                            var value = $(this).find('td:eq(' + position_col[i] + ') span').text();
                            if (value.search(text) !== -1) {
                                $(this).removeClass('wptm_hiden');
                            }
                        }
                    });
                } else {
                    table.find('tbody tr').each(function () {
                        $(this).removeClass('wptm_hiden');
                    });
                }
            }

            $('#search_table').on('keyup', function (e) {
                if (e.keyCode === 13) {
                    search_items($tables, $(this).val(), [2]);
                }
                return true;
            });

            $('i.search_table').unbind('click').on('click', function () {
                search_items($tables, $('#search_table').val(), [2]);
            });

            $('i.reload_search').unbind('click').on('click', function () {
                $('#search_table').val('');
                search_items($tables, '', [2]);
            });
        }

        listTables();
    }
})
