import requests
import json

FRENET_TOKEN = '0D9AED5DR0AB7R4086R96AARD1BC23F46D81'
ENDPOINTS = [
    'https://api.frenet.com.br/shipping/quote',
    'https://api.frenet.com.br/api/shipping/quote',
    'https://api.frenet.com.br/v1/shipping/quote',
    'https://api.frenet.com.br/api/Shipping'
]

payload = {
    "ShipperPostalCode": "01310100",
    "ReceiverPostalCode": "20040020",
    "ShipmentInvoiceValue": 100,
    "ShipmentWeight": 1,
    "ReceiverType": 1,
    "RealWeight": True,
    "CubedWeight": False,
    "ShipmentLength": 20,
    "ShipmentHeight": 10,
    "ShipmentWidth": 15,
    "ShipmentDiameter": 0
}

for url in ENDPOINTS:
    try:
        print(f"Testing {url}...")
        response = requests.post(url, json=payload, headers={'token': FRENET_TOKEN}, timeout=5)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Success!")
            print(json.dumps(response.json(), indent=2)[:500])
            break
        else:
            print(f"Failed with {response.status_code}")
            # print(response.text[:200])
    except Exception as e:
        print(f"Error: {e}")

