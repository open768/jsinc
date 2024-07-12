'use strict'

/**************************************************************************
Copyright (C) Chicken Katsu 2013-2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
//##################################################################
function cHttpQueueItem(){
	this.url = null
	this.ohttp = null
	this.abort = false
	this.data  = null
	this.fnCheckContinue = null
	this.QPosition = -1
}

//##################################################################
var cHttpQueueJquery = {
	queues:[],
	
	onJqueryLoad: function(){
		var oThis = this
		$(window).bind('beforeunload', function(){ oThis.stop_all_transfers()})
	},
	
	stop_all_transfers: function(){
		var oQ
		for(;;){
			oQ = this.queues.pop()
			if (oQ) break
			oQ.stop()		//stop transfers on each queue
		}
	}
}

$(	function(){cHttpQueueJquery.onJqueryLoad()}	)

//##################################################################
// eslint-disable-next-line no-unused-vars
function cHttpQueue(){
	this.maxTransfers = 10
	this.backlogQ = []	//an array of cHttpQueueItem
	this.inProgressQ = new Map()
	this.stopping = false
	this.running = false
	this.NICENESS_DELAY = 50
	
	if (this instanceof cHttpQueue){	//not sure why i check whether its an instanceof
		//add this object to the list of queues so that they can be stopped at page unload;
		cHttpQueueJquery.queues.push(this)
	}	
	
	// ***************************************************************
	this.add = function(poItem){
		if (this.stopping) return
		if (!(poItem instanceof cHttpQueueItem)){ throw new Error("item must be a cHttpQueueItem")}
		//todo check that URL isnt allready known
		this.backlogQ.push(poItem)
		this.start()
	}

	// ***************************************************************
	this.start = function(){
		if (this.stopping) return
		if (this.running ){
			if (this.inProgressQ.size >0) 
				return
			else
				cDebug.write("Queue not running prematurely")	//added extra check
		}
		this.running = true
		this.pr_process_next()
	}
	
	// ***************************************************************
	this.pr_process_next = function(){
		var oThis, oItem
		
		if (this.stopping) return
		
		//if too many transfers in progress do nothing - ie wait for another item to finish
		if (this.inProgressQ.size >= this.maxTransfers){
			cDebug.write("Queue full")
			return
		}
		
		//if nothing left in the queue set a flag that nothing is running
		if (this.backlogQ.length == 0){
			cDebug.write("finished Queue")
			bean.fire(this, "finished")
			this.running = false
			return
		}

		//get the top item off the queue - ready to go
		oThis = this
		oItem = this.backlogQ.pop()
		if (oItem.fnCheckContinue)
			if (!oItem.fnCheckContinue()) 
				return
		
		if (oItem.abort) return
		setTimeout(	function(){	oThis.onTimer(oItem)}, this.NICENESS_DELAY)
		
		//notify the remaining backlogQ items their position in the queue
		//TBD
		if (this.backlogQ.length > 0)
			for (var iPos=0; iPos<this.backlogQ.length; iPos++){
				oItem = this.backlogQ[iPos]
				oItem.QPosition = iPos
				bean.fire(oItem,"Qpos")
			}
	}
	
	// ***************************************************************
	this.onTimer = function(poItem){
		var oThis = this
		if (this.stopping) return
		
		bean.fire(poItem, "start")			//notify item has started
		
		cDebug.write("getting URL: " + poItem.url)
		this.inProgressQ.set(poItem.url,poItem)
		var oHttp = new cHttp2()
		oHttp.data = poItem.data
		poItem.ohttp = oHttp
		
		bean.on(oHttp, "result", function(poHttp){oThis.onResult(poHttp, poItem)})
		bean.on(oHttp, "error",  function(poHttp){oThis.onError(poHttp, poItem)})
		oHttp.fetch_json(poItem.url, poItem.data)
		
		//go on to the next transfer
		this.pr_process_next()		
	}

	// ***************************************************************
	this.stop = function(){
		this.stopping = true
		this.backlogQ = []
		
		//todo clear down the transfers in progress
		// eslint-disable-next-line no-unused-vars
		this.inProgressQ.forEach( function(oItem, psKey) {oItem.ohttp.stop()}	)
		this.inProgressQ = new Map()
	}

	// ***************************************************************
	this.reset = function(){
		this.stop()
		this.stopping = false
	}
	
	//#####################################################################
	//# Events
	//#####################################################################
	this.onResult = function (poHttp, poItem){
		if (this.stopping) return
		cDebug.write("got a response for: " + poItem.url)
		bean.fire(poItem, "result", poHttp)
		this.inProgressQ.delete(poItem.url)		//delete a specific item from the queue
		this.pr_process_next()		//continue queue
	}
	
	this.onError = function (poHttp, poItem){
		if (this.stopping) return
		bean.fire(poItem, "error", poHttp)
		this.inProgressQ.delete(poItem.url)
		this.pr_process_next()		//continue queue
	}
}
