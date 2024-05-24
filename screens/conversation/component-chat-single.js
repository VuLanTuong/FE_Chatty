import React, { useState, useEffect, useCallback } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Pressable,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";


export default function ChatSingle(message) {
    console.log(message);
    const getTime = (updateAt) => {

        // console.log(typeof (updateAt));
        const date = new Date(updateAt);

        const hour = date.getHours();
        const minute = date.getMinutes();

        return `${hour}:${minute}`;
    }

    return (
        <KeyboardAvoidingView>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginVertical: 5,
                    marginHorizontal: 10,
                    justifyContent:
                        message.isMine == true ? "flex-end" : "flex-start",
                }}
            >
                {message.isMine == false && (
                    <Image
                        source={{ uri: message.avatar }}
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            marginRight: 5,
                        }}
                    />
                )}
                <View
                    style={{
                        backgroundColor:
                            message.isMine == true ? "#ffadd5" : "lightgray",
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        flexDirection: 'column',
                        gap: 5

                    }}
                >
                    <Text
                        style={{
                            fontSize: 17,
                        }}>{message.content}</Text>

                    <Text
                        style={{
                            fontSize: 12,
                        }}>{getTime(message.updatedAt)}</Text>


                </View>
                {message.isMine == true && (
                    <Image
                        source={{ uri: message.avatar }}
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            marginLeft: 5,
                        }}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    )
}