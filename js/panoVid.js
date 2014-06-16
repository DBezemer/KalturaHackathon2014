/**
 * @author troffmo5 / http://github.com/troffmo5
 *
 * Google Street View viewer for the Oculus Rift
 */

// Parameters
// ----------------------------------------------
var QUALITY = 3;
var DEFAULT_LOCATION = { lat:44.301945982379095,  lng:9.211585521697998 };
var WEBSOCKET_ADDR = "ws://127.0.0.1:1981";
var USE_TRACKER = false;
var MOUSE_SPEED = 0.005;
var KEYBOARD_SPEED = 0.02;
var GAMEPAD_SPEED = 0.04;
var DEADZONE = 0.2;
var SHOW_SETTINGS = true;
var NAV_DELTA = 45;
var FAR = 1000;
var USE_DEPTH = true;
var WORLD_FACTOR = 1.0;
var USE_RIFT=false;
var OculusRift = {
  // Parameters from the Oculus Rift DK1
  hResolution: 1280,
  vResolution: 800,
  hScreenSize: 0.14976,
  vScreenSize: 0.0936,
  interpupillaryDistance: 0.064,
  lensSeparationDistance: 0.064,
  eyeToScreenDistance: 0.041,
  distortionK : [1.0, 0.22, 0.24, 0.0],
  chromaAbParameter: [ 0.996, -0.004, 1.014, 0.0]
};

//VIDEO RENDERING

var videoImage, videoImageContext, videoTexture, videoMaterial;

// Globals
// ----------------------------------------------
var WIDTH, HEIGHT;
var currHeading = 0;
var centerHeading = 0;
var navList = [];

var headingEuler = new THREE.Euler();
var moveVector = new THREE.Vector3();
var keyboardMoveVector = new THREE.Vector3();
var gamepadMoveVector = new THREE.Vector3();
var HMDRotation = new THREE.Quaternion();
var BaseRotation = new THREE.Quaternion();
var BaseRotationEuler = new THREE.Euler();

var VRState = null;

// Utility function
// ----------------------------------------------
function angleRangeDeg(angle) {
  angle %= 360;
  if (angle < 0) angle += 360;
  return angle;
}

function angleRangeRad(angle) {
  angle %= 2*Math.PI;
  if (angle < 0) angle += 2*Math.PI;
  return angle;
}

function deltaAngleDeg(a,b) {
  return Math.min(360-(Math.abs(a-b)%360),Math.abs(a-b)%360);
}

function deltaAngleRas(a,b) {
  // todo
}


// ----------------------------------------------
function setUpVideoForTexture()
{

	videoElement.onloadedmetadata=function(e){
   		videoElement.crossOrigin=""
//		videoImage.width = videoElement.videoWidth*Math.max(720,videoElement.videoHeight)/videoElement.videoHeight;
//		videoImage.height = Math.max(720,videoElement.videoHeight);
		videoImage.width = videoElement.videoWidth;
		videoImage.height = videoElement.videoHeight;
		videoImageContext = videoImage.getContext( '2d' );
		
    	//videoImageContext.translate( videoImage.width, 0 );
	    //videoImageContext.translate(videoImage.width / 2, videoImage.height / 2);
    	//videoImageContext.scale(-1, 1);
    	//videoImageContext.translate(-videoImage.width / 2, -videoImage.height / 2);
		// background color if no video present
		videoImageContext.fillStyle = '#808080';
		videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
		videoTexture.needsUpdate = true;
	};
};

function createRenderers()
{

  // Create render
  try {
    renderer = new THREE.WebGLRenderer({'canvas':canvasElement});
    

				// postprocessing
	if(false)
	{
				var composer = new THREE.EffectComposer( renderer );
				composer.addPass( new THREE.RenderPass( scene, camera ) );

				var composerEffect1 = new THREE.ShaderPass( THREE.DotScreenShader );
				composerEffect1.uniforms[ 'scale' ].value = 4;
				composerEffect1.addPass( effect );

				var composerEffect2 = new THREE.ShaderPass( THREE.RGBShiftShader );
				composerEffect2.uniforms[ 'amount' ].value = 0.0015;
				composerEffect2.renderToScreen = true;
				composer.addPass( effect );
	}
  }
  catch(e){
    alert('This application needs WebGL enabled!');
    return false;
  }

  renderer.autoClearColor = false;
  renderer.setSize( WIDTH, HEIGHT );

  // Add stereo effect

  // Set the window resolution of the rift in case of not native
  OculusRift.hResolution = WIDTH, OculusRift.vResolution = HEIGHT,

  effect = new THREE.OculusRiftEffect( renderer, {HMD:OculusRift, worldFactor:WORLD_FACTOR} );
  effect.setSize(WIDTH, HEIGHT );
  
  if( videoTexture)
  {
  	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	videoMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
 	if(projSphere)
 		projSphere.material = videoMaterial ;
  }
};

