var CardGenerator = (function(){
  function CardGenerator(card){
    Generator.call(this,undefined,card);
    this.card = card;

    this.canvas.width = card.offsetWidth;
    this.canvas.height = card.offsetHeight;

    var generateCard = this.generateCard.bind(this);
    Array.prototype.forEach.call(card.querySelectorAll("button"),function(c){
      c.addEventListener("click",generateCard,true);
    });
  }

  CardGenerator.prototype = Object.create(Generator.prototype);
  CardGenerator.prototype.constructor = CardGenerator;

  CardGenerator.prototype.drawBack = function(){
    console.log("drawing cardback");
    return this.drawImageElement(this.card);
  };

  CardGenerator.prototype.drawTexts = function(){
    console.log("drawing text");
    return this.renderAll(this.card.querySelectorAll(
      ".name, .attrs, .effect, .flavour, .copyright"
    ),this.drawTextElement.bind(this));
  };

  CardGenerator.prototype.drawIcons = function(){
    console.log("drawing icons");
    return this.renderAll(this.card.querySelectorAll(
      ".iconHolder .icon, .iconGoal, .iconTime"
    ),this.drawImageElement.bind(this));
  };

  CardGenerator.prototype.drawCardImage = function(){
    console.log("drawing image");
    return this.drawImageElement(this.card.querySelector(".image"));
  };

  CardGenerator.prototype.generateCard = function(){
    console.log("generating card");
    return this.drawBack()
      .then(this.drawTexts.bind(this))
      .then(this.drawCardImage.bind(this))
      .then(this.drawIcons.bind(this))
      .catch(function(e){console.error("Error making card:",e,e.stack);});
  };

  return CardGenerator;
})();
