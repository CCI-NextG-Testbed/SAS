var myTime;
var nowLine;
var canvasWidth = 1200;
var canvasHeight = 700;
var myGrants = [];
var requestList = [];
var finalGrantList = [];
var approvedGrants = [];
var approvedRequests = [];

var approvedGrantCount = 0;
var deniedGrantCount = 0;
var cancelledGrantCount = 0;
var movedGrantCount = 0;
var grantSummaryText;
var summaryTextHeight = 100;
var bandwidthBox;
var frequencyRange =  1500;//35500-37000
var titleOffset = 50;
var baseFrequency = 35500;
var nowLinePosition = 200;
var movingTexts = [];
var frequencyTexts = [];
var stopTime = 5000;

var seedValue = 1;
var isPaused = false;

class Grant {
  constructor(startTime, length, frequency, bandwidth, frequencyb, showTime) {
    this.startTime = startTime;
    this.length = length;
    this.frequency = frequency;
    this.bandwidth = bandwidth;
    this.frequencyb = frequencyb;
    this.showTime = showTime;
  }

}

var tempGrantComponent = new component(0, 0, "green", 0, 0);

var grantsToShow = [];



function printToOutput(str) {
  var con = document.getElementById("consoleOutput");
  con.innerHTML = con.innerHTML + "\n" + str;
}

function clearConsole() {
  var con = document.getElementById("consoleOutput");
  con.innerHTML = ""
}



