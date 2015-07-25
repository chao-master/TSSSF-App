//Handles the loading & manipulation of the card art. 
$(document).ready(function(){
    //Add Hidden File Input click cascade
    $(".card .image .upload").click(function(e){
        if (event.which == 1){
            $("#uploadImage").click();
        }
    })

    //Upload image
    $("#uploadImage").change(function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            $(".card .image").css("background-image","url("+reader.result+")")
            redraw();
        }
        reader.readAsDataURL(file);
        var metaReader = new FileReader();
        metaReader.onload = function(e) {
            console.log(readMetaData(metaReader.result));
        }
        metaReader.readAsArrayBuffer(file);
    })

    //Autofocus URL field on popup
    $("#webimage-dialog").on("shown.bs.modal",function(e){
        $("#webimage").focus()
    })

    //Get image from website
    $("#submit-webimage").click(function(e){
        var img = $("#webimage").val()
        $(".card .image").css("background-image","url("+img+")");
        redraw();
    })
})
