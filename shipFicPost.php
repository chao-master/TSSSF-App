<?php


function taggify($attrs,$classes){
    $tags = [];
    if ($attrs){
        $tags = array_merge($tags,array_map(function($n){
            return preg_replace("~\s+~","_",trim($n));
        },explode(",",$_POST["attrs"])));
    }
    if ($classes){
        $classArray = explode(" ",$_POST["classes"]);
        foreach($classArray as $cls){
            $cls = substr($cls,1);
            switch ($cls) {
                case "pony":
                case "start":
                case "ship":
                case "goal":
                    array_push($tags,$cls);
                    break;
                case "female":
                case "male":
                case "maleFemale":
                case "unicorn":
                case "pegasus":
                case "earthPony":
                case "alicorn":
                case "changeling":
                case "time":
                    if(in_array(".pony",$classArray) || in_array(".start",$classArray)){
                        array_push($tags,$cls);
                    }
                    break;
                case "s0":
                case "s1":
                case "s2":
                case "s3":
                case "s4":
                    if(in_array(".goal",$classArray)){
                        array_push($tags,$cls);
                    }
                    break;
            }
        }
    }
    return implode(" ",$tags);
}

function imageify(){
    $b64 = $_POST["b64Img"];
    $tmpName = tempnam("","");
    $tmpFile = fopen($tmpName,"wb");
    $data = explode(",",$b64);
    fwrite($tmpFile,base64_decode($data[1]));
    fclose($tmpFile);
    chmod($tmpName,0744);
    echo $tmpName;
    return $tmpName;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $data = [
        "upload" => "@".imageify(),
        "source" => "",
        "title" => $_POST["name"],
        "tags" => taggify(true,true),
        "rating" => "q",
        "submit" => "Upload"
    ];
    $destinationUrl = "http://secretshipfic.booru.org/index.php?page=post&s=add";
    //$destinationUrl = "https://sucs.org/~ripp_/phpEcho.php";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$destinationUrl);
    curl_setopt($ch, CURLOPT_POST,1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    curl_setopt($ch, CURLOPT_VERBOSE, true);

    $result=curl_exec($ch);
    var_dump($data);
    var_dump($result);
} else {
    die(json_encode(Array(
        "error"=>"Not a valid method",
        "details"=>"Only POST is valid"
    )));
}


?>
