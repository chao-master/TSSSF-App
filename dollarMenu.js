var $ = (function(){
  var $ = document.querySelectorAll.bind(document);
  ["forEach","map","reduce","filter","slice","every","some","reverse"].forEach(function(n){
    $[n] = function(s,f){return Array.prototype[n].call($(s),f);};
  });
  $.one = document.querySelector.bind(document);

  $.bind = function(sel,evt,han,execute){
    evt = evt.split(" ");
    $.forEach(sel,function(elm){
      evt.forEach(function(e){
        elm.addEventListener(e,han);
        if(execute) elm.dispatchEvent(new Event(e));
      });
    });
  };

  $.bindExecute = function(sel,evt,han){
    $.bind(sel,evt,han,true);
  };


  $.create = function(){
    var first, last;
    Array.prototype.reduce.call(arguments,function(child,cur){
      if(typeof cur === "string"){
        cur = cur.match(/[.#]?[^.#]+/g).reduce(function(cur,part){
          if (part[0] === "."){
            cur.classList.add(part.substr(1));
          } else if (part[0] === "#"){
            cur.id = part.substr(1);
          } else {
            cur = document.createElement(part);
          }
          return cur;
        },document.createElement("div"));
        if(child !== undefined) cur.appendChild(child);
      } else if (cur instanceof Element){
        if(child !== undefined) cur.appendChild(child);
      } else {
        Object.keys(cur).forEach(function(k){child[k] = cur[k];});
        cur = child;
      }
      if (first === undefined) first=cur;
      last = cur;
      return cur;
    },undefined);
    return first;
  };
  return $;
})();
