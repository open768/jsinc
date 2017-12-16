/**************************************************************************
Copyright (C) Chicken Katsu 2016 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var DEBUG_ON = true;


//###############################################################
//# DEBUG
//###############################################################
var cDebug = {
	write_err:function(psMessage){
		cBrowser.writeConsole("ERROR> " + psMessage);
	},
	write:function(psMessage){
		if (DEBUG_ON) cBrowser.writeConsole("DEBUG> " + psMessage);
	},
	write_exception: function(pEx){
		this.write_err("Exception: " + pEx.message);
		this.write_err("stacktrace: " + pEx.stack);
	},

	//***************************************************************
	vardump:function(arr, level){
		sDump = this.dump(arr, level);
		this.write(sDump);
	},
	
	//***************************************************************
	dump:function(arr, level){
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
					dumped_text += this.dump(value,level+1);
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
