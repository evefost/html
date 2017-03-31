/**
 * 站点配置文件 author -->TopFEer:ajser -- dengpei  Create Date: 2017-03-8
 */
(function (window) {
    window.configData = {
        currentEnv: 'pro',//dev or pro
        environment: {
            dev: {
                assetCDNUrl: 'http://assets.xdaozwg.com/resource',
                webSiteUrl: location.origin + '' ///xdaozwg-main-boss/src/main/webapp
            },
            pro: {
                assetCDNUrl: "http://assets.xdaozwg.com/resource",
                webSiteUrl: location.origin + ''
            }
        },
        apiUrl: {
            dev: {
                loginOut: '../../webapp/login.html',
                commonUploadFile: 'testData/uploadFile.json',
                queryParkByName:'testData/queryParkByName.json',
                queryAllPark:'testData/queryAllPark.json',
                changePassword: 'testData/doneOk.json',
                zoneData: {
                    zoneList: 'testData/zoneData.json'
                },
                //基础物业服务
                wuyeService:{
                    //帐台设置
                    eqtAccount:{
                        //账台目录
                        eqtListBig:'testData/eqtListBig.json',
                        eqtEditBig:'testData/doneOk.json',
                        eqtAddBig:'testData/doneOk.json',
                        eqtDelBig:'testData/doneOk.json',
                        //设备子类
                        eqtListSmall:'testData/eqtListSmall.json',
                        eqtEditSmall:'testData/doneOk.json',
                        eqtAddSmall:'testData/doneOk.json',
                        eqtDelSmall:'testData/doneOk.json'
                    },
                    //工单管理
                    orderManage:{
                        customerOrderList:'testData/orderManager.json',
                        getCustomerInfoByPhone:'testData/getCustomerInfoByPhone.json',
                        //客服接单
                        orderReceive:'testData/doneOk.json',
                        // 修改工单
                        customerOrderEdit:'testData/doneOk.json',
                        // 新增工单
                        customerOrderAdd:'testData/doneOk.json',
                        // 查询当前工单
                        getCustomerOrder:'testData/getOrderManager.json',
                        // 查询当前工单任务记录
                        getOrderTask:'',
                        // 派单或转派
                        transferOrderTask:'testData/doneOk.json',
                        // 选择经纪人列表
                        selectBrokerList:'testData/user.json',
                        orderCancel:'testData/doneOk.json'
                    },
                    //费用管理
                    costManage:{

                    },
                    //装修管理
                    decorateManage:{

                    },
                    //停车服务
                    parkService:{

                    },
                    //孵化服务
                    incubateService:{

                    }

                },
                //客户服务
                cusSever:{
                    //客户管理
                    cusManage:{
											  cusInfoManageList:'testData/cusInfoManageList.json',
												cusInfoEdit:'testData/doneOk.json',
												cusInfoAdd:'testData/doneOk.json',
												cusInfoDel:'testData/doneError.json',
												resetUserPassword:'testData/doneOk.json',
												queryParkByName: 'testData/queryParkByName.json',
                        cusInfoManage:'testData/message.json',
                        cusCateSet:'testData/doneOk.json'
                    },
                    //通知公告
                    notice:{
                        noticeInfo:'testData/noticeInfo.json',
                        messageList:'testData/messageList.json',
                        messageEdit:'testData/doneOk.json',
                        messageAdd:'testData/doneOk.json',
                        messageDel:'testData/doneError.json',
                        getMessageInfo:'testData/messageDetail.json',
                        messageIsTop:'testData/doneOk.json',
                        publishMessage:'testData/doneOk.json'
                    },
                    noticeType:{
                        messageTypeList:'testData/messageTypeList.json',
                        messageTypeEdit:'testData/doneOk.json',
                        messageTypeAdd:'testData/doneOk.json',
                        messageTypeDel:'testData/doneError.json',
                        messageTypeIsInUse:'testData/doneOk.json',
                    }
                },
                //系统设置
                systemSet:{
                    //基础资料
                    basic:{
                        //组织机构 + 人员管理 + 楼盘库
                        deptList:'testData/organizationList.json',
                        deptEdit:'testData/doneOk.json',
                        deptAdd:'testData/doneOk.json',
                        deptDel:'testData/doneError.json',
                        //  人员管理
                        userManageList:'testData/userManageList.json',
                        userEdit:'testData/doneOk.json',
                        userAdd:'testData/doneOk.json',
                        userDel:'testData/doneError.json',
                        resetUserPassword:'testData/doneOk.json',
                        // 人员管理--资料导入导出
                        billList: 'testData/bill.json',
                        billDel:'testData/doneOk.json',
                        getBill: 'testData/getBill.json',
                        uploadBill:'testData/importBill.json',
                        downloadTemplateBill:'testData/template.xlsx',
                        exportBill:'testData/template.xlsx'

                    },
                    //系统用户管理
                    sysUser:{
                        //系统用户
                        sRoleList: 'testData/roleList.json',
                        userManageList:'testData/sysUserManageList.json',
                        userEdit:'testData/doneOk.json',
                        userAdd:'testData/doneOk.json',
                        userDel:'testData/doneError.json',
                        resetUserPassword:'testData/doneOk.json',
                        enableParkUser: 'testData/doneOk.json',
                        disenableParkUser: 'testData/doneOk.json',
                        queryParkByName: 'testData/queryParkByName.json',
                        //角色管理
                        roleManageList:'testData/roleUserManageList.json',
                        userEdit:'testData/doneOk.json',
                        userAdd:'testData/doneOk.json',
                        userDel:'testData/doneError.json',
                        resetUserPassword:'testData/doneOk.json'

                    },
                    //App用户管理
                    //  app广告管理
                    appAds:{
                        adsManageList:'testData/adsManageList.json',
                        adsManageEdit:'testData/doneOk.json',
                        adsManageAdd:'testData/doneOk.json',
                        adsManageDel:'testData/doneError.json',
                        getAdsManage:'testData/getAdsManage.json'
                    }
                },
                ///用户管理
                user: {
                    //园区用户
                    parkUserList: 'testData/parkUser.json',
                    parkUserEdit: 'testData/doneOk.json',
                    parkUserAdd: 'testData/doneOk.json',
                    parkUserDel: 'testData/doneError.json',
                    enableParkUser: 'testData/doneOk.json',
                    disenableParkUser: 'testData/doneOk.json',
                    resetParkUserPassword: 'testData/doneOk.json',
                    queryParkByName: 'testData/queryParkByName.json',
                    //企业用户
                    enterpriseUserList: 'testData/enterpriseUser.json',
                    enterpriseUserAudit: 'testData/doneOk.json',
                    enableEnterpriseUser: 'testData/doneOk.json',
                    disenableEnterpriseUser: 'testData/doneOk.json',
                    //我司用户
                    companyUserList: 'testData/companyUser.json',
                    companyUserEdit: 'testData/doneOk.json',
                    companyUserAdd: 'testData/doneOk.json',
                    companyUserDel: 'testData/doneError.json',
                    enableCompanyUser: 'testData/doneOk.json',
                    disenableCompanyUser: 'testData/doneOk.json',
                    resetCompanyUserPassword: 'testData/doneOk.json'
                },
                role: {
                    roleList: 'testData/role.json',
                    roleEdit: 'testData/doneOk.json',
                    roleAdd: 'testData/doneOk.json',
                    roleDel: 'testData/doneError.json',
                    enableRole: 'testData/doneError.json',
                    disEnableRole: 'testData/doneError.json'
                },
                roleMenu: {
                    roleMenuList: 'testData/roleMenu.json',
                    roleMenuEdit: 'testData/doneOk.json'
                },
                roleUsers: {
                    roleUsersList: 'testData/roleUsers.json',
                    roleUsersEdit: 'testData/doneOk.json'
                },
                constantManager: {
                    constantList: "testData/constantList.json",
                    constantAdd: "testData/doneOk.json",
                    constantEdit: "testData/doneOk.json",
                    constantDel: "testData/doneError.json"
                },
                // 我的工作台
                overview: {
                    grossData: 'testData/grossOverviewData.json',
                    chartLine: 'testData/chartLine.json',
                    chartPie: 'testData/chartPie.json',
                    chartBar: 'testData/chartBar.json'
                },
                // 积分规则
                pointRules: {
                    getRules: 'testData/getPointRules.json',
                    saveRules: 'testData/doneOk.json'
                },
                // 园区服务超时设置
                timeoutConfig: {
                    getConfig: 'testData/timeoutConfig.json',
                    saveConfig: 'testData/doneOk.json'
                },
                // 维修服务
                repairService: {
                    parkOrderList: 'testData/repairOrderListPark.json',
                    handlerList: 'testData/handlerList.json',
                    orderSend: 'testData/doneOk.json',
                    orderReceive: 'testData/doneOk.json',
                    orderReturn: 'testData/doneOk.json',
                    getTrackingInfo: 'testData/parkTrackingInfo.json',
                    orderFeedback: 'testData/doneOk.json',
                    newOrder: 'testData/doneOk.json',
                    exportOrder: 'testData/repairOrderExport.json',
                    getParkServiceList: 'testData/getParkServiceList.json',
                    getCompanyByParkId: 'testData/getCompanyByParkId.json',
                    
                    supplierOrderList: 'testData/repairOrderListSupplier.json',
                    orderReceiveSupplier: 'testData/doneOk.json',
                    getTrackingInfoSupplier: 'testData/parkTrackingInfo.json',
                    orderFeedbackSupplier: 'testData/doneOk.json',
                    sNewOrder: 'testData/doneOk.json',
                    getSupplierList: 'testData/getSupplierList.json',
                    getSupplierServiceList: 'testData/getSupplierServiceList.json',

                    getCompanyByName: 'testData/getCompanyByName.json'
                },
                // 维修服务（小Boss）
                sRepairService: {
                    parkOrderList: 'testData/repairOrderListPark.json',
                    handlerList: 'testData/handlerList.json',
                    orderSend: 'testData/doneOk.json',
                    orderReceive: 'testData/doneOk.json',
                    orderReturn: 'testData/doneOk.json',
                    getTrackingInfo: 'testData/parkTrackingInfo.json',
                    orderFeedback: 'testData/doneOk.json',
                    newOrder: 'testData/doneOk.json',
                    exportOrder: 'testData/repairOrderExport.json',
                    getParkServiceList: 'testData/getParkServiceList.json',
                    getCompanyByParkId: 'testData/getCompanyByParkId.json',

                    supplierOrderList: 'testData/repairOrderListSupplier.json',
                    orderReceiveSupplier: 'testData/doneOk.json',
                    getTrackingInfoSupplier: 'testData/parkTrackingInfo.json',
                    orderFeedbackSupplier: 'testData/doneOk.json',
                    sNewOrder: 'testData/doneOk.json',
                    getSupplierList: 'testData/getSupplierList.json',
                    getSupplierServiceList: 'testData/getSupplierServiceList.json',

                    getCompanyByName: 'testData/sGetCompanyByName.json'
                },
                // 基础资料
                basicData: {
                    // 我司后台
                    parkList: 'testData/parkList.json',
                    parkAdd: 'testData/doneOk.json',
                    parkEdit: 'testData/doneOk.json',
                    parkDetail: 'testData/parkDetail.json',
                    parkEnable: 'testData/doneOk.json',
                    parkDisable: 'testData/doneOk.json',
                    parkDelete: 'testData/doneError.json',
                    parkIndustry: 'testData/parkIndustry.json',
                   
                    companyList: 'testData/companyList.json',
                    companyAdd: 'testData/doneOk.json',
                    companyEdit: 'testData/doneOk.json',
                    companyDetail: 'testData/companyDetail.json',
                    companyEnable: 'testData/doneOk.json',
                    companyDisable: 'testData/doneOk.json',
                    companyDelete: 'testData/doneError.json',
                    companyIndustry: 'testData/companyIndustry.json',
                   
                    supplierList: 'testData/supplierList.json',
                    supplierAdd: 'testData/doneOk.json',
                    supplierEdit: 'testData/doneOk.json',
                    supplierDetail: 'testData/supplierDetail.json',
                    supplierEnable: 'testData/doneOk.json',
                    supplierDisable: 'testData/doneOk.json',
                    supplierDelete: 'testData/doneError.json',

                    // 园区后台
                    sCompanyList: 'testData/sCompanyList.json',
                    sCompanyAdd: 'testData/doneOk.json',
                    sCompanyEdit: 'testData/doneOk.json',
                    sCompanyDelete: 'testData/doneError.json',
                    sCompanyIndustry: 'testData/companyIndustry.json',

                    sEstateUserList: 'testData/estateUsers.json',
                    sEstateUserAdd: 'testData/doneOk.json',
                    sEstateUserEdit: 'testData/doneOk.json',
                    sEstateUserDelete: 'testData/doneError.json',
                    sEstateUserEnable: 'testData/doneOk.json',
                    sEstateUserDisable: 'testData/doneOk.json',
                    sRoleList: 'testData/roleList.json',

                    industrySet: 'testData/industrySet.json',
                    regionList: 'testData/regionList.json'
                },
                // 运营管理 - 广告管理
                adManagement: {
                    adList: 'testData/adList.json',
                    adAdd: 'testData/doneOk.json',
                    adEdit: 'testData/doneOk.json',
                    adDelete: 'testData/doneError.json',
                    adPutOn: 'testData/doneOk.json',
                    adPutOff: 'testData/doneOk.json'
                },
                // 运营管理 - 问卷调查
                surveyManagement: {
                    surveyList: 'testData/surveyList.json',
                    surveyAdd: 'testData/doneOk.json',
                    surveyDelete: 'testData/doneError.json',
                    surveyUpdate: 'testData/doneOk.json',
                    topicAdd: 'testData/doneOk.json',
                    topicDelete: 'testData/doneError.json',
                    surveyDetail: 'testData/surveyDetail.json',
                    switchStatus: 'testData/doneOk.json',
                },
                // 考勤设置
                attendance: {
                    getDefaultConfig: 'testData/defaultAttendanceConfig.json',
                    setDefaultConfig: 'testData/doneOk.json',
                    getParks: 'testData/allParks.json',
                    getCompanys: 'testData/companysInPark.json',

                    getParkConfigList: 'testData/parkAttendanceConfigList.json',
                    addParkConfig: 'testData/doneOk.json',
                    updateParkConfig: 'testData/doneOk.json',
                    deleteParkConfig: 'testData/doneError.json',
                    enableParkConfig: 'testData/doneOk.json',
                    disableParkConfig: 'testData/doneOk.json',

                    getCompanyConfigList: 'testData/companyAttendanceConfigList.json',
                    addCompanyConfig: 'testData/doneOk.json',
                    updateCompanyConfig: 'testData/doneOk.json',
                    deleteCompanyConfig: 'testData/doneError.json',
                    enableCompanyConfig: 'testData/doneOk.json',
                    disableCompanyConfig: 'testData/doneOk.json'
                },
                // 园区设置 - 维修设置
                repairSetting: {
                    repairList: 'testData/repairSettingList.json',
                    repairDetail: 'testData/repairSettingDetail.json',
                    serviceList: 'testData/repairServiceList.json',
                    saveContent: 'testData/doneOk.json', // 保存维修服务简介
                    startOrStop: 'testData/doneOk.json',
                    saveService: 'testData/doneOk.json', // 新增或保存服务种类
                    supplierList: 'testData/repairSupplierList.json'
                },
                // 园区设置 - 维修设置（小Boss）
                sRepairSetting: {
                    repairList: 'testData/repairSettingList.json',
                    repairDetail: 'testData/repairSettingDetail.json',
                    serviceList: 'testData/repairServiceList.json',
                    saveContent: 'testData/doneOk.json', // 保存维修服务简介
                    startOrStop: 'testData/doneOk.json',
                    saveService: 'testData/doneOk.json', // 新增或保存服务种类
                },
                // 园区设置 - 入驻公告设置
                settledSetting: {
                    settledList: 'testData/settledSettingList.json',
                    settledEdit: 'testData/doneOk.json',
                    sSettledGet: 'testData/settledDetail.json', // 获取小 Boss 园区入驻信息
                    sSettledSave: 'testData/doneOk.json' // 设置小 Boss 入驻信息，接口同 settledEdit
                },
                // 园区设置 - 账单模板
                billTempl: {
                    parkList: 'testData/billTemplParks.json',
                    templDetail: 'testData/billTemplDetail.json',
                    switchStatus: 'testData/doneOk.json',
                    saveNode: 'testData/doneOk.json',
                    sortColumn: 'testData/doneOk.json',
                    exportBill:'/xdaozwg-main-boss/src/main/webapp/app/testData/anothertemplate.xlsx'
                },
                // 园区设置 - 账单模板（小Boss）
                sBillTempl: {
                    parkList: 'testData/billTemplParks.json',
                    templDetail: 'testData/billTemplDetail.json',
                    switchStatus: 'testData/doneOk.json',
                    saveNode: 'testData/doneOk.json',
                    sortColumn: 'testData/doneOk.json',
                    exportBill:'/xdaozwg-main-boss/src/main/webapp/app/testData/anothertemplate.xlsx'
                },
                // 考勤管理
                decorationManage: {
                    decorationManageList: 'testData/decorationManage.json',
                    exportDecorationManage:'/xdaozwg-main-boss/src/main/webapp/app/testData/template.xlsx'
                },
                // 账单服务
                bill: {
                    billList: 'testData/bill.json',
                    billDel:'testData/doneOk.json',
                    getBill: 'testData/getBill.json',
                    uploadBill:'testData/importBill.json',
                    downloadTemplateBill:'/xdaozwg-main-boss/src/main/webapp/app/testData/template.xlsx',
                    exportBill:'/xdaozwg-main-boss/src/main/webapp/app/testData/template.xlsx'
                },
                // 账单服务 - 小 Boss
                sBill: {
                    billList: 'testData/bill.json',
                    billDel:'testData/doneOk.json',
                    getBill: 'testData/getBill.json',
                    uploadBill:'testData/importBill.json',
                    downloadTemplateBill:'/xdaozwg-main-boss/src/main/webapp/app/testData/template.xlsx',
                    exportBill:'/xdaozwg-main-boss/src/main/webapp/app/testData/template.xlsx'
                },
                // 用户反馈
                userFeedback: {
                    userFeedbackList: 'testData/userFeedback.json'
                },
                //消息管理
                message:{
                    messageList:'testData/message.json',
                    messageAdd:'testData/doneOk.json'
                }
            },
            
            //-------------------------------------------------------------pro-------------------------------------------------------------------
            pro: {
                loginOut: '/logout.html',
                commonUploadFile: '/common/uploadImageFile.jhtml',
                queryParkByName:'/customermgt/getIntelligentParkList.jhtml',
                queryAllPark:'/systemMgt/allParks.jhtml',
                changePassword: '/userMgt/changePwd.jhtml',
                zoneData: {
                    zoneList: 'testData/zoneData.json'
                },
                // 我的工作台
                overview: {
                    grossData: '/workspace/workspace/commonMessage.jhtml',
                    chartLine: '/workspace/workspace/getChartData.jhtml',
                    chartPie: '/workspace/workspace/getChartData.jhtml',
                    chartBar: '/workspace/workspace/getChartData.jhtml'
                },
                //系统设置
                user: {
                    //园区用户
                    parkUserList:'/parkUserMg/query.jhtml',
                    parkUserEdit:'/parkUserMg/update.jhtml',
                    parkUserAdd:'/parkUserMg/add.jhtml',
                    parkUserDel:'/parkUserMg/delete.jhtml',
                    enableParkUser:'/parkUserMg/userStatusOn.jhtml',
                    disenableParkUser:'/parkUserMg/userStatusOFF.jhtml',
                    resetParkUserPassword:'testData/doneOk.json',
                    queryParkByName:'/customermgt/getIntelligentParkList.jhtml',
                    //企业用户
                    enterpriseUserList:'/enterpriseUserMsg/query.jhtml',
                    enterpriseUserAudit:'/enterpriseUserMsg/audit.jhtml',
                    enableEnterpriseUser:'/enterpriseUserMsg/updateStatusOn.jhtml',
                    disenableEnterpriseUser:'/enterpriseUserMsg/updateStatusOFF.jhtml',
                    //我司用户
                    companyUserList:'/companyUserMsg/query.jhtml',
                    companyUserEdit:'/companyUserMsg/updateComUser.jhtml',
                    companyUserAdd:'/companyUserMsg/insert.jhtml',
                    companyUserDel:'/companyUserMsg/delete.jhtml',
                    enableCompanyUser:'/companyUserMsg/updateStatusOn.jhtml',
                    disenableCompanyUser:'/companyUserMsg/updateStatusOFF.jhtml',
                    resetCompanyUserPassword:'testData/doneOk.json'
                },
                role: {
                    roleList: '/systemmgt/role/query.jhtml',
                    roleEdit: '/systemmgt/role/update.jhtml',
                    roleAdd: '/systemmgt/role/add.jhtml',
                    roleDel: '/systemmgt/role/delete.jhtml',
                    enableRole: '/systemmgt/role/useStatusOn.jhtml',
                    disEnableRole: '/systemmgt/role/useStatusOff.jhtml'
                },
                roleMenu:{
                    roleMenuList:'/systemmgt/role/findFunctions.jhtml',
                    roleMenuEdit:'/systemmgt/role/authorization.jhtml'
                },
                roleUsers: {
                    roleUsersList: '/roleMgt/listAccount.jhtml',
                    roleUsersEdit: '/roleMgt/editAccount.jhtml'
                },
                constantManager: {
                    constantList: "/constantManagement/query.jhtml",
                    constantAdd: "/constantManagement/add.jhtml",
                    constantEdit: "/constantManagement/edit.jhtml",
                    constantDel: "/constantManagement/del.jhtml"
                },
                // 积分规则
                pointRules: {
                    getRules: '/pointRules/get.jhtml',
                    saveRules: '/pointRules/save.jhtml'
                },
                parkRepairSetting: {
                    parkRepairList: '/sysset/parkRepair/query.jhtml',
                    getIndexMessage: '/sysset/parkRepair/getIndexMessage.jhtml',
                    getParkRepairInfo: '/sysset/parkRepair/getParkRepairInfo.jhtml',
                    findRepairServices: '/sysset/parkRepair/findRepairServices.jhtml',
                    saveContent: '/sysset/parkRepair/saveContent.jhtml',
                    saveRepair: '/sysset/parkRepair/saveRepair.jhtml',
                    startOrStop: '/sysset/parkRepair/startOrStop.jhtml'
                },
                parkBillTemplate: {
                    parkBillTemplateList: '/sysset/parkBill/query.jhtml',
                    findBillTemplates: '/sysset/parkBill/findBillTemplates.jhtml',
                    saveTemplate: '/sysset/parkBill/save.jhtml',
                    startOrStop: '/sysset/parkBill/startOrStop.jhtml',
                    sort: '/sysset/parkBill/sortColumn.jhtml'
                },
                // 园区服务超时设置
                timeoutConfig: {
                    getConfig: '/timeoutConfig/get.jhtml',
                    saveConfig: '/timeoutConfig/save.jhtml'
                },
                // 维修服务
                repairService: {
                    parkOrderList: '/customermgt/repairParkOrdersList.jhtml',
                    handlerList: '/customermgt/getHandlerList.jhtml',
                    orderSend: '/customermgt/submitSendASingle.jhtml',
                    orderReceive: '/customermgt/acceptWorkOrdersOrNot.jhtml',
                    orderReturn: '/customermgt/acceptWorkOrdersOrNot.jhtml',
                    getTrackingInfo: '/customermgt/getOrderProcessLog.jhtml',
                    orderFeedback: '/customermgt/submitFeedBack.jhtml',
                    newOrder: '/customermgt/addParkServiceWorkOrder.jhtml',
                    exportOrder: '/customermgt/exportRepairParkExcel.jhtml',
                    getParkServiceList: '/customermgt/getParkServiceList.jhtml',
                    getCompanyByParkId: '/customermgt/getParkCompanyList.jhtml',
                    
                    supplierOrderList: '/customermgt/repairSupplierOrdersList.jhtml',
                    orderReceiveSupplier: '/customermgt/finishSupplierWorkOrderReceive.jhtml',
                    getTrackingInfoSupplier: '/customermgt/getOrderProcessLog.jhtml',
                    orderFeedbackSupplier: '/customermgt/submitSupplierWorkOrderFeedBack.jhtml',
                    sNewOrder: '/customermgt/addSupplierServiceWorkOrder.jhtml',
                    getSupplierList: '/customermgt/getRepairSupplierList.jhtml',
                    getSupplierServiceList: '/customermgt/getSupplierServiceList.jhtml',

                    getCompanyByName: '/customermgt/getIntelligentCompanyList.jhtml'
                },
                // 维修服务（小Boss）
                sRepairService: {
                    parkOrderList: '/guest/customermgt/repairParkOrdersList.jhtml',
                    handlerList: '/guest/customermgt/getHandlerList.jhtml',
                    orderSend: '/guest/customermgt/submitSendASingle.jhtml',
                    orderReceive: '/guest/customermgt/acceptWorkOrdersOrNot.jhtml',
                    orderReturn: '/guest/customermgt/acceptWorkOrdersOrNot.jhtml',
                    getTrackingInfo: '/guest/customermgt/getOrderProcessLog.jhtml',
                    orderFeedback: '/guest/customermgt/submitFeedBack.jhtml',
                    exportOrder: '/guest/customermgt/exportRepairParkExcel.jhtml',

                    supplierOrderList: '/guest/customermgt/repairSupplierOrdersList.jhtml',
                    orderReceiveSupplier: '/guest/customermgt/finishSupplierWorkOrderReceive.jhtml',
                    getTrackingInfoSupplier: '/guest/customermgt/getOrderProcessLog.jhtml',
                    orderFeedbackSupplier: '/guest/customermgt/submitSupplierWorkOrderFeedBack.jhtml',

                    getCompanyByName: '/guest/customermgt/getCompanyList.jhtml'
                },
                // 基础资料
                basicData: {
                    parkList: '/basicData/listParks.jhtml',
                    parkAdd: '/basicData/addPark.jhtml',
                    parkEdit: '/basicData/editPark.jhtml',
                    parkDetail: '/basicData/parkDetail.jhtml',
                    parkEnable: '/basicData/park/enable.jhtml',
                    parkDisable: '/basicData/park/disable.jhtml',
                    parkDelete: '/basicData/delPark.jhtml',
                    parkIndustry: '/basicData/industry/byParkId.jhtml',

                    companyList: '/basicData/companyList.jhtml',
                    companyAdd: '/basicData/addCompany.jhtml',
                    companyEdit: '/basicData/editCompany.jhtml',
                    companyDetail: '/basicData/companyDetail.jhtml',
                    companyEnable: '/basicData/company/enable.jhtml',
                    companyDisable: '/basicData/company/disable.jhtml',
                    companyDelete: '/basicData/delCompany.jhtml',
                    companyIndustry: '/basicData/industry/byCompanyId.jhtml',

                    supplierList: '/basicData/supplier/query.jhtml',
                    supplierAdd: '/basicData/supplier/add.jhtml',
                    supplierEdit: '/basicData/supplier/edit.jhtml',
                    supplierDetail: '/basicData/supplier/detail.jhtml',
                    supplierEnable: '/basicData/supplier/enable.jhtml',
                    supplierDisable: '/basicData/supplier/disable.jhtml',
                    supplierDelete: '/basicData/supplier/del.jhtml',

                    // 园区后台
                    sCompanyList: '/guest/company/query.jhtml',
                    sCompanyAdd: '/guest/addCompany.jhtml',
                    sCompanyEdit: '/guest/company/edit.jhtml',
                    sCompanyDelete: '/guest/company/del.jhtml',
                    sCompanyIndustry: '/basicData/industry/byCompanyId.jhtml',

                    sEstateUserList: '/guest/estateUser/query.jhtml',
                    sEstateUserAdd: '/guest/estateUser/add.jhtml',
                    sEstateUserEdit: '/guest/estateUser/edit.jhtml',
                    sEstateUserDelete: '/guest/estateUser/del.jhtml',
                    sEstateUserEnable: '/guest/estateUser/enable.jhtml?',
                    sEstateUserDisable: '/guest/estateUser/disable.jhtml?',
                    sRoleList: '/guest/role/list.jhtml',

                    industrySet: '/basicData/industry/all.jhtml',
                    regionList: '/region/list.jhtml',
                },
                // 运营管理 - 广告管理
                adManagement: {
                    adAdd: '/adManage/insert.jhtml',
                    adList:'/adManage/query.jhtml',
                    adEdit:'/adManage/update.jhtml',
                    adDelete: '/adManage/delete.jhtml',
                    adPutOn: '/adManage/putAdOn.jhtml',
                    adPutOff: '/adManage/putAdOff.jhtml',
                },
                // 运营管理 - 问卷调查
                surveyManagement: {
                    surveyList: '/operationmgt/questionnaire/query.jhtml',
                    surveyAdd: '/operationmgt/questionnaire/addSubject.jhtml',
                    surveyDelete: '/operationmgt/questionnaire/delete.jhtml',
                    surveyUpdate: '/operationmgt/questionnaire/updateSubject.jhtml',
                    topicAdd: '/operationmgt/questionnaire/addTopicAndItem.jhtml',
                    topicDelete: '/operationmgt/questionnaire/deleteTopicAndItem.jhtml',
                    surveyDetail: '/operationmgt/questionnaire/details.jhtml',
                    switchStatus: '/operationmgt/questionnaire/onlineStatus.jhtml',
                },
                // 考勤设置
                attendance: {
                    getDefaultConfig: '/punchedInConfig/getDefaultConfig.jhtml',
                    setDefaultConfig: '/punchedInConfig/setDefaultConfig.jhtml',
                    getParks: '/punchedInConfig/getParks.jhtml',
                    getCompanys: '/punchedInConfig/getCompanys.jhtml',

                    getParkConfigList: '/punchedInConfig/getParkPunchedInConfigs.jhtml',
                    addParkConfig: '/punchedInConfig/addParkConfig.jhtml',
                    updateParkConfig: '/punchedInConfig/updateConfig.jhtml',
                    deleteParkConfig: '/punchedInConfig/delConfig.jhtml',
                    enableParkConfig: '/punchedInConfig/setConfigIsEnable.jhtml',
                    disableParkConfig: '/punchedInConfig/setConfigIsEnable.jhtml',

                    getCompanyConfigList: '/punchedInConfig/getCompanyPunchedInConfigs.jhtml',
                    addCompanyConfig: '/punchedInConfig/addCompanyConfig.jhtml',
                    updateCompanyConfig: '/punchedInConfig/updateConfig.jhtml',
                    deleteCompanyConfig: '/punchedInConfig/delConfig.jhtml',
                    enableCompanyConfig: '/punchedInConfig/setConfigIsEnable.jhtml',
                    disableCompanyConfig: '/punchedInConfig/setConfigIsEnable.jhtml',
                },
                // 园区设置 - 维修设置
                repairSetting: {
                    repairList: '/sysset/parkRepair/query.jhtml',
                    repairDetail: '/sysset/parkRepair/getParkRepairInfo.jhtml',
                    serviceList: '/sysset/parkRepair/findRepairServices.jhtml',
                    saveContent: '/sysset/parkRepair/saveContent.jhtml', // 保存维修服务简介
                    startOrStop: '/sysset/parkRepair/startOrStop.jhtml',
                    saveService: '/sysset/parkRepair/saveRepair.jhtml', // 新增或保存服务种类
                    supplierList: '/basicData/findSuppliers.jhtml'
                },
                // 园区设置 - 维修设置（小Boss）
                sRepairSetting: {
                    repairDetail: '/park/sysset/parkRepair/getParkRepairInfo.jhtml',
                    serviceList: '/park/sysset/parkRepair/findRepairServices.jhtml',
                    saveContent: '/sysset/parkRepair/saveContent.jhtml', // 保存维修服务简介
                    startOrStop: '/sysset/parkRepair/startOrStop.jhtml',
                    saveService: '/sysset/parkRepair/saveRepair.jhtml', // 新增或保存服务种类
                },
                // 园区设置 - 入驻公告设置
                settledSetting: {
                    settledList: '/parkNotice/getParkNotices.jhtml',
                    settledEdit: '/parkNotice/setParkNotice.jhtml',
                    sSettledGet: '/parkNotice/view.jhtml',
                    sSettledSave: '/parkNotice/setParkNotice.jhtml'
                },
                // 园区设置 - 账单模板
                billTempl: {
                    parkList: '/sysset/parkBill/query.jhtml',
                    templDetail: '/sysset/parkBill/findBillTemplates.jhtml',
                    switchStatus: '/sysset/parkBill/startOrStop.jhtml',
                    saveNode: '/sysset/parkBill/save.jhtml',
                    sortColumn: '/sysset/parkBill/sortColumn.jhtml',
                    exportBill: '/sysset/loadParkBillTemplate.jhtml'
                },
                // 园区设置 - 账单模板（小Boss）
                sBillTempl: {
                    templDetail: '/park/sysset/parkBill/findBillTemplates.jhtml',
                    switchStatus: '/sysset/parkBill/startOrStop.jhtml',
                    saveNode: '/sysset/parkBill/save.jhtml',
                    sortColumn: '/sysset/parkBill/sortColumn.jhtml',
                    exportBill: '/sysset/loadParkBillTemplate.jhtml'
                },
                //考勤管理
                decorationManage:{
                    decorationManageList:'/customermgt/getInSignList.jhtml',
                    exportDecorationManage:'/customermgt/exportInSignExcel.jhtml'
                },
                
                //账单服务
                bill: {
                    billList: '/customermgt/getParkBillList.jhtml',
                    billDel:'/customermgt/delParkBill.jhtml',
                    getBill: '/customermgt/getParkBillDetail.jhtml',
                    uploadBill:'/customermgt/showParkBillDetailExcel.jhtml',
                    downloadTemplateBill:'/customermgt/loadParkBillTemplate.jhtml',
                    exportBill:'/customermgt/exportParkBillExcel.jhtml'
                },
                // 账单服务 - 小 Boss
                sBill: {
                    billList: '/guest/customermgt/getParkBillList.jhtml',
                    billDel:'/guest/customermgt/delParkBill.jhtml',
                    getBill: '/guest/customermgt/getParkBillDetail.jhtml',
                    uploadBill:'/guest/customermgt/showParkBillDetailExcel.jhtml',
                    downloadTemplateBill:'/guest/customermgt/loadParkBillTemplate.jhtml',
                    exportBill:'/guest/customermgt/exportParkBillExcel.jhtml'
                },
                //用户反馈
                userFeedback:{
                    userFeedbackList:'/systemmgt/feedback/query.jhtml'
                },
                //消息管理
                message:{
                    messageList:'/systemMgt/message/query.jhtml',
                    messageAdd:'/systemMgt/message/add.jhtml'
                }
            }
        }
    }
    window.currentApiUrl = configData.apiUrl[configData.currentEnv];
})(window);

