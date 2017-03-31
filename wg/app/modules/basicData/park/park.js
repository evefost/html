define([
    'jqueryAjax',
    'appPath/common/commonMethods',
    'component-message',
    'component-datatable',
    'component-datetimerpicker',
    'component-wangeditor'
], function(jqueryAjax, cMethod, cMessage, cDataTable, cDateTimePicker, richEditor) {
    var table,
        editor,
        map,
        getQueryData = function () {
            return {
                name: '',
                code: '',
                cityCode: '0',
                regionCode: '0',
                isEnable: '0',
                addressKey: '',
                contacts: '',
                contactsPhone: '',
                startTime: '',
                endTime: ''
            }
        },
        getNewParkData = function () {
            return {
                title: '',
                id: '',
                name: '',
                code: '',
                industryIds: '',
                contacts: '',
                contactsPhone: '',
                contactsPosition: '',
                description: '',
                cityCode: '0',
                cityName: '深圳',
                regionCode: '0',
                address: '',
                logo: '',
                longitude: '',
                latitude: '',
            }
        },
        getRegionList =  function() {
            var cityCode = vm.parkData.cityCode;
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
            $id: 'park',
            commonData: cMethod.getRoleData(),
            queryData: getQueryData(),
            parkData: getNewParkData(),
            isEdit: false,
            industrySet: null,
            regionList: null,
            search: function () {
                table.draw();
            },
            reset: function () {
                vm.queryData = getQueryData();
                $('.ui.dropdown').dropdown('restore default value');
            },
            showAddWin: function () {
                vm.parkData = getNewParkData();
                vm.parkData.title = '新增园区';
                vm.isEdit = false;

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                    $('#multi-select').dropdown('clear')
                }, 200);
                $('.special.cards .image').dimmer({
                    on: 'hover'
                });

                var addModal = $('#parkModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        // 验证表单
                        if (!vm.parkData.name) {
                            cMethod.showPopupMessage('error', '请填写园区名称');
                            return false;
                        } else if (!vm.parkData.code) {
                            cMethod.showPopupMessage('error', '请填写园区编码');
                            return false;
                        } else if (!vm.parkData.industryIds) {
                            cMethod.showPopupMessage('error', '请选择主要行业');
                            return false;
                        } else if (!vm.parkData.contacts) {
                            cMethod.showPopupMessage('error', '请填写联系人');
                            return false;
                        } else if (!vm.parkData.contactsPhone) {
                            cMethod.showPopupMessage('error', '请填写联系电话');
                            return false;
                        } else if (!vm.parkData.contactsPosition) {
                            cMethod.showPopupMessage('error', '请填写联系人职务');
                            return false;
                        } else if (vm.parkData.cityCode == '0') {
                            cMethod.showPopupMessage('error', '请选择所属城市');
                            return false;
                        } else if (vm.parkData.regionCode == '0') {
                            cMethod.showPopupMessage('error', '请选择所属区域');
                            return false;
                        } else if (!vm.parkData.address) {
                            cMethod.showPopupMessage('error', '请填写园区地址');
                            return false;
                        } else if (!vm.parkData.longitude || !vm.parkData.latitude) {
                            cMethod.showPopupMessage('error', '请填写或选择经纬度坐标');
                            return false;
                        } else if (!cMethod.validatePhone(vm.parkData.contactsPhone)) {
                            cMethod.showPopupMessage('warning', '联系电话格式不正确哦');
                            return false;
                        };

                        try {
                            $('#industryIds').val(vm.parkData.industryIds.join(','));
                        } catch (e) {}

                        var failed = false;
                        var formData = new FormData($('#parkForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.basicData.parkAdd,
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
                        return !failed;
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                }).modal('show');
            },
            showEditWin: function (id) {
                // 获取该园区详情
                $.ajax({
                    url: window.currentApiUrl.basicData.parkDetail,
                    type: 'GET',
                    data: 'id=' + id,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.parkData = data.data.parkDetail;
                            vm.parkData.title = '修改园区信息';
                            vm.isEdit = true;
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });

                // 组件初始化
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);

                try {
                    $('#multi-select').dropdown('set exactly', vm.parkData.industryIds.split(','))
                } catch (e) {}

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
                editor.$txt.html(vm.parkData.description);

                var editModal = $('#parkModal').modal('setting', {
                    closable: false,
                    onApprove: function() {
                        // 验证表单
                        if (!vm.parkData.name) {
                            cMethod.showPopupMessage('error', '请填写园区名称');
                            return false;
                        } else if (!vm.parkData.code) {
                            cMethod.showPopupMessage('error', '请填写园区编码');
                            return false;
                        } else if (!vm.parkData.industryIds) {
                            cMethod.showPopupMessage('error', '请选择主要行业');
                            return false;
                        } else if (!vm.parkData.contacts) {
                            cMethod.showPopupMessage('error', '请填写联系人');
                            return false;
                        } else if (!vm.parkData.contactsPhone) {
                            cMethod.showPopupMessage('error', '请填写联系电话');
                            return false;
                        } else if (!vm.parkData.contactsPosition) {
                            cMethod.showPopupMessage('error', '请填写联系人职务');
                            return false;
                        } else if (vm.parkData.cityCode == '0') {
                            cMethod.showPopupMessage('error', '请选择所属城市');
                            return false;
                        } else if (vm.parkData.regionCode == '0') {
                            cMethod.showPopupMessage('error', '请选择所属区域');
                            return false;
                        } else if (!vm.parkData.address) {
                            cMethod.showPopupMessage('error', '请填写园区地址');
                            return false;
                        } else if (!vm.parkData.longitude || !vm.parkData.latitude) {
                            cMethod.showPopupMessage('error', '请填写或选择经纬度坐标');
                            return false;
                        } else if (!cMethod.validatePhone(vm.parkData.contactsPhone)) {
                            cMethod.showPopupMessage('warning', '联系电话格式不正确哦');
                            return false;
                        }

                        try {
                            $('#industryIds').val(vm.parkData.industryIds.join(','));
                        } catch (e) {}

                        var failed = false;
                        var formData = new FormData($('#parkForm')[0]);
                        $.ajax({
                            url: window.currentApiUrl.basicData.parkEdit,
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
                        return !failed;
                    },
                    onDeny: function() {
                    },
                    onHide: function() {
                    }
                }).modal('show');
            },
            showDetailWin: function(id) {
                $.ajax({
                    url: window.currentApiUrl.basicData.parkDetail,
                    type: 'GET',
                    data: 'id=' + id,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.status === 200) {
                            vm.parkData = data.data.parkDetail;
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });
                var detailModal = $('#modalDetail').modal('setting', {
                    closable: true,
                    onApprove: function() {
                    }
                }).modal('show');
            },
            showDeleteWin: function(id) {
                var deleteModal = $('#confirm').modal('setting', {
                    closable: true,
                    onApprove: function() {
                        var success = true;
                        $.ajax({
                            url: window.currentApiUrl.basicData.parkDelete,
                            type: 'GET',
                            data: 'id=' + id,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                console.log(data)
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
            switchStatus: function(rowData) {
                var operation = rowData.isEnable === 'YES' ? 'parkDisable' : 'parkEnable',
                    url = window.currentApiUrl.basicData[operation];
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: 'id=' + rowData.id,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        console.log(data);
                        if (data.status === 200) {
                            table.draw();
                        } else {
                            cMethod.showPopupMessage('error', data.message);
                        }
                    }
                });
            },
            //百度地图
            baiduMapPositionName: '',
            searchBaiduMapPoint: function () {
                /*var myGeo = new BMap.Geocoder();
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(vm.baiduMapPositionName, function(point){
                    if (point) {
                        map.clearOverlays();
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                        vm.parkData.longitude = point.lng;
                        vm.parkData.latitude = point.lat;
                    } else {
                        alert("您查询的地址没有解析到结果!");
                    }
                }, vm.parkData.cityName);*/
                var local = new BMap.LocalSearch(map, {
                    renderOptions:{map: map}
                });
                local.search(vm.baiduMapPositionName);
            },
            showBaiduMap: function () {
                if (vm.parkData.cityName && vm.parkData.cityName != '') {
                    vm.baiduMapPositionName = '';
                    $('#parkModal').modal('hide');
                    var mapModal = $('#baiduMapWin').modal({
                        allowMultiple: true,
                        closable: false,
                        onApprove: function() {
                            $('#parkModal').modal('show');
                            return true;
                        }
                    }).modal('show');

                    if (!map) {
                        map = new BMap.Map("baiduMap");    // 创建Map实例
                        map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                        map.addEventListener("click", function(e) {
                            var currentMarker = new BMap.Marker(e.point);  // 创建标注
                            map.clearOverlays();
                            map.addOverlay(currentMarker);
                            vm.parkData.longitude = e.point.lng;
                            vm.parkData.latitude = e.point.lat;
                            currentMarker.setPosition(e.point);
                        });
                    }
                    // 设置地图显示的城市 此项是必须设置的
                    map.centerAndZoom(vm.parkData.cityName, 16);

                    if (vm.isEdit){
                        var new_point = new BMap.Point(vm.parkData.longitude, vm.parkData.latitude);
                        var marker = new BMap.Marker(new_point);  // 创建标注
                        map.clearOverlays();
                        map.addOverlay(marker);              // 将标注添加到地图中
                        setTimeout(function () {
                            map.panTo(new_point);
                        }, 200);
                    }
                } else {
                    cMessage.showPopup({
                        className: 'warning',
                        content: '请先选择园区所在城市'
                    });
                }
            },
            uploadImage: function(type){
                var target = this, freader;
                if (target.files.length > 0) {
                    freader = new FileReader();
                    freader.readAsDataURL(target.files.item(0));
                    freader.onload = function (e) {
                        var imgBase64Code= e.target.result;
                        vm.parkData.logo = imgBase64Code;
                    }
                }
            },
            showResourceImg: function () {
                var sourceImg = vm.parkData.logo;
                sourceImg !='' && window.open(sourceImg);
            },
            delResourceImg: function () {
                vm.parkData.logo = '';
            },

        });

    var baseTableOpts = {
        isShowIndexNumber: false,
        columns: [
            {field: 'code', title: '编码', isShow: true, isSort: false},
            {field: 'name', title: '园区名称', isShow: true, isSort: false},
            {field: 'cityName', title: '所属城市', isShow: true, isSort: false},
            {field: 'regionName', title: '所属区域', isShow: true, isSort: false},
            {field: 'address', title: '园区地址', isShow: true, isSort: false},
            {field: 'industry', title: '主要行业', isShow: true, isSort: false, render: function (val) {
                return val.split(',').join('，');
            }},
            {field: 'contacts', title: '联系人', isShow: true, isSort: false},
            {field: 'contactsPhone', title: '联系方式', isShow: true, isSort: false},
            {field: 'createTime', title: '新增时间', isShow: true, isSort: false},
            {field: 'updateTime', title: '更新时间', isShow: true, isSort: false},
            {field: 'isEnable', title: '启用状态', isShow: true, isSort: false, render: function(val) {
                return cMethod.getItemByAttrFromItems({key: 'value', value: val}, vm.commonData.roleCommonData.useStatus)['name']
            }},
            {field: 'isEnable', title: '操作', isShow: true, isSort: false, width: '160px', render: function(val) {
                var status = val === 'YES' ?
                    '<i class="icon switch unlock" title="禁用"></i>'
                    : '<i class="icon switch lock orange" title="启用"></i>';
                return '<div class="tr-operation">' +
                    '<i class="icon info circle teal" title="详情"></i>' + status +
                    '<i class="icon edit green" title="修改"></i>' +
                    '<i class="icon remove red" title="删除"></i>' +
                    '</div>';
            }},
        ],
        ajax: {
            url: window.currentApiUrl.basicData.parkList,
            type: 'POST',
            data: function (data) {
                data.pageNo = data.start / data.length + 1;
                data.pageSize = data.length;
                $.extend(data, vm.queryData);
            }
        },
        operationCallback: function (e, rowData) {
            if (rowData) {
                var target = $(e.target);
                if (target.hasClass('icon switch')) {
                    vm.switchStatus(rowData);
                } else if (target.hasClass('icon info')) {
                    vm.showDetailWin(rowData.id);
                } else if (target.hasClass('icon edit')) {
                    vm.showEditWin(rowData.id);
                } else if (target.hasClass('icon remove')) {
                    vm.showDeleteWin(rowData.id);
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
            cDateTimePicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
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
            getRegionList();
            $('#cityCode').on('change', function() {
                getRegionList();
            })
            // 获取表格数据
            table = cDataTable.initBaseTable(baseTableOpts);

            // 获取行业信息
            $.ajax({
                url: window.currentApiUrl.basicData.industrySet,
                type: 'GET',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.status === 200) {
                        vm.industrySet = data.data.results;
                    }
                }
            });
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
})