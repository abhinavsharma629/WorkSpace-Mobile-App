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
  Slider,
  Dimensions,
  RefreshControl,
  findNodeHandle
} from "react-native";
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
import { SearchBar } from "react-native-elements";

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      access_token: null,
      searchedResults: [],
      isLoading: true,
      currentDistance: 1,
      searchedText: "",
      slidingDistance: 1,
      newSentArray: {},
      newFriendArray: {},
      newReceivedArray: {},
      friendsArray: {},
      refreshing:false,
    };
  }

  componentDidMount() {
    console.log("component did mount of SearchScreen");
    // console.log(this.props.screenProps.access_token);
    this.setState({
      access_token: this.props.screenProps.access_token,
      currentDistance: this.props.screenProps.currentDistance,
      newSentArray: this.props.screenProps.newSentArray,
      newReceivedArray: this.props.screenProps.newReceivedArray,
      newFriendArray: this.props.screenProps.newFriendArray,
      friendsArray: this.props.screenProps.friendsArray,
      slidingDistance: this.props.screenProps.currentDistance
    });

    if (this.props.screenProps.currentDistance === 0) {
      console.log("got 0");
      this.fetchFriends(1, this.props.screenProps.access_token);
    } else {
      this.setState({ isLoading: false });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    console.log("Search Screen Received Props")
    console.log(nextProps.navigation.state)
    if('params' in nextProps.navigation.state &&  nextProps.navigation.state.params && 'update' in nextProps.navigation.state.params && nextProps.navigation.state.params.update===true){
      delete nextProps.navigation.state.params.update
      this.fetchFriends1();
    }
  }

  _onRefresh = () =>{
    this.setState({refreshing:true})
    this.fetchFriends1()
  }


  fetchFriends1 = () =>{
    console.log(this.state.access_token)
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/friends/friendRecommendation?distance=" +
        this.state.currentDistance,
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
      .then(response => {
        var friendsArray = JSON.parse(response.ext_user);
        var sentArray = JSON.parse(response.sent);
        var receivedArray = JSON.parse(response.received);
        var friends = JSON.parse(response.friend);

        var newSentArray = {};
        var newReceivedArray = {};
        var newFriendArray = {};

        for (var i = 0; i < sentArray.length; i++) {
          newSentArray[sentArray[i]["friends_name"]] = sentArray[i];
        }
        for (var i = 0; i < receivedArray.length; i++) {
          newReceivedArray[receivedArray[i]["username"]] = receivedArray[i];
        }
        for (var i = 0; i < friends.length; i++) {
          newFriendArray[friends[i]["username"]] = friends[i];
          newFriendArray[friends[i]["friends_name"]] = friends[i];
        }
        console.log(newSentArray);
        console.log(newReceivedArray);
        console.log(newFriendArray);
        console.log(friendsArray);

        this.setState({
          isLoading: false,
          refreshing:false,
          newSentArray: newSentArray,
          newReceivedArray: newReceivedArray,
          newFriendArray: newFriendArray,
          friendsArray: friendsArray
        });
        this.setFriends();
      });
  }

  fetchFriends = (distance, access_token) => {
    //console.log(access_token);
    this.setDistance(distance, access_token);
  };

  //Setting Friends Results in the parent component
  setFriends = () => {
    //console.log(this.state);
    this.props.screenProps.setResults(
      this.state.newFriendArray,
      this.state.newSentArray,
      this.state.newReceivedArray,
      this.state.currentDistance,
      this.state.friendsArray
    );
  };

  //Searching Friends
  searchFriend = searchedText => {
    this.setState({ searchedText });
  };

  //Setting Distance and fetching results and setting results in parent component also
  setDistance = (distance, access_token) => {
    //.log(distance);
    //console.log(this.state.access_token);

    distance = parseInt(distance);

    this.setState({
      currentDistance: parseInt(distance),
      slidingDistance: parseInt(distance),
      isLoading: true
    });

    fetch(
      "https://shielded-dusk-55059.herokuapp.com/friends/friendRecommendation?distance=" +
        distance,
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
      .then(response => {
        var friendsArray = JSON.parse(response.ext_user);
        var sentArray = JSON.parse(response.sent);
        var receivedArray = JSON.parse(response.received);
        var friends = JSON.parse(response.friend);

        var newSentArray = {};
        var newReceivedArray = {};
        var newFriendArray = {};

        for (var i = 0; i < sentArray.length; i++) {
          newSentArray[sentArray[i]["friends_name"]] = sentArray[i];
        }
        for (var i = 0; i < receivedArray.length; i++) {
          newReceivedArray[receivedArray[i]["username"]] = receivedArray[i];
        }
        for (var i = 0; i < friends.length; i++) {
          newFriendArray[friends[i]["username"]] = friends[i];
          newFriendArray[friends[i]["friends_name"]] = friends[i];
        }
        console.log(newSentArray);
        console.log(newReceivedArray);
        console.log(newFriendArray);
        console.log(friendsArray);

        this.setState({
          isLoading: false,
          newSentArray: newSentArray,
          newReceivedArray: newReceivedArray,
          newFriendArray: newFriendArray,
          friendsArray: friendsArray
        });
        this.setFriends();
      });
  };

  //Setting Sliding Distance
  setSlidingDistance = distance => {
    console.log(distance);
    this.setState({ slidingDistance: parseInt(distance) });
  };

  cancelRequest = user => {
    fetch("https://shielded-dusk-55059.herokuapp.com/friends/cancelRequest/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        username: user
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === "200") {
          var friend = this.state.newSentArray;
          console.log(friend);
          delete friend[user];
          this.setState({ newSentArray: friend });
          this.setFriends();
        }
      });
    console.log("Cancelling Request for" + " " + user);
  };

  rejectRequest = user => {
    fetch("https://shielded-dusk-55059.herokuapp.com/friends/cancelRequest/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        username: user
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === "200") {
          var friend = this.state.newReceivedArray;
          console.log(friend);
          delete friend[user];
          this.setState({ newReceivedArray: friend });
          this.setFriends();
        }
      });
    console.log("Rejecting Request of" + " " + user);
  };

  acceptRequest = user => {
    fetch("https://shielded-dusk-55059.herokuapp.com/friends/acceptFriend/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        username: user
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === "201") {
          var friend = this.state.newFriendArray;
          console.log(friend);
          var received = this.state.newReceivedArray;
          console.log(received);
          delete received[user];
          friend[user] = JSON.parse(responseJson.friend_fromed);
          console.log(friend);
          this.setState({ newFriendArray: friend, newReceivedArray: received });
          this.setFriends();
        }
      });

    console.log("Accepting Request of" + " " + user);
  };

  viewProfile = user => {
    console.log("Viewing Profile Of " + user);
  };

  unFriend = user => {
    fetch("https://shielded-dusk-55059.herokuapp.com/friends/removeFriend/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        username: user
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === "200") {
          var friend = this.state.newFriendArray;
          console.log(friend);
          delete friend[user];
          this.setState({ newFriendArray: friend });
          this.setFriends();
        }
      });
    console.log("Unfriending " + user);
  };

  addFriend = user => {
    fetch("https://shielded-dusk-55059.herokuapp.com/friends/createFriend/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        username: user,
        access: "ALL"
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === "200") {
          var friend = this.state.newSentArray;
          console.log(friend);
          friend[user] = JSON.parse(responseJson.friend_fromed);
          this.setState({ newSentArray: friend });
          this.setFriends();
        }
      });
    console.log("Adding friend " + user);
  };

  render() {
    if (this.state.isLoading) {
      console.log("content loading");
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Search"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Icon
                  size={30}
                  name="md-arrow-back"
                  style={{ marginLeft: 10, marginBottom: 20 }}
                />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ScannerScreen");
                }}
              >
                <Icon
                  size={30}
                  name={"md-qr-scanner"}
                  style={{
                    width: 35,
                    marginRight: 10,
                    marginBottom: 25
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
            centerComponent={
              <TouchableWithoutFeedback onPress={this.searchBarPress}>
                <View>
                  <SearchBar
                    placeholder="Search"
                    platform="ios"
                    value={this.state.searchedText}
                    onChangeText={searchedText => {
                      this.searchFriend(searchedText);
                    }}
                    containerStyle={{
                      marginBottom: 22,
                      height: 35,
                      backgroundColor: "transparent",
                      width: wp('80%')
                    }}
                    showCancel={false}
                  />
                </View>
              </TouchableWithoutFeedback>
            }
          />
          <View
            style={{
              marginLeft: Dimensions.get('window').width/3,
              width:wp('30%'),
              elevation: 5,
              marginTop: 5,
              backgroundColor: "#313340",
              borderRadius: 5
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                marginTop: 5,
                alignItems:'center',
                justifyContent:'center',
                marginLeft: 20,
                color: "#F2B035",
                elevation: 5
              }}
            >
              {this.state.slidingDistance} km/s
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                marginTop: 5,
                marginLeft: 10,
                elevation: 5
              }}
            >
              1
            </Text>
            <Slider
            style={{ width: wp('84%'), marginTop: 10 }}
            minimumValue={1}
            maximumValue={1000}
            value={this.state.slidingDistance}
            minimumTrackTintColor="#0DA66E"
            maximumTrackTintColor="#313340"
            onValueChange={data => {
              this.setSlidingDistance(data);
            }}
            onSlidingComplete={data => {
              this.setDistance(data, this.state.access_token);
            }}
            thumbTintColor="#313340"
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                marginTop: 8,
                elevation: 5
              }}
            >
              1000
            </Text>
          </View>

          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
            hidesWhenStopped
            color={Colors.blue800}
          />
        </View>
      );
    } else {
      var friendList = [];

      //
      // console.log(this.state.friendsArray);
      // console.log(this.state.newFriendArray);
      // console.log(this.state.newReceivedArray);
      // console.log(this.state.newSentArray);

      var received = [];

      for (var i in this.state.newReceivedArray) {
        var img =
          this.state.newReceivedArray[i]["profile_pic"] === null
            ? "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
            : "https://shielded-dusk-55059.herokuapp.com" +
              this.state.newReceivedArray[i]["profile_pic"];

        var date = moment(
          this.state.newReceivedArray[i]["formedAt"].split("+")[0]
        ).fromNow();
        console.log(date);
        received.push(
          <View style={{ flex: 1 }}>
            <Card
              style={{
                elevation: 5,
                borderRadius: 10,
                padding: 10,
                borderColor: "black",
                borderSize: 2,
                shadowOffset: 5,
                shadowColor: "black",
                backgroundColor: "#DCECF2"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    marginRight: 10
                  }}
                  source={{
                    uri: img
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        marginLeft: -8,
                        fontSize: 15,
                        fontWeight: "bold"
                      }}
                    >
                      {i}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "grey"
                    }}
                  >
                    sent you friend request {date}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 100,
                  marginTop: -20
                }}
              >
                <Button
                  icon={
                    <Icon
                      name="md-checkmark-circle-outline"
                      size={20}
                      color="white"
                    />
                  }
                  title="  Accept"
                  raised
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: "#0DA66E"
                  }}
                  onPress={this.acceptRequest.bind(this, i)}
                />

                <Button
                  icon={
                    <Icon
                      name="md-close-circle-outline"
                      size={20}
                      color="white"
                    />
                  }
                  title="  Reject"
                  raised
                  buttonStyle={{ borderRadius: 5, backgroundColor: "red" }}
                  containerStyle={{ marginLeft: 20 }}
                  onPress={this.rejectRequest.bind(this, i)}
                />
              </View>
            </Card>
          </View>
        );
      }

      console.log(received);

      for (var i = 0; i < this.state.friendsArray.length; i++) {
        console.log("getting img");
        console.log(this.state.friendsArray[i]["profilePhoto"]);
        var img =
          this.state.friendsArray[i]["profilePhoto"] !== null
            ? "https://shielded-dusk-55059.herokuapp.com" +
              this.state.friendsArray[i]["profilePhoto"]
            : "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg";

        if (
          Object.keys(this.state.newReceivedArray).length > 0 &&
          this.state.friendsArray[i]["username"] in this.state.newReceivedArray
        ) {
          // var date = moment(
          //   this.state.newReceivedArray[this.state.friendsArray[i]["username"]][
          //     "formedAt"
          //   ].split("+")[0]
          // ).fromNow();
          // console.log(date);
          // friendList.push(
          //   <View style={{ flex: 1 }}>
          //     <Card
          //       style={{
          //         elevation: 5,
          //         borderRadius: 10,
          //         padding: 10,
          //         borderColor: "black",
          //         borderSize: 2,
          //         shadowOffset: 5,
          //         shadowColor: "black",
          //         backgroundColor: "#DCECF2"
          //       }}
          //     >
          //       <View style={{ flexDirection: "row" }}>
          //         <Image
          //           style={{
          //             width: 80,
          //             height: 80,
          //             borderRadius: 40,
          //             marginRight: 10
          //           }}
          //           source={{
          //             uri: img
          //           }}
          //         />
          //         <View style={{ flexDirection: "column" }}>
          //           <View style={{ flexDirection: "row" }}>
          //             <Text
          //               style={{
          //                 marginLeft: -8,
          //                 fontSize: 15,
          //                 fontWeight: "bold"
          //               }}
          //             >
          //               {this.state.friendsArray[i]["username"]}
          //             </Text>
          //           </View>
          //           <Text
          //             style={{
          //               marginLeft: 5,
          //               fontSize: 15,
          //               fontWeight: "bold",
          //               color: "grey"
          //             }}
          //           >
          //             sent you friend request {date}
          //           </Text>
          //         </View>
          //       </View>
          //       <View
          //         style={{
          //           flexDirection: "row",
          //           marginLeft: 100,
          //           marginTop: -20
          //         }}
          //       >
          //         <Button
          //           icon={
          //             <Icon
          //               name="md-checkmark-circle-outline"
          //               size={20}
          //               color="white"
          //             />
          //           }
          //           title="  Accept"
          //           raised
          //           buttonStyle={{
          //             borderRadius: 5,
          //             backgroundColor: "#0DA66E"
          //           }}
          //           onPress={this.acceptRequest.bind(
          //             this,
          //             this.state.friendsArray[i]["username"]
          //           )}
          //         />
          //
          //         <Button
          //           icon={
          //             <Icon
          //               name="md-close-circle-outline"
          //               size={20}
          //               color="white"
          //             />
          //           }
          //           title="  Reject"
          //           raised
          //           buttonStyle={{ borderRadius: 5, backgroundColor: "red" }}
          //           containerStyle={{ marginLeft: 20 }}
          //           onPress={this.rejectRequest.bind(
          //             this,
          //             this.state.friendsArray[i]["username"]
          //           )}
          //         />
          //       </View>
          //     </Card>
          //   </View>
          // );
          console.log("skipped");
        } else if (
          Object.keys(this.state.newSentArray).length > 0 &&
          this.state.friendsArray[i]["username"] in this.state.newSentArray
        ) {
          var date = moment(
            this.state.newSentArray[this.state.friendsArray[i]["username"]][
              "formedAt"
            ].split("+")[0]
          ).fromNow();
          console.log(date);

          friendList.push(
            <View style={{ flex: 1 }}>
              <Card
                style={{
                  elevation: 5,
                  borderRadius: 10,
                  padding: 10,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  shadowColor: "black",
                  backgroundColor: "#DCECF2"
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      marginRight: 10
                    }}
                    source={{
                      uri:
                        "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
                    }}
                  />
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          marginLeft: -8,
                          fontSize: 15,
                          fontWeight: "bold"
                        }}
                      >
                        {this.state.friendsArray[i]["username"]}
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      you sent a friend request {date}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 100,
                    marginTop: -20
                  }}
                >
                  <Button
                    icon={<Icon name="md-eye" size={20} color="white" />}
                    title="  View"
                    raised
                    buttonStyle={{ borderRadius: 5 }}
                    onPress={this.viewProfile.bind(
                      this,
                      this.state.friendsArray[i]["username"]
                    )}
                  />

                  <Button
                    icon={
                      <Icon
                        name="md-close-circle-outline"
                        size={20}
                        color="white"
                      />
                    }
                    title="  Cancel"
                    raised
                    buttonStyle={{ borderRadius: 5, backgroundColor: "red" }}
                    containerStyle={{ marginLeft: 20 }}
                    onPress={this.cancelRequest.bind(
                      this,
                      this.state.friendsArray[i]["username"]
                    )}
                  />
                </View>
              </Card>
            </View>
          );
        } else if (
          Object.keys(this.state.newFriendArray).length > 0 &&
          this.state.friendsArray[i]["username"] in this.state.newFriendArray
        ) {
          var date = moment(
            this.state.newFriendArray[this.state.friendsArray[i]["username"]][
              "formedAt"
            ].split("+")[0]
          ).fromNow();
          console.log(date);
          friendList.push(
            <View style={{ flex: 1 }}>
              <Card
                style={{
                  elevation: 5,
                  borderRadius: 10,
                  padding: 10,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  shadowColor: "black",
                  backgroundColor: "#DCECF2"
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      marginRight: 10
                    }}
                    source={{
                      uri: img
                    }}
                  />
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          marginLeft: -8,
                          fontSize: 15,
                          fontWeight: "bold"
                        }}
                      >
                        {this.state.friendsArray[i]["username"]}
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      became friends {date}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 100,
                    marginTop: -20
                  }}
                >
                  <Button
                    icon={<Icon name="md-eye" size={20} color="white" />}
                    title="  View"
                    raised
                    buttonStyle={{ borderRadius: 5 }}
                    onPress={this.viewProfile.bind(
                      this,
                      this.state.friendsArray[i]["username"]
                    )}
                  />

                  <Button
                    icon={<Icon name="ios-close" size={20} color="white" />}
                    title="  UnFriend"
                    raised
                    buttonStyle={{
                      borderRadius: 5,
                      backgroundColor: "#313340"
                    }}
                    containerStyle={{ marginLeft: 20 }}
                    onPress={this.unFriend.bind(
                      this,
                      this.state.friendsArray[i]["username"]
                    )}
                  />
                </View>
              </Card>
            </View>
          );
        } else {
          console.log(this.state.friendsArray[i]["username"]);
          friendList.push(
            <View style={{ flex: 1 }}>
              <Card
                style={{
                  elevation: 5,
                  borderRadius: 10,
                  padding: 10,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  shadowColor: "black",
                  backgroundColor: "#DCECF2"
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      marginRight: 10
                    }}
                    source={{
                      uri: img
                    }}
                  />
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          marginLeft: -8,
                          fontSize: 15,
                          fontWeight: "bold"
                        }}
                      >
                        {this.state.friendsArray[i]["username"]}
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginLeft: 15,
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      send a friend request now
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 100,
                    marginTop: -20
                  }}
                >
                  <Button
                    icon={<Icon name="md-eye" size={20} color="white" />}
                    title="  View"
                    raised
                    buttonStyle={{ borderRadius: 5 }}
                    onPress={this.viewProfile.bind(
                      this,
                      this.state.friendsArray[i]["username"]
                    )}
                  />

                  <Button
                    icon={
                      <Icon name="ios-person-add" size={20} color="white" />
                    }
                    title="  Add Friend"
                    raised
                    buttonStyle={{ borderRadius: 5 }}
                    containerStyle={{ marginLeft: 20 }}
                    onPress={this.addFriend.bind(
                      this,
                      this.state.friendsArray[i]["username"]
                    )}
                  />
                </View>
              </Card>
            </View>
          );
        }
      }
      console.log(friendList);

      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Search"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Icon
                  size={30}
                  name="md-arrow-back"
                  style={{ marginLeft: 10, marginBottom: 20 }}
                />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ScannerScreen");
                }}
              >
                <Icon
                  size={30}
                  name={"md-qr-scanner"}
                  style={{
                    width: 35,
                    marginRight: 10,
                    marginBottom: 25
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
            centerComponent={
              <TouchableWithoutFeedback onPress={this.searchBarPress}>
                <View>
                  <SearchBar
                    placeholder="Search"
                    platform="ios"
                    value={this.state.searchedText}
                    onChangeText={searchedText => {
                      this.searchFriend(searchedText);
                    }}
                    containerStyle={{
                      marginBottom: 22,
                      height: 35,
                      backgroundColor: "transparent",
                      width: wp('80%')
                    }}
                    showCancel={false}
                  />
                </View>
              </TouchableWithoutFeedback>
            }
          />

          <View
            style={{
              marginLeft: Dimensions.get('window').width/3,
              width:wp('30%'),
              elevation: 5,
              marginTop: 5,
              backgroundColor: "#313340",
              borderRadius: 5
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                marginTop: 5,
                alignItems:'center',
                justifyContent:'center',
                marginLeft: 20,
                color: "#F2B035",
                elevation: 5
              }}
            >
              {this.state.slidingDistance} km/s
            </Text>
          </View>
          <ScrollView

            refreshControl={
              <RefreshControl

                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                marginTop: 8,
                marginLeft: 10,
                elevation: 5
              }}
            >
              1
            </Text>

            <Slider
              style={{ width: wp('84%'), marginTop: 10 }}
              minimumValue={1}
              maximumValue={1000}
              value={this.state.slidingDistance}
              minimumTrackTintColor="#0DA66E"
              maximumTrackTintColor="#313340"
              onValueChange={data => {
                this.setSlidingDistance(data);
              }}
              onSlidingComplete={data => {
                this.setDistance(data, this.state.access_token);
              }}
              thumbTintColor="#313340"
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                marginTop: 8,
                elevation: 5
              }}
            >
              1000
            </Text>
          </View>
          <Text />
          <View style={{ flex: 1 }}>

            <ScrollView>
              {received}
              {friendList}
            </ScrollView>
          </View>
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
