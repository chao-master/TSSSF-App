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
			console.log(reader);
            $(".card .image").css("background-image","url("+reader.result+")")
            redraw();
        }
        reader.readAsDataURL(file);
    })

    //Get image from website
    $("#submit-webimage").click(function(e){
        var img = $("#webimage").val()
        $(".card .image").css("background-image","url("+img+")");
        redraw();
    })
})