function initWebGL() {
  // create scene
  scene = new THREE.Scene();

  // Create camera
  camera = new THREE.PerspectiveCamera( 60, WIDTH/HEIGHT, 0.1, FAR );
  camera.target = new THREE.Vector3( 1, 0, 0 );
  //camera.useQuaternion = true; //No longer needed
  scene.add( camera );

  // Add projection sphere
  
  var imageTexture=THREE.ImageUtils.loadTexture('/images/panoimage.jpg');

	videoImage = document.createElement( 'canvas' );
//	var w=videoElement?(videoElement.videoWidth || 1280):1280;
//	var h=videoElement?(videoElement.videoHeight || 720):720;
//	videoImage.width = w/h*Math.max(h,720);
//	videoImage.height = videoElement?(Math.max(h,720) || 1):1;
	videoImage.width = videoElement?(videoElement.videoWidth || 1):1;
	videoImage.height = videoElement?(videoElement.videoHeight || 1):1;
	if(videoElement)
	{
		setUpVideoForTexture();
	};
	
	videoImageContext = videoImage.getContext( '2d' );
    //videoImage.translate(videoImage.width / 2, videoImage.height / 2);
    //videoImageContext.scale(-1, 1);
    //videoImage.translate(-videoImage.width / 2, -videoImage.height / 2);
    	//videoImageContext.translate( -videoImage.width / 2, -videoImage.height  / 2 );
	// background color if no video present
	videoImageContext.fillStyle = '#808080';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	videoMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	var sphereGeom = new THREE.SphereGeometry( 500, 16, 16 );
  
	for (var index = 0; index < sphereGeom.faceVertexUvs[0].length; ++index) {
		for (var vertex = 0; vertex < 3; ++vertex) {
			sphereGeom.faceVertexUvs[0][index][vertex].x = 1.0-sphereGeom.faceVertexUvs[0][index][vertex].x;
		}
	}
  sphereGeom.dynamic = false; //We aren't doing depth mapping, geometry won't change
    projSphere = new THREE.Mesh( sphereGeom, videoMaterial );
  //projSphere.useQuaternion = true; //No longer needed
  scene.add( projSphere );

  // Add Progress Bar
//  progBarContainer = new THREE.Mesh( new THREE.CubeGeometry(1.2,0.2,0.1), new THREE.MeshBasicMaterial({color: 0xaaaaaa}));
//  progBarContainer.translateZ(-3);
//  camera.add( progBarContainer );

//  progBar = new THREE.Mesh( new THREE.CubeGeometry(1.0,0.1,0.1), new THREE.MeshBasicMaterial({color: 0x0000ff}));
//  progBar.translateZ(0.2);
//  progBarContainer.add(progBar);

	createRenderers();
}

