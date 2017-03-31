/**
 * 消息管理
 */
define([
    'component-message',
    'component-datatable',
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-wangeditor',
    'jquery.semantic'
], function (cMessage, cDataTable, jqueryAjax, cMthods,richEditor) {
    var myTable,editor,
        cityListData = cMthods.getCityList(),
        defaultSearchData = function () {
            return {
                cityCode: '0',
                parkNames: ''
            }
        },
        defaultFormData = function () {
            return {
                title: '',
                content: '',
                platform: '',
                cityNames: '',
                parkNames: '',
                createTime: '',
                parkIds: '',
                content: ''
            }
        },
        vm = avalon.define({
            $id: 'message',
            isEdit: false,
            cityList: cityListData,
            allParkList: [],
            platForms: [],
            parkIds: [],
            cityCodes: [],
            searchFormData: defaultSearchData(),
            message: defaultFormData(),
            showInfoWin: function (data) {
                vm.message = data;
                $('#messageInfoWin').modal({});
                setTimeout($('#messageInfoWin').modal('show'), 0);
            },
            showAddWin: function () {
                vm.message.title = '';
                vm.message.content = '';
                vm.message.platform = '';
                vm.message.cityNames = '';
                vm.message.parkNames = '';
                vm.message.content = '';
                vm.platForms = [''];
                vm.parkIds = [''];
                vm.cityCodes = [''];
                editor.$txt.html('<p><br></p>');
                var myModal = $('#messageAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '',
                            cityCodeStr = vm.cityCodes.join(','),
                            platFormsStr = vm.platForms.join(','),
                            parkIdsStr = vm.parkIds.join(',');
                        if (platFormsStr == '') {
                            msg = '至少选择一个发布平台';
                        } else if (vm.message.title == '') {
                            msg = '消息主题不能为空';
                        } else if (editor.$txt.html() == '<p><br></p>') {
                            msg = '消息内容不能为空';
                        } else if (cityCodeStr == '') {
                            msg = '请选择发布城市';
                        } else if (parkIdsStr == '') {
                            msg = '至少选择一个发布园区';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }

                        jqueryAjax.post(
                            window.currentApiUrl.message.messageAdd,
                            {
                                title: vm.message.title,
                                content: editor.$txt.html(),
                                platform: platFormsStr.substr(1, platFormsStr.length),
                                parkIds: parkIdsStr.substr(1, parkIdsStr.length),
                                cityCodes: cityCodeStr.substr(1, cityCodeStr.length)
                            },
                            function (response, msgType, isOk) {
                                myTable.draw();
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
            search: function () {
                myTable.draw();
            },
            reset: function () {
                vm.searchFormData = defaultSearchData();
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);
            }
        }),
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'title', title: '消息主题', isShow: true, isSort: false},
                {field: 'cityNames', title: '发送城市', isShow: true, isSort: false},
                {field: 'parkNames', title: '发送园区', isShow: true, isSort: false},
                {field: 'platform', title: '发送平台', isShow: true, isSort: false, render: function (val) {
                    return val.replace(/ANDROID/i, '安卓').split(',').join('，');
                }},
                {field: 'createTime', title: '发布时间', isShow: true, isSort: false},
                {
                    field: null, title: '操作', isShow: true, isSort: false, width: 40,
                    render: function () {
                        return '<div class="tr-operation"><i class="icon info circle teal"></i></div>';
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.message.messageList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.cityCode = vm.searchFormData.cityCode;
                    data.parkNames = vm.searchFormData.parkNames;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon info circle')) {
                        vm.showInfoWin(rowData);
                    }
                }
            }
        };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
            jqueryAjax.get(
                window.currentApiUrl.queryAllPark,
                {},
                function (response, msgType, isOk) {
                    var result = response.data.results;
                    vm.allParkList = [];
                    if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            vm.allParkList.push({
                                parkId: result[i].parkId,
                                parkName: result[i].parkName,
                                cityName: result[i].cityName,
                                cityCode: result[i].cityCode
                            });
                        }
                    }
                }
            );
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            myTable = cDataTable.initBaseTable(baseTableOpts);
            $('.ui.dropdown').dropdown();
            editor = richEditor.initWangEditor({
                container: 'messageRichEditor',
                //hideInsertImg:true,
                uploadUrl:window.currentApiUrl.commonUploadFile,
                uploadErrorCallback:function (msg) {
                    cMessage.showPopup({
                        className: 'error',
                        content: msg
                    });
                }
            });
        }
        $ctrl.$onBeforeUnload = function () {
        }
        $ctrl.$vmodels = [];
    });
});
