/**
 * 基于wangEditor的富文本编辑器
 * http://wangeditor.github.io/
 */
define(['jquery.wangeditor'], function (wangEditor) {

    var errorStatusMessage = [
            {
                status: '400',
                message: '客户端语法错误！'
            },
            {
                status: '404',
                message: '接口地址不存在！'
            },
            {
                status: '403',
                message: '接口拒绝访问！'
            },
            {
                status: '413',
                message: '文档的大小超限！'
            },
            {
                status: '500',
                message: '服务端内部异常！'
            },
            {
                status: '504',
                message: '服务端请求超时！'
            }
        ],
        /**
         * 处理常见Http状态码异常
         * @param status
         * @returns {*}
         */
        handlerErrorCase = function (status) {
            var errormessage = errorStatusMessage, isHandler = false;
            for (var i = 0, len = errormessage.length; i < len; i++) {
                if (status == errormessage[i].status) {
                    isHandler = true;
                    return errormessage[i];
                }
            }
            if (!isHandler) {
                return {
                    status: status,
                    message: '异常很诡异，臣妾处理不了，请火速联络超级管理员！错误码：' + status
                }
            }
        },
        init = function (opt) {
            // 阻止输出log
            wangEditor.config.printLog = false;
            var editor = new wangEditor(opt.container);
            //隐藏菜单
            editor.config.menus = $.map(wangEditor.config.menus, function (item, key) {
                if (opt.hideInsertImg && item === 'img') {
                    return null;
                }
                if (opt.hideFullscreen && item === 'fullscreen') {
                    return null;
                }
                if (item === 'emotion') {
                    return null;
                }
                return item;
            });

            //百度地图秘钥--自己申请的密钥
            editor.config.mapAk = 'K5b5RL1922eI8Yj7MLlIVllDaQooQfTX';

            // 上传图片
            editor.config.uploadImgFileName =  opt.uploadFileName || 'uploadImageFile'
            editor.config.hideLinkImg = false || opt.hideLinkImg;
            editor.config.uploadParams = opt.params || {};
            //不配server端的地址，则不显示本地上传
            editor.config.uploadImgUrl = opt.uploadUrl || '/uploadImageFile';
            if (!opt.hideInsertImg && opt.uploadUrl && opt.uploadUrl != '') {
                console.log('upload');
                editor.config.uploadImgFns.onload = function (resultText, xhr) {
                    var result = resultText != '' ? JSON.parse(resultText) : '';
                    if (result) {
                        if(result.status==200){
                            editor.command(null, 'InsertImage', result.data.results.imgUrl);
                            //editor.command(null, 'insertHtml', '<img src="' + result.data.results.imgUrl + '" style="max-width:100%;"/>');
                        }else{
                            opt.uploadErrorCallback && opt.uploadErrorCallback(handlerErrorCase(result.status).message);
                        }
                    } else {
                        opt.uploadErrorCallback && opt.uploadErrorCallback('上传接口返回数据异常');
                    }
                };
            }
            editor.create();
            return editor;
        }
    return {
        initWangEditor: function (opt) {
            return init(opt)
        }
    }
});
