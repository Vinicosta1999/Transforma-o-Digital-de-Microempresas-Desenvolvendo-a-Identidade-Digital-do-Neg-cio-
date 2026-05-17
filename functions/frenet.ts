import { Handler } from "@netlify/functions";
import axios from "axios";

const FRENET_TOKEN = '0D9AED5DR0AB7R4086R96AARD1BC23F46D81';
const FRENET_API_URL = 'https://api.frenet.com.br/api/Shipping';

export const handler: Handler = async (event) => {
  // Configuração de headers para CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Tratar requisições de preflight (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const response = await axios.post(FRENET_API_URL, body, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': FRENET_TOKEN
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data),
    };
  } catch (error: any) {
    console.error("Erro na função Frenet:", error.response?.data || error.message);
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: "Erro ao processar frete na Frenet",
        details: error.response?.data || error.message
      }),
    };
  }
};
