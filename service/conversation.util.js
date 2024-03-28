import { getAccessToken } from "../screens/user-profile/getAccessToken";

export async function getAllConversation() {
    const accessToken = await getAccessToken();
    await fetch('http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken
        }
    }).then((response) => {
        return response.json()
    }).then((data) => {
        console.log(data);
        return data.data
    }).catch((err) => {
        console.log(err)
        return;
    })
}