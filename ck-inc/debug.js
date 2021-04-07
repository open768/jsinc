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
var cDebug = {
	DEBUGGING:false,
	ONE_TIME_DEBUGGING:false,
	
	pr_is_debugging:function(){
		if (this.ONE_TIME_DEBUGGING){
			this.ONE_TIME_DEBUGGING = false;
			return true;
		}
		return this.DEBUGGING;
	},
	
	write_err:function(psMessage){
		cBrowser.writeConsole("ERROR> " + psMessage);
	},
	write:function(psMessage){
		if (this.pr_is_debugging()) cBrowser.writeConsole("DEBUG> " + psMessage);
	},
	write_exception: function(pEx){
		this.write_err("Exception: " + pEx.message);
		this.write_err("stacktrace: " + pEx.stack);
	},

	//***************************************************************
	vardump:function(arr, level){
		if (!this.pr_is_debugging()) return;
		
		sDump = this.pr__dump(arr, level);
		this.write(sDump);
		return sDump;
	},
	
	getvardump:function (arr,level){
		return this.pr__dump(arr, level);
	},
	
	//***************************************************************
	pr__dump:function(arr, level){
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
	},
	
	error:function(psErr){
		throw new Exception(psErr);
	}
}
