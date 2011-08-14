/**
	@author <a href="http://www.profilepicture.co.uk">Phil Parsons</a>
	@namespace xhr2-lib
	@class
*/
var xhr2 = (function () {

	var exp = {};

	var defaults = {
			progress: false
		,	type: "GET"
		,	dType: "html"
	};

	/**
		Convenience function for simple HTML get
		requests

		@public
		@param {String} url destination URL
		@param {Object} [data] request params
		@param {Function} [cb] success callback function 
	*/
	exp.get = function (url, data, cb) {
		var qs = exp.serializeQS(url, data);
		_getRequest(url + qs, defaults, data, cb);
	}

	/**
		Convenience function for simple JSON get
		requests

		@public
		@param {String} url destination URL
		@param {Object} [data] request params
		@param {Function} [cb] success callback function 
	*/
	exp.getJSON = function (url, data, cb) {
		var qs = exp.serializeQS(url, data)
			,	opts = _mix({dType: "json"});
		_getRequest(url + qs, opts, data, cb);
	}

	/**
		Convenience function for simple XML get
		requests

		@public
		@param {String} url destination URL
		@param {Object} [data] request params
		@param {Function} [cb] success callback function 
	*/
	exp.getXML = function (url, data, cb) {
		var qs = exp.serializeQS(url, data)
			,	opts = _mix({dType: "xml"});
		_getRequest(url + qs, opts, data, cb);
	}

	/**
		Serialises a data object into a query string

		@public
		@param {String} url the destination url
		@param {Object} data the request data
	*/
	exp.serializeQS = function (url, data) {
		var qs = "";
		if (typeof data === "object") {
			if (!~url.search(/\?/)) {
				qs = "?";
			} else {
				qs = "&";
			}
			for (var key in data) {
				qs += key + "=" + data[key] + "&";
			}
			qs = qs.substr(0, qs.length - 1);
		}
		return qs;
	}

	exp.post = function (url, opts, data, cb) {
		_request(url, opts, (data || {}), cb);
	}
	
	var _getRequest = function () {
		// No data just callback
		if (typeof arguments[2] === "function") {
			_request(arguments[0], arguments[1], undefined, arguments[2]);
		// data and callback / data and no callback / neither
		} else {
			_request(arguments[0], arguments[1], arguments[2], arguments[3]);
		}
	}

	/**
		Creates the request and attaches all event handlers

		@private
		@param {String} url destination url
		@param {Object} opts request options
		@param {FormData|File|Blob} [data] request data
		@param {function} [cb] callback function on success
	*/
	var	_request = function (url, opts, data, cb) {
		var client = new XMLHttpRequest()
			,	params = _mix(opts)
			,	upload;
		if (params.progress && typeof params.progress === "function") {
			upload = client.upload;
			if (upload) {
				upload.callback = params.progress;
				upload.addEventListener("progress", _progress, false);
			}
		}
		client.open(params.type, url);
		_addHeaders(client, params.dType);
		client.xhr2data = params;
		client.callback = cb;
		client.addEventListener(
				"readystatechange"
			,	_stateChange
			,	false
		);
		client.addEventListener(
				"error"
			,	_handleRequestError
			,	false
		);
		client.send(data);
	}

	/**
		Mixes passed in options with the defaults

		@private
	*/
	var _mix = function () {
		var ret = {}
			,	i = 0
			,	key;
		for (key in defaults) {
			ret[key] = defaults[key];
		}
		if (arguments.length && typeof arguments[0] !== "undefined") {
			for (; i < arguments.length; ++i) {
				for (key in arguments[i]) {
					ret[key] = arguments[i][key];
				}
			}
		}
		return ret; 
	}

	/**
		Event handler for readystatechange events
		Fires callback, if one was defined, with
		formatted data as required

		@private
	*/
	var	_stateChange = function (ev) {
		var xhr = ev.target
			,	clientData = xhr ? xhr.xhr2data : undefined;
		if (clientData) {
			if (xhr.readyState === 4) {
				if (clientData.dType === "json") {
					try {
						resBody = JSON.parse(xhr.responseText);
					} catch (ex) {
						// invalid json data, just pass response body
						resBody = xhr.responseText;
					}
				} else if (clientData.dType === "xml") {
					resBody = xhr.responseXML;
				} else {
					resBody = xhr.responseText;
				}
				if (xhr.callback) {
					xhr.callback.call(undefined, resBody);
				}
			}
		}
	}

	/*
		Fires upload progress event handler with percentage
		of upload complete and total

		@private
	*/
	var	_progress = function (ev) {
		console.log(ev);
		if (ev && ev.lengthComputable) {
			// call progress handler with pct loaded
		}
	}

	/**
		Add request headers including accept mime

		@private
	*/
	var	_addHeaders = function (client, resType) {
		var mime = "*/*, text/html"
			,	resType = resType.toLowerCase();
		client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		client.setRequestHeader("Cache-Control", "No-Cache");
		if (resType === "json") {
			mime += ", application/json";
		} else if (resType === "xml") {
			mime += ", text/xml";
		}
		client.setRequestHeader("Accept", mime);
	}

	var	_handleRequestError = function (xhr) {
		console.log(xhr);
	}

	return exp;

})();
