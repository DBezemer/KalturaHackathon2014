var HEAD_LOCATION;
var BG_IMAGE_NAME;
var BG_IMAGE;

var ALL_JS_LOADED = false;

var video_top_angle=0.0; //45;
var video_bottom_angle=180.0; //135;
var video_left_angle=0;
var video_right_angle=360;
	var videoElement;
	var canvasElement;
	var targetElementForOSV;
//	var THREE=THREE||{REVISION:"58"};
	//Function from http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
	function loadjscssfiles(filenames, filetype, callback){
		callback=callback||function(){};
		filename=filenames[0];
		var actualCallback;
		if(filenames.length>1)
		{
			nextFilenames=filenames.slice(1);
			actualCallback=function(){console.log('loaded js ',filename, 'next: ', nextFilenames);loadjscssfiles(nextFilenames, filetype, callback)};
		} else actualCallback=callback;
 		if (filetype=="js"){ //if filename is a external JavaScript file
  			var fileref=document.createElement('script');
  			fileref.setAttribute("type","text/javascript");
  			fileref.setAttribute("src", filename);
  			fileref.onload = actualCallback;
  			document.head.appendChild(fileref);
 		}
 		else if (filetype=="css"){ //if filename is an external CSS file
  			var fileref=document.createElement("link");
  			fileref.setAttribute("rel", "stylesheet");
  			fileref.setAttribute("type", "text/css");
  			fileref.setAttribute("href", filename);
  			fileref.onload = actualCallback;
  			document.body.appendChild(fileref);
 		}
 		if (typeof fileref!="undefined")
 		{
  			document.getElementsByTagName("head")[0].appendChild(fileref);
  			document.body.appendChild(fileref);
  		}
	}
	
		//loadjscssfiles(['js/jquery-ui.min.js','js/jquery.base64.min.js','js/zpipe.min.js','js/three.js','js/RequestAnimationFrame.js','js/gamepad.js','js/vr.js','js/OculusRiftEffect.js','js/panoVid.js'],'js', runIfNeeded);
	loadjscssfiles(['js/three.js','js/RequestAnimationFrame.js','js/gamepad.js','js/vr.js',
						"js/shaders/CopyShader.js","js/shaders/DotScreenShader.js",
						"js/shaders/RGBShiftShader.js","js/postprocessing/EffectComposer.js",
						"js/postprocessing/RenderPass.js",
						"js/postprocessing/MaskPass.js",
						"js/postprocessing/ShaderPass.js",
						'js/OculusRiftEffect.js','js/panoVid.js'],'js', runIfNeeded);
	


  	
	
	/* stemokowski
		loadjscssfile('TestDynamic.js','js')
  			loadjscssfile("js/Three.js",'js');
  			loadjscssfile("js/Detector.js",'js');
  			loadjscssfile("js/Stats.js",'js');
  			loadjscssfile("js/OrbitControls.js",'js');
  			loadjscssfile("js/THREEx.KeyboardState.js",'js');
  			loadjscssfile("js/THREEx.FullScreen.js",'js');
  			loadjscssfile("js/THREEx.WindowResize.js",'js');
  			loadjscssfile("js/jquery-ui.js",'js');
  			loadjscssfile("js/info.js",'js');
  			loadjscssfile("css/jquery-ui.css",'css');
  			loadjscssfile("css/info.css",'css');
  			loadjscssfile("js/stemkowski.js",'js');
  			*/
  		
	function runIfNeeded(){
		if(ALL_JS_LOADED) return;
		ALL_JS_LOADED=true;
		startPanoWrapper();
	}
	
	function testMetaData(){
				embedPlayer=targetElementForOSV;
			var customDataList = embedPlayer.evaluate('{mediaProxy.entryMetadata}');
			console.log('metadata', customDataList);
			//jQuery.each( customDataList, function( key, val ){
			//	console.log('metadata key=',key,' value=', value);
			//})
			//console.log(cust;
		}
	
	
	function setUpCanvas(){
		try{
		var videoElements = document.getElementsByTagName('video');
		if(videoElements.length==0) return;
		videoElement = videoElements[0];
		if(videoElement){
		videoElement.crossOrigin='Anonymous';
		if(videoElement.parentNode.getElementsByTagName('canvas').length==0){
		videoElement.style.visibility="hidden";
		console.log(videoElement.style.visible);
		canvasElement=document.createElement('canvas');
		canvasElement.style.position="absolute";
		canvasElement.style.width="100%";
		canvasElement.style.height="100%";
		canvasElement.style.margin="0";
		canvasElement.style.padding="0";
		canvasElement.autofocus="true";
		canvasElement.id='customRenderingCanvas';
		videoElement.parentNode.appendChild(canvasElement);
		
		if(window.setUpVideoForTexture)
			setUpVideoForTexture();
		}
		}
		//initSD();
		//animateSD();
		}
		catch (e)
		{
			 var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
   		   .replace(/^\s+at\s+/gm, '')
      		.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
      		.split('\n');
  			console.log(stack);

    		alert(e.message)
		}
	}
	
	function startPanoWrapper(){
		try{
		startPano();
		//testMetaData();
		}
		//initSD();
		//animateSD();
		catch (e)
		{
			 var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
   		   .replace(/^\s+at\s+/gm, '')
      		.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
      		.split('\n');
  			console.log(stack);

    		alert(e.message)
		}
	}
		
	function oculusButtonPlugin ( mwOutsideDelegate ) {"use strict";
		var mw=mwOutsideDelegate.delegateTarget;
	mw.PluginManager.add( 'oculusFullScreenBtn', mw.KBaseComponent.extend({

		defaultConfig: {
			"align": "right",
			"parent": "controlsContainer",
			"order": 51,
			"showTooltip": true,
			"displayImportance": "high"
		},

		offIconClass: 'icon-expand',
		onIconClass: 'icon-contract',

		enterFullscreenTxt: 'Oculus Rift mode',
		exitFullscreenTxt: gM( 'mwe-embedplayer-player_closefullscreen' ),
			
		setup: function( embedPlayer ) {
			this.addBindings();
		},
		isSafeEnviornment: function(){
			return mw.getConfig( 'EmbedPlayer.EnableFullscreen' );
		},
		getComponent: function() {
			var _this = this;
			if( !this.$el ) {
				this.$el = $( '<button />' )
							.attr( 'title', this.enterFullscreenTxt )
							.addClass( "btn " + this.offIconClass + this.getCssClass() )
							.click( function() {
								USE_RIFT=true;
								_this.toggleFullscreen();
							});
			}
            this.setAccessibility(this.$el,this.enterFullscreenTxt);
			return this.$el;
		},
		addBindings: function() {
			var _this = this;
			// Add double click binding
			this.bind('dblclick', function(){
				_this.toggleFullscreen();
			});
			// Update fullscreen icon
			this.bind('onOpenFullScreen', function() {
				_this.getComponent().removeClass( _this.offIconClass ).addClass( _this.onIconClass );
				_this.updateTooltip( _this.exitFullscreenTxt );
                _this.setAccessibility(_this.$el,_this.exitFullscreenTxt);
                
			});
			this.bind('onCloseFullScreen', function() {
				_this.getComponent().removeClass( _this.onIconClass ).addClass( _this.offIconClass );
				_this.updateTooltip( _this.enterFullscreenTxt );
                _this.setAccessibility(_this.$el,_this.enterFullscreenTxt);
                USE_RIFT=false;
			});
		},
		toggleFullscreen: function() {
			this.getPlayer().toggleFullscreen();
		}
	}));

};

