import math
import random

import requests
import datetime

url = "http://127.0.0.1:" + input("port: ")
body = {
    "iot_id": "IOT-" + str(random.randint(1000, 9999)),
    "recorded_at": str(datetime.datetime.now().isoformat()),
    "latitude":round(random.random() * 100,3),
    "longitude": round(random.random() * 100,3),
    "pincode": 1000 +round(random.random() * 100000),
    "power_availability": round(random.random(), 2),
    "number_power_cuts": round(random.random() * 600),
    "number_complaints": round(random.random() * 150),
}
print("Sending",body)
response = requests.post(f"{url}/power-data/", json=body)
print(response.status_code)
print(response.text)
response = requests.get(f"{url}/power-data/", json=body)
print(response.status_code)
print(response.text)
