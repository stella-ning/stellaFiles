$(function(){
	$(".form-date").datetimepicker({
        language: 'zh-CN',//国际化语言种类
        format: "yyyy-mm-dd",//格式（项目会统一格式）
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    }).on('changeDate', function(ev){
    	var $t = $($(ev.target).attr("date-relative"));
    	if($t.size()>0){
    		$t.datetimepicker('setStartDate', ev.date);
    		if(ev.date>$t.datetimepicker('getDate')){
    			$('input',$t).val("");
    		}
    	}
    });
     // 移除输入框内容按钮
    $(document).on("click", ".glyphicon-remove", function() {
    	$(this).parent().prev().val("");
    	//$('.form-date').datetimepicker('setStartDate',new Date());
    });
    //扩展验证规则
    $.fn.bootstrapValidator.extendRules({
    	//只有银行系统才会有这样的验证规则
    	//必须是小数，正书，1-24之间的两位小数
    	rate : function(){
    		if(!this.val())return true;
    		return /^([\d]+)(\.[\d]{1,2})?$/.test(this.val())
    				&&
    			   Number(this.val())<=24;
    	}
    });
});
