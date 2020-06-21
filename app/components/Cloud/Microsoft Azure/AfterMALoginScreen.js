import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeemaack,
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
import DrawerContents from "./DrawerContents";
import Share from "react-native-share";

export default class AfterMALoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: null,
      isLoading: true,
      user: null,
      ma_access_token: null,
      ma_img_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjdM4n_jiblSqnIohyiSquJAGlxbhyz2eHTYw027oG0SKHE5LB&s",
      ma_login_email: null,
      activity_text: "To Be Released Soon!!\nPlease Be Patient"
    };
  }

  componentDidMount() {
    console.log("inside componentDidMount of Main AfterMALoginScreen");
    console.log(this.props.screenProps.access_token);

    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user,
      ma_access_token: this.props.navigation.state.params["ma_access_token"],
      ma_refresh_token: this.props.navigation.state.params["ma_refresh_token"],
      ma_login_email: this.props.navigation.state.params["ma_login_email"]
    });

    //console.log(this.props.navigation.state.params.naviBackProp.navigate('BeforeMALoginScreen'))

    //Open Drawer
    //this.props.screenProps.maRootNav.openDrawer()

    //Navigate Among The MA Stack
    //this.props.navigation.navigate('AfterMALoginScreen')
  }

  async logoutFromStorage() {
    const userStates = await AsyncStorage.getItem("userStates");
    let userStates1 = JSON.parse(userStates);

    delete userStates1[this.state.user]["ma_access_token"];
    delete userStates1[this.state.user]["ma_refresh_token"];
    delete userStates1[this.state.user]["ma_login_email"];

    await AsyncStorage.setItem("userStates", JSON.stringify(userStates1));
    await AsyncStorage.removeItem(this.state.user + "ma_selected_segregates");

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "BeforeMALoginScreen"
        })
      ]
    });
    this.props.navigation.state.params.naviBackProp.dispatch(resetAction);
  }

  logoutFromDrive = () => {
    console.log("logging out from drive");

    fetch("https://shielded-dusk-55059.herokuapp.com/hi/socialLogout", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        authName: "AZURE"
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "200") {
          this.logoutFromStorage();
        } else {
          this.dropDownAlertRef.alertWithType(
            "error",
            "Error",
            "Some Error Occured While Logging You Out.. Please Try Again Later!!"
          );
        }
      });
  };

  render() {
    return (
      <Drawer
        type="overlay"
        ref={ref => (this._drawer = ref)}
        content={
          <DrawerContents
            navProps={this.props.navigation.state.params.naviBackProp}
            logoutFromDrive={this.logoutFromDrive.bind(this)}
          />
        }
        tapToClose={true}
        openDrawerOffset={0.5} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        elevation={10}
      >
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
          />
          <ClassicHeader
            headerTitle="Your Azure"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.screenProps.maRootNav.openDrawer();
                }}
              >
                <Icon size={30} name="menu" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  this._drawer.open();
                }}
              >
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10
                  }}
                  source={{
                    uri: this.state.ma_img_url
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />

          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={true}
            color="#00b5ec"
            style={[
              styles.loader,
              { marginLeft: 20, marginRight: 20, height: 20 }
            ]}
          />
          <Text
            style={{
              color: "blue",
              marginTop: 270,
              padding: 10,
              elevation: 10,
              fontSize: 17,
              fontWeight: "bold",
              textAlign: "center"
            }}
          >
            {this.state.activity_text}
          </Text>
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  logoText: {
    fontSize: 27,
    fontFamily: "Iowan Old Style",
    fontStyle: "italic",
    fontWeight: "800",
    marginTop: 5,
    marginLeft: 10,
    textAlign: "center",
    color: "#0360FF",
    elevation: 5
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "40%"
  }
});

const drawerStyles = {
  drawer: { shadowColor: "black", backgroundColor: "white", shadowRadius: 3 },
  main: { paddingLeft: 3 }
};
