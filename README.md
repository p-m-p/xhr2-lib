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

Documentation
---

*The documentation here is a work in progress and will, most definitely change.*

###sendForm(form [, callback, dataType])

  **form** - A HTMLFormElement.
  **callback** - Callback function to run on successful completion of the 
    request.
  **dataType** - Format of response data (default = HTML).

The send form method takes a HTML form element and sends it to the server. The 
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
  
    $xhr.postForm(form, function success(res) {
      
      var elem = document.createElement('p');
      elem.innerHTML = res;
      form.appendChild(elem);
      
    });
  
  }, false);
<script>
```

