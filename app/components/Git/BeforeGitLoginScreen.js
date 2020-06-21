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
import Icon from "react-native-vector-icons/Ionicons";
import ViewMoreText from "react-native-view-more-text";
import { StackActions, NavigationActions, Actions } from "react-navigation";
import moment from "moment";
import { RootFolderData } from "./RootFolderData";
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

import AfterGitLoginScreen from "./AfterGitLoginScreen";

export default class BeforeGitLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: false,
      code: null,
      activity_loading: true,
      activity_text: "",
      git_login_error: false,
      closeInterval: 2000,
      user:null,
    };
  }

  componentDidMount() {
    console.log("componentDidMount of BeforeGitLoginScreen")
    this.setState({user:this.props.screenProps.user})
    this._loadInitialState(this.props.screenProps.user);
  }

  async _loadInitialState (user)  {

    const userStates = await AsyncStorage.getItem("userStates");

    let userStates1 = JSON.parse(userStates);
    console.log(userStates1)

    if(userStates1 && user in userStates1 && 'git_access_token' in userStates1[user]){
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'AfterGitLoginScreen', params:{git_access_token: userStates1[user]['git_access_token'],
        auth_login_name:userStates1[user]['git_login_name'],
      git_img_url:userStates1[user]['git_img_url']
    } })],
      });
      this.props.navigation.dispatch(resetAction);

      // this.props.navigation.navigate("AfterGitLoginScreen", {
      //   git_access_token: value
      // });
    }


     else {
      console.log("No Git Logged In User");
      this.setState({
        activity_loading: false,
        activity_text: "This Might Take A Few Seconds"
      });
    }
  };

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
    console.log("Navigating to AfterGitLoginScreen");
    //this.props.navigation.navigate('AfterGitLoginScreen')

  };

  //Close Webview when got code
  closeDome(navEvent) {
    console.log(navEvent);
    var url = navEvent.url;
    var re = /https:\/\/obscure-bayou-10492.herokuapp.com\/test\/complete\/gitHub-oauth2\?code=[A-Za-z0-9]+/;

    if (url.match(re)) {
      this.setState({
        code: navEvent.url,
        response: false,
        activity_loading: true
      });

      this.gitMakeLogic(url);
    }
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

  gitMakeLogic(url) {
    console.log(url + "\n\n");

    var data = {
      client_id: "62214c9c431303a8217c",
      client_secret: "2513fa09a6a01b3956bc1ace331d0c9325fa2b7e",
      state: "notifications,user,email,repo",
      code: url.split("=")[1],
      redirect_uri:
        "https://obscure-bayou-10492.herokuapp.com/test/complete/gitHub-oauth2"
    };

    console.log(data);

    this.getAccessToken(data);
  }

  getAccessToken = async data => {
    try {
      let access_token = await AsyncStorage.getItem("access_token");

      //this.setState({ access_token: access_token, access_token_error: false });
      this.receivedAccessToken(access_token, data);
    } catch (error) {
      console.log(error);
      console.log("not set");
      //this.setState({ access_token_error: true });
    }
  };

  receivedAccessToken(access_token, data) {
    console.log(data);
    this.setState({ activity_text: "Making Your Data!!\nPlease Wait!!" });
    console.log("received access token" + " " + access_token);
    fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseJson => {
        var accessTokenDataToJson = responseJson;
        console.log(accessTokenDataToJson);
        var git_access_token = accessTokenDataToJson["access_token"];

        fetch("https://api.github.com/user", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + git_access_token
          }
        })
          .then(response => response.json())
          .then(responseJson => {
            var userDetailsToJson = responseJson;
            console.log(userDetailsToJson);
            var git_img_url = userDetailsToJson['avatar_url']
            console.log("Accessing access token inside another fetch");
            console.log(git_access_token);
            if (git_access_token) {
              fetch("https://api.github.com/user/emails", {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + git_access_token,
                  Host: "api.github.com"
                }
              })
                .then(response => response.json())
                .then(responseJson => {
                  console.log(responseJson);
                  userDetailsToJson["email"] = responseJson[0];
                  // console.log(userDetailsToJson)
                  // console.log("Accessing access token inside another fetch")
                  // console.log(git_access_token)
                  // var concatinatingTheTwoJsonObjects={}
                  // concatinatingTheTwoJsonObjects['user_details']=userDetailsToJson
                  // concatinatingTheTwoJsonObjects['token_details']=accessTokenDataToJson
                  // console.log("Final Dict")
                  // console.log(concatinatingTheTwoJsonObjects)
                  console.log(JSON.stringify(accessTokenDataToJson));
                  this.setState({
                    activity_text:
                      "Almost There!! Saving Your Data For Faster Experience!! Please Wat!!"
                  });
                  fetch(
                    "https://shielded-dusk-55059.herokuapp.com/hi/storeCloud",
                    {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + access_token
                      },
                      body: JSON.stringify({
                        access_token: accessTokenDataToJson["access_token"],
                        auth_login_name: userDetailsToJson["login"],
                        email: userDetailsToJson["email"]["email"],
                        cred: JSON.stringify(accessTokenDataToJson),
                        dump: JSON.stringify(userDetailsToJson),
                        authName: "GITHUB"
                      })
                    }
                  )
                    .then(response => response.json())
                    .then(responseJson => {
                      console.log(responseJson);
                      if (responseJson.status === "201" || responseJson.status==="203") {
                        // this.setState({activity_loading:false})
                        //
                        this.setGitState(git_access_token, userDetailsToJson['login'] , git_img_url);
                      } else {
                        this.setState({
                          activity_text: "This Might Take A Few Seconds",
                          activity_loading: false
                        });
                        this.dropDownAlertRef.alertWithType(
                          "error",
                          "Error",
                          "Some Error Occured!! Please Try Again!!"
                        );
                      }
                    });
                });
            } else {
              this.setState({
                activity_text: "This Might Take A Few Seconds",
                activity_loading: false
              });
              this.dropDownAlertRef.alertWithType(
                "error",
                "Error",
                "Some Error Occured!! Please Try Again!!"
              );
            }
          });
      });
  }

  //
  //     headers1={}
  //     headers1['Authorization']= 'Bearer '+obj.access_token
  //     url="https://shielded-dusk-55059.herokuapp.com/hi/storeCloud"
  //
  //     response=requests.post(url, data={
  //         'access_token':accessTokenDataToJson['access_token'],
  //         'auth_login_name':userDetailsToJson['login'],
  //         'email':userDetailsToJson['email']['email'],
  //         'cred':json.dumps(accessTokenDataToJson),
  //         'dump':json.dumps(userDetailsToJson),
  //         'authName': "GITHUB"
  //     }, headers=headers1).json()
  //   }
  //  }
  // }

  alertToLogin(){
    this.dropDownAlertRef.alertWithType(
      "error",
      "Error",
      "You Need To Login To Your GitHub First!!"
    );
  }



  async setGitState (git_access_token, login_name, git_img_url) {

    console.log("initializing gitstate")
    const userStates = await AsyncStorage.getItem("userStates");
    let userStates1 = JSON.parse(userStates)

    if(userStates1 && this.state.user in userStates1){
      console.log("found user in async storage")
      userStates1[this.state.user]['git_access_token']=git_access_token
      userStates1[this.state.user]['git_login_name'] = login_name
      userStates1[this.state.user]['git_img_url'] = git_img_url
      AsyncStorage.setItem("userStates", JSON.stringify(userStates1))
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'AfterGitLoginScreen', params:{
          git_access_token: git_access_token,
          auth_login_name:login_name,
        git_img_url:git_img_url
      } })],
      });
      this.props.navigation.dispatch(resetAction);
      // this.props.navigation.navigate("AfterGitLoginScreen", {
      //   git_access_token: git_access_token,
      //   auth_login_name:userDetailsToJson['login']
      // });
    }
    else{
      console.log("user not found in async storage")
      RNExitApp.exitApp();
    }


  }

  render() {
    const git_oauth_url =
      "https://github.com/login/oauth/authorize?client_id=62214c9c431303a8217c&client_secret=2513fa09a6a01b3956bc1ace331d0c9325fa2b7e&scope=notifications,user,repo:status,read:user,repo,delete_repo,email";
    const server_for_git_oauth =
      "https://obscure-bayou-10492.herokuapp.com/test/gitHubLogin";
    console.log(git_oauth_url);

    if (this.state.activity_loading) {
      return (
        <View style={styles.container}>
        <ClassicHeader
          headerTitle="Github Login"
          leftComponent={
            <TouchableOpacity
              onPress={() => {
                this.alertToLogin();
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
                    "https://techcrunch.com/wp-content/uploads/2010/07/github-logo.png?w=400"
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
              top: "50%",
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
          <View style={{ flexDirection: "row" }}>
            <TouchableHighlight
              onPress={() => {
                this.fcloseDome();
              }}
            >
              <Icon
                size={40}
                name="ios-close"
                style={{ marginLeft: 8, marginTop: 3 }}
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
              https://github.com/login/oauth/authorize?..
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
            source={{ uri: git_oauth_url }}
            javaScriptEnabled={true}
            onNavigationStateChange={navEvent => {
              this.closeDome(navEvent);
            }}
            domStorageEnabled={true}
            incognito={true}
          />
        </View>
      );
    } else {
      console.log(this.state.code);
      return (

        <View style={{ flex: 1 }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Github Login"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.alertToLogin();
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
                      "https://techcrunch.com/wp-content/uploads/2010/07/github-logo.png?w=400"
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
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
                  elevation: 15,
                  borderRadius: 10,
                  padding: 10,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset:5,
                  shadowColor:'black'
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <CardTitle title="Login To Your Github Account" subtitle="You Only Need To Login Once"/>
                  <Icon
                    size={20}
                    name="ios-git-network"
                    style={{ marginRight: 20, marginTop: 22 }}
                  />
                </View>

                <CardImage
                  source={{ uri: "https://github.blog/wp-content/uploads/2019/05/facebook-1200x630.png?w=1024" }}
                  title="Github Login"
                />
                <CardContent style={{marginTop:130}} text="We don't save any of your data for personal or public use. Your data is safe and you can delete the access anytime and all your existing data details will be deleted from our server." />



                <CardAction
                  seperator={true}
                  inColumn={false}
                  style={{ marginLeft: 10, marginTop: 0 }}
                >
                  <CardButton
                    onPress={() => {
                      this.gotoAfterLogin()
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
    top: "48%"
  }
});
