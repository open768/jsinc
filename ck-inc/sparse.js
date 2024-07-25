"use strict"
/**************************************************************************
Copyright (C) Chicken Katsu 2013-2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
// eslint-disable-next-line no-unused-vars
class cSparseArray {
  //***************************************************
  constructor(piRows, piCols) {
    this._data = new Map()
    this.rows = piRows
    this.cols = piCols
    this._lastRowIndex = null
    this._lastRowAccessed = null
  }

  //*****************************************************
  //*
  //*****************************************************
  get(piRow, piCol) {
    var oRow

    if (!this.pr__check_bounds(piRow, piCol)) return null
    oRow = this.pr__get_row(piRow, false)
    if (oRow == null) return null

    return oRow.get(piCol)
  }

  //*****************************************************
  set(piRow, piCol, poValue) {
    if (!this.pr__check_bounds(piRow, piCol)) return null
    var oRow = this.pr__get_row(piRow, true)
    oRow.set(piCol, poValue)
  }

  //*****************************************************
  //*
  //*****************************************************
  pr__get_row(piRow, pbCreate) {
    //get row from cache if there
    var oRow
    if (piRow == this._lastRowIndex) oRow = this._lastRowAccessed
    else oRow = this._data.get(piRow)

    //create the row if needed
    if (oRow == null) {
      if (pbCreate) {
        oRow = new Map()
        this._data.set(piRow, oRow)
      } else return null
    }

    //-------- update cached row
    this._lastRowIndex = piRow
    this._lastRowAccessed = oRow

    return oRow
  }

  //*****************************************************
  pr__check_bounds(piRow, piCol) {
    if (piRow < 1 || piRow > this.rows) return false
    if (piCol < 1 || piCol > this.cols) return false
    return true
  }
}
