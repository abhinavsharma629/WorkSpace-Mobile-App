/* @flow */

import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class HomeScreenNotifications extends Component {
  notificationsPress() {
    console.log("Notifications Press");
  }

  render() {
    return (
      <TouchableOpacity onPress={this.notificationsPress}>
        <Icon
          size={30}
          name={"ios-notifications-outline"}
          color="white"
          style={{ marginRight: 15, marginBottom: 23 }}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
