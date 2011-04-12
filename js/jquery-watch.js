(function($) {
	$.fn.watch = function(props, func, interval, id) {
		// / <summary>
		// / Allows you to monitor changes in a specific
		// / CSS property of an element by polling the value.
		// / when the value changes a function is called.
		// / The function called is called in the context
		// / of the selected element (ie. this)
		// / </summary>
		// / <param name="prop" type="String">CSS Properties to watch sep. by
		// commas</param>
		// / <param name="func" type="Function">
		// / Function called when the value has changed.
		// / </param>
		// / <param name="interval" type="Number">
		// / Optional interval for browsers that don't support DOMAttrModified
		// or propertychange events.
		// / Determines the interval used for setInterval calls.
		// / </param>
		// / <param name="id" type="String">A unique ID that identifies this
		// watch instance on this element</param>
		// / <returns type="jQuery" />
		if (!interval)
			interval = 100;
		if (!id)
			id = "_watcher";

		return this.each(function() {
			var _t = this;
			var el$ = $(this);
			var fnc = function() {
				__watcher.call(_t, id)
			};

			var data = {
				id : id,
				props : props.split(","),
				vals : [ props.split(",").length ],
				func : func,
				fnc : fnc,
				origProps : props,
				interval : interval,
				intervalId : null
			};
			// store initial props and values
			$.each(data.props, function(i) {
				data.vals[i] = el$.css(data.props[i]);
			});

			el$.data(id, data);

			hookChange(el$, id, data);
		});

		function hookChange(el$, id, data) {
			el$.each(function() {
				var el = $(this);
				if (typeof (el.get(0).onpropertychange) == "object")
					el.bind("propertychange." + id, data.fnc);
				else if ($.browser.mozilla)
					el.bind("DOMAttrModified." + id, data.fnc);
				else
					data.intervalId = setInterval(data.fnc, interval);
			});
		}
		function __watcher(id) {
			var el$ = $(this);
			var w = el$.data(id);
			if (!w)
				return;
			var _t = this;

			if (!w.func)
				return;

			// must unbind or else unwanted recursion may occur
			el$.unwatch(id);

			var changed = false;
			var i = 0;
			for (i; i < w.props.length; i++) {
				var newVal = el$.css(w.props[i]);
				if (w.vals[i] != newVal) {
					w.vals[i] = newVal;
					changed = true;
					break;
				}
			}
			if (changed)
				w.func.call(_t, w, i);

			// rebind event
			hookChange(el$, id, w);
		}
	}
	$.fn.unwatch = function(id) {
		this.each(function() {
			var el = $(this);
			var data = el.data(id);
			try {
				if (typeof (this.onpropertychange) == "object")
					el.unbind("propertychange." + id, data.fnc);
				else if ($.browser.mozilla)
					el.unbind("DOMAttrModified." + id, data.fnc);
				else
					clearInterval(data.intervalId);
			}
			// ignore if element was already unbound
			catch (e) {
			}
		});
		return this;
	}
})(jQuery);