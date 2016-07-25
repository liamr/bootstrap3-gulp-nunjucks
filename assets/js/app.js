
/*
  _Project!
     __   _              ___
    / /  (_)__ ___ _    / _ \
   / /__/ / _ `/  ' \  / , _/
  /____/_/\_,_/_/_/_/ /_/|_|

*/

// --------------------------------------------------------------------------------------------------------------

//APP

APP = {
  initial_run : true,

  nav : null,

  common: {
    init: function() {

      log("APP.js Loaded");

      //VARS

      APP.window = $(window);
      APP.document = $(document);
      APP.html = $('html');
      APP.body = $('body');
      APP.grid = $('.grid');
      APP.Modernizr = window.Modernizr;
      APP.history = window.history;

      //APP.common.init_mobilenav();

      //Bootstrap
      $('[data-toggle="popover"]').popover()
      $('[data-toggle="tooltip"]').tooltip()

      //BEHAVIOURS
      APP.LoadBehavior();

      //Run AJAXIFY once
      if(APP.initial_run){
        /*require(['ajaxify'], function(module){

          module.init();

        });*/

      }

      $(window).trigger('resize');

      APP.initial_run = false;

      /*$(".carousel").owlCarousel({
        center: true,
        items:1,
        nav: true,
        navText: ['<i class="icon icon-arrow-left"></i>','<i class="icon icon-arrow-right"></i>'],
        loop: true
      });*/

    },
  },

};

//BEHAVIOURS

/* look through the document (or ajax'd in content if "context" is defined) to look for "data-behavior" attributes.
Initialize a new instance of the method if found, passing through the element that had the attribute
So in this example it will find 'data-behavior="show_articles"' and run the show_articles method.
*/
APP.LoadBehavior = function(context){
  if(context === undefined){
    context = $(document);
  }

  context.find("*[data-behavior]").each(function(){
    var that = $(this);
    var behaviors = that.attr('data-behavior');

    $.each(behaviors.split(" "), function(index,behaviorName){

      require(['behaviors/' + behaviorName], function(module){

          //Init Module

          try {
            module.init(that);
          }
          catch(e){
            // No Operation
            log('error init: ' + e);
          }



      });


    });
  });
};

UTIL = {
  exec: function( controller, action ) {
    var ns = APP,
        action = ( action === undefined ) ? "init" : action;

    if ( controller !== "" && ns[controller] && typeof ns[controller][action] == "function" ) {
      ns[controller][action]();
    }
  },

  init: function() {
    var body = document.body,
        controller = body.getAttribute( "data-controller" ),
        action = body.getAttribute( "data-action" );

    UTIL.exec( "common" );
    UTIL.exec( controller );
    UTIL.exec( controller, action );
  },
  get_param: function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
};

//INIT

jQuery(document).ready(function(){
    UTIL.init();
});



// UTILS

APP.ua = navigator.userAgent;
APP.click_event = (is_touch_device()) ? "touchstart" : "click";

// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};

function isIpad() {
  return !!navigator.userAgent.match(/iPad/i);
};

function isIphone () {
  return !!navigator.userAgent.match(/iPhone/i);
};

function isIpod() {
  return !!navigator.userAgent.match(/iPod/i);
};

function isAppleIos() {
  return (isIpad() || isIphone() || isIpod());
};

function is_touch_device() {
    return !!('ontouchstart' in window) // works on most browsers
        || !!('onmsgesturechange' in window); // works on ie10
  };

function jquery_extensions(){
  (function($) {

    $.fn.visible = function(partial) {

        var $t            = $(this),
            $w            = $(window),
            viewTop       = $w.scrollTop(),
            viewBottom    = viewTop + $w.height(),
            _top          = $t.offset().top,
            _bottom       = _top + $t.height(),
            compareTop    = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;

      return ((compareBottom <= (viewBottom)) && (compareTop >= viewTop));

    };

    })(jQuery);

    (function($,sr){

      // debouncing function from John Hann
      // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
      var debounce = function (func, threshold, execAsap) {
          var timeout;

          return function debounced () {
              var obj = this, args = arguments;
              function delayed () {
                  if (!execAsap)
                      func.apply(obj, args);
                  timeout = null;
              };

              if (timeout)
                  clearTimeout(timeout);
              else if (execAsap)
                  func.apply(obj, args);

              timeout = setTimeout(delayed, threshold || 100);
          };
      }
      // smartresize
      jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    })(jQuery,'smartresize');
}
