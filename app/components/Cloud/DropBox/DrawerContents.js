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
  RefreshControl,
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
      isLoading: true,
      selectedItem: 0,
      segregates: [],
      extentionsDict: {
        file: {
          logo: "file"
        },
        json: {
          logo: "json"
        },
        image: {
          logo: "file-image"
        },
        xml: {
          logo: "file-xml"
        },
        video: {
          logo: "file-video"
        },
        document: {
          logo: "file-document"
        },
        excel: {
          logo: "file-excel"
        },
        music: {
          logo: "file-music"
        },
        presentation: {
          logo: "file-powerpoint"
        },
        pdf: {
          logo: "file-pdf"
        },
        table: {
          logo: "file-table"
        },
        word: {
          logo: "file-word"
        },
        chart: {
          logo: "file-chart"
        },
        cloud: {
          logo: "file-cloud"
        },
        zip: {
          logo: "zip-box"
        },
        csv: {
          logo: "file-delimited"
        },
        download: {
          logo: "file-download"
        },
        account: {
          logo: "file-account"
        },
        others: {
          logo: "code-greater-than-or-equal"
        },
        text: {
          logo: "script-text"
        },
        form: {
          logo: "file-chart"
        },
        code: {
          logo: "file-xml"
        }
      },
      refreshing:false
    };
  }

  componentDidMount() {
    console.log("componentDidMount of DrawerContents");
    this.setState({
      segregates: this.props.segregates,
      isLoading: this.props.isLoading,
      refreshing:false,
    });
    //console.log(this.props.segregates);
  }

  UNSAFE_componentWillReceiveProps(nextProp) {
    console.log("UNSAFE_componentWillReceiveProps of DrawerContents");
    this.setState({
      segregates: nextProp.segregates,
      isLoading: nextProp.isLoading,
      refreshing:false,
    });
    //console.log(nextProp.segregates);
  }

  selectContent = (selName, itemId) => {
    //console.log(itemId);
    this.props.selectContent(itemId, selName);
    this.setState({ selectedItem: itemId });
  };

  _onRefresh = () =>{
    this.setState({refreshing:true})
    this.props.reload()
  }

  renderIcon = type => {
    let itemName = type.split(".")[type.split(".").length - 1];

    //console.log(itemName);
    var videoExtensionArray = [
      "mp4",
      "m4a",
      "m4v",
      "f4v",
      "f4a",
      "m4b",
      "m4r",
      "f4b",
      "mov",
      "3gp",
      "3gp2",
      "3g2",
      "3gpp",
      "3gpp2",
      "ogg",
      "oga",
      "ogv",
      "ogx",
      "wmv",
      "wma",
      "asf",
      "webm",
      "flv",
      "AVI"
    ];
    let icon = "file-xml";
    if (itemName === "application") {
      icon = this.state.extentionsDict.document.logo;
    } else if (
      itemName === "x-gzip" ||
      itemName === "x-zip-compressed" ||
      itemName === "zip"
    ) {
      icon = this.state.extentionsDict.zip.logo;
    } else if (itemName === "html") {
      icon = "language-html5";
    } else if (itemName === "css" || itemName === "scss") {
      icon = "language-css3";
    } else if (itemName === "js") {
      icon = "nodejs";
    } else if (itemName === "json" || itemName === "geo+json") {
      icon = this.state.extentionsDict.json.logo;
    } else if (itemName === "pdf") {
      icon = this.state.extentionsDict.pdf.logo;
    } else if (itemName === "octect-stream") {
      icon = this.state.extentionsDict.document.logo;
    } else if (itemName === "video" || videoExtensionArray.includes(itemName)) {
      icon = this.state.extentionsDict.video.logo;
    } else if (itemName === "audio" || itemName === "mp3") {
      icon = this.state.extentionsDict.music.logo;
    } else if (
      itemName === "image" ||
      itemName === "jpeg" ||
      itemName === "png" ||
      itemName === "jpg" ||
      itemName === "gif"
    ) {
      icon = this.state.extentionsDict.image.logo;
    } else if (itemName === "text" || itemName === "txt") {
      icon = this.state.extentionsDict.text.logo;
    } else if (itemName === "form") {
      icon = this.state.extentionsDict.form.logo;
    } else if (itemName === "document") {
      icon = this.state.extentionsDict.word.logo;
    } else if (itemName === "presentation") {
      icon = this.state.extentionsDict.presentation.logo;
    } else if (
      itemName === "spreadsheet" ||
      itemName === "sheet" ||
      itemName === "excel" ||
      itemName === "csv"
    ) {
      icon = this.state.extentionsDict.excel.logo;
    } else {
      icon = this.state.extentionsDict.others.logo;
    }
    return icon;
  };

  renderItems = () => {
    let c = 0;
    const arr = this.state.segregates.map(item => {
      //console.log(item)
      let itemName = item.name;

      itemName = itemName.toUpperCase();
      if (c === this.state.selectedItem) {
        c += 1;

        return (
          <TouchableOpacity
            onPress={() => {
              this.selectContent(item.name, item.id);
            }}
            style={{ padding: 5 }}
          >
            <View
              style={{
                flexDirection: "row",
                height: 50,
                backgroundColor: "#D3D3D3",
                elevation: 5,
                borderRadius: 2
              }}
            >
              <Icon
                name="folder-open-outline"
                size={25}
                style={{ marginTop: 15, marginLeft: 10 }}
              />
              <Text
                style={{
                  marginTop: 17,
                  marginLeft: 10,
                  fontSize: 15,
                  fontWeight: "bold"
                }}
              >
                {itemName}
              </Text>
            </View>
          </TouchableOpacity>
        );
      } else {
        c += 1;
        return (
          <TouchableOpacity
            onPress={() => {
              this.selectContent(item.name, item.id);
            }}
          >
            <View style={{ flexDirection: "row", height: 40 }}>
              <Icon
                name={this.renderIcon(item.name)}
                size={25}
                style={{ marginTop: 15, marginLeft: 10 }}
              />
              <Text
                style={{
                  marginTop: 17,
                  marginLeft: 10,
                  fontSize: 15,
                  fontWeight: "bold"
                }}
              >
                {itemName}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    });

    return arr;
  };

  logoutFromDrive = () => {
    this.props.logoutFromDrive();
  };
  render() {
    if (this.state.isLoading) {
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
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQc05TO0nD7AWyh_xtT9n8TUvkck5oI9veXXlYELMpFvckx3kvIA&s"
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
    } else {
      return (
        <ScrollView

          refreshControl={
            <RefreshControl

              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
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
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQc05TO0nD7AWyh_xtT9n8TUvkck5oI9veXXlYELMpFvckx3kvIA&s"
              }}
            />
            <Text
              style={{
                marginTop: 28,
                marginLeft: 10,
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
            <ScrollView style={{ marginBottom: 50 }}>
              {this.renderItems()}
              <Text />
              <Text />
            </ScrollView>
          </View>
        </View>
        </ScrollView>
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
    marginTop: 250
  }
});