//Based on fullScreenBtn

	function noOculusButtonPlugin ( mwOutsideDelegate ) {"use strict";
		var mw=mwOutsideDelegate.delegateTarget;
	mw.PluginManager.add( 'noOculusFullScreenBtn', mw.KBaseComponent.extend({

		defaultConfig: {
			"align": "right",
			"parent": "controlsContainer",
			"order": 51,
			"showTooltip": true,
			"displayImportance": "high"
		},

		offIconClass: 'icon-expand',
		onIconClass: 'icon-contract',

		enterFullscreenTxt: 'Full screen mode',
		exitFullscreenTxt: gM( 'mwe-embedplayer-player_closefullscreen' ),
			
		setup: function( embedPlayer ) {
			this.addBindings();
		},
		isSafeEnviornment: function(){
			return mw.getConfig( 'EmbedPlayer.EnableFullscreen' );
		},
		getComponent: function() {
			var _this = this;
			if( !this.$el ) {
				this.$el = $( '<button />' )
							.attr( 'title', this.enterFullscreenTxt )
							.addClass( "btn " + this.offIconClass + this.getCssClass() )
							.click( function() {
								USE_RIFT=false;
								_this.toggleFullscreen();
							});
			}
            this.setAccessibility(this.$el,this.enterFullscreenTxt);
			return this.$el;
		},
		addBindings: function() {
			var _this = this;
			// Add double click binding
			this.bind('dblclick', function(){
				_this.toggleFullscreen();
			});
			// Update fullscreen icon
			this.bind('onOpenFullScreen', function() {
				_this.getComponent().removeClass( _this.offIconClass ).addClass( _this.onIconClass );
				_this.updateTooltip( _this.exitFullscreenTxt );
                _this.setAccessibility(_this.$el,_this.exitFullscreenTxt);
                
			});
			this.bind('onCloseFullScreen', function() {
				_this.getComponent().removeClass( _this.onIconClass ).addClass( _this.offIconClass );
				_this.updateTooltip( _this.enterFullscreenTxt );
                _this.setAccessibility(_this.$el,_this.enterFullscreenTxt);
                USE_RIFT=false;
			});
		},
		toggleFullscreen: function() {
			this.getPlayer().toggleFullscreen();
		}
	}));

};

