/**************************************************************************
Copyright (C) Chicken Katsu 2013-2018
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
//##################################################################
function cHttpQueueItem(){
	this.url = null;
	this.ohttp = null;
	this.abort = false;
	this.fnCheckContinue = null;
}

//##################################################################
cHttpQueueJquery = {
	queues:[],
	
	onJqueryLoad: function(){
		var oThis = this;
		$(window).bind('beforeunload', function(){ oThis.stop_all_transfers()});
	},
	
	stop_all_transfers: function(){
		//iterates each queue item and stops any transfers
		var oQ;
		while (oQ = this.queues.pop()){
			oQ.stop();
		}	
	}
}

$(	function(){cHttpQueueJquery.onJqueryLoad()}	);

//##################################################################
function cHttpQueue(){
	this.maxTransfers = 10;
	this.backlog = [];	//an array of cHttpQueueItem
	this.inProgress = new Map();
	this.stopping = false;
	this.running = false;
	this.DELAY = 50;
	
	if (this instanceof cHttpQueue){
		//add this object to the list of queues
		cHttpQueueJquery.queues.push(this);
	}
	
	// ***************************************************************
	this.add = function(poItem){
		if (!(poItem instanceof cHttpQueueItem)){ throw new Error("item must be a cHttpQueueItem")}
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
		
		if (this.inProgress.size >= 	this.maxTransfers){
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
		if (oItem.fnCheckContinue)
			if (!oItem.fnCheckContinue()) 
				return;
		
		if (oItem.abort) return;
		setTimeout(	function(){	oThis.onTimer(oItem)}, this.DELAY);
	};
	
	// ***************************************************************
	this.onTimer = function(poItem){
		var oThis = this;
		if (this.stopping) return;
		
		cDebug.write("getting URL: " + poItem.url);
		this.inProgress.set(poItem.url,poItem);
		var oHttp = new cHttp2();
		poItem.ohttp = oHttp;
		
		bean.on(oHttp, "result", function(poHttp){oThis.onResult(poHttp, poItem);});
		bean.on(oHttp, "error",  function(poHttp){oThis.onError(poHttp, poItem);});
		oHttp.fetch_json(poItem.url);
		
		//go on to the next transfer
		this.pr_process_next();		
	};

	// ***************************************************************
	this.stop = function(){
		this.stopping = true;
		this.backlog = [];
		
		//todo clear down the transfers in progress
		var oItem;
		this.inProgress.forEach( function(oItem, psKey) {oItem.ohttp.stop();}	)
		this.inProgress = new Map();
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
		this.inProgress.delete(poItem.url);		//delete a specific item from the queue
		this.pr_process_next();		//continue queue
	};
	
	this.onError = function (poHttp, poItem){
		if (this.stopping) return;
		bean.fire(poItem, "error", poHttp);
		this.inProgress.delete(poItem.url);
		this.pr_process_next();		//continue queue
	};
};
