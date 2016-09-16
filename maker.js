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

function symbolButtonClick(e){
  var target = e.currentTarget,
      card = document.querySelector(".card");

  Array.from(target.parentNode.children).forEach(function(child){
    if(child.getAttribute("data-button-action") != "toggle"){
      card.classList.remove(child.value);
    }
  });

  card.classList.add(target.value);
}

function symbolButtonToggleClick(e){
  var target = e.currentTarget;
  document.querySelector(".card").classList.toggle(target.value);
}

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

function replaceSpecials(text){
  return text.replace(SPECIAL_REGEX,function(t){
    return SPECIAL_REPLACE[t];
  });
}

function resizeHelpedBox(box){
  var helper = document.querySelector(".cardHelper ."+box.className);
  helper.textContent = helper.value;
  box.style.height = helper.offsetHeight+"px";
}

function cardSetup(){
    //On card button clicks, remove other classes and add new ones.
    //Unless it is changeling, special case, just toggle.
    Array.from(document.querySelectorAll(".card button")).forEach(function(c){
      if(c.getAttribute("data-button-action") == "toggle"){
        c.addEventListener("click",symbolButtonToggleClick);
      } else {
        c.addEventListener("click",symbolButtonClick);
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


    //Replace special escape codes when an input is updated
    Array.from(document.querySelectorAll(".card input[type=text], .card textarea")).forEach(function(c){
      c.addEventListener("change",function(){
        c.value = replaceSpecials(c.value);
      });
    });

    //Replace and create tooltip hints
    $.each(SPECIAL_REPLACE,function(key,replace){
        $("dt[data-original-title='"+key+"']").attr("data-original-title",replace).tooltip();
    });

    //When a text editor is updated resize it's helper to clone back the height.
    //This is because CSS Really hates working vertically
    Array.from(document.querySelectorAll(".card textarea")).forEach(function(c){
      c.addEventListenter("change",resizeHelpedBox.bind(null,c));
      c.addEventListenter("keyup",resizeHelpedBox.bind(null,c));
      c.addEventListenter("paste",resizeHelpedBox.bind(null,c));
    });

    //We also use a simular system for the name, but since we dont need manual
    //line breaks it gets easiers
    document.querySelector(".card .nameInput").addEventListenter("change",function(e){
      var target = e.currentTarget;
      target.classList.toggle("small",t[0].scrollWidth > t.width()+1);
    });


    //Inital call setup functions
    document.addEventListener("ready",function(){
      window.dispatchEvent(new Event("resize"));
    });
}
