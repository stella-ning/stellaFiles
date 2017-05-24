/**
 * Created by nbxx on 2015/12/9 0009.
 */

$.getScript('css/layer.css');
var scriptsArray = new Array();
$.cachedScript = function (url, options) {
    for (var s in scriptsArray) {
        if (scriptsArray[s]==url) {
            return {
                done: function (method) {
                    if (typeof method == 'function'){
                        method();
                    }
                }
            };
        }
    }
    options = $.extend(options || {}, {
        dataType: "script",
        url: url,
        cache:true
    });
    scriptsArray.push(url);
    return $.ajax(options);
};

var UrlConf = {
    index:"index.html",
    login:"login.html",
    aboutus:"aboutus.html",
    user_info:"personal_info.html",

    home:"home.html",
    admin_add_doctor:"add_doctor.html",
    admin_add_hospital:"add_hospital.html",
    admin_edit_area:"edit_area.html",
    admin_edit_sales:"edit_sales.html",
    admin_manage_area:"area_man.html",
    admin_manage_sales:"sales_man.html",
    admin_manage_hospital:"shenghe.html",
    admin_manage_doctor:"yisheng_guanl.html",
    admin_detail_hospital:"hospital_detail.html",

    doc_early_check:"early_check.html",
    doc_patient_detail:"patient_condition.html",
    doc_patient_list:"patient_my.html",
    doc_review_list:"review_check.html",
    doc_patient_review:"review_c_lr.html",
    doc_detail:"doctor_detail.html",

    tk_user: "userpage",
    tk_uid:"uid",
    tk_area:"aid",
    tk_areaId:"areaId",
    tk_avatar:"avt_img",
    tk_hospital:"hosp",
    tk_hospitalId:"hid",
    tk_name:"name",
    tk_mobile:"mobile",
    tk_doctype:"doctype",
};

var User = {
    logout:0,
    doctor:1,
    sales:2,
    admin:3,
    super:4,
    pre:1,
    post:2,
    both:3,
};

var UserUrl = [UrlConf.login, UrlConf.doc_home, UrlConf.admin_home, UrlConf.admin_home, UrlConf.admin_home];

/* server:"http://www.xiaoweicharity.com/", */

var ApiConf = {
    server:"http://localhost:8080/changfeng/",
    login:"app/login.do",
    add_pre_record:"app/patientAdd.do",
	update_pre_case:"app/updatePatientCase.do",
    add_post_record:"app/patientReview.do",
    list_records:"app/patientList.do",
    patient_down:"app/patientDown.do",
    download:"app/download.do",
    detail_record:"app/patientCaseInfo.do",
    del_record:"app/deletePatientCase.do",
    add_area:"app/areaAdd.do",
    list_area:"app/areaList.do",
    detail_area:"app/areaShow.do",
    set_area_admin:"app/setAreaAdmin.do",
    list_area_sales:"app/isUserAreaList.do",
    add_area_sales:"app/userAreaAdd.do",
    list_sales:"app/salesmanList.do",
    del_sales:"app/salesmanDel.do",
    list_hospital:"app/hospitalList.do",
    list_hospital_all:"app/hospitalListAll.do",
    detail_hospital:"app/hospitalInfo.do",
    add_hospital:"app/hospitalAdd.do",
    verify_hospital:"app/hospitalVerify.do", // 审核医院
    list_doctor:"app/doctorList.do",
    add_user:"app/salesmanAdd.do",              //添加客服专员
    detail_user:"app/userInfo.do",
    verify_doctor:"app/doctorVerify.do", // 审核医生
    upload_img:"app/uploadFilesApp.do",
    update_user:"app/updateUserApp.do",
    patient_statistical:"app/patientStatistics.do",         //患者统计接口（管理员登录） 0 男,1 女
    salesman_statistical:"app/salesmanStatistics.do",       //客户专员统计接口（管理员登录）   done         
    doctor_statistical:"app/doctorStatistics.do",           //医生统计接口（管理员登录）
    hos_statistical:"app/hosStatistics.do",                 //医院统计接口 （管理员登录）
    sales_my_statistical:"app/salesMyStatistics.do",        //业务员登录统计（业务员登录）
    doctor_my_tatistical:"app/doctorMyStatistics.do",       //医生登录统计 （医生登录）  0 初筛,  1复筛    done
};

