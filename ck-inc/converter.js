var cConverterEncodings = {
	binary:"01",
	BASE64:"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/=",

	isBase64:function(psInput){
		for (var i=0 ; i<psInput.length; i++){
			var ch = psInput.charAt(i);
			if (this.BASE64.indexOf(ch) == -1){
				cDebug.write("invalid char:"+ch);
				return false;
			}
		}
		return true;
	},
}
var cConverter = {
	//*********************************************************************
	binToInt:function(psBin){
		var iVal = 0;
		var bFirst = true;
		for (var i =0; i< psBin.length; i++){
			var ch = psBin.charAt(i);
			if (!bFirst){
				iVal = iVal << 1;
			}
			if (ch == '1'){
				iVal = iVal | 1;
			}
			bFirst = false;
		}
		return iVal;
	},
	
	//*********************************************************************
	intToBin:function(piVal){
		var iVal = piVal;
		var sBin = ""
		
		while (iVal > 0){
			sBin = ((iVal & 1)==1?"1":"0") + sBin;
			iVal = iVal >>> 1;
		}
		return sBin;
	},
	
	//**********************************
	base64ToDec: function(pcChar64){
		return  cConverterEncodings.BASE64.indexOf(pcChar64);
	},

	
	//**********************************
	test: function(){
		cDebug.write("testing cConverter")
		var iMax32Int = Math.pow(2,32) - 1;
		cDebug.write("- maxint is:"+ iMax32Int );
		var iRand = Math.floor(Math.random() * iMax32Int);
		cDebug.write("- random number in:"+ iRand);
		var sBin = this.intToBin(iRand);
		cDebug.write("- binary out :"+ sBin);
		var i32 = this.binToInt(sBin);
		cDebug.write("- number out :"+ i32);
		if (i32 !== iRand) throw new Error("cConverter test failed")
		
		cDebug.write("cConverter test passed :-)");
		return true;
	}
}

