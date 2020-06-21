import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TextInput,
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
  FlatList,
  DrawerActions,
  ProgressBarAndroid,
  RefreshControl,
  findNodeHandle
} from "react-native";

import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

import Drawer from "react-native-drawer";
import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Divider } from "react-native-elements";
import Overlay from "react-native-modal-overlay";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewMoreText from "react-native-view-more-text";
import { StackActions, NavigationActions, Actions } from "react-navigation";
import moment from "moment";
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
import Share from "react-native-share";
import LoadingSkeleton from "../MainPageComponents/LoadingSkeleton";
import Network from "../MainPageComponents/Network";
import HomeScreenSideDrawer from "../MainPageComponents/HomeScreenSideDrawer";
import HomeScreenSearch from "../MainPageComponents/HomeScreenSearch";
import HomeScreenNotifications from "../MainPageComponents/HomeScreenNotifications";

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      access_token: null,
      hasProfileData: false,
      user: "",
      img_url:
        "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
      closeInterval: 2000,
      access_token_error: null,
      sharedDetails: {},
      sharedNotes: [],
      likes: {},
      failedLoading: false,
      modalVisible: false,
      userStates: null,
      refreshing: false,
      curr_username: "",
      curr_lat: "",
      curr_long: "",
      full_name: "",
      occupation: "",
      total_friends: "",
      refreshingProfile: false
    };
  }

  componentDidMount() {
    console.log("Inside componentDidMount of MainProfilePage");
    console.log(this.props.screenProps.img_url);
    //this.setState({access_token:this.props.screenProps.access_token, user:this.props.screenProps.user, img_url:this.props.screenProps.img_url})
    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user
    });

    this.fetchPostData(this.props.screenProps.access_token);
    this.fetchProfile(this.props.screenProps.access_token);
  }

  fetchPostData(access_token) {
    console.log("fetching posts");
    // this._getCurrentAccessToken();
    this.receivedAccessToken(access_token);
  }

  async fetchProfile(access_token) {
    fetch("https://shielded-dusk-55059.herokuapp.com/user/profileShowDetails", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "200") {
          console.log(responseJson);
          this.setState({
            refreshingProfile: false,
            hasProfileData: true,
            curr_username: responseJson.username,
            full_name: responseJson.name,
            img_url:
              " https://shielded-dusk-55059.herokuapp.com" +
              responseJson.img_url,
            occupation: responseJson.occupation,
            curr_lat: responseJson.curr_lat,
            curr_long: responseJson.curr_long,
            total_friends: responseJson.total_friends.toString()
          });
        } else {
          console.log("error in fetching profile");
        }
      });
  }

  navigateToUser = user => {
    console.log("got " + user);
  }

  receivedAccessToken(access_token) {
    console.log("showing");

    if (this.state.access_token_error) {
      this.setState({ access_token: null, access_token_error: null });
      if (
        confirm("App Taking Too Long To Respond. Do you want to try again?")
      ) {
        this.fetchPostData();
      } else {
        console.log("ok error persists");
      }
    } else {
      console.log(access_token);
      fetch(
        "https://shielded-dusk-55059.herokuapp.com/shared/selfSharedNoteDetailsForNative",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token
          }
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status === "200") {
            var sharedDetails = JSON.parse(responseJson.sharedDetails);
            var likes = JSON.parse(responseJson.likedNotes);
            var sharedNotes = JSON.parse(responseJson.sharedNotes);

            //Making Operatable Data
            let newLikes = this.makeLikes(likes);
            let newsharedDetails = this.makeSharedDetails(sharedDetails);
            console.log("Got Post Data");
            this.setState({
              sharedDetails: newsharedDetails,
              sharedNotes: sharedNotes,
              likes: newLikes,
              isLoading: false,
              refreshing: false
            });
          } else {
            alert("Sorry Some Error Occured!!");
          }
        });
    }
  }

  makeLikes(likes) {
    var makeLike = {};
    console.log(likes.length);
    for (var i = 0; i < likes.length; i++) {
      makeLike[likes[i]["note_id"]] = likes[i];
    }
    console.log("Made Likes");
    console.log(Object.keys(makeLike));
    return makeLike;
  }

  makeSharedDetails(sharedDetails) {
    var makeSharedDetails = {};
    for (var i = 0; i < sharedDetails.length; i++) {
      makeSharedDetails[sharedDetails[i]["noteId"]] = sharedDetails[i];
    }
    return makeSharedDetails;
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.receivedAccessToken(this.state.access_token);
  };

  _onRefreshProfile = () => {
    this.setState({ refreshingProfile: true });
    this.fetchProfile(this.state.access_token);
  };

  updateView = noteId => {
    console.log("fetchin updating for" + " " + noteId);
    console.log(this.state.sharedNotes);
    var newsharedNotes = this.state.sharedNotes;
    for (var i = 0; i < newsharedNotes.length; i++) {
      if (newsharedNotes[i]["note_id"] === noteId) {
        console.log(Object.keys(newsharedNotes[i]["comments"]).length);
        newsharedNotes[i]["comments"][
          Object.keys(newsharedNotes[i]["comments"]).length
        ] = {
          comment: "abc"
        };
        console.log(Object.keys(newsharedNotes[i]["comments"]).length);
      }
    }
    this.setState({ sharedNotes: newsharedNotes });
  };

  toggleModalState = () => {
    var currState = this.state.modalVisible;
    this.setState({ modalVisible: !currState });
  };

  onClose = () => {
    this.setState({ modalVisible: false });
  };

  onSwipeDown = () => {
    this.setState({ modalVisible: false });
  };

  getProfileData = () => {
    if (this.state.hasProfileData) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshingProfile}
              onRefresh={this._onRefreshProfile}
            />
          }
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#bdbdbd",
              elevation: 20,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginLeft: 10,
                  marginTop: 15,
                  borderColor:'black',
                  borderWidth:1,
                  backgroundColor:'white'
                }}
                source={{
                  uri: this.state.img_url
                }}
              />
              <View
                style={{
                  flexDirection: "column",
                  marginLeft: 20,
                  marginTop: 20
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {this.state.full_name.substring(0, 15)}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.screenProps.rootNav.navigate("Login1", {
                        screenProps1: this.props.screenProps.rootNav
                      });
                    }}
                  >
                    <Icon
                      name="account-multiple-plus"
                      size={40}
                      style={{ marginLeft: 80, marginTop: -5 }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 10 }}>
                  <Icon name="bag-personal" size={20} />
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "bold",
                      fontStyle: "italic",
                      marginLeft: 10,
                      marginTop: -2
                    }}
                  >
                    {this.state.occupation}
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    fontStyle: "italic",
                    marginTop: 10
                  }}
                >
                  Friends - {this.state.total_friends}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                    flexWrap: "wrap",
                    marginBottom: 10
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#313340",
                      borderRadius: 5,
                      width: 100
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "#F2B035",
                        elevation: 5,
                        textAlign: "center"
                      }}
                    >
                      Latitude - {this.state.curr_lat}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#313340",
                      borderRadius: 5,
                      width: 100,
                      marginLeft: 10
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "#F2B035",
                        elevation: 5,
                        textAlign: "center"
                      }}
                    >
                      Longitude - {this.state.curr_long}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={true}
          color="#0476D9"
          style={[
            styles.loader,
            { marginLeft: 20, marginRight: 20, height: 20 }
          ]}
        />
      );
    }
  };

  static navigationOptions = {
    drawerLabel: "My Profile",
    drawerIcon: () => <Icon size={25} name="face-profile" />,
    tapToClose: "true"
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
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ScanScreen");
                }}
              >
                <Icon size={30} name="qrcode-scan" style={{ marginLeft: 12 }} />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 18, color: "#00b5ec", marginTop: 5 }}>
                  {this.state.user.substr(0, 25)}
                </Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="menu" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.3 }}>{this.getProfileData()}</View>
            <View style={{ flex: 0.7 }}>
              <ScrollView>
                <LoadingSkeleton />
              </ScrollView>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ScanScreen");
                }}
              >
                <Icon size={30} name="qrcode-scan" style={{ marginLeft: 12 }} />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 18, color: "#00b5ec", marginTop: 5 }}>
                  {this.state.user.substr(0, 25)}
                </Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="menu" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.3, backgroundColor:'white' }}>{this.getProfileData()}</View>
            <View style={{ flex: 0.7, marginTop: -10 }}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                <ScrollView>
                  <Network
                    updateView={this.updateView.bind(this)}
                    sharedDetails={this.state.sharedDetails}
                    sharedNotes={this.state.sharedNotes}
                    likes={this.state.likes}
                    access_token={this.state.access_token}
                    navigateToUser={this.navigateToUser}
                  />
                  <Text />
                  <Text />
                </ScrollView>
              </ScrollView>
            </View>
          </View>
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
