/**
 * Created by Administrator on 2016/2/1.
 */
define(['jquery.semantic'], function () {
    var getDefaultPopupOpts = function() {
            return{
                container: 'body',
                content: '',
                okText: '确定',
                cancelText: '取消',
                timer : 2500,
                className:'info'
            }
        },
        getDefaultAlertOpts = function(){
            return {
                container: 'body',
                header:'提示',
                content: '',
                isShowOkBtn:true,
                isShowCancelBtn:true,
                okText: '确定',
                cancelText: '取消',
                onOk:function(){},
                onCancel:function(){}
            }
        },
        isShowPopup = false,
        isShowAlert = false,
        isShowLoading = false,
        hidePopup = function () {
            $('#popupMsg').transition('fly down');
        },
        showPopup = function (opt) {
            var opts = opt,
                defaultClassName = 'ui message transition hidden';
            if(isShowPopup){
                return
            }
            if($('#popupMsg').length==0){
                opts = initPopup(opt);
            }else{
                $('#popupMsg').removeClass('info error warning success').addClass(opts.className||'info');
                $('#popupMsg div').html(opts.content);
            }
            isShowPopup = true;
            $('#popupMsg').transition('fly down');
            setTimeout(function(){
                isShowPopup = false;
                $('#popupMsg').transition('fly down');
            },opts.timer || getDefaultPopupOpts().timer);
        },
        initPopup = function (opt) {
            var opts = $.extend(getDefaultPopupOpts(),opt),
                template = ['<div class="ui message transition hidden '+opts.className+'" id="popupMsg">' +
                                '<div>' + opts.content + '</div>' +
                            '</div>'].join('');
            $(opts.container).append(template);
            return opts;
        },
        initAlert = function(defaultOpts,opt){
            var opts = $.extend(defaultOpts,opt),
                btnOkHtml =!opts.isShowOkBtn?'':'<div class="ui green approve button">'+opts.okText+'</div>',
                btnCancelHtml =!opts.isShowCancelBtn?'':'<div class="ui orange cancel button">'+opts.cancelText+'</div>',
                btnsHtml = (btnOkHtml=='' && btnCancelHtml=='')? '' : '<div class="actions">'+btnOkHtml+btnCancelHtml+'</div>',
                template = ['<div class="ui modal small" id="alertMsg">'+
                                '<div class="header">'+opts.header+'</div>'+
                                '<div class="content">'+opts.content+'</div>'+
                                btnsHtml +
                            '</div>'].join('');

            $(opts.container).append(template);
            $('#alertMsg').modal({
                closable  : false,
                onDeny    : function(){
                    hideAlert();
                    opts.onCancel && opts.onCancel();
                },
                onApprove : function() {
                    hideAlert();
                    opts.onOk && opts.onOk();
                }
            });
        },
        showAlert = function (opt) {
            if(isShowAlert){
                return
            }
            initAlert(getDefaultAlertOpts(),opt);
            isShowAlert = true;
            $('#alertMsg').modal('setting', 'transition', 'vertical flip in').modal('show');
        },
        hideAlert = function () {
            if(!isShowAlert){
                return
            }
            isShowAlert = false;
            $('#alertMsg').modal('hide');
            setTimeout(function(){
                $('#alertMsg').remove();
            },300);
        };

    return {
        hidePopup:hidePopup,
        showPopup: function (opt) {
            showPopup(opt);
        },
        hideAlert:hideAlert,
        showAlert: function (opt) {
            showAlert(opt);
        }
    }
});