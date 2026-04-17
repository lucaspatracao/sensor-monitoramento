  #include "DHT.h"

  #define DHTPIN 4
  #define DHTTYPE DHT11

  DHT dht(DHTPIN, DHTTYPE);

  void setup() {
    Serial.begin(115200);
    dht.begin();
  }

  void loop() {
    delay(20000);
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h) || isnan(t)) {
      return;
    }

    Serial.print("{\"umidade\":");
    Serial.print(h);
    Serial.print(",\"temperatura\":");
    Serial.print(t);
    Serial.println("}");
  }