
	//Function from http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
	var loadjscssfiles=function (filenames, filetype, callback){
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
	};
	
function handleheadtrackrStatusEvent(event) {
    console.log(event.status);
}

function handleFaceTrackingEvent(e){
	//console.log('face tracked: ', e.x, e.y, e.angle, e);
}

// requires headPosition : true in Tracker constructor
function handleHeadTrackingEvent(e){
  //console.log('headtrackingEvent: ', e.x, e.y, e.z, e);
  	iframe=document.body.getElementsByTagName('iframe')[0];
	iframe.contentWindow.postMessage(JSON.stringify({'headTracking':{'x':e.x,'y':e.y,'z':e.z}}), "*");
}

document.addEventListener('facetrackingEvent', handleFaceTrackingEvent);
// requires headPosition : true in Tracker constructor
document.addEventListener('headtrackingEvent', handleHeadTrackingEvent);
document.addEventListener('headtrackrStatus', handleheadtrackrStatusEvent, true);

	function startHeadtrackr()
	{
		
		htCanvas=document.createElement('canvas');
		htCanvas.id='headtrackrCanvas';
		htCanvas.width=320;
		htCanvas.height=240;
		htCanvas.style.display="none";
		htCanvas.style.visibility="hidden";
		//document.body.appendChild(htCanvas);
		htVideo=document.createElement('video');
		htVideo.id="headtrackrVideo";
		htVideo.autoplay=true;
		htVideo.loop=true
		//document.body.appendChild(htVideo);
  		
		var htracker = new headtrackr.Tracker({
		  calcAngles : true,
  		  ui : false,
  	      headPosition : true // whether to calculate the head position
		});
  		htracker.init(htVideo, htCanvas);
  		htracker.start();
  	}
  	
  	loadjscssfiles(['js/headtrackr.js'],'js',startHeadtrackr);
 
KalturaOfficeInfo= {"1_6mjnzjx1": "Kaltura Kitchen",
"1_crrvzz9n": "Kaltura Server Room",
"1_2zri7adb": "Main Office Area",
"1_rj4qhcbv": "Large Meeting Room",
"1_n8m3w8y2": "Meeting Room with Windows",
"1_wmsowqoo": "Kaltura Lobby",
"1_9seq8pkw": "Kaltura Elevators",
"1_11gu6jks": "Bicycle video"};

var metaDataOverride={}

