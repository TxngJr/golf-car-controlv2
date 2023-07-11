#ifndef BATTERYCHECK_H
#define BATTERYCHECK_H

#include <Arduino.h>

class BatteryCheck {
private:
  uint8_t _battery_pin;
public:
  BatteryCheck(uint8_t battery_pin);
  int batteryPercent();
};

#endif