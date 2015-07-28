//Handels generating the card image

function Generator(card,exportLink,canvas,scale,bleed){
    this.card = card;
    this.exportLink = exportLink;
    this.canvas = canvas || $("<canvas>");
    this.scale = scale!==undefined ? scale:1;
    this.bleed = bleed!==undefined ? bleed:false;
}

Generator.prototype.BLEED_AMOUNTS = {
    y:63,
    x:50
}

Generator.prototype.drawTextElement = function(element){
    var words = (element.val() || element.text()).match(/\S*\s|\S*$/g),
        lineHeight = element.css("line-height").slice(0,-2)*1,
        line = ""
        width = element.width(),
        y = element.position().top / this.scale,
        x = element.position().left / this.scale,
        context = this.canvas[0].getContext("2d")
    
    if (BLEED){
        y += this.BLEED_AMOUNTS.x;
        x += this.BLEED_AMOUNTS.y;
    }
    
    context.textAlign = element.css("text-align");
    context.font = element.css("font-size") + " " + element.css("font-family");
    context.fillStyle = element.css("color");
    context.textBaseline = "top";

    if (context.textAlign == "center") {
        x += width/2;
    } else if (context.textAlign == "right") {
        x += width;
    }
    
    for(var i=0;i<words.length;i++){
        var match = words[i].match(/(\S*)(\s|$)/)
        var test = line + match[1]
        var join = match[2]
        if (context.measureText(test).width > width){
            context.fillText(line,x,y);
            line = words[i];
            y += lineHeight;
        } else {
            line = test+join;
        }
        if (join == "\n"){
            context.fillText(line,x,y);
            line = "";
            y += lineHeight;
        }
    }
    context.fillText(line,x,y);
}

Generator.prototype.drawImageElement = function (element,after,src){
    var src = src || element.css("background-image").slice(4,-1),
        position = element.position(),
        img = new Image(),
        bgSize = element.css("background-size").match(/([0-9]+)px(?: ([0-9]+)px)?/),
        context = this.canvas[0].getContext("2d");
    
    $(img).attr("crossorigin","anonymous");
    if(bgSize){
        var width = bgSize[1]*1,
            height = (bgSize[2] || bgSize[1])*1;
    } else {
        var width = element.innerWidth(),
            height = element.innerHeight();
    }
    position.top /= this.scale
    position.left /= this.scale
    if (src.substr(0,1) == '"' || src.substr(0,1) == "'"){
        src = src.slice(1,-1)
    }
    if (element.hasClass("card")){
        position = {top:0,left:0}
        width = CANVAS[0].width;
        height = CANVAS[0].height;
    } else if (BLEED){
        y += this.BLEED_AMOUNTS.x;
        x += this.BLEED_AMOUNTS.y;
    }
    if (!src){
        if(after){after()}
        return;
    }
    $(img).load(function() {
        var sWidth = img.width,
            sHeight = img.height,
            sX = 0, sY = 0,
            dRatio = width/height,
            sRatio = sWidth/sHeight
        if (sRatio > dRatio){ //Image is wider
            sWidth = sHeight*dRatio;
            sX = (img.width-sWidth)/2
        } else { //Image is taller
            sHeight = sWidth/dRatio;
            sY = (img.height-sHeight)/2
        }
        context.drawImage(img,sX,sY,sWidth,sHeight,position.left,position.top,width,height);
        if(after){after()}
    }).error(function(e){
        if (element.hasClass("image")){
            if (src.substr(0,4) == "http"){
                mayError({
                    error:"Failed to load card art",
                    details:"Check connection and image link, if image otherwise loads normally the website may have CROS disabled."+
                        "Try imgur.com, or the upload option"
                })
            } else {
                mayError({
                    error:"Failed to load card art",
                    details:"Try reselecting the image"
                })
            }
        } else {
            mayError({
                error:"Failed to load resource",
                details:"Resource for "+element.attr("class").match(/[^ ]+/)+" not found. Check connection and try again."
            })
        }
        if(after){after()}
        return false;
    })
    img.src = src
}

