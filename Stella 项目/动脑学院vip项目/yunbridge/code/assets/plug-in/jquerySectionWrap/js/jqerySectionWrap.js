
(function(root,factory,plug){
	factory(root.jQuery,plug)
})(window,function($,plug){
	//设置默认属性
	var __DEFAULTS__ = {
		showSerial : true//是否显示serial按钮
	};
	//插件的功能
	var __PROTOTYPE__ = {

		//初始化架构层面dom结构的样式,一些变量,属性
		_init:function(){
			this.addClass('.section-wrapper')
			.find('ul:first').addClass('section-wrap section-animate')
			.children('li').addClass('section');
			//变量
			this.$sectionWrap = this.find('.section-wrap');
			this.$section = this.$sectionWrap.find('li.section');
			//当前索引
			this.index = 0;
			//最大的索引
			this.last = this.$section.length-1;
			this.lock = true;
		},
		//生成右侧的序列按钮
		_serial:function(){
			var _$this = this;
			if(!this.showSerial) return;
			this.$serials = $('<ul></ul>');
			for(var i = 0;i<this.$section.length;i++){
				this.$serials.append("<li class='"+(!i?"curr":"")+"'><a href='#'></a></li>");
			}
			this.$serials.addClass('serial');
			this.append(this.$serials);
			//点击事件

			this.$serials.find('li').on('click',function(){
				var $this = $(this);
				var beforeIndex = _$this.index;
				_$this.index = $this.index();
				//index取最小值,最大不能大于last
				_$this.index = Math.min(_$this.index,_$this.last);
				//index去最大值,最小不能小于0;
				_$this.index = Math.max(_$this.index,0);
				//判断index++--之后的index是否与beforeIndex相等,如果相等导航就不滑动
				//console.log(_$this.index);
				if(beforeIndex == _$this.index){
					_$this.lock = true;
					return;
				}
				$this.addClass('curr').siblings().removeClass('curr');
				_$this._attachEvent('beforeWheel',{
					before : beforeIndex,
					beforeDOM : _$this.$section.eq(beforeIndex),
					after : _$this.index,
					afterDOM : _$this.$section.eq(_$this.index)
				})
				_$this.$sectionWrap.css({
					"transform": "translateY(-"+_$this.index+"00%)",
					"-moz-transform": "translateY(-"+_$this.index+"00%)",
					"-webkit-transform": "translateY(-"+_$this.index+"00%)",
					"-o-transform": "translateY(-"+_$this.index+"00%)"
				});
				setTimeout(function(){
					_$this.lock = true;
					_$this._attachEvent('afterWheel',{
						before : beforeIndex,
						beforeDOM : _$this.$section.eq(beforeIndex),
						after : _$this.index,
						afterDOM : _$this.$section.eq(_$this.index)
					});
				},1000);
				console.log(beforeIndex +'---'+ _$this.index);
			});

		},
		//封装自定义事件
		_attachEvent:function(event,args){
			this.trigger(event,args);
		},

		//滚轮事件
		_bind:function(){
			var _$this = this;
			this.on('mousewheel',function(e){
				if(_$this.lock){
					_$this.lock = false;
					//小于0 向上滚,大于0向下滚
					var dir = e.originalEvent.deltaY < 0;
					//console.log(dir)
					//设置beforeIndex 等于当前的index
					var beforeIndex = _$this.index;
					dir?_$this.index--:_$this.index++;
					//index取最小值,最大不能大于last
					_$this.index = Math.min(_$this.index,_$this.last);
					//index去最大值,最小不能小于0;
					_$this.index = Math.max(_$this.index,0);
					//判断index++--之后的index是否与beforeIndex相等,如果相等导航就不滑动
					if(beforeIndex == _$this.index){
						_$this.lock = true;
						return;
					}
					_$this._attachEvent('beforeWheel',{
						before : beforeIndex,
						beforeDOM : _$this.$section.eq(beforeIndex),
						after : _$this.index,
						afterDOM : _$this.$section.eq(_$this.index)
					})
					_$this.$sectionWrap.css({
						"transform": "translateY(-"+_$this.index+"00%)",
						"-moz-transform": "translateY(-"+_$this.index+"00%)",
						"-webkit-transform": "translateY(-"+_$this.index+"00%)",
						"-o-transform": "translateY(-"+_$this.index+"00%)"
					});
					setTimeout(function(){
						_$this.lock = true;
						_$this._attachEvent('afterWheel',{
							before : beforeIndex,
							beforeDOM : _$this.$section.eq(beforeIndex),
							after : _$this.index,
							afterDOM : _$this.$section.eq(_$this.index)
						});
						_$this.$serials
							.children().eq(_$this.index).addClass("curr").siblings().removeClass("curr");
					},1000);

				}
			})
		}
	}
	$.fn[plug] = function(options){
		//扩展功能
		this.extend(this,__PROTOTYPE__,__DEFAULTS__,options);
		//调用功能函数
		this._init();
		this._bind();
		this._serial();
		return this;


	}
},'sectionWrap');


// $(function(){
// 	var $sectionWrap = $('.section-wrap'),
// 		$section = $sectionWrap.find('.section'),
// 	 	$head = $('.nav-bar'),
// 		index = 0,
// 		last = $section.length - 1,
// 		lock = true;
// 	//滚动之前
// 	function onBeforeWheel(index){
// 		$head.addClass('hide');
// 		$(".section-2").removeClass("action");
// 	}
// 	//滚动之后
// 	function onAfterWheel(index){
// 		if(index==0){
// 			$head.removeClass('nav-small').addClass('nav-big');
// 		}else{
// 			$head.removeClass('nav-big').addClass('nav-small');
// 		}
// 		if(index==1){
// 			$(".section-2").addClass("action");
// 		}
// 		$head.removeClass("hide");
//
// 	}
// 	//滚轮事件
// 	$(document.body).on('mousewheel',function(e){
// 		if(lock){
// 			lock = false;
// 			//小于0 向上滚,大于0向下滚
// 			var dir = e.originalEvent.deltaY < 0;
// 			//console.log(dir)
// 			//设置beforeIndex 等于当前的index
// 			var beforeIndex = index;
// 			dir?index--:index++;
// 			//index取最小值,最大不能大于last
// 			index = Math.min(index,last);
// 			//index去最大值,最小不能小于0;
// 			index = Math.max(index,0);
// 			//判断index++--之后的index是否与beforeIndex相等,如果相等导航就不滑动
// 			//console.log(beforeIndex+":"+index);
// 			if(beforeIndex == index){
// 				lock = true;
// 				return;
// 			}
// 			onBeforeWheel(beforeIndex);
// 			$sectionWrap.css({
// 				"transform": "translateY(-"+index+"00%)",
// 				"-moz-transform": "translateY(-"+index+"00%)",
// 				"-webkit-transform": "translateY(-"+index+"00%)",
// 				"-o-transform": "translateY(-"+index+"00%)"
// 			});
// 			setTimeout(function(){
// 				lock = true;
// 				onAfterWheel(index);
// 			},1000);
// 			console.log(index);
// 		}
// 	})
// })
