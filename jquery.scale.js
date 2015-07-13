(function($) {
    function Scale(id) {
        if (!id) {
            return false;
        }
        var that = this;

		that.scaleEl = $('#'+id);
		that.pointerEl = that.scaleEl.find('[data-type="pointer"]');
		that.maxEl = that.scaleEl.find('[data-type="max"]');
		that.currentEl = that.scaleEl.find('[data-type="current"]');
    }

    $.extend(Scale.prototype, {
        maxNum: 0,
        currentNum: 0,
        on: function(event, cb) {
            $(this).on(event, cb);
        },
        fire: function(event, data) {
            $(this).trigger(event, data);
        },
        init: function() {
			this.bind();
        },
		setValue: function(max, val){
			var that = this;
			that.maxNum = max;
			that.currentNum = val;
			that.check(); 
		},
		check: function(){
			var that = this;
			that.maxEl.html(that.maxNum);
			that.currentEl.html(that.currentNum);
			that.pointerEl.css('top', 50+(1-that.currentNum/that.maxNum)*400);
		},
		bind: function(){
			var that = this;
			var dragging = false;
	        var iX, iY;
	        var selectNum;
	        that.pointerEl.mousedown(function(e) {
	        	if(!that.maxNum){
	        		return false;
	        	}
	            dragging = true;
	            iX = e.clientX - this.offsetLeft;
	            iY = e.clientY - this.offsetTop;
	            this.setCapture && this.setCapture();
	            return false;
	        });
	        $(document).mousemove(function(e) {
	            if (dragging) {
	                var e = e || window.event;
	                var oX = e.clientX - iX;
	                var oY = e.clientY - iY;
	                var num = oY-50;
	                if(num>0 && num<400){
	                	that.pointerEl.css('top', oY);
		                selectNum = Math.ceil((1-num/400)*that.maxNum);
						that.currentEl.html(selectNum);
	                }
	                return false;
	            }
	        }) ;
	        $(document).mouseup(function(e) {
	        	if(!dragging){
	        		return;
	        	}
	            dragging = false;
	            this.releaseCapture && this.releaseCapture();
	            e.cancelBubble = true;
	            if(selectNum != that.currentNum){
	            	that.currentNum = selectNum;
	            	that.fire('change', [that.currentNum]);
	            } 
	        })
		}
    });

    $.scale = {};
    $.scale.instance = function(nodeId) {
        return new Scale(nodeId);
    }
}(jQuery));
