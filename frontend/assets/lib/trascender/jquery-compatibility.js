// Compatibilidad para plugins antiguos con jQuery 4+ como summernote (database)
(function ($) {
  $.now        = $.now        || Date.now;
  $.unique     = $.unique     || $.uniqueSort;
  $.isFunction = $.isFunction || function (x) { return typeof x === "function"; };
  $.isArray    = $.isArray    || Array.isArray;
  $.trim       = $.trim       || function (s) { return s == null ? "" : String(s).trim(); };
  $.parseJSON  = $.parseJSON  || JSON.parse;
  $.isNumeric  = $.isNumeric  || function (x) {
    var t = typeof x;
    return (t === "number" || t === "string") && !isNaN(x - parseFloat(x));
  };
  $.isWindow   = $.isWindow   || function (o) { return o != null && o === o.window; };
  $.nodeName   = $.nodeName   || function (el, name) {
    return el.nodeName && el.nodeName.toLowerCase() === name.toLowerCase();
  };
})(jQuery);