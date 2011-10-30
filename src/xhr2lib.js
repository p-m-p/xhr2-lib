(function (w) {
  
  "use strict";
  
  /**
    
    @author <a href="http://www.profilepicture.co.uk">Phil Parsons</a>
    
    @namespace $xhr
    
    @class
    
  */
  w.$xhr = (function () {
  
  
    var exp = Object.create(null); // module api
        
    
    // :ajax api
    
  
    /**
      
      @method get
      @description Convenience function for simple HTML get
        requests
  
      @public
      @param {String} url destination URL
      @param {Object} [data] request params
      @param {Function} [cb] success callback function
      
    */
    exp.get = function () {
      
      var opts = _createOptions(arguments);
      opts.url += exp.serializeQS(opts.url, opts.data);
      
      exp.ajax(opts);
      
    };
    
  
    /**
      
      @method getJSON
      @description Convenience function for simple JSON get
        requests
  
      @public
      @param {String} url destination URL
      @param {Object} [data] request params
      @param {Function} [cb] success callback function
      
    */
    exp.getJSON = function () {
      
      var opts = _mix(_createOptions(arguments), {dataType: "json"});
      opts.url += exp.serializeQS(opts.url, opts.data);
      
      exp.ajax(opts);
      
    };
    
  
    /**
      
      @method getXML
      @description Convenience function for simple XML get
        requests
  
      @public
      @param {String} url destination URL
      @param {Object} [data] request parameters
      @param {Function} [cb] success call back function
      
    */
    exp.getXML = function () {
      
      var opts = _mix(_createOptions(arguments), {dataType: "xml"});
      opts.url += exp.serializeQS(opts.url, opts.data);
      
      exp.ajax(opts);
      
    };
       
  
    /**
    
      @method post;
      @description Convenience method for simple posts
    
      @public
      @param {String} url destination URL
      @param {Object} [data] Post data
      @param {Function} [cb] success call back function
      
    */
    exp.post = function () {
      
      exp.ajax(
        _mix(createOptions(arguments), {type: "post"})
      );
      
    };
    
  
    /**
    
      @method sendForm
      @description Posts a form or creates a get request based on the forms
        attributes
      
      @public
      @param {HTMLFormElement} form A HTML Form element
      @param {Function} [cb] success call back function
     
     */
     exp.sendForm = function () {
       
      var fd
        , options
        , f = arguments[0]
        , args = Array.prototype.slice.call(arguments, 1);
       
      if (f && f.nodeName === "FORM") {
          
        fd = new FormData(f);
        options = _mix(
            _createOptions(args)
          , { url: f.action || w.location.href, type: "post", data: fd }
        );
        
        exp.ajax(options);
        
      } 
      
      else throw new Error("HTMLFormElement expected");
      
    };
    
    
    /**
    
      @method sendFile
      @description Posts a file. The file's name can be retrieved on the server
        side from the X-File-Name HTTP Header.
      
      @public
      @param {String} url The URL to which the file should be sent
      @param {File} file A File object
      @param {Function} [cb] Success call back function
     
    */
    exp.sendFile = function (url, file, cb) {
    	
    	exp.ajax({
    	   url: url + "?isFile"
    	 , data: file
    	 , success: success
    	 , type: "post"
    	 , headers: {
      	   "X-File-Name": f.name
      	 }
    	});
    	
    };
    
    
    /**
      
      @method ajax
      @description Core Ajax method used in all ajax methods;
  
      @public
      @param {Object} opts The options for the ajax request
      
    */
    exp.ajax = function (opts) {
      
      var client = new XMLHttpRequest()
        , upload
        , defaults = { // default request parameters
              progress: false
            , type: "get"
            , dataType: "html"
          }
        , opts = _mix(defaults, opts);
        
      // progress event listener
      if (opts.progress && typeof opts.progress === "function") {
        
        upload = client.upload;
        
        if (upload) {
          upload.callback = opts.progress;
          upload.addEventListener("progress", _progress, false);
        }
        
      }
      
      if (opts.timeout && typeof opts.timeout === "number") {
        client.timeout = opts.timeout;
      }
      
      // create connection
      client.open(opts.type, opts.url);
      _headers(client, opts.dataType, opts.headers);
      
      // cache options and callback function
      client.xhr2data = opts;
      client.callback = opts.success;
      
      // client event handlers
      client.onreadystatechange = _stateChange;
      client.onerror = _requestError;
      
      //send request
      client.send(opts.data);
      
    };
    
    
    
    // :Utils api
    
    
    /**
      
      @method serializeQS
      @description Serialises a data object to a query string
  
      @public
      @param {String} url the destination url
      @param {Object} data the request data
  
      @returns {String} data object serialised
      
    */
    exp.serializeQS = function (url, data) {
      
      var qs = "";
      
      if (typeof data === "object") {
        
        if (!~url.search(/\?/)) {
          qs = "?";
        } 
        else {
          qs = "&";
        }
        
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            qs += key + "=" + data[key] + "&";
          }
        }
        
        qs = qs.substr(0, qs.length - 1);
        
      }
      
      return qs;
      
    };
    
    
    
    // :private    
    
    
    var _createOptions = function (args) {
      
      var i = 0
        , opts = { url: args[0] }
        , params = Array.prototype.slice.call(args, 1);
        
      for (; i < params.length; ++i) {
        
        switch (typeof params[i]) {
          
          case "string":
            opts.dataType = params[i];
            break;
            
          case "function": // success callback function
            opts.success = params[i];
            break;
            
          case "object": // data object
            opts.data = params[i];
          
        }
        
      }
      
      return opts;
      
    };
    
  
    /**
      Mixes passed in options with the defaults
  
      @private
    */
    var _mix = function () {
      
      var ret = {}
        , i = 0
        , key;
      
      // have options to mix into defaults
      if (arguments.length && typeof arguments[0] !== "undefined") {
        
        for (; i < arguments.length; ++i) { // each option set
          
          for (key in arguments[i]) {
            
            if (arguments[i].hasOwnProperty(key)) {
              ret[key] = arguments[i][key];
            }
            
          }
          
        }
        
      }
      
      return ret;
      
    };
    
  
    /**
      Event handler for readystatechange events
      Fires callback, if one was defined, with
      formatted data as required
  
      @private
    */
    var  _stateChange = function (ev) {
      
      var resBody
        , xhr = ev.target
        , clientData = xhr ? xhr.xhr2data : undefined;
        
      if ((xhr && xhr.callback) && clientData) {
        
        if (xhr.readyState === 4) {
          
          if (clientData.dataType === "json") {
            try {
              resBody = JSON.parse(xhr.responseText);
            } catch (ex) {
              // if invalid json data - don't error, just pass response body
              resBody = xhr.responseText;
            }
          }
          
          else if (clientData.dataType === "xml") {
            resBody = xhr.responseXML;
          }
          
          else {
            resBody = xhr.responseText;
          }
          
          xhr.callback.call(xhr, resBody);
          
        }
        
      }
      
    };
  
    
    /*
      Fires upload progress event handler with percentage
      of upload complete and total
  
      @private
    */
    var  _progress = function (ev) {
      
      if (ev && ev.lengthComputable) {
        // call progress handler with pct loaded
      }
      
    };
  
    
    /**
      Add request headers including accept mime
  
      @private
    */
    var  _headers = function (client, resType, headers) {
      
      var accept = "", header;
      
      switch ((resType || "").toLowerCase()) {
        
        case "json":
          accept += "application/json, text/javascript, ";
          break;
          
        case "xml":
          accept += "text/xml, ";
          break;
          
        case "html":
          accept += "text/html, ";
          break;
          
        case "text":
          accept += "text/plain, ";
        
      }
      
      accept += "*/*; q=0.1";
      
      client.setRequestHeader("Accept", accept);
      client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      
      if (typeof headers === "object") { // user defined headers
        
        for (header in headers) {
          
          if (headers.hasOwnProperty(header)) {
            client.setRequestHeader(header, headers[header]);
          }
          
        }
        
      }
      
    };
  
    
    /**
      Default error handler for requests
      
      @private
      
      @param {XMLHttpRequest} xhr The failed request object
     */
    var  _requestError = function (xhr) {
      
      console.log("error: ", xhr);
      
    };
  
    
    return exp; // export api
    
  
  })();

})(window);