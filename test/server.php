<?php if (array_key_exists('testget', $_GET)) { ?>
  <?php

    $title = "no title";
    $msg = "no message";

    if (array_key_exists('title', $_GET)) {
      $title = $_GET['title'];
    }

    if (array_key_exists('msg', $_GET)) {
      $msg = $_GET['msg'];
    }

  ?>

  <header>
    <h1><?php echo $title; ?></h1>
  </header>
  <section>
    <p><?php echo $msg; ?></p>
  </section>
  <footer>
    <p>&copy; 2011</p>
  </footer>


<?php }

  elseif (array_key_exists('testgetjson', $_REQUEST)) {

    $checkNames = array_key_exists('users', $_REQUEST);

    $ret = array();

    if (!$checkNames || strpos($_REQUEST['users'], 'john') !== FALSE) {
        array_push($ret, array(
          'firstname' => 'John'
        , 'lastname' => 'Smith'
        , 'occupation' => 'Plumber'
      ));
    }

    if (!$checkNames || strpos($_REQUEST['users'], 'jane') !== FALSE) {
      array_push($ret, array(
          'firstname' => 'Jane'
        , 'lastname' => 'Smith'
        , 'occupation' => 'Accountant'
      ));
    }

    if (!$checkNames || strpos($_REQUEST['users'], 'david') !== FALSE) {
      array_push($ret, array(
          'firstname' => 'David'
        , 'lastname' => 'Bowe'
        , 'occupation' => 'Singer'
      ));
    }

    header('Content-Type: application/json');
    echo json_encode($ret);

  }

  elseif (array_key_exists('email', $_POST)) {

    echo 'Name: ' .  $_POST['name'] .
         ' Email: ' . $_POST['email'];

  }

  elseif (array_key_exists('isFile', $_GET)) {

    file_put_contents(
        $_SERVER['HTTP_X_FILE_NAME']
      , file_get_contents("php://input")
    );

}

elseif (array_key_exists('test500', $_GET)) {

  header('HTTP/1.1 500 Internal Server Error');

}

elseif (array_key_exists('notmodified', $_GET)) {

  header('HTTP/1.1 304 Not Modified');

}
