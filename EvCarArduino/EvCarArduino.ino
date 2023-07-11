#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiManager.h>
#include <ArduinoJson.h>
#include <BatteryCheck.h>
#include <TinyGPS++.h>
#include <HCSR04.h>

#define GPS_RX_PIN 16
#define GPS_TX_PIN 17

#define ULTRA_TRIG_PIN 12
#define ULTRA_ECHO_PIN 13

#define FRONT_LIGHT_PIN 2
#define BACK_LIGHT_PIN 4
#define IS_START_PIN 5
#define LEFT_LIGHT_PIN 18
#define RIGHT_LIGHT_PIN 19
#define CHECK_BATTERY_PIN 33
#define BUZZER_PIN 22

BatteryCheck battery(CHECK_BATTERY_PIN);
TinyGPSPlus gps;
HCSR04 ultra(ULTRA_TRIG_PIN, ULTRA_ECHO_PIN);

String serverName = "http://swapsjobs.3bbddns.com:36889/car/";
String tokenId = "648fe088444fd58e8d3cac8b";
unsigned long previousMillis = 0;
const int taskDelay = 1000;
int prvLatitude = 1;
int prvLongitude = 1;
TaskHandle_t taskHandle = NULL;

void taskCheckSensor(void *pvParameters)
{
  while (1)
  {
    if (ultra.dist() <= 80)
    {
      digitalWrite(BUZZER_PIN, HIGH);
      vTaskDelay(taskDelay);
      digitalWrite(BUZZER_PIN, LOW);
    }
    vTaskDelay(taskDelay / 2);
  }
}
void taskPutBatteryAndMap(void *pvParameters)
{
  while (1)
  {
    while (Serial1.available() > 0)
    {
      if (gps.encode(Serial1.read()))
      {
        if (gps.location.isUpdated())
        {
          const size_t capacity = JSON_OBJECT_SIZE(3);
          DynamicJsonDocument jsonDoc(capacity);
          jsonDoc["battery"] = battery.batteryPercent();
          jsonDoc["latitude"] = gps.location.lat();
          jsonDoc["longitude"] = gps.location.lng();

          String jsonString;
          serializeJson(jsonDoc, jsonString);

          HTTPClient http;

          String serverPath = serverName + "updatebatteryandmapcar/" + tokenId;
          http.begin(serverPath.c_str());
          http.addHeader("Content-Type", "application/json");

          int httpResponseCode = http.PUT(jsonString);

          if (httpResponseCode == HTTP_CODE_OK)
          {
            Serial.println("Data sent successfully");
          }
          else
          {
            Serial.print("Error occurred while sending data: ");
          }
          http.end();
        }
      }
    }
    vTaskDelay(taskDelay / 2);
  }
}

void setup()
{
  Serial.begin(115200);
  Serial1.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  WiFi.mode(WIFI_STA);
  WiFiManager wm;
  bool res;
  // wm.resetSettings();
  res = wm.autoConnect("EvCarConnect", "12345678");
  if (!res)
  {
    Serial.println("Failed to connect");
    ESP.restart();
  }
  else
  {
    Serial.println("connect success");
  }
  pinMode(FRONT_LIGHT_PIN, OUTPUT);
  pinMode(BACK_LIGHT_PIN, OUTPUT);
  pinMode(LEFT_LIGHT_PIN, OUTPUT);
  pinMode(RIGHT_LIGHT_PIN, OUTPUT);
  pinMode(IS_START_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  xTaskCreate(
      taskPutBatteryAndMap,
      "PutBatteryAndMapTask",
      4000,
      NULL,
      1,
      &taskHandle);
  xTaskCreate(
      taskCheckSensor,
      "taskCheckSensorTask",
      1200,
      NULL,
      1,
      &taskHandle);
}

void loop()
{
  if ((millis() - previousMillis) >= 500)
  {
    HTTPClient http;

    String serverPath = serverName + "getcar/" + tokenId;

    http.begin(serverPath.c_str());

    int httpResponseCode = http.GET();

    if (httpResponseCode == HTTP_CODE_OK)
    {
      String response = http.getString();

      DynamicJsonDocument jsonDoc(1024);
      DeserializationError error = deserializeJson(jsonDoc, response);

      if (error)
      {
        Serial.print("Failed to parse JSON: ");
        Serial.println(error.c_str());
      }
      else
      {
        bool frontLightStatus = jsonDoc["frontLight"];
        bool backLightStatus = jsonDoc["backLight"];
        bool leftLightStatus = jsonDoc["leftLight"];
        bool rightLightStatus = jsonDoc["rightLight"];
        bool isStartStatus = jsonDoc["isStart"];
        digitalWrite(FRONT_LIGHT_PIN, !frontLightStatus ? HIGH : LOW);
        digitalWrite(BACK_LIGHT_PIN, !backLightStatus ? HIGH : LOW);
        digitalWrite(LEFT_LIGHT_PIN, !leftLightStatus ? HIGH : LOW);
        digitalWrite(RIGHT_LIGHT_PIN, !rightLightStatus ? HIGH : LOW);
        digitalWrite(IS_START_PIN, !isStartStatus ? HIGH : LOW);
      }
    }
    else
    {
      Serial.print("Error occurred: ");
      Serial.println(httpResponseCode);
    }
    http.end();
    previousMillis = millis();
  }
}