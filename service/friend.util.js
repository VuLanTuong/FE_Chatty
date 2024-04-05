import { getAccessToken } from "../screens/user-profile/getAccessToken";
import { useDispatch } from "react-redux"
export async function findFriendById(id) {
    try {
        const token = await getAccessToken();
        const response = await fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/users/${id}`, {
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

