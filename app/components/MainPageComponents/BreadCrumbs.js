/* @flow */

import React, { Component } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  KeyboardAwareView,
  TouchableHighlight,
  Image,
  Dimensions,
  Modal,
  SafeAreaView
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Breadcrumb from "react-native-breadcrumb";
import { Text, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Card, Divider, Overlay } from "react-native-elements";
import base64 from "react-native-base64";
import ShowGithubPostSkeleton from "./ShowGithubPostSkeleton";
import moment from "moment";
export default class BreadCrumb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumb: null
    };
  }
  componentDidMount() {
    this.setState({ breadcrumb: this.props.breadcrumb });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ breadcrumb: nextProps.breadcrumb });
  }
  render() {
    if (this.state.breadcrumb !== null) {
      var counter = 0;
      var breadData = this.state.breadcrumb.map(repo => {
        console.log(repo.name + " " + repo.path + " " + counter);
        counter += 1;
        //console.log(counter+" "+this.state.breadcrumb.length)
        if (counter === this.state.breadcrumb.length) {
          return (
            <View>
              <TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      borderRadius: 5,
                      height: 30,
                      borderColor: "black",
                      borderWidth: 1,
                      padding: 5,
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: 15,
                      fontStyle: "italic"
                    }}
                  >
                    {repo.name}
                  </Text>

                  <Text style={{ marginLeft: 5 }} />
                </View>
              </TouchableOpacity>
            </View>
          );
        } else {
          return (
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.props.showTree(repo.path);
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      borderRadius: 5,
                      height: 30,
                      borderColor: "black",
                      borderWidth: 1,
                      padding: 5,
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "blue"
                    }}
                  >
                    {repo.name}
                  </Text>
                  <Icon
                    size={25}
                    name="ios-arrow-forward"
                    style={{ marginLeft: 5, marginTop: 2 }}
                  />
                  <Text style={{ marginLeft: 5 }} />
                </View>
              </TouchableOpacity>
            </View>
          );
        }
      });

      return (
        <ScrollView style={{ flexDirection: "row" }} horizontal={true}>
          {breadData}
        </ScrollView>
      );
    } else {
      return <View style={styles.container} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
