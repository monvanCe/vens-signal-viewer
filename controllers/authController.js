const authService = require('../services/authService');

/**
 * Auth Controller
 * Single Responsibility: Authentication controller işlemleri
 * Dependency Inversion: AuthService'e bağımlı ama concrete implementation'a değil
 */
class AuthController {
  /**
   * Login controller
   * @param {string} deviceId - Device ID
   * @returns {Promise<void>}
   */
  async login(deviceId = 'mafiawindows') {
    console.log(`Attempting login with deviceId: ${deviceId}`);

    const result = await authService.login(deviceId);

    if (result.success) {
      console.log('Login successful!');
      console.log('Response:', JSON.stringify(result.data, null, 2));
      return result.data;
    } else {
      console.error('Login failed:', result.error);
      throw new Error(result.error);
    }
  }
}

module.exports = new AuthController();
