import { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getConservations, getGroup } from "../../rtk/user-slice";
import { fetchAllGroup } from "../../service/conversation.util";

const BASE_URL = "http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555"

const SocketContext = createContext()

let socket = io(BASE_URL)
export const SocketProvider = ({ children }) => {
    const currentUser = useSelector(state => state.user.user);
    console.log(currentUser);
    const dispatch = useDispatch();
    useEffect(() => {

        // socket = io(BASE_URL)
        if (currentUser._id) {
            const { email, avatar, name, _id } = currentUser;

            socket.emit('user_connected', { userId: _id })

            //dispatch conservation
            dispatch(getConservations())
            console.log("get conservation");
            dispatch(getGroup())

        }
        return () => {
            // socket.disconnect()
        }

    }, [currentUser])
    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
    return useContext(SocketContext);
}