Generator.prototype.drawCardElement = function(after){
    var back;

    if (BLEED){
        back = "resources/bleed%20templates/BLEED-Blank-$1-bleed.png"
    } else {
        back = "resources/templates/BLEED-Blank-$1-cropped.png"
    }

    if (this.card.hasClass("goal")) {
        back = back.replace("$1","Goal");
    } else if (this.card.hasClass("pony")) {
        back = back.replace("$1","Pony");
    } else if (this.card.hasClass("ship")) {
        back = back.replace("$1","Ship");
    } else if (this.card.hasClass("start")) {
        back = back.replace("$1","Start");
    } else {
        mayError({
            error:"Bad card type",
            details:"Try toggling the card type and trying again"
        })
    }
    drawImageElement(element,after,back);
}

Generator.prototype.redraw = function(){
    clearErrors();
    $("#working").show()

    var context = canvas[0].getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0,0,canvas.width(),canvas.height())

    drawCardElement(function(){
        this.card.find(".name, .attrs, .effect, .flavour, .copyright").each(function(){
            drawTextElement($(this));
        })
        drawImageElement(this.card.find(".image"),function(){
            var toDo = 5;
            this.card.find(".iconCard,.iconGender,.iconRace,.iconGoal,.iconTime").each(function(){
                drawImageElement($(this),function(){
                    toDo--;
                    if(!toDo){
                        $("#working").hide()
                    }
                });
            })
        })
    });
    if (this.exportLink){
        this.exportLink.attr("download",this.card.find(".name").text()+".png")
            .attr("href",MetaData.add(
                this.canvas[0].toDataURL("image/png"),
                this.getSaveInfo()
            ))
    }
}

this.Generator.getSaveInfo = function(){
    return {
        cgv:        "0.1",
        name:       this.card.find(".name").text(),
        attrs:      this.card.find(".attrs").val(),
        effect:     this.card.find(".effect").text(),
        flavour:    this.card.find(".flavour").text(),
        copyright:  this.card.find(".copyright").val(),
        classes:    this.card.attr("class")
    }
}

//TODO object this stuff:
$(document).ready(function(){
    $("#canvasExport").mousedown(redraw);

    $("#bleedCard").change(function(){
        BLEED = $("#bleedCard").prop('checked');
        if (BLEED) {
            CANVAS[0].width = 889;
            CANVAS[0].height= 1214;
        } else {
            CANVAS[0].width = 788;
            CANVAS[0].height= 1088;
        }
    }).change();

    $("#bleedCard, .card textarea, .card input").change(redraw)
    $(".card .symbolSelect button").click(redraw)
    redraw();
})



