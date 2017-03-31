/**
 * 用户管理
 */
define([
    'component-message',
    'jqueryAjax',
    'component-ztree',
    'component-datatable',
    'component-datetimerpicker',
    'appPath/common/commonMethods',
    'jquery.semantic'
], function (cMessage, jqueryAjax, cZtree,cDataTable,cDateTimerPicker,cMthods) {
    function getSelectData(data, gId){  //封装园区、楼栋、楼层查询
        var res=[];
        for(var i=0,len=data.length; i<len; i++){
            if(data[i].departmentType==gId){
                var o={};
                o.id=data[i].id;
                o.departmentName=data[i].departmentName;
                res.push(o)
            }
        };
        return res;
    }
    function getPnameData(data, gId){  //封装经营部下属 所有园区，园区下属所有楼栋信息
        var res=[];
        for(var i=0,len=data.length; i<len; i++){
            if(data[i].parentId==gId){
                var o={};
                o.id=data[i].id;
                o.departmentName=data[i].departmentName;
                res.push(o)
            }
        };
        return res;
    }
    function getAllFloorData(data, gId){  //封装所有楼栋下所有楼层信息
        var res=0,
            resArry=[];
        for(var i=0,len=data.length; i<len; i++){
            if(data[i].id==gId){
                res=Number(data[i].allFloor);
            }
        };
        if(res>0){
            for(var j=0; j<res; j++) {
                var o={},
                    n=j+1;
                o.id= n;
                o.departmentName= n.toString()+'层';
                resArry.push(o)
            }
        }
        return resArry;
    }

    var myTable,deptTreeData=[],estateTreeData=[],map,allDeptSelectQue=[],allParkSelectQue=[],allDeptSelect=[],allParkSelect=[],allBuildSelect=[],allFloorSelect=[],
        commonData = cMthods.getRoleData().roleCommonData,
        cityListData = commonData.cityList,
        sexData = commonData.sex,
        useStatusData = commonData.useStatus,
        isJobData = commonData.isJob,
        jobPositionData = commonData.jobPosition,
        accountTypeData = commonData.accountType,
        deptTreeData = commonData.deptTree,
        roleNameData = commonData.roleNameList,
        defaultParkData = function () {
            return {
                id: '',
                departmentNumber:'',
                departmentName:'',
                areaName:'',
                areaCode:'',
                houseAreaCode:'',
                houseAreaName:'',
                longitude:'',
                latitude:'',
                departmentTel:'',
                departmentEmail:'',
				departmentAddress:'',
                description:'',
                imgUrl:''
            }
        },
		defaultSearchData= function () {
            return {
                room: '',
                deptId:'0',
                parkId:'0'
            }
        },
        defaultBuildData = function () {
            return {
                id: '',
                departmentName:'',
                allFloor:''
            }
        },
        defaultData = function () {
            return {
                id: '',
                departmentId:'0',
				parkId:'0',
                buildId:'0',
                curFloor:'0',
                buildArea:'',
                room:'',
                elePrice:'',
                shareElePrice:'',
                waterPrice:'',
                shareWaterPrice:'',
                manageCost:'',
                manageCostUnit:'元/月'
            }
        },
        defaultHouseSelectData = function () {
            return {
                allDeptSelect:allDeptSelect,
                allParkSelect:allParkSelect,
                allBuildSelect:allBuildSelect,
                allFloorSelect: allFloorSelect
            }
        },
        defaultHouseInfoData = function(){
            return {
                houseId:0,
                houseName:'',
                houseCode: '',
                property:'',
                areaCode:'',
                areaName:'',
                attrCa:'PROXY',
                putStatus:'',
                longitude:'',
                latitude:'',
                address:'',
                description:'',
                houseAreaCode:'',
                houseAreaName:'',
                busCode:'',
                busName:'',
                subwayCode:'',
                subwayName:'',
                htypeCode:"0",
                fengShui:'',
                network:'',
                lift:'',
                floorHeight:'',
                allFloor:'',
                contactName:'',
                contactPhone:'',
                tagsCode:'',
                buildingsCount:'',
                developerCompany:'',
                enterInDate:'',
                allBuildArea: '',//总建筑面积
                upParkingCount: '',//地上车位
                upParkingFare: '',//地上车位费
                upParkingUnit: "元/月",//地上车位费单位
                downParkingCount: '',//地下车位
                downParkingFare: '',//地下车位费
                downParkingUnit: "元/月",//地下车位费单位
                cargoListCount: '',//货梯数量
                liftCount: '',//电梯数量
                powerSupplyType: "",//供电类型
                waterFee: "",//水费
                electricFee: "",//电费
                buildingSupporting: "",//楼盘配套
                contactSex: 0, //联系人性别
                airConditionType: "",//空调类型
                propertyFee: "", //物业费
                propertyFeeUnit:"元/㎡/月",
                enterpriseCompany: "", //入驻企业
                netArray: [false,false,false]
            }
        },
        vm = avalon.define({
            $id: 'user',
            //搜索
            curOpt:'',
            park: defaultParkData(),
            build: defaultBuildData(),
            houseInfo: defaultHouseInfoData(),
            //所属经营部
            upDeptName:'',
            allDeptSelectQue:[],
            allParkSelectQue:[],
            //联动下拉框
            houseSelect: defaultHouseSelectData(),
            allDeptSelect:allDeptSelect,
            allParkSelect:allParkSelect,
            searchData: defaultSearchData(),
            //增加房源信息
            user:defaultData(),

            deptId:'',
            search:function () {
                myTable.draw();
            },
            reset: function () {
                vm.searchData= defaultSearchData();
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                }, 200);
            },
            changeDeptData: function () {
                vm.houseSelect.allParkSelect= getPnameData(estateTreeData, Number(this.value));
                vm.houseSelect.allBuildSelect= [];
                vm.houseSelect.allFloorSelect= [];
                vm.user.parkId='0';
                vm.user.buildId='0';
                vm.user.curFloor='0';
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },200);
            },
            changeParkData: function () {
                vm.houseSelect.allBuildSelect= getPnameData(estateTreeData, Number(this.value));
                vm.houseSelect.allFloorSelect= [];
                vm.user.buildId='0';
                vm.user.curFloor='0';
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },200);
            },
            changeBuildData: function () {
                vm.houseSelect.allFloorSelect= getAllFloorData(estateTreeData, Number(this.value));
                vm.user.curFloor='0';
                setTimeout(function () {
                    $('.ui.dropdown').dropdown();
                },200);
            },
            areaTreeChange: function (e) {
                var selectArray = $(this).data('select'),
                    attrObj = {},busData =[],subwayData =[];
                if(selectArray && selectArray.length>0){
                    attrObj = {key:'areaCode',value:selectArray[0].areaCode};
                    vm.park.areaCode = attrObj.value;
                    //更新所有vm data的值
                    //vm.searchHouseTypeList = cMthods.getItemsByAttrFromItems(attrObj,houseTypeData);
                    //vm.houseTagList = cMthods.getItemsByAttrFromItems(attrObj,houseTagData);
                    //busData = cMthods.getItemsByAttrFromItems(attrObj,houseBusData);
                    //subwayData = cMthods.getItemsByAttrFromItems(attrObj,houseSubwayData);
                }else{
                    vm.searchHouseTypeList= [];
                    vm.houseTagList = [];
                    vm.park.areaCode = '';
                    vm.park.htypeCode = '';
                    vm.park.tagsCode = [];
                    vm.park.busCode = '';
                    vm.park.subwayCode = '';
                }
                //initTree('#houseInfo_ztreeBusStation', busData,'bus');
                //initTree('#houseInfo_ztreeSubwayStation', subwayData,'subway');
                setTimeout(function(){
                    $('.ui.dropdown').dropdown();
                },200);
            },
            houseAreaTreeChange: function (e) {
                var selectArray = $(this).data('select');
                if(selectArray && selectArray.length>0){
                    vm.park.houseAreaCode = selectArray[0].areaCode;
                }
            },
            //百度地图
            baiduMapPositionName:'',
            searchBaiduMapPoint:function () {
                var myGeo = new BMap.Geocoder();
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(vm.baiduMapPositionName, function(point){
                    if (point) {
                        map.clearOverlays();
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                        vm.park.longitude = point.lng;
                        vm.park.latitude = point.lat;
                    }else{
                        alert("您查询的地址没有解析到结果!");
                    }
                },vm.park.areaName);
            },
            showBaiduMap:function () {
                if(vm.park.areaName && vm.park.areaName!=''){
                    vm.baiduMapPositionName = '';
                    $('#houseInfoAddWin').modal('hide');
                    var myHosueInfoModal = $('#baiduMapWin').modal({
                        allowMultiple: true,
                        closable: false,
                        onApprove: function () {
                            $('#houseInfoAddWin').modal('show');
                            return true;
                        }
                    }).modal('show');
                    if(!map){
                        map = new BMap.Map("baiduMap");    // 创建Map实例
                        map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                        map.addEventListener("click", function (e) {
                            var currentMarker = new BMap.Marker(e.point);  // 创建标注
                            map.clearOverlays();
                            map.addOverlay(currentMarker);
                            vm.park.longitude = e.point.lng;
                            vm.park.latitude = e.point.lat;
                            currentMarker.setPosition(e.point);
                        });
                    }
                    // 设置地图显示的城市 此项是必须设置的
                    map.centerAndZoom(vm.park.areaName,16);
                    if(vm.isEdit){
                        var new_point = new BMap.Point(vm.park.longitude,vm.park.latitude);
                        var marker = new BMap.Marker(new_point);  // 创建标注
                        map.clearOverlays();
                        map.addOverlay(marker);              // 将标注添加到地图中
                        setTimeout(function () {
                            map.panTo(new_point);
                        },200);
                    }
                }else{
                    cMessage.showPopup({
                        className: 'warning',
                        content: '请先选择楼盘所属城市'
                    });
                }
            },
            //图片上传
            uploadImage: function () {
                var target = this, freader;
                if (target.files.length > 0) {
                    freader = new FileReader();
                    freader.readAsDataURL(target.files.item(0));
                    freader.onload = function (e) {
                        var imgBase64Code = e.target.result;
                        vm.park.imgUrl = imgBase64Code;
                    }
                }
            },
            showResourceImg: function () {
                window.open(vm.park.imgUrl);
            },
            delResourceImg: function () {
                vm.park.imgUrl = '';
            },
            showAddWinEstate:function (isEdit,data) {
                var url = window.currentApiUrl.systemSet.basic.realEstateEdit;
                //cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
                //cZtree.initSelectMenuTree('#user_deptZtree', deptTreeData,{
                 //   idKey: 'id',
                 //   pIdKey: 'pId',
                 //   rootPId: 0
                //});
                //cZtree.initSelectZtree('#user_ztreeCity', cMthods.getUpAreaDataListByLevel(6, cityListData), true, cMthods.getAreaTreeRootKey());
                //重置数据
                initTree('#houseInfo_ztreeCityArea', cMthods.getUpAreaDataListByLevel(4,cityListData),'area');
                initTree('#houseInfo_ztreeAddressArea', cityListData,'area');
                if (!isEdit) {
                    vm.park = defaultParkData();
					//通过parentId展现所属经营部名称
					vm.upDeptName= cMthods.getItemByAttrFromItems({key: 'id', value: data.id}, estateTreeData)['departmentName'];
                    url = window.currentApiUrl.systemSet.basic.realEstateAdd;
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        $('.ui.dropdown.link-change').dropdown('clear');
                        //cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.deptId+'');
                    },200);
                }else{
                    vm.park = data;
					vm.upDeptName= cMthods.getItemByAttrFromItems({key: 'id', value: data.parentId}, estateTreeData)['departmentName'];
                    var areaName = cMthods.getAreaNameByCode(data.areaCode,cityListData),
                        houseAreaName = cMthods.getAreaNameByCode(data.houseAreaCode,cityListData);
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        //$('.ui.dropdown.link-change').dropdown('clear').dropdown('set selected',vm.user.roleIds!=''?vm.user.roleIds.split(','):'');
                        //cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.user.departmentId+'');
                        //cZtree.selectTreeNodeByAttributeValues('user_ztreeCity', 'areaCode', vm.user.area);
                        cZtree.selectTreeNodeByNames([areaName],'houseInfo_ztreeCityArea');
                        cZtree.selectTreeNodeByNames([houseAreaName],'houseInfo_ztreeAddressArea');
                    },200);
                }
                //获取树形控件选中的值
                var myModal = $('#houseInfoAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '';
                            //idCards = JSON.parse(JSON.stringify(vm.user.identityNumber)),
                            //idCardsReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
                            //phone = JSON.parse(JSON.stringify(vm.user.phone)),
                            //phoneReg = /^1[0-9]{10}$/;
                            //roleIdsArray = $('#roleIdsSelect').val();
                        //vm.user.departmentId = cZtree.getMenuTreeCheckedAttrValues('user_deptZtree', 'id');
                        //vm.user.area = cZtree.getTreeCheckedAttrValues('user_ztreeCity', 'areaCode');
												//如果为增加时，则需提交 园区parentId
												if (!isEdit) {
													 vm.park.parentId=data.id;
													};
                        if (vm.park.departmentNumber == '') {
                            msg = '请输入部门编号';
                        } else if (vm.park.departmentName == '') {
                            msg = '请输入部门名称';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        //vm.user.upAreaCode = (cMthods.getAreaCodeByName(vm.user.areaUpName, cityListData));
                        //vm.user.roleIds = roleIdsArray==null?'':roleIdsArray.join(',');
                        jqueryAjax.post(
                            url,
                            vm.park,
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
            showEditWinFloor:function (isEdit,data) {
                var url = window.currentApiUrl.systemSet.basic.buildEdit;
                if (!isEdit) {
                    vm.build = defaultBuildData();
                    url = window.currentApiUrl.systemSet.basic.buildAdd;
                }else{
                    vm.build.departmentName = data.departmentName;
										vm.build.allFloor = data.allFloor;
                }
                //获取树形控件选中的值
                var myModal = $('#parkBuild').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '';
                        if (vm.build.buildName == '') {
                            msg = '楼层名称不能为空';
                        } else if (vm.build.floor == '') {
                            msg = '楼层不能为空';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        //vm.user.upAreaCode = (cMthods.getAreaCodeByName(vm.user.areaUpName, cityListData));
                        //vm.user.roleIds = roleIdsArray==null?'':roleIdsArray.join(',');
                        jqueryAjax.post(
                            url,
                            vm.build,
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
            showAddWin: function (isEdit,data) {
                var url = window.currentApiUrl.systemSet.basic.houseInfoEdit;
                //cDateTimerPicker.initDateTimePicker('.date-timepicker', 'yyyy-mm-dd');
                //cZtree.initSelectMenuTree('#user_deptZtree', deptTreeData,{
                //    idKey: 'id',
                //   pIdKey: 'pId',
                //    rootPId: 0
                //});
               //cZtree.initSelectZtree('#user_ztreeCity', cMthods.getUpAreaDataListByLevel(6, cityListData), true, cMthods.getAreaTreeRootKey());
                if (!isEdit) {
                    vm.user = defaultData();
                    vm.houseSelect= defaultHouseSelectData();
                    url = window.currentApiUrl.systemSet.basic.houseInfoAdd;
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        $('.ui.dropdown.link-change').dropdown('clear');
                        //cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.deptId+'');
                    },200);
                }else{
                    vm.houseSelect.allDeptSelect= allDeptSelect; //显示经营部下拉框
                    vm.houseSelect.allParkSelect= getPnameData(estateTreeData, Number(data.departmentId)); //显示园区下拉框
                    vm.houseSelect.allBuildSelect= getPnameData(estateTreeData, Number(data.parkId));  //显示楼栋下拉框
                    vm.houseSelect.allFloorSelect= getAllFloorData(estateTreeData, Number(data.buildId));  //通过楼栋id找到 显示楼层具体数
                    vm.user = data;
                    setTimeout(function () {
                        $('.ui.dropdown').dropdown();
                        //$('.ui.dropdown.link-change').dropdown('clear');
                        //$('.ui.dropdown.link-change').dropdown('clear').dropdown('set selected',vm.user.roleIds!=''?vm.user.roleIds.split(','):'');
                        //cZtree.selectMenuTreeNodeByAttributeValues('user_deptZtree', 'id', vm.user.departmentId+'');
                        //cZtree.selectTreeNodeByAttributeValues('user_ztreeCity', 'areaCode', vm.user.area);
                    },200);
                }
                //获取树形控件选中的值
                var myModal = $('#userAddWin').modal({
                    closable: false,
                    onApprove: function () {
                        var msg = '';
                            //idCards = JSON.parse(JSON.stringify(vm.user.identityNumber)),
                            //idCardsReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
                            //phone = JSON.parse(JSON.stringify(vm.user.phone)),
                            //phoneReg = /^1[0-9]{10}$/;
                            //roleIdsArray = $('#roleIdsSelect').val();
                        //vm.user.departmentId = cZtree.getMenuTreeCheckedAttrValues('user_deptZtree', 'id');
                        //vm.user.area = cZtree.getTreeCheckedAttrValues('user_ztreeCity', 'areaCode');
                        if (vm.user.departmentId == '') {
                            msg = '请选择所属经营部';
                        } else if (vm.user.realName == '') {
                            msg = '请选择所属园区';
                        } else if (vm.user.accountName == '') {
                            msg = '请选择楼栋';
                        } else if (vm.user.room == '') {
                            msg = '房号不能为空';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        //vm.user.upAreaCode = (cMthods.getAreaCodeByName(vm.user.areaUpName, cityListData));
                        //vm.user.roleIds = roleIdsArray==null?'':roleIdsArray.join(',');
                        jqueryAjax.post(
                            url,
                            vm.user,
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
            showEditWin: function (data) {
                vm.showAddWin(true,data);
            },
            showDeleteWin: function (id) {
                cMessage.showAlert({
                    content: '您确认要删除吗？<br/>删除后信息将无法恢复！',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.systemSet.basic.userDel,
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
            searchDeptTree:function (e) {
                var searchResultTree = [],
                    currentValue = e.target.value;
                if(estateTreeData && estateTreeData.length>0){
                    for(var i=0;i<estateTreeData.length;i++){
                        if(estateTreeData[i].name.indexOf(currentValue)>=0){
                            searchResultTree.push(estateTreeData[i]);
                        }
                    }
                }
                initDeptTree(searchResultTree);
            },
            resetPassword: function (id) {
                cMessage.showAlert({
                    content: '您确认要重置密码吗？',
                    onOk: function () {
                        jqueryAjax.post(
                            window.currentApiUrl.systemSet.basic.resetUserPassword,
                            {id: id},
                            function (response, msgType, isOk) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }
                        );
                    }
                });
            },
        }),
        getDeptList = function () {
            jqueryAjax.get(
                window.currentApiUrl.systemSet.basic.realEstateList,
                {},
                function (response) {
                    var data = response.data.results;
						estateTreeData= data;
                    for(var i=0;i<data.length;i++){
                        data[i].name = data[i]['departmentName'];
                        data[i].pId = data[i]['parentId'];
                        data[i].open = true;
                    }
                    deptListData = data;
                    initDeptTree(deptListData);
                    cZtree.initSelectMenuTree('#deptSelectZtree', deptListData,{
                        idKey: 'id',
                        pIdKey: 'pId',
						levelKey: 'level',
                        rootPId: 0
                    });
                    vm.allDeptSelectQue= getSelectData(estateTreeData, "2");
                    vm.allParkSelectQue= getSelectData(estateTreeData, "3");
                    allDeptSelect= getSelectData(estateTreeData, "2");
                    allParkSelect= getSelectData(estateTreeData, "3");
                    allBuildSelect= getSelectData(estateTreeData, "4");
                },
                function (response, msgType) {
                    cMessage.showPopup({
                        className: msgType,
                        content: response.message
                    });
                }
            );
        },
        initTree = function (id,data,type) {
        var treeNodeKey = {
            bus:{
                idKey: "busCode",
                pIdKey: "upBusCode",
                rootPId: 0
            },
            subway:{
                idKey: "subwayCode",
                pIdKey: "upSubwayCode",
                rootPId: 0
            },
            area:{
                idKey: "areaCode",
                pIdKey: "upAreaCode",
                rootPId: 0
            }
        };
        cZtree.initSelectZtree(id, JSON.parse(JSON.stringify(data)), false, treeNodeKey[type]);
    },
        initDeptTree = function (data) {
            cZtree.initEditTree('#deptZtree', data,
                function (treeId, treeNode) {
                    var treeNode = treeNode,
                        aObj = $('#' + treeNode.tId + '_span'),
                        editStr = '<span class="iztree button add all-add" id="diyBtn_add_' +treeNode.id+ '" title="新增子楼栋" onfocus="this.blur();"></span>' +
                            '<span class="iztree button edit all-edit" id="diyBtn_edit_' +treeNode.id+ '" title="修改园区信息" onfocus="this.blur();"></span>'+
                            '<span class="iztree button remove all-remove" id="diyBtn_del_' +treeNode.id+ '" title="删除园区" onfocus="this.blur();"></span>';
										if(treeNode.levelNumber==1) editStr='';
										if(treeNode.levelNumber==2) editStr='<span class="iztree button add only-add" id="diyBtn_add_' +treeNode.id+ '" title="新增园区" onfocus="this.blur();"></span>';
										if(treeNode.levelNumber==4) editStr='<span class="iztree button edit only-edit" id="diyBtn_edit_' +treeNode.id+ '" title="修改楼栋" onfocus="this.blur();"></span>'+
                            '<span class="iztree button remove only-remove" id="diyBtn_del_' +treeNode.id+ '" title="删除楼栋" onfocus="this.blur();"></span>';
                    if($('#diyBtn_add_'+treeNode.id).length>0 || $('#diyBtn_edit_'+treeNode.id).length>0 || $('#diyBtn_del_'+treeNode.id).length>0){
                        return
                    }

                    aObj.data('treedata',treeNode);
                    aObj.append(editStr);
                    $('span.iztree.button').off('click').on('click',function(e){
                        var curr = $(this),
                            parentTreeData = $(this).parent().data('treedata');
                        if(curr.hasClass('all-add')){
                            vm.showEditWinFloor(false,parentTreeData.id);
                        }else if(curr.hasClass('all-edit')){
                            vm.showAddWinEstate(true,parentTreeData);  //vm.showEditWinEstate(parentTreeData);
                        }else if(curr.hasClass('all-remove')){
                            vm.showDeleteWin(parentTreeData.id);  //vm.showDeleteWinEstate(parentTreeData.id);
                        }else if(curr.hasClass('only-add')){
                            vm.showAddWinEstate(false,parentTreeData);
                        }else if(curr.hasClass('only-edit')){
                            vm.showEditWinFloor(true,parentTreeData);
                        }else if(curr.hasClass('only-remove')){
                            vm.showDeleteWin(parentTreeData.id);  //vm.showDeleteWinFloor(parentTreeData.id);
                        }
                        e.stopPropagation();
                    });
                }, function (treeId, treeNode) {
                    $('#diyBtn_add_'+treeNode.id).off().remove();
                    $('#diyBtn_edit_' +treeNode.id).off().remove();
                    $('#diyBtn_del_' +treeNode.id).off().remove();
                },function(event,treeId,treeNode){
                    //vm.editDept(treeNode,'view');
                    //vm.deptId= treeId;
                    vm.search();
                    //console.log(treeNode);
                }
            );
        },
        baseTableOpts = {
            isShowIndexNumber: true,
            columns: [
                {field: null, title: '序号', isShow: true, isSort: false, width: 40},
                {field: 'departmentId', title: '经营部', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'id', value: data}, estateTreeData)['departmentName'];
                }},
                {field: 'parkId', title: '园区', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'id', value: data}, estateTreeData)['departmentName'];
                }},
                {field: 'buildId', title: '栋', isShow: true, isSort: false,render: function (data) {
                    return data==''?'':cMthods.getItemByAttrFromItems({key: 'id', value: data}, estateTreeData)['departmentName'];
                }},
                {field: 'curFloor', title: '层', isShow: true, isSort: false,render: function (data) {
                    return data+'层';
                }},
                {field: 'room', title: '房号', isShow: true, isSort: false},
                {field: 'buildArea', title: '面积(m²)', isShow: true, isSort: false},
                {
                    field: null, title: '操作', isShow: true, isSort: false,
                    render: function () {
                        return '<div class="tr-operation">' +
                            '<i class="icon edit green"></i>' +
                            '<i class="icon remove red"></i>' +
                            '</div>';
                    }
                }
            ],
            ajax: {
                url: window.currentApiUrl.systemSet.basic.realEstateManageList,
                type: 'GET',
                data: function (data) {
                    data.pageNo = data.start / data.length + 1;
                    data.pageSize = data.length;
                    data.room= vm.searchData.room;
                    data.deptId= vm.searchData.deptId;
                    data.parkId= vm.searchData.parkId;
                }
            },
            operationCallback: function (e, rowData) {
                if (rowData) {
                    var target = $(e.target);
                    if (target.hasClass('icon recycle')) {
                        vm.resetPassword(rowData.id);
                    }else if (target.hasClass('icon edit')) {
                        vm.showEditWin(rowData);
                    } else if (target.hasClass('icon remove')) {
                        vm.showDeleteWin(rowData.id);
                    }
                }
            }
        };
    return avalon.controller(function ($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function () {
            //getDeptList();
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function () {
            //if(estateTreeData.length<1){
            //    getDeptList();
            //}
            getDeptList();
            $('.ui.dropdown').dropdown();
            myTable = cDataTable.initBaseTable(baseTableOpts);

            //initDeptTree(deptTreeData);

        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function () {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
