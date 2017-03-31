/**
 * 基于dataTable的数据表格
 * 组件依赖: jquery.dataTable
 */
define([
    'appPath/common/commonMethods',
    'jquery.semantic',
    'jquery.colresizable',
    'jquery.dataTable'
], function (cMethods) {
    var errorStatusMessage = [
            {
                status: '400',
                message: '客户端接请求出现语法错误，请联系管理员处理！'
            },
            {
                status: '404',
                message: '服务端接口网络断开，请检查网络环境是否正常！'
            },
            {
                status: '403',
                message: '服务端接口拒绝访问，请检查是否有该操作权限！'
            },
            {
                status: '413',
                message: '请求的文档的大小超过服务端处理上限，伦家处理不了啦！'
            },
            {
                status: '500',
                message: '服务端接口内部异常，请联系管理员处理！'
            },
            {
                status: '504',
                message: '服务端接口请求超时，请联系管理员处理！'
            }
        ],
        /**
         * 处理常见Http状态码异常
         * @param status
         * @returns {*}
         */
        handlerErrorCase = function (status) {
            var errormessage = errorStatusMessage, isHandler = false;
            for (var i = 0, len = errormessage.length; i < len; i++) {
                if (status == errormessage[i].status) {
                    isHandler = true;
                    return errormessage[i];
                }
            }
            if (!isHandler) {
                return {
                    status: status,
                    message: '异常很诡异，臣妾处理不了，请火速联络超级管理员！错误码：' + status
                }
            }
        },
        dataTable,
        defaultOptions = function () {
            return {
                container: '.data-table',
                retrieve: true,
                pagingType: 'full_numbers',
                //scrollX: true,
                searching: false,
                iDisplayLength: 10, //每页显示条目数
                bLengthChange:true, //是否允许用户通过一个下拉列表来选择分页后每页的行数,行数为 10，25，50，100
                //l - 每页数量选择select
                //f – 搜索框search
                //t – 表单内容table
                //i – 当前条数，总共条数information
                //p – 翻页按钮pagination
                //r – 请求中的提示信息
                //< 和 > – 一个div的开始与结束
                //<"class"> – class为div page分页栏目的class名称
                //"rt<'datatable_pageagtion'iflp<'clear'>>",
                dom: "rt<'datatable_pageagtion'iflp<'clear'>>",
                "info": true, //是否显示当前分页的描述信息
                'processing': true,
                'serverSide': true,
                'order': [
                    [0, null]
                ],
                ajax: {
                    url: 'XXX',
                    type: 'GET',//GET | POST
                    data: function (data) { //回调函数需要在调用处完全重写
                        data.length = 5;
                        data.pageNo = data.start / data.length + 1;
                        data.pageSize = data.length;
                    },
                    dataSrc: function (data) { // deal the data
                        if (data.status == 200) {
                            data.recordsTotal = data.data.recordsTotal;
                            data.recordsFiltered = data.data.recordsTotal;
                            return data.data.results.tBody;
                        } else if (data.status == 510) {
                            cMethods.sessionOut();
                            return [];
                        } else {
                            cMethods.showPopupMessage('warning', data.message);
                            return [];
                        }
                    },
                    error: function (response) {
                        cMethods.showPopupMessage('error', handlerErrorCase(response.status).message);
                        return [];
                    }
                }
            }
        },
        initBaseTable = function (defaultOpts, opt) {
            var opts = $.extend(true, defaultOpts, opt),
                tempTheadHtml = '',
                tempOpts = {},
                tempColumns = [],
                tempColumnsRenderFn = [],
                style = '',
                hasAddCheckBox = false,
                hasAddIndex = false,
                pagesInfo = [];


            if (opts.columns && opts.columns.length > 0) {
                tempOpts.columns = [];
                tempColumns = opts.columns;
                tempTheadHtml = '<thead><tr>';
                for (var i = 0, len = tempColumns.length; i < len; i++) {
                    style = '';
                    //object 如何判断是否有某一个属性
                    if (tempColumns[i]['textAlign']) {
                        //style = 'style="text-align:'+tempColumns[i]['textAlign']+'"';
                    }
                    if (tempColumns[i]['width']) {
                        style += ' width=' + tempColumns[i]['width'];
                    }
                    //构造列的属性
                    tempOpts.columns.push({
                        'data': tempColumns[i]['field']
                    });
                    //是否显示复选框
                    if (!hasAddCheckBox && opts.isShowCheckBox) {
                        tempColumnsRenderFn.push({
                            render: function (data, type, row) {
                                return '<div class="ui checkbox"><input type="checkbox"><label></label></div>';
                            },
                            searchable: false,
                            orderable: false,
                            targets: [i]
                        });
                        hasAddCheckBox = true;
                        tempTheadHtml += '<th><div class="ui checkbox"><input name="tableCheckBoxAll" type="checkbox"><label></label></div></th>';
                        continue;
                    } else {
                        tempTheadHtml += '<th ' + style + ' >' + tempColumns[i]['title'] + '</th>';
                    }
                    if (!hasAddIndex && opts.isShowIndexNumber) {
                        tempColumnsRenderFn.push({
                            render: function (data, type, row, table) {
                                return (table.row + 1) + table.settings._iDisplayStart;
                            },
                            searchable: false,
                            orderable: false,
                            targets: [i]
                        });
                        hasAddIndex = true;
                        continue;
                    }
                    //构造列render方法
                    if (tempColumns[i] && tempColumns[i]['isShow'] && tempColumns[i]['render']) {
                        tempColumnsRenderFn.push({
                            render: tempColumns[i].render,
                            searchable: false,
                            orderable: tempColumns[i]['order'] == undefined ? false : tempColumns[i]['order'],
                            targets: [i]
                        });
                    } else if (tempColumns[i]) {
                        tempColumnsRenderFn.push({
                            searchable: false,
                            visible: tempColumns[i]['isShow'] == undefined ? true : tempColumns[i]['isShow'],
                            orderable: tempColumns[i]['order'] == undefined ? false : tempColumns[i]['order'],
                            targets: [i]
                        });
                    }
                }
                tempTheadHtml += '</thead></tr>';
                $(opts.container).find('thead').remove();
                $(opts.container).append(tempTheadHtml);
                //行渲染回调函数
                if (opts.rowRender) {
                    tempOpts.createdRow = function (row, data, index) {
                        opts.rowRender(row, data, index);
                    }
                }
                //取消全选对话框的选中
                tempOpts.createdRow = function (row, data, index) {
                    if(index==0){
                        var checkAllBox = $(this).find('[name=tableCheckBoxAll]:checkbox');
                        if(checkAllBox && checkAllBox.length>0){
                            $(this).data('selectIds', '');
                            checkAllBox.prop('checked', false);
                        }
                    }
                }
                if (opts.pageSize && opts.pageSize > 0) {
                    opts.iDisplayLength = opts.pageSize;
                }
                //remove other attr
                opts.createdRow = tempOpts.createdRow;
                opts.columnDefs = tempColumnsRenderFn;
                opts.columns = [];
                opts.columns = tempOpts.columns;
                dataTable = $(opts.container).DataTable(opts);
                //绑定事件
                var selected = [];
                $(opts.container).data('selectIds', '');
                dataTable.off('click');
                //全选
                dataTable.on('click', 'input[type=checkbox]', function (e) {
                    var currentTableEl = $(e.target).parents('table'),
                        trEl = $(e.target).parents('tr'),
                        currentTable, tableData, trData, selectId, index;
                    if (currentTableEl.length >= 0) {
                        currentTable = $(currentTableEl[0]).dataTable();
                        if (e.target.name === 'tableCheckBoxAll') {
                            selected = [];
                            if (e.target.checked) {
                                tableData = currentTable.fnGetData();
                                for (var i = 0; i < tableData.length; i++) {
                                    selected.push(tableData[i].id);
                                }
                                currentTable.find('tr input[type=checkbox]').each(function () {
                                    $(this).prop('checked', true);
                                });
                            } else {
                                currentTable.find('tr input[type=checkbox]').each(function () {
                                    $(this).prop('checked', false);
                                });
                            }
                        } else {
                            trData = currentTable.fnGetData(trEl);
                            selectId = trData && trData['id'];
                            index = $.inArray(selectId, selected);
                            if (index === -1) {
                                selected.push(selectId);
                            } else {
                                selected.splice(index, 1);
                            }
                        }
                        currentTable.data('selectIds', selected.join(','));
                    }
                });
                dataTable.on('click', 'tr', function (e) {
                    var currentTableEl = $(e.target).parents('table'),
                        currentTable;
                    if (currentTableEl.length >= 0) {
                        currentTable = $(currentTableEl[0]).dataTable();
                    }
                    opts.operationCallback && opts.operationCallback(e, currentTable.fnGetData(this));
                });
                //修复分页问题
                pagesInfo = $(opts.container).parents('div.auto-scroll-table').find('div.datatable_pageagtion');
                if (pagesInfo.length > 1) {
                    console.log(pagesInfo);
                    //多次初始化表格时候会出现过个pagetool
                    pagesInfo.each(function (index) {
                        if (index > 0) {
                            $(this).remove();
                        }
                    });
                }
                return dataTable;
            } else {
                console.log('dataTable init fail : no columns!');
                return null;
            }
        }
    return {
        /**
         * 初始化简单表格
         * 功能：只做表格数据的展示
         * @param opt
         */
        initSimpleTable: function (opt) {
            //initBaseTable(opt);
        },
        /**
         * 初始化常用基础表格
         * 功能：选中，操作行，事件回调，自定义行数据显示
         * @param opt ： 参数中需要定义与列相关的属性
         */
        initBaseTable: function (opt) {
            return initBaseTable(defaultOptions(), opt);
        }

    }
});
