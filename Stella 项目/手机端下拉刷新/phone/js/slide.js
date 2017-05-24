;
(function($, window, document, undefined){
	'use strict';
	
	var pluginName = 'slideDownRefresh',
		defaults = {};
	
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this.init();
		this.render(this.element); 
		this.eventHandle(); //绑定事件
	}
	
	Plugin.prototype = {
		init: function(){
			this.defaults = defaults;
			this.name = pluginName;
			this._start = 0;
			this._end = 0; //私有属性值
		},
		render: function(ele){
			$(ele).prepend([
				'<div class="slideDown">',
				'<div class="sliding">',
				'<p>下拉刷新</p>',
				'</div>',
				'<div class="slided">',
				'<p>正在刷新···</p>',
				'</div>',
				'</div>',
			].join(''));
			
			this.$sliding = $(ele).find('.sliding');
			this.$slided = $(ele).find('.slided');
			
		},
		eventHandle: function() {
			this.touchStart(this.element);
		},
		touchStart: function(ele){
			var _self = this; //先缓存我们的this,self 减少资源损耗
			$(ele).on('touchstart', function(e){
				var touch = e.targetTouches[0];
				_self._start = touch.pageY;
				_self.touchMove(_self.element);
			});
		},
		touchMove: function(ele){
			var _self = this;
			$(ele).on('touchmove', function(e){
				var touch = e.targetTouches[0];
				_self._end =( _self._start - touch.pageY);
				
				if(_self._end < 0){
					_sliding.call(_self, _self._end);
				}
				_self.touchEnd(_self.element);
			});
			
			function _sliding(dist){
				this.$slided.css('display', 'none');
				this.$sliding.css({
					'display': 'block',
					height: -dist + 'px'
				})
			}
		},
		touchEnd: function(ele){
			var _self = this;
			$(ele).on('touchend', function(e){
				if(_self._end < -70){
					//刷新成功
					_slided.call(_self);
					setTimeout(function(){
						_reset().call(_self);
					}, 3000);
					
				} else {
					_onslide.call(_self);
				}
				
				$(this).unbind('touchstart');
				$(this).unbind('touchmove');
			});
			//下拉松开方法
			
			function _slided() {
				_self.$sliding.css({
					display: "none",
					height: 0
				});
				_self.$slided.css('display', 'block');
			}
			
			function _onslide(){
				_self.$sliding.css({
					display: "none",
					height: 0
				});
				_self.$slided.css('display', 'none');
			}
			function _reset() {
				window.location.reload();
				_self.$sliding.css('display', 'none');
				_self.$slided.css('display', 'none');
			}
		}
	}
	
	
	$.fn[pluginName] = function(options) {
		return this.each(function(){
			if(!$(this).data('plugin_' + pluginName)) {
				return $(this).data('plugin_' + pluginName, new Plugin(this, options));
			}
		})
	}
	
	
})(Zepto, window, document);

