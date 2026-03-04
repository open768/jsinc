class cSuppressMessage{
	static _counts = {}
	static _timestamps = {}

	static NOISY_COUNT = 50 //how many times a message can be logged before it is considered noisy
	static NOISY_RESET = 200	//milliseconds


	/**
     * @param {string} psThing
     * @returns {boolean}
     */
	static should_suppress(psThing){

		//-----------------update the count
		var aCounts = this._counts
		var iCount = aCounts[psThing] || 0
		iCount++
		aCounts[psThing] = iCount

		// ----- its not noisy
		if (iCount <= this.NOISY_COUNT)
			return false

		// ----- its just become noisy
		if (iCount === this.NOISY_COUNT){
			var iNow = new Date().getTime()
			this._timestamps[psThing] = iNow
			cDebug.write('suppressing message "' + psThing + '"')
			return true
		}

		// ----- its already noisy - check if its been long enough to reset the count
		var iNow = new Date().getTime()
		var aTimestamps = this._timestamps
		var iLastTimestamp = aTimestamps[psThing] || iNow
		var idiff = iNow - iLastTimestamp

		if (idiff > this.NOISY_RESET){
			aCounts[psThing] = 0
			aTimestamps[psThing] = null
			return false
		}

		return true
	}
}