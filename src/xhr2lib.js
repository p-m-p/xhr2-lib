(function (w) {
  
  "use strict";
  
  /**
    
    @author <a href="http://www.profilepicture.co.uk">Phil Parsons</a>
    
    @namespace $xhr
    
    @class
    
  */
  w.$xhr = (function () {
  
    var exp = {} // module api
      , globals = {}; // global event handlers and settings


    /**

      @method supported
      @description Tests if XMLHttpRequest level 2 is supported by the user's
        browser

      @returns {boolean}

    */
    exp.supported = function () {

      var xhr = new XMLHttpRequest;
      
      return (

        typeof xhr.upload !== "undefined" &&
        typeof w.FormData !== "undefined" &&
        typeof w.File !== "undefined"

      );

    };


    // :global handlers

    /**

      @method defaultError
      @description global error handler for all ajax errors

      @param {Function} fn The error handler function

      @returns {$xhr} The receiver for chainability

    */
    exp.defaultError = function (fn) {
      
      if (typeof fn === "function") {
        globals.err = fn;
      }

      return this;

    };


    /**

      @method defaultSuccess
      @description global success handler for all ajax requests

      @param {Function} fn The success handler function

      @returns {$xhr} The receiver for chainability

    */
    exp.defaultSuccess = function (fn) {
      
      if (typeof fn === "function") {
        globals.success = fn;
      }

      return this;

    };
    
    
    // :ajax api
    
    /**
      
      @method get
      @description Convenience function for simple HTML get
        requests
  
      @public
      @param {String} url destination URL
      @param {Object} [data] request params
      @param {Function} [cb] success callback function

      @returns {XMLHttpRequest} The client xhr object
      
    */
    exp.get = function () {
      
      var opts = createOptions(arguments);
      opts.url += exp.serializeQS(opts.url, opts.data);
      
      return exp.ajax(opts);
      
    };
    
  
    /**
      
      @method getJSON
      @description Convenience function for simple JSON get
        requests
  
      @public
      @param {String} url destination URL
      @param {Object} [data] request params
      @param {Function} [cb] success callback function

      @returns {XMLHttpRequest} The client xhr object
      
    */
    exp.getJSON = function () {
      
      var opts = mix(createOptions(arguments), {dataType: "json"});
      opts.url += exp.serializeQS(opts.url, opts.data);
      
      return exp.ajax(opts);
      
    };
    
  
    /**
      
      @method getXML
      @description Convenience function for simple XML get
        requests
  
      @public
      @param {String} url destination URL
      @param {Object} [data] request parameters
      @param {Function} [cb] success call back function

      @returns {XMLHttpRequest} The client xhr object
      
    */
    exp.getXML = function () {
      
      var opts = mix(createOptions(arguments), {dataType: "xml"});
      opts.url += exp.serializeQS(opts.url, opts.data);
      
      return exp.ajax(opts);
      
    };
       
  
    /**
    
      @method post;
      @description Convenience method for simple posts
    
      @public
      @param {String} url destination URL
      @param {Object} [data] Post data
      @param {Function} [cb] success call back function
      @param {String} [dataType] type of response data

      @returns {XMLHttpRequest} The client xhr object
      
    */
    exp.post = function () {
      
      return exp.ajax(
        mix(createOptions(arguments), {type: "post"})
      );
      
    };
    
  
    /**
    
      @method sendForm
      @description Posts a form. The action attribute of the form is used to 
        determine the destination. If no action attribute is present the 
        current location is used.
      
      @public
      @param {HTMLFormElement} form A HTML Form element
      @param {Function} [cb] success call back function
      @param {String} [dataType] type of response data

      @returns {XMLHttpRequest} The client xhr object
     
     */
     exp.sendForm = function () {
       
      var fd
        , options
        , f = arguments[0]
        , args = Array.prototype.slice.call(arguments, 1);
       
      if (f && f.nodeName === "FORM") {
          
        fd = new FormData(f);
        args.unshift(f.action || w.location.href);
        
        options = mix(
            createOptions(args)
          , { type: f.method || "post", data: fd }
        );
        
        return exp.ajax(options);
        
      } 
      
      else throw new Error("HTMLFormElement expected");
      
    };
    
    
    /**
    
      @method sendFile
      @description Posts a file. The file's name can be retrieved on the server
        side from the X-File-Name HTTP Header.
      
      @public
      @param {String} url The URL to which the file should be sent
      @param {File} file A File or Blob object
      @param {Function} [cb] Success call back function
      @param {String} [dataType] type of response data
      @param {Function} [progress] Upload progress event handler

      @returns {XMLHttpRequest} The client xhr object
     
    */
    exp.sendFile = function () {
      
      var opts = createOptions(arguments)
    	
      return exp.ajax(mix(
          opts
        , { type: "post", headers: {"X-File-Name": opts.data.name} }
      ));
    	
    };
    
    
    /**
      
      @method ajax
      @description Core Ajax method used in all ajax methods;
  
      @public
      @param {Object} opts The options for the ajax request

      @returns {XMLHttpRequest} The client xhr object
      
    */
    exp.ajax = function (opts) {
      
      var client = new XMLHttpRequest
        , upload = client.upload
        , settings = mix({ // default request parameters
              progress: false
            , type: "get"
            , dataType: "html"
            , async: true
            , username: null
            , password: null
            , timeout: 0
          }, opts)
        , tmp
        , key;

      settings.type = settings.type.toLowerCase();

      if (
            typeof settings.data === "object" && 
            settings.data.constructor.toString().indexOf("FormData") === -1
          ) {

        if (settings.type === "get") {

          settings.url += exp.serializeQS(settings.url, settings.data);
          settings.data = null;

        }

        else {

          tmp = new FormData;

          for (key in settings.data) {

            if (settings.data.hasOwnProperty(key)) {          
              tmp.append(key, settings.data[key]);
            }

          }

          settings.data = tmp;

        }

      }
        
      if (typeof settings.progress === "function") {
        
        upload.callback = settings.progress;
        upload.onprogress = progress;
        
      }
      
      if (settings.timeout > 0) {

        settings.timer = setTimeout(function () {

          client = requestTimeout(client);
          client = null;

        }, settings.timeout);

      }
      
      client.open(
          settings.type
        , settings.url
        , settings.async
        , settings.username
        , settings.password
      );
      
      addHeaders(client, settings.dataType, settings.headers);
      
      // cache settings for pickup in state change handler
      client.xhr2data = settings;
      
      client.onreadystatechange = stateChange;
      client.onerror = requestError;
      
      client.send(settings.data);

      return client;
      
    };
    
    
    
    // :Utils api
    
    
    /**
      
      @method serializeQS
      @description Serialises a data object to a query string. Only the query
        string is returned, the url is required to determine if the returned 
        query string is to be appended to an existing set of query parameters.
  
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
      Juggles the parameters for the short cut functions
     
      @private
    */
    var createOptions = function (args) {
      
      var i = 0
        , opts = { url: args[0] }
        , params = Array.prototype.slice.call(args, 1)
        , foundCB = false;
        
      for (; i < params.length; ++i) {
        
        switch (typeof params[i]) {
          
          case "string":
            opts.dataType = params[i];
            break;
            
            
          case "function": // success/progress callback functions
          
            if (foundCB) { // already registered success callback add progress
              opts.progress = params[i];
            }
            
            else {
              
              opts.success = params[i];
              foundCB = true;
              
            }
            
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
      Event handler for readystatechange events
      Fires callback, if one was defined, with
      formatted data as required
  
      @private
    */
    var stateChange = function (ev) {
      
      var resBody
        , xhr = ev.target
        , clientData = xhr.xhr2data || {}
        , genericStatus;
        
      if (xhr.readyState === xhr.DONE) {

        genericStatus = Math.round(xhr.status / 100);

        if (clientData.timer) {
          clearTimeout(clientData.timer);
        }
        
        switch (genericStatus) {

          case 2: // FIXME handle 304...
          
            if (typeof clientData.success === "function") {
                
              if (clientData.dataType === "json") {
                
                try {
                  resBody = JSON.parse(xhr.responseText);
                } 

                catch (ex) {
                  // TODO: call error handler with parse error
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

            break;


          case 4:
          case 5:
            
            requestError(ev);
            break;

        }
        
      }
      
    };


    // :private  
    
    /**
      Fires upload progress event handler with percentage
      of upload complete and total
  
      @private
    */
    var progress = function (ev) {
      
      if (ev && ev.lengthComputable) {
        ev.target.callback.call(ev, Math.round(ev.loaded / ev.total) * 100);
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
      
      accept += "*/*;q=0.01";
      
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
    */
    var requestError = function (ev) {
      
      var xhr = ev.target, fn;

      if (xhr) {

        fn = errorHandler(xhr);
        
        if (fn) {

          fn.call(xhr, ev, xhr.statusText, xhr.status);
          return;

        }

        throw {
            type: "XHR2BadRequestError"
          , message: xhr.statusText || "Failed request"
          , target: xhr
        };

      }
      
    };


    /**
      Request timeout handler

      @private
    */
    var requestTimeout = function (xhr) {
      
      var fn = errorHandler(xhr);

      xhr.abort();
      
      if (fn) {

        fn.call(
            undefined
          , {
                message: "Request timed out"
              , type: "XHR2RequestTimeout"
            }
          , "timeout"
          , xhr.status
        );

      }

      xhr = null;

    };


    /**
      Gets the default or request defined error handler

      @private
    */
    var errorHandler = function (xhr) {
      
      if (xhr.clientData && typeof xhr.clientData.error === "function") {
        return xhr.clientData.error;
      }

      if (globals.err) {
        return globals.err;
      }

      return undefined;

    };
  
    
    return exp; // export api
    
  
  })();

})(window);
