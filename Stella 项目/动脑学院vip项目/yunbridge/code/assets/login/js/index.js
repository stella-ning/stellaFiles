$(function(){
	$('#frmLogin').bootstrapValidator({
		triggerEvent : "blur"
	})
	.on("error",function(event,$errFiles){
		// alert("验证有错误");
		return false;
	})
	.on("success",function(event){
		this.submit();
		return false;
	});//开启某表单的验证功能;

	// $('#username').on('blur',function(){
	// 	//input的父级元素,并清除成功和失败的样式
	// 	var $group = $(this).parents('.input-group').removeClass('has-success has-error');
	// 	//初始化移除错误信息
	// 	$group.next().remove();
	// 	//\w正则里面意味着匹配一个字符（字母数字下划线）
	// 	var regex = /^\w+$/;
	// 	//console.log(regex.test(this.value));
	// 	if(regex.test(this.value)){
	// 		$group.addClass('has-success');
	// 	}else{
	// 		$group.addClass('has-error');
	// 		$group.after('<p class=\"text-danger\">输入不合法</p>')
	// 	}
	// })
	// $('#frmLogin').on('submit',function(){
	// 	//serializeArray()找到所有的表单元素
	// 	var all = $(this).serializeArray().length;
	// 	var allS = $(this).find('.has-success').length;
	// 	console.log(all+'--'+allS);
	//
	// 	if(all === allS){
	// 		alert(all+'--'+allS);
	// 		this.submit();
	// 	}else{
	// 		return false;
	// 	}
	//
	// });
});
