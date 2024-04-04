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
    Animated
} from "react-native";
import {
    AntDesign,
    Feather,
    MaterialCommunityIcons,
    Octicons,
} from "@expo/vector-icons";
export default function HeaderChat({ animHeaderValue }) {
    const Header_Max_Height = 200;
    const Header_Min_Height = 70;

    const animateHeaderBackgroundColor = animHeaderValue.interpolate({
        inputRange: [0, Header_Max_Height - Header_Min_Height],
        outputRange: ['blue', 'red'],
        extrapolate: 'clamp'
    })

    const animateHeaderHeight = animHeaderValue.interpolate({
        inputRange: [0, Header_Max_Height - Header_Min_Height],
        outputRange: [Header_Max_Height, Header_Min_Height],
        extrapolate: 'clamp'
    })

    return (
        <Animated.View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: "#f558a4",
                borderBottomColor: "gray",
                borderBottomWidth: 0.2,
                height: animateHeaderHeight,
                backgroundColor: animateHeaderBackgroundColor
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate("MessageScreen")}
                    style={{ marginHorizontal: 15, marginLeft: 0 }}
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <View>
                        <View
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 4,
                                height: 10,
                                width: 10,
                                backgroundColor: "green",
                                borderRadius: 5,
                                zIndex: 1,
                                borderWidth: 999,
                                borderWidth: 2,
                                borderColor: "white",
                            }}
                        />
                        {/* <Image
                            source={{ uri: memeber1.avatar }}
                            resizeMode="contain"
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                            }}
                        /> */}
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        {/* <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            {memeber1.name}
                        </Text> */}
                        <Text style={{ color: "white" }}>Active now</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity style={{ marginHorizontal: 10 }}>
                    <Feather name="phone" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: 10 }}>
                    <Feather name="video" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: 10 }}>
                    <AntDesign name="profile" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}