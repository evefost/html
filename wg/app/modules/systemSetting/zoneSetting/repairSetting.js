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
                configFlag: '0'
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
            $id: 'repairSetting',
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
                avalon.router.go('app.systemSetting.repairSetting.detail', {parkId: rowData.parkId})
            }
        });

    var baseTableOpts = {
        isShowIndexNumber: true,
        columns: [
            {field: null, title: '序号', isShow: true, isSort: false},
            {field: 'area', title: '所属区域', isShow: true, isSort: false},
            {field: 'parkName', title: '园区名称', isShow: true, isSort: false},
            {field: 'repairConfig', title: '设置状态', isShow: true, isSort: false, render: function(val) {
                if (val == 'YES') {
                    return '已设置';
                } else if (val == 'NO') {
                    return '未设置';
                }
            }},
            {field: 'repairServiceCount', title: '维修种类', isShow: true, isSort: false},
            {field: null, title: '操作', isShow: true, isSort: false, width: '180px', render: function(val) {
                return '<div class="tr-operation">' +
                    '<i class="icon setting" title="设置"></i>' +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.repairSetting.repairList,
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