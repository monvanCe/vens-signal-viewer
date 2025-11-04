const axios = require('axios');
const apiConfig = require('../config/apiConfig');

/**
 * API Service
 * Dependency Inversion Principle: HTTP istekleri için abstract bir katman
 * Single Responsibility: Tüm HTTP isteklerini yönetir
 */
class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Authorization header ekleme
    this.client.interceptors.request.use(
      (config) => {
        // Token varsa Authorization header ekle
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    this.token = token;
  }

  /**
   * POST request method
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @returns {Promise}
   */
  async post(endpoint, data) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * GET request method
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @returns {Promise}
   */
  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handler
   * @param {Error} error - Axios error
   * @returns {Error}
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return new Error(
        `API Error: ${error.response.status} - ${
          error.response.data?.message || error.message
        }`
      );
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server');
    } else {
      // Error in request setup
      return new Error(`Request Error: ${error.message}`);
    }
  }
}

module.exports = new ApiService();
