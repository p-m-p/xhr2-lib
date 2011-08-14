<?php if (array_key_exists('testget', $_GET)) { ?>

	<header>
		<h1><?php echo $_GET['title']; ?></h1>
	</header>
	<section>
		<p><?php echo $_GET['msg']; ?></p>
	</section>
	<footer>
		<p>&copy; 2011</p>
	</footer>

<?php } elseif (array_key_exists('testgetjson', $_GET)) {

	$ret = array(
			array(
					'firstname' => 'John'
				,	'lastname' => 'Smith'
				,	'occupation' => 'Plumber'
			)
		,	array(
					'firstname' => 'Jane'
				,	'lastname' => 'Smith'
				,	'occupation' => 'Accountant'
			)
		, array(
					'firstname' => 'David'
				,	'lastname' => 'Bowe'
				,	'occupation' => 'Singer'
			)
	);
	header('Content-Type: application/json');
	echo json_encode($ret);

}
