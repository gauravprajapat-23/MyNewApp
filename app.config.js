export default ({ config }) => {
    return {
        ...config,
        name: 'CashPoint Agent',
        slug: 'cashpoint-agent',
        version: '1.0.0',
        plugins: [
            'expo-maps',
            'expo-location',
        ],
        googleMaps: {
            apiKey: 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao',
        },
        extra: {
            apiUrl: process.env.API_URL || 'http://192.168.1.9:3000/api',
            environment: process.env.NODE_ENV || 'development',
        },
    };
};
