#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <UrlEncode.h>
#include <ESP8266WebServer.h>

String phoneNumber = "+34xxxxxxxxx";
String apiKey = "xxxxxxx";

void sendMessage(String message){
  // Data to send with HTTP GET
  String queryString = "phone=" + urlEncode(phoneNumber) + "&apikey=" + apiKey + "&text=" + urlEncode(message);
  String url = "http://api.callmebot.com/whatsapp.php?" + queryString;

  WiFiClient client;    
  HTTPClient http;
  http.begin(client, url);
  // Specify content-type header
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  http.addHeader("Content-Size", "0");
  // Send HTTP GET request
  int httpResponseCode = http.GET();
  if (httpResponseCode == HTTP_CODE_OK){
    Serial.print("Message sent successfully");
  }

  else{
    Serial.println("Error sending the message");
    Serial.print("HTTP response code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();
}

ESP8266WebServer server(80);

const char* ssid = "";
const char* password = "";

const char WIFI_page[] PROGMEM = R"=====(
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Configuración de Red Wi-Fi</title>
  </head>
  <style>
  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  ul {
	  display: inline-block; 
	  text-align: left; 
  }

  .div_list {
    text-align: center;
  }

</style>
  <body>
  <center>
    <h1>Configuración de Red Wi-Fi</h1>
  </center>
<div class="form-container">
    <form method="POST" action="/setwifi">
      <label>SSID:</label>
      <input type="text" name="ssid"><br><br>
      <label>Contraseña:</label><input type="password" name="password"><br><br>
      <center><input type="submit" value="Enviar"></center>
    </form>
</div>
    <div class="div_list">
    <h2>Redes WiFi disponibles (SSIDs)</h2>
    <ul>
    %WIFI_LIST%
    </ul>
    </center>
  </body>
</html>
)=====";

void handleRoot() {
  String s = FPSTR(WIFI_page);
  // Replace the %WIFI_LIST% placeholder with the list of available networks
  String wifi_list;
  int num_networks = WiFi.scanNetworks();
  for (int i = 0; i < num_networks; i++) {
    wifi_list += "<li>" + WiFi.SSID(i) + "</li>";
  }
  s.replace("%WIFI_LIST%", wifi_list);
  server.send(200, "text/html", s);
}

void handleSetWifi() {
  String ssid = server.arg("ssid");
  String password = server.arg("password");
  server.send(200, "text/plain", "Datos recibidos: SSID=" + ssid + ", Password=" + password);
  WiFi.begin(ssid.c_str(), password.c_str());
  server.stop();
  WiFi.softAPdisconnect();
}

void setup() {
  Serial.begin(115200);
  WiFi.softAP("ConfiguraTuWifi", "");
  IPAddress ip = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(ip);
  server.on("/", handleRoot);
  server.on("/setwifi", handleSetWifi);
  server.begin();

  pinMode(0, OUTPUT);
  digitalWrite(0, LOW);
  Serial.begin(115200);
}

void loop() {
  server.handleClient();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.begin(115200);
    Serial.println("Conectado a la red Wi-Fi.");
  }

  bool pin_state = digitalRead(0);
  
  if (pin_state == HIGH) {
    sendMessage("Noti-Fi Tec: Estan trucant al timbre.");
  }

  delay(4000); // espera un poco antes de volver a leer los pines
}
