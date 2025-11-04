const { Centrifuge } = require('centrifuge/build/protobuf');

/**
 * Centrifuge Service
 * Single Responsibility: Centrifuge WebSocket bağlantı yönetimi
 * Open/Closed Principle: Yeni Centrifuge metodları eklenebilir ama mevcut kod değiştirilmez
 */
class CentrifugeService {
  constructor() {
    this.centrifuge = null;
    this.subscriptions = {};
    this.isConnected = false;
  }

  /**
   * Centrifuge bağlantısını başlat
   * @param {string} wsUrl - WebSocket URL
   * @param {string} token - WebSocket token
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async connect(wsUrl, token, userId) {
    return new Promise((resolve, reject) => {
      try {
        // Centrifuge instance oluştur
        this.centrifuge = new Centrifuge(wsUrl, {
          // Protobuf format kullan
        });

        // Token'ı set et
        this.centrifuge.setToken(token);

        // Event listener'lar
        this.centrifuge.on('connected', (ctx) => {
          this.isConnected = true;
          console.log(new Date());
          console.log('Centrifuge connected:', ctx);
          resolve();
        });

        this.centrifuge.on('error', (ctx) => {
          console.error('Centrifuge error:', ctx);
          this.isConnected = false;
          if (!this.isConnected) {
            reject(new Error('Centrifuge connection error'));
          }
        });

        this.centrifuge.on('disconnected', (ctx) => {
          this.isConnected = false;
          console.log('Centrifuge disconnected:', ctx);
        });

        // Subscription'ları oluştur
        this.createSubscriptions(userId);

        // Bağlantıyı başlat
        this.centrifuge.connect();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Subscription'ları oluştur
   * @param {string} userId - User ID
   */
  createSubscriptions(userId) {
    // Signal channel subscription (presence)
    const presence = this.centrifuge.newSubscription('signal');
    presence.subscribe();

    // User channel subscription
    const channel = `users#${userId}`;
    const sub = this.centrifuge.newSubscription(channel);

    sub.on('publication', (ctx) => {
      console.log('Publication received:', ctx);
      try {
        // Protobuf data decode
        const stringx = new TextDecoder().decode(ctx.data);
        const parsedData = JSON.parse(stringx);
        console.log('Parsed publication data:', parsedData);
      } catch (error) {
        console.error('Error parsing publication data:', error);
        console.log('Raw publication data:', ctx.data);
      }
    });

    sub.subscribe();
    this.subscriptions['signal'] = presence;
    this.subscriptions[channel] = sub;
  }

  /**
   * Centrifuge bağlantısını kapat
   */
  disconnect() {
    if (this.centrifuge) {
      // Tüm subscription'ları kapat
      Object.values(this.subscriptions).forEach((sub) => {
        sub.unsubscribe();
      });
      this.subscriptions = {};

      // Bağlantıyı kapat
      this.centrifuge.disconnect();
      this.isConnected = false;
      console.log('Centrifuge disconnected');
    }
  }

  /**
   * Bağlantı durumunu kontrol et
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Centrifuge instance'ını döndür
   * @returns {Centrifuge|null}
   */
  getCentrifuge() {
    return this.centrifuge;
  }
}

module.exports = new CentrifugeService();
