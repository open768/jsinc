'use strict'
/**************************************************************************
Copyright (C) Chicken Katsu 2013-2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

//###############################################################
// CActionQueue
// A simple generic class to manage the batch processing of stuff
//###############################################################

class cActionQueueItem {
	name = null
	url = null
	data = null
	oHttp = null

	constructor(psName, psActionUrl, poData) {
		this.name = psName
		this.url = psActionUrl
		this.data = poData
		this.oHttp = null
	}
}

 
class cActionQueue {
	aBacklog = []
	aTransfers = new cQueue()
	bStopping = false
	running = false
	MAX_TRANSFERS = 10
	ASYNC_DELAY = 10

	//***************************************************************
	clear() {
		cDebug.write('clearing image queue')
		this.aBacklog = []
	}

	//***************************************************************
	stop() {
		if (this.bStopping) 
			return
		
		if (this.aBacklog.length == 0) 
			return
		
		this.bStopping = true
		this.aBacklog = []
	}

	//***************************************************************
	add(psName, psActionUrl, poData) {
		if (this.bStopping) 
			return
		
		this.aBacklog.push(new cActionQueueItem(psName, psActionUrl, poData))
	}

	//***************************************************************
	start() {
		if (this.bStopping) 
			return
		

		var oQueue = this

		//------------ queue logic
		if (this.aTransfers.length() >= this.MAX_TRANSFERS) 
			cDebug.write('Queue - full')
		else if (this.aBacklog.length > 0) {
			this.running = true
			var oItem = this.aBacklog.pop() //Take item off backlog
			this.aTransfers.push(oItem.name, null) //put onto transfer list

			bean.fire(this, 'starting', oItem.name) //notify subscriber

			var oHttp = new cHttp2() //create a new http object to do the request
			{
				oItem.oHttp = oHttp

				oHttp._actionqueue_name = oItem.name // this is a fudge that is just WRONG #@todo#
				bean.on(oHttp, 'result', poHttp => oQueue.process_response(poHttp, oItem))
				bean.on(oHttp, 'error', poHttp => oQueue.process_error(poHttp, oItem))

				//separate thread to allow UI to catch up
				 
				var iThread = setTimeout(
					() => oHttp.fetch_json(oItem.url, oItem.name), //start transfer
					this.ASYNC_DELAY
				)
			}

			this.start() //continue the processing of the queue
		}
	}

	//***************************************************************
	 
	process_response(poHttp, poItem) {
		this.aTransfers.remove(poHttp.data)
		if (this.bStopping) {
			if (this.aTransfers.length == 0) {
				this.running = false
				this.bStopping = false
			}
			return
		}

		poHttp.json._actionqueue_name = poHttp._actionqueue_name
		bean.fire(this, 'response', poHttp.response)

		this.start() //process the next item
	}
	//***************************************************************
	 
	process_error(poHttp, poItem) {
		this.aTransfers.remove(poHttp.data)
		if (this.bStopping) {
			if (this.aTransfers.length == 0) {
				this.running = false
				this.bStopping = false
			}
			return
		}

		bean.fire(this, 'error', poHttp)
		this.start()
	}
}
