// ==UserScript==
// @name       Datategoed ophaler (T-Mobile thuis)
// @namespace  net.marcelv.datategoed
// @version    1
// @include    https://www.t-mobile.nl/my/verbruik-en-kosten*
// @require    http://www.marcelv.net/jquery-1.6.4.min.js
// @grant      GM.xmlHttpRequest
// ==/UserScript==

$(function(){ 
 setTimeout(HoeveelData,15000);
 setInterval(Start,60000);
  
 function HoeveelData() {
  var data = $("table.bundle-usage-table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)").text();
  data=data.trim();
  data = data.replace(/ +(?= )/g,'').replace(/(\r\n|\n|\r)/gm, "");
  console.log(new Date().toLocaleTimeString()+": Datategoed="+data);
   
  var mb = data.split(" ")[0];
  console.log("MB="+mb);
   
  // Toon tegoed op display
  var digits="0000"+mb;
  digits = digits.slice(-4);
  GM.xmlHttpRequest({
   method: "GET",
   url: "http://192.168.0.87/"+digits,
   onload: function (R) {
    var resp = R.responseText;
    console.log("D1 mini webserver: "+resp);
   }
  });
  var S="groen";
  if(mb<280) S="knipper";
  else if(mb<350) S="rood";
  else if(mb<400) S="blauw";  
  
  GM.xmlHttpRequest({
   method: "GET",
   url: "http://192.168.0.88/info?data="+S,
   onload: function (R) {
    var resp = R.responseText;
    console.log("D1 mini tegoedlamp: "+resp);
   }
  });
    
   
  if(mb<400) {
   var player = new Audio();
   player.src = 'http://www.marcelv.net/pub/beep.mp3';   
   player.autoplay = true;      
   
   GM.xmlHttpRequest({
    method: "GET",    
    url:"http://localhost:5000", // PHP site die tegoed aanvult
    onload: function (R) {
     var resp = R.responseText;
     console.log("PHP webserver: "+resp);
    }
   });
    
   
  }
 }
  
 function Start() {  
  console.log(1);      
  var B=document.getElementById("RefreshUsageButton");
   
  var clickEvent = document.createEvent ('MouseEvents');
  clickEvent.initEvent ('click', true, true);
  B.dispatchEvent (clickEvent);
  console.log(2);
  setTimeout(HoeveelData,18000);
 }
  
});

