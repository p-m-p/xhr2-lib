var XHR2Ajax = (function () {

	var defaults = {
			progress: false
		,	type: "GET"
		,	dType: "html"
	};

	return methods = {

			get: function (url, data, cb) {
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
				methods._request(url + qs, undefined, undefined, cb);
			}

		,	post: function (url, opts, data, cb) {
				methods._request(url, opts, (data || {}), cb);
			}

		,	_request: function (url, opts, data, cb) {
				var client = new XMLHttpRequest()
					,	params = methods._mix(opts)
					,	upload;
				if (params.progress && typeof params.progress === "function") {
					upload = client.upload;
					if (upload) {
						upload.callback = params.prgress;
						upload.addEventListener("progress", methods._progress, false);
					}
				}
				client.open(params.type, url);
				methods._addHeaders(client, params.dType);
				client.callback = cb;
				client.addEventListener(
						"readystatechange"
					,	methods._stateChange
					,	false
				);
				client.send(data);
			}

		,	_mix: function () {
				var ret = {}
					,	i = 0
					, key;
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

		,	_stateChange: function (ev) {
				if (this.readyState === 4) {
					if (this.status === 200) {
						this.callback.call(undefined, this.responseText);
					}
				}
			}

		,	_progress: function (ev) {
				console.log(ev);
			}

		,	_addHeaders: function (client, requestType) {
				var mime = "*/*, text/html"
					,	requestType = requestType.toLowerCase();
				client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				client.setRequestHeader("Cache-Control", "No-Cache");
				if (requestType === "json") {
					mime += ", application/json";
				} else if (requestType === "xml") {
					mime += ", text/xml";
				}
				client.setRequestHeader("Accept", mime);
			}

	};

})();
