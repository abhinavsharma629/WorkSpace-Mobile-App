/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

export default class HomeScreenSideDrawer extends Component {
  render() {
    return (
      <View>
        <Icon size={25} name={"ios-home"} color="#FFFFFF" style={{marginLeft:15, marginBottom:20}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
