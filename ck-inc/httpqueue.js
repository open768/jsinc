function cHttpQueueItem(){
	this.url = null;
	this.ohttp = null;
}

function cHttpQueue(){
	this.maxTransfers = 10;
	this.backlog = [];
	this.inProgress = [];
	this.stopping = false;
	this.running = false;
	
	// ***************************************************************
	this.add = function(poItem){
		if (this.stopping) return;
		this.backlog.push(poItem);
		this.start();
	};

	// ***************************************************************
	this.start = function(){
		if (this.stopping) return;
		if (this.running) return;
		this.running = true;
		this.pr_process_next();
	};
	
	// ***************************************************************
	this.pr_process_next = function(){
		var oThis, oItem;
		
		if (this.stopping) return;
		
		if (this.inProgress.length >= 	this.maxTransfers){
			cDebug.write("Queue full");
			return;
		}
		if (this.backlog.length == 0){
			cDebug.write("finished Queue");
			bean.fire(this, "finished");
			this.running = false;
			return;
		}

		oThis = this;
		oItem = this.backlog.pop();
		bean.fire(oItem, "start");
		
		cDebug.write("getting URL: " + oItem.url);
		this.inProgress.push(oItem);
		var oHttp = new cHttp2();
		oItem.ohttp = oHttp;
		
		bean.on(oHttp, "result", function(poHttp){oThis.onResult(poHttp, oItem);});
		bean.on(oHttp, "error",  function(poHttp){oThis.onError(poHttp, oItem);});
		oHttp.fetch_json(oItem.url);
		
		//go on to the next transfer
		this.pr_process_next();
	};

	// ***************************************************************
	this.stop = function(){
		this.stopping = true;
		this.backlog = [];
		
		//todo clear down the transfers in progress
		var oItem;
		while ( oItem = this.inProgress.pop()){
			oItem.ohttp.stop();
		}
		this.inProgress = [];
	};

	// ***************************************************************
	this.reset = function(){
		this.stop();
		this.stopping = false;
	};
	
	//#####################################################################
	//# Events
	//#####################################################################
	this.onResult = function (poHttp, poItem){
		if (this.stopping) return;
		cDebug.write("got a response for: " + poItem.url);
		bean.fire(poItem, "result", poHttp);
		this.inProgress.pop();					//dont care what it is pop it off the in progress
		this.pr_process_next();		//continue queue
	};
	
	this.onError = function (poHttp, poItem){
		if (this.stopping) return;
		bean.fire(poItem, "error", poHttp);
		this.inProgress.pop();
		this.pr_process_next();		//continue queue
	};
};
