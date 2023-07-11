#include "BatteryCheck.h"

BatteryCheck::BatteryCheck(uint8_t battery_pin)
{
  _battery_pin = battery_pin;
  pinMode(_battery_pin, INPUT);
}
int BatteryCheck::batteryPercent()
{
  int raw_battery = analogRead(_battery_pin);
  if (raw_battery < 2448)
  {
    raw_battery = 2448;
  }
  int batteryPercentage = map(raw_battery, 2448, 4095, 0, 100);
  return batteryPercentage;
}