function initControls() {

  // Keyboard
  // ---------------------------------------
  var lastSpaceKeyTime = new Date(),
      lastCtrlKeyTime = lastSpaceKeyTime;
      
//  $(document).off( "keydown" );
  $(document).keydown(function(e) {
    //console.log(e.keyCode);
    switch(e.keyCode) {
      case 32: // Space
        var spaceKeyTime = new Date();
        //if (spaceKeyTime-lastSpaceKeyTime < 300) {
        //  $('.ui').toggle(200);
        //}
        lastSpaceKeyTime = spaceKeyTime;
        break;
      case 37: case 65:
        keyboardMoveVector.y = KEYBOARD_SPEED;
        break;
      case 38: case 87:
        keyboardMoveVector.x = KEYBOARD_SPEED;
        break;
      case 39: case 68:
        keyboardMoveVector.y = -KEYBOARD_SPEED;
        break;
      case 40: case 83:
        keyboardMoveVector.x = -KEYBOARD_SPEED;
        break;
      case 17: // Ctrl
        var ctrlKeyTime = new Date();
        if (ctrlKeyTime-lastCtrlKeyTime < 300) {
          doMoveAction();
        }
       
        lastCtrlKeyTime = ctrlKeyTime;
        break;
      case 18: // Alt
        USE_DEPTH = !USE_DEPTH;
        setSphereGeometry();
        break;
    }
  });

  //$(document).off( "keyup" );
  $(document).keyup(function(e) {
    switch(e.keyCode) {
      case 37:case 65:
      case 39:case 68:
        keyboardMoveVector.y = 0.0;
        break;
      case 38:case 87:
      case 40:case 83:
        keyboardMoveVector.x = 0.0;
        break;
      case 82:
      	USE_RIFT=!USE_RIFT;
      	break;
      case 32: //space
      	break;
      case 13,90:
        doMoveAction();
        break;
    }
  });

  // Mouse
  // ---------------------------------------
  var viewer = targetElementForOSV,
      mouseButtonDown = false,
      lastClientX = 0,
      lastClientY = 0;

  function setUpViewerEvents(){
  	if(viewer){
  viewer.addEventListener('dblclick', function() {
    doMoveAction();
  });

  viewer.addEventListener('mousedown', function(event) {
    mouseButtonDown = true;
    lastClientX = event.clientX;
    lastClientY = event.clientY;
  });

  viewer.addEventListener('mouseup', function() {
    mouseButtonDown = false;
  });


  viewer.addEventListener('mousemove',function(event) {
    if (mouseButtonDown) {
      var enableX = (USE_TRACKER || VRState !== null) ? 0 : 1;
      BaseRotationEuler.set(
        angleRangeRad(BaseRotationEuler.x + (event.clientY - lastClientY) * MOUSE_SPEED * enableX),
        angleRangeRad(BaseRotationEuler.y + (event.clientX - lastClientX) * MOUSE_SPEED),
        0.0, 'YZX'
      );
      lastClientX = event.clientX;
      lastClientY = event.clientY;
      BaseRotation.setFromEuler(BaseRotationEuler);
    }
  });
  }
  }
  
  setUpViewerEvents();

  // Gamepad
  // ---------------------------------------
  gamepad = new Gamepad();
  gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
    console.log("Gamepad CONNECTED")
  });

  gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
    if (e.control == "FACE_2") {
      $('.ui').toggle(200);
    }
  });

  // Look for tick event so that we can hold down the FACE_1 button and
  // continually move in the current direction
  gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
    // Multiple calls before next place has finished loading do not matter
    // GSVPano library will ignore these
    if (gamepads[0].state["FACE_1"] === 1) {
      doMoveAction();
    }
  });

  gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {

    // ignore deadzone
    var value = e.value;
    if (value < -DEADZONE) value = value + DEADZONE;
    else if(value > DEADZONE) value = value - DEADZONE;
    else value = 0;

    if (e.axis == "LEFT_STICK_X") {
      gamepadMoveVector.y = -value*GAMEPAD_SPEED;
    }
    else if (e.axis == "LEFT_STICK_Y") {
      gamepadMoveVector.x = -value*GAMEPAD_SPEED;
    }
  });

  if (!gamepad.init()) {
    //console.log("Gamepad not supported");
  }
}

function initGui()
{

  window.addEventListener( 'resize', resize, false );

}

function initPano() {
//    var a = THREE.Math.degToRad(90-panoLoader.heading);
    projSphere.quaternion.setFromEuler(new THREE.Euler(0,0,0, 'YZX') );

    projSphere.material.wireframe = false;
    projSphere.material.map.needsUpdate = true;
	
    projSphere.material.map.needsUpdate = true;
};

