import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    status: "", // The status of the response.
    message: "", // A message related to the response.
    data: {
        token: {
            access_token: "", // The access token for authentication.
            refresh_token: "", // The refresh token for authentication.
        },
        user: {
            _id: "", // The user's ID.
            name: "", // The user's name.
            email: "", // The user's email.
            phone: "", // The user's phone number.
            dateOfBirth: "", // The user's date of birth.
            bio: "", // The user's bio.
            gender: "", // The user's gender.
            avatar: "", // The user's avatar image URL.
            background: "", // The user's background image URL.
            friends: [], // An array of the user's friends.
        },
    },
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = action.payload.status
            state.message = action.payload.message
            state.data = action.payload.data
            // console.log(state.data.user);

        },
        // updated: (state, action) => {
        //     const commentIndx = state.comment.findIndex(comment =>
        //         comment.id === action.payload.commentId)
        //     if (commentIndx) {
        //         state.comment[commentIndx].content = action
        //             .payload.content
        //     }
        // },
        // add: (state, action) => {
        //     const allId = state.comment.map(value => value.id)
        //     const maxId = Math.max(...allId)
        //     const id = maxId + 1;
        //     const content = action.payload.newComment
        //     const newComment = { id, content }
        //     const newArray = [...state.comment, newComment]
        //     state.comment = [...newArray]
        // },
        // deleteComment: (state, action) => {
        //     state.comment = state.comment.filter(comment =>
        //         comment.id !== action.payload)
        // }
    }
})

export const { login, updated, add, deleteComment } = userSlice.actions;
export default userSlice.reducer