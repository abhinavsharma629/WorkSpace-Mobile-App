import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import ContentLoader from "react-native-content-loader";
import { Circle, Rect } from "react-native-svg";
import { Divider } from "react-native-elements";

export default class LoadingSkeleton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postCount: [1]
    };
  }

  componentDidMount(){
    if('postCount' in this.props){
      this.setState({postCount:this.props.postCount})
    }
  }

  render() {
    const posts = this.state.postCount.map(data => {
      return (
        <View>
          <ContentLoader
            primaryColor="#e8f7ff"
            secondaryColor="#4dadf7"
            duration={700}
            height={280}
            width={500}
          >
            <Circle cx="60" cy="40" r="35" />
            <Rect x="110" y="17" rx="4" ry="4" width="200" height="15" />
            <Rect x="120" y="40" rx="3" ry="3" width="100" height="10" />

            <Rect x="30" y="85" rx="4" ry="4" width="200" height="15" />

            <Rect x="30" y="120" rx="5" ry="5" width="150" height="100" />
            <Rect x="200" y="130" rx="5" ry="5" width="200" height="40" />
            <Rect x="200" y="180" rx="3" ry="3" width="200" height="15" />

            <Rect x="30" y="232" rx="3" ry="3" width="100" height="15" />
            <Rect x="150" y="232" rx="3" ry="3" width="100" height="15" />
          </ContentLoader>
          <Divider
            style={{ backgroundColor: "#CCCCCC", height: 4 }}
            light={true}
            orientation="center"
          />
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
            height={280}
            width={500}
          >
            <Circle cx="60" cy="40" r="35" />
            <Rect x="110" y="17" rx="4" ry="4" width="200" height="15" />
            <Rect x="120" y="40" rx="3" ry="3" width="100" height="10" />

            <Rect x="30" y="85" rx="4" ry="4" width="200" height="15" />

            <Rect x="30" y="120" rx="5" ry="5" width="150" height="100" />
            <Rect x="200" y="130" rx="5" ry="5" width="200" height="40" />
            <Rect x="200" y="180" rx="3" ry="3" width="200" height="15" />

            <Rect x="30" y="232" rx="3" ry="3" width="100" height="15" />
            <Rect x="150" y="232" rx="3" ry="3" width="100" height="15" />
          </ContentLoader>
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
