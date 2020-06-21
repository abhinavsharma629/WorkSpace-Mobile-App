import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import ContentLoader from "react-native-content-loader";
import { Circle, Rect } from "react-native-svg";
import { Divider } from "react-native-elements";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class CommentSkeleton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postCount: [1,2,3,4]
    };
  }

  render() {
    const posts = this.state.postCount.map(data => {
      return (
        <View>
          <ContentLoader
            primaryColor="#e8f7ff"
            secondaryColor="#4dadf7"
            duration={700}
            height={110}
            width={wp('90%')}
          >
            <Circle cx="40" cy="40" r="25" />
            <Rect x="80" y="20" rx="4" ry="4" width={wp('90%')} height="70" />
            <Rect x="90" y="100" rx="4" ry="4" width={wp('90%')} height="10" />
          </ContentLoader>

          <Text />
        </View>
      );
    });

    return (
      <View>
        {posts}
        <View>
          <ContentLoader
            primaryColor="#e8f7ff"
            secondaryColor="#4dadf7"
            duration={700}
            height={110}
            width={500}
          >
            <Circle cx="40" cy="40" r="25" />
            <Rect x="80" y="20" rx="4" ry="4" width={wp('90%')} height="70" />
            <Rect x="90" y="100" rx="4" ry="4" width={wp('90%')} height="10" />
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
