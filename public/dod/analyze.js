var start = false;
var lastTime = new Date().getTime();
var firstX = -9999;
var firstY = -9999;
var lastX = -9999;
var lastY = -9999;
var distance = 0;

document.addEventListener('change', updateValue);
document.addEventListener('mousemove', updateMove);
document.addEventListener('mousedown', updateMove);

// when to start on first question
var el = document.getElementsByClassName("firstQuestion");
if(el.length > 0){
    el[0].addEventListener("mouseover", function(){
        if(!start){
            lastTime = new Date().getTime();
            start = true;
        }
    });
}

function updateMove(e) {
  if(start){
      if(firstX === -9999){
        firstX = e.pageX;
        firstY = e.pageY;
      }else{
        var a = e.pageX - firstX;
        var b = e.pageY - firstY;
        distance += Math.sqrt( a*a + b*b );
        
      }
  
      lastX = e.pageX;
      lastY = e.pageY;
  }
  
}


function updateValue(e) {
    // when to start on first question
    if(!start){
        lastTime = new Date().getTime();
        start = true;
    }
  
  data = {}

  if(typeof sessionStorage["data"] !== 'undefined'){
     data = JSON.parse(sessionStorage["data"]);
  }	
  
  var newTime = new Date().getTime();
  var name = e.target.name;
  
  var diff = (newTime - lastTime);
  
           
  var a = lastX - firstX;
  var b = lastY - firstY;
  
  
  distanceDiff = distance / Math.sqrt( a*a + b*b );
  
  firstX = -9999;
  firstY = -9999;
  lastX = -9999;
  lastY = -9999;
  distance = 0;

  subData = {};
  if(typeof data[name] !== 'undefined'){
      subData = data[name]
  }

  subData["name"] = document.getElementById(name +'Text').innerHTML;
  subData["totalTime"] = (subData["totalTime"] || 0) + diff;
  subData["distance"] = (subData["distance"] || 0) + distanceDiff;
  subData["admit"] = e.target.dataset.admit;
  
  // when to submit an answer trail
  if(
      e.srcElement.type === "radio" || 
      (e.srcElement.type === "checkbox" && !e.srcElement.checked) || 
      (e.srcElement.type === "checkbox" && typeof subData["answerChanges"] === 'undefined')){
      
      subData["answerChanges"] = (subData["answerChanges"]|| 0) + 1;
    subData["focusIn"] = (subData["focusIn"] || 0) + 1;
      
  }

  

  // answer trail
  if(typeof subData["answers"] !== "undefined"){
          subData["answers"] += ", "
  }else{
      subData["answers"] = ""
  }

  if(typeof subData["checkboxTrail"] === "undefined"){
      subData["checkboxTrail"] = {}
  }

  if(e.srcElement.type === "checkbox"){

      if(e.srcElement.checked){
          subData["answers"] += "checked: " + e.target.dataset.value
          subData["checkboxTrail"][e.target.dataset.value] = true
      }else{
          subData["answers"] += "unchecked: " + e.target.dataset.value
          subData["checkboxTrail"][e.target.dataset.value] = false
      }

      let first = true
      subData["answer"] = '';
      for (const [key, value] of Object.entries(subData["checkboxTrail"])) {
          if(value){
              if(first){
                  first = false;
                  subData["answer"] = key
              }else{
                  subData["answer"] += ", "
                  subData["answer"] += key
              }
          }
          
      }
      
  }else if (e.srcElement.type === "radio"){
      subData["answers"] += "clicked: " + e.target.dataset.value
      subData["answer"] = e.target.dataset.value
  }

  console.log(subData["answer"])
  
  lastTime = newTime;

  data[name] = subData;
  sessionStorage["data"] = JSON.stringify(data);

  
}

