import { useDispatch } from "react-redux";
import { getAccessToken } from "../screens/user-profile/getAccessToken";

export async function getAllConversation() {
    const BASE_URL = "http://ec2-54-255-220-169.ap-southeast-1.compute.amazonaws.com:8555/api/v1"

    try {
        const accessToken = await getAccessToken();
        const response = await fetch(`${BASE_URL}/conservations`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        });

        const data = await response.json();

        const temp = Object.values(data.data);

        const updatedConversations = temp.filter(cv => cv.lastMessage !== null || cv.type === 'group');
        return updatedConversations;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function fetchAllGroup() {
    const BASE_URL = "http://ec2-54-255-220-169.ap-southeast-1.compute.amazonaws.com:8555/api/v1"

    console.log("fetch all group");
    const accessToken = await getAccessToken();

    const response = await fetch(`${BASE_URL}/conservations?type=group`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        }
    })


    const data = await response.json();
    return data.data;

}

// await fetch('http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations', {
//     method: 'get',
//     headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + accessToken
//     }
// }).then((response) => {
//     return response.json()
// }).then((data) => {
//     const temp = Object.values(data.data);
//     const updatedConversations = temp.filter(cv => cv.lastMessage !== null);
//     console.log(updatedConversations);
//     return updatedConversations;
// })
//     .catch((err) => {
//         console.log(err)
//         return;
//     })
