import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage,
  Linking,
  Image,
  TouchableHighlight,
  Modal,
  ScrollView,
  RefreshControl,
  BackHandler,
  ProgressBarAndroid
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { Header, Divider } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import ContentLoader from "react-native-content-loader";
import { Circle, Rect } from "react-native-svg";
import RNExitApp from "react-native-exit-app";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import {
  ClassicHeader,
  AppleHeader,
  ModernHeader
} from "@freakycoder/react-native-header-view";

import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";
// Self Made
import LoadingSkeleton from "./LoadingSkeleton";
import Network from "./Network";
import HomeScreenSideDrawer from "./HomeScreenSideDrawer";
import HomeScreenSearch from "./HomeScreenSearch";
import HomeScreenNotifications from "./HomeScreenNotifications";

export default class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      closeInterval: 2000,
      access_token: undefined,
      access_token_error: null,
      user: null,
      sharedDetails: {},
      sharedNotes: [],
      likes: {},
      failedLoading: false,
      modalVisible: false,
      img_url:
        "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
      userStates: null,
      refreshing: false,
      modalVisible1: false,
      curr_UserShow: "",
      curr_lat: "",
      curr_long: "",
      formedAt: "",
      fri_img_url: "",
      isFriend: true,
      mutualFriends: 2,
      name: "",
      occupation: "",
      total_friends: 5,
      total_notes: 1,
      ismodalLoading: true
    };
  }

  componentDidMount() {
    // BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.onBackButtonPressAndroid
    // );
    console.log("componentDidMount of HomeScreen");
    console.log(this.props.screenProps.img_url);
    //console.log(this.props.screenProps.access_token)
    this.setState({
      img_url: this.props.screenProps.img_url,
      access_token: this.props.screenProps.access_token,
      userStates: this.props.screenProps.userStates,
      user: this.props.screenProps.user
    });

    this.fetchPostData(this.props.screenProps.access_token);
  }

  searchBarPress = () => {
    console.log("search bar pressed");
    this.props.navigation.navigate("SearchScreen");
  };

  notificationsPress = () => {
    console.log("Notifications Press");
    this.props.navigation.navigate("NotificationsScreen");
  };

  navigateToUser = user => {
    console.log("got " + user);
    this.setState({ modalVisible1: true, curr_UserShow: user });
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/user/friendShowDetails?username=" +
        user,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "200") {
          console.log(responseJson);
          let data = responseJson;
          this.setState({
            ismodalLoading: false,
            curr_lat: data.curr_lat,
            curr_long: data.curr_long,
            formedAt: data.formedAt,
            fri_img_url:
              "https://shielded-dusk-55059.herokuapp.com" + data.img_url,
            isFriend: data.isFriend,
            mutualFriends: parseInt(data.mutual) + parseInt(data.mutual1),
            name: data.name,
            occupation: data.occupation,
            total_friends: data.total_friends,
            total_notes: data.total_notes,
            curr_UserShow: data.username
          });
        } else {
          console.log("error");
        }
      });
  };

  loadUserData = () => {
    console.log(this.state.curr_UserShow);
    console.log(this.state.access_token);
    if (this.state.ismodalLoading) {
      return (
        <View style={{ flex: 1 }}>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={true}
            color="#00b5ec"
            style={[
              styles.loader,
              { marginLeft: 20, marginRight: 20, height: 20 }
            ]}
          />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 0.5,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              backgroundColor: "#00b5ec"
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
                  borderColor: "black",
                  borderWidth: 1,
                  backgroundColor: "white"
                }}
                source={{
                  uri: this.state.fri_img_url
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
                    {this.state.name}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 10 }}>
                  <Icon name="md-briefcase" size={20} />
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
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Icon
                    name="md-git-network"
                    size={25}
                    style={{ marginTop: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      fontStyle: "italic",
                      marginTop: 10,
                      marginLeft: 10
                    }}
                  >
                    Friends - {this.state.total_friends}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Icon name="md-resize" size={25} style={{ marginTop: 10 }} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      fontStyle: "italic",
                      marginTop: 10,
                      marginLeft: 10
                    }}
                  >
                    Mutual Friends - {this.state.mutualFriends}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 40,
                    marginLeft: -30
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
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 50,
                    marginLeft: -20
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{ flex: 0.5, backgroundColor: "rgba(0,181,236, 0.5)" }}>
            <Text
              style={{
                marginTop: 95,
                marginLeft: 87,
                fontSize: 40,
                fontWeight: "bold",
                fontStyle: "italic",
                color: "#313340"
              }}
            >
              Profile Locked
            </Text>
            <Icon
              name="ios-lock"
              size={120}
              style={{
                marginTop: 55,
                marginLeft: 170,
                position: "absolute",
                color: "rgba(34,34,34, 0.5)"
              }}
            />
          </View>
        </View>
      );
    }
  };

  // onBackButtonPressAndroid() {
  //   RNExitApp.exitApp();
  // }

  fetchPostData(access_token) {
    console.log("fetching posts");
    // this._getCurrentAccessToken();
    this.receivedAccessToken(access_token);
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.receivedAccessToken(this.state.access_token);
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

  // _getCurrentAccessToken = async () => {
  //   try {
  //     let access_token = await AsyncStorage.getItem("access_token");
  //
  //     this.setState({ access_token: access_token, access_token_error: false });
  //     this.receivedAccessToken(access_token);
  //   } catch (error) {
  //     console.log("not set");
  //     this.setState({ access_token_error: true });
  //   }
  // };

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
        "https://shielded-dusk-55059.herokuapp.com/shared/noteDetailsForNative",
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

  switchAccount = user => {
    console.log(user);
    if (user === this.state.user) {
      this.setState({ modalVisible: false });
    } else {
      console.log(user);
      this.updateCurrentLoginState(user);
    }
  };

  async updateCurrentLoginState(user) {
    let currentUserData = {
      user: user,
      access_token: this.state.userStates[user]["access_token"],
      refresh_token: this.state.userStates[user]["refresh_token"],
      img_url: this.state.userStates[user]["img_url"]
    };

    AsyncStorage.setItem("user", user);
    AsyncStorage.setItem(
      "access_token",
      this.state.userStates[user]["access_token"]
    );
    AsyncStorage.setItem(
      "refresh_token",
      this.state.userStates[user]["refresh_token"]
    );
    AsyncStorage.setItem("img_url", this.state.userStates[user]["img_url"]);

    AsyncStorage.setItem("currentLoggedUser", JSON.stringify(currentUserData));

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "MainPage",
          params: {
            access_token: this.state.userStates[user]["access_token"],
            refresh_token: this.state.userStates[user]["refresh_token"],
            user: this.state.userStates[user]["user"],
            img_url: this.state.userStates[user]["img_url"],
            userStates: this.state.userStates
          }
        })
      ]
    });

    this.props.screenProps.rootNav.dispatch(resetAction);
  }

  logout = user => {
    console.log(user + " " + this.state.user);
    if (user !== this.state.user) {
      this.setState({ modalVisible: false });
      this.otherUserLogout(user);
    } else {
      console.log("current user");
      this.currentUserLogout(user);
    }
  };

  async otherUserLogout(user) {
    const userStates1 = await AsyncStorage.getItem("userStates");
    let userStates2 = JSON.parse(userStates1);

    delete userStates2[user];
    AsyncStorage.setItem("userStates", JSON.stringify(userStates2));

    const us = await AsyncStorage.getItem("userStates");
    this.props.screenProps.setUserState(userStates2);
    this.setState({ userStates: userStates2 });
    console.log(JSON.parse(us));
  }

  async currentUserLogout(user) {
    const userStates = await AsyncStorage.getItem("userStates");

    let userStates1 = JSON.parse(userStates);

    console.log(Object.keys(userStates1));

    let noOfUsers = Object.keys(userStates1).length;

    if (noOfUsers == 1) {
      console.log("clearing storage");

      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("img_url");

      const df = await AsyncStorage.getItem("user");
      console.log(df);
      RNExitApp.exitApp();
    } else if (noOfUsers > 1) {
      let currentUserData = {};

      delete userStates1[user];
      console.log(userStates1);
      AsyncStorage.setItem("userStates", JSON.stringify(userStates1));
      for (let us1 in userStates1) {
        currentUserData = {
          user: userStates1[us1]["user"],
          access_token: userStates1[us1]["access_token"],
          refresh_token: userStates1[us1]["refresh_token"],
          img_url: userStates1[us1]["img_url"]
        };
        break;
      }

      AsyncStorage.setItem(
        "currentLoggedUser",
        JSON.stringify(currentUserData)
      );

      AsyncStorage.setItem("user", currentUserData["user"]);
      AsyncStorage.setItem("access_token", currentUserData["access_token"]);
      AsyncStorage.setItem("refresh_token", currentUserData["refresh_token"]);
      AsyncStorage.setItem("img_url", currentUserData["img_url"]);

      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "MainPage",
            params: {
              access_token: currentUserData["access_token"],
              refresh_token: currentUserData["refresh_token"],
              user: currentUserData["user"],
              img_url: currentUserData["img_url"],
              userStates: userStates1
            }
          })
        ]
      });

      this.props.screenProps.rootNav.dispatch(resetAction);

      console.log("transferring account");
    } else {
      RNExitApp.exitApp();
    }
  }

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

  render() {
    const config = {
      velocityThreshold: 0.5,
      directionalOffsetThreshold: 80
    };
    console.log(this.state.isLoading);
    if (this.state.isLoading) {
      return (
        <View>
          <ClassicHeader
            headerTitle="Comparison"
            leftComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 37,
                    height: 37,
                    borderRadius: 25,
                    marginLeft: 10,
                    marginBottom: 20,
                    borderColor: "black",
                    borderWidth: 1,
                    backgroundColor: "white"
                  }}
                  source={{
                    uri: this.state.img_url
                  }}
                />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={this.notificationsPress}>
                <Icon
                  size={30}
                  name={"ios-notifications-outline"}
                  color="white"
                  style={{ marginRight: 10, marginBottom: 23 }}
                />
              </TouchableOpacity>
            }
            centerComponent={
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
                      backgroundColor: "transparent",
                      width: 280
                    }}
                    showCancel={false}
                  />
                </View>
              </TouchableWithoutFeedback>
            }
            height={55}
            backgroundColor="#0360FF"
            statusBarHidden={true}
          />
          <Modal
            animationType={"slide"}
            visible={this.state.modalVisible1}
            onRequestClose={() => {
              this.setState({ modalVisible1: false });
            }}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalVisible1: false });
                  }}
                >
                  <Icon
                    name="ios-close"
                    size={40}
                    style={{ marginLeft: 10, marginTop: 5 }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    marginTop: 10,
                    marginLeft: 70,
                    flexWrap: "wrap",
                    fontSize: 20,
                    fontStyle: "italic",
                    fontWeight: "bold",
                    color: "blue"
                  }}
                >
                  {this.state.curr_UserShow}
                </Text>
              </View>
              <View style={{ flex: 1, marginTop: 5 }}>
                {this.loadUserData()}
              </View>
            </View>
          </Modal>

          <ScrollView>
            <LoadingSkeleton />
          </ScrollView>
        </View>
      );
    } else {
      console.log("re rendering  network view");

      var usersList = [];
      var c = 0;
      var count = 0;

      for (let j in this.state.userStates) {
        count += 1;
      }
      console.log(c + " " + count);
      for (let k in this.state.userStates) {
        c += 1;

        let img_url = this.state.userStates[k]["img_url"]
          ? "https://shielded-dusk-55059.herokuapp.com" +
            this.state.userStates[k]["img_url"]
          : "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg";

        console.log(k);
        if (c < count) {
          console.log("less");
          usersList.push(
            <View key={k}>
              <TouchableOpacity onPress={() => this.goTo(k)}>
                <View style={{ flexDirection: "row", elevation: 5 }}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginLeft: 20,
                      marginTop: 10,
                      borderColor: "black",
                      borderWidth: 1,
                      backgroundColor: "white"
                    }}
                    source={{
                      uri: img_url
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 20,
                      marginTop: 23,
                      fontSize: 17,
                      fontWeight: "bold",
                      fontFamily: "Roboto"
                    }}
                  >
                    {k}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", marginLeft: 80 }}>
                <Button
                  icon={<Icon name="ios-switch" size={20} color="black" />}
                  title="  Switch"
                  raised
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: "#F2B035"
                  }}
                  containerStyle={{ marginLeft: 10 }}
                  titleStyle={{ color: "black" }}
                  onPress={this.switchAccount.bind(this, k)}
                />
                <Button
                  icon={<Icon name="md-log-out" size={20} color="white" />}
                  title="  Logout"
                  raised
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: "#313340"
                  }}
                  containerStyle={{ marginLeft: 20 }}
                  onPress={this.logout.bind(this, k)}
                />
              </View>
              <Divider
                style={{ backgroundColor: "white", height: 2, marginTop: 15 }}
                light={true}
                orientation="center"
              />
            </View>
          );
        } else {
          console.log("equal");
          usersList.push(
            <View key={k}>
              <TouchableOpacity onPress={() => this.goTo(k)}>
                <View style={{ flexDirection: "row", elevation: 5 }}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginLeft: 20,
                      marginTop: 10,
                      borderColor: "black",
                      borderWidth: 1,
                      backgroundColor: "white"
                    }}
                    source={{
                      uri: img_url
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 20,
                      marginTop: 23,
                      fontSize: 17,
                      fontWeight: "bold",
                      fontFamily: "Roboto"
                    }}
                  >
                    {k}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", marginLeft: 80 }}>
                <Button
                  icon={<Icon name="ios-switch" size={20} color="black" />}
                  title="  Switch"
                  raised
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: "#F2B035"
                  }}
                  containerStyle={{ marginLeft: 10 }}
                  titleStyle={{ color: "black" }}
                  onPress={this.switchAccount.bind(this, k)}
                />
                <Button
                  icon={<Icon name="md-log-out" size={20} color="white" />}
                  title="  Logout"
                  raised
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: "#313340"
                  }}
                  containerStyle={{ marginLeft: 20 }}
                  onPress={this.logout.bind(this, k)}
                />
              </View>
            </View>
          );
        }
      }

      console.log(usersList);

      return (
        <View style={{ flex: 1 }}>
          <ClassicHeader
            headerTitle="Comparison"
            leftComponent={
              <TouchableOpacity
                onLongPress={() => {
                  this.toggleModalState();
                }}
              >
                <Image
                  style={{
                    width: 37,
                    height: 37,
                    borderRadius: 25,
                    marginLeft: 10,
                    marginBottom: 20,
                    borderColor: "black",
                    borderWidth: 1,
                    backgroundColor: "white"
                  }}
                  source={{
                    uri: this.state.img_url
                  }}
                />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={this.notificationsPress}>
                <Icon
                  size={30}
                  name={"ios-notifications-outline"}
                  color="white"
                  style={{ marginRight: 10, marginBottom: 23 }}
                />
              </TouchableOpacity>
            }
            centerComponent={
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
                      backgroundColor: "transparent",
                      width: 280
                    }}
                    showCancel={false}
                  />
                </View>
              </TouchableWithoutFeedback>
            }
            height={55}
            backgroundColor="#0360FF"
            statusBarHidden={true}
          />
          <GestureRecognizer
            onSwipeDown={this.onSwipeDown}
            onSwipeUp={this.onSwipeDown}
            config={config}
          >
            <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setState({ modalVisible: false });
              }}
            >
              <View style={{ flex: 1 }}>
                <ScrollView
                  style={{
                    width: "100%",
                    padding: 20,
                    borderRadius: 20,
                    elevation: 10,
                    shadowOffset: "black",
                    shadowColor: "black",
                    marginBottom: -15,
                    marginTop: 200,
                    backgroundColor: "#00b5ec"
                  }}
                >
                  <View>
                    <Divider
                      style={{
                        backgroundColor: "white",
                        height: 5,
                        borderRadius: 10,
                        marginTop: 0,
                        width: 50,
                        marginLeft: 150
                      }}
                      light={true}
                      orientation="center"
                    />
                    <Text
                      style={{
                        marginLeft: 130,
                        fontSize: 18,
                        marginTop: 10,
                        fontWeight: "bold",
                        fontFamily: "Roboto",
                        fontStyle: "italic"
                      }}
                    >
                      Switch User
                    </Text>
                    {usersList}
                    <Text />
                    <Text />
                  </View>
                </ScrollView>
              </View>
            </Modal>
          </GestureRecognizer>

          <Modal
            animationType={"slide"}
            visible={this.state.modalVisible1}
            onRequestClose={() => {
              this.setState({ modalVisible1: false });
            }}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible1: false });
                }}
              >
                <Icon
                  name="ios-close"
                  size={35}
                  style={{ marginTop: 10, marginLeft: 10 }}
                />
              </TouchableOpacity>
              <View style={{ flex: 1, marginTop: 10 }}>
                {this.loadUserData()}
              </View>
            </View>
          </Modal>

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
                navigateToUser={this.navigateToUser}
                likes={this.state.likes}
                access_token={this.state.access_token}
              />
              <Text />
              <Text />
              <Text />
            </ScrollView>
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