/**
 * 应用程序文件引用
 */
(function(){
    require.config({
        baseUrl: configData.environment[configData.currentEnv].assetCDNUrl,
        urlArgs: "ver="+(new Date()).getTime(),
        paths: {
            'appPath':configData.environment[configData.currentEnv].webSiteUrl + '/app/modules',
            'jquery': 'vendor/jquery/jquery-2.2.0.min',
            'avalon': 'vendor/avalon/avalon.modern',
            'avalon-mmState':'vendor/avalon/mmState',
            'avalon-mmRouter':'vendor/avalon/mmRouter',
            'avalon-mmHistory':'vendor/avalon/mmHistory',
            'avalon-mmPromise':'vendor/avalon/mmPromise',
            'avalon-getModel':'vendor/avalon/avalon.getModel',
            'domReady': 'vendor/require/domReady',
            'moment': 'vendor/moment/moment',
            'jquery.semantic' : 'vendor/jquery/jquery.semantic.min',
            'jquery.colresizable' : 'vendor/jquery/colResizable-1.5.min',
            'jquery.dataTable':'vendor/jquery-dataTable/amazeui.datatables',
            'bootstrap-datetimepicker':'vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
            'bootstrap-datetimepicker.zh-CN':'vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.zh-CN',
            'jquery.ztree':'vendor/ztree/jquery.ztree.all.min',
            'jquery.webuploader':'vendor/webuploader/webuploader.html5only.min',
            'jquery.trumbowyg':'vendor/trumbowyg-2.0.0/trumbowyg.min',
            'jquery.wangeditor': 'vendor/wangEditor/wangEditor.js',
            'sortable':'vendor/sortable/sortable.min',
            'echarts':'vendor/echart/echarts.min',
            'dataChart': 'component/dataChart/component-datachart.js',
            'jqueryAjax':'component/httpService/jqueryAjax',
            'component-message':'component/message/component-message',
            'component-datatable':'component/dataTable/component-datatable',
            'component-datetimerpicker':'component/dateTimePicker/component-datetimerpicker',
            'component-uploader':'component/uploader/component-uploader',
            'component-ztree':'component/ztree/component-ztree',
            'component-wangeditor':'component/richEditor/component-wangeditor'
        },
        //shim是用于将加载那些不符合AMD规范的JS文件
        shim: {
            'jquery.semantic': ['jquery'],
            'jquery.colresizable': ['jquery'],
            'jquery.dataTable': ['jquery'],
            'bootstrap-datetimepicker':['jquery'],
            'bootstrap-datetimepicker.zh-CN':['bootstrap-datetimepicker'],
            'jquery.ztree': ['jquery'],
            'jquery.webuploader': ['jquery'],
            'jquery.wangeditor':{
                //指定依赖项,必须为数组, 不写时默认为空数组,它们会先于被依赖者加载
                deps: ['jquery'],
                exports: 'wangEditor' //指定它的命名空间
            }
        },
        debug:false
    });

    /**
     * 初始化
     */
    require(['jquery','appPath/modules','avalon-getModel','domReady!'], function ($,modules) {
        if(localStorage.getItem('rolesData_wg')!= '' && localStorage.getItem('rolesData_wg')!=null){
            modules.init();
        }else{
            modules.loginOut();
        }
    });
})();


