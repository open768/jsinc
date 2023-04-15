'use strict'
//note is  very slow if there are lots of items
/* globals bean, cHttpQueue , cHttp2, cHttpQueueItem*/

class cQueueifVisibleQueue {			//static
	static queue = new cHttpQueue
}

//###########################################################################################
// eslint-disable-next-line no-unused-vars
class cQueueifVisible {
	constructor() {
		this.element = null
		this.url = null
		this.data = null
		this.WAIT_SCROLLING = 500
		this.WAIT_INITIAL = 100
		this.WAIT_FORCE = 20
		this.status = null
	}
	//*******************************************************************
	go(poElement, psUrl, poData = null) {
		if (!bean)
			$.error("bean class is missing! check includes")
		if (!cHttp2)
			$.error("http2 class is missing! check includes")

		var oThis = this
		this.element = poElement
		if (!$.event.special.inview)
			$.error("inview class is missing! check includes")
		if (!poElement.inViewport)
			$.error("inViewport class is missing! check includes")
		this.url = psUrl
		this.data = poData
		this.pr__send_status("waiting for page ready..")
		$(function () { oThis.pr__setInViewListener() })
	}

	//#################################################################
	//# privates
	//#################################################################`
	pr__setInViewListener() {
		var oThis = this
		var oElement = this.element

		if (!oElement.inViewport()) {
			this.pr__add_forcebutton()

			//set the event listeners
			this.pr__send_status("waiting for item to be visible..")
			oElement.on('inview', function (poEvent, pbIsInView) { oThis.onInView(pbIsInView) })
		}
		else
			this.onScrollingTimer()
	}

	//*******************************************************************
	pr__add_forcebutton() {
		var oThis = this
		setTimeout(function () { oThis.pr__do_add_forcebutton() }, this.WAIT_FORCE)
	}

	pr__do_add_forcebutton() {
		var oThis = this
		var oElement = this.element

		var btnForce = $("<button>").append("load")
		oElement.append(btnForce)
		btnForce.click(function () { oThis.onInView(true) })
	}

	//*******************************************************************
	pr__send_status(psMsg) {
		this.status = psMsg
		bean.fire(this, "status", psMsg)
	}

	//#################################################################
	//# events
	//#################################################################`
	onInView(pbIsInView) {
		var oThis = this
		var oElement = $(this.element)

		//check if element is visible
		if (!pbIsInView) {
			this.pr__send_status("Waiting to become visible")
			return
		}

		this.pr__send_status("item is visible - checking again in " + this.WAIT_SCROLLING)
		oElement.off('inview') //turn off the inview listener



		//TODO use position of element in viewport to determine whether scrolling is happening
		// eg if the element has moved more than 10 pixels since last time then wait.
		setTimeout(function () { oThis.onScrollingTimer() }, this.WAIT_SCROLLING)
	}

	//*******************************************************************
	// visible timer incase the element is being scrolled. 
	//
	onScrollingTimer() {
		var oThis = this
		var oElement = $(this.element)

		if (!oElement.inViewport()) { //check if really in viewport
			this.pr__send_status("not visible after waiting.. ")
			this.pr__setInViewListener()
			return
		}

		//loading message
		this.pr__send_status("Item is visible - Adding to processing queue")
		this.pr__add_forcebutton()

		//add the data request to the http queue
		var oQItem = new cHttpQueueItem()
		oQItem.url = this.url
		oQItem.data = this.data
		oQItem.fnCheckContinue = function () { return oThis.onCheckContinue() }
		bean.on(oQItem, "start", function () { oThis.onStart(oQItem) })
		bean.on(oQItem, "result", function (poHttp) { oThis.onResult(poHttp) })
		bean.on(oQItem, "error", function (poHttp) { oThis.onError(poHttp) })
		bean.on(oQItem, "Qpos", function () { oThis.onQPosition(oQItem) })

		var oQueue = cQueueifVisibleQueue.queue
		oQueue.add(oQItem)
	}

	//*******************************************************************
	onQPosition(poItem) {
		//get the Q position from the item and fire a status event
		try {
			this.pr__send_status("Queue position is: " + poItem.QPosition)
		} catch (e) {
			console.error(e)
		}
	}

	//*******************************************************************
	onResult(poHttp) {
		try {
			this.pr__send_status("got a response from server: ")
			bean.fire(this, "result", poHttp)
		} catch (e) {
			console.error(e)
		}
	}

	//*******************************************************************
	onStart(poItem) {
		if (poItem == null) {
			console.error("item was empty!")
			return
		}
		try {
			this.pr__send_status("making server call")
			bean.fire(this, "start", poItem)
		} catch (e) {
			console.error(e)
		}
	}

	//*******************************************************************
	onError(poHttp) {
		bean.fire(this, "error", poHttp)
		this.pr__add_forcebutton()
	}

	//*******************************************************************
	onCheckContinue() {
		var oElement = this.element
		var bOK = true

		if (!oElement.inViewport()) {
			this.pr__send_status("Waiting to become visible again")
			this.pr__setInViewListener()
			bOK = false
		}

		return bOK
	}
}
