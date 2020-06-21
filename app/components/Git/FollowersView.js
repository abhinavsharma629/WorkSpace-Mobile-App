import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage,
  Linking,
  Image,
  BackHandler,
  ScrollView,
  Modal,
  DrawerActions,
  RefreshControl,
  findNodeHandle
} from "react-native";
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";
import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors, TextInput } from "react-native-paper";
import { Button, Divider } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
import base64 from "react-native-base64";
import ViewMoreText from "react-native-view-more-text";
import { StackActions, NavigationActions, Actions } from "react-navigation";
import moment from "moment";
import { RootFolderData } from "./RootFolderData";
import Overlay from "react-native-modal-overlay";
import {
  ClassicHeader,
  AppleHeader,
  ModernHeader
} from "@freakycoder/react-native-header-view";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage
} from "react-native-material-cards";

export default class FollowersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      git_access_token: null,
      git_user: null,
      isLoading: true,
      currentUser: null,
      totalRepos: null,
      totalFollowers: null,
      totalFollowing: null,
      totalGists: null,
      totalOrganizations: null,
      totalSubs: null,
      modalVisible: false,
      activity_text: "Getting Your Followers",
      followers: null,
      refreshing:false,
      git_img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
    };
  }

  componentDidMount() {
    console.log("Component did mount of FollowersView");
    console.log(this.props.screenProps.git_access_token);
    this.setState({
      git_access_token: this.props.screenProps.git_access_token,
      git_user: this.props.screenProps.auth_login_name,
      git_img_url:this.props.screenProps.git_img_url
    });

    this.getFollowers(
      this.props.screenProps.git_access_token,
      this.props.screenProps.auth_login_name
    );
  }

  static navigationOptions = {
    drawerLabel: "Followers",
    drawerIcon: () => <Icon size={30} name="ios-people" />,
    tapToClose: "true"
  };

  getFollowers = async (git_access_token, user) => {
    console.log("https://api.github.com/users/" + user + "/followers");
    fetch("https://api.github.com/users/" + user + "/followers", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + git_access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.saveResponse(responseJson);
      });
  }

  _onRefresh = () =>{
    this.setState({refreshing:true})
    this.getFollowers(this.state.git_access_token, this.state.git_user)
  }

  saveResponse = responseJson => {
    this.setState({ refreshing:false, followers: responseJson, isLoading: false });
  };

  viewDetails = async (user) => {
    console.log("getting details");
    this.setState({ currentUser: user, modalVisible: true });

    // Fetch FollowersCount

    fetch("https://api.github.com/users/" + user + "/followers", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.git_access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ totalFollowers: responseJson.length });
      });

    //Following count
    fetch("https://api.github.com/users/" + user + "/following", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.git_access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ totalFollowing: responseJson.length });
      });

    //Gists Count

    fetch("https://api.github.com/users/" + user + "/gists", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.git_access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ totalGists: responseJson.length });
      });

    //Orgs Count
    fetch("https://api.github.com/users/" + user + "/orgs", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.git_access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ totalOrganizations: responseJson.length });
      });

    //Subscriptions
    fetch("https://api.github.com/users/" + user + "/subscriptions", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.git_access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ totalSubs: responseJson.length });
      });
  };

  onClose = () => {
    this.setState({
      modalVisible: false,
      totalSubs: null,
      totalGists: null,
      totalRepos: null,
      totalFollowers: null,
      totalFollowing: null,
      totalOrganizations: null
    });
  };

  onSwipeDown = () => {
    this.setState({
      modalVisible: false,
      totalSubs: null,
      totalGists: null,
      totalRepos: null,
      totalFollowers: null,
      totalFollowing: null,
      totalOrganizations: null
    });
  };

  onCompare (user) {
    this.setState({
      modalVisible: false,
      totalSubs: null,
      totalGists: null,
      totalRepos: null,
      totalFollowers: null,
      totalFollowing: null,
      totalOrganizations: null
    });
    console.log(user)

    this.props.navigation.navigate("ComparingProfileView", {
      comparison_user: user
    });
  };

  render() {
    const config = {
      velocityThreshold: 0.5,
      directionalOffsetThreshold: 80
    };

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Followers"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10
                  }}
                  source={{
                    uri:
                      this.state.git_img_url
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />

          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
            hidesWhenStopped
            color={Colors.blue800}
          />
          <Text
            style={{
              color: "blue",
              top: "42%",
              padding: 10,
              elevation: 5,
              textAlign: "center"
            }}
          >
            {this.state.activity_text}
          </Text>
        </View>
      );
    } else {
      let followers = this.state.followers.map(follower => {
        return (
          <View key={follower.login}>
            <Card
              style={{
                elevation: 15,
                borderRadius: 10,
                padding: 10,
                borderColor: "black",
                borderSize: 2,
                shadowOffset: 5,
                shadowColor: "black"
              }}
            >
              <CardImage
                source={{ uri: follower.avatar_url }}
                title={follower.login}
              />

              <CardTitle title={follower.login} subtitle={follower.html_url} />

              <View style={{ flexDirection: "row" }}>
                <Icon
                  size={20}
                  name="ios-git-branch"
                  style={{ marginLeft: 20, marginTop: 15 }}
                />

                <CardAction
                  seperator={true}
                  inColumn={false}
                  style={{ marginLeft: 10, marginTop: -1 }}
                >
                  <CardButton
                    onPress={() => {
                      this.viewDetails(follower.login);
                    }}
                    title="View"
                    color="blue"
                  />
                  <CardButton
                    onPress={() =>{this.onCompare(follower.login)}}
                    title="Compare"
                    color="blue"
                  />
                </CardAction>
              </View>
            </Card>
            <Text />
          </View>
        );
      });

      let follower = null;
      let following = null;
      let gist = null;
      let org = null;
      let subs = null;

      if (this.state.totalFollowers === null) {
        follower = (
          <ActivityIndicator
            animating={true}
            size="small"
            style={styles.loader}
            hidesWhenStopped
            color={Colors.blue800}
            style={{ marginLeft: 20 }}
          />
        );
      } else {
        follower = (
          <Text style={{ fontSize: 20, marginLeft: 20, fontWeight: "bold" }}>
            {this.state.totalFollowers}
          </Text>
        );
      }

      if (this.state.totalFollowing === null) {
        following = (
          <ActivityIndicator
            animating={true}
            size="small"
            style={styles.loader}
            hidesWhenStopped
            color={Colors.blue800}
            style={{ marginLeft: 20 }}
          />
        );
      } else {
        following = (
          <Text style={{ fontSize: 20, marginLeft: 20, fontWeight: "bold" }}>
            {this.state.totalFollowing}
          </Text>
        );
      }

      if (this.state.totalGists === null) {
        gist = (
          <ActivityIndicator
            animating={true}
            size="small"
            style={styles.loader}
            hidesWhenStopped
            color={Colors.blue800}
            style={{ marginLeft: 20 }}
          />
        );
      } else {
        gist = (
          <Text style={{ fontSize: 20, marginLeft: 20, fontWeight: "bold" }}>
            {this.state.totalGists}
          </Text>
        );
      }

      if (this.state.totalOrganizations === null) {
        org = (
          <ActivityIndicator
            animating={true}
            size="small"
            style={styles.loader}
            hidesWhenStopped
            color={Colors.blue800}
            style={{ marginLeft: 20 }}
          />
        );
      } else {
        org = (
          <Text style={{ fontSize: 20, marginLeft: 20, fontWeight: "bold" }}>
            {this.state.totalOrganizations}
          </Text>
        );
      }

      if (this.state.totalSubs === null) {
        subs = (
          <ActivityIndicator
            animating={true}
            size="small"
            style={styles.loader}
            hidesWhenStopped
            color={Colors.blue800}
            style={{ marginLeft: 20 }}
          />
        );
      } else {
        subs = (
          <Text style={{ fontSize: 20, marginLeft: 20, fontWeight: "bold" }}>
            {this.state.totalSubs}
          </Text>
        );
      }

      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Followers"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10
                  }}
                  source={{
                    uri:
                      this.state.git_img_url
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />

          <GestureRecognizer onSwipeDown={this.onSwipeDown} config={config}>
            <View style={{ flex: 1 }}>
              <Overlay
                visible={this.state.modalVisible}
                onClose={this.onClose}
                containerStyle={{
                  elevation: 15,
                  borderRadius: 20,
                  padding: 20,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  marginTop: 55,
                  backgroundColor: "#313340",
                  shadowColor: "black",
                  color: "#313340"
                }}
                closeOnTouchOutside
                animationType="fadeInUp"
              >
                <View>
                  <Card
                    style={{
                      marginTop: -25,
                      marginBottom: -25,

                      elevation: 15,
                      borderRadius: 10,
                      padding: 10,
                      borderColor: "black",
                      borderSize: 2,
                      shadowOffset: 5,
                      width: 380,

                      shadowColor: "black"
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <CardTitle
                        title={this.state.currentUser}
                        subtitle="You Can Now Compare Your Profiles With Your Friends!!"
                      />
                      <Icon
                        size={20}
                        name="md-git-compare"
                        style={{ marginRight: 20, marginTop: 22 }}
                      />
                    </View>
                    <Text />
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        marginLeft: 110,
                        marginTop: -10,
                        fontStyle: "italic"
                      }}
                    >
                      Details
                    </Text>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: 30,
                          marginTop: 20
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>Following:</Text>
                        {following}
                      </View>

                      <Divider
                        style={{
                          backgroundColor: "#CCCCCC",
                          height: 2,
                          marginTop: 5,
                          width: 300,
                          marginLeft: 20
                        }}
                        light={true}
                        orientation="center"
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: 30,
                          marginTop: 10
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>Followers:</Text>
                        {follower}
                      </View>

                      <Divider
                        style={{
                          backgroundColor: "#CCCCCC",
                          height: 2,
                          marginTop: 5,
                          width: 300,
                          marginLeft: 20
                        }}
                        light={true}
                        orientation="center"
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: 30,
                          marginTop: 10
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>Gists:</Text>
                        {gist}
                      </View>

                      <Divider
                        style={{
                          backgroundColor: "#CCCCCC",
                          height: 2,
                          marginTop: 5,
                          width: 300,
                          marginLeft: 20
                        }}
                        light={true}
                        orientation="center"
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: 30,
                          marginTop: 10
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>Organizations:</Text>
                        {org}
                      </View>

                      <Divider
                        style={{
                          backgroundColor: "#CCCCCC",
                          height: 2,
                          marginTop: 5,
                          width: 300,
                          marginLeft: 20
                        }}
                        light={true}
                        orientation="center"
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: 30,
                          marginTop: 10
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>Subscriptions:</Text>
                        {subs}
                      </View>
                    </View>
                    <CardAction
                      seperator={true}
                      inColumn={false}
                      style={{ marginLeft: 80, marginTop: 30 }}
                    >
                      <CardButton
                        onPress={this.onClose}
                        title="Close"
                        color="red"
                      />
                      <CardButton
                        onPress={() => {this.onCompare(this.state.currentUser)}}
                        title="Compare"
                        color="blue"
                      />
                    </CardAction>
                  </Card>
                </View>
              </Overlay>
            </View>
          </GestureRecognizer>
          <ScrollView

            refreshControl={
              <RefreshControl

                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
          <ScrollView>{followers}</ScrollView>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "40%"
  }
});
