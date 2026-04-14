'use strict'
/**************************************************************************
Copyright (C) Chicken Katsu 2013-2026
This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

class cSparseArray {
	rows = 0
	cols = 0
	starts_at_zero = false
	_lastRowIndex = null
	_lastRowAccessed = null
	_data = new Map()

	//***************************************************
	constructor(piRows, piCols) {
		this.rows = piRows
		this.cols = piCols
	}

	//*****************************************************
	//*
	//*****************************************************
	get(piRow, piCol) {
		var oRow

		if (!this.pr__check_bounds(
			piRow,
			piCol
		))
			return null

		oRow = this.pr__get_row(
			piRow,
			false
		)
		if (oRow == null)
			return null

		return oRow.get(piCol)
	}

	//*****************************************************
	set(piRow, piCol, poValue) {
		if (!this.pr__check_bounds(
			piRow,
			piCol
		))
			return null

		var oRow = this.pr__get_row(
			piRow,
			true
		)
		oRow.set(
			piCol,
			poValue
		)
	}

	//*****************************************************
	//*
	//*****************************************************
	pr__get_row(piRow, pbCreate) {
		//get row from cache if there
		var oRow
		if (piRow == this._lastRowIndex)
			oRow = this._lastRowAccessed
		else
			oRow = this._data.get(piRow)

		//create the row if needed
		if (oRow == null)
			if (pbCreate) {
				oRow = new Map()
				this._data.set(
					piRow,
					oRow
				)
			} else
				return null

		//-------- update cached row
		this._lastRowIndex = piRow
		this._lastRowAccessed = oRow

		return oRow
	}

	//*****************************************************
	pr__check_bounds(piRow, piCol) {
		var iMin = this.starts_at_zero?0:1
		var imax_rows = this.rows - (this.starts_at_zero?1:0)
		var imax_cols = this.cols - (this.starts_at_zero?1:0)

		if (piRow < iMin || piRow > imax_rows)
			return false

		if (piCol < iMin || piCol > imax_cols)
			return false

		return true
	}
}
