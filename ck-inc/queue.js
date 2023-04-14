'use strict'
/**************************************************************************
Copyright (C) Chicken Katsu 2013-2018
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

function cQueue(){
	this.prKey = null
	this.prData = null
	this.prNext = null
	
	//**********************************************************
	this.length = function(){
		if (this.prNext === null)
			return 0
		else
			return (1+ this.prNext.length())
	}
	
	//**********************************************************
	this.push = function(psKey, poData){
		var oNew
		oNew = new cQueue()
		oNew.prData = poData
		oNew.prKey = psKey
		oNew.prNext = this.prNext
		this.prNext = oNew
	}
	
	//**********************************************************
	this.exists = function (psKey){
		if (this.prKey === psKey)
			return true
		else if (this.prNext)
			return this.prNext.exists(psKey)
		else
			return false
	}
	
	//**********************************************************
	this.get = function (psKey){
		if (this.prKey === psKey)
			return this
		else if (this.prNext)
			return this.prNext.get(psKey)
		else
			return null
	}
	
	//**********************************************************
	this.remove = function (psKey){
		if (this.prNext){ 
			if (this.prNext.prKey === psKey)
				this.prNext = this.prNext.prNext
			else
				this.prNext.remove(psKey)
		}
	}
	
	//**********************************************************
	this.pop = function (){
		var oResult = null
		if (this.prNext !== null){
			oResult = this.prNext.prData
			this.prNext = this.prNext.prNext
		}
		return oResult
	}
}