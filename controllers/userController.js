const userService = require('../services/userService');

/**
 * User Controller
 * Single Responsibility: User controller işlemleri
 * Dependency Inversion: UserService'e bağımlı ama concrete implementation'a değil
 */
class UserController {
  /**
   * WebSocket token alma controller
   * @returns {Promise<object>}
   */
  async getWsToken() {
    console.log('Fetching WebSocket token...');

    const result = await userService.getWsToken();

    if (result.success) {
      console.log('WebSocket token retrieved successfully!');
      console.log('Response:', JSON.stringify(result.data, null, 2));
      return result.data;
    } else {
      console.error('Failed to get WebSocket token:', result.error);
      throw new Error(result.error);
    }
  }
}

module.exports = new UserController();
