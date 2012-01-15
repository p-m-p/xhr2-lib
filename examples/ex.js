(function () {
      
  var tf = document.getElementById("test-form")
    , sf = document.getElementById("file-field")
    , up = document.getElementById("progress-inner");
    

  if (!$xhr.supported()) {
    alert("Your browser does not support xhr2");
  }


  $xhr.defaultError(function (err, st, s) {
    
    console.log("xhr: ", this);
    console.log("error: ", err);
    console.log("status text: ", st);
    console.log("status: ", s);

  });

  
  tf.addEventListener("submit", function (ev) {
  
    ev.preventDefault();
  
    $xhr.sendForm(tf, function (res) {
      
      var elem = document.createElement('p');
      elem.innerHTML = res;
      tf.appendChild(elem);
      
    });
  
  }, false);

  
  sf.addEventListener("change", function (ev) {
    
    ev.preventDefault();
    
    $xhr.sendFile(
      
        "test/server.php?isFile"
        
      , document.getElementById("file-field").files[0]
      
      , function success(res) {
        
          up.style.backgroundColor = "#0F0";
          up.style.width = "100%";

          console.log("file upload complete!");
          
        }
        
      , function progress(pct) {
          
          up.style.width = pct + "%";
          
        }
        
      , "text"
      
    );
    
  });

  
  $xhr.ajax({
    
      url: "test/server.php"

    , data: {testgetjson: true, p1: "one", p2: "two", p3: "three"}

    , type: "get"

    , success: function (data) {
        console.log(data);
      }

    , dataType: "json"

  });


})();
