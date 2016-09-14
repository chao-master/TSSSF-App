//Handels generating the card image

function Generator(card,exportLink,canvas,scale,bleed){
    this.card = card;
    this.exportLink = exportLink;
    this.canvas = canvas || document.createElement("canvas");
    this.scale = scale!==undefined ? scale:1;
    this.bleed = bleed!==undefined ? bleed:false;
}

Generator.prototype.BLEED_AMOUNTS = {
    y:63,
    x:50
};

Generator.prototype.hasTaintedArtwork = function(){
    try {
        var p = this.card.find(".image")[0].getContext("2d").getImageData(0,0,1,1);
        return false;
    } catch(e) {
        return (e.code === 18);
    }
};

Generator.prototype.drawTextElement = function(element){
    var words = (element.value || element.textContent).match(/\S*\s|\S*$/g),
        lineHeight = element.css("line-height").slice(0,-2)*1,
        line = "";
        width = element.width(),
        y = element.position().top / this.scale,
        x = element.position().left / this.scale,
        context = this.canvas.getContext("2d");

    if (this.bleed){
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
        var match = words[i].match(/(\S*)(\s|$)/);
        var test = line + match[1];
        var join = match[2];
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
};

Generator.prototype.drawImageElement = function (element,after,src){
    try {
        src = src || (element[0].toDataURL? element[0].toDataURL() : element.css("background-image").slice(4,-1));
    } catch (e) {
        mayError({
            error:"Failed to load card art",
            details:"Check connection and image link, if image otherwise loads normally the website may have CROS disabled."+
                "Try imgur.com, or the upload option"
        });
        if(after){after();}
        return;
    }
    var position = element.position(),
        img = new Image(),
        bgSize = element.css("background-size").match(/([0-9]+)px(?: ([0-9]+)px)?/),
        context = this.canvas[0].getContext("2d"),
        width, height;

    $(img).attr("crossorigin","anonymous");
    if(bgSize){
        width = bgSize[1]*1;
        height = (bgSize[2] || bgSize[1])*1;
    } else {
        width = element.innerWidth();
        height = element.innerHeight();
    }
    position.top /= this.scale;
    position.left /= this.scale;
    if (src.substr(0,1) == '"' || src.substr(0,1) == "'"){
        src = src.slice(1,-1);
    }
    if (element.hasClass("card")){
        position = {top:0,left:0};
        width = this.canvas[0].width;
        height = this.canvas[0].height;
    } else if (this.bleed){
        y += this.BLEED_AMOUNTS.x;
        x += this.BLEED_AMOUNTS.y;
    }
    if (!src){
        if(after){after();}
        return;
    }
    $(img).load(function() {
        var sWidth = img.width,
            sHeight = img.height,
            sX = 0, sY = 0,
            dRatio = width/height,
            sRatio = sWidth/sHeight;
        if (sRatio > dRatio){ //Image is wider
            sWidth = sHeight*dRatio;
            sX = (img.width-sWidth)/2;
        } else { //Image is taller
            sHeight = sWidth/dRatio;
            sY = (img.height-sHeight)/2;
        }
        context.drawImage(img,sX,sY,sWidth,sHeight,position.left,position.top,width,height);
        if(after){after();}
    }).error(function(e){
        if (element.hasClass("image")){
            mayError({
                error:"Failed to load card art",
                details:"Try reselecting the image"
            });
        } else {
            mayError({
                error:"Failed to load resource",
                details:"Resource for "+element.attr("class").match(/[^ ]+/)+" not found. Check connection and try again."
            });
        }
        if(after){after();}
        return false;
    });
    img.src = src;
};

Generator.prototype.drawCardElement = function(after){
    var back;

    //TODO move resizing canvas here
    if (this.bleed){
        back = "resources/bleed%20templates/BLEED-Blank-$1-bleed.png";
    } else {
        back = "resources/templates/BLEED-Blank-$1-cropped.png";
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
        });
    }
    this.drawImageElement(this.card,after,back);
};

Generator.prototype.redraw = function(){
    clearErrors();
    $("#working").show();

    var context = this.canvas[0].getContext("2d"),
        that = this;
    context.fillStyle = "white";
    context.fillRect(0,0,this.canvas.width(),this.canvas.height());

    function afterAll(){
        if (that.exportLink){
            that.exportLink.attr("download",that.card.find(".name").text()+".png")
                .attr("href",MetaData.add(
                    that.canvas[0].toDataURL("image/png"),
                    that.getSaveInfo()
                ));
        }
    }


    this.drawCardElement(function(){
        that.card.find(".name, .attrs, .effect, .flavour, .copyright").each(function(){
            that.drawTextElement($(this));
        });
        that.drawImageElement(that.card.find(".image"),function(){
            var toDo = 5;
            that.card.find(".iconCard,.iconGender,.iconRace,.iconGoal,.iconTime").each(function(){
                that.drawImageElement($(this),function(){
                    toDo--;
                    if(!toDo){
                        $("#working").hide();
                        afterAll();
                    }
                });
            });
        });
    });
};

Generator.prototype.getSaveInfo = function(){
    var cvs = $("<canvas>")[0],
        ctx = cvs.getContext("2d"),
        img = this.card.find(".image")[0];
    cvs.height = img.height;
    cvs.width = 60;
    ctx.drawImage(img,0,0);

    return {
        cgv:        "0.1",
        name:       this.card.find(".name").text(),
        attrs:      this.card.find(".attrs").val(),
        effect:     this.card.find(".effect").val(),
        flavour:    this.card.find(".flavour").val(),
        copyright:  this.card.find(".copyright").val(),
        classes:    this.card.attr("class"),
        imgstrip:   cvs.toDataURL()
    };
};

//TODO object this stuff:

var cardGenerator = new Generator($(".card"),$("#canvasExport"),$("#exportImg"));

$(document).ready(function(){

    cgRedraw = function(){cardGenerator.redraw();};

    $("#canvasExport").mousedown(cgRedraw);

    $("#bleedCard").change(function(){
        cardGenerator.bleed = $("#bleedCard").prop('checked');
        if (cardGenerator.bleed) {
            cardGenerator.canvas[0].width = 889;
            cardGenerator.canvas[0].height = 1214;
        } else {
            cardGenerator.canvas[0].width = 788;
            cardGenerator.canvas[0].height = 1088;
        }
    }).change();

    $("#bleedCard, .card textarea, .card input").change(cgRedraw);
    $(".card .symbolSelect button").click(cgRedraw);
    cardGenerator.redraw();
});
