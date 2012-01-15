XMLHttpRequest Level 2 Ajax library
===

Current state of this project
---

This project is something I am building to progress my knowledge of HTTP,
and Ajax while getting up to speed with the new specifications
for the XMLHttpRequest object. The [XMLHttpRequest level 2][1] specification 
is still in draft and is not supported by any current version of Internet
Explorer or Opera.

[1]: http://dev.w3.org/2006/webapi/XMLHttpRequest-2/
[2]: http://www.w3.org/TR/FileAPI/
[3]: http://www.w3.org/TR/XMLHttpRequest2/#the-formdata-interface

Tests
---

Yada, yada.... play now, test later :/

Documentation
---

*The documentation here is a work in progress and will, most definitely, change
over time.*

###supported()

Returns true if the client browser supports xhr2lib, false otherwise.

####Example
```js
<script>

  if ($xhr.supported()) {
    // do something amazing
  }

  else {
    // load in a flash/not so magic iFrame solution... or just give up
  }
  
</script>
```

###defaultError(fn)

+ **fn** - A Function

The `defaultError` method sets up a default error handler for all requests that
do not have an explicit error handler defined.

####Example
```js
<script>

  $xhr.defaultError(function (err, st, s) {
    
    console.log("xhr: ", this);
    console.log("error: ", err);
    console.log("status text: ", st);
    console.log("status: ", s);

  });

  // 404 from the below invalid url will be handled by 
  // the above
  $xhr.post("unknownpage.php", {test: "testing"});

</script>
```

###sendForm(form [, success, dataType])

+ **form** - A HTMLFormElement.
+ **success** - Callback function to run on successful completion of the 
  request. This function will receive the response data as it's only parameter.
+ **dataType** - Format of response data (default = HTML).

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

###sendFile(url, file [, success, dataType] [, progress])

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
        
      , document.getElementById("file-field").files[0]
      
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

###get(url [, data] [,success, dataType])

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

###getJSON(url [, data] [,success])

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

###getXML(url [, data] [,success])

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

###post(url [, data] [,success, dataType])

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

###ajax(settings)

**settings** - The request settings consisting of:

+ **url** - The URL to which the request is to be sent.
+ **type** - The type of HTTP request (default = GET).
+ **dataType** - Format of the response data (default = HTML).
+ **async** - Flag to determine if request should be made asynchronously (
  default = true).
+ **username** - Username to be used for access authentication.
+ **password** - Password to be used for access authentication.
+ **success** - Callback function to run on successful completion of the 
  request. This function will receive the response data as it's only parameter.
+ **progress** - Event handler to run on the upload progress event emission.
  This function will receive the percentage of the upload progress as it's only
  parameter and is bound to the upload event object.
+ **headers** - Additional HTTP request headers.
+ **error** - Function to run if the request fails.
+ *more to come.....*

The `ajax` method is the core of the library and is utilised by all of the short
cut methods outlined above.

####Example
```js
$xhr.ajax({
  
    url: "http://www.google.com"
  
  , type: "get"
  
  , success: function (html) {
  
      console.log(html);
      
    }
    
  , dataType: "html"
  
});
```