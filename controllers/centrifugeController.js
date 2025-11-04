const centrifugeService = require('../services/centrifugeService');

/**
 * Centrifuge Controller
 * Single Responsibility: Centrifuge controller işlemleri
 * Dependency Inversion: CentrifugeService'e bağımlı ama concrete implementation'a değil
 */
class CentrifugeController {
  /**
   * Centrifuge'e bağlan
   * @param {string} wsUrl - WebSocket URL
   * @param {string} token - WebSocket token
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async connect(wsUrl, token, userId) {
    try {
      console.log(`Connecting to Centrifuge: ${wsUrl}`);
      console.log(`User ID: ${userId}`);

      await centrifugeService.connect(wsUrl, token, userId);

      console.log('Centrifuge connection established successfully');
    } catch (error) {
      console.error('Failed to connect Centrifuge:', error.message);
      throw error;
    }
  }

  /**
   * Centrifuge bağlantısını kapat
   */
  disconnect() {
    centrifugeService.disconnect();
  }

  /**
   * Bağlantı durumunu kontrol et
   * @returns {boolean}
   */
  isConnected() {
    return centrifugeService.getConnectionStatus();
  }
}

module.exports = new CentrifugeController();
