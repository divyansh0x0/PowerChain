import requests
url = "http://127.0.0.1:4080"
response = requests.get(f"{url}/power-data/")
print(response.status_code)
print(response.json())