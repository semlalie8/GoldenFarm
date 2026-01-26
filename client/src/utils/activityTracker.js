import axios from 'axios';

export const recordActivity = async (type, item, itemModel, details, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        await axios.post(
            '/api/users/activity',
            { type, item, itemModel, details },
            config
        );
    } catch (error) {
        console.error('Error recording activity:', error);
    }
};
