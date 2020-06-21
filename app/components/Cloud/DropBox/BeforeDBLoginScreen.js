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

import AfterDBLoginScreen from "./AfterDBLoginScreen";

export default class BeforeDBLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: false,
      code: null,
      activity_loading: true,
      activity_text: "",
      git_login_error: false,
      closeInterval: 2000,
      isLoading: true,
      user: null,
      access_token: null,
      curr_redirect_url:
        "https://www.dropbox.com/oauth2/authorize?client_id=0g2qw3uaxpgwbsf&response_type=code&redirect_uri=https://obscure-bayou-10492.herokuapp.com/test/complete/dropbox-oauth21&state=",
      ended: false
    };
  }

  componentDidMount() {
    console.log("inside componentDidMount of Main BeforeDBLoginScreen");
    console.log(this.props.screenProps.access_token);
    this.setState({
      access_token: this.props.screenProps.access_token,
      isLoading: false,
      user: this.props.screenProps.user,
      curr_redirect_url:
        this.state.curr_redirect_url + this.props.screenProps.access_token
    });

    //Open Drawer
    //this.props.screenProps.dbRootNav.openDrawer()

    //Navigate Among The DB Stack
    //this.props.navigation.navigate('AfterDBLoginScreen')
    this._loadInitialState(this.props.screenProps.user);
  }

  async _loadInitialState(user) {
    const userStates = await AsyncStorage.getItem("userStates");

    let userStates1 = JSON.parse(userStates);
    console.log(userStates1);

    if (
      userStates1 &&
      user in userStates1 &&
      "db_access_token" in userStates1[user]
    ) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "AfterDBLoginScreen",
            params: {
              db_access_token: userStates1[user]["db_access_token"],
              db_login_email: userStates1[user]["db_login_email"],
              db_img_url: userStates1[user]["db_img_url"],
              db_id_token: userStates1[user]["db_id_token"],
              naviBackProp: this.props.navigation
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      console.log("No DB Logged In User");
      this.setState({
        activity_loading: false,
        activity_text: "This Might Take A Few Seconds"
      });
    }
  }

  gotoAfterLogin = () => {
    this.setState({
      response: !this.state.response,
      modalVisible: !this.state.modalVisible
    });

    BackHandler.removeEventListener("hardwareBackPress", this.onBackButton);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.onBackButtonPressAndroid
    );
  };

  //Close Webview when got code
  closeDome = navEvent => {
    //console.log(navEvent);
    var url = navEvent.url;
    var data = navEvent.data;
    console.log(url);

    var re2 = /https:\/\/obscure-bayou-10492.herokuapp.com\/test\/complete\/dropbox-oauth21\?state=[A-Za-z0-9_%\/&-=]+/;

    if (url.match(re2) && this.state.ended) {
      console.log("url matched");
      let code = url.split("code=")[1];

      console.log(code);
      this.setState({
        code: code,
        response: false,
        activity_loading: true,
        activity_text:
          "Fetching Some Minor Information For Better Experience!!\n This Might Take A Few Seconds!!"
      });

      this.dbMakeLogic();
    }
  }

  closeDomeLoad = () => {
    this.setState({ ended: true });
  };

  dbMakeLogic = async () => {
    fetch("https://shielded-dusk-55059.herokuapp.com/hi/db_data_overview", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "200") {
          this.setData(responseJson);
        } else {
          //RNExitApp.exitApp();
          console.log("error occured")
        }
      });
  };

  async setData(responseJson) {
    console.log(JSON.parse(responseJson["creds"]));

    let creds = JSON.parse(responseJson["creds"]);
    let img_url = creds["img_url"];
    let access_token = creds["access_token"];
    let id_token = creds["id_token"];

    console.log(id_token);

    const userStates = await AsyncStorage.getItem("userStates");

    let userStates1 = JSON.parse(userStates);
    console.log(userStates1);

    userStates1[this.state.user]["db_access_token"] = access_token;
    userStates1[this.state.user]["db_login_email"] = creds["login_email"];
    userStates1[this.state.user]["db_img_url"] = img_url;
    userStates1[this.state.user]["db_id_token"] = id_token;

    AsyncStorage.setItem("userStates", JSON.stringify(userStates1));

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "AfterDBLoginScreen",
          params: {
            db_access_token: access_token,
            db_login_email: responseJson["userEmail"],
            db_img_url: img_url,
            db_id_token: id_token,
            naviBackProp: this.props.navigation
          }
        })
      ]
    });
    BackHandler.removeEventListener("hardwareBackPress", this.onBackButton);
    this.props.navigation.dispatch(resetAction);
  }

  onBackButtonPressAndroid = () => {
    console.log("sd");
    BackHandler.removeEventListener("hardwareBackPress", this.onBackButton);
    BackHandler.addEventListener("hardwareBackPress", this.onBackButton);
    this.setState({ response: false });

    return true;
  };
  onBackButton = () => {
    RNExitApp.exitApp();
  };

  //Forcefully close webview
  fcloseDome() {
    this.setState({ response: false });
  }

  render() {
    if (this.state.activity_loading) {
      return (
        <View style={styles.container}>
          <ClassicHeader
            headerTitle="Dropbox Login"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.screenProps.dbRootNav.openDrawer();
                }}
              >
                <Icon size={30} name="menu" style={{ marginLeft: 10 }} />
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
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQc05TO0nD7AWyh_xtT9n8TUvkck5oI9veXXlYELMpFvckx3kvIA&s"
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
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
              marginTop: 270,
              padding: 10,
              elevation: 5,
              textAlign: "center"
            }}
          >
            {this.state.activity_text}
          </Text>
        </View>
      );
    } else if (this.state.response) {
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
          />
          <View style={{ flexDirection: "row", height: 50 }}>
            <TouchableHighlight
              onPress={() => {
                this.fcloseDome();
              }}
            >
              <Icon
                size={30}
                name="window-close"
                style={{ marginLeft: 8, marginTop: 7 }}
              />
            </TouchableHighlight>
            <Text
              style={{
                color: "blue",
                fontWeight: "bold",
                fontSize: 17,
                marginLeft: 10,
                marginTop: 10
              }}
            >
              {this.state.curr_redirect_url.substring(0, 40)}...
            </Text>
          </View>
          <Divider
            style={{ backgroundColor: "#CCCCCC", height: 2 }}
            light={true}
            orientation="center"
          />
          <Text />
          <WebView
            style={styles.WebViewStyle}
            source={{ uri: this.state.curr_redirect_url }}
            javaScriptEnabled={true}
            onNavigationStateChange={ (navEvent) => {
              this.closeDome(navEvent);
            }}
            domStorageEnabled={true}
            onLoadEnd={() => {
              this.closeDomeLoad();
            }}
            userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/LMY48X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/608.2.11"
          />
        </View>
      );
    } else {
      console.log(this.state.code);
      return (
        <View style={{ flex: 1 }}>
          <ClassicHeader
            headerTitle="Dropbox Login"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.screenProps.dbRootNav.openDrawer();
                }}
              >
                <Icon size={30} name="menu" style={{ marginLeft: 10 }} />
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
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQc05TO0nD7AWyh_xtT9n8TUvkck5oI9veXXlYELMpFvckx3kvIA&s"
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <View style={{ flex: 0.9 }}>
            <TouchableHighlight
              onPress={() => this.gotoAfterLogin()}
              style={{
                flex: 1,
                marginTop: 50,
                marginLeft: 20,
                marginRight: 20
              }}
            >
              <Card
                style={{
                  elevation: 20,
                  borderRadius: 10,
                  padding: 10,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  shadowColor: "black"
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <CardTitle
                    title="Login To Your Dropbox Account"
                    subtitle="You Only Need To Login Once"
                  />
                  <Icon
                    size={20}
                    name="dropbox"
                    style={{ marginRight: 20, marginTop: 22 }}
                  />
                </View>

                <CardImage
                  source={{
                    uri:
                      "https://static.makeuseof.com/wp-content/uploads/2016/02/dropbox-things-670x335.jpg"
                  }}
                  title="Dropbox Login"
                />
                <CardContent
                  style={{ marginTop: 130 }}
                  text="We don't save any of your data for personal or public use. Your data is safe and you can delete the access anytime and all your existing data details will be deleted from our server."
                />

                <CardAction
                  seperator={true}
                  inColumn={false}
                  style={{ marginLeft: 10, marginTop: 0 }}
                >
                  <CardButton
                    onPress={() => {
                      this.gotoAfterLogin();
                    }}
                    title="Login"
                    color="blue"
                  />
                </CardAction>
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
