import { getAccessToken } from "../screens/user-profile/getAccessToken";
import { useDispatch, useSelector } from "react-redux"
export async function findFriendById(id) {
    const BASE_URL = "http://ec2-13-212-80-57.ap-southeast-1.compute.amazonaws.com:8555/api/v1"

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

export async function fetchFriends() {
    console.log("fetch all friend");
    // use redux to get current user
    const accessToken = await getAccessToken();
    const response = await fetch(
        `${BASE_URL}/friends`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
        }
    )
    if (response.status === 'fail') {
        console.log("fail");
        throw new Error(`fail to fetch all friend`);
    }
    const data = await response.json();
    return data.data;

}

