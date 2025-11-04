const apiService = require('./apiService');
const apiConfig = require('../config/apiConfig');

/**
 * User Service
 * Single Responsibility: User işlemlerinden sorumlu
 * Open/Closed Principle: Yeni user metodları eklenebilir ama mevcut kod değiştirilmez
 */
class UserService {
  /**
   * WebSocket token alma işlemi
   * @returns {Promise<object>} WS token response
   */
  async getWsToken() {
    try {
      const endpoint = apiConfig.endpoints.users.wsToken;

      const response = await apiService.get(endpoint);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new UserService();
