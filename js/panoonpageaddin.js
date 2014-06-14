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
			this.iframe = kdp.getElementsByTagName('iframe');
			this.addPlayerBindings();
		},
		metadataLoaded:function (){
			var customDataList = this.kdp.evaluate('{mediaProxy.entryMetadata}');
			console.log('METADATA LOADED', customDataList);
			//$.each( customDataList, function( key, val ){
			//	console.log('metadata key: ',key, ', metadata value: ', val );
			//})
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