XMLHttpRequest Level 2 Ajax library
===

*If you stumble across this project and use this library, as it is, in any 
production code then may the sky fall on your head.*

Current state of this project
---

So this project is something I am building to progress my knowledge of the 
mechanics behind Ajax while getting up to speed with the new specifications
for the XMLHttpRequest object. The [XMLHttpRequest level 2][1] specification 
is still in draft and who knows, by the time it is finished and supported by 
all *modern* browsers I may have completed this library.

[1]: http://dev.w3.org/2006/webapi/XMLHttpRequest-2/
[2]: http://www.w3.org/TR/FileAPI/

Documentation
---

*The documentation here is a work in progress and will, most definitely, change
over time.*

###sendForm(form [, success, dataType])

+ **form** - A HTMLFormElement.
+ **success** - Callback function to run on successful completion of the 
  request. This function will receive the response data as it's only parameter.
+ **dataType** - Format of response data (default = HTML).

The `sendForm` method takes a HTML form element and sends it to the server. The 
request type and url are taken from the form\'s action and method attributes
respectively and default to the current window location and POST if these 
attributes are not defined.

####Example
```js
<form action="test/server.php" method="post" id="example-form">
  ...
<form>

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
  
<script>
```
###sendFile(url, file [, success, dataType] [, progress])

+ **url** - The URL to which the file is to be sent.
+ **file** - File or Blob object to send.
+ **success** - Callback function to run on successful completion of the 
  request. This function will receive the response data as it's only parameter.
+ **dataType** - Format of response data (default = HTML).
+ **progress** - Event handler to run on the upload progress event emission.
  This function will receive the percentage of the upload progress as it's only
  parameter and is scoped to the upload event object.
  
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

  var sf = document.getElementById("file-field");
  
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