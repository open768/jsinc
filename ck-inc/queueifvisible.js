var cQueueifVisibleQueue={			//static
	queue: new cHttpQueue
}
	
//###########################################################################################
function cQueueifVisible(){			//class
	this.element=null;
	this.url=null;
	this.WAIT_SCROLLING= 500;
	
	//*******************************************************************
	this.go = function(poElement, psUrl){
		if (!bean)			$.error("bean class is missing! check includes");	
		if (!cHttp2)		$.error("http2 class is missing! check includes");	
		
		this.element = poElement;
		if (!$.event.special.inview)	$.error("inview class is missing! check includes");	
		if (!poElement.inViewport ) 	$.error("inViewport class is missing! check includes");	
		this.url = psUrl;
		this.pr__setInViewListener();
	};
	
	//*******************************************************************
	//wait for the element to be visible
	this.pr__setInViewListener = function(){
		var oThis = this;
		var oElement = this.element;
		
		bean.fire(this,"status","Waiting to become visible");
		var btnForce = $("<button>").append("load");
		oElement.append(btnForce);
		
		//set the event listeners
		btnForce.click( 		function(){oThis.onInView(true);}		);
		oElement.on('inview', 	function(poEvent, pbIsInView){oThis.onInView(pbIsInView);}	);		
	};
	
	//#################################################################
	//# events
	//#################################################################`
	this.onInView = function(pbIsInView){
		var oThis = this;
		var oElement = $(this.element);

		//check if element is visible
		if (!pbIsInView) return;	
		
		oElement.off('inview');	//turn off the inview listener
		bean.fire(this,"status","checking that we're not scrolling past");
		//TODO use position of element in viewport to determine whether scrolling is happening
		// eg if the element has moved more than 10 pixels since last time then wait.

		setTimeout(	function(){	oThis.onScrollingTimer()}, this.WAIT_SCROLLING);
	};
	
	//*******************************************************************
	// visible timer incase the element is being scrolled. 
	//
	this.onScrollingTimer = function(){
		var oThis = this;
		var oOptions = this.options;
		var oElement = $(this.element);
		
		if (!oElement.inViewport()){ //check if really in viewport
			this.pr__setInViewListener();
			return;
		}
		
		//loading message
		bean.fire(this,"status","queueing");
		
		//add the data request to the http queue
		var oItem = new cHttpQueueItem();
		oItem.url = this.url;
		oItem.fnCheckContinue = function(){return oThis.onCheckContinue();};

		bean.on(oItem, "start", 	function()		{ oThis.onStart(oItem);		});				
		bean.on(oItem, "result", 	function(poHttp){ oThis.onResult(poHttp);	});				
		bean.on(oItem, "error", 	function(poHttp){ oThis.onError(poHttp);	});				
		cQueueifVisibleQueue.queue.add(oItem);
	};

	//*******************************************************************
	this.onResult = function(poHttp){
		try {
			bean.fire(this,"result",poHttp);
		}catch (e){
			console.error(e);
		}
	};
	
	//*******************************************************************
	this.onStart = function(poItem){
		if (poItem == null){
			console.error( "item was empty!");
			return;
		}
		try {
			bean.fire(this,"start",poItem);
		}catch (e){
			console.error(e);
		}
	};
	
	//*******************************************************************
	this.onError = function(poHttp){
		var oThis = this;
		bean.fire(this,"error", poHttp);
		var btnForce = $("<button>").append("load");
		this.element.append(btnForce);
		btnForce.click( 		function(){oThis.onInView(true);}		);
	};
	
	//*******************************************************************
	this.onCheckContinue= function(){
		var oElement = this.element;
		var bOK = true;
		
		if (!oElement.inViewport()){
			this.pr__setInViewListener();
			bOK = false;
		}
		
		return bOK;
	}
}
