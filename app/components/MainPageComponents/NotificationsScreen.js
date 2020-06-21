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

export default class NotificationsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      access_token: null,
      notifications: null,
      isLoading: true
    };
  }

  componentDidMount() {
    console.log("component did mount of NotificationsScreen.js");
    console.log(this.props.screenProps.access_token);
    this.setState({
      access_token: this.props.screenProps.access_token,
    });
    this.fetchNotif(this.props.screenProps.access_token);
    //   if(this.state.notifications===null){
    //     console.log("null")
    //   this.fetchNotif(this.props.screenProps.access_token);
    //   // setInterval(() => {this.fetchNotif(this.props.screenProps.access_token)}, 10000);
    // }
    // else{
    //   this.setState({loading:false})
    // }
  }

  fetchNotif(access_token) {
    fetch("https://shielded-dusk-55059.herokuapp.com/notif/notification", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        var notif = JSON.parse(responseJson.notifications);
        //console.log(notif)
        this.setNotif(notif);
      });
  }

  setNotif = notif => {
    this.setState({ notifications: notif, isLoading: false });
    // this.props.screenProps.showNotifs(notif)
  };

  clearNotifs = () => {
    fetch("https://shielded-dusk-55059.herokuapp.com/notif/markAsRead", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.state.access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "201") {
          console.log("ok marked all as read notifs");
          this.setState({ notifications: null, isLoading: true });
        } else {
          console.log("Some Error Occured");
        }
      });
    console.log("oki");
    this.props.navigation.goBack();
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
            headerTitle="Notifications"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Icon
                  size={30}
                  name="md-arrow-back"
                  style={{ marginLeft: 10 }}
                />
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
                      "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
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
        </View>
      );
    } else {
      let notifs = this.state.notifications.map(notif => {
        return (
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
                    width: 40,
                    height: 40,
                    borderRadius: 25,
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
                        marginLeft: 10,
                        fontSize: 15,
                        fontWeight: "bold"
                      }}
                    >
                      {notif.fromUser}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 100,
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      {
                        notif.notification.split(" ")[
                          notif.notification.split(" ").length - 3
                        ]
                      }
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Icon
                      size={20}
                      name="ios-globe"
                      style={{ marginLeft: 20 }}
                    />
                    <Text
                      style={{
                        marginLeft: 15,
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      {moment(notif.date).fromNow()}
                    </Text>
                  </View>
                </View>
              </View>
              <CardContent
                text={notif.notification}
                style={{ marginTop: 10, marginLeft: 40 }}
              />
            </Card>
          </View>
        );
      });

      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Notifications"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Icon
                  size={30}
                  name="md-arrow-back"
                  style={{ marginLeft: 10 }}
                />
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
                      "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />

          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.9 }}>
              <ScrollView>{notifs}</ScrollView>
            </View>
            <View style={{ flex: 0.1 }}>
              <TouchableOpacity
                onPress={() => {
                  this.clearNotifs();
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: "blue",
                    marginLeft: 140,
                    marginTop: 30
                  }}
                >
                  Mark All As Read
                </Text>
              </TouchableOpacity>
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
