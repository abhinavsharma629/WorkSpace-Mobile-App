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
import Overlay from "react-native-modal-overlay";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage
} from "react-native-material-cards";
import HTMLView from "react-native-htmlview";

import ShowPostWithCommentsSkeleton from "./ShowPostWithCommentsSkeleton";

export default class ShowPostWithComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteId: null,
      loading: true,
      access_token: null,
      noteDetails: null,
      adminPic: null,
      postAdmin: null,
      createdFrom: null,
      noteData: null,
      noteCaption: null
    };
  }

  getAllComments(access_token) {
    console.log(this.props.noteId);

    console.log("Getting all post comments");
    console.log(this.props.noteId);
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/shared/specificNoteDetail?noteId=" +
        this.props.noteId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.status);
        if (responseJson.status === "200") {
          var noteDetails = JSON.parse(responseJson.noteDetails);

          this.saveData(noteDetails);
        } else {
          alert("Try Again");
        }
      });
  }
  saveData = noteDetails => {
    var profilePic = null;

    if (noteDetails["admin_profile_picture"]) {
      profilePic = noteDetails[0]["admin_profile_picture"];
    } else {
      profilePic =
        "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg";
    }
    this.setState({
      loading: false,
      noteData: noteDetails[0]["noteData"],
      noteCaption: noteDetails[0]["noteCaption"],
      adminPic: profilePic,
      createdFrom: noteDetails[0]["createdFrom"],
      postAdmin: "abhinavsharma629"
    });
    console.log(noteDetails);
  };

  componentDidMount() {
    console.log("SHow PostWithComments componentDidMount");
    console.log(this.props.noteId);
    this.setState({
      noteId: this.props.noteId,
      access_token: this.props.access_token
    });
    console.log(this.state);
    this.getAllComments(this.props.access_token);
  }

  render() {
    if (this.state.loading === true) {
      return (
        <View>
          <ShowPostWithCommentsSkeleton />
        </View>
      );
    } else {
      console.log(this.state.noteData);
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10
            }}
          >
            <TouchableOpacity>
              <View>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginTop: 10,
                    marginLeft: 10,
                    borderColor:'black',
                    borderWidth:1,
                    backgroundColor:'white'
                  }}
                  source={{
                    uri: this.state.adminPic
                  }}
                />
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <Text
                style={{
                  marginLeft: 30,
                  fontSize: 15,
                  flex: 1,
                  marginLeft: 20,

                  marginTop: 5,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                  padding: 5,
                  fontWeight: "400",
                  fontWeight: "bold"
                }}
              >
                {this.state.postAdmin}
              </Text>
              <Text
                style={{
                  marginLeft: 50,
                  fontSize: 12,
                  flex: 1,
                  marginTop: -5,
                  color: "grey",

                  fontWeight: "bold"
                }}
              >
                {this.state.createdFrom}
              </Text>
            </View>
            <Text />
            <Text />
          </View>
          <Text
            style={{
              marginTop: 10,
              alignItems: "center",
              marginLeft: 140,
              fontSize: 17,
              fontWeight: "bold",
              fontStyle: "italic"
            }}
          >
            {this.state.noteCaption}
          </Text>

          <View
            style={{
              flex: -1,
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 20,
              marginRight: 10,
              padding: 5,
              borderRadius: 5,
              elevation: 2,
            }}
          >
            <ScrollView style={{ flex: -1 }}>
              <HTMLView
                value={this.state.noteData}
                stylesheet={styles.a}
                style={{ padding: 10 }}
              />
              <Text />
              <Text />
              <Text />
              <Text />
              <Text />
              <Text />
              <Text />
              <Text />
              <Text />
              <Text />
              <Text />
              <Text />
              <Text />
            </ScrollView>
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
  a: {
    fontWeight: "300",
    color: "blue" // make links coloured pink
  }
});