function startGame() {
    nowLine = new component(2, canvasHeight - summaryTextHeight - titleOffset, "red", nowLinePosition, 50);
    grantSummaryText = new component("20px", "Consolas", "black", 150, canvasHeight - 50, "text");
    grantSummaryBox = new component(canvasWidth, summaryTextHeight, "white", 0, canvasHeight - summaryTextHeight);
    bandwidthBox = new component(100, canvasHeight, "white", 0, 0);

    myGrants = [];
    approvedGrants = [];
    movingTexts = [];
    frequencyTexts = [];
    grantsToShow = [];
    isPaused = false;


    myTime = new component("30px", "Consolas", "black", nowLinePosition, 40, "text");


    

    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    speed : "1x",
    start : function() {
        if (this.interval){
          clearInterval(this.interval);
      }
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[5]);
        this.frameNo = 0;
        loadGrantsAndPUs();


        createFrequencyTexts();
        this.isPaused = false;
        this.interval = setInterval(updateGameArea, 20);

        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function seedChange(value){
  seedValue = value;
  startGame();

}

function loadGrantsAndPUs(){
        makePUGrant(new Grant(1000, 500, 1350, 100, 355, 0));
        makePUGrant(new Grant(200, 500, 1250, 200, 355, 0));
        makePUGrant(new Grant(1000, 500, 350, 200, 355, 0));
        makePUGrant(new Grant(2500, 500, 550, 100, 255, 0));
        makePUGrant(new Grant(3200, 1000, 600, 200, 355, 0));
        makePUGrant(new Grant(2300, 300, 1350, 150, 355, 0));
        makePUGrant(new Grant(2600, 1500, 1150, 400, 355, 0));
        makePUGrant(new Grant(1, 500, 530, 1000, 355, 0));
        makePUGrant(new Grant(3000, 500, 550, 200, 355, 0));
        makePUGrant(new Grant(600, 500, 1150, 300, 355, 0));
        makePUGrant(new Grant(1200, 1000, 950, 200, 355, 0));
        makePUGrant(new Grant(300, 1350, 1200, 150, 355, 0));
        makePUGrant(new Grant(1800, 1700, 1300, 400, 355, 0));

          //GRANTS
        requestList.push(new Grant(100, 200, 1350, 200, 355, 0));
        requestList.push(new Grant(200, 100, 250, 400, 355, 0));
        requestList.push(new Grant(3000, 100, 1250, 600, 355, 0));
        requestList.push(new Grant(4000, 200, 1450, 300, 355, 0));
        requestList.push(new Grant(2500, 1250, 150, 200, 355, 0));
        requestList.push(new Grant(1500, 1300, 1150, 300, 355, 0));
        requestList.push(new Grant(1000, 100, 1350, 200, 355, 0));
        requestList.push(new Grant(1650, 1400, 1550, 300, 355, 0));
        requestList.push(new Grant(2700, 1200, 250, 200, 355, 0));
        requestList.push(new Grant(1800, 100, 1150, 200, 355, 0));
        requestList.push(new Grant(2800, 300, 350, 200, 355, 0));
        requestList.push(new Grant(1900, 100, 1150, 300, 355, 0));
        requestList.push(new Grant(950, 500, 510, 200, 355, 0));
        requestList.push(new Grant(2200, 200, 150, 400, 355, 0));

}





function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function makeSUGrant(grant) {
  convertGrant(grant, false, "cyan", "SU Grant F: " + (baseFrequency + grant.frequency)/10000 + "GHz Bw: " + grant.bandwidth/10 + "MHz");
  approvedGrants.push(grant);
}

function makePUGrant(grant) {
  convertGrant(grant, false, "green", "PU Grant F: " + (baseFrequency + grant.frequency)/10000 + "GHz Bw: " + grant.bandwidth/10 + "MHz");
  approvedGrants.push(grant);
}

function createFrequencyTexts(){
  var numberOfTexts = 10;

  var frequencyDifference = frequencyRange/numberOfTexts;
  var startPlace = 0;
  for (i = 0; i <= numberOfTexts; i+=1){
      startPlace = frequencyToPixelConversion(i*frequencyDifference);
     var text = new component("15px", "Consolas", "black", 10, startPlace, "text");
     text.text = ((baseFrequency+(i*frequencyDifference))/10000).toPrecision(4) + "GHz-";
     frequencyTexts.push(text);
  }
}


function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < grantsToShow.length; i += 1) {
        if (grantsToShow[i].showTime == myGameArea.frameNo) {
            queueGrant(grantsToShow[i]);
        } 
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;

    for (i = 0; i < myGrants.length; i += 1) {
        myGrants[i].x += -1;
        myGrants[i].update();
    }

    tempGrantComponent.x += -1;

    myTime.text="Now Time: " + parseMillisecondsIntoReadableTime(myGameArea.frameNo);
    grantSummaryText.text = ""/*"Grants Approved: " + approvedGrantCount + " " +
    "Grants Denied: " + deniedGrantCount + " " +
    "Grants Moved: " + movedGrantCount + " " + 
    "Grants Missed: " + cancelledGrantCount;*/
    grantSummaryBox.update();
    grantSummaryText.update();
    myTime.update();
    nowLine.update();

    tempGrantComponent.update();
    for (i = 0; i < movingTexts.length; i += 1) {
        movingTexts[i].x += -1;
        movingTexts[i].update();
    }

    bandwidthBox.update();

    for (i = 0; i < frequencyTexts.length; i +=1) {
      frequencyTexts[i].update();
    }
    if (myGameArea.frameNo >= stopTime){
      clearInterval(myGameArea.interval);
    }

}


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}


function parseMillisecondsIntoReadableTime(minutes){

  var days = minutes/(60 * 24);
  var d = Math.floor(days);
  //Get hours from milliseconds
  var hours = (days - d) * 24;
  var absoluteHours = Math.floor(hours);
  var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

  //Get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60;
  var absoluteMinutes = Math.floor(minutes);
  var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

  //Get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteMinutes) * 60;
  var absoluteSeconds = Math.floor(seconds);
  var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


  return d + 'd:' + h + 'h:' + m + 'm ' + myGameArea.speed;
}

function checkOverlap(startTime, endTime, frequency, bandwidth){
    for (i = 0; i < approvedGrants.length; i += 1) {
        if (approvedGrants[i].startTime <= startTime && (approvedGrants[i].startTime + approvedGrants[i].length) >= startTime) {
          if (checkFrequency(approvedGrants[i].frequency, approvedGrants[i].bandwidth, frequency, bandwidth)){
            return true;
          }
        } else if ((startTime <= approvedGrants[i].startTime) && (endTime >= (approvedGrants[i].startTime + approvedGrants[i].length))){
          if (checkFrequency(approvedGrants[i].frequency, approvedGrants[i].bandwidth, frequency, bandwidth)){
            return true;
          }
        } else if ((approvedGrants[i].startTime >= startTime) && (approvedGrants[i].startTime <= endTime)) {
          if (checkFrequency(approvedGrants[i].frequency, approvedGrants[i].bandwidth, frequency, bandwidth)){
            return true;
          }
        } else if ((approvedGrants[i].startTime <= startTime) && ((approvedGrants[i].startTime + approvedGrants[i].length) >= endTime)){
          if (checkFrequency(approvedGrants[i].frequency, approvedGrants[i].bandwidth, frequency, bandwidth)){
            return true;
          }
        }
    }
    return false;
}

