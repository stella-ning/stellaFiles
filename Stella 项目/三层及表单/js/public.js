$(function(){
	//顶部广告
	$("#Top_wrap img.close").click(function(){
		$("#Top_wrap").slideUp();//慢慢向上收缩
		$("#h_top").css("top","0px");
	});


	//搜索按钮事件
	$("#h_search .h_select li").click(function(){
		$(this).addClass("on").siblings().removeClass("on");
	});

	$('#search_submit').click(function(){
		var input = "<input type='hidden' name='type' value='" + $('li.on').text() + "'/>";
		$('#search_submit').append(input);
		$('#search_form').attr('action',"/Search/siteSearch.html");
	})

	//导航点击点击样式
	$("header #h_nav ul li").click(function(){
		$(this).addClass("cur").siblings("header #h_nav ul li").removeClass("cur");
	});
	//---登陆弹出 开始---
	var x=0;
	var y=0;
	var left=0;
	var top=0;
	var kf=1;//当没有触发事件时,自定义事件 ,kf=1不能启动,kf=2能启动

	//保持登录状态
	$(".hold").click(function(){
		$(this).find("span").toggleClass("checked");
	});

	/*登录弹窗开始*/
	//点击登录按钮弹出登录框
	$("#login_btn").click(function(){
		$("#mask,#wrap").fadeIn();
		auto();
	});
	
	//点击关闭按钮关闭登录框
	$("#close_btn img").click(function(){
		$("#mask,#wrap").fadeOut();
		auto();
	});
	//浏览器窗口大小改变时,登录框依然要在浏览器居中位置
	$(window).resize(function(){
		auto();
	});

	//设置弹窗居中位置
	function auto(){
		var L = ( $(window).width()-$("#wrap").width() ) / 2;
		//alert(L);
		var T = ( $(window).height()-$("#wrap").height() ) / 2;
		$("#wrap").css({left:L,top:T});
	}
	/*表单验证开始*/ 
	$('#login input').focus(function(){
		$(this).removeClass('error').addClass('focus');
	}).blur(function(){
		$(this).removeClass('focus');
		var regex = new RegExp($(this).attr('regex'));
		if(!regex.test($(this).val())){
			$(this).addClass('error');
		}else{
			$(this).addClass('focus');
		}
	});
	$("#form").submit(function(){
		submit();
		return false;
	});
	function submit(){
		//alert(12312346);
		$(".noNull").each(function(){
			var name = $(this).attr("name");
			if($(this).val()==""){
				$(this).addClass('error');
				alert($(this).attr('notNull')+"不能为空");
				return false;
			}
		})
		
	}
	/*表单验证结束*/ 
	//---登陆弹出 结束---

	//--右边悬浮导航开始--
	//获取之前滚动条与顶部的距离
	var lastScrollTop = $(window).scrollTop();
	$(document).scroll(function(){
		//alert(1215);
		//获取当前滚动条与顶部的距离
		var ScrollTop = $(window).scrollTop();
		
		if(ScrollTop <= 200){
			$("#stair_nav").hide();
		}else{
			$("#stair_nav").show();
			}
		//获取之前滚动条与顶部的距离
		lastScrollTop=$(window).scrollTop();
	});
	//alert(12123);

	//点击返回顶部
	$("#s_to_top").click(function(){
		//alert(111);
		$('html,body').animate({scrollTop:'0px'},1000);
	});
	//--右边悬浮导航结束--


	//个人中心左边导航点击效果
	
	$("#left .menu_list").click(function(){
		$(this).addClass("cur").siblings("#left .menu_list").removeClass("cur");
	});
	$("#left .none").click(function(){
		alert("此功能正在维护中");
	});

});