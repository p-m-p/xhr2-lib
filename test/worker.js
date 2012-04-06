importScripts("../src/xhr2lib.js");

self.addEventListener("message", function () {

  $xhr.getJSON(
      "server.php"
    , { testgetjson: 1, users: "david" }
    , function (data) {
        self.postMessage(data[0]);
      }
  );

}, false);
