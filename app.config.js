export default ({ config }) => {
    return {
        ...config,
        name: 'CashPoint Agent',
        slug: 'cashpoint-agent',
        version: '1.0.0',
        extra: {
            apiUrl: process.env.API_URL || 'http://192.168.1.6:3000/api',
            environment: process.env.NODE_ENV || 'development',
        },
    };
};
