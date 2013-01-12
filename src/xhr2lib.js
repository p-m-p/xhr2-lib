/**

Copyright (c) 2012 Phil Parsons http://philparsons.co.uk

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(function (ns) {

  "use strict";

  /**

    @author <a href="http://www.profilepicture.co.uk">Phil Parsons</a>
    @namespace $xhr
    @class

  */
  ns.$xhr = (function () {

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
        typeof xhr.upload !== "undefined" && (
          // Web worker
          typeof ns.postMessage !== "undefined" ||
          // window
          (typeof ns.FormData !== "undefined" && typeof ns.File !== "undefined")
        )
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
      return exp.ajax(createOptions(arguments));
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
      return exp.ajax(mix(createOptions(arguments), {dataType: "json"}));
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
      return exp.ajax(mix(createOptions(arguments), {dataType: "xml"}));
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
      return exp.ajax(mix(createOptions(arguments), {type: "post"}));
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
        args.unshift(f.action || ns.location.href);
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
      var opts = createOptions(arguments);

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
            , withCredentials: false
          }, opts)
        , tmp
        , key;

      settings.type = settings.type.toLowerCase();

      if (
            typeof settings.data === "object" &&
            !exp.isTypeOf(settings.data, "formdata") &&
            !exp.isTypeOf(settings.data, "file")
          ) {

        if (settings.type === "get") {
          settings.url = exp.serialize(settings.data, settings.url);
          settings.data = null;
        }
        else {
          tmp = new FormData;

          for (key in settings.data) {
            if (settings.data.hasOwnProperty(key)) {
              tmp.append(key, exp.isTypeOf(settings.data[key], "array") ?
                settings.data[key].join() : settings.data[key]
              );
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

      if (/^(blob|arraybuffer)$/.test(settings.dataType)) {
        client.responseType = settings.dataType;
      }

      client.withCredentials = settings.withCredentials;
      addHeaders(client, settings.dataType, settings.headers, settings.cors);

      // cache settings for pickup in state change handler
      client.xhr2data = settings;
      client.onreadystatechange = stateChange;
      client.onerror = requestError;
      client.send(settings.data);

      return client;
    };


    // :Utils api

    /**

      @method serialize
      @description Serialises a data object to a query string. If the appendTo
        string is supplied then the serialized object will be appended to that
        string.
      @public
      @param {Object} data the request data
      @param {String} [appendTo] an existing query string/url
      @returns {String} data object serialised and appropriately appended to
        appendTo, if supplied.

    */
    exp.serialize = function (data, appendTo) {
      var qs = "";

      if (appendTo && typeof appendTo === "string") {
        if (appendTo.indexOf("?") === -1) {
          qs = "?";
        }
        else {
          qs = "&";
        }
      }
      else {
        appendTo = "";
      }

      if (typeof data === "object") {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            qs += key + "=" + data[key] + "&";
          }
        }
      }

      return appendTo + qs.substr(0, qs.length - 1); // scrub the last &;
    };


    /**

      @method isTypeOf
      @description Safe type checking for object types such as Array
      @param {object} obj The object to test
      @param {string} type The type to test against

    */
    exp.isTypeOf = function (obj, type) {
      var cts = obj.constructor.toString().toLowerCase();
      type = type.replace(/^\s*|\s*$/, "").toLowerCase();

      return cts.indexOf(type) !== -1;
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
        , sh;

      if (xhr.readyState === xhr.DONE) {
        if (clientData.timer) {
          clearTimeout(clientData.timer);
        }

        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          sh = successHandler(clientData);

          if (typeof sh === "function") {
            if (clientData.dataType === "json") {
              resBody = JSON.parse(xhr.responseText);
            }
            else if (clientData.dataType === "xml") {
              resBody = xhr.responseXML;
            }
            else if (/^(blob|arraybuffer)$/.test(clientData.dataType)) {
              resBody = xhr.response;
            }
            else {
              resBody = xhr.responseText;
            }

            sh.call(xhr, resBody);
            return;
          }
        }

        requestError(ev);
      }
    };


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
      var accept, header;

      switch ((resType || "").toLowerCase()) {
        case "json":
          accept = "application/json, text/javascript, ";
          break;

        case "xml":
          accept = "text/xml, application/xml, ";
          break;

        case "text":
          accept = "text/plain, ";
          break;

        default:
          accept = "text/html, ";
      }

      accept += "*/*;q=0.01";
      client.setRequestHeader("Accept", accept);

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
          fn.call(xhr, xhr.statusText, xhr.status);
        }
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
        fn.call(xhr, "timeout", xhr.status);
      }
    };


    /**
      Gets the default or request defined error handler

      @private
    */
    var errorHandler = function (xhr) {
      if (xhr.xhr2data && typeof xhr.xhr2data.error === "function") {
        return xhr.xhr2data.error;
      }

      if (globals.err) {
        return globals.err;
      }

      return undefined;
    };


    /**
      Gets the default or request defined success handler

      @private
    */
    var successHandler = function (xhr2data) {
      if (xhr2data && xhr2data.success) {
        return xhr2data.success;
      }

      if (globals.success) {
        return globals.success;
      }

      return undefined;
    };


    return exp; // export api

  })();

})(self || window);
