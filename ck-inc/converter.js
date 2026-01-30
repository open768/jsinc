'use strict'
/**************************************************************************
	Copyright (C) Chicken Katsu 2013-2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

class cConverterEncodings {
	static binary = '01'
	static BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"	//rfc4648


	static isBase64(psInput) {
		for (var i = 0; i < psInput.length; i++) {
			var ch = psInput.charAt(i)
			if (this.BASE64.indexOf(ch) == -1) {
				cDebug.write('invalid char:' + ch)
				return false
			}
		}
		return true
	}
}

class cConverter {
	//*********************************************************************
	static binToInt(psBin) {
		var iVal = 0
		var bFirst = true
		for (var i = 0; i < psBin.length; i++) {
			var ch = psBin.charAt(i)
			if (!bFirst) {
				iVal = iVal << 1
			}
			if (ch == '1') {
				iVal = iVal | 1
			}
			bFirst = false
		}
		return iVal
	}

	//*********************************************************************
	static intToBin(piVal) {
		var iVal = piVal
		var sBin = ''

		while (iVal > 0) {
			sBin = ((iVal & 1) == 1 ? '1' : '0') + sBin
			iVal = iVal >>> 1
		}
		return sBin
	}

	//**********************************
	static base64ToDec(pcChar64) {
		return cConverterEncodings.BASE64.indexOf(pcChar64)
	}

	//**********************************
	static test() {
		cDebug.write('testing cConverter')
		var iMax32Int = Math.pow(2, 32) - 1
		cDebug.write('- maxint is:' + iMax32Int)
		var iRand = Math.floor(Math.random() * iMax32Int)
		cDebug.write('- random number in:' + iRand)
		var sBin = this.intToBin(iRand)
		cDebug.write('- binary out :' + sBin)
		var i32 = this.binToInt(sBin)
		cDebug.write('- number out :' + i32)
		if (i32 !== iRand) throw new Error('cConverter test failed')

		cDebug.write('cConverter test passed :-)')
		return true
	}
}

/***************************************************************************/
// eslint-disable-next-line no-unused-vars
class cSimpleBase64 {
	static BIN_LENGTH = 6

	static toBase64(psBin) {
		var s64 = ''
		if (psBin.length % this.BIN_LENGTH !== 0) cDebug.write('binary length not exactly divisible by ' + this.BIN_LENGTH)

		for (var istart = 0; istart < psBin.length; istart += this.BIN_LENGTH) {
			var sFragment = psBin.substr(istart, this.BIN_LENGTH) //grab 6 characters
			var iIndex = cConverter.binToInt(sFragment)
			var sChar = cConverterEncodings.BASE64.charAt(iIndex)
			s64 = s64 + sChar
		}
		return s64
	}

	//*********************************************************************
	static toBinary(ps64, piOutLen) {
		var sOutBin = ''
		var bIsPadding = true

		if (piOutLen == null) {
			cDebug.write('no expected binary length set')
			cDebug.write('default pad length set to ' + this.BIN_LENGTH)
			bIsPadding = false
		}

		var piRemaining = piOutLen
		for (var i = 0; i < ps64.length; i++) {
			var ch = ps64.charAt(i)
			var iVal = cConverter.base64ToDec(ch)
			var sBin = cConverter.intToBin(iVal)
			if (bIsPadding)
				var iPadLen = piRemaining > 5 ? this.BIN_LENGTH : piRemaining //padded
			else iPadLen = this.BIN_LENGTH
			sBin = sBin.padStart(iPadLen, '0')
			sOutBin = sOutBin + sBin
			piRemaining -= this.BIN_LENGTH
		}
		//use a regex to check if output string containsonly 1s and 0s
		if (!/^[01]+$/.test(sOutBin)) throw new Error('toBinary produced invalid binary string')

		return sOutBin
	}

	//*********************************************************************
	static test() {
		var sBinIn = ''
		var iLength = Math.floor(50 + Math.random() * 50)

		cDebug.write('Testing cSimpleBase64')
		for (var i = 0; i < iLength; i++) {
			var iRand = Math.floor(Math.random() * 1.99)
			sBinIn = sBinIn + iRand
		}
		cDebug.write('- in Bin: ' + sBinIn)
		var s64 = this.toBase64(sBinIn)
		cDebug.write('- base64: ' + s64)
		var sBinOut = this.toBinary(s64, iLength)
		cDebug.write('-out Bin: ' + sBinOut)

		if (sBinIn !== sBinOut) throw new Error('test Failed')
		cDebug.write('test succeeded')
	}
}
