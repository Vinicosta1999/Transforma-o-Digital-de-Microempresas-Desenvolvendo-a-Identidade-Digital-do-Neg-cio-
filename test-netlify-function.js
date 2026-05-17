import axios from 'axios';

const FUNCTION_URL = 'http://localhost:8888/.netlify/functions/frenet';

const testCases = [
  {
    name: "São Paulo to Rio de Janeiro",
    payload: {
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
    }
  },
  {
    name: "São Paulo to Brasília (heavier package)",
    payload: {
      ShipperPostalCode: '01310100',
      ReceiverPostalCode: '70040902',
      ShipmentInvoiceValue: 500,
      ShipmentWeight: 5,
      ReceiverType: 1,
      RealWeight: true,
      CubedWeight: false,
      ShipmentLength: 30,
      ShipmentHeight: 20,
      ShipmentWidth: 25,
      ShipmentDiameter: 0,
    }
  },
  {
    name: "Same region (São Paulo to São Paulo)",
    payload: {
      ShipperPostalCode: '01310100',
      ReceiverPostalCode: '01310200',
      ShipmentInvoiceValue: 50,
      ShipmentWeight: 0.5,
      ReceiverType: 1,
      RealWeight: true,
      CubedWeight: false,
      ShipmentLength: 15,
      ShipmentHeight: 8,
      ShipmentWidth: 12,
      ShipmentDiameter: 0,
    }
  }
];

async function runTests() {
  console.log('🧪 Testing Netlify Function: Frenet Shipping Calculator\n');
  console.log('=' .repeat(80));

  for (const testCase of testCases) {
    console.log(`\n📦 Test: ${testCase.name}`);
    console.log('-'.repeat(80));
    
    try {
      const response = await axios.post(FUNCTION_URL, testCase.payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('✅ Status: 200 OK');
        
        if (data.ShippingSevicesArray && data.ShippingSevicesArray.length > 0) {
          console.log(`✅ Found ${data.ShippingSevicesArray.length} shipping options:\n`);
          
          data.ShippingSevicesArray.forEach((service, idx) => {
            console.log(`   ${idx + 1}. ${service.ServiceDescription}`);
            console.log(`      Carrier: ${service.Carrier}`);
            console.log(`      Price: R$ ${service.ShippingPrice}`);
            console.log(`      Delivery: ${service.DeliveryTime} days`);
            if (service.Error) {
              console.log(`      ⚠️ Error: ${service.Error}`);
            }
          });
        } else {
          console.log('⚠️ No shipping services returned');
        }
      } else {
        console.log(`❌ Unexpected status: ${response.status}`);
        console.log(response.data);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Connection refused - is the dev server running?');
        console.log('   Run: netlify dev');
      } else if (error.response) {
        console.log(`❌ Error ${error.response.status}:`);
        console.log(error.response.data);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Test suite completed\n');
}

runTests();
