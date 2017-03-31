/**
 * 站点配置文件 author -->TopFEer:ajser -- dengpei  Create Date: 2017-03-8
 */
(function(window) {

	window.configData = {
		currentEnv: 'pro', //dev or pro
		environment: {
			dev: {
				assetCDNUrl: '../resource',
				webSiteUrl: location.origin + '/xdaozwg-main-boss/src/main/webapp'
			},
			pro: {
				assetCDNUrl: location.origin+"/wg/resource",
				webSiteUrl: location.origin + '/wg'
			}

		},
		apiUrl: {
			dev: {
				loginOut: '../../webapp/login.html',
				commonUploadFile: 'testData/uploadFile.json',
				queryParkByName: 'testData/queryParkByName.json',
				queryAllPark: 'testData/queryAllPark.json',
				changePassword: 'testData/doneOk.json',
				zoneData: {
					zoneList: 'testData/zoneData.json'
				},
				//基础物业服务
				wuyeService: {
					//帐台设置
					eqtAccount: {
						//账台目录
						eqtListBig: 'testData/eqtListBig.json',
						eqtEditBig: 'testData/doneOk.json',
						eqtAddBig: 'testData/doneOk.json',
						eqtDelBig: 'testData/doneOk.json',
						//设备子类
						eqtListSmall: 'testData/eqtListSmall.json',
						eqtEditSmall: 'testData/doneOk.json',
						eqtAddSmall: 'testData/doneOk.json',
						eqtDelSmall: 'testData/doneOk.json',
						//所有设备
						eqtList: 'testData/eqtListSmall.json',
						eqtEdit: 'testData/doneOk.json',
						eqtAdd: 'testData/doneOk.json',
						eqtDel: 'testData/doneOk.json',
						enableEqt: 'testData/doneOk.json', //启用设备
						disEnableEqt: 'testData/doneOk.json', //禁用设备
						ruinedEqt: 'testData/doneOk.json' //报废设备

					},
					//工单管理
					orderManage: {
						customerOrderList: 'testData/orderManager.json',
						getCustomerInfoByPhone: 'testData/getCustomerInfoByPhone.json',
						//客服接单
						orderReceive: 'testData/doneOk.json',
						// 修改工单
						customerOrderEdit: 'testData/doneOk.json',
						// 新增工单
						customerOrderAdd: 'testData/doneOk.json',
						// 查询当前工单
						getCustomerOrder: 'testData/getOrderManager.json',
						// 查询当前工单任务记录
						getOrderTask: '',
						// 派单或转派
						transferOrderTask: 'testData/doneOk.json',
						// 选择经纪人列表
						selectBrokerList: 'testData/user.json',
						orderCancel: 'testData/doneOk.json'
					},
					//费用管理
					costManage: {

					},
					//装修管理
					decorateManage: {

					},
					//停车服务
					parkService: {

					},
					//孵化服务
					incubateService: {

					}

				},
				//客户服务
				cusSever: {
					//客户管理
					cusManage: {
						cusInfoManageList: 'testData/cusInfoManageList.json',
						cusInfoEdit: 'testData/doneOk.json',
						cusInfoAdd: 'testData/doneOk.json',
						cusInfoDel: 'testData/doneError.json',
						resetUserPassword: 'testData/doneOk.json',
						queryParkByName: 'testData/queryParkByName.json',
						cusInfoManage: 'testData/message.json',
						//客户分类设置
						cusCateSet: 'testData/doneOk.json',
						cusCateListLevel: 'testData/cusCateListLevel.json',
						cusCateEditLevel: 'testData/doneOk.json',
						cusCateAddLevel: 'testData/doneOk.json',
						cusCateDelLevel: 'testData/doneError.json',
						cusCateListIndustry: 'testData/cusCateListIndustry.json',
						cusCateEditIndustry: 'testData/doneOk.json',
						cusCateAddIndustry: 'testData/doneOk.json',
						cusCateDelIndustry: 'testData/doneError.json',
						cusCateListCompanySize: 'testData/cusCateListCompanySize.json',
						cusCateEditCompanySize: 'testData/doneOk.json',
						cusCateAddCompanySize: 'testData/doneOk.json',
						cusCateDelCompanySize: 'testData/doneError.json',
						cusCateListCompanyType: 'testData/cusCateListCmpanyType.json',
						cusCateEditCompanyType: 'testData/doneOk.json',
						cusCateAddCompanyType: 'testData/doneOk.json',
						cusCateDelCompanyType: 'testData/doneError.json',
						//删除信息共用接口
						cusCateDel: 'testData/doneError.json'

					},
					//通知公告
					notice: {
						noticeInfo: 'testData/noticeInfo.json',
						messageList: 'testData/messageList.json',
						messageEdit: 'testData/doneOk.json',
						messageAdd: 'testData/doneOk.json',
						messageDel: 'testData/doneError.json',
						getMessageInfo: 'testData/messageDetail.json',
						messageIsTop: 'testData/doneOk.json',
						publishMessage: 'testData/doneOk.json'
					},
					noticeType: {
						messageTypeList: 'testData/messageTypeList.json',
						messageTypeEdit: 'testData/doneOk.json',
						messageTypeAdd: 'testData/doneOk.json',
						messageTypeDel: 'testData/doneError.json',
						messageTypeIsInUse: 'testData/doneOk.json',
					}
				},
				//系统设置
				systemSet: {
					//基础资料
					basic: {
						//组织机构 + 人员管理 + 楼盘库
						deptList: 'testData/organizationList.json',
						deptEdit: 'testData/doneOk.json',
						deptAdd: 'testData/doneOk.json',
						deptDel: 'testData/doneError.json',
						//人员管理
						userManageList: 'testData/userManageList.json',
						userEdit: 'testData/doneOk.json',
						userAdd: 'testData/doneOk.json',
						userDel: 'testData/doneError.json',
						resetUserPassword: 'testData/doneOk.json',
						//人员管理--资料导入导出
						billList: 'testData/bill.json',
						billDel: 'testData/doneOk.json',
						getBill: 'testData/getBill.json',
						uploadBill: 'testData/importBill.json',
						downloadTemplateBill: 'testData/template.xlsx',
						exportBill: 'testData/template.xlsx',
						//楼盘库--树结构
						realEstateManageList: 'testData/realEstateManageList.json',
						realEstateList: 'testData/realEstateList.json',
						realEstateEdit: 'testData/doneOk.json',
						realEstateAdd: 'testData/doneOk.json',
						realEstateDel: 'testData/doneError.json',
						buildEdit: 'testData/doneOk.json',
						buildAdd: 'testData/doneOk.json',
						buildDel: 'testData/doneError.json',
						//楼盘库--物业信息
						houseInfoAdd: 'testData/doneOk.json',
						houseInfoDel: 'testData/doneError.json',
						houseInfoEdit: 'testData/doneOk.json'
					},
					//系统用户管理
					sysUser: {
						//系统用户
						sRoleList: 'testData/roleList.json',
						userManageList: 'testData/sysUserManageList.json',
						userEdit: 'testData/doneOk.json',
						userAdd: 'testData/doneOk.json',
						userDel: 'testData/doneError.json',
						resetUserPassword: 'testData/doneOk.json',
						enableParkUser: 'testData/doneOk.json',
						disenableParkUser: 'testData/doneOk.json',
						queryParkByName: 'testData/queryParkByName.json',
						//角色管理
						roleList: 'testData/roleUserManageList.json',
						roleEdit: 'testData/doneOk.json',
						roleAdd: 'testData/doneOk.json',
						roleDel: 'testData/doneError.json',
						enableRole: 'testData/doneOk.json',
						disEnableRole: 'testData/doneOk.json',
						resetUserPassword: 'testData/doneOk.json'
					},
					//App用户管理
					appUser: {
						//APP用户
						appManageList: '/memberMgt/query.jhtml',
						appManageEdit: 'testData/doneOk.json',
						appManageAdd: 'testData/doneOk.json',
						appManageDel: 'testData/doneError.json',
						enableAppUser: 'testData/doneOk.json',
						disenableAppUser: 'testData/doneOk.json',
						//认证审核
						certificatList: 'testData/certificatList.json',
						certificatEdit: 'testData/doneOk.json',
						enableCertificatUser: 'testData/doneOk.json',
						disenableCertificatUser: 'testData/doneOk.json'
						//意见反馈
					},
					appAds: {
						adsManageAdd: 'testData/doneOk.json',
						adsManageList: 'testData/adsManageList.json',
						adsManageEdit: 'testData/doneOk.json',
						adsManageDel: 'testData/doneError.json',
						adPutOn: 'testData/doneOk.json',
						adPutOff: 'testData/doneOk.json',
					},
					//用户反馈
					userFeedback: {
						userFeedbackList: 'testData/userFeedback.json'
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
				}
			},

			//-------------------------------------------------------------pro-------------------------------------------------------------------
			pro: {
				loginOut: '/wg/login.html',
				commonUploadFile: '/common/uploadImageFile.jhtml',
				queryParkByName: '/customermgt/getIntelligentParkList.jhtml',
				queryAllPark: '/systemMgt/allParks.jhtml',
				changePassword: '/userMgt/changePwd.jhtml',
				zoneData: {
					zoneList: 'testData/zoneData.json'
				},
				//基础物业服务
				wuyeService: {
					//帐台设置
					eqtAccount: {
						//账台目录
						eqtListBig: 'testData/eqtListBig.json',
						eqtEditBig: 'testData/doneOk.json',
						eqtAddBig: 'testData/doneOk.json',
						eqtDelBig: 'testData/doneOk.json',
						//设备子类
						eqtListSmall: 'testData/eqtListSmall.json',
						eqtEditSmall: 'testData/doneOk.json',
						eqtAddSmall: 'testData/doneOk.json',
						eqtDelSmall: 'testData/doneOk.json',
						//所有设备
						eqtList: 'testData/eqtListSmall.json',
						eqtEdit: 'testData/doneOk.json',
						eqtAdd: 'testData/doneOk.json',
						eqtDel: 'testData/doneOk.json',
						enableEqt: 'testData/doneOk.json', //启用设备
						disEnableEqt: 'testData/doneOk.json', //禁用设备
						ruinedEqt: 'testData/doneOk.json' //报废设备
					},
					//工单管理
					orderManage: {
						customerOrderList: 'testData/orderManager.json',
						getCustomerInfoByPhone: 'testData/getCustomerInfoByPhone.json',
						//客服接单
						orderReceive: 'testData/doneOk.json',
						// 修改工单
						customerOrderEdit: 'testData/doneOk.json',
						// 新增工单
						customerOrderAdd: 'testData/doneOk.json',
						// 查询当前工单
						getCustomerOrder: 'testData/getOrderManager.json',
						// 查询当前工单任务记录
						getOrderTask: '',
						// 派单或转派
						transferOrderTask: 'testData/doneOk.json',
						// 选择经纪人列表
						selectBrokerList: 'testData/user.json',
						orderCancel: 'testData/doneOk.json'
					},
					//费用管理
					costManage: {

					},
					//装修管理
					decorateManage: {

					},
					//停车服务
					parkService: {

					},
					//孵化服务
					incubateService: {

					}

				},
				//客户服务
				cusSever: {
					//客户管理
					cusManage: {
						//客户资料管理
						cusClassType: '/boss/company/findLevelOrIndustry.jhtml',
						cusInfoManageList: 'testData/cusInfoManageList.json',
						cusInfoEdit: 'testData/doneOk.json',
						cusInfoAdd: 'testData/doneOk.json',
						cusInfoDel: 'testData/doneError.json',
						resetUserPassword: 'testData/doneOk.json',
						queryParkByName: 'testData/queryParkByName.json',
						cusInfoManage: 'testData/message.json',
						//客户分类设置
						cusCateSet: 'testData/doneOk.json',
						//等级信息
						cusCateListLevel: '/boss/companyClass/find.jhtml',
						cusCateEditLevel: '/boss/companyClass/update.jhtml',
						cusCateAddLevel: '/boss/companyClass/save.jhtml',
						cusCateDelLevel: '/boss/companyClass/remove.jhtml',
						//行业信息
						cusCateListIndustry: '/boss/companyClass/find.jhtml',
						cusCateEditIndustry: '/boss/companyClass/update.jhtml',
						cusCateAddIndustry: '/boss/companyClass/save.jhtml',
						cusCateDelIndustry: '/boss/companyClass/remove.jhtml',
						//公司规模
						cusCateListCompanySize: '/boss/companyClass/find.jhtml',
						cusCateEditCompanySize: '/boss/companyClass/update.jhtml',
						cusCateAddCompanySize: '/boss/companyClass/save.jhtml',
						cusCateDelCompanySize: '/boss/companyClass/remove.jhtml',
						//公司性质
						cusCateListCompanyType: 'testData/cusCateListCmpanyType.json',
						cusCateEditCompanyType: '/boss/companyClass/update.jhtml',
						cusCateAddCompanyType: '/boss/companyClass/save.jhtml',
						cusCateDelCompanyType: '/boss/companyClass/remove.jhtml',
						//删除信息共用接口
						cusCateDel: 'testData/doneError.json'
					},
					//通知公告
					notice: {
						noticeInfo: 'testData/noticeInfo.json',
						messageList: 'testData/messageList.json',
						messageEdit: 'testData/doneOk.json',
						messageAdd: 'testData/doneOk.json',
						messageDel: 'testData/doneError.json',
						getMessageInfo: 'testData/messageDetail.json',
						messageIsTop: 'testData/doneOk.json',
						publishMessage: 'testData/doneOk.json'
					},
					noticeType: {
						messageTypeList: 'testData/messageTypeList.json',
						messageTypeEdit: 'testData/doneOk.json',
						messageTypeAdd: 'testData/doneOk.json',
						messageTypeDel: 'testData/doneError.json',
						messageTypeIsInUse: 'testData/doneOk.json',
					}
				},
				//系统设置
				systemSet: {
					//基础资料
					basic: {
						//组织机构 + 人员管理 + 楼盘库
						deptList: '/departmentMgt/query.jhtml',
						deptEdit: '/departmentMgt/edit.jhtml',
						deptAdd: '/departmentMgt/add.jhtml',
						deptDel: '/departmentMgt/delete.jhtml',
						//  人员管理
						userManageList: '/employeeMgt/query.jhtml',
						userEdit: '/employeeMgt/edit.jhtml',
						userAdd: '/employeeMgt/add.jhtml',
						userDel: '/employeeMgt/del.jhtml',
						resetUserPassword: 'testData/doneOk.json',
						// 人员管理--资料导入导出
						billList: 'testData/bill.json',
						billDel: 'testData/doneOk.json',
						getBill: 'testData/getBill.json',
						uploadBill: 'testData/importBill.json',
						downloadTemplateBill: 'testData/template.xlsx',
						exportBill: 'testData/template.xlsx',
						//楼盘库--树结构
						realEstateManageList: 'testData/realEstateManageList.json',
						realEstateList: 'testData/realEstateList.json',
						realEstateEdit: 'testData/doneOk.json',
						realEstateAdd: 'testData/doneOk.json',
						realEstateDel: 'testData/doneError.json',
						buildEdit: 'testData/doneOk.json',
						buildAdd: 'testData/doneOk.json',
						buildDel: 'testData/doneError.json',
						//楼盘库--物业信息
						houseInfoAdd: 'testData/doneOk.json',
						houseInfoDel: 'testData/doneError.json'
					},
					//系统用户管理
					sysUser: {
						//系统用户
						sRoleList: '/guest/role/list.jhtml', //查询角色列表信息
						getEmployeeNameList: 'testData/queryParkByName.json', //查询关联员工姓名列表信息 /customermgt/getIntelligentParkList.jhtml
						userManageList: '/userMgt/query.jhtml',
						userEdit: '/userMgt/edit.jhtml',
						userAdd: '/userMgt/add.jhtml',
						userDel: '/userMgt/delete.jhtml',
						resetUserPassword: 'testData/doneOk.json',
						enableUser: '/userMgt/updateStatusOn.jhtml',
						disenableUser: '/userMgt/updateStatusOFF.jhtml',
						queryParkByName: 'testData/queryParkByName.json',
						//角色管理
						roleList: '/systemmgt/role/query.jhtml',
						roleEdit: '/systemmgt/role/update.jhtml',
						roleAdd: '/systemmgt/role/add.jhtml',
						roleDel: '/systemmgt/role/delete.jhtml',
						enableRole: '/systemmgt/role/useStatusOn.jhtml',
						disEnableRole: '/systemmgt/role/useStatusOff.jhtml',
						resetUserPassword: 'testData/doneOk.json',
						//角色菜单
						roleMenuList: '/systemmgt/role/findFunctions.jhtml',
						roleMenuEdit: '/systemmgt/role/authorization.jhtml',
						//角色用户    
						roleUsersList: '/roleMgt/listAccount.jhtml',
						roleUsersEdit: '/roleMgt/editAccount.jhtml'
					},
					//App用户管理
					appUser: {
						//APP用户
						appManageList: '/memberMgt/query.jhtml',
						appManageEdit: 'testData/doneOk.json',
						appManageAdd: 'testData/doneOk.json',
						appManageDel: 'testData/doneError.json',
						enableAppUser: 'testData/doneOk.json',
						disenableAppUser: 'testData/doneOk.json',
						//认证审核
						certificatList: '/memberMgt/query.jhtml',
						certificatEdit: '/enterpriseUserMsg/audit.jhtml',
						enableCertificatUser: '/enterpriseUserMsg/updateStatusOn.jhtml',
						disenableCertificatUser: '/enterpriseUserMsg/updateStatusOFF.jhtml',
						//意见反馈
					},
					appAds: {
						adsManageAdd: '/adManage/insert.jhtml',
						adsManageList: '/adManage/query.jhtml',
						adsManageEdit: '/adManage/update.jhtml',
						adsManageDel: '/adManage/delete.jhtml',
						adPutOn: '/adManage/putAdOn.jhtml',
						adPutOff: '/adManage/putAdOff.jhtml',
					},
					//用户反馈
					userFeedback: {
						userFeedbackList: '/systemmgt/feedback/query.jhtml'
					}
				}
			}
		}
	}
	window.currentApiUrl = configData.apiUrl[configData.currentEnv];

	console.log("环境 webSiteUrl:" + configData.environment[configData.currentEnv].webSiteUrl)
	console.log("环境 baseCDNURL:" + configData.environment[configData.currentEnv].assetCDNUrl)
	console.log("环境 appPath:" + configData.environment[configData.currentEnv].webSiteUrl + '/app/modules')
	console.log("=============================================")

})(window);

/**
 * 应用程序文件引用
 */
(function() {
	console.log("应用程序文件引用")
	require.config({
		baseUrl: configData.environment[configData.currentEnv].assetCDNUrl,
		urlArgs: "ver=" + (new Date()).getTime(),
		paths: {
			'appPath': configData.environment[configData.currentEnv].webSiteUrl + '/app/modules',
			'jquery': 'vendor/jquery/jquery-2.2.0.min',
			'avalon': 'vendor/avalon/avalon.modern',
			'avalon-mmState': 'vendor/avalon/mmState',
			'avalon-mmRouter': 'vendor/avalon/mmRouter',
			'avalon-mmHistory': 'vendor/avalon/mmHistory',
			'avalon-mmPromise': 'vendor/avalon/mmPromise',
			'avalon-getModel': 'vendor/avalon/avalon.getModel',
			'domReady': 'vendor/require/domReady',
			'moment': 'vendor/moment/moment',
			'jquery.semantic': 'vendor/jquery/jquery.semantic.min',
			'jquery.colresizable': 'vendor/jquery/colResizable-1.5.min',
			'jquery.dataTable': 'vendor/jquery-dataTable/amazeui.datatables',
			'bootstrap-datetimepicker': 'vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
			'bootstrap-datetimepicker.zh-CN': 'vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.zh-CN',
			'jquery.ztree': 'vendor/ztree/jquery.ztree.all.min',
			'jquery.webuploader': 'vendor/webuploader/webuploader.html5only.min',
			'jquery.trumbowyg': 'vendor/trumbowyg-2.0.0/trumbowyg.min',
			'jquery.wangeditor': 'vendor/wangEditor/wangEditor.js',
			'sortable': 'vendor/sortable/sortable.min',
			'echarts': 'vendor/echart/echarts.min',
			'dataChart': 'component/dataChart/component-datachart.js',
			'jqueryAjax': 'component/httpService/jqueryAjax',
			'component-message': 'component/message/component-message',
			'component-datatable': 'component/dataTable/component-datatable',
			'component-datetimerpicker': 'component/dateTimePicker/component-datetimerpicker',
			'component-uploader': 'component/uploader/component-uploader',
			'component-ztree': 'component/ztree/component-ztree',
			'component-wangeditor': 'component/richEditor/component-wangeditor'
		},
		//shim是用于将加载那些不符合AMD规范的JS文件
		shim: {
			'jquery.semantic': ['jquery'],
			'jquery.colresizable': ['jquery'],
			'jquery.dataTable': ['jquery'],
			'bootstrap-datetimepicker': ['jquery'],
			'bootstrap-datetimepicker.zh-CN': ['bootstrap-datetimepicker'],
			'jquery.ztree': ['jquery'],
			'jquery.webuploader': ['jquery'],
			'jquery.wangeditor': {
				//指定依赖项,必须为数组, 不写时默认为空数组,它们会先于被依赖者加载
				deps: ['jquery'],
				exports: 'wangEditor' //指定它的命名空间
			}
		},
		debug: false
	});

	/**
	 * 初始化
	 */
	require(['jquery', 'appPath/modules', 'avalon-getModel', 'domReady!'], function($, modules) {
		if(localStorage.getItem('rolesData_wg') != '' && localStorage.getItem('rolesData_wg') != null) {
			modules.init();
		} else {
			modules.loginOut();
		}
	});
})();