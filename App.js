import React from 'react';
import { StyleSheet, SafeAreaView,StatusBar } from 'react-native';
import Amplify from 'aws-amplify'
import awsconfig from './src/aws-exports'
import Home from './src/Home';
import Header from './src/Header';

Amplify.configure(awsconfig)

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar  />
      <Header />
      <Home />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
