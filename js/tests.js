// Test array and object creation format  
QUnit.test("createListObjectArray", function( assert) {    
    assert.deepEqual(createListObjectsArray(2),[
        {
          "list": [
            [
              ""
            ]
          ],
          "listname": undefined,
          "number": 1
        },
        {
          "list": [
            [
              ""
            ]
          ],
          "listname": undefined,
          "number": 2
        }
      ]);    
});  

QUnit.test("createListArray", function( assert) {
    var test_list = "John\nJacob\nElmer\nSmith";
    assert.deepEqual(CreateListArray(test_list),["John","Jacob","Elmer","Smith"]);    
});  

