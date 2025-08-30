// Configuration for Coastal Threat Alert System
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.coastalguardian.com/v1',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    endpoints: {
      sensors: '/sensors',
      alerts: '/alerts',
      predictions: '/predictions',
      historical: '/historical',
      auth: '/auth',
      webhooks: '/webhooks'
    }
  },

  // Real-time Configuration
  realtime: {
    websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'wss://ws.coastalguardian.com',
    reconnectInterval: 5000, // 5 seconds
    heartbeatInterval: 30000, // 30 seconds
    maxReconnectAttempts: 10
  },

  // Data Refresh Intervals (in milliseconds)
  refresh: {
    sensors: 60000, // 1 minute
    alerts: 30000, // 30 seconds
    predictions: 300000, // 5 minutes
    historical: 900000, // 15 minutes
    riskAssessment: 60000 // 1 minute
  },

  // Alert Configuration
  alerts: {
    maxDisplayed: 10,
    autoDismiss: {
      low: 300000, // 5 minutes
      medium: 600000, // 10 minutes
      high: 0, // Never auto-dismiss
      critical: 0 // Never auto-dismiss
    },
    notification: {
      enabled: true,
      sound: true,
      vibration: true
    }
  },

  // Sensor Configuration
  sensors: {
    types: ['tide_gauge', 'weather_station', 'water_quality', 'wave_buoy', 'satellite'],
    statusThresholds: {
      normal: { min: 0, max: 100 },
      warning: { min: 100, max: 150 },
      critical: { min: 150, max: Infinity }
    }
  },

  // Map Configuration
  map: {
    defaultCenter: { lat: 20.5937, lng: 78.9629 }, // India center
    defaultZoom: 5,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },

  // AI/ML Model Configuration
  ai: {
    models: {
      tidePrediction: 'AI-Tide-Predictor-v2.1',
      stormSurge: 'Storm-Surge-Forecast-v1.5',
      waterQuality: 'Water-Quality-Analyzer-v2.0',
      erosionRisk: 'Coastal-Erosion-Risk-v1.8'
    },
    confidenceThreshold: 0.7,
    predictionHorizon: 72 // hours
  },

  // Notification Configuration
  notifications: {
    channels: {
      sms: {
        enabled: true,
        provider: 'twilio',
        template: 'Coastal Alert: {type} at {location}. Risk: {severity}. {description}'
      },
      email: {
        enabled: true,
        provider: 'sendgrid',
        template: 'coastal-alert-template'
      },
      push: {
        enabled: true,
        provider: 'firebase',
        title: 'Coastal Threat Alert',
        body: '{description}'
      }
    },
    recipients: {
      emergency: ['emergency@coastalguardian.com', '+1234567890'],
      authorities: ['authorities@coastalguardian.com'],
      public: ['public-alerts@coastalguardian.com']
    }
  },

  // Environment-specific overrides
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Feature flags
  features: {
    realTimeUpdates: true,
    aiPredictions: true,
    historicalAnalysis: true,
    mobileNotifications: true,
    webhookIntegrations: true,
    dataExport: true
  }
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  if (config.isDevelopment) {
    return {
      ...config,
      api: {
        ...config.api,
        baseUrl: 'http://localhost:3001/api/v1',
        timeout: 10000
      },
      realtime: {
        ...config.realtime,
        websocketUrl: 'ws://localhost:3001/ws'
      },
      refresh: {
        ...config.refresh,
        sensors: 30000, // Faster refresh in development
        alerts: 15000
      }
    };
  }

  if (config.isProduction) {
    return {
      ...config,
      features: {
        ...config.features,
        debugMode: false,
        verboseLogging: false
      }
    };
  }

  return config;
};

// Export the environment-specific config
export const appConfig = getEnvironmentConfig();

// Type definitions for configuration
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    endpoints: Record<string, string>;
  };
  realtime: {
    websocketUrl: string;
    reconnectInterval: number;
    heartbeatInterval: number;
    maxReconnectAttempts: number;
  };
  refresh: Record<string, number>;
  alerts: {
    maxDisplayed: number;
    autoDismiss: Record<string, number>;
    notification: {
      enabled: boolean;
      sound: boolean;
      vibration: boolean;
    };
  };
  sensors: {
    types: string[];
    statusThresholds: Record<string, { min: number; max: number }>;
  };
  map: {
    defaultCenter: { lat: number; lng: number };
    defaultZoom: number;
    tileLayer: string;
    attribution: string;
  };
  ai: {
    models: Record<string, string>;
    confidenceThreshold: number;
    predictionHorizon: number;
  };
  notifications: {
    channels: Record<string, any>;
    recipients: Record<string, string[]>;
  };
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
  features: Record<string, boolean>;
}
