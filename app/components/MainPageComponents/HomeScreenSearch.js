/* @flow */

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";

export default class HomeScreenSearch extends Component {
  searchBarPress() {
    console.log("search bar pressed");
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.searchBarPress}>
        <View>
          <SearchBar
            placeholder="Search"
            platform="ios"
            value={1}
            disabled
            clearIcon=<Icon size={25} name={"ios-barcode"} />
            containerStyle={{

              marginBottom: 22,
              height: 35,
              backgroundColor:'transparent',
              width:300
            }}
            showCancel={false}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
