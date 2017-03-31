/**
 * 楼盘面积管理
 */
define([
    'component-message',
    'component-datatable',
    'component-ztree',
    'jqueryAjax',
    'appPath/common/commonMethods',
    'jquery.semantic'
], function (cMessage, cDataTable,cZtree, jqueryAjax, cMthods) {
    var myTable,
        commonData = cMthods.getRoleData().roleCommonData,
        defaultData = function () {
            return {
                id: '',
                constantKey: '',
                constantField: '',
                constantValue: '',
                constantDesc: ''
            }
        },
        vm = avalon.define({
            $id: 'constantManager',
            constantKey: '',
            constantField: '',
            constantValue: '',
            constantDesc: '',
            constantData:defaultData(),
            showAddWin: function (isEdit,data) {
                var url = window.currentApiUrl.constantManager.constantEdit;
                if (!isEdit) {
                	vm.constantData = defaultData();
                    url = window.currentApiUrl.constantManager.constantAdd;
                }else{
                    vm.constantData = data;
                }
                var myModal = $('#constantAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '';
                        if (vm.constantData.constantKey == '') {
                            msg = 'key不能为空';
                        } else if (vm.constantData.constantField == '') {
                            msg = 'field不能为空';
                        } else if (vm.constantData.constantValue == '') {
                            msg = 'value不能为空';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        jqueryAjax.post(
                            url,
                            vm.constantData,
                            function (response, msgType, isOk) {
                                myTable.fnDraw();
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                                if (isOk) {
                                    myModal.modal('hide');
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                        return false;
                    }
                }).modal('show');
            },
            showEditWin: function (data) {
                vm.showAddWin(true,data);
            },
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.get(
                            window.currentApiUrl.constantManager.constantDel,
                            {id: id},
                            function (response, msgType, isOk) {
                                myTable.fnDraw();
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            });
                    }
                });

            },
            search: function () {
                myTable.fnDraw();
            }
        }),
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'constantKey', title: 'Key', isShow: true, isSort: false},
                {field: 'constantField', title: 'Field', isShow: true, isSort: false},
                {field: 'constantValue', title: 'Value', isShow: true, isSort: false},
                {field: 'constantDesc', title: '描述', isShow: true, isSort: false},
//                {field: 'createUid', title: '创建人', isShow: true, isSort: false},
                {field: 'createTime', title: '创建时间', isShow: true, isSort: false},
//                {field: 'updateUid', title: '修改人', isShow: true, isSort: false},
                {field: 'updateTime', title: '修改时间', isShow: true, isSort: false},
                {
                    field: null, title: '操作', isShow: true, isSort: false,width:150,
                    render: function () {
                        return '<div class="tr-operation"><i class="icon edit green"></i> <i class="icon remove red"></i></div>';
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.constantManager.constantList,
                type: 'POST',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.constantKey = vm.constantKey;
                    data.constantField = vm.constantField;
                    data.constantValue = vm.constantValue;
                    data.constantDesc = vm.constantDesc;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon edit')) {
                        vm.showEditWin(rowData);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(rowData.id);
                    }
                }
            }
        };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () { }
        $ctrl.$onRendered = function () {
            myTable = cDataTable.initBaseTable(baseTableOpts);
        }
        $ctrl.$onBeforeUnload = function () {}
        $ctrl.$vmodels = [];
    });
});
