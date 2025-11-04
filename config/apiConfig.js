/**
 * API Configuration
 * Single Responsibility: API base URL ve endpoint yapılandırması
 */
module.exports = {
  baseURL: 'https://vens.cekolabs.com',
  endpoints: {
    auth: {
      login: '/auth/login',
    },
    users: {
      wsToken: '/users/ws-token',
    },
  },
};
