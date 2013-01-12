XMLHttpRequest Level 2 Ajax library
===

Current state of this project
---

The [XMLHttpRequest level 2][1] specification is in draft and is not supported
by any current version of Internet Explorer or Opera. Check the current
[state of support for xhr2][5] for a more detailed summary.

For browsers that do support `xhr2-lib`--which can be checked during developemnt
with the `supported()` method--this library offers binary data transfer, upload
progress events and cross origin requests in a simple and light weight (3.5KB
minified and gzipped) API modelled on parts of the jQuery Ajax library.

`xhr2-lib` is also supported for use in [web workers][6]

Tests
---

Not yet exhaustive but tests can be run from /test/index.html.

TODOs
---
* ~~Add support for responseType of `blob` and `arraybuffer`~~
* Investigate and implement better handling of 304 responses

Documentation
---

###.supported()

Returns true if the client browser supports xhr2lib, false otherwise.

####Example
```js
<script>

  if ($xhr.supported()) {
    // do something amazing
  }
  else {
    // take some other action
  }

</script>
```

###.defaultError(fn)

+ **fn** - A Function

The `defaultError` method sets up a default error handler for all requests that
do not have an explicit error handler defined.

####Example
```js
<script>

  $xhr.defaultError(function (st, s) {
    console.log("xhr: ", this); // error handler is bound to the xhr object
    console.log("status text: ", st); // status text e.g. 'Not Found'
    console.log("status: ", s); // status e.g.404
  });

  // 404 from the below invalid url will be handled by the above
  $xhr.post("unknownpage.php", {test: "testing"});

</script>
```

###.defaultSuccess(fn)

+ **fn** - A Function

The `defaultSuccess` method sets up a default success handler for all requests
that do not have an explicit success handler defined.

####Example
```js
<nav>
  <a href="home.html">Home</a>
  <a href="about.html">About</a>
  <a href="contact.html">Contact</a>
</nav>

<div id="content">
  <!-- get some html and populate -->
</div>

<script>

  (function () {
    $xhr.defaultSuccess(function (html) {
      document.getElementById("content").innerHTML = html;
    });

    function swapContent (ev) {
      $xhr.get(this.href);
      ev.preventDefault();
    }

    // set links to load destination url into conent container
    var nl = document.querySelectorAll("nav > a")
      , i = 0;

    for (; i < nl.length; ++i) {
      nl.item(i).addEventListener("click", swapContent, false);
    }
  })();

</script>
```

###.sendForm(form [, success, dataType] [, progress])

+ **form** - A HTMLFormElement.
+ **success** - Callback function to run on successful completion of the
  request. This function will receive the response data as it's only parameter.
+ **dataType** - Format of response data (default = HTML).
+ **progress** - Event handler to run on the upload progress event emission.
  This function will receive the percentage of the upload progress as it's only
  parameter and is bound to the upload event object.

The `sendForm` method takes a HTML form element and sends it to the server. The
request type and url are taken from the form\'s action and method attributes
respectively and default to the current window location and POST if these
attributes are not defined.

The `sendForm` method will also send file fields (see: [FormData Interface][3]).

####Example
```js
<form action="test/server.php" method="post" id="example-form">
  ...
</form>

<script>

  var form = document.getElementById("example-form");

  form.addEventListener("submit", function showResponse (ev) {
    ev.preventDefault();

    $xhr.sendForm(form, function success(res) {
      var elem = document.createElement('p');

      elem.innerHTML = res;
      form.appendChild(elem);
    });
  }, false);

</script>
```

---

###.sendFile(url, file [, success, dataType] [, progress])

+ **url** - The URL to which the file is to be sent.
+ **file** - File or Blob object to send.
+ **success** - Callback function to run on successful completion of the
  request. This function will receive the response data as it's only parameter.
+ **dataType** - Format of response data (default = HTML).
+ **progress** - Event handler to run on the upload progress event emission.
  This function will receive the percentage of the upload progress as it's only
  parameter and is bound to the upload event object.

The `sendFile` method takes a `File` or `Blob` object (see: [File API][2]) and
sends it to the specified URL.

####Example
```js
<form action="" method="post">
  <input type="file" id="file-field" name="upload" multiple>

  <div id="progress-outer">
    <div id="progress-inner"></div>
  </div>
</form>

<script>

  var sf = document.getElementById("file-field")
    , up = document.getElementById("progress-inner");

  sf.addEventListener("change", function (ev) {
    ev.preventDefault();

    $xhr.sendFile(
        "test/server.php?isFile"
      , sf.files[0]
      , function success(res) {
          up.style.backgroundColor = "#0F0";
          up.style.width = "100%";
        }
      , function progress(pct) {
          up.style.width = pct + "%";
        }
      , "text"
    );
  });

</script>
```

