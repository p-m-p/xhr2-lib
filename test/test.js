module("$xhr", {

  teardown: function () {

    $xhr
      .defaultError(function () { console.log(this, arguments); })
      .defaultSuccess(function () { console.log(this, arguments); });

  }

});

test("serialize()", function () {

  var url1 = "http://www.example.com"
    , url2 = "http://www.example.com?withqs=true";

  equal(
      $xhr.serialize({paramOne: "test",  paramTwo: "test"})
    , "paramOne=test&paramTwo=test"
    , "No Url"
  );

  equal(
      $xhr.serialize({paramOne: "test",  paramTwo: "test"}, url1)
    , "http://www.example.com?paramOne=test&paramTwo=test"
    , "Url without query string"
  );

  equal(
      $xhr.serialize({paramOne: "test",  paramTwo: "test"}, url2)
    , "http://www.example.com?withqs=true&paramOne=test&paramTwo=test"
    , "Url with query string"
  );

  equal(
      $xhr.serialize({}, url1)
    , "http://www.example.com"
    , "Empty data object"
  );

  equal(
      $xhr.serialize(undefined, url1)
    , "http://www.example.com"
    , "Undefined data object"
  );

  equal(
      $xhr.serialize()
    , ""
    , "Nothing defined"
  );

});


asyncTest("get", function () {

  $xhr.get(
      "server.php"
    , {
          testget: 1
        , title: "Testing get()"
        , msg: "The test has passed"
      }
    , function (html) {

        equal(
            html.replace(/\s/g, "")
          , "<header><h1>Testingget()</h1></header>" +
            "<section><p>Thetesthaspassed</p></section>" +
            "<footer><p>&copy;2011</p></footer>"
          , "Data and callback"
        );

        start();

      }
  );

  stop();

  $xhr.get(
      "server.php?testget"
    , function (html) {

        equal(
            html.replace(/\s/g, "")
          , "<header><h1>notitle</h1></header>" +
            "<section><p>nomessage</p></section>" +
            "<footer><p>&copy;2011</p></footer>"
          , "No data just callback"
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
          , [
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

      }
  );

  stop();

  $xhr.getJSON(
      "server.php"
    , {
          testgetjson: 1
        , "users": "john,jane"
      }
    , function (data) {

        deepEqual(
            data
          , [
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
            ]
          , "Data object passed with callback function"
        );

        start();

      }
  );

});


asyncTest("getXML", function () {

  $xhr.getXML("data/test.xml", function (xml) {

    equal(xml.documentElement.nodeName, "note", "No data just callback");
    start();

  });

  stop();

  $xhr.getXML("data/xml.php", {rootnode: 'note'}, function (xml) {

    equal(xml.documentElement.nodeName, "note", "Data and callback");
    start();

  });

});


asyncTest("post", function () {

  $xhr.post(
      "server.php"
    , {
          testgetjson: 1
        , users: ["david", "jane"]
      }
    , function (data) {

        deepEqual(
            data
          , [
                {
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
          , "Data with array, json response type and callback"
        );

        start();

      }
    , "json"
  );

});


asyncTest("404 with defaultError handler", function () {

  $xhr.defaultError(function (st, s) {

    // two birds one stone
    ok($xhr.isTypeOf(this, "XMLHttpRequest"), "test is type of");

    equal(s, 404);
    equal(st, "Not Found");

    start();

  });

  $xhr.get("notfound.php");

});


asyncTest("500 with explicit error handler", function () {

  $xhr.ajax({
      url: "server.php"
    , data: { test500: 1 }
    , error: function (st, s) {

        equal(s, 500);
        equal(st, "Internal Server Error");

        start();

      }
  });

});

asyncTest("304 not modified", function () {

  $xhr.get("server.php?notmodified", function () {

    equal(this.status, 304);
    equal(this.statusText, "Not Modified");

    start();

  });

});


asyncTest("defaultSuccess", function () {

  $xhr.defaultSuccess(function (json) {

    deepEqual(
        json
      , [{
            firstname: "David"
          , lastname: "Bowe"
          , occupation: "Singer"
        }]
    );

    start();

  });

  $xhr.getJSON("server.php", { testgetjson: 1, users: "david" });

});


asyncTest("Web worker request", function () {

  var worker = new Worker("worker.js");
  worker.addEventListener("message", function (ev) {

    equal("David", ev.data.firstname);
    start();

  })
  worker.postMessage("verk it");

});

asyncTest("Blob response type", function () {
  $xhr.get(
      'data/cat-pic.jpg'
    , function (blob) {
        equal(blob.size, 35807);
        start();
      }
    , 'blob'
  );
});

asyncTest("ArrayBuffer response type", function () {
  $xhr.get(
      'data/cat-pic.jpg'
    , function (buffer) {
        equal(buffer.byteLength, 35807);
        start();
      }
    , 'arraybuffer'
  );
});
