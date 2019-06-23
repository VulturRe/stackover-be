const axios = require('axios');
const NS_PER_SEC = 1e9;
const NS_PER_MS = 1e6;

let start;

axios.interceptors.request.use(config => {
  start = process.hrtime();
  return config;
});

axios.interceptors.response.use(resp => { 
  const { status, config } = resp;
  const diff = process.hrtime(start);
  
  console.log(`AXIOS ${config.method.toUpperCase()} ${buildUrl(config.url, config.params)} ${status} ${((diff[0] * NS_PER_SEC + diff[1]) / NS_PER_MS).toFixed(3)} ms`);
  return resp; 
});

function buildUrl(host, params) {
  const p = [];
  for (let i in params) {
    p.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
  }
  return host + '?' + p.join('&');
}

module.exports = axios;
