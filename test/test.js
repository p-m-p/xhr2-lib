test("serializeQS()", function () {
	var url1 = "http://www.example.com";
	var url2 = "http://www.example.com?withqs=true";
	equal(
			XHR2Ajax.serializeQS(url1, {paramOne: "test",	paramTwo: "test"})
		,	"?paramOne=test&paramTwo=test"
		,	"Url without query string"
	);
	equal(
			XHR2Ajax.serializeQS(url2, {paramOne: "test",	paramTwo: "test"})
		,	"&paramOne=test&paramTwo=test"
		,	"Url with query string"
	);
	equal(
			XHR2Ajax.serializeQS(url1, {})
		,	""
		,	"Empty data object"
	);
});
