'use strict'
/**************************************************************************
Copyright (C) Chicken Katsu 2013-2024
This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

//#######################################################################

class cQueueRunner {
	static EVENT_START = 'start'
	static EVENT_STOP = 'stop'
	static EVENT_STEP = 'step'

	delay = 500 //ms
	queue = new cQueue()
	stopping = false
	running = false

	constructor(piDelayms) {
		this.delay = piDelayms
	}

	//*****************************************************
	start() {
		if (this.stopping || this.running)
			return

		this.running = true
		bean.fire(this, cQueueRunner.EVENT_START)
		this.step()
	}

	//*****************************************************
	stop() {
		if (this.stopping || !this.running)
			return

		this.stopping = true
	}

	//*****************************************************
	step() {
		if (!this.running)
			return


		if (this.stopping) {
			this.pr_stop()
			return
		}

		//------get the  item off the queue
		var oQ = this.queue
		const oItem = oQ.pop()
		if (oItem == null) {
			this.pr_stop()
			return
		}

		bean.fire(this, cQueueRunner.EVENT_STEP, oItem)
		setTimeout(() => this.step(), this.delay)
	}

	//*****************************************************
	reset() {
		this.pr_stop()
		cQueueRunner.queue = new cQueue()
	}

	//*****************************************************
	//*****************************************************
	pr_stop() {
		this.running = false
		this.stopping = false
		bean.fire(this, cQueueRunner.EVENT_STOP)
	}
}

//#######################################################################
class cQueue {
	prKey = null
	prData = null
	prNext = null

	//**********************************************************
	length() {
		if (this.prNext === null)
			return 0
		else
			return 1 + this.prNext.length()

	}

	//**********************************************************
	push(psKey, poData) {
		var oNew
		oNew = new cQueue()
		oNew.prData = poData
		oNew.prKey = psKey
		oNew.prNext = this.prNext
		this.prNext = oNew
	}

	//**********************************************************
	exists(psKey) {
		if (this.prKey === psKey)
			return true
		else if (this.prNext)
			return this.prNext.exists(psKey)
		else
			return false

	}

	//**********************************************************
	get(psKey) {
		if (this.prKey === psKey)
			return this
		else if (this.prNext)
			return this.prNext.get(psKey)
		else
			return null

	}

	//**********************************************************
	remove(psKey) {
		if (this.prNext)
			if (this.prNext.prKey === psKey)
				this.prNext = this.prNext.prNext
			else
				this.prNext.remove(psKey)


	}

	//**********************************************************
	pop() {
		var oResult = null
		if (this.prNext !== null) {
			oResult = this.prNext.prData
			this.prNext = this.prNext.prNext
		}

		return oResult
	}
}
