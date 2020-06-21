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

import Drawer from "react-native-drawer";
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

export default class WebView1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      currentEmbedLink: ""
    };
  }

  componentDidMount() {
    console.log("inside componentDidMount of webView");
    console.log(this.props.navigation.state.params);
    this.setState({
      currentEmbedLink: this.props.navigation.state.params.currentEmbedLink,
      isLoading: false
    });
  }

  UNSAFE_componentWillReceiveProps(nextProp) {
    console.log("inside UNSAFE_componentWillReceiveProps of webView");
    console.log(this.props.navigation.state.params);
    this.setState({
      currentEmbedLink: nextProp.navigation.state.params.currentEmbedLink,
      isLoading: false
    });
  }

  fcloseDome = () =>{
    this.props.navigation.goBack(null);
  }

  render() {
    if (this.state.isLoading) {
      console.log("true");
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
              {this.state.currentEmbedLink.substring(0, 40)}...
            </Text>
          </View>
          <Divider
            style={{ backgroundColor: "#CCCCCC", height: 2 }}
            light={true}
            orientation="center"
          />
          <Text />
          <WebView
            source={{ uri: this.state.currentEmbedLink }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/LMY48X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/608.2.11"
          />
        </View>
      );
    } else {
      console.log("false");
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
              {this.state.currentEmbedLink.substring(0, 40)}...
            </Text>
          </View>
          <Divider
            style={{ backgroundColor: "#CCCCCC", height: 2 }}
            light={true}
            orientation="center"
          />
          <Text />

          <WebView
            source={{ uri: this.state.currentEmbedLink }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoad={() => {
              this.setState({ isLoading: true });
            }}
            userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/LMY48X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/608.2.11"
          />
          <ActivityIndicator
            animating={true}
            size="small"
            style={{ marginBottom: 270 }}
            hidesWhenStopped
            color={Colors.blue800}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
