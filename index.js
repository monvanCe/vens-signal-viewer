const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const centrifugeController = require('./controllers/centrifugeController');
const apiService = require('./services/apiService');

/**
 * Main Entry Point
 * Single Responsibility: Uygulama başlangıç noktası
 */
async function main() {
  try {
    console.log('Starting application...');

    // Login işlemi
    const loginResponse = await authController.login('mafiawindows');

    // Token'ı apiService'e set et
    if (loginResponse.token) {
      apiService.setAuthToken(loginResponse.token);
      console.log('Token set for authenticated requests');
    }

    // WebSocket token alma işlemi
    const wsTokenResponse = await userController.getWsToken();

    // Centrifuge'e bağlan
    if (wsTokenResponse.wsUrl && wsTokenResponse.token && loginResponse._id) {
      await centrifugeController.connect(
        wsTokenResponse.wsUrl,
        wsTokenResponse.token,
        loginResponse._id
      );

      // Uygulama çalışırken Centrifuge bağlantısını açık tut
      console.log('Centrifuge connection active. Press Ctrl+C to exit.');
    } else {
      throw new Error('WebSocket URL, token or user ID not found in response');
    }
  } catch (error) {
    console.error('Application error:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  centrifugeController.disconnect();
  process.exit(0);
});

// Uygulamayı başlat
main();
