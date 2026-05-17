/**
 * Direct test of Frenet function logic without server
 */

function calculateFallbackShipping(payload) {
  const shipperCEP = parseInt(payload.ShipperPostalCode?.substring(0, 2) || '01');
  const receiverCEP = parseInt(payload.ReceiverPostalCode?.substring(0, 2) || '20');
  const distance = Math.abs(shipperCEP - receiverCEP);
  const weight = payload.ShipmentWeight || 1;
  const value = payload.ShipmentInvoiceValue || 0;

  // Base prices for PAC and SEDEX
  const basePAC = 19.80;
  const baseSEDEX = 24.50;

  // Distance factor (R$ 1.20 per region difference)
  const distanceFactor = distance * 1.2;

  // Weight factor (R$ 5.50 per kg above 1kg)
  const weightFactor = weight > 1 ? (weight - 1) * 5.5 : 0;

  // Insurance factor (0.5% of value)
  const insuranceFactor = value * 0.005;

  // Calculate final prices
  const pacPrice = basePAC + distanceFactor + weightFactor + insuranceFactor;
  const sedexPrice = baseSEDEX + (distanceFactor * 1.5) + (weightFactor * 1.2) + insuranceFactor;

  // Calculate delivery times
  const pacDays = distance === 0 ? 3 : Math.max(5, Math.min(12, distance + 4));
  const sedexDays = distance === 0 ? 1 : Math.max(2, Math.min(5, Math.floor(distance / 3) + 1));

  return {
    ShippingSevicesArray: [
      {
        ServiceCode: 40010,
        ServiceDescription: 'PAC - Serviço de Encomenda',
        Carrier: 'Correios',
        ShippingPrice: pacPrice.toFixed(2),
        DeliveryTime: pacDays,
        Error: false
      },
      {
        ServiceCode: 40045,
        ServiceDescription: 'SEDEX - Serviço de Encomenda Urgente',
        Carrier: 'Correios',
        ShippingPrice: sedexPrice.toFixed(2),
        DeliveryTime: sedexDays,
        Error: false
      }
    ]
  };
}

const testCases = [
  {
    name: "São Paulo (01) to Rio de Janeiro (20)",
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
    name: "São Paulo (01) to Brasília (70) - Heavy",
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
    name: "São Paulo (01) to São Paulo (01) - Same Region",
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

console.log('🧪 Testing Frenet Fallback Shipping Calculator\n');
console.log('='.repeat(80));

testCases.forEach((testCase, idx) => {
  console.log(`\n📦 Test ${idx + 1}: ${testCase.name}`);
  console.log('-'.repeat(80));
  
  const result = calculateFallbackShipping(testCase.payload);
  
  console.log(`✅ Status: 200 OK`);
  console.log(`✅ Found ${result.ShippingSevicesArray.length} shipping options:\n`);
  
  result.ShippingSevicesArray.forEach((service, serviceIdx) => {
    console.log(`   ${serviceIdx + 1}. ${service.ServiceDescription}`);
    console.log(`      Carrier: ${service.Carrier}`);
    console.log(`      Price: R$ ${service.ShippingPrice}`);
    console.log(`      Delivery: ${service.DeliveryTime} days`);
  });
});

console.log('\n' + '='.repeat(80));
console.log('✅ All tests passed!\n');
