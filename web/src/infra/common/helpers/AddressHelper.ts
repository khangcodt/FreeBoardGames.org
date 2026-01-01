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
      // Use the fbg-server URL from environment variable
      // This is set via NEXT_PUBLIC_API_URL in docker-compose
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
