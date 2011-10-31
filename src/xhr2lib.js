(function (w) {
  
  "use strict";
  
  /**
    
    @author <a href="http://www.profilepicture.co.uk">Phil Parsons</a>
    
    @namespace $xhr
    
    @class
    
  */
  w.$xhr = (function () {
  
    var exp = {}; // module api
    
    
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
      
      var opts = createOptions(arguments);
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
      
      var opts = mix(createOptions(arguments), {dataType: "json"});
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
      
      var opts = mix(createOptions(arguments), {dataType: "xml"});
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
      @param {String} [dataType] type of response data
      
    */
    exp.post = function () {
      
      exp.ajax(
        mix(createOptions(arguments), {type: "post"})
      );
      
    };
    
  
    /**
    
      @method postForm
      @description Posts a form. The action attribute of the form is used to 
        determine the destination. If no action attribute is present the 
        current location is used.
      
      @public
      @param {HTMLFormElement} form A HTML Form element
      @param {Function} [cb] success call back function
      @param {String} [dataType] type of response data
     
     */
     exp.postForm = function () {
       
      var fd
        , options
        , f = arguments[0]
        , args = Array.prototype.slice.call(arguments, 1);
       
      if (f && f.nodeName === "FORM") {
          
        fd = new FormData(f);
        args.unshift(f.action || w.location.href);
        
        options = mix(
            createOptions(args)
          , { type: "post", data: fd }
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
      @param {String} [dataType] type of response data
     
    */
    exp.postFile = function () {
      
      var opts = createOptions(arguments)
    	
      exp.ajax(mix(
          opts
        , { type: "post", headers: {"X-File-Name": opts.data.name} }
      ));
    	
    };
    
    
    /**
      
      @method ajax
      @description Core Ajax method used in all ajax methods;
  
      @public
      @param {Object} opts The options for the ajax request
      
    */
    exp.ajax = function (opts) {
      
      var client = new XMLHttpRequest()
        , upload = client.upload
        , settings = mix({ // default request parameters
              progress: false
            , type: "get"
            , dataType: "html"
            , async: true
            , username: null
            , password: null
          }, opts);
        
      if (settings.progress && typeof settings.progress === "function") {
        
        upload.callback = settings.progress;
        upload.addEventListener("progress", progress, false);
        
      }
      
      if (settings.timeout && typeof settings.timeout === "number") {
        client.timeout = settings.timeout;
      }
      
      client.open(
          settings.type
        , settings.url
        , settings.async
        , settings.username
        , settings.password
      );
      
      addHeaders(client, settings.dataType, settings.headers);
      
      // cache setting for pickup in state change handler
      client.xhr2data = settings;
      
      client.onreadystatechange = stateChange;
      client.onerror = requestError;
      
      client.send(settings.data);
      
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
        
        qs = qs.substr(0, qs.length - 1); // scrub the last &
        
      }
      
      return qs;
      
    };
    
    
    
    // :private    
    
    /**
     
      @method  
    
    */
    var createOptions = function (args) {
      
      var i = 0
        , opts = { url: args[0] }
        , params = Array.prototype.slice.call(args, 1);
        
      for (; i < params.length; ++i) {
        
        switch (typeof params[i]) {
          
          case "string":
            opts.dataType = params[i];
            break;
            
          case "function": // success/progress callback functions
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
    var mix = function () {
      
      var ret = {}
        , i = 0
        , key;
      
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
      
      @method stateChange
      @description Event handler for readystatechange events
        Fires callback, if one was defined, with
        formatted data as required
  
      @private
      
    */
    var stateChange = function (ev) {
      
      var resBody
        , xhr = ev.target
        , clientData = xhr.xhr2data || {};
        
      if (xhr.readyState === xhr.DONE) {
        
        if (xhr.status === 200) {
          
          if (typeof clientData.success === "function") {
              
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
            
            clientData.success.call(xhr, resBody);
          
          }
          
        }
        
        // for now - pass anything but 200 to error handler :$
        else {
          requestError(xhr);
        }
        
      }
      
    };
  
    
    /*
      Fires upload progress event handler with percentage
      of upload complete and total
  
      @private
    */
    var progress = function (ev) {
      
      if (ev && ev.lengthComputable) {
        ev.target.callback.call(ev, Math.round(ev.total / ev.loaded) * 100);
      }
      
    };
  
    
    /**
      Add request headers including accept mime
  
      @private
    */
    var addHeaders = function (client, resType, headers) {
      
      var accept = "", header;
      
      switch ((resType || "").toLowerCase()) {
        
        case "html":
          accept += "text/html, ";
          break;
        
        case "json":
          accept += "application/json, text/javascript, ";
          break;
          
        case "xml":
          accept += "text/xml, application/xml, ";
          break;
          
        case "text":
          accept += "text/plain, ";
        
      }
      
      accept += "*/*;q=0.1";
      
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
    var requestError = function (xhr) {
      
      console.log("error: ", xhr);
      
    };
  
    
    return exp; // export api
    
  
  })();

})(window);
