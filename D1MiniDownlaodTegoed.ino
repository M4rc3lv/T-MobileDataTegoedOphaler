// Let op: dit werkt samen met het Greasemonkey-script datategoedophaler.user.js
// (C) januari 2020 MarcelV
#include <TM1637Display.h>
#include <ESP8266WiFi.h>
 
#define CLK D6 // Wit
#define DIO D5 // Blauw
#define BUZZER D3 // Paars
#define IPADRES 87
 
TM1637Display display(CLK, DIO);
WiFiServer server(80);

const char* ssid = "SSIDOfMyWifiNetwork";
const char* password = "PASSWORDOfMyWifiNetwork";
 
void setup() {
 pinMode(BUZZER,OUTPUT);
 Serial.begin(115200);
 display.setBrightness(0x0f);
 display.showNumberDec(1);
 Serial.println();
 Serial.println();
 Serial.print(F("Connecting to "));
 Serial.println(ssid);
 WiFi.mode(WIFI_STA); 
 WiFi.config(
  IPAddress(192,168,0,IPADRES),IPAddress(192,168,0,1),
  IPAddress(255,255,255,0),IPAddress(192,168,0,1)); 
 WiFi.begin(ssid, password);

  int i=1;
  while (WiFi.status() != WL_CONNECTED) {
   delay(500);
   Serial.print(F("."));
   display.showNumberDec(i++);
  }
  Serial.println();
  Serial.println(F("WiFi connected"));
  display.showNumberDec(0);

  // Start the server
  server.begin();
  Serial.println(F("Server started"));

  // Print the IP address
  Serial.println(WiFi.localIP());
}
 
 
void loop() {
 WiFiClient client = server.available();
 if(!client)return;  

 String req = client.readStringUntil('\r');
 Serial.println(F("request: "));
 Serial.println(req); //GET /1234 HTTP/1.1

 req = req.substring(5,9);
 if(IsNum(req)) {
  int i=req.toInt();
  display.showNumberDec(i);
  if(i<350) {
   digitalWrite(BUZZER,HIGH);
   delay(700);
   digitalWrite(BUZZER,LOW);
  }
 }
 else display.showNumberDec(-1);
 client.print(F("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<!DOCTYPE HTML>\r\nOK "));
}

bool IsNum(String &s) {
 int len=s.length();
 for(unsigned int i = 0; i < len; ++i) 
  if(!isDigit(s.charAt(i))) return false;
  
 return true;
}