OVERRIDE_METADATA=false;
if(OVERRIDE_METADATA)
{
metaDataOverride={"1_ynznt8o3":{
				"TopAngle": "45", //"45",
				"BottomAngle": "135", //"135",
				"LeftAngle": "0",
				"RightAngle": "360",
				"SayAfterVideo": "Please tell me where you want to go next",
				"backgroundImage":"",
				"SpeechPattern": [JSON.stringify({"regex":"bike","goto":"1_11gu6jks"}), 
									JSON.stringify({"regex":"bicycle","goto":"1_11gu6jks"}),
									JSON.stringify({"regex":"next","goto":"0_yk83ppmr","say":"going to next video"})],
				}
			};
			
for(k in KalturaOfficeInfo)
{
	metaDataOverride[k]={
				"TopAngle": "45", //"45",
				"BottomAngle": "135", //"135",
				"LeftAngle": "0",
				"RightAngle": "360",
				"SayAfterVideo": "That was "+KalturaOfficeInfo[k],
				"backgroundImage":"",
				"SpeechPattern": [JSON.stringify({"regex":"bike","goto":"1_11gu6jks"}), 
									JSON.stringify({"regex":"bicycle","goto":"1_11gu6jks"}),
									JSON.stringify({"regex":"office","goto":"1_2zri7adb"}),
									JSON.stringify({"regex":"cubicle","goto":"1_2zri7adb"}),
									JSON.stringify({"regex":"hackathon","goto":"1_2zri7adb"}),
									JSON.stringify({"regex":"kitchen","goto":"1_6mjnzjx1"}),
									JSON.stringify({"regex":"toilet","goto":"1_6mjnzjx1"}),
									JSON.stringify({"regex":"bathroom","goto":"1_6mjnzjx1"}),
									JSON.stringify({"regex":"restroom","goto":"1_6mjnzjx1"}),
									JSON.stringify({"regex":"server","goto":"1_crrvzz9n"}),
									JSON.stringify({"regex":"elevators","goto":"1_9seq8pkw"}),
									JSON.stringify({"regex":"lifts","goto":"1_9seq8pkw"}),
									JSON.stringify({"regex":"entrance","goto":"1_9seq8pkw"}),
									JSON.stringify({"regex":"lobby","goto":"1_wmsowqoo"}),
									JSON.stringify({"regex":"meeting","goto":"1_n8m3w8y2"}),
									JSON.stringify({"regex":"window","goto":"1_n8m3w8y2"}),
									JSON.stringify({"regex":"next","goto":"0_yk83ppmr","say":"going to next video"})],
				}
}
metaDataOverride["1_11gu6jks"].TopAngle="0";
metaDataOverride["1_11gu6jks"].BottomAngle="180";

var DO_METADATA_UPDATE=true
if(DO_METADATA_UPDATE)
{
kwidgetAPI=new kWidget.api( {
			'wid' : '_243342',
		});
//Find the KS secret by logging in at http://html5video.org/kaltura-player/kWidget/tests/kWidget.auth.html
KS_DO_NOT_SAVE_IN_CODE='THIS IS A BOGUS KS CODE. http://html5video.org/kaltura-player/kWidget/tests/kWidget.auth.html'
alert('KS secret is bogus. Code will fail');
for(var k in metaDataOverride)
{
	var xmlResults='<metadata><TopAngle>'+metaDataOverride[k].TopAngle+'</TopAngle><BottomAngle>'+metaDataOverride[k].BottomAngle+'</BottomAngle>';
	xmlResults+='<LeftAngle>'+metaDataOverride[k].LeftAngle+'</LeftAngle><RightAngle>'+metaDataOverride[k].RightAngle+'</RightAngle>'
	xmlResults+='<SayAfterVideo>'+metaDataOverride[k].SayAfterVideo+'</SayAfterVideo>'
	for (var i in metaDataOverride[k].SpeechPattern)
	{
		xmlResults+='<SpeechPattern>'+metaDataOverride[k].SpeechPattern[i]+'</SpeechPattern>';
	}
	xmlResults+='</metadata>';
	(function(k_, xmlResults_ ){
	console.log('requesting add of '+k_ +' to '+xmlResults);
	kwidgetAPI.doRequest({
				'ks': KS_DO_NOT_SAVE_IN_CODE,
				'service':'metadata_metadata', 
				'metadataProfileId':'3564441', 
				'objectType':'1',
				'action': 'add', 
				'objectId': k_,
				'xmlData':xmlResults_
	}, function( data ){
			console.log('ADD RESULTS:',data);
			if('message' in data && data.message.substring(0,23) === "Metadata already exists")
			{
			console.log('requesting update of '+ k_ +' to '+xmlResults);
			metadataId=data.message.substring(28,36);
			// output formatted json result:
			kwidgetAPI.doRequest({
				'ks': KS_DO_NOT_SAVE_IN_CODE,
				'service':'metadata_metadata', 
				'metadataProfileId':'3564441', 
				'objectType':'1',
				'action': 'update', 
				'objectId': k_,
				'id': metadataId,
				'xmlData':xmlResults_
			}, function( data ){
			// output formatted json result:
			console.log('UPDATE RESULTS:',data);
			})
		}
	})})(k, xmlResults);
}
}
}
console.log(metaDataOverride);
 	