function login(mobile, password){
    CfConn(ApiConf.login, function(data){
        //alert(JSON.stringify(data));
        var jumpto = UserUrl[User.logout];
        if (data.code.trim() == 'admin'){
            // 管理员
            window.sessionStorage.setItem(UrlConf.tk_user,User.admin);
            //jumpto = UserUrl[User.admin];
            jumpto = UrlConf.home;
            //alert(3);
        }
        else if (data.code.trim() == 'doctor'){
            // 医生
            window.sessionStorage.setItem(UrlConf.tk_user,User.doctor);
            window.sessionStorage.setItem(UrlConf.tk_doctype,data.type);
            //jumpto = UserUrl[User.doctor];
            jumpto = UrlConf.home;
            //alert(2);
        }
        else if (data.code.trim() == 'salesman'){
            // 客服专员
            window.sessionStorage.setItem(UrlConf.tk_user,User.sales);
            //jumpto = UserUrl[User.sales];
            jumpto = UrlConf.home;
            //alert(1);
        }
        else{
            window.sessionStorage.removeItem(UrlConf.tk_user);
            jumpto = UserUrl[User.logout];
            //alert(0);
        }
        // Save uid
        window.sessionStorage.setItem(UrlConf.tk_uid,data.uid.trim());
        window.sessionStorage.setItem(UrlConf.tk_name,data.realname.trim());
        window.sessionStorage.setItem(UrlConf.tk_area,data.areaName.trim());
        window.sessionStorage.setItem(UrlConf.tk_areaId,data.areaId.trim());
        if (data.headPic.trim() != '' && data.headPic.trim() != 'null') {
            window.sessionStorage.setItem(UrlConf.tk_avatar, data.headPic.trim());
        }
        if ((data.hospitalname.trim() != null) &&
            (data.hospitalname.trim() != 'null') &&
            (data.hospitalname.trim() != '')) {
            window.sessionStorage.setItem(UrlConf.tk_hospital, data.hospitalname.trim());
        }
        if ((data.hospital_id != null) &&
            (data.hospital_id.trim() != 'null') &&
            (data.hospital_id.trim() != '')) {
            window.sessionStorage.setItem(UrlConf.tk_hospitalId, data.hospital_id.trim());
        }
        if (data.mobilePhone.trim() != 'admin') {
            window.sessionStorage.setItem(UrlConf.tk_mobile, data.mobilePhone.trim());
        }
        Toast('登录成功', '', function(){
            window.location.replace(jumpto);
        });
    }, {mobilePhone:mobile, pwd:password}, {}, function(error, message){
        if (error == 3){
            Toast('用户名/密码错误');
        }
        else{
            Toast(message, "遇到错误了哦");
        }
    });
}

function logout() {
    // TODO clear all cookies
    window.sessionStorage.clear();
   // window.location.replace(UrlConf.login);
}

/**
 *
 * @param msg
 * @param flag
 * @param callback
 * @param type 1:normal(default), 2:loading, 3:close all
 * @constructor
 */
function Toast(msg, flag, callback, type) {
    var popup = {};

    switch(type){
        case 2:{
            popup['type'] = 2;
        }break;
        case 3:{
            $.cachedScript('js/layer.js').done(function () {
                layer.closeAll();
            });
            return;
        }break;
        default:{
            popup['content'] = msg;
            popup['style'] = 'background-color:#0094FF; color:#fff; border:none;';
            popup['time'] = 1;
            if (typeof (flag) === 'undefined' || flag == null || flag == 'null'){
                popup['flag'] = document.title;
            }
            else{

            }
            if (typeof (callback) === 'function'){
                popup['end'] = function(elem){callback(elem);};
                popup['time'] = 1.5;
            }
        }
    }
    $.cachedScript('js/layer.js').done(function () {
        layer.open(popup);
    });
}

function convertToStr(key, value){
    if ((typeof (value) === "object") && (value !== null)) {
        return value;
    }
    return String(value);
}

function CFDown(api, info, auth) {
	var data = {};
	 if (typeof(info) !== 'undefined' && 'null' != info) {
	     data.info = JSON.stringify(info, convertToStr);
	     //alert(data.info);
	 }
	 if (typeof(auth) !== 'undefined' && 'null' != auth) {
	     data.auth = JSON.stringify(auth, convertToStr);
	    // alert(data.auth);
	 }

	 if (typeof(data) === 'undefined' || isEmpty(data)) {
	     Toast(null, null, null, 3);
	     Toast("提交的参数缺失", "出现错误了哦：");
	     return;
	 }
	 
	var url= ApiConf.server + api + "?" + $.param(data);
	window.location.replace(url);
	//window.location.href= api + "?" + JSON.stringify(data);
}

