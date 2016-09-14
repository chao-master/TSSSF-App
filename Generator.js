/**
* Renders HTML DOM elements onto a canvas
*/
var Generator = (function(){
  function Generator(canvas){
    this.canvas = canvas === undefined? document.createElement("canvas"): canvas;
    this.context = this.canvas.getContext("2d");
  }

  Generator.prototype.renderAll = function(elements,renderFunction){
    return Promise.all(
      Array.from(elements)
      .map(renderFunction)
      .map(function(p){return p.catch(function(e){console.error(e.trace || e);});})
    );
  };

  Generator.prototype.splitText = function(text,width){
    var words = text.match(/\S*\s|\S*$/g),
        lines = [],
        line = "",
        generator = this;
    words.forEach(function(word){
      var match = word.match(/(\S*)(\s|$)/),
          test = line + match[1];
          join = match[2];
      if (generator.context.measureText(test).width > width){
        lines.push(line);
        line = word;
      } else {
        line = test + join;
      }
      if (join == "\n"){
        lines.push(line);
        line = "";
      }
    });
    lines.push(line);
    return lines;
  };

  Generator.prototype.drawTextElement = function(element){
    var generator = this,
        text = element.value || element.textContent,
        style = window.getComputedStyle(element),
        lineHeight = style.lineHeight.slice(0,-2)*1,
        line = "",
        width = element.offsetWidth,
        y = element.offsetTop,
        x = element.offsetLeft;

      if(isNaN(lineHeight)){
        lineHeight = 0;
      }

      this.context.textAlign = style.textAlign;
      this.context.font = style.fontSize + " " + style.fontFamily;
      this.context.fillStyle = style.color;
      this.context.textBaseline = "top";

      if (this.context.textAlign == "center") {
          x += width/2;
      } else if (this.context.textAlign == "right") {
          x += width;
      }

      this.splitText(text,width).forEach(function(line,n){
        generator.context.fillText(line,x,y+lineHeight*n);
      });

      return Promise.resolve();
  };


  Generator.prototype.drawImage = function(img,x,y,width,height){
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
    this.context.drawImage(img,
      sX,sY,sWidth,sHeight,
      x,y,width,height);
  };

  Generator.prototype.fetchImage = function(src){
    if(src.substr(0,1) == '"' || src.substr(0,1) == "'"){
      src = src.slice(1,-1);
    }

    if (!src){
      return Promise.reject("No image source");
    }

    var img = new Image();
    img.setAttribute("crossorigin","anonymous");

    return new Promise(function(good,bad){
      img.onload = function(){good(img);};
      img.onerror = bad;
      img.src = src;
    });
  };

  Generator.prototype.drawImageElement = function(element,ignoreBlank){
    var style = window.getComputedStyle(element);
    var src = element.toDataURL ? element.toDataURL() :
          style.backgroundImage.slice(4,-1);

    var width, height,
        y = element.offsetTop,
        x = element.offsetLeft,
        bgSize = style.backgroundSize.match(/([0-9]+)px(?: ([0-9]+)px)?/);

      if (bgSize){
        width = bgSize[1]*1;
        height = (bgSize[2] || bgSize[1])*1;
      } else {
        width = element.offsetWidth;
        height = element.offsetHeight;
      }

      var generator = this;
      return this.fetchImage(src).then(function(img){
        generator.drawImage(img,x,y,width,height);
      }).catch(function(e){
        if (e == "No image source"){
          return Promise.reject(e+" defined for ["+element.getAttribute("class")+"]");
        }
      });
  };
  return Generator;
})();
