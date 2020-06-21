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
export default class ShowPostWithCommentsSkeleton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postCount: [1, 2]
    };
  }

  render() {
    const comments = this.state.postCount.map(data => {
      return (
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
      );
    });
    let array = [];
    return (
      <View>
        <LoadingSkeleton postCount={array} />
        <Divider
          style={{ backgroundColor: "#CCCCCC", height: 1 }}
          light={true}
          orientation="center"
        />

        {comments}

        <View style={{ flexDirection: "row", bottom: -70 }}>
          <TextInput
            style={{ height: 40, width: "85%", marginLeft: 5, marginRight: 10 }}
            placeholder="Comment"
            mode="outlined"
            disabled
            value={""}
          />

          <View>
            <Icon
              size={30}
              name={"ios-paper-plane"}
              color="#0360FF"
              style={{ bottom: -10 }}
            />
          </View>
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
