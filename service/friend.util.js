import { getAccessToken } from "../screens/user-profile/getAccessToken";
import { useDispatch } from "react-redux"
export async function findFriendById(id) {
    const BASE_URL = "http://ec2-54-255-220-169.ap-southeast-1.compute.amazonaws.com:8555/api/v1"

    try {
        const token = await getAccessToken();
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        });

        if (response.status === 'fail') {
            console.log("fail");
            throw new Error(`fail to find frind with id: ${id}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}


