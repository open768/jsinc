"use strict"
/**************************************************************************
Copyright (C) Chicken Katsu 2013-2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

/* eslint-disable-next-line no-unused-vars */
class cQueue {
	prKey = null
	prData = null
	prNext = null

	//**********************************************************
	length() {
		if (this.prNext === null) return 0
		else return 1 + this.prNext.length()
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
		if (this.prKey === psKey) return true
		else if (this.prNext) return this.prNext.exists(psKey)
		else return false
	}

	//**********************************************************
	get(psKey) {
		if (this.prKey === psKey) return this
		else if (this.prNext) return this.prNext.get(psKey)
		else return null
	}

	//**********************************************************
	remove(psKey) {
		if (this.prNext) {
			if (this.prNext.prKey === psKey) this.prNext = this.prNext.prNext
			else this.prNext.remove(psKey)
		}
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
