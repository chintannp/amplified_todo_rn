import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function Header() {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Todo App</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        position: "relative",
        top: 0,
        width: "100%",
        paddingVertical: 30,
        backgroundColor: '#4696ec',
    },
    headerTitle: {
        marginTop: 20,
        textAlign: "center",
        color: "white",
        fontSize: 24,
        fontWeight: "600"
    }
});
