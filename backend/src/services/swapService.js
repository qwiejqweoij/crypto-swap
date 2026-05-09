import axios from 'axios';

const BASE = 'https://api.simpleswap.io/v1';

async function req(method, endpoint, params = {}) {
  const apiKey = process.env.SIMPLESWAP_API_KEY;
  const res = await axios({
    method,
    url: `${BASE}/${endpoint}`,
    params: { api_key: apiKey, ...params },
    timeout: 15_000,
  });
  return res.data;
}

export async function getEstimated(from, to, amount) {
  const data = await req('GET', 'get_estimated', {
    currency_from: from,
    currency_to: to,
    amount,
    fixed: false,
  });
  return String(data);
}

export async function getMinAmount(from, to) {
  try {
    const data = await req('GET', 'get_min_amount', {
      currency_from: from,
      currency_to: to,
      fixed: false,
    });
    return String(data);
  } catch {
    return null;
  }
}

export async function createExchange({ from, to, amount, addressTo, refundAddress }) {
  return req('POST', 'create_exchange', {
    currency_from: from,
    currency_to: to,
    amount,
    address_to: addressTo,
    refund_address: refundAddress || '',
    fixed: false,
  });
}

export async function getExchangeStatus(id) {
  return req('GET', 'get_exchange', { id });
}
