importScripts("../src/xhr2lib.js");

self.addEventListener("message", function () {

  if ($xhr.supported()) {

    $xhr.getJSON(
        "server.php"
      , { testgetjson: 1, users: "david" }
      , function (data) {
          self.postMessage(data[0]);
        }
    );

  }

  else {
    self.postMessage("Not supported");
  }

}, false);
