$(function(){
	$(function(){
	// 选项卡效果
	var _index = 0;
	change($("#tg .t_list li"),$("#tg .tg"));
	change($("#fb .t_list li"),$("#fb .fb"));
	function change($li,$active){
		$li.click(function(){
			_index = $(this).index();
			$(this).addClass("all").siblings().removeClass("all");
			$active.eq(_index).show().siblings(".act_list_wrap").hide();
		});

	}

	//个人中心我的发布 活动全选功能
	allCheck($("#fb .all_acitves .btn .qx"),$("#fb .all_acitves .check"));
	allCheck($("#fb .doing .btn .qx"),$("#fb .doing .check"));
	allCheck($("#fb .coparating .btn .qx"),$("#fb .coparating .check"));
	allCheck($("#fb .ending .btn .qx"),$("#fb .ending .check"));

	//个人中心我的推广 活动全选功能
	allCheck($("#tg .all_acitves .btn .qx"),$("#tg .all_acitves .check"));
	allCheck($("#tg .doing .btn .qx"),$("#tg .doing .check"));
	allCheck($("#tg .coparating .btn .qx"),$("#tg .coparating .check"));
	allCheck($("#tg .ending .btn .qx"),$("#tg .ending .check"));
	function allCheck($qx,$input){
		$qx.click(function(){
			$(this).addClass("first").siblings(".btn a").removeClass("first");
			for(var i = 0; i<$input.length;i++){
				$input[i].checked = true;
			}
		});
	}
	//我的发布活动取消选择功能
	cancel($("#fb .all_acitves .btn .cancel"),$("#fb .all_acitves .check"));
	cancel($("#fb .doing .btn .cancel"),$("#fb .doing .check"));
	cancel($("#fb .coparating .btn .cancel"),$("#fb .coparating .check"));
	cancel($("#fb .ending .btn .cancel"),$("#fb .ending .check"));
	//我推广活动取消功能
	cancel($("#tg .all_acitves .btn .cancel"),$("#tg .all_acitves .check"));
	cancel($("#tg .doing .btn .cancel"),$("#tg .doing .check"));
	cancel($("#tg .coparating .btn .cancel"),$("#tg .coparating .check"));
	cancel($("#tg .ending .btn .cancel"),$("#tg .ending .check"));
	function cancel($cancel,$input){
		$cancel.click(function(){
			$(this).addClass("first").siblings(".btn a").removeClass("first");
			for(var i = 0; i<$input.length;i++){
				$input[i].checked = false;
			}
		});
	}
	//我发布活动反选
	fanx($("#fb .all_acitves .btn .fx"),$("#fb .all_acitves .check"));
	fanx($("#fb .doing .btn .fx"),$("#fb .doing .check"));
	fanx($("#fb .coparating .btn .fx"),$("#fb .coparating .check"));
	fanx($("#fb .ending .btn .fx"),$("#fb .ending .check"));
	//我的推广活动反选
	fanx($("#tg .all_acitves .btn .fx"),$("#tg .all_acitves .check"));
	fanx($("#tg .doing .btn .fx"),$("#tg .doing .check"));
	fanx($("#tg .coparating .btn .fx"),$("#tg .coparating .check"));
	fanx($("#tg .ending .btn .fx"),$("#tg .ending .check"));
	function fanx($fx,$input){
		$fx.click(function(){
			$(this).addClass("first").siblings(".btn a").removeClass("first");
			for(var i=0;i<$input.length;i++){
				if($input[i].checked == false){
					$input[i].checked = true;
				}else{
					$input[i].checked = false;
				}
			}
		});
	}

	//我的发布 删除选中的活动
	// $("#fb .all_acitves .btn .delete").click(function(){
	// 	$(this).addClass("first").siblings(".btn a").removeClass("first");
	// 	$("#fb .all_acitves .check:checkbox:checked").parent().remove();
	// 	$(this).removeClass("first");
	// });
	// $(".pages input.delete").click(function(){
	// 	var $del_input= $("#tg .doing .check");
	// 		if($del_input.checked ==true){
	// 			alert("请选择你要删除的活动");
	// 		}else{
	// 			alert(12121);
	// 			return true;
	// 		}

	// });
	// $("#fb .coparating .btn .delete").click(function(){
	// 	$(this).addClass("first").siblings(".btn a").removeClass("first");
	// 	$("#fb .coparating .check:checkbox:checked").parent().remove();
	// 	$(this).removeClass("first");
	// });
	// $("#fb .ending .btn .delete").click(function(){
	// 	$(this).addClass("first").siblings(".btn a").removeClass("first");
	// 	$("#fb .ending .check:checkbox:checked").parent().remove();
	// 	$(this).removeClass("first");
	// });
	// //我的推广 删除选中的活动
	// $("#tg .all_acitves .btn .delete input").click(function(){
	// 	$(this).addClass("first").siblings(".btn a").removeClass("first");
	// 	$("#tg .all_acitves .check:checkbox:checked").parent().remove();
	// 	$(this).removeClass("first");
	// });
	// $("#tg  .doing .btn .delete").click(function(){
	// 	$(this).addClass("first").siblings(".btn a").removeClass("first");
	// 	$("#tg  .doing .check:checkbox:checked").parent().remove();
	// 	$(this).removeClass("first");
	// });
	// $("#tg  .coparating .btn .delete").click(function(){
	// 	$(this).addClass("first").siblings(".btn a").removeClass("first");
	// 	$("#tg  .coparating .check:checkbox:checked").parent().remove();
	// 	$(this).removeClass("first");
	// });
	// $("#tg  .ending .btn .delete").click(function(){
	// 	$(this).addClass("first").siblings(".btn a").removeClass("first");
	// 	$("#tg  .ending .check:checkbox:checked").parent().remove();
	// 	$(this).removeClass("first");
	// });
	//进行中判断有没有选项是否为空,删除选中的
	/*$("#f_doing").validate({
		rules:{
			check:{
				required:true,
			},
		},
		messages:{
			check:{
				required:"请选择你要删除的活动",
			},
		},
	});
	//合作中判断有没有选项是否为空,删除选中的
	$("#f_coparating").validate({
		rules:{
			check1:{
				required:true,
			},
		},
		messages:{
			check1:{
				required:"请选择你要删除的活动",
			},
		},
	});
	//已结束判断有没有选项是否为空,删除选中的
	$("#f_ending").validate({
		rules:{
			check2:{
				required:true,
			},
		},
		messages:{
			check2:{
				required:"请选择你要删除的活动",
			},
		},
	});
	//全部判断有没有选项是否为空,删除选中的
	$("#f_all").validate({
		rules:{
			check3:{
				required:true,
			},
		},
		messages:{
			check3:{
				required:"请选择你要删除的活动",
			},
		},
	});
	//进行中 判断有没有选项是否为空,删除选中的
	$("#f_doing1").validate({
		rules:{
			check4:{
				required:true,
			},
		},
		messages:{
			check4:{
				required:"请选择你要删除的活动",
			},
		},
	});
	//合作中判断有没有选项是否为空,删除选中的
	$("#f_coparating1").validate({
		rules:{
			check5:{
				required:true,
			},
		},
		messages:{
			check5:{
				required:"请选择你要删除的活动",
			},
		},
	});
	//已结束判断有没有选项是否为空,删除选中的
	$("#f_ending1").validate({
		rules:{
			check6:{
				required:true,
			},
		},
		messages:{
			check6:{
				required:"请选择你要删除的活动",
			},
		},
	});
	//全部判断有没有选项是否为空,删除选中的
	$("#f_all1").validate({
		rules:{
			check7:{
				required:true,
			},
		},
		messages:{
			check7:{
				required:"请选择你要删除的活动",
			},
		},
	});*/
	//直接删除活动
	$(".act_title .act_list dd.delete").click(function(){
		alert("您确定要删除吗?");
		$(this).parent().remove();
	});
});
});