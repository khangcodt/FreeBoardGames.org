// Extend Window interface to include runtime config
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      apiUrl: string;
    };
  }
}

export default class AddressHelper {
  public static getGraphQLServerAddress() {
    return `/graphql`;
  }

  public static getWSServerAddress() {
    if (typeof window === 'undefined') {
      return '';
    }
    
    if (window.location.hostname === 'localhost') {
      return 'ws://localhost:3001/graphql';
    } else {
      // Use runtime configuration injected by _document.tsx
      // This allows the URL to be set at runtime (in Coolify) rather than build time
      const apiUrl = window.__RUNTIME_CONFIG__?.apiUrl;
      if (apiUrl) {
        // Convert http/https to ws/wss
        const wsUrl = apiUrl.replace(/^https?/, (match) => match === 'https' ? 'wss' : 'ws');
        return `${wsUrl}/graphql`;
      }
      // Fallback to current hostname (shouldn't happen in production)
      return `wss://${window.location.hostname}/graphql`;
    }
  }
}
