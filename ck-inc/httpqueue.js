function cHttpQueueItem(){
	this.url = null;
}

function cHttpQueue(){
	this.MaxTransfers = 10;
	this.backlog = [];
	this.inProgress = [];
	this.stopping = false;
	
	// ***************************************************************
	this.add = function(poItem){
		if (this.stopping) return;
		this.backlog.push(poItem);
		this.start();
	};

	// ***************************************************************
	this.start = function(){
		if (this.stopping) return;
		if (this.backlog.length == 0){
			cDebug.write("Queue empty");
			return;
		}
		if (this.inProgress.length >= 	this.MaxTransfers){
			cDebug.write("Queue full");
			return;
		}
		
		var oThis = this;
		var oItem = this.backlog.pop();
		bean.fire(oItem, "start");
		
		cDebug.write("getting URL: " + oItem.url);
		this.inProgress.push(oItem);
		var oHttp = new cHttp2();
		bean.on(oHttp, "result", function(poHttp){oThis.onResult(poHttp, oItem);});
		bean.on(oHttp, "error",  function(poHttp){oThis.onError(poHttp, oItem);});
		oHttp.fetch_json(oItem.url);
	};

	// ***************************************************************
	this.stop = function(){
		window.stop();
		this.stopping = true;
		this.backlog = [];
		this.inProgress = [];
		
		//todo clear down the transfers in progress
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
		this.inProgress.pop();
		this.start();
	};
	
	this.onError = function (poHttp, poItem){
		if (this.stopping) return;
		bean.fire(poItem, "error", poHttp);
		this.inProgress.pop();
		this.start();
	};
};
