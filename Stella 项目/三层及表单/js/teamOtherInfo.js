$(function(){

	//第一层选项被点击展开第二层
	var $itemList = $(".item_list"),
		$first_tit = $itemList.find(".first_tit"),
		$firstInput,
		$item_three,
		$secondInput;
	$first_tit.on("click",function(){
		$firstInput = $(this).find(".first_input");
		if($firstInput.is(":checked")){
			$(this).nextAll(".item_two").show().addClass("required").find(".two_tit").on("click",function(){
				$secondInput = $(this).find(".second_input");
				$item_three =$(this).next(".item_three");
				if($secondInput.is(":checked")){
					$item_three.show().find(".third_input").addClass("required");

				}else{
					$item_three.hide().find(".third_input").removeClass("required").val("");
				}
			})
		}else{
			$(this).next(".item_two").hide().removeClass("required");
		}
	});
	//场地动态添加一项
	var $cdbtn = $(".cdbtn"),
		$matebtn = $(".matebtn"),
		$weibobtn = $(".weibobtn"),
		$otherbtn = $(".otherbtn"),
		$parent = $(".item_three"),
		$inlineform = $(".inline-form-wrap");


	/* $cdbtn.on("click",function(){
		$(this).parent(".item_three").append('<div class="inline-form-wrap clearfix">	<div class="inline-form input-form fl"><span class="type fl">可容纳人数(人):</span><div class="type_list fl"><input  type="text" placeholder="可容纳人数" class="third_input required" data-tip="请输入可容纳人数" data-valid="isNonEmpty||onlyInt" data-error="可容纳人数不能为空||人数只能为整数" name="" ></div></div><div class="inline-form input-form fl"><span class="type fl">租用价格(元):</span><div class="type_list fl"><input class="third_input required" type="text" placeholder="租用价格" data-tip="请输入租用价格" data-valid="isNonEmpty||onlyInt" data-error="租用价格不能为空||价格只能为整数" name="" ></div></div></div>');
	});*/
	//场地动态添加一项
	add($cdbtn,1,'<div class="inline-form-wrap clearfix">	<div class="inline-form input-form fl"><span class="type fl">可容纳人数(人):</span><div class="type_list fl"><input  type="text" placeholder="可容纳人数" class="third_input required" data-tip="请输入可容纳人数" data-valid="isNonEmpty||onlyInt" data-error="可容纳人数不能为空||人数只能为整数" name="" ></div></div><div class="inline-form input-form fl"><span class="type fl">租用价格(元):</span><div class="type_list fl"><input class="third_input required" type="text" placeholder="租用价格" data-tip="请输入租用价格" data-valid="isNonEmpty||onlyInt" data-error="租用价格不能为空||价格只能为整数" name="" ></div></div></div>');
	// 自媒体动态添加一项
	add($matebtn,1,'<div class="inline-form-wrap clearfix"><div class="inline-form input-form fl"><span class="type fl">媒体名称:</span><div class="type_list fl"><input  type="text" placeholder="媒体名称" class="third_input required "  data-tip="请输入媒体名称" data-valid="isNonEmpty" data-error="媒体名称不能为空" name="" ></div></div><div class="inline-form input-form fl"><span class="type fl">订阅数(次):</span><div class="type_list fl"><input  type="text" placeholder="订阅数" class="third_input required" data-tip="请输入订阅数" data-valid="isNonEmpty||onlyInt" data-error="订阅数不能为空||订阅数只能为整数" name="" ></div></div><div class="inline-form input-form fl"><span class="type fl">价格(元):</span><div class="type_list fl"><input class="third_input required" type="text" placeholder="价格" data-tip="请输入价格" data-valid="isNonEmpty||onlyInt" data-error="价格不能为空||价格只能为整数" name="" ></div></div></div>')
	//微博动态添加一项
	add($weibobtn,1,'<div class="inline-form-wrap clearfix">	<div class="inline-form input-form fl"><span class="type fl">微博昵称:</span><div class="type_list fl"><input  type="text" placeholder="昵称名称" class="third_input required" data-tip="请输入微博昵称" data-valid="isNonEmpty" data-error="昵称不能为空" name="" ></div></div><div class="inline-form input-form fl"><span class="type fl">粉丝数(人):</span><div class="type_list fl"><input  type="text" placeholder="粉丝数" class="third_input required" data-tip="请输入粉丝数" data-valid="isNonEmpty||onlyInt" data-error="粉丝数不能为空||粉丝数只能为整数" name="" ></div></div><div class="inline-form input-form fl"><span class="type fl">价格(元):</span><div class="type_list fl"><input class="third_input required" type="text" placeholder="价格" data-tip="请输入价格" data-valid="isNonEmpty||onlyInt" data-error="价格不能为空||价格只能为整数" name="" ></div></div></div>');
	//线下其他宣传方式
	add($otherbtn,1,'<div class="inline-form-wrap clearfix"><div class="inline-form input-form fl"><span class="type fl">其他方式:</span><div class="type_list fl"><input  type="text" placeholder="宣传方式" class="third_input required" data-tip="请输入宣传方式" data-valid="isNonEmpty" data-error="宣传方式不能为空" name="" ></div></div><div class="inline-form input-form fl"><span class="type fl">单张价格(元):</span><div class="type_list fl"><input class="third_input required" type="text" placeholder="价格" data-tip="请输入价格" data-valid="isNonEmpty||onlyInt" data-error="价格不能为空||价格只能为整数" name="" ></div></div><div class="inline-form input-form fl"><span class="type fl">展示时长(小时):</span><div class="type_list fl"><input class="third_input required" type="text" placeholder="展示时长" data-tip="请输入展示时长" data-valid="isNonEmpty||onlyInt" data-error="展示时长不能为空||展示时长只能为整数" name="" ></div></div></div>')
	//动态添加一项的函数封装
	function add(addBtn,num,html){
		addBtn.on("click",function(){
			num++;
			if(num<=2){
				$(this).parent($parent).append(html);
			}else{
				alert("最多只能添加两项");
				return false;
			}
		})
	}

	// 表单验证
	$('#other_info').validate({
		onFocus: function() {
			$(this).addClass('active');
		return false;
		},
		onBlur: function() {
			var _status = parseInt(this.attr('data-status'));
			$(this).removeClass('active');
			if (!_status) {
				$(this).addClass('error');
			}
			return false;
		}
	});
	$('#other_info').on('submit', function(event) {
		 if(!$(this).validate('submitValidate')){
		 	//alert(121);
		 	return false;
		}
	});
})