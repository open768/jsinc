
//###############################################################
// CActionQueue
// A simple generic class to manage the batch processing of stuff
//###############################################################

function cActionQueueItem(psName, psActionUrl){
	this.name = psName;
	this.url = psActionUrl;
}

function cActionQueue(){
	this.aBacklog=[];
	this.aTransfers = new cQueue();
	this.bStopping=false;
	this.MAX_TRANSFERS=10;
	this.ASYNC_DELAY = 10;
	
	//***************************************************************
	this.clear = function(){
		cDebug.write("clearing image queue");
		this.aBacklog = [];
		this.bStopping = false;
	};
	
	//***************************************************************
	this.stop = function(){
		this.bStopping = true;
		this.aBacklog=[];
	};
	
	//***************************************************************
	this.add = function(psName, psActionUrl){
		if (this.bStopping) return;
		this.aBacklog.push( new cActionQueueItem(psName, psActionUrl));
	};

	//***************************************************************
	this.start = function(){
		
		if (this.bStopping) return;
		
		//------------ queue logic
		if (this.aTransfers.length() >= this.MAX_TRANSFERS)
			cDebug.write("Queue - full");
		else if (this.aBacklog.length > 0){
			var oItem = this.aBacklog.pop(); //Take item off backlog
			this.aTransfers.push(oItem.name,null); //put onto transfer list
			
			bean.fire(this,"starting", oItem.name); //notify subscriber 
			
			var oHttp = new cHttp2();				//perform the http request async
			var oParent = this;
			bean.on(oHttp, "result", function(poHttp){oParent.process_response(poHttp);});
			bean.on(oHttp, "error",  function(poHttp){oParent.process_error(poHttp);});
			
			//separate thread to allow UI to catch up
			iID= setTimeout( 
				function(){	oHttp.fetch_json(oItem.url, oItem.name );}, //start transfer
				this.ASYNC_DELAY
			);
			
			this.start();			//continue the processing of the queue
		}
	};
	
	//***************************************************************
	this.process_response = function(poHttp){
		if (this.bStopping) return;
		this.aTransfers.remove(poHttp.data);
		bean.fire(this,"response", poHttp.json);
		this.start();
	};
	//***************************************************************
	this.process_error = function(poHttp){
		if (this.bStopping) return;
		this.aTransfers.remove(poHttp.data);
		bean.fire(this,"error", poHttp);
		this.start();
	};
}

