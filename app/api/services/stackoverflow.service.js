const axios = require('axios');
const baseUrl = 'http://api.stackexchange.com/2.2';

const defaultOptions = {
  site: 'stackoverflow',
  page: 1,
  pagesize: 15,
  order: 'desc',
  sort: 'relevance'
};

class StackOverflow {
  static async searchSimilar(options = {
    title,
    site,
    page,
    pagesize,
    order,
    sort
  }) {
    const params = Object.assign(defaultOptions, options);
    return axios.get(`${baseUrl}/similar`, { params })
      .then(res => res.data);
  }
}

module.exports = StackOverflow;
