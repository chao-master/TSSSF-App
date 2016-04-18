//Display error
function mayError(errObj){
    if (errObj.error){
        console.log(errObj);
        $("<li>").append(
            $("<strong>").text(errObj.error+": ")
        ).append(
            $("<em>").text(errObj.details)
        ).addClass("alert alert-danger").appendTo("#error");
        $("#error").show();
        $("#errorClear").show();
        return 1;
    } else {
        return 0;
    }
}

//Clear Errors
function clearErrors(){
    $("#error").hide();
    $("#errorClear").hide();
}

$(document).ready(function(){
    $("#errorClear").click(clearErrors);
});

function loadFromInfo(info){
    switch(info.cgv){
        case "0.1":
            $(".attrs").val(info.attrs);
            $(".effect").val(info.effect).change();
            $(".flavour").val(info.flavour).change();
            $(".copyright").val(info.copyright);
            $(".card").attr("class",info.classes);
            $(".card .nameInput").val(info.name).change();
            var img = new Image();
            img.onload = function(){
                $(".card .image")[0].getContext("2d").drawImage(img,0,0);
            };
            img.src = info.imgstrip;
            break;
        case undefined:
            //Do nothing, the text data here praobly isn't a card data.
            break;
        default:
            mayError({
                error:"Bad card meta data version",
                details:"The card generator version ("+info.cgv+") is not recognised"
            });
            break;
    }
}

function cardSetup(){
    //On card button clicks, remove other classes and add new ones.
    //Unless it is changeling, special case, just toggle.
    $(".card button").click(function(){
        if ($(this).attr("value") == "changeling"){
            $(".card").toggleClass($(this).attr("value"));
        } else {
            $(this).parent().children("button").each(function(){
                if ($(this).attr("value") != "changeling"){
                    $(".card").removeClass($(this).attr("value"));
                }
            });
            $(".card").addClass($(this).attr("value"));
        }
    });

    //On Window resize we use css transformation to scale the card to fix
    //Yes it seems horrible but the alternative was somehting even more horrible!
    window.addEventListener("resize",function(){
      var cardWrapper = document.querySelector(".cardwrapper"),
          card = document.querySelector(".card"),
          scale = cardWrapper.offsetWidth/788;
      card.style.transform = "scale("+scale+")";
      //cardWrapper.style.height = 1088*scale+"px";
    });

    //Constant infomation for special escape code handling.
    var SPECIAL_REGEX = /\\(malefemale|unicorn|pegasus|earth|alicorn|goal|time|female|male|ship|replace|swap|draw|newgoal|search|copy|changeling)/g;
    var SPECIAL_REPLACE = {
        "\\male":"\u2642",
        "\\female":"\u2640",
        "\\malefemale":"\u26A4",
        "\\ship":"\u2764",
        "\\earth":"\uE000",
        "\\unicorn":"\uE001",
        "\\pegasus":"\uE002",
        "\\alicorn":"\uE003",
        "\\time":"\uE004",
        "\\replace":"(Replace): While in your hand, you may discard a Pony card from the grid and play this card in its place. This power cannot be copied.",
        "\\swap":"(Swap): You may swap 2 Pony cards on the shipping grid.",
        "\\draw":"(Draw): You may draw a card from the Ship or Pony deck.",
        "\\newgoal":"(New Goal): You may discard a Goal and draw a new one to replace it.",
        "\\search":"(Search): You may search the Ship or Pony discard pile for a card of your choice and play it.",
        "\\copy":"(Copy): You may copy the power of any Pony card currently on the shipping grid, except for Changelings.",
        "\\changeling":"Gains the name, keywords and symbols of any single [race] of your choice until the end of the turn. If this card is moved to a new place on the grid, the current player must select a new disguise that will last until the end of their turn, even if other cards say its power would not activate."
    };

    //Replace special escape codes when an input is updated
    $(".card input[type=text], .card textarea").on("change",function(){
        var txt = $(this).val();
        txt = txt.replace(SPECIAL_REGEX,function(t){
            return SPECIAL_REPLACE[t];
        });
        $(this).val(txt);
    });

    //Replace and create tooltip hints
    $.each(SPECIAL_REPLACE,function(key,replace){
        $("dt[data-original-title='"+key+"']").attr("data-original-title",replace).tooltip();
    });

    //When a text editor is updated resize it's helper to clone back the height.
    //This is because CSS Really hates working vertically
    $(".card textarea").on("change keyup paste",function(){
        var t = $(this),
            o = $(".cardHelper ." + t.attr("class"));
        o.text(t.val());
        t.height(o.height());
    });

    //We also use a simular system for the name, but since we dont need manual
    //line breaks it gets easiers
    $(".card .nameInput").on("change keyup paste",function(){
        var t = $(this),
            o = $(".card .name");
        o.toggleClass("small",t[0].scrollWidth > t.width()+1);
        o.text(t.val());
    });

    /*/Update image
    $("#image").change(function(){
        $(".card .image").css("background-image","url('"+$(this).val()+"')")
    })*/

    //Inital call setup functions
    document.addEventListener("ready",function(){
      window.dispatchEvent(new Event("resize"));
      $(".card textarea").change();
    });
}