( function( mw, $ ) { "use strict";
    	/*
    	

<script src="js/Three.js"></script>
<script src="js/Detector.js"></script>
<script src="js/Stats.js"></script>
<script src="js/OrbitControls.js"></script>
<script src="js/THREEx.KeyboardState.js"></script>
<script src="js/THREEx.FullScreen.js"></script>
<script src="js/THREEx.WindowResize.js"></script>

<!-- jQuery code to display an information button and box when clicked. -->
<script src="js/jquery-1.9.1.js"></script>
<script src="js/jquery-ui.js"></script>
<link rel=stylesheet href="css/jquery-ui.css" />
<link rel=stylesheet href="css/info.css"/>
<script src="js/info.js"></script>*/

var callback = function(allmutations) {

	// Since allmutations is an array,
	// we can use JavaScript Array methods.
	allmutations.map( function(mr) {
		// Log the type of mutation
		var mt = 'Mutation type: ' + mr.type;
		// Log the node affected.
		mt += 'Mutation target: ' + mr.target;
		//console.log( mt );
		if(mr.target.tagName.toLowerCase()==='video')
			setUpCanvas();
	});

},
mo = new MutationObserver(callback),
options = {
	// Required, and observes additions
	// or deletion of child nodes
	'childList': true,
	// Observes the addition or deletion
	// of “grandchild” nodes
	'subtree': true
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  //if (event.origin !== "http://example.org:8080")
  //  return;
 var curResult=JSON.parse(event.data);
	if('metaData' in curResult)
	{
		video_top_angle=parseFloat(curResult.metaData.TopAngle);
		video_bottom_angle=parseFloat(curResult.metaData.BottomAngle);
		video_left_angle=parseFloat(curResult.metaData.LeftAngle);
		video_right_angle=parseFloat(curResult.metaData.RightAngle);
	} else if ('headTracking' in curResult)
	{
		//console.log('head tracking: ', curResult.headTracking);
		HEAD_LOCATION=curResult.headTracking;
	}
  // ...
}

mo.observe(document.body, options);
	

	mw.addKalturaConfCheck(function( embedPlayer, callback ) {
		mw.log("ExternalResources:: IframeCustomPluginJs1:: CheckConfig");
		embedPlayer.setKDPAttribute("myCustomPlugin", "foo", "bar");
		targetElementForOSV=embedPlayer;
		embedPlayer.bindHelper("playerReady", setUpCanvas);
		// continue player build out
		callback();
		//embedPlayer.bindHelper("playerReady", setUpCanvas);
		//console.log('embedPlayer',embedPlayer);
		//embedPlayer.bindHelper("onplay", setUpCanvas);
	});
	
//	nativeEmbedPlayerPid
})( window.mw, jQuery );

		window.mw.kalturaPluginWrapper(oculusButtonPlugin);
		window.mw.kalturaPluginWrapper(noOculusButtonPlugin);
