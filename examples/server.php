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

<?php } elseif (array_key_exists('testgetjson', $_REQUEST)) {

  $ret = array(
      array(
          'firstname' => 'John'
        , 'lastname' => 'Smith'
        , 'occupation' => 'Plumber'
      )
    ,  array(
          'firstname' => 'Jane'
        , 'lastname' => 'Smith'
        , 'occupation' => 'Accountant'
      )
    , array(
          'firstname' => 'David'
        , 'lastname' => 'Bowe'
        , 'occupation' => 'Singer'
      )
  );

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
