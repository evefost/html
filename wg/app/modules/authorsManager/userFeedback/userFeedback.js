/**
 * 用户反馈管理
 */
define([
    'component-message',
    'component-datatable',
    'jqueryAjax',
    'appPath/common/commonMethods',
    'jquery.semantic'
], function (cMessage, cDataTable, jqueryAjax,cMthods) {
    var myTable,map,
        commonData = cMthods.getRoleData().roleCommonData,
        cityListData = cMthods.getCityList(),
        platformData = commonData.platform,
        roleTypeData = commonData.roleType,
        defaultSearchData = function () {
            return {
                areaCode: '0',
                parkName:'',
                companyName:'',
                platform: '0',
                userName:'',
                userPhone:''
            }
        },
        vm = avalon.define({
            $id: 'userFeedback',
            isEdit:false,
            cityList: cityListData,
            platformList: platformData,
            searchFormData : defaultSearchData(),
            search: function () {
                myTable.draw();
            },
            reset:function () {
                vm.searchFormData = defaultSearchData();
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },200);
            }
        }),
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'userName', title: '用户', isShow: true, isSort: false},
                {field: 'userPhone', title: '电话', isShow: true, isSort: false},
                {field: 'areaCode', title: '城市', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'code', value: data}, cityListData)['name'];
                }},
                {field: 'userType', title: '角色分类', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, roleTypeData)['name'];
                }},
                {field: 'parkName', title: '所属园区', isShow: true, isSort: false},
                {field: 'companyName', title: '所属企业', isShow: true, isSort: false},
                {field: 'platform', title: '来源', isShow: true, isSort: false,render: function (data) {
                    return data;
                    //return data==''?'':cMthods.getItemByAttrFromItems({key: 'value', value: data}, platformData)['name'];
                }},
                {field: 'content', title: '反馈意见', isShow: true, isSort: false},
                {field: 'updateTime', title: '更新时间', isShow: true, isSort: false}
            ],
            ajax: {
                url: window.currentApiUrl.userFeedback.userFeedbackList,
                type: 'GET',
                params: {
                    name: vm.name,
                    areaCode: vm.areaCode
                },
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.areaCode=vm.searchFormData.areaCode;
                    data.parkName=vm.searchFormData.parkName;
                    data.companyName=vm.searchFormData.companyName;
                    data.platform=vm.searchFormData.platform;
                    data.userName=vm.searchFormData.userName;
                    data.userPhone=vm.searchFormData.userPhone;
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

    //根据区域等级变化，更新树形组件的数据
    vm.$watch("userFeedback.level", function (value) {
        if(value==0){
            initTree('#userFeedback_ztreeCity', []);
        }else{
            initTree('#userFeedback_ztreeCity', cMthods.getUpAreaDataListByLevel(value, cityListData));
        }

    });
    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {}
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            myTable = cDataTable.initBaseTable(baseTableOpts);
            $('.ui.dropdown').dropdown();
        }
        $ctrl.$onBeforeUnload = function () {}
        $ctrl.$vmodels = [];
    });
});
