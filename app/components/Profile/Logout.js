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


export default class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:true,
      access_token:null,
      user:null,
      img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
    };
  }

  componentDidMount(){
    console.log("Inside componentDidMount of Logout")
    console.log(this.props.screenProps.img_url)
    // this.setState({access_token:this.props.screenProps.access_token, user:this.props.screenProps.user, img_url:this.props.screenProps.img_url})
    this.setState({access_token:this.props.screenProps.access_token, user:this.props.screenProps.user})

    this.currentUserLogout(this.props.screenProps.user)
  }


  async currentUserLogout(user) {
    const userStates = await AsyncStorage.getItem("userStates");

    let userStates1 = JSON.parse(userStates);
    let userStates11 = JSON.parse(userStates);

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
      AsyncStorage.setItem("userStates", JSON.stringify(userStates11));
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

  static navigationOptions = {
    drawerLabel: "Logout",
    drawerIcon: () => <Icon size={25} name="logout" />,
    tapToClose: "true"
  };

  render() {

      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Logout"

            rightComponent={
                <Icon size={30} name="logout-variant" style={{ marginRight: 10 }} />
            }
            height={60}
            statusBarHidden={true}
          />

          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
            hidesWhenStopped
            color="#4703A6"
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
