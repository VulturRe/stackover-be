const axios = require('../../config/axios');
const baseUrl = 'http://api.stackexchange.com/2.2';

const defaultOptions = {
  site: 'stackoverflow',
  page: 1,
  pagesize: 10,
  order: 'desc',
  sort: 'relevance'
};

class StackOverflow {
  static search(options = {
    intitle,
    tagged,
    site,
    page,
    pagesize,
    order,
    sort
  }) {
    const params = Object.assign(defaultOptions, options);
    return axios.get(`${baseUrl}/search`, { params })
      .then(res => res.data);
  }
  
  static searchSimilar(options = {
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

  static answers(id, options = {
    site,
    page,
    pagesize,
    order,
    sort
  }) {
    const params = Object.assign(defaultOptions, options);
    params.sort = 'votes';
    params.filter = '!9Z(-wzu0T';
    return axios.get(`${baseUrl}/questions/${id}/answers`, { params })
      .then(res => res.data);
  }

  static userQuestions(id, options = {
    site,
    page,
    pagesize,
    order,
    sort
  }) {
    const params = Object.assign(defaultOptions, options);
    params.sort = 'votes';
    return axios.get(`${baseUrl}/users/${id}/questions`, { params })
      .then(res => res.data);
  }

  static question(id) {
    const params = { ...defaultOptions };
    params.sort = 'votes';
    params.filter = '!L_Zm1rmoFy**boQEXFghE5';
    return axios.get(`${baseUrl}/questions/${id}`, { params })
      .then(res => res.data);
  }
}

module.exports = StackOverflow;
