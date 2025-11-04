const apiService = require('./apiService');
const apiConfig = require('../config/apiConfig');

/**
 * Auth Service
 * Single Responsibility: Authentication işlemlerinden sorumlu
 * Open/Closed Principle: Yeni auth metodları eklenebilir ama mevcut kod değiştirilmez
 */
class AuthService {
  /**
   * Login işlemi
   * @param {string} deviceId - Device ID
   * @returns {Promise<object>} Login response
   */
  async login(deviceId) {
    try {
      const endpoint = apiConfig.endpoints.auth.login;
      const data = { deviceId };

      const response = await apiService.post(endpoint, data);
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

module.exports = new AuthService();
