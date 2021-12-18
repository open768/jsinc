'use strict';

var cQueueifVisibleQueue={			//static
	queue: new cHttpQueue
}
	
//###########################################################################################
function cQueueifVisible(){			//class
	this.element=null;
	this.url=null;
	this.WAIT_SCROLLING= 500;
	this.WAIT_INITIAL= 100;
	
	//*******************************************************************
	this.go = function(poElement, psUrl){
		if (!bean)			$.error("bean class is missing! check includes");	
		if (!cHttp2)		$.error("http2 class is missing! check includes");	
		
		var oThis = this;
		this.element = poElement;
		if (!$.event.special.inview)	$.error("inview class is missing! check includes");	
		if (!poElement.inViewport ) 	$.error("inViewport class is missing! check includes");	
		this.url = psUrl;
		this.pr__send_status("Pausing at start ..");

		setTimeout(	function(){	oThis.pr__setInViewListener()}, this.WAIT_INITIAL);
	};
	
	//*******************************************************************
	//wait for the element to be visible
	this.pr__setInViewListener = function(){
		var oThis = this;
		var oElement = this.element;
		
		if (!oElement.inViewport()){ 
			this.pr__send_status("Item not visible on starting");
			this.pr__add_forcebutton();
			
			//set the event listeners
			oElement.on('inview', 	function(poEvent, pbIsInView){oThis.onInView(pbIsInView);}	);		
		}else
			this.onScrollingTimer();
	};
	
	//*******************************************************************
	this.pr__add_forcebutton = function(){
		var oThis = this;
		var oElement = this.element;
		
		var btnForce = $("<button>").append("load");
		oElement.append(btnForce);
		btnForce.click( 		function(){oThis.onInView(true);}		);
	};
	
	this.pr__send_status = function(psMsg){
		bean.fire(this,"status",psMsg);
	};
	
	//#################################################################
	//# events
	//#################################################################`
	this.onInView = function(pbIsInView){
		var oThis = this;
		var oElement = $(this.element);

		//check if element is visible
		if (!pbIsInView){
			this.pr__send_status("Waiting to become visible");
			return;	
		}
		
		oElement.off('inview');	//turn off the inview listener
		this.pr__send_status("checking that we're not scrolling past");
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
			this.pr__send_status("not visible after waiting.. ");
			this.pr__setInViewListener();
			return;
		}
		
		//loading message
		this.pr__send_status("queueing");
		this.pr__add_forcebutton();
		
		//add the data request to the http queue
		var oItem = new cHttpQueueItem();
		oItem.url = this.url;
		oItem.fnCheckContinue = function(){return oThis.onCheckContinue();};

		bean.on(oItem, "start", 	function()		{ oThis.onStart(oItem);		});				
		bean.on(oItem, "result", 	function(poHttp){ oThis.onResult(poHttp);	});				
		bean.on(oItem, "error", 	function(poHttp){ oThis.onError(poHttp);	});				
		bean.on(oItem, "Qpos", 		function()		{ oThis.onQPosition(oItem);	});				
		cQueueifVisibleQueue.queue.add(oItem);
	};

	//*******************************************************************
	this.onQPosition = function(poItem){
		//get the Q position from the item and fire a status event
		try {
			this.pr__send_status("Queue position is: " + poItem.QPosition);
		}catch (e){
			console.error(e);
		}
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
		this.pr__add_forcebutton();
	};
	
	//*******************************************************************
	this.onCheckContinue= function(){
		var oElement = this.element;
		var bOK = true;
		
		if (!oElement.inViewport()){
			this.pr__send_status("Waiting to become visible again");
			this.pr__setInViewListener();
			bOK = false;
		}
		
		return bOK;
	};
}
