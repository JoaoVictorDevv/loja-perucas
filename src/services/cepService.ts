import { ShippingOption } from '../types/cart';
import { sanitizeNumbersOnly } from '../security/sanitizer';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface CepLookupResult {
  success: boolean;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  cepFormatado: string;
  shippingOptions: ShippingOption[];
  error?: string;
}

export async function lookupCep(rawCep: string, orderSubtotal = 0): Promise<CepLookupResult> {
  const clean = sanitizeNumbersOnly(rawCep);
  if (clean.length !== 8) {
    return {
      success: false,
      logradouro: '',
      bairro: '',
      cidade: '',
      uf: '',
      cepFormatado: '',
      shippingOptions: [],
      error: 'O CEP deve conter exatamente 8 dígitos numéricos.',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Falha na resposta do serviço postal.');
    }

    const data: ViaCepResponse = await response.json();
    if (data.erro) {
      return {
        success: false,
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        cepFormatado: '',
        shippingOptions: [],
        error: 'CEP não encontrado na base dos Correios.',
      };
    }

    // Calcula fretes com política de Frete Grátis acima de R$ 3.000
    const isFreeShipping = orderSubtotal >= 3000;
    const isSudeste = ['SP', 'RJ', 'MG', 'ES'].includes(data.uf);

    const pacPrice = isFreeShipping ? 0 : isSudeste ? 29.9 : 44.9;
    const sedexPrice = isSudeste ? 49.9 : 79.9;

    const shippingOptions: ShippingOption[] = [
      {
        id: 'pac',
        name: 'PAC Seguro · Correios',
        price: pacPrice,
        days: isSudeste ? '3 a 5 dias úteis' : '6 a 9 dias úteis',
        description: isFreeShipping ? 'Benefício Atelier: Frete Grátis aplicado!' : 'Envio rastreado com embalagem sigilosa',
      },
      {
        id: 'sedex',
        name: 'SEDEX Prioritário · Seguro Total',
        price: sedexPrice,
        days: isSudeste ? '1 a 2 dias úteis' : '2 a 4 dias úteis',
        description: 'Entrega rápida com seguro contra extravio e aviso de recebimento',
      },
    ];

    return {
      success: true,
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      uf: data.uf || '',
      cepFormatado: `${clean.slice(0, 5)}-${clean.slice(5)}`,
      shippingOptions,
    };
  } catch (err: unknown) {
    console.warn('[ViaCEP] Erro ao consultar API online, utilizando cálculo de contingência:', err);

    // Modo de contingência para redes offline ou bloqueadas por CORS/adblock
    const isFreeShipping = orderSubtotal >= 3000;
    return {
      success: true,
      logradouro: 'Endereço localizado (modo contingência)',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cepFormatado: `${clean.slice(0, 5)}-${clean.slice(5)}`,
      shippingOptions: [
        {
          id: 'pac',
          name: 'PAC Seguro · Correios',
          price: isFreeShipping ? 0 : 34.9,
          days: '4 a 6 dias úteis',
          description: isFreeShipping ? 'Frete Grátis Atelier' : 'Envio com seguro e rastreio completo',
        },
        {
          id: 'sedex',
          name: 'SEDEX Prioritário · Seguro Total',
          price: 59.9,
          days: '1 a 2 dias úteis',
          description: 'Entrega rápida com seguro total',
        },
      ],
    };
  }
}
