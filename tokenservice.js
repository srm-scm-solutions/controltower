const axios = require('axios');

const tenantId = '97f7fcbd-e642-4be8-b84f-fc2cd7f8d6ff';
const clientId = '270d74ef-462c-4792-b199-a8980928e41f';
const clientSecret = 'VWa8Q~ZZilqL0SPiNkGcw-K9npUX4Mmsi_OOxcVY';

async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', 'https://analysis.windows.net/powerbi/api/.default');

  try {
    const response = await axios.post(url, params);
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
}

module.exports = { getAccessToken };
