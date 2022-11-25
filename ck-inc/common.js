'use strict';
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var STATUS_ID = "status";
var SINGLE_WINDOW =true;


//###############################################################
//# STRINGS
//###############################################################
class cString {
	static last(psText, psSearch){
		var sReverseTxt = this.reverse(psText);
		var sReverseSearch = this.reverse(psSearch);
		
		var iFound = sReverseTxt.search(sReverseSearch);
		
		if (iFound != -1)
			iFound = psText.length - iFound;
		return iFound;
	}
	
	//***************************************************************
	static reverse(psText){
		return psText.split("").reverse().join("");
	}
	
	//***************************************************************
	//count common characters from left
	static count_common_chars(ps1, ps2){
	
		var iCheckLen = Math.min(ps1.length, ps2.length);
		var i;
		
		for ( i=0; i<iCheckLen ;i++)
			if (ps1[i] !== ps2[i])
				break;
		return i;
	}
}

if (!String.prototype.padLeft)
	String.prototype.padLeft = function(psPad, piSize) { 
		var iDiff = piSize - this.length;
		if (iDiff >0)
			return psPad.repeat(iDiff) + this;
		else
			return this;
	}


//###############################################################
//# JQUERY
//###############################################################
class cJquery {
	//***************************************************************
	//https://forum.jquery.com/topic/know-if-a-css-class-exists-in-document
	static styleSheetContains(psClass) {
	   var bFound = false, iSheet, oSheet, iClass, oClass, aClasses, sSearch;
       var aSheets = document.styleSheets;	   
	   sSearch = "."+psClass;
       for (iSheet = 0; iSheet < aSheets.length; iSheet++) {
			oSheet = aSheets[iSheet];
			aClasses = null;
			try{
				aClasses = oSheet.cssRules ;
			}catch (e){
				try{
					aClasses = oSheet.rules ;
				}catch (e){}
			}
			if (aClasses == null) continue;
			
            for ( iClass = 0; iClass < aClasses.length; iClass++) {
                oClass = aClasses[iClass];
				if (oClass.selectorText == sSearch) {
                    bFound = true; 
					break;
                }
            }
        }
        return bFound;
    }
	
	//***************************************************************
	static bringToFront(poElement){
		$(".ui-front").each( 
			function(piIndex){
				$(this).removeClass("ui-front"); 
			}
		);
		
		if (poElement) poElement.addClass("ui-front");
	}
	
	//***************************************************************
	static setTopZindex(poElement){
		//var iZindex = $('.ui-dialog').css('z-index');
		var iZindex = $('.ui-front').css('z-index');
		poElement.css({
			'z-index': iZindex + 1,
			position: "relative"
			
		});
	}
	
	//***************************************************************
	static child_ID (poElement, psID){
		return poElement.attr("id") + psID;
	}
}

//###############################################################
//# BROWSER
//###############################################################
class cBrowser {
	static data = null;
	
	//***************************************************************
	static init(){
		var oResult = {}, aPairs;
		var sKey, sValue;

		aPairs = location.search.slice(1).split('&');
		aPairs.forEach(function(sPair) {
			var aPair = sPair.split('=');
			sKey = aPair[0];
			sValue = decodeURI(aPair[1]).replace(/\+/g, ' ');
			oResult[sKey] =  sValue || '';
		});

		this.data = oResult;
	}
	
	//***************************************************************
	static pageUrl(){
		return document.URL.split("?")[0];
	}
	
	//***************************************************************
	static baseUrl(){
		var sUrl, iLast, sBase;
		
		sUrl = this.pageUrl();
		cDebug.write("page url: "+ sUrl);
		iLast = cString.last(sUrl, "/");
		if (iLast == -1)
			sBase = "";
		else
			sBase = sUrl.substring(0,iLast);
		
		//cDebug.write("base url is "+ sBase);
		return sBase;
	}
	
	//***************************************************************
	static pushState(psTitle, psUrl){
		if (window.history.pushState){
			window.history.pushState("", psTitle, psUrl);
			this.init();
		}
	}
	
	//***************************************************************
	static openWindow(psUrl, psWindow){
		if (SINGLE_WINDOW)
			document.location.href = psUrl;
		else
			window.open(psUrl, psWindow);
	}
	
	//***************************************************************
	static buildUrl(psPage, poParams){
		if (psPage.search(/\?/) == -1)
			return  psPage + "?" + $.param(poParams,true);
		else
			return  psPage + "&" + $.param(poParams,true);
	}
	
	//***************************************************************
	//read_from_clipboard
	static paste_from_clipboard(pfnCallBack){
		var oThis = this;
		if (navigator && navigator.clipboard && navigator.clipboard.readText)
			navigator.clipboard.readText().then(
				text => {  
					oThis.writeConsoleWarning("pasted from clipboard: " + text);
					pfnCallBack(text);
				} 
			);	//async fetch from clipboard, will display a warning to user if permissions not set
		else
			this.writeConsoleWarning("browser not compatible for copy operation");		
	}
	
	//***************************************************************
	static copy_to_clipboard(psID){
		var body = document.body, range, sel;
		
		if (navigator && navigator.clipboard && navigator.clipboard.writeText){
			var sText = psID;
			if (psID.substring(0,1) === "#"){
				var oEl = $("#" + psID);
				sText = oEl.text();
			}
			navigator.clipboard.writeText(psID);
			this.writeConsoleWarning("sent to clipboard: " + sText);
		}else
			this.writeConsoleWarning("browser not compatible for copy operation");
	}
	
	//***************************************************************
	static get_clipboard_permissions(){
		this.writeConsoleWarning("clipboard permissions not immplemented");
	}
	
	//***************************************************************
	static writeConsole(psMessage){
		if (console) console.log(psMessage);
	}
	//***************************************************************
	static writeConsoleWarning(psMessage){
		if (console) console.warn(psMessage);
	}
	
	//***************************************************************
	static get_permission(psName){
	}
}
cBrowser.init();


//###############################################################
//# MISC
//###############################################################
function set_error_status(psStatus){
	$("#"+STATUS_ID).html("<font color='red'>" + psStatus + "</font>");
	cDebug.write("Error: " + psStatus );
}
//***************************************************************
function set_status(psStatus){
	var oElement;
	$("#"+STATUS_ID).html(psStatus);
	cDebug.write("status: " + psStatus);
}

//***************************************************************
function getRadioButtonValue(psID){
	var oRadios = document.getElementsByName(psID);
	var sValue = null;
	var oRadio;
	
	for (var i = 0; i<oRadios.length; i++){
		oRadio = oRadios[i];
		if (oRadio.checked) {
			cDebug.write("found a checked radio");
			sValue = oRadio.value;
			break;
		}
	}
		
	return sValue;
}