function checkFrequency(freqa, banda, freqb, bandb){
  var la = freqa - (banda/2);
  var ha = freqa + (banda/2);
  var lb = freqb - (bandb/2);
  var hb = freqb + (bandb/2);

  if ((lb <= la && hb >= la) || (la <= lb && ha >= hb) || (lb <= ha && hb >= ha) || (lb <= la && hb >= ha)) {
    return true;
  }
    else {
    return false;
    }
  }


function queueGrant(grant){
  var grantDiv = document.createElement("div");
  grantDiv.classList.add('grantDiv');
  var abutton = document.createElement ("button");
  grantDiv.id = grant.startTime;
  var text = document.createElement("p");
  text.innerHTML = "Grant Start Time: " + parseMillisecondsIntoReadableTime(grant.startTime-nowLinePosition) + " Length: " + parseMillisecondsIntoReadableTime(grant.length);
  grantDiv.appendChild(text);
    var textb = document.createElement("p");
  textb.innerHTML = "Bandwidth: " + grant.bandwidth/10 + "MHz";
  grantDiv.appendChild(textb);

  abutton.innerHTML = "Approve f<sub>c</sub> " + ((baseFrequency+grant.frequency)/10000).toPrecision(5) + "GHz";
  abutton.value = grant;
  abutton.classList.add('approveButton');

  abutton.addEventListener('click', function(e){
    if (!isPaused) {
  console.log("approve");
  convertGrant(grant, false, "cyan", "SU Grant F: " + (baseFrequency + grant.frequency)/10000 + "GHz Bandwidth: " + grant.bandwidth/10 + "MHz");

  approvedGrantCount++;
  approvedGrants.push(grant);
  tempGrantComponent = new component(0,0, "blue", 0,0);
  e.currentTarget.parentNode.remove();
  }
  }, false);

  abutton.addEventListener('mouseover', function(e) {
    var color = "blue";
    if (checkOverlap(grant.startTime, grant.startTime + grant.length, grant.frequency, grant.bandwidth)){
      color = "red";
    }
      var startPlace = grant.frequency - (grant.bandwidth/2);
  var heightOfBlock = grant.bandwidth;

  startPlace = frequencyToPixelConversion(startPlace);
  pixHeight = bandwidthToComponentHeight(grant.bandwidth);



  tempGrantComponent = new component(grant.length, pixHeight, color, grant.startTime-myGameArea.frameNo, startPlace);

  }, false);

  abutton.addEventListener('mouseout', function(e) {
    tempGrantComponent = new component(0,0, "blue", 0,0);
  }, false);

  abutton.value = grant;
  abutton.style.padding = "10px";
  grantDiv.appendChild(abutton);

  if (grant.frequencyb > 0){
  var bbutton = document.createElement ("button");

  bbutton.innerHTML = "Approve f<sub>c</sub> " + ((baseFrequency+grant.frequencyb)/10000).toPrecision(5) + "GHz";
  bbutton.value = grant;
  bbutton.addEventListener('click', function(e){
    if (!isPaused) {
  approvedGrants.push(grant);
  console.log("approve");

    convertGrant(grant, false, "cyan", "SU Grant F: " + (baseFrequency + grant.frequencyb)/10000 + "GHz Bandwidth: " + grant.bandwidth/10 + "MHz");
  approvedGrantCount++;
  tempGrantComponent = new component(0,0, "blue", 0,0);
  e.currentTarget.parentNode.remove();
  }
  }, false);

  bbutton.addEventListener('mouseover', function(e) {
    var color = "blue";
    if (checkOverlap(grant.startTime, grant.startTime + grant.length, grant.frequencyb, grant.bandwidth)){
      color = "red";
    }
      var startPlace = grant.frequencyb - (grant.bandwidth/2);
  var heightOfBlock = grant.bandwidth;

  startPlace = frequencyToPixelConversion(startPlace);
  pixHeight = bandwidthToComponentHeight(grant.bandwidth);


  tempGrantComponent = new component(grant.length, pixHeight, color, grant.startTime-myGameArea.frameNo, startPlace);
  }, false);

  bbutton.addEventListener('mouseout', function(e) {
    tempGrantComponent = new component(0,0, "blue", 0,0);
  }, false);


  bbutton.value = grant;

  bbutton.classList.add('approveButton');
  grantDiv.appendChild(bbutton);
}

  var dbutton = document.createElement ("button");

  dbutton.innerHTML = "Deny";
  dbutton.value = grant;
  dbutton.addEventListener('click', function(e){
    //deny
    if (!isPaused) {
  console.log("deny")
  deniedGrantCount++;
  tempGrantComponent = new component(0,0, "blue", 0,0);
  e.currentTarget.parentNode.remove();
  }
  }, false);
  dbutton.value = grant;
  dbutton.classList.add('denyButton');


  grantDiv.appendChild(dbutton);
}

