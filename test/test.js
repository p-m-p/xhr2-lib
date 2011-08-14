test("serializeQS()", function () {
	var url1 = "http://www.example.com";
	var url2 = "http://www.example.com?withqs=true";
	equal(
			xhr2.serializeQS(url1, {paramOne: "test",	paramTwo: "test"})
		,	"?paramOne=test&paramTwo=test"
		,	"Url without query string"
	);
	equal(
			xhr2.serializeQS(url2, {paramOne: "test",	paramTwo: "test"})
		,	"&paramOne=test&paramTwo=test"
		,	"Url with query string"
	);
	equal(
			xhr2.serializeQS(url1, {})
		,	""
		,	"Empty data object"
	);
});

asyncTest("get()", function () {
	xhr2.get(
			"server.php?testget"
		,	{
					title: "Testing get()"
				,	msg: "The test has passed"
			}
		,	function (html) {
				equal(
						html.replace(/\s/g, "")
					,	"<header><h1>Testingget()</h1></header>" + 
						"<section><p>Thetesthaspassed</p></section>" + 
						"<footer><p>&copy;2011</p></footer>"	
					,	"needs a compare test here"
				);
				start();
			}
	);
});

asyncTest("getJSON", function () {
	xhr2.getJSON(
			"server.php?testgetjson"
		,	function (data) {
				deepEqual(
						data
					,	[
								{
										firstname: "John"
									,	lastname: "Smith"
									,	occupation: "Plumber"
								}
							,	{
										firstname: "Jane"
									,	lastname: "Smith"
									,	occupation: "Accountant"
								}
							,	{
										firstname: "David"
									,	lastname: "Bowe"
									,	occupation: "Singer"
								}
						]
					,	"No data object passed just callback function"
				);
				start();
		});
});
