import React, { useState, useEffect, useCallback, useRef, useLayoutEffect, useContext } from "react";
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
    SafeAreaView,
    Animated, StyleSheet,
    Platform,
    Modal,
    Linking
} from "react-native";
import {
    AntDesign,
    Feather,
    MaterialCommunityIcons,
    Octicons,
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';;
import { useDispatch, useSelector } from "react-redux";
import { useScrollToTop } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import { io } from "socket.io-client";



export default function FileMessageComponent({ message }) {
    const user = useSelector((state) => state.user.user);
    const formatReplyText = (text) => {

        if (text.content.length > 20) {
            console.log(text.content.substring(0, 10) + "...");
            return text.content.substring(0, 10) + "...";
        }

        return text.content;
    }
    const getTime = (updateAt) => {
        const date = new Date(updateAt);
        const hour = date.getHours();
        const minute = date.getMinutes();

        return `${hour}:${minute}`;
    }

    const checkFileType = (url) => {
        const type = url.split('.').pop();
        if (type === 'doc' || type === 'docx') {
            return "docx"
        }
        else if (type === 'pdf') {
            return "pdf"
        }
        else if (type === 'ppt' || type === 'pptx') {
            return "ppt"
        }
        else if (type === 'xls' || type === 'xlsx') {
            return "xls"
        }
        else if (type === 'txt') {
            return "txt"
        }
        else if (type === 'zip') {
            return "zip"
        }
        else if (type === 'rar') {
            return "rar"
        }
        else if (type === 'jpg' || type === 'jpeg' || type === 'png' || type === 'gif') {
            return "image"
        }
        else {
            return "file"
        }
    }

    const checkFileName = (url) => {
        const name = url.split('/').pop();
        return name;
    }
    const renderAttachments = (message) => {
        return message.attachments.map((attachment, index) => {
            if (attachment.type === "application") {
                return (
                    <View key={index} style={styles.fileContainer}>
                        <View style={styles.fileDetailsContainer}>

                            <Text style={styles.fileName}>{checkFileName(attachment.url)}</Text>
                            <Text style={styles.fileSize}>{checkFileType(attachment.url)}</Text>
                            <Pressable onPress={() => Linking.openURL(attachment.url)} >
                                <Text>
                                    Open file
                                </Text>
                            </Pressable>
                            <Text
                                style={{
                                    fontSize: 10,
                                }}
                            >
                                {getTime(message.updatedAt)}
                            </Text>
                        </View>
                    </View>
                );
            }
            if (attachment.type === "image") {
                return (
                    <View style={{
                        flexDirection: "column",
                        marginTop: 5
                    }}>
                        <Image
                            key={index}
                            source={{ uri: attachment.url }}
                            style={styles.image}
                        />
                        <Text
                            style={{
                                fontSize: 10,
                            }}
                        >
                            {getTime(message.updatedAt)}
                        </Text>

                    </View>

                );
            }
        })
    }
    console.log(message);
    return (
        <View
            key={message._id}
            style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "flex-end",
                marginVertical: 5,
                marginHorizontal: 5,
                justifyContent: message.isMine ? "flex-end" : "flex-start",
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
                    backgroundColor: message.isMine ? "#ffadd5" : "lightgray",
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    flexDirection: "column",
                    gap: 5,
                }}
            >
                <Pressable
                    style={{
                        width: "80%",
                    }}
                // onPress={handlePressIcon}
                >

                    {message.parent !== null ? (
                        <View>
                            {message.parent.isMine == true ? (
                                <View style={{
                                    flexDirection: "column",
                                }}>
                                    <Text style={{
                                        fontWeight: 'bold'
                                    }}>Reply for message</Text>
                                    <View style={{
                                        flexDirection: 'row',

                                    }}>
                                        <Text>{user.name} : {formatReplyText(message.parent)}</Text>
                                    </View>
                                </View>

                            ) : (
                                <View style={{
                                    flexDirection: "column",
                                }}>
                                    <Text style={{
                                        fontWeight: 'bold'
                                    }}>Reply for message</Text>
                                    <View style={{
                                        flexDirection: 'row',

                                    }}>
                                        <Text>{message.parent.name} : {formatReplyText(message.parent)}</Text>


                                    </View>
                                </View>
                            )}
                        </View>
                    ) : (

                        renderAttachments(message)
                    )}



                </Pressable>
            </View>

            <View
            // style={{
            //     backgroundColor: message.isMine ? "#ffadd5" : "lightgray",
            //     borderRadius: 10,
            //     paddingHorizontal: 10,
            //     paddingVertical: 5,
            //     flexDirection: "column",
            //     gap: 5,
            // }}
            >
                <Pressable
                    style={{
                        width: "100%",
                    }}
                // onPress={handlePressIcon}
                >
                    {message.parent !== null && (
                        <View>
                            {message.parent.isMine == true ? (
                                <View style={{
                                    flexDirection: "column",
                                }}>
                                    <View style={{
                                        flexDirection: 'column',

                                    }}>
                                        <Text style={{
                                            fontWeight: 'bold'
                                        }}>Reply for message</Text>
                                        <Text>{user.name} : {formatReplyText(message.parent)}</Text>

                                        {renderAttachments(message)}
                                    </View>
                                </View>

                            ) : (
                                <View style={{
                                    flexDirection: "column",
                                }}>
                                    <View style={{
                                        flexDirection: 'column',

                                    }}>
                                        <Text style={{
                                            fontWeight: 'bold'
                                        }}>Reply for message</Text>
                                        <Text>{message.parent.name} : {formatReplyText(message.parent)}</Text>

                                        {/* {renderAttachments(message)} */}


                                    </View>
                                </View>
                            )}
                        </View>
                    )}


                </Pressable>
            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    fileContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginTop: 10,
    },
    fileIconContainer: {
        backgroundColor: "#e0e0e0",
        padding: 10,
        borderRadius: 10,
    },
    fileDetailsContainer: {
        marginLeft: 10,
        flexDirection: "column",
        backgroundColor: "#f9f9f9",
    },
    fileName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    fileSize: {
        fontSize: 14,
        color: "#a0a0a0",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
})