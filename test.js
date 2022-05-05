const MAIN_TEST_TITLE_ = 'QUnitGS2 Test';
var QUnit = QUnitGS2.QUnit;
let actualTestSheet = SpreadsheetApp.openById(FILE_ID).getSheetByName('Customers');
let testData = {
  ID: '9',
  FirstName: 'Seba',
  LastName: 'Golijow'
};

 function tests() {

  QUnit.module( "group a" );
  let index = makeIndex(actualTestSheet);
  let testIndex = {
  index: index,
  rowV: 2
 }

  QUnit.test("Test1", function(assert) {
     assert.equal(returnRow([[11,12,13],[14,15,16]], {ID: 11}),0);
     assert.equal(index.get('ID'), 1.0);
     assert.equal(appendRow(actualTestSheet, testData, index), 3);
     assert.equal(upDate(actualTestSheet, testIndex, testData), 3);
   });
}
 

 function doGet() {
 QUnit.config.title = MAIN_TEST_TITLE_
 Logger.log('test');
 QUnitGS2.init();

tests()
 QUnit.start();
return QUnitGS2.getHtml()
}

function getResultsFromServer() {
  return QUnitGS2.getResultsFromServer()
}



