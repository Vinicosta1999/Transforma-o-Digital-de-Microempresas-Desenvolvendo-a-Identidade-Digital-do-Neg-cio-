import requests
import json

FRENET_TOKEN = '0D9AED5DR0AB7R4086R96AARD1BC23F46D81'
URL = 'https://api.frenet.com.br/shipping/quote'

payload = {
    "SellerCEP": "01310100",
    "RecipientCEP": "20040020",
    "ShipmentInvoiceValue": 100,
    "ShippingItemArray": [
        {
            "Weight": 1,
            "Length": 20,
            "Height": 10,
            "Width": 15,
            "Quantity": 1
        }
    ]
}

print(f"Testing {URL} with correct payload structure...")
response = requests.post(URL, json=payload, headers={'token': FRENET_TOKEN}, timeout=10)
print(f"Status: {response.status_code}")
print(json.dumps(response.json(), indent=2))
