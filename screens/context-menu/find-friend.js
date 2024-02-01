import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FindFriend = () => {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.prefixContainer}>
                    <Text style={styles.prefixText}>+84</Text>
                </View>
                <TextInput
                    mode='outlined'
                    placeholder='Enter phone number'
                    style={styles.input}
                />
            </View>
            <Pressable style={styles.searchButton}>
                <MaterialCommunityIcons name='magnify' color='black' size={25} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginLeft: 20
    },
    inputContainer: {
        flexDirection: 'row',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        height: 40,
        width: '70%',
        marginLeft: 10,
        marginTop: 40,
    },
    prefixContainer: {
        backgroundColor: '#c2c0bc',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    prefixText: {
        color: 'black',
    },
    input: {
        flex: 1,
        fontSize: 13,
        border: '0px'
    },
    searchButton: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderColor: '#c2c0bc',
        borderRadius: 20,
        backgroundColor: '#f5a4c6',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginLeft: 10,
    },
});

export default FindFriend;