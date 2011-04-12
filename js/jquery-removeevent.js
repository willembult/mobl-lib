/*!
 * jQuery Remove event
 * 
 * Copyright 2011, Willem Bult
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://docs.jquery.com/License
 * 
 */

(function($) {
	var orig = $.fn.remove;
	
	$.fn.remove = function() {
		this.trigger("remove");
		return orig.apply( this, arguments );
	}
})(jQuery);