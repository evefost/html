define([
    'appPath/common/commonMethods',
    'component-datatable',
], function(cMethod, cDataTable) {
    var table,
        map
        getQueryData = function () {
            return {
                companyName: '',
                isDistanceLimit: '0',
                inDistanceLimitNeedphoto: '0',
                outDistanceLimitNeedphoto: '0',
                isEnable: '0',
            }
        },
        getNewCompanyConfig = function() {
            return {
                parkId: '0',
                parkName: '',
                companyId: '0',
                companyName: '',
                lonlat: '',
                lon: '',
                lat: '',
                isDistanceLimit: 'YES',
                distanceLimit: '300',
                inDistanceLimitNeedphoto: 'NO',
                outDistanceLimitNeedphoto: 'YES',
            }
        },
        vm = avalon.define({
            $id: 'companySetting',
            commonData: cMethod.getRoleData(),
            parkData: null,
            companyList: {
                ids: [],
                list: [],
            },
            companyConfig: getNewCompanyConfig(),
            queryData: getQueryData(),
            parkId: '',
            isEdit: false,
            back: function () {
                avalon.router.go('app.systemSetting.attendance');
            },
            search: function () {
                table.draw();
            },
            reset: function () {
                vm.queryData = getQueryData();
                $('.ui.dropdown').dropdown('restore default value');
            },
            showAddWin: function () {
                vm.isEdit = false;
                vm.companyConfig = getNewCompanyConfig();
                var options = 'parkid=' + vm.parkId;
                // 获取企业名称-id对应关系
                $.ajax({
                    url: window.currentApiUrl.attendance.getCompanys,
                    type: 'GET',
                    data: options,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        var companys = data.data.results;
                        companys.forEach(function(v, i) {
                            if (vm.companyList.ids.indexOf(v.id) < 0) {
                                vm.companyList.ids.push(v.id);
                                vm.companyList.list.push({companyId: v.id, companyName: v.name})
                            }
                        });
                    }
                });

                // 打开下拉框全文搜索
                setTimeout(function () {
                    $('.ui.dropdown').dropdown({
                        fullTextSearch: true,
                        showOnFocus: false
                    });
                }, 200)
                var addModal = $('#companyConfig').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        var success = true,
                            lonlat,
                            formData = new FormData($('#formData')[0]);
                        if ( vm.companyConfig.companyId === '0' ) {
                            cMethod.showPopupMessage('error', '请选择要设定的企业');
                            return false;
                        }
                        try {
                            lonlat = vm.companyConfig.lonlat.split(',');
                            if (lonlat.length !== 2) {
                                success = false;
                            }
                        } catch (e) {}
                        if (!success) {
                            cMethod.showPopupMessage('warning', '经纬度填写不正确，请点击搜索图标利用地图定位');
                        }
                        $.ajax({
                            url: window.currentApiUrl.attendance.addCompanyConfig,
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
                                    success = false;
                                }
                            }
                        });
                        return success;
                    },
                    onDeny: function() {
                    }
                }).modal('show');
            },
            showEditWin: function (rowData) {
                vm.isEdit = true;
                vm.companyConfig = rowData;
                vm.companyConfig.lonlat = rowData.lonlat;
                vm.companyConfig.lon = rowData.lonlat.split(',')[0];
                vm.companyConfig.lat = rowData.lonlat.split(',')[1];
                var editModal = $('#companyConfig').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        var success = true;
                        var lonlat;
                        try {
                            lonlat = vm.companyConfig.lonlat.split(',');
                            if (lonlat.length !== 2) {
                                success = false;
                            }
                        } catch (e) {}
                        if (!success) {
                            cMethod.showPopupMessage('warning', '经纬度填写不正确，请点击搜索图标利用地图定位');
                        }
                        var formData = new FormData($('#formData')[0])
                        $.ajax({
                            url: window.currentApiUrl.attendance.updateCompanyConfig,
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
                                    success = false;
                                }
                            }
                        });
                        return success;
                    },
                    onDeny: function() {
                    }
                }).modal('show');
            },
            showDeleteWin: function(id) {
                var deleteModal = $('#confirm').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        var success = true;
                        $.ajax({
                            url: window.currentApiUrl.attendance.deleteCompanyConfig,
                            type: 'GET',
                            data: 'id=' + id,
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
                                    success = false;
                                }
                            }
                        });
                        return success;
                    },
                    onDeny: function() {
                    }
                }).modal('show');
            },
            switchConfig: function(rowData) {
                var operation = rowData.isEnable === 'YES' ? 'disableCompanyConfig' : 'enableCompanyConfig',
                    url = window.currentApiUrl.attendance[operation];
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: 'id=' + rowData.id,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        if (data.status === 200) {
                            table.draw();
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                })
            },
            //百度地图
            baiduMapPositionName: '',
            searchBaiduMapPoint: function () {
                var myGeo = new BMap.Geocoder();
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(vm.baiduMapPositionName, function(point){
                    if (point) {
                        map.clearOverlays();
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                        vm.companyConfig.longitude = point.lng;
                        vm.companyConfig.latitude = point.lat;
                    } else {
                        alert("您查询的地址没有解析到结果!");
                    }
                }, vm.companyConfig.cityName);
                var local = new BMap.LocalSearch(map, {
                    renderOptions:{map: map}
                });
                local.search(vm.baiduMapPositionName);
            },
            showBaiduMap: function () {
                if (!vm.isEdit) {
                    vm.companyConfig.cityName = '深圳';
                }
                vm.baiduMapPositionName = '';
                $('#companyConfig').modal('hide');
                var mapModal = $('#baiduMapWin').modal({
                    allowMultiple: true,
                    closable: false,
                    onApprove: function() {
                        $('#companyConfig').modal('show');
                        return true;
                    },
                    onDeny: function () {
                        $('#companyConfig').modal('show');
                        if (!vm.isEdit) {
                            vm.companyConfig.lonlat = '';
                        }
                    }
                });
                setTimeout(function () {
                    mapModal.modal('show');
                }, 0)

                if (!map) {
                    map = new BMap.Map("baiduMap");    // 创建Map实例
                    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                }
                map.addEventListener("click", function(e) {
                    var currentMarker = new BMap.Marker(e.point);  // 创建标注
                    map.clearOverlays();
                    map.addOverlay(currentMarker);
                    console.log('clicked', e.point.lng, e.point.lat)
                    vm.companyConfig.lon = e.point.lng;
                    vm.companyConfig.lat = e.point.lat;
                    vm.companyConfig.lonlat = [e.point.lng, e.point.lat].join(',');
                    currentMarker.setPosition(e.point);
                });
                // 设置地图显示的城市 此项是必须设置的
                map.centerAndZoom(vm.companyConfig.cityName, 16);

                /*if (vm.isEdit){
                    var lonlat = vm.companyConfig.lonlat.split(',');
                    var new_point = new BMap.Point(lonlat[0], lonlat[1]);
                    var marker = new BMap.Marker(new_point);  // 创建标注
                    map.clearOverlays();
                    map.addOverlay(marker);              // 将标注添加到地图中
                    setTimeout(function () {
                        map.panTo(new_point);
                    }, 200);
                }*/
            },
        });
    var baseTableOpts = {
        isShowIndexNumber: true,
        columns: [
            {field: null, title: '序号', isShow: true, inSort: false},
            {field: 'companyName', title: '企业', isShow: true, isSort: false},
            {field: 'parkName', title: '所属园区', isShow: true, inSort: false},
            {field: 'isDistanceLimit', title: '必须在设定范围内打卡', isShow: true, isSort: false, render: function (val) {
                return val === 'YES' ? '是' : '否';
            }},
            {field: 'distanceLimit', title: '打卡有效范围', isShow: true, isSort: false},
            {field: 'inDistanceLimitNeedphoto', title: '设定范围内必须拍照', isShow: true, isSort: false, render: function (val) {
                return val === 'YES' ? '是' : '否';
            }},
            {field: 'outDistanceLimitNeedphoto', title: '设定范围外必须拍照', isShow: true, isSort: false, render: function (val) {
                return val === 'YES' ? '是' : '否';
            }},
            {field: 'isEnable', title: '启用状态', isShow: true, isSort: false, render: function (val) {
                return cMethod.getItemByAttrFromItems({key: 'value', value: val}, vm.commonData.roleCommonData.useStatus)['name']
            }},
            {field: 'createTime', title: '新建时间', isShow: true, isSort: false, render: function(date) {
                return cMethod.getFormattedDate(new Date(date))
            }},
            {field: 'updateTime', title: '更新时间', isShow: true, isSort: false, render: function(date) {
                return cMethod.getFormattedDate(new Date(date))
            }},
            {field: 'isEnable', title: '操作', isShow: true, isSort: false, render: function (val) {
                var title = val === 'YES' ? '<i class="icon switch green unlock" title="禁用"></i>' : '<i class="icon switch orange lock" title="启用"></i>';
                return '<div class="tr-operation">' + title +
                    '<i class="icon edit teal" title="修改"></i>' +
                    '<i class="icon remove red" title="删除"></i>' +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.attendance.getCompanyConfigList,
            type: 'GET',
            data: function (data) {
                data.pageNo = data.start / data.length + 1;
                data.pageSize = data.length;
                $.extend(data, vm.queryData)
                data.parkId = vm.parkId;
            },
        },
        operationCallback: function (e, rowData) {
            if (rowData) {
                var target = $(e.target);
                if (target.hasClass('icon switch')) {
                    vm.switchConfig(rowData);
                } else if (target.hasClass('icon remove')) {
                    vm.showDeleteWin(rowData.id);
                } else if (target.hasClass('icon edit')) {
                    vm.showEditWin(rowData);
                }
            }
        }
    };

    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function (data) {
            vm.parkId = data.parkId;
            vm.parkName = data.parkName;
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            // 初始化组件
            $('.ui.dropdown').dropdown('setting', {
                fullTextSearch: true,
            });
            // 获取企业设置列表
            table = cDataTable.initBaseTable(baseTableOpts);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})