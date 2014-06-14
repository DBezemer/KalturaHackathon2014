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
		},
		loadSpeechCommands:function(){
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
  					for(var patternString in speechPatterns)
  					{
  						try{
	  						var pattern=JSON.parse(patternString);
	  					} catch(e)
	  					{
	  					}
  					}
  				}

		  // Add our commands to annyang
  				videoSpeechEngine.addCommands(commands);

		  // Start listening. You can call this here, or attach this call to an event, button, etc.
		  		//alert(this.kdp.evaluate('{video.player.kdpState}'));
  				//videoSpeechEngine.start();
			}
		},
		metadataLoaded:function (){
			this.customDataList = this.kdp.evaluate('{mediaProxy.entryMetadata}');
			console.log('METADATA LOADED', this.customDataList);
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
			videoSpeechEngine.abort();
		},
		addPlayerBindings:function(){
		    try{
			// you can get flashvar or plugin config via the evaluate calls: 
			var myCustomFlashVar = this.kdp.evaluate('{configProxy.flashvars.myCustomFlashVar}');
			// add local listeners ( notice we postfix panoOnPage so its easy to remove just our listeners):
			this.kdp.kBind( 'doPlay.panoOnPage', this.onPlay );
			//this.kdp.kBind( 'doPlay.panoOnPage', this.onPlay );
			self=this;
			this.kdp.addJsListener( 'metadataReceived', function (){
				self.metadataLoaded();
			});
			this.kdp.addJsListener( 'playerPlayEnd', function (){
				self.startSpeechRecognition();
			});
			this.kdp.addJsListener( 'playerPaused', function (){
				self.startSpeechRecognition();
			});
			this.kdp.addJsListener( 'playerPlayed', function (){
				self.stopSpeechRecognition();
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