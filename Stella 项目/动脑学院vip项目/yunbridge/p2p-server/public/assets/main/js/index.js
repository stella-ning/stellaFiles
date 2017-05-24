$(function(){
	//alert(222);
    $("#mainForm")
    	.bootstrapValidator()
    	.on("success",function(){
    		//alert(1);
    	});
    $.getJSON("../../../data/data1.json",function(obj){
    	//alert(obj);
    	MetaData.load(obj);//通过加载数据让metaData驱动程序工作
    	// $.each(obj.detail,function(key,val){
		// 	var $obj = $('#'+key);
		// 	$obj.text(Utils.numberFormat($obj,val))
		// })
    });
	//所有承兑人类型tab页中的多选按钮（不包括全选）
	var $checks = $(".form-horizontal .check-group .btn-check");
	//承兑人类型tab页中的全选按钮
	var $checkAll = $('.form-horizontal .ico-check.chk-all').on('click',function(){
		var checked = $(this).toggleClass('checked').hasClass('checked');
		//如果checked是true,那么$checks中没有被选中的触发点击事件,否则checked是false,那么$checks中选中的触发点击事件
		if(checked){
			$checks.not('.checked').trigger('click');
		}else{
			$checks.filter('.checked').trigger('click');
		}
	});
	$checks.on('click',function(){
		var $check = $(this);
		var isChecked = $check.toggleClass('checked').hasClass('checked');
		var checkedLen = $check.next().prop('checked',isChecked).parents('.check-group').find('.btn-check.checked').length;
		//console.log(checkedLen);
		if(checkedLen === $checks.length ){
			$checkAll.addClass('checked');
		}else{
			$checkAll.removeClass('checked');
		}

	})
});
