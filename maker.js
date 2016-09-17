function cardChange(e){
  var form = e.currentTarget,
      inputs = form.elements;

  form.className = "card";
  ["gender","race","type"].forEach(function(n){
    form.classList.add(inputs[n].value);
  });
}

function resizeCard(e){
  var cardWrapper = document.querySelector(".cardwrapper"),
      card = document.querySelector(".card"),
      scale = cardWrapper.offsetWidth/788;
  card.style.transform = "scale("+scale+")";
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

function replaceSpecials(e){
  e.target.value = e.target.value.replace(SPECIAL_REGEX,function(t){
    return SPECIAL_REPLACE[t];
  });
}

//TODO: fix the text box not resizing correctlly with a trailing enter
function resizeHelpedBox(e){
  var helper = document.querySelector(".cardHelper ."+e.target.className);
  helper.textContent = e.target.value;
  e.target.style.height = helper.offsetHeight+"px";
}

function cardSetup(){
    //Bind the card to update on changes
    $.bind(".card","change",cardChange);

    //XXX Hack to make the card scale to fill the window
    window.addEventListener("resize",resizeCard);

    //Replace special escape codes when an input is updated
    $.bind(".card input[type=text], .card textarea","change",replaceSpecials);

    //TODO: Fix tooltips

    //XXX Hack to make textareas resize vertically
    $.bind(".card textarea","change keyup paste",resizeHelpedBox);

    //Resize name to be small when there is a lot of text
    $.bind(".card .nameInput","change",function(e){
      var target = e.currentTarget,
          partner = document.querySelector(".card div.name");
      partner.classList.toggle("small",target.scrollWidth > target.offsetWidth+1);
      partner.textContent = target.value;
    });


    //Inital call setup functions
    document.addEventListener("ready",function(){
      window.dispatchEvent(new Event("resize"));
    });
}