function setSphereGeometry() {
  var geom = projSphere.geometry;
  var depthMap = panoDepthLoader.depthMap.depthMap;
  var y, x, u, v, radius, i=0;
  for ( y = 0; y <= geom.heightSegments; y ++ ) {
    for ( x = 0; x <= geom.widthSegments; x ++ ) {
      u = x / geom.widthSegments;
      v = y / geom.heightSegments;

      radius = USE_DEPTH ? Math.min(depthMap[y*512 + x], FAR) : 500;

      var vertex = geom.vertices[i];
      vertex.x = - radius * Math.cos( geom.phiStart + u * geom.phiLength ) * Math.sin( geom.thetaStart + v * geom.thetaLength );
      vertex.y = radius * Math.cos( geom.thetaStart + v * geom.thetaLength );
      vertex.z = radius * Math.sin( geom.phiStart + u * geom.phiLength ) * Math.sin( geom.thetaStart + v * geom.thetaLength );
      i++;
    }
  }
  geom.verticesNeedUpdate = true;
}

function initWebSocket() {
  connection = new WebSocket(WEBSOCKET_ADDR);
  //console.log('WebSocket conn:', connection);

  connection.onopen = function () {
    // connection is opened and ready to use
    //console.log('websocket open');
  };

  connection.onerror = function (error) {
    // an error occurred when sending/receiving data
    //console.log('websocket error :-(');
    if (USE_TRACKER) setTimeout(initWebSocket, 1000);
  };

  connection.onmessage = function (message) {
    var data = JSON.parse('['+message.data+']');
    HMDRotation.set(data[1],data[2],data[3],data[0]);
  };

  connection.onclose = function () {
    //console.log('websocket close');
    if (USE_TRACKER) setTimeout(initWebSocket, 1000);
  };
}


function doMoveAction() {
	console.log('Start listening!')
	
        //videoSpeechEngine.start();
        //Send a message to parent frame to start speech recognition
        if(window.targetElementForOSV)
        {
        	targetElementForOSV.sendNotification("doStop");
        }
        parent.postMessage("TurnOnSpeechRecognition","*");
}

function initVR() {
  vr.load(function(error) {
    if (error) {
      //console.warn('VR error: ' + error.toString());
      return;
    }

    VRState = new vr.State();
    try{
    if (!vr.pollState(VRState)) {
      //console.warn('NPVR plugin not found/error polling');
      VRState = null;
      return;
    }
    } catch(e)
    { 
      VRState = null;
      return;
    }

    if (!VRState.hmd.present) {
      //console.warn('oculus rift not detected');
      VRState = null;
      return;
    }
    BaseRotationEuler.x = 0.0;
  });
}

function render() {
	if(renderer.domElement!=canvasElement)
		initWebGL();
		
  	if(USE_RIFT)
		effect.render( scene, camera );
	else
	{
		renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
  		renderer.render(scene, camera);
  	}
}


function resize( event ) {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  OculusRift.hResolution = WIDTH,
  OculusRift.vResolution = HEIGHT,
  effect.setHMD(OculusRift);

  renderer.setSize( WIDTH, HEIGHT );
  camera.projectionMatrix.makePerspective( 60, WIDTH /HEIGHT, 1, 1100 );
}
/// sharpen image:
/// from http://jsfiddle.net/AbdiasSoftware/ddJZB/
/// USAGE:
///    sharpen(context, width, height, mixFactor)
///  mixFactor: [0.0, 1.0]
function sharpen(ctx, w, h, mix) {

    var weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
        katet = Math.round(Math.sqrt(weights.length)),
        half = (katet * 0.5) | 0;
        console.log('sharpen', ctx, w, h, mix);
    var dstData = ctx.createImageData(w, h),
        dstBuff = dstData.data,
        srcBuff = ctx.getImageData(0, 0, w, h).data,
        y = h;

    while (y--) {

        x = w;

        while (x--) {

            var sy = y,
                sx = x,
                dstOff = (y * w + x) * 4,
                r = 0,
                g = 0,
                b = 0,
                a = 0;

            for (var cy = 0; cy < katet; cy++) {
                for (var cx = 0; cx < katet; cx++) {

                    var scy = sy + cy - half;
                    var scx = sx + cx - half;

                    if (scy >= 0 && scy < h && scx >= 0 && scx < w) {

                        var srcOff = (scy * w + scx) * 4;
                        var wt = weights[cy * katet + cx];

                        r += srcBuff[srcOff] * wt;
                        g += srcBuff[srcOff + 1] * wt;
                        b += srcBuff[srcOff + 2] * wt;
                        a += srcBuff[srcOff + 3] * wt;
                    }
                }
            }

            dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
            dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
            dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix)
            dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
        }
    }
	console.log('sharpened');
    ctx.putImageData(dstData, 0, 0);
}

