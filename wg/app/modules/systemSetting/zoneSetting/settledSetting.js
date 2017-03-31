define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-wangeditor'
], function(jqueryAjax, cMethod, cMessage, cDataTable, richEditor) {
    var table,
        editor,
        map,
        getQueryData = function () {
            return {
                parkName: '',
                cityCode: '0',
                regionCode: '0',
                status: '0'
            }
        },
        getSettledData = function () {
            return {
                parkName: '',
                content: ''
            }
        },
        getRegionList =  function() {
            var cityCode = vm.queryData.cityCode;
            // 获取区域信息
            $.ajax({
                url: window.currentApiUrl.basicData.regionList,
                type: 'GET',
                data: 'cityCode=' + cityCode,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.status === 200) {
                        vm.regionList = data.data.results.results;
                    }
                }
            });
        },
        vm = avalon.define({
            $id: 'settledSetting',
            queryData: getQueryData(),
            settledData: getSettledData(),
            regionList: null,
            search: function (event) {
                event.preventDefault();
                table.draw();
            },
            reset: function (event) {
                event.preventDefault();
                vm.queryData = getQueryData();
                vm.regionList = [];
                $('#region').dropdown('set value', '0')
                $('.ui.dropdown').dropdown('restore default value');
            },
            showEditWin: function (rowData) {
                vm.settledData = rowData;

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);

                editor.$txt.html(vm.settledData.content);

                var editModal = $('#settledModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        // 验证表单
                        if (editor.$txt.text().trim() == '') {
                            cMethod.showPopupMessage('error', '请填写入驻办理公告');
                            return false;
                        }
                        var formData = new FormData($('#settledForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.settledSetting.settledEdit,
                            type: 'POST',
                            data: formData,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.status === 200) {
                                    cMethod.showPopupMessage('success', data.message);
                                    table.draw();
                                } else {
                                    cMethod.showPopupMessage('error', data.message);
                                    failed = true;
                                }
                            }
                        });
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                }).modal('show');
            }
        });

    var baseTableOpts = {
        isShowIndexNumber: true,
        columns: [
            {field: null, title: '序号', isShow: true, isSort: false},
            {field: 'cityName', title: '所属城市', isShow: true, isSort: false},
            {field: 'regionName', title: '所属区域', isShow: true, isSort: false},
            {field: 'parkName', title: '园区名称', isShow: true, isSort: false},
            {field: 'status', title: '设置状态', isShow: true, isSort: false, render: function(val) {
                if (val == 1) {
                    return '已设置';
                } else if (val == 2) {
                    return '未设置';
                }
            }},
            {field: 'status', title: '操作', isShow: true, isSort: false, width: '180px', render: function(val) {
                return '<div class="tr-operation">' +
                    '<i class="icon setting" title="设置"></i>' +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.settledSetting.settledList,
            type: 'GET',
            data: function (data) {
                data.pageNo = data.start / data.length + 1;
                data.pageSize = data.length;
                $.extend(data, vm.queryData);
            }
        },
        operationCallback: function (e, rowData) {
            if (rowData) {
                var target = $(e.target);
                if (target.hasClass('icon setting')) {
                    vm.showEditWin(rowData);
                }
            }
        }
    };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            // 组件初始化
            setTimeout(function () {
                $('.ui.dropdown').dropdown();
            }, 200);
            editor = richEditor.initWangEditor({
                container: 'description',
                hideInsertImg:true,
                //hideFullscreen:true,
                uploadUrl:window.currentApiUrl.commonUploadFile,
                uploadErrorCallback:function (msg) {
                    cMessage.showPopup({
                        className: 'error',
                        content: msg
                    });
                }
            });
            //getRegionList();
            $('#cityCode').on('change', function(event) {
                if ($(event.target).val() != '0') {
                    getRegionList();
                } else {
                    vm.regionList = [];
                    $('#region').dropdown('set value', '0')
                }
            })
            
            // 获取表格数据
            table = cDataTable.initBaseTable(baseTableOpts);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})