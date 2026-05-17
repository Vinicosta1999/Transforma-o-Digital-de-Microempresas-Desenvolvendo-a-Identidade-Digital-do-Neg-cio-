import axios from 'axios';

const FRENET_TOKEN = '0D9AED5DR0AB7R4086R96AARD1BC23F46D81';
const FRENET_API_URL = 'https://api.frenet.com.br/api/Shipping';

// Test payload for frenet API
const testPayload = {
  ShipperPostalCode: '01310100',
  ReceiverPostalCode: '20040020',
  ShipmentInvoiceValue: 100,
  ShipmentWeight: 1,
  ReceiverType: 1,
  RealWeight: true,
  CubedWeight: false,
  ShipmentLength: 20,
  ShipmentHeight: 10,
  ShipmentWidth: 15,
  ShipmentDiameter: 0,
};

async function testFrenetAPI() {
  try {
    console.log('Testing Frenet API with payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await axios.post(FRENET_API_URL, testPayload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': FRENET_TOKEN
      }
    });

    console.log('✅ Frenet API Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.ShippingSevicesArray) {
      console.log(`\n✅ Found ${response.data.ShippingSevicesArray.length} shipping options`);
      response.data.ShippingSevicesArray.forEach((service, idx) => {
        console.log(`\n${idx + 1}. ${service.ServiceDescription || 'Unknown'}`);
        console.log(`   Carrier: ${service.Carrier}`);
        console.log(`   Price: R$ ${service.ShippingPrice}`);
        console.log(`   Delivery Time: ${service.DeliveryTime} days`);
        if (service.Error) {
          console.log(`   Error: ${service.Error}`);
        }
      });
    }
  } catch (error) {
    console.error('❌ Frenet API Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testFrenetAPI();
