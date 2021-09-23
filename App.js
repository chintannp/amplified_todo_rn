import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Amplify from 'aws-amplify'
import awsconfig from './src/aws-exports'
import Home from './src/Home';

Amplify.configure(awsconfig)

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Home />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
