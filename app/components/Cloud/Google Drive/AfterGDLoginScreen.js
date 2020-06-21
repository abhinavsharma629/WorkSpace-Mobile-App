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
import Share from 'react-native-share';


export default class AfterGDLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: null,
      isLoading: true,
      user: null,
      gd_access_token: null,
      gd_img_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Logo_of_Google_Drive.svg/2000px-Logo_of_Google_Drive.svg.png",
      gd_login_email: null,
      gd_id_token: null,
      gd_token_info_uri: null,
      activity_text:
        "Building Your Drive!!\nThis Might Take A While If You Are New Here!!\n Please Be Patient!!",
      selectedItem: 0,
      segregates: [],
      showUpData: [],
      selName: null,
      isDrawerContentLoading: true,
      webView: false,
      currentEmbedLink: "",
      startIndex: 0,
      overlayVisible: false,
      curr_title: null,
      curr_fileId: null,
      curr_created: null,
      curr_editable: true,
      curr_version: null,
      curr_embedLink: null,
      curr_modifiedDate: null,
      endIndex: 20,
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
      }
    };
  }

  componentDidMount() {
    console.log("inside componentDidMount of Main AfterGDLoginScreen");
    console.log(this.props.screenProps.access_token);

    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user,
      gd_access_token: this.props.navigation.state.params["gd_access_token"],
      gd_id_token: this.props.navigation.state.params["gd_id_token"],
      gd_token_info_uri: this.props.navigation.state.params[
        "gd_token_info_uri"
      ],
      gd_img_url: this.props.navigation.state.params["gd_img_url"],
      gd_login_email: this.props.navigation.state.params["gd_login_email"]
    });

    //console.log(this.props.navigation.state.params.naviBackProp.navigate('BeforeGDLoginScreen'))

    //
    this.buildDrive(this.props.screenProps.access_token);

    //Open Drawer
    //this.props.screenProps.gdRootNav.openDrawer()

    //Navigate Among The GD Stack
    //this.props.navigation.navigate('AfterGDLoginScreen')
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(
      "inside UNSAFE_componentWillReceiveProps of AfterGDLoginScreen"
    );
    if (this.state.selName === nextProps.navigation.state.params["selName"]) {
      this.setState({ isLoading: false });
    } else {
      this.setState({
        isLoading: nextProps.navigation.state.params["isLoading"],
        selName: nextProps.navigation.state.params["selName"],
        selectedItem: nextProps.navigation.state.params["selectedItem"],
        activity_text: nextProps.navigation.state.params["activity_text"],
        showUpData: []
      });
      this.fetchSelData(nextProps.navigation.state.params["selName"], 0, 20);
    }
  }

  buildDrive = async(access_token) => {
    console.log("Building drive");
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/hi/buildDriveForDrive?authName=GOOGLE DRIVE",
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
        if(responseJson.status==="200"){
        //console.log(responseJson);
        this.setState({ activity_text: "Fetching Data.." });
        this.fetchData();
      }
      else{
        this.setState({ activity_text: "We Got An Attempt Of Logging In To Your Account From Another Device..\nYou Need To Login In order to save your privacy" });
        this.logoutFromDrive();
      }
      });
  };

  selectContent = itemId => {
    //console.log(itemId);
    this.setState({ selectedItem: itemId });
    this._drawer.close();
  };

  fetchData = () => {
    console.log("fetching segregates")
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/hi/gd_segregates?authName=GOOGLE DRIVE",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson);
        let data = JSON.parse(responseJson.data);
        //console.log(data);

        this.setState({
          isLoading: false,
          isDrawerContentLoading: false,
          segregates: responseJson.segregates,
          showUpData: data["data"],
          selName: data["name"]
        });
        console.log("state set");
        //this.setState({ isLoading: false });
      });
  };

  selectContent = (selectedItem, selName) => {
    console.log("selecting content");
    this._drawer.close();
    if(selName==="Folder View"){
      console.log("Folder View")
      this.props.navigation.state.params.naviBackProp.navigate('FolderView',{
        gd_access_token: this.state.gd_access_token,
        gd_id_token: this.state.gd_id_token,
        gd_token_info_uri: this.state.gd_token_info_uri,
        gd_img_url: this.state.gd_img_url,
        gd_login_email: this.state.gd_login_email
      })
    }

    else{

    this.props.navigation.state.params.naviBackProp.navigate(
      "AfterGDLoginScreen",
      {
        isLoading: true,
        activity_text: "Fetching Data For " + selName,
        selectedItem: selectedItem,
        selName: selName,
        gd_access_token: this.state.gd_access_token,
        gd_id_token: this.state.gd_id_token,
        gd_token_info_uri: this.state.gd_token_info_uri,
        gd_img_url: this.state.gd_img_url,
        gd_login_email: this.state.gd_login_email
      }
    );
  }
  };

  openFile = (fileId, embedLink) => {
    console.log("Opening " + embedLink);
    //this.setState({webView:true, currentEmbedLink:embedLink})
    this.props.navigation.state.params.naviBackProp.navigate("WebView1", {
      currentEmbedLink: embedLink
    });
  };

  openOverlay = (
    fileId,
    embedLink,
    title,
    created,
    modifiedDate,
    editable,
    version
  ) => {
    console.log("opening overlay");
    this.setState({
      overlayVisible: true,
      curr_fileId: fileId,
      curr_embedLink: embedLink,
      curr_title: title,
      curr_created: created,
      curr_modifiedDate: modifiedDate,
      curr_editable: editable,
      curr_version: version
    });
  };

  onSwipeDown = () => {
    this.setState({
      overlayVisible: false,
      curr_fileId: null,
      curr_embedLink: null,
      curr_title: null,
      curr_created: null,
      curr_modifiedDate: null,
      curr_editable: true,
      curr_version:null,
    });
  };
  onClose = () => {
    this.setState({
      overlayVisible: false,
      curr_fileId: null,
      curr_embedLink: null,
      curr_title: null,
      curr_created: null,
      curr_modifiedDate: null,
      curr_editable: true,
      curr_version:null,
    });
  };

  shareFile = fileId => {
    const shareOptions = {
        title: 'Share via',
        message: 'Hey I am sharing this via Workspace!! Join now and become powerful enough in your data access!!\n',
        url: 'https://drive.google.com/file/d/'+fileId+'/view?usp=sharing',
        showAppsToView:true
    };
    Share.open(shareOptions).then((res) => { console.log(res) })
    .catch((err) => { err && console.log(err); });
    console.log("Deleting " + fileId);
  };

  async logoutFromStorage() {
    const userStates = await AsyncStorage.getItem("userStates");
    let userStates1 = JSON.parse(userStates);

    delete userStates1[this.state.user]["gd_img_url"];
    delete userStates1[this.state.user]["gd_access_token"];
    delete userStates1[this.state.user]["gd_id_token"];
    delete userStates1[this.state.user]["gd_login_email"];
    delete userStates1[this.state.user]["gd_token_info_uri"];

    await AsyncStorage.setItem("userStates", JSON.stringify(userStates1));
    await AsyncStorage.removeItem(this.state.user + "gd_selected_segregates");

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "BeforeGDLoginScreen"
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
        authName: "GOOGLE DRIVE"
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        if (responseJson.status === "200") {
          this.logoutFromStorage();
        } else {
          this.dropDownAlertRef.alertWithType(
            "error",
            "Error",
            "Some Error Occured While Logging You Out.. Please Try Again Later!!"
          );
          this.logoutFromStorage();
        }
      });
  };

  renderIcon = type => {
    let itemName = "";
    if (type.split("/").length === 1) {
      itemName = type.split("/")[0].toLowerCase();
    } else {
      itemName = type.split("/")[type.split("/").length - 2].toLowerCase();
    }
    //console.log(itemName);

    let icon = "file-xml";
    if (itemName === "application") {
      let otherPart = type.split("/")[type.split("/").length - 1].toLowerCase();
      if (
        otherPart === "x-gzip" ||
        otherPart === "x-zip-compressed" ||
        otherPart === "zip"
      ) {
        icon = this.state.extentionsDict.zip.logo;
      } else if (otherPart === "json" || otherPart === "geo+json") {
        icon = this.state.extentionsDict.json.logo;
      } else if (otherPart === "pdf") {
        icon = this.state.extentionsDict.pdf.logo;
      } else if (otherPart === "octect-stream") {
        icon = this.state.extentionsDict.document.logo;
      } else {
        icon = this.state.extentionsDict.code.logo;
      }
    } else if (itemName === "video") {
      icon = this.state.extentionsDict.video.logo;
    } else if (itemName === "audio") {
      icon = this.state.extentionsDict.music.logo;
    } else if (itemName === "image") {
      icon = this.state.extentionsDict.image.logo;
    } else if (itemName === "text") {
      icon = this.state.extentionsDict.text.logo;
    } else if (itemName === "form") {
      icon = this.state.extentionsDict.form.logo;
    } else if (itemName === "document") {
      icon = this.state.extentionsDict.word.logo;
    } else if (itemName === "presentation") {
      icon = this.state.extentionsDict.presentation.logo;
    } else if (itemName === "spreadsheet" || itemName === "sheet") {
      icon = this.state.extentionsDict.excel.logo;
    } else {
      icon = this.state.extentionsDict.others.logo;
    }
    return icon;
  };

  fetchSelData = (selName, startIndex, endIndex) => {
    console.log("fetching " + selName);

    fetch(
      "https://shielded-dusk-55059.herokuapp.com/hi/gd_selected_segregates?authName=GOOGLE DRIVE&selName=" +
        selName +
        "&startIndex=" +
        startIndex +
        "&endIndex=" +
        endIndex,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          showUpData: [
            ...this.state.showUpData,
            ...JSON.parse(responseJson.data)
          ],
          isLoading: false,
          startIndex: startIndex,
          endIndex: endIndex
        });
        //console.log(JSON.parse(responseJson.data))
      });
  };

  showWebView = () =>{
    let embedLink = this.state.curr_embedLink
    this.setState({
      overlayVisible: false,
      curr_fileId: null,
      curr_embedLink: null,
      curr_title: null,
      curr_created: null,
      curr_modifiedDate: null,
      curr_editable: true,
      curr_version:null,
    });

    this.props.navigation.state.params.naviBackProp.navigate("WebView1", {
      currentEmbedLink: embedLink
    });
  }

  loadMoreData = () => {
    // console.log(
    //   this.state.startIndex +
    //     " " +
    //     this.state.endIndex +
    //     " " +
    //     this.state.selName
    // );
    this.fetchSelData(
      this.state.selName,
      this.state.startIndex + 20,
      this.state.endIndex
    );
  };

  render() {
    const config = {
      velocityThreshold: 0.5,
      directionalOffsetThreshold: 80
    };
    if (this.state.isLoading) {
      return (
        <Drawer
          type="overlay"
          ref={ref => (this._drawer = ref)}
          content={
            <DrawerContents
              navProps={this.props.navigation.state.params.naviBackProp}
              selectContent={this.selectContent}
              selectedItem={this.state.selectedItem}
              logoutFromDrive={this.logoutFromDrive.bind(this)}
              user={this.state.user}
              segregates={this.state.segregates}
              isLoading={this.state.isDrawerContentLoading}
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
              headerTitle="Your Drive"
              leftComponent={
                <TouchableOpacity
                  onPress={() => {
                    this.props.screenProps.gdRootNav.openDrawer();
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
                      uri: this.state.gd_img_url
                    }}
                  />
                </TouchableOpacity>
              }
              height={60}
              statusBarHidden={true}
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
        </Drawer>
      );
    } else {
      //console.log(this.state.showUpData);
      return (
        <Drawer
          type="overlay"
          ref={ref => (this._drawer = ref)}
          content={
            <DrawerContents
              navProps={this.props.navigation.state.params.naviBackProp}
              selectContent={this.selectContent}
              selectedItem={this.state.selectedItem}
              logoutFromDrive={this.logoutFromDrive.bind(this)}
              user={this.state.user}
              segregates={this.state.segregates}
              isLoading={this.state.isDrawerContentLoading}
              reload={this.fetchData}
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
              headerTitle="Your Drive"
              leftComponent={
                <TouchableOpacity
                  onPress={() => {
                    this.props.screenProps.gdRootNav.openDrawer();
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
                      uri: this.state.gd_img_url
                    }}
                  />
                </TouchableOpacity>
              }
              height={60}
              statusBarHidden={true}
            />
            <FlatList
              data={this.state.showUpData}
              renderItem={({ item }) => (
                <View
                  style={{ flex: 1 }}
                  key={item.alternateLink.split("/")[5]}
                >
                  <TouchableOpacity
                    style={{
                      flex: 0.6
                    }}
                    onLongPress={() => {
                      this.openOverlay(
                        item.alternateLink.split("/")[5],
                        item.embedLink,
                        item.title,
                        item.created,
                        item.modifiedDate,
                        item.editable,
                        item.version
                      );
                    }}
                  >
                    <Card
                      style={{
                        elevation: 2,
                        borderRadius: 5,
                        shadowOffset: 5
                      }}
                    >
                      <View style={{ flexDirection: "row",flexWrap: "wrap" }}>
                        <Icon
                          size={25}
                          name={this.renderIcon(item.type)}
                          style={{ marginTop: 11, marginLeft: 10 }}
                        />

                        <Text
                          style={{
                            marginTop: 8,
                            marginLeft: 20,
                            fontSize: 20,
                            fontStyle: "italic",
                            fontWeight: "bold",

                          }}
                        >
                          {item.title}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: 70,
                          marginTop: 5
                        }}
                      >
                        <Icon name="file-document-edit" size={15} />

                        <Text
                          style={{
                            marginLeft: 5,
                            marginTop: -2,
                            marginRight: 20,
                            fontSize: 15,
                            color: "grey",
                            fontWeight: "bold"
                          }}
                        >
                          {" "}
                          {moment(item.created).fromNow()}
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            this.openFile(
                              item.alternateLink.split("/")[5],
                              item.alternateLink
                            );
                          }}
                        >
                          <Icon
                            size={25}
                            name="web"
                            style={{
                              marginTop: -10,
                              marginLeft: 150,
                              marginBottom: 5,
                              color: "#00b5ec"
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </View>
              )}
              ListFooterComponent={
                <View>
                  <Text />
                  <ActivityIndicator
                    animating={true}
                    size="small"
                    style={{ marginBottom: 10 }}
                    hidesWhenStopped
                    color={Colors.blue800}
                  />
                </View>
              }
              onEndReachedThreshold={0.5}
              onEndReached={({ distanceFromEnd }) => {
                this.loadMoreData();
              }}
              keyExtractor={item => item.alternateLink.split("/")[5]}
            />

            <GestureRecognizer onSwipeDown={this.onSwipeDown} config={config}>
              <View style={{ flex: 1 }}>
                <Overlay
                  visible={this.state.overlayVisible}
                  onClose={this.onClose}
                  containerStyle={{
                    elevation: 15,
                    borderRadius: 20,
                    padding: 20,
                    borderColor: "black",
                    borderSize: 2,
                    shadowOffset: 5,
                    marginTop: 100,
                    backgroundColor: "#313340",
                    shadowColor: "black",
                    color: "#313340",
                    marginBottom: -15
                  }}
                  closeOnTouchOutside
                  animationType="fadeInUp"
                >
                  <View>
                    <TouchableOpacity
                      style={{
                        flex: 1
                      }}
                    >
                      <Card
                        style={{
                          marginTop: -25,
                          marginBottom: -25,

                          elevation: 15,
                          borderRadius: 10,
                          padding: 10,
                          borderColor: "black",
                          borderSize: 2,
                          shadowOffset: 5,
                          width: 380,

                          shadowColor: "black"
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <CardTitle
                            title={this.state.curr_title}
                            subtitle="You Can Select The Link At Once With Multiple Friends From Any Platform!!"
                          />
                          <Icon
                            size={20}
                            name="google-drive"
                            style={{ marginRight: 20, marginTop: 22 }}
                          />
                        </View>
                        <View style={{ flex: 1, marginTop: 10 }}>
                          <View
                            style={{ flexDirection: "row", marginLeft: 15 }}
                          >
                            <Icon name="file-document-edit" size={25} />
                            <Text
                              style={{
                                marginLeft: 5,
                                marginTop: -2,
                                marginRight: 20,
                                fontSize: 20,
                                fontWeight: "bold"
                              }}
                            >
                              Created -
                            </Text>
                            <Text
                              style={{
                                marginLeft: -10,
                                marginTop: -2,
                                fontSize: 20,
                                color: "grey",
                                fontWeight: "bold"
                              }}
                            >
                              {moment(this.state.curr_created).fromNow()}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: 15,
                              marginTop: 15
                            }}
                          >
                            <Icon name="clock-end" size={25} />
                            <Text
                              style={{
                                marginLeft: 7,
                                marginTop: -2,
                                marginRight: 20,
                                fontSize: 20,
                                fontWeight: "bold"
                              }}
                            >
                              Last Edited -
                            </Text>
                            <Text
                              style={{
                                marginLeft: -10,
                                marginTop: -2,
                                fontSize: 20,
                                color: "grey",
                                fontWeight: "bold"
                              }}
                            >
                              {moment(this.state.curr_modifiedDate).fromNow()}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: 15,
                              marginTop: 15
                            }}
                          >
                            <Icon name="circle-edit-outline" size={25} />
                            <Text
                              style={{
                                marginLeft: 7,
                                marginTop: -2,
                                marginRight: 20,
                                fontSize: 20,
                                fontWeight: "bold"
                              }}
                            >
                              Editable -
                            </Text>
                            <Text
                              style={{
                                marginLeft: -10,
                                marginTop: -2,
                                fontSize: 20,
                                color: "grey",
                                fontWeight: "bold"
                              }}
                            >
                              {this.state.curr_editable
                                .toString()
                                .toUpperCase()}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: 15,
                              marginTop: 15
                            }}
                          >
                            <Icon name="book-multiple" size={25} />
                            <Text
                              style={{
                                marginLeft: 7,
                                marginTop: -2,
                                marginRight: 20,
                                fontSize: 20,
                                fontWeight: "bold"
                              }}
                            >
                              Version -
                            </Text>
                            <Text
                              style={{
                                marginLeft: -10,
                                marginTop: -2,
                                fontSize: 20,
                                color: "grey",
                                fontWeight: "bold"
                              }}
                            >
                              {this.state.curr_version}
                            </Text>
                          </View>
                          <View style={{flexDirection:'row', marginTop:40, marginLeft:70}}>
                          <Button
                            icon={<Icon name="eye" size={20} color="white" />}
                            title="  View  "
                            raised
                            buttonStyle={{
                              borderRadius: 5,

                            }}
                            containerStyle={{ marginLeft: 10 }}
                            onPress={this.showWebView.bind(this)}
                          />
                          <Button
                            icon={<Icon name="share" size={20} color="white" />}
                            title="  Share  "
                            raised
                            buttonStyle={{
                              borderRadius: 5,
                              backgroundColor: "#0DA66E"
                            }}
                            containerStyle={{ marginLeft: 20 }}
                            onPress={() => {this.shareFile(this.state.curr_fileId)}}
                          />
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  </View>
                </Overlay>
              </View>
            </GestureRecognizer>
          </View>
        </Drawer>
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

const drawerStyles = {
  drawer: { shadowColor: "black", backgroundColor: "white", shadowRadius: 3 },
  main: { paddingLeft: 3 }
};
