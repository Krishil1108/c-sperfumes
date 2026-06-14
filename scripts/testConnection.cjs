const { createClient } = require('@sanity/client');

const TOKEN = 'skRTbMRbTHcL13H9qxr61HiDS2jKn2Y31QwQtoYP9enWrwXWMsIvQoVUhWacVTgPFHzwHiT444ERoMEfyKAIuieLmy3kuVIlMT4n5xkQUyM7LeKmbotTQFmEj6hmzqEBizNixxrRbN2EsTD57qwHZ5P7nTIo4dOeytOLsIsCPcBE5K4Mvtk';

const client = createClient({
  projectId: '92sib1op',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
});

console.log('Testing connection to Sanity...');
client.fetch('*[_type == "product"][0..2]')
  .then(r => {
    console.log('✅ Connection OK! Docs found:', r.length);
    console.log('Token is valid. Ready to import.');
  })
  .catch(e => {
    console.error('❌ Error:', e.statusCode, e.message);
    if (e.statusCode === 401) {
      console.log('Token is unauthorized. Please check it in sanity.io/manage → API → Tokens.');
    }
  });
