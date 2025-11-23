const axios = require('axios');

const ASAASTOKEN = 'sandbox_xxxxxxxxxxxxxxxxxxxxx'; // substitua pelo seu token
const BASE_URL = 'https://sandbox.asaas.com/api/v3';

//ASAASTOKEN=sandbox_xxxxxxxxxxxxx
//BASE_URL=https://sandbox.asaas.com/api/v3

const headers = {
  'Content-Type': 'application/json',
  'access_token': ASAASTOKEN,
};

exports.criarCliente = async (cliente) => {
  const res = await axios.post(`${BASE_URL}/customers`, cliente, { headers });
  return res.data;
};

exports.criarCobranca = async (cobranca) => {
  const res = await axios.post(`${BASE_URL}/payments`, cobranca, { headers });
  return res.data;
};