(function(){
	// This is a generic onPage plugin you will want to subscribe to the ready event: 
	kWidget.addReadyCallback( function( playerId ){
		var kdp = document.getElementById( playerId );
 
		// Here you can check player configuration ( if needed )
		// in this case we are checking if our plugin is enabled
		// For example you may have one uiConf defined onPage plugin resource
		// but turn off a given plugin on a particular with flashvars:
		// flashvars="&fooBar.plugin=false"
 
		// Also keep in mind you could have multiple players on a page. 
		if( kdp.evaluate( '{streammersion.plugin}' ) ){
			new panoOnPage( playerId );
		}
	});
	
	
 
	// There are a few conventions for creating javascirpt pseudo classes 
	//  ( feel free use what you like )
	panoOnPage = function( playerId ){
		return this.init( playerId );
	};
	panoOnPage.prototype = {
		init:function( playerId ){
			this.playerId = playerId;
			this.kdp = document.getElementById( playerId );	
			this.iframe = this.kdp.getElementsByTagName('iframe')[0];
			this.addPlayerBindings();
			this.entryId=this.kdp.evaluate("{mediaProxy.entry.id}") || KALTURA_ENTRYID;
		},
		say:function(text){
				var msg = new SpeechSynthesisUtterance(text);
				videoSpeechEngine.abort();
				msg.onend = function(e) {
							//Within iframe use currentState;
					videoSpeechEngine.start();
  							//console.log('Finished in ' + event.elapsedTime + ' seconds.');
				};

				window.speechSynthesis.speak(msg);
		},
		loadSpeechCommands:function(){
			var self=this;
			function buildSpeechCommand(pattern)
			{
				return function()
				{	
					if('goto' in pattern)
					{
						var newId=pattern.goto;
						KALTURA_ENTRYID=newId;
						self.entryId=newId;
						self.kdp.sendNotification ('changeMedia', {'entryId':pattern.goto});
					}
					if('say' in pattern)
					{
						self.say(pattern.say);
					}
				};
			};
			if (videoSpeechEngine) {
  			// Let's define our first command. First the text we expect, and then the function it should call
  				var commands = {
    				'show tps report': function() {
	      				alert('Here is the tps report');
    				}
  				};
  				//for (var key in this.customDataList) {
  				//	 var val = this.customDataList[key];
  				//	console.log('metadata key: ',key, ', metadata value: ', val );
  				//};
  				regexCommands={};
  				if('SpeechPattern' in this.customDataList)
  				{
  					var speechPatterns=this.customDataList.SpeechPattern;
  					if( !(length in speechPatterns))
  					{
  						speechPatterns=[speechPatterns];
  					}
  					for(var patternIndex in speechPatterns)
  					{
  						try{
  							var patternString=speechPatterns[patternIndex];
	  						var pattern=JSON.parse(patternString);
		  					console.log('pattern:',pattern);
	  						if('regex' in pattern)
	  						{
	  							console.log('installing pattern for :',pattern.regex);
	  							regexCommands[pattern.regex]=buildSpeechCommand(pattern);
	  						}
	  					} catch(e)
	  					{
	  					}
  					}
  				}

		  // Add our commands to annyang
		  		console.log('REGEX commands:',regexCommands);
  				videoSpeechEngine.addRegexCommands(regexCommands);

		  // Start listening. You can call this here, or attach this call to an event, button, etc.
		  		//alert(this.kdp.evaluate('{video.player.kdpState}'));
  				//videoSpeechEngine.start();
			}
		},
		metadataLoaded:function (){
			this.customDataList = this.kdp.evaluate('{mediaProxy.entryMetadata}');
			console.log('METADATA LOADED', this.customDataList);
			
			console.log('kdp: ',this.kdp);
			if(this.entryId in metaDataOverride)
			{
				this.customDataList=metaDataOverride[this.entryId];
				console.log('METADATA OVERRIDDEN', this.customDataList);
			}
			this.iframe.contentWindow.postMessage(JSON.stringify({'metaData':this.customDataList}), "*");
			//console.log('loadjscssfiles: ', loadjscssfiles);
			var self=this;
			loadjscssfiles(['js/speechEngine.js'],'js', function(){self.loadSpeechCommands()});
			//$.each( customDataList, function( key, val ){
			//	console.log('metadata key: ',key, ', metadata value: ', val );
			//})
		},
		startSpeechRecognition:function(){
			videoSpeechEngine.start();
		},
		stopSpeechRecognition:function(){
			//videoSpeechEngine.abort();
		},
		sayAfterwards:function() {
			if("SayAfterVideo" in this.customDataList)
			{
				videoSpeechEngine.abort();
				this.say(this.customDataList.SayAfterVideo);
			} else
			{
				videoSpeechEngine.start();
			}
		},
		addPlayerBindings:function(){
		    try{
			// you can get flashvar or plugin config via the evaluate calls: 
			var myCustomFlashVar = this.kdp.evaluate('{configProxy.flashvars.myCustomFlashVar}');
			// add local listeners ( notice we postfix panoOnPage so its easy to remove just our listeners):
			this.kdp.kBind( 'doPlay.panoOnPage', this.onPlay );
			//this.kdp.kBind( 'doPlay.panoOnPage', this.onPlay );
			var self=this;
			this.kdp.addJsListener( 'metadataReceived', function (){
				self.metadataLoaded();
			});
			this.kdp.addJsListener( 'playerPlayEnd', function (){
				self.sayAfterwards();
			});
			this.kdp.addJsListener( 'playerPaused', function (){
				self.startSpeechRecognition();
			});
			this.kdp.addJsListener( 'playerPlayed', function (){
				self.startSpeechRecognition();
			});
			//alert('metadata length:'+this.kdp.evaluate('{mediaProxy.entryMetadata}').length )
			//this.metadataLoaded();
			// List of supported listeners across html5 and kdp is available here:
			// http://html5video.org/wiki/Kaltura_KDP_API_Compatibility
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
		},
		onPlay:function(){
			console.log( 'video' + this.playerId + ' playing');
			// you can read the current time with:
			this.kdp.evaluate('{video.player.currentTime}');
		}
	}
})();