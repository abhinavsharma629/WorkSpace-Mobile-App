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
  ScrollView,
  Modal,
  Dimensions,
  DrawerActions,
  findNodeHandle
} from "react-native";

import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Divider, Overlay } from "react-native-elements";
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
export default class ScanScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      access_token: null,
      user: null,
      isLoading: true,
      originalBrightness:0,
      img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
    };
  }

  componentDidMount() {
    // Can't Unlink it.. Bug in the api
    console.log("inside componentDidMount of ScanScreen")
    // DeviceBrightness.getBrightnessLevel()
    // .then(function (luminous) {
    //     DeviceBrightness.setBrightnessLevel(1);
    // });
    DeviceBrightness.setBrightnessLevel(1);

    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user,
      isLoading: false,
      img_url:this.props.screenProps.img_url
    });


  }
  UNSAFE_componentWillReceiveProps(nextProps){
    console.log("inside UNSAFE_componentWillReceiveProps of ScanScreen")
    DeviceBrightness.setBrightnessLevel(1);
  }

  unmountBrightness = () =>{
    console.log("unmounting brightness")
    DeviceBrightness.setBrightnessLevel(0.5);
    this.props.navigation.goBack()
  }


  static navigationOptions = {
    drawerLabel: "Scan Me",
    drawerIcon: () => <Icon size={25} name="cube-scan" />,
    tapToClose: "true"
  };


  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, backgroundColor: "#0476D9" }}>
          <ClassicHeader
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.unmountBrightness();
                }}
              >
                <Icon size={30} name="keyboard-backspace" style={{ marginLeft: 10 }} />
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
          <View style={{ flex: 0.9, elevation: 10 }}>
            <TouchableHighlight
              style={{
                flex: 1,
                marginTop: 80,
                marginLeft: 20,
                marginRight: 20
              }}
            >
              <Card
                style={{
                  elevation: 20,
                  borderRadius: 10,
                  marginBottom: 30,
                  padding: 10,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  shadowColor: "black"
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <CardTitle
                    title="Scan The Code"
                    subtitle="A flexible way to become friends"
                  />
                  <Icon
                    size={20}
                    name="security"
                    style={{ marginRight: 20, marginTop: 22 }}
                  />
                </View>
                <View style={{ marginLeft: 40, marginTop: 20 }}>
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    style={styles.loader}
                    hidesWhenStopped
                    color={Colors.blue800}
                  />
                </View>
              </Card>
            </TouchableHighlight>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: "#0476D9" }}>
          <ClassicHeader
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.unmountBrightness();
                }}
              >
                <Icon size={30} name="keyboard-backspace" style={{ marginLeft: 10 }} />
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
          <View style={{ flex: 1, elevation: 10 }}>
            <TouchableHighlight
              style={{
                flex: 1,
                marginTop: 80,
                marginLeft: 20,
                marginRight: 20,
                marginBottom:20
              }}
            >
              <Card
                style={{
                  elevation: 20,
                  borderRadius: 10,
                  marginBottom: 30,
                  padding: 10,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  shadowColor: "black"
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <CardTitle
                    title="Scan The Code"
                    subtitle="A flexible way to connect with friends"
                  />
                  <Icon
                    size={20}
                    name="security"
                    style={{ marginRight: 20, marginTop: 22 }}
                  />
                </View>
                <View style={{ marginLeft: Dimensions.get('window').width/14, marginTop: 0 }}>
                  <QRCode
                    value={this.state.user}
                    size={250}
                    color="purple"
                    logo={require("../../required_images/ws.png")}
                    logoSize={50}
                    logoBackgroundColor="transparent"
                  />
                </View>
              </Card>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black"
  },

  loader: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    marginLeft: 100
  },

  input: {
    height: 40,
    borderColor: "gray",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 150,
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    padding: 5,
    backgroundColor: "white",
    elevation: 10
  }
});
