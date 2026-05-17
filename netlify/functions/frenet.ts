import axios from "axios";

const FRENET_TOKEN = '0D9AED5DR0AB7R4086R96AARD1BC23F46D81';
const FRENET_API_URL = 'https://api.frenet.com.br/shipping/quote';

/**
 * Fallback shipping calculation when Frenet API is unavailable
 */
function calculateFallbackShipping(payload: any) {
  const shipperCEP = parseInt(payload.SellerCEP?.substring(0, 2) || '01');
  const receiverCEP = parseInt(payload.RecipientCEP?.substring(0, 2) || '20');
  const distance = Math.abs(shipperCEP - receiverCEP);
  
  // Calculate total weight and value from items
  let totalWeight = 0;
  let totalValue = payload.ShipmentInvoiceValue || 0;
  
  if (payload.ShippingItemArray) {
    payload.ShippingItemArray.forEach((item: any) => {
      totalWeight += (item.Weight || 0) * (item.Quantity || 1);
    });
  }

  const basePAC = 21.90;
  const baseSEDEX = 31.27;
  const distanceFactor = distance * 1.5;
  const weightFactor = totalWeight > 1 ? (totalWeight - 1) * 6.0 : 0;

  const pacPrice = basePAC + distanceFactor + weightFactor;
  const sedexPrice = baseSEDEX + (distanceFactor * 1.8) + (weightFactor * 1.3);

  const pacDays = distance === 0 ? 3 : Math.max(5, Math.min(15, distance + 5));
  const sedexDays = distance === 0 ? 1 : Math.max(2, Math.min(7, Math.floor(distance / 3) + 1));

  return {
    ShippingSevicesArray: [
      {
        ServiceCode: "fallback_pac",
        ServiceDescription: "PAC (Segurança)",
        Carrier: "Correios",
        ShippingPrice: pacPrice.toFixed(2),
        DeliveryTime: pacDays,
        Error: false
      },
      {
        ServiceCode: "fallback_sedex",
        ServiceDescription: "SEDEX (Segurança)",
        Carrier: "Correios",
        ShippingPrice: sedexPrice.toFixed(2),
        DeliveryTime: sedexDays,
        Error: false
      }
    ]
  };
}

export const handler = async (event: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const incomingBody = JSON.parse(event.body || "{}");

    // Map incoming fields to Frenet API format if needed
    // The client sends: ShipperPostalCode, ReceiverPostalCode, etc.
    // Frenet API wants: SellerCEP, RecipientCEP, ShippingItemArray
    
    const frenetPayload = {
      SellerCEP: (incomingBody.ShipperPostalCode || incomingBody.SellerCEP || "").replace(/\D/g, ""),
      RecipientCEP: (incomingBody.ReceiverPostalCode || incomingBody.RecipientCEP || "").replace(/\D/g, ""),
      ShipmentInvoiceValue: incomingBody.ShipmentInvoiceValue || 0,
      ShippingItemArray: incomingBody.ShippingItemArray || [
        {
          Weight: incomingBody.ShipmentWeight || 0.5,
          Length: incomingBody.ShipmentLength || 20,
          Height: incomingBody.ShipmentHeight || 10,
          Width: incomingBody.ShipmentWidth || 15,
          Quantity: 1
        }
      ]
    };

    if (!frenetPayload.SellerCEP || !frenetPayload.RecipientCEP) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "SellerCEP and RecipientCEP are required" }),
      };
    }

    try {
      const response = await axios.post(FRENET_API_URL, frenetPayload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token': FRENET_TOKEN
        },
        timeout: 8000
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response.data),
      };
    } catch (frenetError: any) {
      console.warn("Frenet API Error, using fallback");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(calculateFallbackShipping(frenetPayload)),
      };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", details: error.message }),
    };
  }
};
