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

export default class DrawerContents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      segregates: [],
      isLoading: true
    };
  }

  logoutFromDrive = () => {
    this.props.logoutFromDrive();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 80,
            backgroundColor: "#A62655",
            flexDirection: "row",
            elevation: 10
          }}
        >
          <Image
            style={{
              width: 35,
              height: 35,
              borderRadius: 25,
              marginLeft: 10,
              marginTop: 25,
              shadowColor: "white"
            }}
            source={{
              uri:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjdM4n_jiblSqnIohyiSquJAGlxbhyz2eHTYw027oG0SKHE5LB&s"
            }}
          />
          <Text
            style={{
              marginTop: 28,
              marginLeft: 20,
              fontSize: 19,
              fontWeight: "bold",
              fontStyle: "italic",
              color: "white"
            }}
          >
            Segregates
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.logoutFromDrive();
            }}
          >
            <Icon
              name="logout"
              size={25}
              style={{ marginTop: 30, marginLeft: 15 }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
            hidesWhenStopped
            color={"#00b5ec"}
          />
        </View>
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
    marginTop: 250
  }
});