/*
var CANVAS = $("#exportImg"),
    CONTEXT = CANVAS[0].getContext("2d"),
    SCALE = 1,
    BLEED;

function drawTextElement(element){
    var words = (element.val() || element.text()).match(/\S*\s|\S*$/g),
        lineHeight = element.css("line-height").slice(0,-2)*1,
        line = "",
        width = element.width(),
        y = element.position().top / SCALE,
        x = element.position().left / SCALE;

    if (BLEED){
        y += 63;
        x += 50;
    }

    CONTEXT.textAlign = element.css("text-align");
    CONTEXT.font = element.css("font-size") + " " + element.css("font-family");
    CONTEXT.fillStyle = element.css("color");
    CONTEXT.textBaseline = "top";

    if (CONTEXT.textAlign == "center") {
        x += width/2;
    } else if (CONTEXT.textAlign == "right") {
        x += width;
    }

    for(var i=0;i<words.length;i++){
        var match = words[i].match(/(\S*)(\s|$)/)
        var test = line + match[1]
        var join = match[2]
        if (CONTEXT.measureText(test).width > width){
            CONTEXT.fillText(line,x,y);
            line = words[i];
            y += lineHeight;
        } else {
            line = test+join;
        }
        if (join == "\n"){
            CONTEXT.fillText(line,x,y);
            line = "";
            y += lineHeight;
        }
    }
    CONTEXT.fillText(line,x,y);
}

function drawImageElement(element,after,src){
    var src = src || element.css("background-image").slice(4,-1),
        width = element.innerWidth(),
        height = element.innerHeight(),
        position = element.position(),
        img = new Image(),
        bgSize = element.css("background-size").match(/([0-9]+)px(?: ([0-9]+)px)?/)
        $(img).attr("crossorigin","anonymous");
    if(bgSize){
        width = bgSize[1]*1
        height = (bgSize[2] || bgSize[1])*1
    }
    position.top /= SCALE
    position.left /= SCALE
    if (src.substr(0,1) == '"' || src.substr(0,1) == "'"){
        src = src.slice(1,-1)
    }
    if (element.hasClass("card")){
        position = {top:0,left:0}
        width = CANVAS[0].width;
        height = CANVAS[0].height;
    } else if (BLEED){
        position.top += 63;
        position.left += 50;
    }
    if (!src){
        if(after){after()}
        return;
    }
    $(img).load(function() {
        var sWidth = img.width,
            sHeight = img.height,
            sX = 0, sY = 0,
            dRatio = width/height,
            sRatio = sWidth/sHeight
        if (sRatio > dRatio){ //Image is wider
            sWidth = sHeight*dRatio;
            sX = (img.width-sWidth)/2
        } else { //Image is taller
            sHeight = sWidth/dRatio;
            sY = (img.height-sHeight)/2
        }
        CONTEXT.drawImage(img,sX,sY,sWidth,sHeight,position.left,position.top,width,height);
        if(after){after()}
    }).error(function(e){
        if (element.hasClass("image")){
            if (src.substr(0,4) == "http"){
                mayError({
                    error:"Failed to load card art",
                    details:"Check connection and image link, if image otherwise loads normally the website may have CROS disabled."+
                        "Try imgur.com, or the upload option"
                })
            } else {
                mayError({
                    error:"Failed to load card art",
                    details:"Try reselecting the image"
                })
            }
        } else {
            mayError({
                error:"Failed to load resource",
                details:"Resource for "+element.attr("class").match(/[^ ]+/)+" not found. Check connection and try again."
            })
        }
        if(after){after()}
        return false;
    })
    img.src = src
}

function drawCardElement(after){
    var element = $(".card"),
        back;

    if (BLEED){
        back = "resources/bleed%20templates/BLEED-Blank-$1-bleed.png"
    } else {
        back = "resources/templates/BLEED-Blank-$1-cropped.png"
    }

    if (element.hasClass("goal")) {
        back = back.replace("$1","Goal");
    } else if (element.hasClass("pony")) {
        back = back.replace("$1","Pony");
    } else if (element.hasClass("ship")) {
        back = back.replace("$1","Ship");
    } else if (element.hasClass("start")) {
        back = back.replace("$1","Start");
    } else {
        mayError({
            error:"Bad card type",
            details:"Try toggling the card type and trying again"
        })
    }
    drawImageElement(element,after,back);
}

function redraw(){
    clearErrors();
    $("#working").show()

    drawCardElement(function(){
        $(".name, .image, .attrs,.card .effect,.card .flavour, .copyright").each(function(){
            drawTextElement($(this));
        })
        drawImageElement($(".image"),function(){
            var toDo = 5;
            $(".iconCard,.iconGender,.iconRace,.iconGoal,.iconTime").each(function(){
                drawImageElement($(this),function(){
                    toDo--;
                    if(!toDo){
                        $("#working").hide()
                    }
                });
            })
        })
    });
    $("#canvasExport")
        .attr("download",$(".name").text()+".png")
        .attr("href",MetaData.add(
            CANVAS[0].toDataURL("image/png"),
            getSaveInfo()
        ))
}

function getSaveInfo(){
    return {
        cgv:        "0.1",
        name:       $(".card .name").text(),
        attrs:      $(".attrs").val(),
        effect:     $(".effect").text(),
        flavour:    $(".flavour").text(),
        copyright:  $(".copyright").val(),
        classes:    $(".card").attr("class")
    }
}

$(document).ready(function(){
    $("#canvasExport").mousedown(redraw);

    $("#bleedCard").change(function(){
        BLEED = $("#bleedCard").prop('checked');
        if (BLEED) {
            CANVAS[0].width = 889;
            CANVAS[0].height= 1214;
        } else {
            CANVAS[0].width = 788;
            CANVAS[0].height= 1088;
        }
    }).change();

    $("#bleedCard, .card textarea, .card input").change(redraw)
    $(".card .symbolSelect button").click(redraw)
    redraw();
})
*/
