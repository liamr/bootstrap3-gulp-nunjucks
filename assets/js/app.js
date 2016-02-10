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

      var win = $(window);

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

    init_map: function(data){
      /* An InfoBox is like an info window, but it displays
       * under the marker, opens quicker, and has flexible styling.
       * @param {GLatLng} latlng Point to place bar at
       * @param {Map} map The map on which to display this InfoBox.
       * @param {Object} opts Passes configuration options - content,
       * offsetVertical, offsetHorizontal, className, height, width
       */

      function InfoBox(opts) {
          google.maps.OverlayView.call(this);
          this.latlng_ = opts.latlng;
          this.map_ = opts.map;
          this.content = opts.content;
          this.offsetVertical_ = -195;
          this.offsetHorizontal_ = 5;
          this.height_ = 165;
          this.width_ = 266;
          var me = this;
          this.boundsChangedListener_ =
              google.maps.event.addListener(this.map_, "bounds_changed", function () {
                  return me.panMap.apply(me);
              });
          // Once the properties of this OverlayView are initialized, set its map so
          // that we can display it. This will trigger calls to panes_changed and
          // draw.
          this.setMap(this.map_);
      }
      /* InfoBox extends GOverlay class from the Google Maps API
       */
      InfoBox.prototype = new google.maps.OverlayView();
      /* Creates the DIV representing this InfoBox
       */
      InfoBox.prototype.remove = function () {
          if (this.div_) {
              this.div_.parentNode.removeChild(this.div_);
              this.div_ = null;
          }
      };
      /* Redraw the Bar based on the current projection and zoom level
       */
      InfoBox.prototype.draw = function () {
          // Creates the element if it doesn't exist already.
          this.createElement();
          if (!this.div_) return;
          // Calculate the DIV coordinates of two opposite corners of our bounds to
          // get the size and position of our Bar
          var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
          if (!pixPosition) return;
          // Now position our DIV based on the DIV coordinates of our bounds
          this.div_.style.width = this.width_ + "px";
          this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
          this.div_.style.height = this.height_ + "px";
          this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
          this.div_.style.display = 'block';
      };
      /* Creates the DIV representing this InfoBox in the floatPane. If the panes
       * object, retrieved by calling getPanes, is null, remove the element from the
       * DOM. If the div exists, but its parent is not the floatPane, move the div
       * to the new pane.
       * Called from within draw. Alternatively, this can be called specifically on
       * a panes_changed event.
       */
      InfoBox.prototype.createElement = function () {
          var panes = this.getPanes();
          var div = this.div_;
          if (!div) {
              // This does not handle changing panes. You can set the map to be null and
              // then reset the map to move the div.
              div = this.div_ = document.createElement("div");
                  div.className = "infobox"
              var contentDiv = document.createElement("div");
                  contentDiv.className = "content"
                  contentDiv.innerHTML = this.content;
              var closeBox = document.createElement("div");
                  closeBox.className = "close";
                  closeBox.innerHTML = "x";
              div.appendChild(closeBox);

              function removeInfoBox(ib) {
                  return function () {
                      ib.setMap(null);
                  };
              }
              google.maps.event.addDomListener(closeBox, 'click', removeInfoBox(this));
              div.appendChild(contentDiv);
              div.style.display = 'none';
              panes.floatPane.appendChild(div);
              this.panMap();
          } else if (div.parentNode != panes.floatPane) {
              // The panes have changed. Move the div.
              div.parentNode.removeChild(div);
              panes.floatPane.appendChild(div);
          } else {
              // The panes have not changed, so no need to create or move the div.
          }
      }
      /* Pan the map to fit the InfoBox.
       */
      InfoBox.prototype.panMap = function () {
          // if we go beyond map, pan map
          var map = this.map_;
          var bounds = map.getBounds();
          if (!bounds) return;
          // The position of the infowindow
          var position = this.latlng_;
          // The dimension of the infowindow
          var iwWidth = this.width_;
          var iwHeight = this.height_;
          // The offset position of the infowindow
          var iwOffsetX = this.offsetHorizontal_;
          var iwOffsetY = this.offsetVertical_;
          // Padding on the infowindow
          var padX = 40;
          var padY = 40;
          // The degrees per pixel
          var mapDiv = map.getDiv();
          var mapWidth = mapDiv.offsetWidth;
          var mapHeight = mapDiv.offsetHeight;
          var boundsSpan = bounds.toSpan();
          var longSpan = boundsSpan.lng();
          var latSpan = boundsSpan.lat();
          var degPixelX = longSpan / mapWidth;
          var degPixelY = latSpan / mapHeight;
          // The bounds of the map
          var mapWestLng = bounds.getSouthWest().lng();
          var mapEastLng = bounds.getNorthEast().lng();
          var mapNorthLat = bounds.getNorthEast().lat();
          var mapSouthLat = bounds.getSouthWest().lat();
          // The bounds of the infowindow
          var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
          var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
          var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
          var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
          // calculate center shift
          var shiftLng =
              (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
              (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
          var shiftLat =
              (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
              (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);
          // The center of the map
          var center = map.getCenter();
          // The new map center
          var centerX = center.lng() - shiftLng;
          var centerY = center.lat() - shiftLat;
          // center the map to the new shifted center
          map.setCenter(new google.maps.LatLng(centerY, centerX));
          // Remove the listener after panning is complete.
          google.maps.event.removeListener(this.boundsChangedListener_);
          this.boundsChangedListener_ = null;
      };

      function initialize() {
          var markers = []; // makers array
        
          var myOptions = { // map settings
              zoom: 8,
              center: new google.maps.LatLng(-33.397, 150.644),
              sensor: 'true'
          }
          var styles = [
          {
            stylers: [
              { hue: "#00ffe6" },
              { saturation: -100 }
            ]
          }
        ];
          var map = new google.maps.Map(document.getElementById("canvas-map"), myOptions);

          map.setOptions({styles: styles});
        
          for (var i = 0; i < data.length; i++) {
                var current = data[i];
            
                var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(current.position.lat, current.position.lng),
                  map: map,
                  content: current.content
                });
            
                markers.push(marker);
            
                google.maps.event.addListener(markers[i], "click", function (e) {
                  var infoBox = new InfoBox({
                      latlng: this.getPosition(),
                      map: map,
                      content: this.content
                  });
                });
              }

              google.maps.event.addDomListener(window, 'load', initialize);
          google.maps.event.addDomListener(window, "resize", function() {
           var center = map.getCenter();
           google.maps.event.trigger(map, "resize");
           map.setCenter(center); 
          });
      }

      initialize();
    }

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

