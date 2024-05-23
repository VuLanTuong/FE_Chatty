import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getAccessToken } from "../screens/user-profile/getAccessToken";
import { fetchAllGroup, getAllConversation } from "../service/conversation.util";
const initialState = {
    user: {
        _id: "", // The user's ID.
        name: "", // The user's name.
        email: "", // The user's email.
        dateOfBirth: "", // The user's date of birth.
        bio: "", // The user's bio.
        gender: "", // The user's gender.
        avatar: "", // The user's avatar image URL.
        background: "", // The user's background image URL.
        // An array of the user's friends.
    },
    friends: [],
    conversation: [],
    currentConversation: {},
    group: [],
    numberOfRequest: 0
};

export const getConservations = createAsyncThunk('conservation/getAll', async (values, { rejectWithValue }) => {

    try {
        const data = await getAllConversation();
        console.log(data);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})

export const getGroup = createAsyncThunk('group/getAll', async (values, { rejectWithValue }) => {

    try {
        const data = await fetchAllGroup();
        console.log(data);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }

})

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        login: (state, action) => {

            state.user = action.payload.user
            console.log(state.user);

        },
        setFriend: (state, action) => {
            console.log(action.payload);
            state.friends = action.payload.friends
        },
        changeAvatar: (state, action) => {

            state.user.avatar = action.payload.avatar
        },
        setAllConversation: (state, action) => {
            let temp = [];
            action.payload.forEach((element) => {
                const members = element.members;
                console.log("MEMBERSS:::::::", members);
                if (element.type === "group") {
                    let isUserInGroup = false;
                    members.forEach(member => {
                        if (member._id.toString() === state.user._id.toString()) isUserInGroup = true;
                    })
                    if (isUserInGroup) {
                        temp.push(element);
                    }
                }
                else {
                    temp.push(element);
                }
            });

            const sortedObjects = temp.sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });

            // Return a new state object with updated conversation array
            return {
                ...state,
                conversation: sortedObjects
            };
        },

        updateFriend: (state, action) => {
            console.log(action.payload);
            state.friends = [...state.friends, action.payload]
        },
        setCurrentConversation: (state, action) => {
            console.log("set current conv");
            console.log(action.payload);
            state.currentConversation = action.payload
        },
        updateConversation: (state, action) => {
            console.log(action.payload);
            state.conversation = [...state.conversation, action.payload]
        },
        setAllGroup: (state, action) => {
            console.log(action.payload);
            state.group = action.payload
        },
        setNumberOfRequest: (state, action) => {
            console.log(action.payload);
            state.numberOfRequest = action.payload
        }
    },
    extraReducers(builders) {
        builders.addCase(getConservations.fulfilled, (state, action) => {
            // console.log(action.payload);
            state.conversation = action.payload
        }),
            builders.addCase(getGroup.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.group = action.payload
            })
    }
})

export const { login, updated, add, deleteComment, setFriend, changeAvatar, setAllConversation, updateFriend, setCurrentConversation, updateConversation, setAllGroup, setNumberOfRequest } = userSlice.actions;
export default userSlice.reducer