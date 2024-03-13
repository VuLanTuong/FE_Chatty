
import AsyncStorage from '@react-native-async-storage/async-storage';
export async function getAccessToken() {
    try {
        const access_token = await AsyncStorage.getItem('access-token');
        if (access_token !== null) {
            return access_token;
        }
    } catch (e) {
        console.log(e);
    }
};

export async function storeToken(value) {
    try {
        const access_token = await AsyncStorage.setItem('access-token', value);
        return;
    } catch (e) {
        console.log(e);
    }
};