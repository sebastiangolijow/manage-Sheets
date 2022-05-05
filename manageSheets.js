const FILE_ID = '1GJPx65ajx5hpnbG5XtSDzqjk62U_O_fwaf29ONOpKP8';


/**
 * Receives the Get Request from Bubble with the parameters and execute manageSheet and manage functions
 */
function doPost(e) {

  let data = JSON.parse(e.postData.contents);
  let actualSheet = manageSheet(e.parameter.name);
  manage(actualSheet, data);
  //remove(actualSheet, data);

}


/**
 * Open the correct sheet.
 * @param   arg1 the name of the sheet we need to modify (Customer, Loans, Payments) 
 * @return  the url of the modified sheet 
 */
function manageSheet(arg) {

// Find Sheet, need to change getSheetByName parameter to dynamic
  let LogDoc = SpreadsheetApp.openById(FILE_ID);
  Logger.log(LogDoc.getUrl());
  return LogDoc.getSheetByName(arg);

}

/**
 * Execute appendRow or upDate.
 * @param   arg1 the actual sheet
 * @return  void
 */
function manage(actualSheet, data) {

// make index, extract all the values from the actual sheet
  let index = makeIndex(actualSheet);
  let rowValues = actualSheet.getDataRange().getValues();

// execute appendRow or update when its correspond
  if(!rowValues.flat().includes(parseInt(data.ID))) {
    appendRow(actualSheet, data, index);
  } else {
    let rowV = returnRow(rowValues, data);
    let response = {
      'index': index,
      'rowV' : rowV
    };
    upDate(actualSheet, response, data);
  }

}

/**
 * Update the correspond row.
 * @param   sheet, the actual sheet that must modify
 * @param.  index an object with the indexes of the fields and the numer of the row to modify
 * @param   data the data coming from bubble with the new information
 * @return  void
 */
function upDate(sheet, index, data) {

  // exctract the keys of the object
  let keysValues = Object.keys(data);
  // Iterates and append the correct data at every turn  
  for(var i = 1; i < index.index.size; i++) {
    let key = keysValues[i];
    let cell = sheet.getRange(index.rowV + 1, index.index.get(key));
    cell.setValue(data[key]);
  }
   return i;
}
 
/**
 * Remove the correspond row
 * @param   actualSheet the actual sheet
 * @param.  ID the id of the row to delete
 * @return  void
 */
function remove(actualSheet, ID) {

  // Get rows to find the one wich needs to delete
  let rowValues = actualSheet.getDataRange().getValues();

  // Iterates all the rows until we find the correct one and then delete it
  for(var i = 0; i < rowValues.length; i++) {
    if(rowValues[i].includes(ID)) {
      actualSheet.deleteRow(i + 1);
    } 
  } 

}

/**
 * make the indexes of the fields.
 * @param   arg1 the actual sheet
 * @return  the indexes
 */
function makeIndex(actualSheet) {

  let rowValues = actualSheet.getDataRange().getValues();
  let headers = rowValues[0];
  // make JSON with indexes, key = name of field, value = the actual index
  let index = new Map();
  for(var b = 0; b < headers.length; b++) {
    index.set(headers[b], headers.indexOf(headers[b]) + 1);
  }
  return index;

}


/**
 * append the row if it doesn't exists.
 * @param   actualSheet the actual sheet
 * @param   data the data coming from bubble with the new information
 * @param.  index an object with the indexes of the fields and the numer of the row to modify
 * @return  void
 */
function appendRow(actualSheet, data, index) {
  let dataKeys = Object.keys(data);
  let rowValues = actualSheet.getDataRange().getValues();
  for(var i = 0; i < dataKeys.length; i++) {
    let cell = actualSheet.getRange(rowValues.length + 1, index.get(dataKeys[i]));
    cell.setValue(data[dataKeys[i]]);
  }
  return i;
}

/**
 * return the number of the row to modify.
 * @param   rowValues the values of the fields in the sheet (as an array)
 * @param.  data the data of the row to find
 * @return  the number of the row to modifi
 */
function returnRow(rowValues, data) {

  for(var i = 0; i < rowValues.length; i++) {
    if(rowValues[i].includes(parseInt(data.ID))) {
      return i;
    }
  }

}
