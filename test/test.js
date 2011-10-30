module("$xhr");

test("serializeQS()", function () {

  var url1 = "http://www.example.com"
    , url2 = "http://www.example.com?withqs=true";

  equal(
      $xhr.serializeQS(url1, {paramOne: "test",  paramTwo: "test"})
    , "?paramOne=test&paramTwo=test"
    , "Url without query string"
  );

  equal(
      $xhr.serializeQS(url2, {paramOne: "test",  paramTwo: "test"})
    , "&paramOne=test&paramTwo=test"
    , "Url with query string"
  );

  equal(
      $xhr.serializeQS(url1, {})
    , ""
    , "Empty data object"
  );

});

asyncTest("get", function () {

  $xhr.get(
      "server.php?testget"
    , {
          title: "Testing get()"
        , msg: "The test has passed"
      }
    , function (html) {

        equal(
            html.replace(/\s/g, "")
          , "<header><h1>Testingget()</h1></header>" + 
            "<section><p>Thetesthaspassed</p></section>" + 
            "<footer><p>&copy;2011</p></footer>"  
          , "needs a compare test here"
        );

        start();

      }
  );
  
});

asyncTest("getJSON", function () {

  $xhr.getJSON(
      "server.php?testgetjson"
    , function (data) {

        deepEqual(
            data
          ,  [
                {
                    firstname: "John"
                  , lastname: "Smith"
                  , occupation: "Plumber"
                }
              , {
                    firstname: "Jane"
                  , lastname: "Smith"
                  , occupation: "Accountant"
                }
              , {
                    firstname: "David"
                  , lastname: "Bowe"
                  , occupation: "Singer"
                }
            ]
          , "No data object passed just callback function"
        );

        start();

    });

});

asyncTest("getXML", function () {
  
  $xhr.getXML("test.xml", function (xml) {
    
    equal(xml.documentElement.nodeName, "note");
    start();
    
  });
  
});

asyncTest("ajax", function () {
  
   $xhr.ajax({
      url: "server.php?testgetjson"
    , timeout: 1
    , success: function (res) {
        console.log(this);
        start();
      }
    , dataType: "json"
   });
  
})

var tf = document.getElementById("testForm");

tf.addEventListener("submit", function (ev) {

  ev.preventDefault();

  $xhr.postForm(tf, {}, function (res) {
    var elem = document.createElement('p');
    elem.innerHTML = res;
    tf.appendChild(elem);
  });

}, false);

var sf = document.getElementById("send-file");

sf.addEventListener("click", function (ev) {
  
  ev.preventDefault();
  
  var f = document.getElementById("file-field").files[0];
  
  $xhr.sendFile(
      "server.php?isFile"
    , f
    , function (res) {
        console.log(res);
      }
    , function (pct) {
        console.log(pct);
      }
  );
  
});
