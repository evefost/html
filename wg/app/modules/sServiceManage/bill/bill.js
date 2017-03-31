/**
 * 账单管理
 */
define([
    'component-message',
    'component-datatable',
    'jqueryAjax',
    'component-datetimerpicker',
    'appPath/common/commonMethods',
    'jquery.semantic'
], function (cMessage, cDataTable, jqueryAjax, cDateTimerPicker, cMthods) {
    var myTable,myBillModal,sheetTable
        defaultSearchData = function () {
            return {
                year: '0',
                month: '0',
                amount1: '',
                amount2: '',
                uploadTime1: '',
                uploadTime2: ''
            }
        },
        defaultFromData = function () {
            return {
                id: '',
                year: '',
                month: '',
                parkName: '',
                amount: '',
                uploadTime: '',
                uploadUserName: '',
                uploadUserPhone: ''
            }
        },
        vm = avalon.define({
            $id: 'bill',
            btnActive:false,
            imgSrc: '',
            billDetailId:'',
            years:['2016','2017','2018','2019'],
            months:['01','02','03','04','05','06','07','08','09','10','11','12'],
            bill: defaultFromData(),
            searchFormData: defaultSearchData(),
            //账单上传
            isShowDownloadBtn:false,
            isUploaded:false,
            inputParkName:'',
            date:'',
            parkName:'',
            queryParkList:[],
            firstUpload: true,
            search: function () {
                myTable.draw();
            },
            reset: function () {
                vm.searchFormData = defaultSearchData();
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },100);
            },
            showInfoWin:function (data) {
                vm.bill = data;
                vm.billDetailId = data.id;

                jqueryAjax.get(
                    window.currentApiUrl.sBill.getBill,
                    {id:data.id},
                    function (response) {
                        var result = response.data.results,
                            tableHeader = result.tHeader,
                            columns = [];
                        vm.isUploaded = true;
                        vm.btnSaveActive = false;
                        for (var i = 0; i < tableHeader.length; i++) {
                            columns.push({title: tableHeader[i]});
                        }
                        $('#billDetailInfoTable').dataTable({
                            data: result.tBody,
                            searching: false,
                            destroy: true,
                            dom: "rt<'datatable_pageagtion'iflp<'clear'>>",
                            columns: columns
                        });
                        $('#billInfoWin').modal({
                            closable: false
                        }).modal('show');
                    },
                    function (response, msgType) {
                        cMessage.showPopup({
                            className: msgType,
                            content: response.message
                        });
                    }
                );
            },
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.sBill.billDel,
                            {id: id},
                            function (response, msgType, isOk) {
                                myTable.draw();
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
            exportBillExcel:function () {
                cMthods.downloadFile(location.origin+window.currentApiUrl.sBill.exportBill,vm.searchFormData);
            },
            downloadTemplateExcel:function () {
                cMthods.downloadFile(location.origin+window.currentApiUrl.sBill.downloadTemplateBill,{});
            },
            uploadBillExcel:function () {
                vm.isShowDownloadBtn=false;
                vm.date='';
                $('input[type=file]').val('');
                $('#billParkNameSelect').dropdown('set text', '');
                cDateTimerPicker.initDateTimePicker('.my-date', 'yyyy-mm');
                myBillModal = $('#billUploadWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '';
                        if (vm.date == '') {
                            msg = '请选择账单日期';
                        } else if ($('input[type=file]').val() == '') {
                            msg = '请选择文件';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        vm.btnSaveActive = true;
                        jqueryAjax.ajaxUploadForm(
                            window.currentApiUrl.sBill.uploadBill,
                            new FormData($('#billUploadForm')[0]),
                            function (response, msgType, isOk) {
                                if (response.status == 200) {
                                    // 如果一切顺利，直接关闭 Modal
                                    var empty = true;
                                    for (var k in response.data) {
                                        empty = false;
                                        break;
                                    }
                                    if (empty) {
                                        cMessage.showPopup({
                                            className: msgType,
                                            content: response.message
                                        });
                                        myBillModal.modal('hide');
                                        myTable.draw();
                                        return;
                                    }

                                    // 账单字段出现错误
                                    var result = response.data.results,
                                        tableHeader = result.tHeader,
                                        columns = [];
                                    cMessage.showPopup({
                                        className: 'warning',
                                        content: response.message
                                    });

                                    vm.isUploaded = true;
                                    vm.btnSaveActive = false;

                                    if (vm.firstUpload) {
                                        for (var i = 0; i < tableHeader.length; i++) {
                                            columns.push({title: tableHeader[i]});
                                        }
                                        sheetTable = $('#uploadBillDetail').dataTable({
                                            data: result.tBody,
                                            searching: false,
                                            dom: "rt<'datatable_pageagtion'iflp<'clear'>>",
                                            columns: columns
                                        });
                                        vm.firstUpload = false;
                                    } else {
                                        var oSettings = sheetTable.fnSettings();

                                        sheetTable.fnClearTable(this);

                                        for (var i=0; i<result.tBody.length; i++)
                                        {
                                            sheetTable.oApi._fnAddData(oSettings, result.tBody[i]);
                                        }

                                        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
                                        sheetTable.fnDraw();
                                    }
                                } else if (response.status == 500) {
                                    cMessage.showPopup({
                                        className: 'error',
                                        content: response.message
                                    });
                                    vm.btnSaveActive = false;
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                                vm.btnSaveActive = false;
                            });
                        return false;
                    }
                }).modal('show');
            },
            uploadBillAgain:function(){
                myBillModal.modal('hide');
            },
            /**
             * 模糊查询园区
             */
            queryParkByName: function () {
                if (vm.inputParkName !== '') {
                    jqueryAjax.get(
                        window.currentApiUrl.queryParkByName,
                        {
                            parkName:vm.inputParkName
                        },
                        function (response, msgType, isOk) {
                            var result = response.data.results;
                            vm.queryParkList = [];
                            if (result && result.length > 0) {
                                for (var i = 0; i < result.length; i++) {
                                    vm.queryParkList.push({
                                        parkId: result[i].parkId,
                                        parkName: result[i].parkName
                                    });
                                }
                            }
                        }
                    );
                }
            },
            /**
             * 点击选择项设置园区id
             * @param e
             */
            setParkId: function (e) {
                vm.parkId = $(this).data('parkid');
                vm.parkName = $(this).data('parkname');
                vm.isShowDownloadBtn = true;
            }
        }),
        baseBillDetailOpts = function (columnData) {
            var tableOpts = {
                container: '#billDetailTable',
                pagingType: 'simple',
                isShowIndexNumber: true,
                bLengthChange:false,
                pageSize:5,
                columns: [
                    {field: null,width:30, title: '序号', isShow: true, isSort: false}
                ],
                ajax: {
                    url: window.currentApiUrl.sBill.getBill,
                    type: 'GET',
                    data: function (data) {
                        data.pageNo = data.start / data.length + 1;
                        data.pageSize = data.length;
                        data.id = vm.billDetailId;
                    }
                }
            };
            for(var item in columnData){
               tableOpts.columns.push({
                   field: item, title: item, isShow: true, isSort: false
               });
            }
            return tableOpts;
        },
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false},
                {field: 'year', title: '账单日期', isShow: true, isSort: false, render: function (value,status,rowData) {
                    return rowData.year+'-'+rowData.month;
                }},
                {field: 'amount', title: '总金额（元）', isShow: true, isSort: false},
                {field: 'uploadTime', title: '上传时间', isShow: true, isSort: false},
                {field: 'uploadUserName', title: '上传人员', isShow: true, isSort: false},
                {field: 'uploadUserPhone', title: '上传人员电话', isShow: true, isSort: false},
                {
                    field: null, title: '操作', isShow: true, isSort: false, render: function (data) {
                    return '<div class="tr-operation">' +
                        '<i class="icon info circle teal"></i>' +
                        '<i class="icon remove red"></i>' +
                        '</div>';
                }
                }
            ],
            ajax: {
                url: window.currentApiUrl.sBill.billList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.uploadTime1 = vm.searchFormData.uploadTime1;
                    data.uploadTime2 = vm.searchFormData.uploadTime2;
                    data.amount1 = vm.searchFormData.amount1;
                    data.amount2 = vm.searchFormData.amount2;
                    data.year = vm.searchFormData.year;
                    data.month = vm.searchFormData.month;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon info')) {
                        vm.showInfoWin(rowData);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(rowData.id);
                    }
                }
            }
        };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
            vm.firstUpload = true;
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            $('.ui.modals .modal').remove();
            $('.ui.dropdown').dropdown();
            myTable = cDataTable.initBaseTable(baseTableOpts);
            cDateTimerPicker.initDateTimePicker('.date-date', 'yyyy-mm-dd');
        }
        $ctrl.$onBeforeUnload = function () {
        }
        $ctrl.$vmodels = [];
    });
});