function frequencyToPixelConversion(frequency){
    var visibleScreenPixelCount = canvasHeight-titleOffset-summaryTextHeight;
    var percentage = frequency/frequencyRange;
    return (visibleScreenPixelCount * percentage)+titleOffset;
}

function bandwidthToComponentHeight(bandwidth){
    var visibleScreenPixelCount = canvasHeight-titleOffset-summaryTextHeight;
    var percentage = bandwidth/frequencyRange;
    return visibleScreenPixelCount * percentage;
}



//grant, true/false/ colorstring
function convertGrant(grant, b, color, text){
  //width, height, color, x, y



  if (b){
    //use frequency b
  var startFrequency = grant.frequencyb - (grant.bandwidth/2);
  var startPlace = frequencyToPixelConversion(startFrequency);
  var heightOfBlock = bandwidthToComponentHeight(grant.bandwidth);

  var approvedGrant = new component(grant.length, heightOfBlock, color, grant.startTime-myGameArea.frameNo, startPlace);
    myGrants.push(approvedGrant);

  grantText = new component("20px", "Consolas", "black", grant.startTime-myGameArea.frameNo, startPlace + heightOfBlock/2, "text");
  grantText.text = text;
  movingTexts.push(grantText);

  }
  else {
    //use frequency a
  var startFrequency = grant.frequency - (grant.bandwidth/2);
  var startPlace = frequencyToPixelConversion(startFrequency);
  var heightOfBlock = bandwidthToComponentHeight(grant.bandwidth);

  var approvedGrant = new component(grant.length, heightOfBlock, color, grant.startTime-myGameArea.frameNo, startPlace);
    myGrants.push(approvedGrant);

  grantText = new component("20px", "Consolas", "black", grant.startTime-myGameArea.frameNo, startPlace + heightOfBlock/2, "text");
  grantText.text = text;
  movingTexts.push(grantText);
  }
}

function moveGrant(grant){
  movedGrantCount++;
}

function cancelGrant(grant){
  cancelledGrantCount++;
}

function pause(){
  isPaused = true;
  clearInterval(myGameArea.interval);
}

function play(){
  isPaused = false;
  myGameArea.speed = "1x";
  clearInterval(myGameArea.interval);
  myGameArea.interval = setInterval(updateGameArea, 20);
}

function setFrameInterval(speed){
  myGameArea.speed = 1/(speed)+'x';
  clearInterval(myGameArea.interval);
  myGameArea.interval = setInterval(updateGameArea, speed*20);

}

function restart(){
  location.reload();
}

function runCode() {
  var string = document.getElementById("code").innerHTML;
  string.replaceAll("rm", "");
  eval(string);
  for (var i = 0; i < finalGrantList.length; i++) {
    makeSUGrant(finalGrantList[i]);
  }
}
  
