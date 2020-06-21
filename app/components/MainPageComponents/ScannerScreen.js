import React, { Component } from "react";
import QRCode from "react-native-qrcode-svg";
// import QRCode from 'react-native-qrcode';
import DeviceBrightness from "react-native-device-brightness";
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
  Dimensions,
  ScrollView,
  Modal,
  DrawerActions,
  findNodeHandle
} from "react-native";

import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Divider } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
import ViewMoreText from "react-native-view-more-text";
import { StackActions, NavigationActions, Actions } from "react-navigation";
import moment from "moment";
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

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
import Camera from "react-native-camera";

import QRCodeScanner from "react-native-qrcode-scanner";

export default class ScanScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      access_token: null,
      user: null,
      isLoading: true,
      showMarker: true,
      overlayVisible: false,
      currentUser: null,
      img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
      userImg:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
    };
  }

  componentDidMount() {
    console.log("componentDidMount of Scanner Screen");

    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user,
      isLoading: false,
      img_url:this.props.screenProps.img_url
    });
  }

  onSuccess = e => {
    console.log("Successful Scan");
    console.log(e.data);
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/user/userValidity?username=" +
        e.data,
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
        console.log(responseJson);
        if (responseJson.status === "200") {

          if (responseJson.isFriends) {
            this.dropDownAlertRef.alertWithType(
              "success",
              "Success",
              "You Are Already Friends With " + e.data
            );
            setTimeout(() => {
              this.props.navigation.navigate("SearchScreen",{
                update:true
              });
            }, 1000);
          } else {
            if(e.data!==this.state.user){
            this.setState({ currentUser: e.data, overlayVisible: true, userImg:"https://shielded-dusk-55059.herokuapp.com"+responseJson.userImg });
            this.dropDownAlertRef.alertWithType(
              "success",
              "Success",
              "User Found!!"
            );
          }
          else{
            this.dropDownAlertRef.alertWithType(
              "error",
              "Error",
              "Hey Its You!!"
            );
          }
          }
        } else {
          this.dropDownAlertRef.alertWithType(
            "error",
            "Error",
            "No Such User Found!! Please Try Again!!"
          );
        }
      });
  };

  sendRequest = () => {
    console.log("Ok Sending Request To " + this.state.currentUser);
    fetch("https://shielded-dusk-55059.herokuapp.com/friends/createFriend/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        username: this.state.currentUser,
        access: "ALL"
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === "200") {
          this.dropDownAlertRef.alertWithType(
            "success",
            "Success",
            "Hurray... We Have Sent A Friend Request To " +
              this.state.currentUser
          );
          this.setState({ overlayVisible: false, currentUser: null });
          setTimeout(() => {
            this.props.navigation.navigate("SearchScreen");
          }, 1000);
        } else {
          this.dropDownAlertRef.alertWithType(
            "error",
            "Error",
            "Error In Making Friends!! Please Try Again!!"
          );
          this.setState({ overlayVisible: false, currentUser: null });
        }
      });
  };

  onClose = () => {
    this.setState({
      overlayVisible: false,
      currentUser: null
    });
  };

  onSwipeDown = () => {
    this.setState({
      overlayVisible: false,
      currentUser: null
    });
  };

  onSwipeUp = () => {
    this.setState({
      overlayVisible: false,
      currentUser: null
    });
  };

  render() {
    const config = {
      velocityThreshold: 0.5,
      directionalOffsetThreshold: 80
    };
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Scan Code"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Icon size={30} name="arrow-back" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10,
                    borderColor:'black',
                    borderWidth:1,
                    backgroundColor:'white'
                  }}
                  source={{
                    uri:
                      this.state.img_url
                  }}
                />
              </TouchableOpacity>
            }
            height={55}
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
      return (
        <View style={{ flex: 1 }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Scan Code"
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
                    marginRight: 10,
                    borderColor:'black',
                    borderWidth:1,
                    backgroundColor:'white'
                  }}
                  source={{
                    uri:
                      this.state.img_url
                  }}
                />
              </TouchableOpacity>
            }
            height={55}
            statusBarHidden={true}
          />
          <View style={styles.rectangleContainer}>
            <QRCodeScanner
              style={styles.camera}
              onRead={this.onSuccess}
              showMarker={this.state.showMarker}
              customMarker={
                <Icon
                  name="ios-qr-scanner"
                  size={300}
                  style={{ color: "#0476D9" }}
                />
              }
              reactivate={true}
              reactivateTimeout={2000}
              cameraStyle={{
                height: 280,
                marginTop: 20,
                width: 350,
                alignSelf: "center",
                justifyContent: "center"
              }}
              bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                  <Button style={styles.buttonText} title="Scanning..." />
                </TouchableOpacity>
              }
            >
              <View style={styles.rectangleContainer}>
                <View style={styles.rectangle} />
              </View>
            </QRCodeScanner>
          </View>
          <GestureRecognizer
            onSwipeDown={this.onSwipeDown}
            onSwipeUp={this.onSwipeUp}
            config={config}
          >
            <View style={{ flex: 1 }}>
              <Overlay
                visible={this.state.overlayVisible}
                onClose={this.onClose}
                containerStyle={{
                  elevation: 15,
                  borderRadius: 20,
                  padding: 20,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  marginTop: 300,
                  backgroundColor: "#313340",
                  shadowColor: "black",
                  color: "#313340",
                  marginBottom: -15
                }}
                closeOnTouchOutside
                animationType="fadeInUp"
              >
                <View>
                  <TouchableWithoutFeedback
                    style={{
                      flex: 1
                    }}
                  >
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
                          subtitle="Send A Friend Request Now"
                        />
                        <Icon
                          size={20}
                          name="ios-person-add"
                          style={{ marginRight: 20, marginTop: 22 }}
                        />
                      </View>
                      <Image
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 75,
                          marginLeft: 100,
                          marginBottom: 20
                        }}
                        source={{
                          uri: this.state.userImg
                        }}
                      />

                      <View style={{ flex: 1, marginLeft: 10, marginTop: 0 }}>
                        <CardAction
                          seperator={true}
                          inColumn={false}
                          style={{ marginTop: 30, marginLeft: 70 }}
                        >
                          <Button
                            icon={
                              <Icon
                                name="md-close-circle-outline"
                                size={20}
                                color="white"
                              />
                            }
                            title="  Cancel  "
                            raised
                            buttonStyle={{
                              borderRadius: 5,
                              backgroundColor: "red"
                            }}
                            onPress={this.onClose}
                          />
                          <Button
                            icon={
                              <Icon
                                name="md-checkmark-circle-outline"
                                size={20}
                                color="white"
                              />
                            }
                            title="    Send   "
                            raised
                            buttonStyle={{
                              borderRadius: 5
                            }}
                            onPress={this.sendRequest}
                            containerStyle={{ marginLeft: 20 }}
                          />
                        </CardAction>
                      </View>
                    </Card>
                  </TouchableWithoutFeedback>
                </View>
              </Overlay>
            </View>
          </GestureRecognizer>
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
  },
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black"
  },

  rectangle: {
    height: 250,
    width: 270,
    borderWidth: 2,
    borderColor: "#00FF00",
    backgroundColor: "transparent"
  },
  camera: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").width
  }
});
