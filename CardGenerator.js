var CardGenerator = (function(){
  function CardGenerator(card){
    Generator.call(this);
    this.card = card;

    this.canvas.width = card.offsetWidth;
    this.canvas.height = card.offsetHeight;

    card.addEventListener("change",this.generateCard.bind(this),true);

    var generateCard = this.generateCard.bind(this);
    Array.from(card.querySelectorAll("button")).forEach(function(c){
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
      ".iconCard,.iconGender,.iconRace,.iconGoal,.iconTime"
    ),this.drawImageElement.bind(this));
  };

  CardGenerator.prototype.drawCardImage = function(){
    console.log("drawing image");
    return this.drawImageElement(this.card.querySelector(".image"))
      .catch(function(e){
        if (e instanceof Error){
          throw e;
        }
        console.warn(e);
      });
  };

  CardGenerator.prototype.generateCard = function(){
    console.log("generating card");
    return this.drawBack()
      .then(this.drawTexts.bind(this))
      .then(this.drawCardImage.bind(this))
      .then(this.drawIcons.bind(this))
      .catch(function(e){console.error(e,e.stack);});
  };

  return CardGenerator;
})();