function CfConn (api, callback, info, auth, fail, isqueue){
    Toast(null, null, null, 2);
    if (typeof(isqueue)==='undefined') isqueue = false;
    if (!isqueue && typeof(window.ajax_request) !== 'undefined' && window.ajax_request != null){
        //Toast('found ajax:'+window.ajax_request, 'ajax');
        window.ajax_request.abort();
    }

    var data = {};
    if (typeof(info) !== 'undefined' && 'null' != info) {
        data.info = JSON.stringify(info, convertToStr);
        //alert(data.info);
    }
    if (typeof(auth) !== 'undefined' && 'null' != auth) {
        data.auth = JSON.stringify(auth, convertToStr);
       // alert(data.auth);
    }

    if (typeof(data) === 'undefined' || isEmpty(data)) {
        Toast(null, null, null, 3);
        Toast("提交的参数缺失", "出现错误了哦：");
        return;
    }

    window.ajax_request = $.ajax({
        type: 'get',
        dataType: 'json',
        async: 'false',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,    
        url: ApiConf.server+api,
        data: data,
        success: function(data) {
           //callback(data);
            Toast(null, null, null, 3);
            //alert(JSON.stringify(data));
            if (data.error != undefined) {
            	//alert("悲剧");
                switch (data.error) {
                    case '-1':
                    {
                        if(typeof callback == 'function') {
                            callback(data);
                        }
                        else {
                            //alert("悲剧");
                        	Toast(JSON.stringify(data), "请求成功");
                        }
                    }
                        break;
                    case '1':
                    {
                        Toast('您还没有登录或登录出现异常，请重新登录哦', '', function(){
                            window.location.href = window.location.href = UrlConf.login;
                        });
                    }
                        break;
                    default:
                    {
                        // fail
                        if(typeof fail == 'function') {
                            fail(data.error, data.msg);
                        }
                        else {
                            Toast("错误码："+data.error+", 错误信息："+data.msg, "出现错误了哦：");
                        }
                    }
                }
            }
            else if (data.totalNum != null && typeof callback == 'function'){
                //alert('发现返回没有error的');
                callback(data);
            }
            else {
            	//alert('出现错误了哦：');
                Toast(JSON.stringify(data), "出现错误了哦：");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Toast(null, null, null, 3);
            if (XMLHttpRequest.readyState != 0 && XMLHttpRequest.status != 200) {
                Toast('status:' + XMLHttpRequest.status +
                    '\nReadyState:' + XMLHttpRequest.readyState +
                    '\nTextStatus:' + textStatus +
                    '\nError:' + errorThrown, 'error');
            }
            else {
                //Toast('status:' + XMLHttpRequest.status +
                //    '\nReadyState:' + XMLHttpRequest.readyState +
                //    '\nTextStatus:' + textStatus +
                //    '\nError:' + errorThrown, 'error');
                Toast('服务器遇到了问题哦，请联系客服~~~');
            }
        },
        complete: function(XMLHttpRequest, textStatus){
            window.ajax_request = null;
        }
    });
}

function xwnize(arr){
    if (arr == null || arr == 'null' || arr == ''){
        return '';
    }
    var str = '';
    if (isArray(arr)){
        for (var i = 0; i < arr.length; i++){
            str += String(arr[i])+'@';
        }
    }
    else{
        str+=arr+'@';
    }

    return str;
}

var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
function uploadFile(file, callback) {
    //alert(file.length);
    Toast(null, null, null, 2);
    var fd = new FormData();
    fd.append("fileCommon.fileSource", "lists");
    fd.append("fileCommon.fileType", "JPG,BMP,GIF,TIF,PNG");
    fd.append("files.files", file);
    var xhr = new XMLHttpRequest();
    if (typeof(callback) === 'function') {
        xhr.addEventListener("load", function (evt) {
            Toast(null, null, null, 3);
            callback(evt);
        }, false);
    }
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
    xhr.open("POST", ApiConf.server + ApiConf.upload_img);
    xhr.send(fd);
}
function uploadFailed(evt) {
    Toast(null, null, null, 3);
    Toast("糟了，您的浏览器不支持上传哦", "出错拉~~");
}
function uploadCanceled(evt) {
    Toast(null, null, null, 3);
    Toast("糟了，您的浏览器不支持上传哦", "出错拉~~");
}

function isEmpty(map) {
    for(var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function getUrlParameters(parameter){
    var currLocation = window.location.search;
    if (currLocation.indexOf("?") == -1){
        return false;
    }
    var parArr = currLocation.split("?")[1].split("&"),
        returnBool = true;
    for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return decodeURIComponent(parr[1]);
            //returnBool = true;
        }else{
            returnBool = false;
        }
    }
    if(!returnBool) return false;
}

defaultfont();
/*之所以要延时100ms再调用这个函数是因为
 如果不这样屏幕宽度加载会有误差*/
setTimeout(function(){
    defaultfont();
}, 100);
var w_height=$(window).width();

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

$(document).ready(function(){
    // Compatibility check
    if(typeof(Storage) === "undefined") {
        // Sorry! No Web Storage support..
        Toast("打开浏览器的本地存储才能正常使用本网站哦~~~");
        window.close();
    }

    // back action
    $('.goback').click(function(){
        history.back();
    });

    var userpage = window.sessionStorage.getItem(UrlConf.tk_user);
 //login check
    if (document.URL.indexOf("/"+UrlConf.login) == -1) {
        if (userpage == null){
           // window.location.href = UrlConf.login;
        }
        else if (document.URL.indexOf("/"+UrlConf.index) > -1){
            window.location.href = UserUrl[userpage];
            window.location.href = UrlConf.home;
        }
    }

    if (typeof(loaded) === "function"){
        window.onload = loaded();
    }

    $(window).resize(function(){
        if($(window).width()!=w_height)
        {
            window.location.reload();
        }
    });
});


function defaultfont() {
    var sw = $(window).width()>640?640:$(window).width();
    var pw = 640;
    var f = 100*sw/pw;
    $('html').css('font-size', f+'px');
    $('#scroller > #itemlist').css('min-height', $(window).height()*0.66 + 'px');
}

function getPos(e){
    var t=e.offsetTop;
    //var l=e.offsetLeft;
    while(e=e.offsetParent){
        t+=e.offsetTop;
        //l+=e.offsetLeft;
    }
    return t;
    //alert("top="+t+"\nleft="+l);
}
