'use strict';
/**************************************************************************
Copyright (C) Chicken Katsu 2016 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

//###############################################################
//# DEBUG
//###############################################################
class cDebug {
	static DEBUGGING = false;
	static ONE_TIME_DEBUGGING=false;
	static stack=[];
	
	
	//*****************************************************
	static write_err(psMessage){
		cBrowser.writeConsoleWarning("ERROR> " + psMessage);
	}

	static warn(psMessage){
		cBrowser.writeConsoleWarning("WARN> " + psMessage);
	}
	
	//*****************************************************
	static write(psMessage){
		if (this.pr_is_debugging()) 
			cBrowser.writeConsole("DEBUG> " + "  ".repeat(this.stack.length) + psMessage);
	}

	//*****************************************************
	static write_exception(pEx){
		this.write_err("Exception: " + pEx.message);
		this.write_err("stacktrace: " + pEx.stack);
	}

	//*****************************************************
	static enter(){
    	var sFn;
		if (!this.pr_is_debugging()) return;
		
		sFn = this.pr__getCaller("enter");
		this.write( ">> Entering " + sFn);
		this.stack.push(sFn);
	}
	
	//*****************************************************
	static on(){
		this.DEBUGGING = true;
		this.write("Debugging on");
	}

	//*****************************************************
	static leave(){
    	var sFn;
		if (!this.pr_is_debugging()) return;
		if (this.stack.length == 0) return;
		
		sFn = this.pr__getCaller("leave");
		if (sFn == this.stack[this.stack.length-1]){
			this.stack.pop();
			this.write( ">> Leaving " + sFn);
		}
	}
	
	//***************************************************************
	static vardump(arr, level){
		if (!this.pr_is_debugging()) return;
		
		sDump = this.pr__dump(arr, level);
		this.write(sDump);
		return sDump;
	}
	
	//*****************************************************
	static getvardump(arr,level){
		return this.pr__dump(arr, level);
	}
	
	//***************************************************************
	static error(psErr){
		throw new Exception(psErr);
	}

	//***************************************************************
	//* Privates
	//***************************************************************
	static pr__getCaller(psPrevious){
    	var aStack, iIndex, sTarget, aMatches, sFn;
		aStack = this.pr__getStack();
		iIndex = aStack.findIndex( function(pS){ return (pS.indexOf("cDebug." + psPrevious) >=0);});
		sTarget = aStack[iIndex +1];	
		aMatches = sTarget.match(/at\s+(\S+)\s/);
		return  aMatches[1];
	}
	
	//*****************************************************
	static pr_is_debugging(){
		if (this.ONE_TIME_DEBUGGING){
			this.ONE_TIME_DEBUGGING = false;
			return true;
		}
		return this.DEBUGGING;
	}

	//***************************************************************
	static pr__getStack(){
    	var oErr, sStack, aStack;
		oErr = new Error();
    	sStack = oErr.stack;	
		//this.write("Stack is:" + sStack);
		aStack = sStack.split(/\n/);
		return aStack;
	}
	
	//***************************************************************
	static pr__dump(arr, level){
		var dumped_text = "";
		if(!level) level = 0;
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "\t";
		
		if(typeof(arr) == 'object') { //Array/Hashes/Objects 
			for(var item in arr) {
				var value = arr[item];
				
				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += this.pr__dump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else 
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		return dumped_text;
	}
	
}
