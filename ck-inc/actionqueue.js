
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
		var oItem, iLen, oHttp;
		var oParent = this;
		
		if (this.bStopping) return;

		//-------------- set up the closures
		function pfnHttpCallback(poHttp){
			oParent.process_response(poHttp);
		}

		function pfnErrorCallback(poHttp){
			oParent.process_error(poHttp); // continue after error
		}
		
		//------------ queue logic
		if (this.aTransfers.length() >= this.MAX_TRANSFERS)
			cDebug.write("Queue full ...");
		else if (this.aBacklog.length > 0){
			oItem = this.aBacklog.pop(); //Take item off backlog
			this.aTransfers.push(oItem.name,null); //put onto transfer list
			
			bean.fire(this,"starting", oItem.name); //notify subscriber 
			
			oHttp = new cHttp2();
			bean.on(oHttp, "result", pfnHttpCallback);
			bean.on(oHttp, "error", pfnErrorCallback);
			oHttp.fetch_json(oItem.url, oItem.name ); //start transfer
			
			this.start();			//continue the processing of the queue
		}
	};
	
	//***************************************************************
	this.process_response = function(poHttp){
		if (this.bStopping) exit();
		this.aTransfers.remove(poHttp.data);
		bean.fire(this,"response", poHttp.json);
		this.start();
	};
	//***************************************************************
	this.process_error = function(poHttp){
		if (this.bStopping) exit();
		this.aTransfers.remove(poHttp.data);
		bean.fire(this,"error", poHttp);
		this.start();
	};
}

