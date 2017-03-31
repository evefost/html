/**
 * 考勤管理
 */
define([
    'component-message',
    'component-datatable',
    'jqueryAjax',
    'component-datetimerpicker',
    'appPath/common/commonMethods',
    'jquery.semantic'
], function (cMessage, cDataTable, jqueryAjax, cDateTimerPicker, cMthods) {
    var myTable, map,
        defaultSearchData = function () {
            return {
                parkName: '',
                companyName: '',
                startTime: '',
                endTime: ''
            }
        },
        vm = avalon.define({
            $id: 'decorationManage',
            imgSrc:'',
            searchFormData: defaultSearchData(),
            search: function () {
                myTable.draw();
            },
            reset: function () {
                vm.searchFormData = defaultSearchData();
            },
            exportExcel:function(){
                cMthods.downloadFile(location.origin+window.currentApiUrl.decorationManage.exportDecorationManage,vm.searchFormData);
            }
        }),
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'parkName', title: '所属园区', isShow: true, isSort: false},
                {field: 'companyName', title: '企业名称', isShow: true, isSort: false},
                {field: 'userName', title: '姓名', isShow: true, isSort: false},
                {field: 'signDate', title: '日期', isShow: true, isSort: false},
                {field: 'signInTime', title: '签到时间', isShow: true, isSort: false},
                {field: 'signInDistance', title: '离园区距离(米)', isShow: true, isSort: false},
                {field: 'signInRemark', title: '考勤备注', isShow: true, isSort: false},
                {field: 'signInImage', title: '考勤图片', isShow: true, isSort: false, render: function (data) {
                    return data == '' ? '' : '<img src=' + data + ' style="width:30px;height:20px;cursor:pointer;" />';
                }},
                {field: 'signOutTime', title: '签退时间', isShow: true, isSort: false},
                {field: 'signOutDistance', title: '离园区距离(米)', isShow: true, isSort: false},
                {field: 'signOutRemark', title: '考勤备注', isShow: true, isSort: false},
                {field: 'signOutImage', title: '考勤图片', isShow: true, isSort: false, render: function (data) {
                    return data == '' ? '' : '<img src=' + data + ' style="width:30px;height:20px;cursor:pointer;" />';
                }}
            ],
            ajax: {
                url: window.currentApiUrl.decorationManage.decorationManageList,
                type: 'GET',
                params: {
                    name: vm.name,
                    areaCode: vm.areaCode
                },
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.parkName = vm.searchFormData.parkName;
                    data.companyName = vm.searchFormData.companyName;
                    data.startTime = vm.searchFormData.startTime;
                    data.endTime = vm.searchFormData.endTime;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);

                    if(e.target.tagName=='IMG'){
                        vm.imgSrc = e.target.src;
                        $('#decorationManageImg').modal('show');
                    }
                }
            }
        },
        initTree = function (id, data) {
            cZtree.initSelectZtree(id, JSON.parse(JSON.stringify(data)), false, cMthods.getAreaTreeRootKey());
        };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            myTable = cDataTable.initBaseTable(baseTableOpts);
            cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
        }
        $ctrl.$onBeforeUnload = function () {
        }
        $ctrl.$vmodels = [];
    });
});
