<?php
// Save form data to file

// Check if form is submitted
//if (isset($_GET['list-num'])) {


    $myfile = fopen("data/newfile.txt", "w") or die("Unable to open file!");
    // Write 1st Line
    $params = array();
    $txt = serialize($_POST);
    //var_dump(json_decode($_POST));
 
    fwrite($myfile, $txt);

    // Close up
    fclose($myfile);

    echo "File saved successfully!";
// } else {
//     echo "Error:  No post data submitted!";
// }
?> 