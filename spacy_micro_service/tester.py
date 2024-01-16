import requests

url = "http://localhost:5000"

headers = {"Content-Type": "application/json"}

content = {
    "sample": "Zulässigkeit",
    "user": "Zulässigkeit",
}

response = requests.post(url, headers=headers, json=content)

print(response.text)
