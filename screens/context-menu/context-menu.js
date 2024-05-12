import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function ContextMenu({ }) {
    const navigation = useNavigation();
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

    const handleMenuItemSelect = (value) => {
        console.log('Selected:', value);
        setIsContextMenuOpen(false);
    };

    const openContextMenu = () => {
        setIsContextMenuOpen(true);
    };

    console.log(navigation);
    return (
        <MenuProvider>
            <View>
                <Menu opened={isContextMenuOpen}
                    onBackdropPress={() => setIsContextMenuOpen(false)}
                >
                    <MenuTrigger onPress={openContextMenu}>
                        <MaterialCommunityIcons name="plus" color="white" size={25} style={{}} />
                    </MenuTrigger>
                    <MenuOptions customStyles={menuOptionsStyles}>
                        <MenuOption onSelect={() => handleMenuItemSelect('Option 1')}>
                            <Pressable onPress={() => {
                                setIsContextMenuOpen(false);
                                navigation.navigate('FindFriend')
                            }}>

                                <Text style={{
                                    marginTop: 5
                                }}>Add friend</Text>
                            </Pressable>
                        </MenuOption>
                        <MenuOption onSelect={() => handleMenuItemSelect('Option 2')}>
                            <Pressable onPress={() => {
                                setIsContextMenuOpen(false);
                                navigation.navigate('AddGroup')
                            }}>
                                <Text style={{
                                    marginTop: 5
                                }}>Create group</Text>
                            </Pressable>
                        </MenuOption>
                        <MenuOption onSelect={() => handleMenuItemSelect('Option 3')}>
                            <Pressable>
                                <Text style={{
                                    marginTop: 5
                                }}>Option 3</Text>
                            </Pressable>

                        </MenuOption>
                        <MenuOption onSelect={() => handleMenuItemSelect('Option 4')}>
                            <Text style={{
                                marginTop: 5
                            }}>Option 4</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => handleMenuItemSelect('Close')}>
                            {/* <MaterialCommunityIcons name="close" color="black" size={20} style={{ marginLeft: 95, marginTop: 15, marginRight: -20 }} /> */}
                            <Text style={{
                                fontWeight: 600,
                                marginTop: 5
                            }}>Close</Text>


                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        </MenuProvider>
    );
};

const menuOptionsStyles = {
    optionsContainer: {
        backgroundColor: 'white',
        height: 180,
        width: 150,
    },
};

const styles = StyleSheet.create({
    optionStyle: {
        color: 'white',
    },
});

// export default ContextMenu;