---

###.get(url [, data] [,success, dataType])

+ **url** - The URL from which to get data.
+ **data** - Request data object to be sent to the server.
+ **success** - Callback function to run on successful completion of the
  request. This function will receive the response data as it's only parameter.
+ **dataType** - Format of response data (default = HTML).

The `get` method is a short cut to the `ajax` method.

####Example
```js
$xhr.get(
    "test/server.php"
  , { username: "Joe bloggs"}
  , function success(html) {
      document.getElementById("user-info").innerHTML = html;
    }
);
```

---

###.getJSON(url [, data] [,success])

+ **url** - The URL from which to get data.
+ **data** - Request data object to be sent to the server.
+ **success** - Callback function to run on successful completion of the
  request. This function will receive the response data as it's only parameter.

The `getJSON` method is a short cut to the `ajax` method where the desired
response data type is JSON.

####Example
```js
$xhr.getJSON(
    "test/server.php"
  , { username: "Joe bloggs"}
  , function success(data) {
      console.log("userid: " + data.userid);
      console.log("last login: " + data.lastLogin);
    }
);
```

---

###.getXML(url [, data] [,success])

+ **url** - The URL from which to get data.
+ **data** - Request data object to be sent to the server.
+ **success** - Callback function to run on successful completion of the
  request. This function will receive the response data as it's only parameter.

The `getXML` method is a short cut to the `ajax` method where the desired
response data type is an XML Document/Fragment.

####Example
```js
$xhr.getXML(
    "test/server.php"
  , { weather: "London" }
  , function success(xml) {
      console.log(xml.documentElement);
    }
);
```

---

###.post(url [, data] [,success, dataType])

+ **url** - The URL from which to get data.
+ **data** - Request data object (Plain, FormData, File or Blob) to be sent to
  the server.
+ **success** - Callback function to run on successful completion of the
  request. This function will receive the response data as it's only parameter.
+ **dataType** - Format of response data (default = HTML).

The `post` method is a short cut to the `ajax` method.

####Example
```js
$xhr.post(
    "test/server.php"
  , {
        action: "register new user"
      , username: "Joe bloggs"
      , email: "joe@bloggs.com"
      , telephone: "0208 123 4567"
    }
  , function success(json) {
      console.log("userid: " + json.newUserID);
    }
  , "json"
);
```

---

###.ajax(settings)

**settings** - The request settings consisting of:

+ **url** - The URL to which the request is to be sent.
+ **type** - The type of HTTP request (default = GET).
+ **dataType** - Format of the response data (default = HTML).
+ **async** - Flag to determine if request should be made asynchronously (
    default = true).
+ **username** - Username to be used for access authentication.
+ **password** - Password to be used for access authentication.
+ **success** - Callback function to run on successful completion of the
    request. This function will receive the response data as it's only parameter
    and is bound to the client XMLHttpRequest object.
+ **progress** - Event handler to run on the upload progress event emission.
    This function will receive the percentage of the upload progress as it's only
    parameter and is bound to the upload event object.
+ **headers** - A map of additional HTTP request headers.
+ **error** - Function to run if the request fails. The error function will be
    bound to the client XMLHttpRequest object and has the status text and status
    as it's only two parameters.
+ **timeout** - The number of milliseconds to wait before timing out the
    request.
+ **withCredentials** - True if user credentials should be sent with cross-origin
    requests (see [CORS example][4]) (default = false)

The `ajax` method is the core of the library and is utilised by all of the short
cut methods outlined above.

####Example
```js
$xhr.ajax({
    url: "http://www.somecorsdomain.com"
  , data: { query: "some api call" }
  , type: "get"
  , timeout: 5000
  , success: function (data) {
      console.log(data);
    }
  , dataType: "json"
});
```

License
---
Copyright (c) 2012 Phil Parsons

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]: http://dev.w3.org/2006/webapi/XMLHttpRequest-2/
[2]: http://www.w3.org/TR/FileAPI/
[3]: http://www.w3.org/TR/XMLHttpRequest2/#the-formdata-interface
[4]: http://www.nczonline.net/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing/
[5]: http://caniuse.com/xhr2
[6]: http://dev.w3.org/html5/workers/
