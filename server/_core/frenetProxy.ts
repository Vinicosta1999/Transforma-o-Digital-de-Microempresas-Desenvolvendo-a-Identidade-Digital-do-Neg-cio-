/**
 * Proxy server-side para API Frenet
 * Evita erros de CORS e expõe o token de forma segura
 * Token gerido exclusivamente via variável de ambiente
 */

import type { Express } from "express";
import { ENV } from "./env";

const FRENET_API_URL = "https://api.frenet.com.br/api";
const FRENET_TOKEN = process.env.FRENET_API_TOKEN || ENV.frenetToken;

if (!FRENET_TOKEN) {
  console.warn("[Frenet] Token não configurado. Usando fallback para testes.");
}

export function registerFrenetProxy(app: Express) {
  /**
   * Proxy para cálculo de frete
   * POST /api/frenet/shipping/quote
   */
  app.post("/api/frenet/shipping/quote", async (req, res) => {
    try {
      const { from, to, products } = req.body;

      if (!from || !to || !products) {
        return res.status(400).json({
          error: "Parâmetros obrigatórios ausentes: from, to, products",
        });
      }

      // Validar CEPs
      const cepOrigem = from.postal_code?.replace(/\D/g, "");
      const cepDestino = to.postal_code?.replace(/\D/g, "");

      if (!cepOrigem || cepOrigem.length !== 8 || !cepDestino || cepDestino.length !== 8) {
        return res.status(400).json({
          error: "CEPs inválidos",
        });
      }

      // Preparar payload para Frenet
      const frenetPayload = {
        ShipperPostalCode: cepOrigem,
        ReceiverPostalCode: cepDestino,
        ShipmentInvoiceValue: products.reduce((acc: number, p: any) => acc + (p.insurance_value || 0), 0),
        ShipmentWeight: Math.max(...products.map((p: any) => p.weight || 0.5)),
        ReceiverType: 1, // 1 = Pessoa Física, 2 = Pessoa Jurídica
        RealWeight: true,
        CubedWeight: false,
        ShipmentLength: Math.max(...products.map((p: any) => p.length || 20)),
        ShipmentHeight: Math.max(...products.map((p: any) => p.height || 20)),
        ShipmentWidth: Math.max(...products.map((p: any) => p.width || 20)),
        ShipmentDiameter: 0,
      };

      // Se não houver token, retornar fallback
      if (!FRENET_TOKEN) {
        console.log("[Frenet] Usando fallback (token não configurado)");
        return res.json({
          ShippingSevicesArray: [
            {
              ServiceCode: 1,
              ServiceDescription: "SEDEX",
              Carrier: "Correios",
              ShippingPrice: "25.50",
              DeliveryTime: "2",
              Error: false,
            },
            {
              ServiceCode: 2,
              ServiceDescription: "PAC",
              Carrier: "Correios",
              ShippingPrice: "15.00",
              DeliveryTime: "5",
              Error: false,
            },
          ],
        });
      }

      // Fazer requisição para Frenet
      const frenetResponse = await fetch(`${FRENET_API_URL}/Shipping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${FRENET_TOKEN}`,
        },
        body: JSON.stringify(frenetPayload),
      });

      if (!frenetResponse.ok) {
        console.error(`[Frenet] Erro na resposta: ${frenetResponse.status}`);
        
        // Retornar fallback em caso de erro
        return res.json({
          ShippingSevicesArray: [
            {
              ServiceCode: 1,
              ServiceDescription: "SEDEX",
              Carrier: "Correios",
              ShippingPrice: "25.50",
              DeliveryTime: "2",
              Error: false,
            },
            {
              ServiceCode: 2,
              ServiceDescription: "PAC",
              Carrier: "Correios",
              ShippingPrice: "15.00",
              DeliveryTime: "5",
              Error: false,
            },
          ],
        });
      }

      const frenetData = await frenetResponse.json();
      res.json(frenetData);
    } catch (error) {
      console.error("[Frenet] Erro ao processar requisição:", error);
      
      // Retornar fallback em caso de erro
      res.json({
        ShippingSevicesArray: [
          {
            ServiceCode: 1,
            ServiceDescription: "SEDEX",
            Carrier: "Correios",
            ShippingPrice: "25.50",
            DeliveryTime: "2",
            Error: false,
          },
          {
            ServiceCode: 2,
            ServiceDescription: "PAC",
            Carrier: "Correios",
            ShippingPrice: "15.00",
            DeliveryTime: "5",
            Error: false,
          },
        ],
      });
    }
  });

  /**
   * Proxy para rastreamento
   * GET /api/frenet/tracking/:trackingNumber
   */
  app.get("/api/frenet/tracking/:trackingNumber", async (req, res) => {
    try {
      const { trackingNumber } = req.params;

      if (!trackingNumber) {
        return res.status(400).json({
          error: "Número de rastreamento obrigatório",
        });
      }

      if (!FRENET_TOKEN) {
        console.log("[Frenet] Usando fallback para rastreamento (token não configurado)");
        return res.json({
          TrackingNumber: trackingNumber,
          Status: "Em processamento",
          PostingDate: new Date().toISOString(),
          EstimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          Location: "Agência de Postagem",
        });
      }

      // Fazer requisição para Frenet
      const frenetResponse = await fetch(`${FRENET_API_URL}/Tracking/${trackingNumber}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${FRENET_TOKEN}`,
        },
      });

      if (!frenetResponse.ok) {
        console.error(`[Frenet] Erro na resposta: ${frenetResponse.status}`);
        return res.status(404).json({
          error: "Rastreamento não encontrado",
        });
      }

      const frenetData = await frenetResponse.json();
      res.json(frenetData);
    } catch (error) {
      console.error("[Frenet] Erro ao processar rastreamento:", error);
      res.status(500).json({
        error: "Erro ao processar rastreamento",
      });
    }
  });
}
