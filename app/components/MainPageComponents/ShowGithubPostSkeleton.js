import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import ContentLoader from "react-native-content-loader";
import { Circle, Rect } from "react-native-svg";
import { Divider } from "react-native-elements";
import { TextInput } from "react-native-paper";
import LoadingSkeleton from "./LoadingSkeleton";
import Icon from "react-native-vector-icons/Ionicons";
export default class ShowGithubPostSkeleton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postCount: [1, 2]
    };
  }

  render() {

    return (
      <View>
      <ContentLoader
        primaryColor="#e8f7ff"
        secondaryColor="#4dadf7"
        duration={700}
        height={500}
        width={500}
      >
        <Circle cx="60" cy="40" r="35" />
        <Rect x="110" y="17" rx="4" ry="4" width="200" height="15" />
        <Rect x="120" y="40" rx="3" ry="3" width="100" height="10" />

        <Rect x="30" y="85" rx="4" ry="4" width="200" height="15" />

        <Rect x="20" y="125" rx="4" ry="4" width="350" height="30" />


        <Rect x="20" y="180" rx="5" ry="5" width="300" height="40" />
        <Rect x="330" y="185" rx="3" ry="3" width="60" height="30" />

        <Rect x="20" y="240" rx="5" ry="5" width="300" height="40" />
        <Rect x="330" y="245" rx="3" ry="3" width="60" height="30" />

        <Rect x="20" y="300" rx="5" ry="5" width="300" height="40" />
        <Rect x="330" y="305" rx="3" ry="3" width="60" height="30" />

        <Rect x="20" y="360" rx="5" ry="5" width="300" height="40" />
        <Rect x="330" y="365" rx="3" ry="3" width="60" height="30" />

        <Rect x="20" y="420" rx="5" ry="5" width="300" height="40" />
        <Rect x="330" y="425" rx="3" ry="3" width="60" height="30" />


      </ContentLoader>
      <Divider
        style={{ backgroundColor: "#CCCCCC", height: 1 }}
        light={true}
        orientation="center"
      />
      <View>
        <ContentLoader
          primaryColor="#e8f7ff"
          secondaryColor="#4dadf7"
          duration={700}
          height={110}
          width={500}
        >
          <Circle cx="40" cy="40" r="25" />
          <Rect x="80" y="20" rx="4" ry="4" width="300" height="70" />
          <Rect x="90" y="100" rx="4" ry="4" width="40" height="10" />
        </ContentLoader>

        <Text />
      </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
