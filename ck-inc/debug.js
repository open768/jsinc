'use strict'
/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

//###############################################################
//# DEBUG
//###############################################################
class cDebugTypes {
	static levels = {
		off: 0,
		basic: 1,
		extra: 2,
		extended: 3
	}
}

// eslint-disable-next-line no-unused-vars
class cDebug {
	static DEBUGGING = false
	static ONE_TIME_DEBUGGING = false
	static stack = []
	static level = cDebugTypes.levels.off

	//*****************************************************
	//static init
	static {
		var sDebugValue = cBrowser.get_url_param('debug')
		if (sDebugValue !== null) {
			var iValue = parseInt(sDebugValue)
			if (isNaN(iValue)) iValue = cDebugTypes.levels.basic
			this.on(iValue)
		}
		sDebugValue = cBrowser.get_url_param('debug2')
		if (sDebugValue !== null) this.on(cDebugTypes.levels.extra)

		if (!this.DEBUGGING && !this.ONE_TIME_DEBUGGING) {
			cBrowser.writeConsoleWarning('for debugging use querystring ?debug or ?debug2')
		}

	}

	//*****************************************************
	static is_debugging() {
		return this.DEBUGGING
	}

	//*****************************************************
	static write_err(psMessage, pbWriteToDoc = false) {
		cBrowser.writeConsoleWarning('ERROR> ' + psMessage)
		if (pbWriteToDoc) document.write("<font color='red' size=20>" + psMessage + '</font>')
	}

	//*****************************************************
	static warn(psMessage) {
		cBrowser.writeConsoleWarning('WARN> ' + psMessage)
	}

	//*****************************************************
	static write_exception(pEx) {
		this.write_err('Exception: ' + pEx.message)
		this.write_err('stacktrace: ' + pEx.stack)
	}

	//*****************************************************
	//*****************************************************
	static write(psMessage, piLevel = cDebugTypes.levels.off) {
		if (this.DEBUGGING || this.ONE_TIME_DEBUGGING) {
			if (this.level >= piLevel) {
				if (this.ONE_TIME_DEBUGGING) this.ONE_TIME_DEBUGGING = false
				cBrowser.writeConsole('DEBUG> ' + '  '.repeat(this.stack.length) + psMessage)
			}
		}
	}

	//*****************************************************
	static extra_debug(psMessage) {
		this.write(psMessage, cDebugTypes.levels.extra)
	}

	//*****************************************************
	static extended_debug(psMessage) {
		this.write(psMessage, cDebugTypes.levels.extended)
	}

	//*****************************************************
	//*****************************************************
	static on(piLevel = 1) {
		if (piLevel > cDebugTypes.levels.extended) throw new Error('unknown debug level - max is ' + cDebugTypes.levels.extended)
		this.DEBUGGING = true
		this.write('Debugging on with level ' + piLevel)
		this.level = piLevel
	}

	//*****************************************************
	//*****************************************************
	static enter() {
		var sFn
		if (!this.DEBUGGING) return

		sFn = this.pr__getCaller('enter')
		this.extra_debug('>> Entering ' + sFn)
		this.stack.push(sFn)
	}

	//*****************************************************
	static leave() {
		var sFn
		if (!this.DEBUGGING) return
		if (this.stack.length == 0) return

		sFn = this.pr__getCaller('leave')
		if (sFn == this.stack[this.stack.length - 1]) {
			this.stack.pop()
			this.extra_debug('>> Leaving ' + sFn)
		}
	}

	//***************************************************************
	static vardump(arr, level) {
		if (!this.DEBUGGING) return

		var sDump = this.pr__dump(arr, level)
		this.write(sDump)
		return sDump
	}

	//*****************************************************
	static getvardump(arr, level) {
		return this.pr__dump(arr, level)
	}

	//***************************************************************
	static error(psErr) {
		this.write_err(psErr)
		throw new Error(psErr)
	}

	//***************************************************************
	//* Privates
	//***************************************************************
	static pr__getCaller(psPrevious) {
		var aStack, iIndex, sTarget, aMatches
		aStack = this.pr__getStack()
		iIndex = aStack.findIndex(function (pS) {
			return pS.indexOf('cDebug.' + psPrevious) >= 0
		})
		sTarget = aStack[iIndex + 1]
		aMatches = sTarget.match(/at\s+(\S+)\s/)
		return aMatches[1]
	}

	//***************************************************************
	static pr__getStack() {
		var oErr, sStack, aStack
		oErr = new Error()
		sStack = oErr.stack
		//this.write("Stack is:" + sStack);
		aStack = sStack.split(/\n/)
		return aStack
	}

	//***************************************************************
	static pr__dump(arr, level) {
		var dumped_text = ''
		if (!level) level = 0

		//The padding given at the beginning of the line.
		var level_padding = ''
		for (var j = 0; j < level + 1; j++) level_padding += '\t'

		if (typeof arr == 'object') {
			//Array/Hashes/Objects
			for (var item in arr) {
				var value = arr[item]

				if (typeof value == 'object') {
					//If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n"
					dumped_text += this.pr__dump(value, level + 1)
				} else {
					dumped_text += level_padding + "'" + item + '\' => "' + value + '"\n'
				}
			}
		} else dumped_text = '===>' + arr + '<===(' + typeof arr + ')'
		return dumped_text
	}
}