function loop() {
  requestAnimationFrame( loop );

  	ps=null;
  // User vr plugin
  if (!USE_TRACKER && VRState !== null) {
  	try{
  		ps=vr.pollState(VRState);
  	} catch(e)
  	{
  		ps=null;
  	}
  }
    if (USE_RIFT && ps) {
      HMDRotation.set(VRState.hmd.rotation[0], VRState.hmd.rotation[1], VRState.hmd.rotation[2], VRState.hmd.rotation[3]);
    } else if(HEAD_LOCATION)
    {
    	var x=parseFloat(HEAD_LOCATION.x);
    	var y=parseFloat(HEAD_LOCATION.y);
    	var z=parseFloat(HEAD_LOCATION.z);
    	var headEuler=new THREE.Euler( Math.sin(-y/z), Math.sin(x/z), 0, 'YZX' );
    	//console.log(headEuler);
    	HMDRotation.setFromEuler(headEuler);
    }

  // Compute move vector
  moveVector.addVectors(keyboardMoveVector, gamepadMoveVector);

  // Disable X movement HMD tracking is enabled
  if (USE_TRACKER || VRState !== null) {
    moveVector.x = 0;
  }

  // Apply movement
  BaseRotationEuler.set( angleRangeRad(BaseRotationEuler.x + moveVector.x), angleRangeRad(BaseRotationEuler.y + moveVector.y), 0.0, 'YZX' );
  BaseRotation.setFromEuler(BaseRotationEuler);

  // Update camera rotation
  camera.quaternion.multiplyQuaternions(BaseRotation, HMDRotation);

  // Compute heading
  headingEuler.setFromQuaternion(camera.quaternion, 'YZX');
  currHeading = angleRangeDeg(THREE.Math.radToDeg(-headingEuler.y));

//	console.log('try to render video. videoElement.readyState = ', videoElement.readyState);
	
	if ( videoElement && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA ) 
	{
	
	
		
		videoImageContext.drawImage( videoElement, 
			Math.max(0.0,Math.min(videoImage.width, video_left_angle/360.0*videoImage.width)), 
			Math.max(0.0,Math.min(videoImage.height, (1.0-video_bottom_angle/180.0)*videoImage.height)),
			Math.max(0.0,Math.min(videoImage.width, (video_right_angle-video_left_angle)/360.0*videoImage.width)), 
			Math.max(0.0,Math.min(videoImage.height, (video_bottom_angle-video_top_angle)/180.0*videoImage.height)) );
		//sharpen(videoImageContext, videoImage.width, videoImage.height, 1.0) ;
		//console.log('drew image');
		if ( videoTexture ) 
		{
			
			//console.log('texture needs update');
			videoTexture.needsUpdate = true;
		}
	}
  // render
  render();
}

function getParams() {
  var params = {};
  var items = window.location.search.substring(1).split("&");
  for (var i=0;i<items.length;i++) {
    var kvpair = items[i].split("=");
    params[kvpair[0]] = unescape(kvpair[1]);
  }
  return params;
}

function startPano() {

  // Read parameters
  params = getParams();
  if (params.lat !== undefined) DEFAULT_LOCATION.lat = params.lat;
  if (params.lng !== undefined) DEFAULT_LOCATION.lng = params.lng;
  if (params.sock !== undefined) {WEBSOCKET_ADDR = 'ws://'+params.sock; USE_TRACKER = true;}
  if (params.q !== undefined) QUALITY = params.q;
  if (params.s !== undefined) SHOW_SETTINGS = params.s !== "false";
  if (params.heading !== undefined) {
    BaseRotationEuler.set(0.0, angleRangeRad(THREE.Math.degToRad(-parseFloat(params.heading))) , 0.0, 'YZX' );
    BaseRotation.setFromEuler(BaseRotationEuler);
  }
  if (params.depth !== undefined) USE_DEPTH = params.depth !== "false";
  if (params.wf !== undefined) WORLD_FACTOR = parseFloat(params.wf);


  WIDTH = window.innerWidth; HEIGHT = window.innerHeight;

  initWebGL();
  initControls();
  initGui();
  initPano();
  initVR();

  // Load default location

  loop();
};
