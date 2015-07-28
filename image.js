function extractImage(src,after){
    var img = new Image(),
        canvas = $(".card .image")[0];
        context = canvas.getContext("2d");
    img.onload = function(){
        if (img.width == 788){ //nobleed (we hope)
            context.drawImage(img,-122,-161);
        } else {
            context.drawImage(img,-122-50,-161-63);
        }
        after();
    }
    img.src = src
}

function makeImage(src){
    var img = new Image(),
        canvas = $(".card .image")[0],
        context = canvas.getContext("2d"),
        cWidth = canvas.width,
        cHeight = canvas.height,
        cRatio = cWidth/cHeight;
    img.crossOrigin = "Anonymous";
    img.onload = function(){
        context.clearRect(0,0,cWidth,cHeight);
        var sWidth = img.width,
            sHeight = img.height,
            sRatio = sWidth/sHeight,
            sX = 0, sY = 0;
        if(sRatio > cRatio){ //Image is wider
            sWidth = sHeight*cRatio;
            sX = (img.width-sWidth)/2;
        } else  { //Image is taller
            sHeight = sWidth/cRatio;
            sY = (img.height-sHeight)/2;
        }
        context.drawImage(img,sX,sY,sWidth,sHeight,0,0,cWidth,cHeight);
    }
    img.src = src
}

//Handles the loading & manipulation of the card art. 
$(document).ready(function(){
    //Add Hidden File Input click cascade
    $(".card .imageWrap .upload").click(function(e){
        if (event.which == 1){
            $("#uploadImage").click();
        }
    })
    $("#import").click(function(e){
        if (event.which == 1){
            $("#uploadImport").click();
        }
    })

    //Upload image
    $("#uploadImage").change(function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            makeImage(reader.result)
            cardGenerator.redraw();
        }
        reader.readAsDataURL(file);
    })

    //Import card
    $("#uploadImport").change(function(){
        var file = this.files[0];
        var metaReader = new FileReader();
        metaReader.onload = function() {
            var info = MetaData.get(metaReader.result)
            if (info){
                var reader = new FileReader();
                reader.onload = function(){
                    extractImage(reader.result,function(){
                        loadFromInfo(info)
                    })
                }
                reader.readAsDataURL(file);
            } else {
                mayError({
                    error:"Could not find export data in card image",
                    details:"Import only works for cards made with this tool, if you wish to import card art use the upload card art button (lower corner of card image)"
                })
            }
        }
        metaReader.readAsArrayBuffer(file);
    })

    //Autofocus URL field on popup
    $("#webimage-dialog").on("shown.bs.modal",function(e){
        $("#webimage").focus()
    })

    //Get image from website
    $("#submit-webimage").click(function(e){
        var img = $("#webimage").val();
        makeImage(img);
        cardGenerator.redraw();
    })
})
