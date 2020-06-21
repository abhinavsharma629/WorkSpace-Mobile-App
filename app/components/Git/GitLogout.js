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


export default class GitLogout extends Component {
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
    console.log("Inside componentDidMount of GitLogout")
    console.log(this.props.screenProps.user)

    this.setState({access_token:this.props.screenProps.access_token, user:this.props.screenProps.user})
    this.currentUserLogout(this.props.screenProps.user, this.props.screenProps.access_token)
  }


  currentUserLogout = (user, access_token) => {

      fetch("https://shielded-dusk-55059.herokuapp.com/hi/socialLogout", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token
        },
        body: JSON.stringify({
          authName: "GITHUB"
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status === "200") {
            this.logoutFromStorage(user);
          } else {
            this.dropDownAlertRef.alertWithType(
              "error",
              "Error",
              "Some Error Occured While Logging You Out.. Please Try Again Later!!"
            );
          }
        });
    };


    async logoutFromStorage (user){

      const userStates = await AsyncStorage.getItem("userStates");

      let userStates1 = JSON.parse(userStates);
      let userStates11 = JSON.parse(userStates);

      console.log(userStates1)
      delete userStates1[user]['git_access_token']
      delete userStates1[user]['git_login_name']
      delete userStates1[user]['git_img_url']

      await AsyncStorage.setItem("userStates", JSON.stringify(userStates1))

        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: "BeforeGitLoginScreen",
            })
          ]
        });
        this.props.screenProps.rootNavigation.dispatch(resetAction);

        console.log("transferring control");

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
