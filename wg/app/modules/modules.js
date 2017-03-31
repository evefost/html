/**
 * app应用模块入口 author -->TopFEer:ajser -- dengpei  Create Date: 2017-03-8
 */
define([
    'component-message',
    'jqueryAjax',
    'appPath/common/commonMethods',
    'avalon-mmState',
    'avalon-mmRouter',
    'jquery'
], function (cMessage,jqueryAjax,cMthods) {
    // 定义一个顶层的vmodel，用来放置全局共享数据
    var firstLoad = false,
        commonData = cMthods.getRoleData().project,
        root = avalon.define({
            $id: 'app',
            page: '',
            webSiteUrl : configData.environment[configData.currentEnv].webSiteUrl,
            roleData: {},
            topMenuList:[],
            leftMenuList:[],
            currentTopUrl:'',
            currentLeftUrl:'',
            showLeftMenu: true,
            //密码
            reNewPwd:'',
            newPwd:'',
            loginOut: function () {
                /*cMessage.showAlert({
                    content:'确认退出吗？',
                    onOk: function () {
                        //window.location.href = root.webSiteUrl+'/src/login.html';
                        window.location.href = window.currentApiUrl.loginOut;
                    },
                    onCancel: function () {
                        //alert('cancel');
                    }
                });*/
                //localStorage.removeItem('rolesData_wg');
                window.location.href = window.currentApiUrl.loginOut;
            },
            modifyPassword:function () {
                var myModal = $('#myAccountPwdWin').modal({
                    closable: false,
                    onApprove: function () {
                        //获取区域code
                        var msg = '';
                        if (root.newPwd == '') {
                            msg = '请输入新密码';
                        }else if (root.newPwd != '' && root.newPwd.length<6) {
                            msg = '新密码不能少于6位';
                        } else if (root.reNewPwd == '') {
                            msg = '请再次输入密码';
                        } else if (root.newPwd != root.reNewPwd ) {
                            msg = '两次密码属于不一致';
                        } else {
                            msg = '';
                        }
                        if (msg != '') {
                            cMessage.showPopup({className: 'warning', content: msg});
                            return false;
                        }
                        jqueryAjax.post(
                            window.currentApiUrl.changePassword,
                            {
                                userId:commonData.userId,
                                password:root.newPwd
                            },
                            function (response, msgType, isOk) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: '密码修改已完成,系统即将退出请重新登录！'
                                });
                                if (isOk) {
                                    setTimeout(function () {
                                        root.loginOut();
                                    },2000);
                                    myModal.modal('hide');
                                }
                            }, function (response, msgType) {
                                cMessage.showPopup({
                                    className: msgType,
                                    content: response.message
                                });
                            }
                        );
                        return false;
                    }
                }).modal('show');
            },
            mainPage: function () {
                window.location.href = '../main.html';
            },
            toggleLeftMenu:function(e){
                $('.ui.main .left-menu').toggle();
            },
            toggleMenuList:function(e){
                var target = $(e.currentTarget);
                if(target.children('i').hasClass('down')){
                    target.children('i').removeClass('down').addClass('right');
                }else{
                    target.children('i').removeClass('right').addClass('down');
                }
                //hide or show child list
                target.next().slideToggle(150);
            },
            clickTopMenu:function(url,leftMenuName){
                var page = url.split('/')[1];
                root.showLeftMenu = (page === 'overview') ? false : true;
                var firstLeftMenuUrlState = '';
                for(var i =0;i<root.topMenuList.length;i++){
                    if(root.topMenuList[i].name==leftMenuName){
                        root.leftMenuList =root.topMenuList[i].child;
                        break;
                    }
                }
                if(root.leftMenuList[0].child && root.leftMenuList[0].child.length==0){
                    firstLeftMenuUrlState = root.leftMenuList[0].url.replace(/\//gm,'.');
                }else{
                    firstLeftMenuUrlState = root.leftMenuList[0].child[0].url.replace(/\//gm,'.');
                }

                avalon.router.go(firstLeftMenuUrlState);
            }
        }),
        setDefaultRoleData=function(roleData){
            //设置初始化菜单数据
            root.roleData = roleData;
            root.topMenuList = roleData.roleMenuList;
            root.leftMenuList = roleData.roleMenuList[0].child;
        },
        getRoleData = function (callback) {
            var roleStrData = localStorage.getItem('rolesData_wg'),
                roleObjData = {},
                currentEnv = configData.currentEnv;
            if(roleStrData && roleStrData!='undefined'){
                roleObjData = JSON.parse(roleStrData);
                setDefaultRoleData(roleObjData);
                callback && callback();
            }else{
                /*$.ajax({
                    url: configData.apiUrl[currentEnv].roleData,
                    dataType: 'json',
                    type:'post',
                    success: function (response) {
                        if (response.status == 200) {
                            localStorage.setItem('roleData',JSON.stringify(response.data.results));
                            setDefaultRoleData(response.data.results);
                            callback && callback();
                        } else {
                            alert(response.message);
                        }
                    },
                    error: function () {
                        alert(response.message);
                    }
                });*/
                cMessage.showAlert({
                    content: '非法状态，系统即将退出请重新登录！',
                    onOk: function () {
                        root.loginOut();
                    },
                    onCancel:function () {
                        root.loginOut();
                    }
                });
            }
        };

    //入口配置
    avalon.state.config({
        onError: function () {
            //console.log(arguments)
        },
        onLoad: function () {
            var stateName = mmState.currentState.stateName,
                tempArray = stateName.split('.');
            root.page = stateName.split('.')[1];
            root.currentLeftUrl = tempArray[0]+'/'+tempArray[1]+'/'+tempArray[2];
            root.currentTopUrl = tempArray[0]+'/'+tempArray[1];
            if (root.page === 'overview') {
                root.showLeftMenu = false;
            }
            //console.log(root.currentTopUrl,root.currentLeftUrl);
            if(!firstLoad){
                //firstLoad = true; 注释了是为了方便 router.go()
                for(var i =0;i<root.topMenuList.length;i++){
                    if(root.topMenuList[i].url==root.currentTopUrl){
                        root.leftMenuList =root.topMenuList[i].child;
                        break;
                    }
                }
            }
        },
        onViewEnter: function (newNode, oldNode) {}
    });

    // 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
    avalon.state('app', {
        url: '/',
        //abstract: true, // 抽象状态，不会对应到url上
        views: {
            '': {
                templateUrl: 'layout.html'
            }
        }
    }).state('app.overview', { // 我的工作台
        url: 'app/overview/',
        abstract: true,
        templateUrl: 'overview/home.html'
    }).state('app.overview.home', {
        url: 'home',
        views: {
            '@': {
                templateUrl: 'overview/home.html',
                controllerUrl: 'overview/home.js'
            }
        }
    }).state('app.serviceManage', { // 客服管理
        url: 'app/serviceManage/',
        abstract: true,
        templateUrl: 'serviceManage/repair/repair.html'
    }).state('app.serviceManage.repair', {
        url: 'repair',
        views: {
            '@': {
                templateUrl: 'serviceManage/repair/repair.html',
                controllerUrl: 'serviceManage/repair/repair.js'
            }
        }
    }).state('app.serviceManage.greening', {
        url: 'greening',
        views: {
            '@': {
                templateUrl: 'serviceManage/greening/greening.html',
                controllerUrl: 'serviceManage/greening/greening.js'
            }
        }
    }).state('app.serviceManage.cleaning', {
        url: 'cleaning',
        views: {
            '@': {
                templateUrl: 'serviceManage/cleaning/cleaning.html',
                controllerUrl: 'serviceManage/cleaning/cleaning.js'
            }
        }
    }).state('app.serviceManage.decorationManage', {
        url: 'decorationManage',
        views: {
            '@': {
                templateUrl: 'serviceManage/decorationManage/decorationManage.html',
                controllerUrl: 'serviceManage/decorationManage/decorationManage.js'
            }
        }
    }).state('app.serviceManage.meetingRoom', {
        url: 'meetingRoom',
        views: {
            '@': {
                templateUrl: 'serviceManage/meetingRoom/meetingRoom.html',
                controllerUrl: 'serviceManage/meetingRoom/meetingRoom.js'
            }
        }
    }).state('app.serviceManage.bill', { // 账单服务
        url: 'bill',
        views: {
            '@': {
                templateUrl: 'serviceManage/bill/bill.html',
                controllerUrl: 'serviceManage/bill/bill.js'
            }
        }
    }).state('app.serviceManage.attendance', { // 考勤管理
        url: 'attendance',
        views: {
            '@': {
                templateUrl: 'serviceManage/attendance/attendance.html',
                controllerUrl: 'serviceManage/attendance/attendance.js'
            }
        }
    }).state('app.serviceManage.intelligence', {
        url: 'intelligence',
        views: {
            '@': {
                templateUrl: 'serviceManage/intelligence/intelligence.html',
                controllerUrl: 'serviceManage/intelligence/intelligence.js'
            }
        }
    }).state('app.serviceManage.takeout', { // 企业订餐
        url: 'takeout',
        views: {
            '@': {
                templateUrl: 'serviceManage/takeout/takeout.html',
                controllerUrl: 'serviceManage/takeout/takeout.js'
            }
        }
    }).state('app.serviceManage.lease', {
        url: 'lease',
        views: {
            '@': {
                templateUrl: 'serviceManage/lease/lease.html',
                controllerUrl: 'serviceManage/lease/lease.js'
            }
        }
    }).state('app.serviceManage.apartment', {
        url: 'apartment',
        views: {
            '@': {
                templateUrl: 'serviceManage/apartment/apartment.html',
                controllerUrl: 'serviceManage/apartment/apartment.js'
            }
        }
    }).state('app.sServiceManage', { // 基础物业服务（小Boss）
        url: 'app/sServiceManage/',
        abstract: true,
        templateUrl: 'sServiceManage/repair/repair.html'
    }).state('app.sServiceManage.repair', {
        url: 'repair',
        views: {
            '@': {
                templateUrl: 'sServiceManage/repair/repair.html',
                controllerUrl: 'sServiceManage/repair/repair.js'
            }
        }
    }).state('app.sServiceManage.bill', { // 账单服务
        url: 'bill',
        views: {
            '@': {
                templateUrl: 'sServiceManage/bill/bill.html',
                controllerUrl: 'sServiceManage/bill/bill.js'
            }
        }
    }).state('app.operationManage', { // 运营管理
        url: 'app/operationManage/',
        abstract: true,
        templateUrl: 'operationManage/ad/ad.html'
    }).state('app.operationManage.ad', {
        url: 'ad',
        views: {
            '@': {
                templateUrl: 'operationManage/ad/ad.html',
                controllerUrl: 'operationManage/ad/ad.js'
            }
        }
    }).state('app.operationManage.survey', {
        url: 'survey',
        views: {
            '@': {
                templateUrl: 'operationManage/survey/survey.html',
                controllerUrl: 'operationManage/survey/survey.js'
            }
        }
    }).state('app.operationManage.survey.Operation', {
        url: '/Operation/{subjectId}',
        views: {
            '@': {
                templateUrl: 'operationManage/survey/surveyOperation.html',
                controllerUrl: 'operationManage/survey/surveyOperation.js'
            }
        }
    }).state('app.basicData', { // 基础资料
        url: 'app/basicData/',
        abstract: true,
        templateUrl: 'basicData/park/park.html'
    }).state('app.basicData.park', {
        url: 'park',
        views: {
            '@': {
                templateUrl: 'basicData/park/park.html',
                controllerUrl: 'basicData/park/park.js'
            }
        }
    }).state('app.basicData.company', {
        url: 'company',
        views: {
            '@': {
                templateUrl: 'basicData/company/company.html',
                controllerUrl: 'basicData/company/company.js'
            }
        }
    }).state('app.basicData.supplier', {
        url: 'supplier',
        views: {
            '@': {
                templateUrl: 'basicData/supplier/supplier.html',
                controllerUrl: 'basicData/supplier/supplier.js'
            }
        }
    }).state('app.basicData.sCompany', {
        url: 'sCompany',
        views: {
            '@': {
                templateUrl: 'basicData/sCompany/sCompany.html',
                controllerUrl: 'basicData/sCompany/sCompany.js'
            }
        }
    }).state('app.basicData.sEstateUser', {
        url: 'sEstateUser',
        views: {
            '@': {
                templateUrl: 'basicData/sEstateUser/sEstateUser.html',
                controllerUrl: 'basicData/sEstateUser/sEstateUser.js'
            }
        }
    }).state('app.authors', { //权限管理
        url: 'app/authors/',
        abstract: true,
        templateUrl: 'authorsManager/home.html'
    }).state('app.authors.home', {
        url: 'home',
        views: {
            '@': {
                templateUrl: 'authorsManager/home.html'
            }
        }
    }).state('app.authors.dept', {
        url: 'dept',
        views: {
            '@': {
                templateUrl: 'authorsManager/dept/dept.html',
                controllerUrl: 'authorsManager/dept/dept.js'
            }
        }
    }).state('app.authors.parkUser', {
        url: 'parkUser',
        views: {
            '@': {
                templateUrl: 'authorsManager/user/parkUser.html',
                controllerUrl: 'authorsManager/user/parkUser.js'
            }
        }
    }).state('app.authors.enterpriseUser', {
        url: 'enterpriseUser',
        views: {
            '@': {
                templateUrl: 'authorsManager/user/enterpriseUser.html',
                controllerUrl: 'authorsManager/user/enterpriseUser.js'
            }
        }
    }).state('app.authors.companyUser', {
        url: 'companyUser',
        views: {
            '@': {
                templateUrl: 'authorsManager/user/companyUser.html',
                controllerUrl: 'authorsManager/user/companyUser.js'
            }
        }
    }).state('app.authors.role', {
        url: 'role',
        views: {
            '@': {
                templateUrl: 'authorsManager/role/role.html',
                controllerUrl: 'authorsManager/role/role.js'
            }
        }
    }).state('app.authors.role.roleUsers', {
        url: '/roleUsers/{roleId}',
        views: {
            '@': {
                templateUrl: 'authorsManager/role/roleUsers.html',
                controllerUrl: 'authorsManager/role/roleUsers.js'
            }
        }
    }).state('app.authors.role.roleMenu', {
        url: '/roleMenu/{roleId}',
        views: {
            '@': {
                templateUrl: 'authorsManager/role/roleMenu.html',
                controllerUrl: 'authorsManager/role/roleMenu.js'
            }
        }
    }).state('app.authors.userFeedback', {
        url: 'userFeedback',
        views: {
            '@': {
                templateUrl: 'authorsManager/userFeedback/userFeedback.html',
                controllerUrl: 'authorsManager/userFeedback/userFeedback.js'
            }
        }
    }).state('app.authors.messageManager', {
        url: 'messageManager',
        views: {
            '@': {
                templateUrl: 'authorsManager/message/message.html',
                controllerUrl: 'authorsManager/message/message.js'
            }
        }
    }).state('app.wuyeService', { // 基础物业服务
        url: 'app/wuyeService/',
        abstract: true,
        templateUrl: 'wuyeService/eqtAccount/accountList.html'
    }).state('app.wuyeService.accountList', {
        url: 'accountList',
        views: {
            '@': {
                templateUrl: 'wuyeService/eqtAccount/accountList.html',
                controllerUrl: 'wuyeService/eqtAccount/accountList.js'
            }
        }
    }).state('app.wuyeService.allEquipment', {
        url: 'allEquipment',
        views: {
            '@': {
                templateUrl: 'wuyeService/eqtAccount/allEquipment.html',
                controllerUrl: 'wuyeService/eqtAccount/allEquipment.js'
            }
        }
    }).state('app.wuyeService.assignTracking', {
        url: 'assignTracking',
        views: {
            '@': {
                templateUrl: 'wuyeService/orderManage/assignTracking.html',
                controllerUrl: 'wuyeService/orderManage/assignTracking.js'
            }
        }
    }).state('app.wuyeService.orderSet', {
        url: 'orderSet',
        views: {
            '@': {
                templateUrl: 'wuyeService/orderManage/orderSet.html',
                controllerUrl: 'wuyeService/orderManage/orderSet.js'
            }
        }
    }).state('app.wuyeService.hydropowerData', {
        url: 'hydropowerData',
        views: {
            '@': {
                templateUrl: 'wuyeService/costManage/hydropowerData.html',
                controllerUrl: 'wuyeService/costManage/hydropowerData.js'
            }
        }
    }).state('app.wuyeService.costStatistics', {
        url: 'costStatistics',
        views: {
            '@': {
                templateUrl: 'wuyeService/costManage/costStatistics.html',
                controllerUrl: 'wuyeService/costManage/costStatistics.js'
            }
        }
    }).state('app.wuyeService.billingManage', {
        url: 'billingManage',
        views: {
            '@': {
                templateUrl: 'wuyeService/costManage/billingManage.html',
                controllerUrl: 'wuyeService/costManage/billingManage.js'
            }
        }
    }).state('app.wuyeService.others', {
        url: 'others',
        views: {
            '@': {
                templateUrl: 'wuyeService/costManage/others.html',
                controllerUrl: 'wuyeService/costManage/others.js'
            }
        }
    }).state('app.wuyeService.decorateProcess', {
        url: 'decorateProcess',
        views: {
            '@': {
                templateUrl: 'wuyeService/decorateManage/decorateProcess.html',
                controllerUrl: 'wuyeService/decorateManage/decorateProcess.js'
            }
        }
    }).state('app.wuyeService.parkSet', {
        url: 'parkSet',
        views: {
            '@': {
                templateUrl: 'wuyeService/parkService/parkSet.html',
                controllerUrl: 'wuyeService/parkService/parkSet.js'
            }
        }
    }).state('app.wuyeService.serviceApplicate', {
        url: 'serviceApplicate',
        views: {
            '@': {
                templateUrl: 'wuyeService/incubateService/serviceApplicate.html',
                controllerUrl: 'wuyeService/incubateService/serviceApplicate.js'
            }
        }
    }).state('app.wuyeService.serviceSet', {
        url: 'serviceSet',
        views: {
            '@': {
                templateUrl: 'wuyeService/incubateService/serviceSet.html',
                controllerUrl: 'wuyeService/incubateService/serviceSet.js'
            }
        }
    }).state('app.cusService', { // 客服服务
        url: 'app/cusService/',
        abstract: true,
        templateUrl: 'cusService/cusManage/cusInfoManage.html'
    }).state('app.cusService.cusInfoManage', {
        url: 'cusInfoManage',
        views: {
            '@': {
                templateUrl: 'cusService/cusManage/cusInfoManage.html',
                controllerUrl: 'cusService/cusManage/cusInfoManage.js'
            }
        }
    }).state('app.cusService.cusInfoView', {
        url: 'cusInfoManage/cusInfoView/{memberId}',
        views: {
            '@': {
                templateUrl: 'cusService/cusManage/cusInfoView.html',
                controllerUrl: 'cusService/cusManage/cusInfoView.js'
            }
        }
    }).state('app.cusService.cusCateSet', {
        url: 'cusCateSet',
        views: {
            '@': {
                templateUrl: 'cusService/cusManage/cusCateSet.html',
                controllerUrl: 'cusService/cusManage/cusCateSet.js'
            }
        }
    }).state('app.cusService.noticeInfo', {
        url: 'noticeInfo',
        views: {
            '@': {
                templateUrl: 'cusService/notice/noticeInfo.html',
                controllerUrl: 'cusService/notice/noticeInfo.js'
            }
        }
    // 客服服务 End
    }).state('app.systemSetting', { // 系统设置
        url: 'app/systemSetting/',
        abstract: true,
        templateUrl: 'systemSetting/basicData/organization.html'
    }).state('app.systemSetting.organization', {
        url: 'organization',
        views: {
            '@': {
                templateUrl: 'systemSetting/basicData/organization.html',
                controllerUrl: 'systemSetting/basicData/organization.js'
            }
        }
    }).state('app.systemSetting.employeeManage', {
        url: 'employeeManage',
        views: {
            '@': {
                templateUrl: 'systemSetting/basicData/userManage.html',
                controllerUrl: 'systemSetting/basicData/userManage.js'
            }
        }
    }).state('app.systemSetting.realEstate', {
        url: 'realEstate',
        views: {
            '@': {
                templateUrl: 'systemSetting/basicData/realEstate.html',
                controllerUrl: 'systemSetting/basicData/realEstate.js'
            }
        }
    }).state('app.systemSetting.systemUser', {
        url: 'systemUser',
        views: {
            '@': {
                templateUrl: 'systemSetting/sysUserManage/systemUser.html',
                controllerUrl: 'systemSetting/sysUserManage/systemUser.js'
            }
        }
    }).state('app.systemSetting.roleManage', {
        url: 'roleManage',
        views: {
            '@': {
                templateUrl: 'systemSetting/sysUserManage/roleManage.html',
                controllerUrl: 'systemSetting/sysUserManage/roleManage.js'
            }
        }
    }).state('app.systemSetting.roleManage.roleUsers', {
        url: '/roleUsers/{roleId}',
        views: {
            '@': {
                templateUrl: 'systemSetting/sysUserManage/roleUsers.html',
                controllerUrl: 'systemSetting/sysUserManage/roleUsers.js'
            }
        }
    }).state('app.systemSetting.roleManage.roleMenu', {
        url: '/roleMenu/{roleId}',
        views: {
            '@': {
                templateUrl: 'systemSetting/sysUserManage/roleMenu.html',
                controllerUrl: 'systemSetting/sysUserManage/roleMenu.js'
            }
        }
    }).state('app.systemSetting.appUser', {
        url: 'appUser',
        views: {
            '@': {
                templateUrl: 'systemSetting/appUserManage/appUser.html',
                controllerUrl: 'systemSetting/appUserManage/appUser.js'
            }
        }
    }).state('app.systemSetting.feedback', {
        url: 'feedback',
        views: {
            '@': {
                templateUrl: 'systemSetting/appUserManage/feedback.html',
                controllerUrl: 'systemSetting/appUserManage/feedback.js'
            }
        }
    }).state('app.systemSetting.certificatAudit', {
        url: 'certificatAudit',
        views: {
            '@': {
                templateUrl: 'systemSetting/appUserManage/certificatAudit.html',
                controllerUrl: 'systemSetting/appUserManage/certificatAudit.js'
            }
        }
    }).state('app.systemSetting.appAds', {
        url: 'appAds',
        views: {
            '@': {
                templateUrl: 'systemSetting/adsManage/appAds.html',
                controllerUrl: 'systemSetting/adsManage/appAds.js'
            }
        }
     // 系统设置 End
    }).state('app.systemSetting.pointRules', {
        url: 'pointRules',
        views: {
            '@': {
                templateUrl: 'systemSetting/pointRules/pointRules.html',
                controllerUrl: 'systemSetting/pointRules/pointRules.js'
            }
        }
    }).state('app.systemSetting.attendance', {
        url: 'attendance',
        views: {
            '@': {
                templateUrl: 'systemSetting/attendance/attendance.html',
                controllerUrl: 'systemSetting/attendance/attendance.js'
            }
        }
    }).state('app.systemSetting.attendance.companySetting', {
        url: '/companySetting/{parkId}/{parkName}',
        views: {
            '@': {
                templateUrl: 'systemSetting/attendance/companySetting.html',
                controllerUrl: 'systemSetting/attendance/companySetting.js'
            }
        }
    }).state('app.systemSetting.serviceTimeout', {
        url: 'serviceTimeout',
        views: {
            '@': {
                templateUrl: 'systemSetting/serviceTimeout/serviceTimeout.html',
                controllerUrl: 'systemSetting/serviceTimeout/serviceTimeout.js'
            }
        }
    }).state('app.systemSetting.zoneSetting', { // 园区设置
        url: 'zoneSetting',
        abstruct: true,
        views: {
            '@': {
                templateUrl: 'systemSetting/zoneSetting/repairSetting.html',
                controllerUrl: 'systemSetting/zoneSetting/repairSetting.js'
            }
        }
    }).state('app.systemSetting.repairSetting', {
        url: 'repairSetting',
        views: {
            '@': {
                templateUrl: 'systemSetting/zoneSetting/repairSetting.html',
                controllerUrl: 'systemSetting/zoneSetting/repairSetting.js'
            }
        }
    }).state('app.systemSetting.sRepairSetting', {
        url: 'sRepairSetting',
        views: {
            '@': {
                templateUrl: 'systemSetting/sParkSetting/repairSetting.html',
                controllerUrl: 'systemSetting/sParkSetting/repairSetting.js'
            }
        }
    }).state('app.systemSetting.repairSetting.detail', {
        url: '/detail/{parkId}',
        views: {
            '@': {
                templateUrl: 'systemSetting/zoneSetting/repairSettingDetail.html',
                controllerUrl: 'systemSetting/zoneSetting/repairSettingDetail.js'
            }
        }
    }).state('app.systemSetting.billSetting', {
        url: 'billSetting',
        views: {
            '@': {
                templateUrl: 'systemSetting/zoneSetting/billSetting.html',
                controllerUrl: 'systemSetting/zoneSetting/billSetting.js'
            }
        }
    }).state('app.systemSetting.billSetting.detail', {
        url: '/detail/{parkId}',
        views: {
            '@': {
                templateUrl: 'systemSetting/zoneSetting/billSettingDetail.html',
                controllerUrl: 'systemSetting/zoneSetting/billSettingDetail.js'
            }
        }
    }).state('app.systemSetting.settledSetting', {
        url: 'settledSetting',
        views: {
            '@': {
                templateUrl: 'systemSetting/zoneSetting/settledSetting.html',
                controllerUrl: 'systemSetting/zoneSetting/settledSetting.js'
            }
        }
    }).state('app.systemSetting.sSettledSetting', {  // 小 s 开头的为小 Boss 功能
        url: 'sSettledSetting',
        views: {
            '@': {
                templateUrl: 'systemSetting/sParkSetting/settledSetting.html',
                controllerUrl: 'systemSetting/sParkSetting/settledSetting.js'
            }
        }
    }).state('app.systemSetting.sBillSetting', {
        url: 'sBillSetting',
        views: {
            '@': {
                templateUrl: 'systemSetting/sParkSetting/billSetting.html',
                controllerUrl: 'systemSetting/sParkSetting/billSetting.js'
            }
        }
    }).state('app.systemSetting.parkingSetting', {
        url: 'parkingSetting',
        views: {
            '@': {
                templateUrl: 'systemSetting/zoneSetting/parkingSetting.html',
                controllerUrl: 'systemSetting/zoneSetting/parkingSetting.js'
            }
        }
    })

    return {
        init: function () {
            getRoleData(function () {
                avalon.history.start({
                    fireAnchor: false
                });
                avalon.scan();
            });
        },
        loginOut: function () {
            root.loginOut();
        }
    }
})
