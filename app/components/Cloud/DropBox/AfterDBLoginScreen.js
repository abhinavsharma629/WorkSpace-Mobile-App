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
import DrawerContents from "./DrawerContents";
import Share from "react-native-share";

export default class AfterDBLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: null,
      isLoading: true,
      user: null,
      db_access_token: null,
      db_img_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQc05TO0nD7AWyh_xtT9n8TUvkck5oI9veXXlYELMpFvckx3kvIA&s",
      db_login_email: null,
      db_id_token: null,
      activity_text:
        "Building Your Dropbox!!\nThis Might Take A While If You Are New Here!!\n Please Be Patient!!",
      selectedItem: 0,
      isLoading1:false,
      segregates: [],
      showUpData: [],
      selName: null,
      isDrawerContentLoading: true,
      webView: false,
      currentEmbedLink: "",
      startIndex: 0,
      curr_path: null,
      overlayVisible: false,
      curr_size: null,
      curr_fileId: null,
      curr_created: null,
      curr_shared: true,
      curr_name: null,
      curr_modifiedServer: null,
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
    console.log("inside componentDidMount of Main AfterDBLoginScreen");
    console.log(this.props.screenProps.access_token);

    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user,
      db_access_token: this.props.navigation.state.params["db_access_token"],
      db_id_token: this.props.navigation.state.params["db_id_token"],
      db_img_url: this.props.navigation.state.params["db_img_url"],
      db_login_email: this.props.navigation.state.params["db_login_email"]
    });

    //console.log(this.props.navigation.state.params.naviBackProp.navigate('BeforeDBLoginScreen'))

    //
    this.buildDrive(this.props.screenProps.access_token);

    //Open Drawer
    //this.props.screenProps.dbRootNav.openDrawer()

    //Navigate Among The DB Stack
    //this.props.navigation.navigate('AfterDBLoginScreen')
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(
      "inside UNSAFE_componentWillReceiveProps of AfterDBLoginScreen"
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
      "https://shielded-dusk-55059.herokuapp.com/hi/buildDropboxForDropbox?authName=DROPBOX",
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
        console.log(responseJson);
        this.setState({ activity_text: "Fetching Data.." });
        this.fetchData();
      });
  };

  selectContent = itemId => {
    //console.log(itemId);
    this.setState({ selectedItem: itemId });
    this._drawer.close();
  };

  fetchData = async() => {
    console.log("collecting segregates")
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/hi/db_segregates?authName=DROPBOX",
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
        console.log(data);

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
    if (selName === "Folder View") {
      console.log("Folder View");
      this.props.navigation.state.params.naviBackProp.navigate("FolderView", {
        db_access_token: this.state.db_access_token,
        db_id_token: this.state.db_id_token,
        db_img_url: this.state.db_img_url,
        db_login_email: this.state.db_login_email,
      });
    } else {
      this.props.navigation.state.params.naviBackProp.navigate(
        "AfterDBLoginScreen",
        {
          isLoading: true,
          activity_text: "Fetching Data For " + selName,
          selectedItem: selectedItem,
          selName: selName
        }
      );
    }
  };

  openFile = (filePath, fileId) => {
    console.log("Opening " + filePath);
    //this.setState({webView:true, currentEmbedLink:embedLink})
    this.props.navigation.state.params.naviBackProp.navigate("WebView1", {
      currentEmbedLink: filePath,
      access_token: this.state.db_access_token,
      curr_fileId: fileId
    });
  };

  openOverlay = (fileId, name, created, modifiedServer, size, shared, path) => {
    console.log("opening overlay");
    this.setState({
      overlayVisible: true,
      curr_fileId: fileId,
      curr_name: name,
      curr_created: created,
      curr_modifiedServer: modifiedServer,
      curr_size: size,
      curr_shared: shared,
      curr_path: path
    });
  };

  onSwipeDown = () => {
    this.setState({
      overlayVisible: false,
      curr_fileId: null,
      curr_name: null,
      curr_size: null,
      curr_created: null,
      curr_modifiedServer: null,
      curr_shared: true,
      curr_version: null
    });
  };
  onClose = () => {
    this.setState({
      overlayVisible: false,
      curr_fileId: null,
      curr_name: null,
      curr_size: null,
      curr_created: null,
      curr_modifiedServer: null,
      curr_shared: true,
      curr_version: null
    });
  };

  shareFile = path => {
    this.setState({
      isLoading1: true,
      activity_text: "Generating A Sharable Link"
    });
    fetch("https://api.dropboxapi.com/2/sharing/create_shared_link", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.db_access_token
      },
      body: JSON.stringify({
        path: path
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ isLoading1: false });
        const shareOptions = {
          title: "Share via",
          message:
            "Hey I am sharing this via Workspace!! Join now and become powerful enough in your data access!!\n",
          url: responseJson.url,
          showAppsToView: true
        };
        Share.open(shareOptions)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
      });
  };

  async logoutFromStorage() {
    const userStates = await AsyncStorage.getItem("userStates");
    let userStates1 = JSON.parse(userStates);

    delete userStates1[this.state.user]["db_img_url"];
    delete userStates1[this.state.user]["db_access_token"];
    delete userStates1[this.state.user]["db_id_token"];
    delete userStates1[this.state.user]["db_login_email"];

    await AsyncStorage.setItem("userStates", JSON.stringify(userStates1));
    await AsyncStorage.removeItem(this.state.user + "db_selected_segregates");

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "BeforeDBLoginScreen"
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
        authName: "DROPBOX"
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

  fetchSelData = (selName, startIndex, endIndex) => {
    console.log("fetching " + selName);

    fetch(
      "https://shielded-dusk-55059.herokuapp.com/hi/db_selected_segregates?authName=DROPBOX&selName=" +
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

  showWebView = () => {
    let path = this.state.curr_path;
    let fileId = this.state.curr_fileId;
    this.setState({
      overlayVisible: false,
      curr_fileId: null,
      curr_name: null,
      curr_size: null,
      curr_created: null,
      curr_modifiedServer: null,
      curr_shared: true
    });

    this.props.navigation.state.params.naviBackProp.navigate("WebView1", {
      currentEmbedLink: path,
      access_token: this.state.db_access_token,
      curr_fileId: fileId
    });
  };

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

    if(this.state.isLoading1){
      return(
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
              headerTitle="Your Dropbox"
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
                      uri: this.state.db_img_url
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
                elevation: 5,
                textAlign: "center"
              }}
            >
              {this.state.activity_text}
            </Text>
          </View>
        </Drawer>
      );

    }
    else if (this.state.isLoading) {
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
              headerTitle="Your Dropbox"
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
                      uri: this.state.db_img_url
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
              headerTitle="Your Dropbox"
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
                      uri: this.state.db_img_url
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
                <View style={{ flex: 1 }} key={item.id}>
                  <TouchableOpacity
                    style={{
                      flex: 0.6
                    }}
                    onLongPress={() => {
                      this.openOverlay(
                        item.id,
                        item.name,
                        item.clientModifiedDate,
                        item.serverModifiedDate,
                        item.size,
                        item.hasSharedMembers,
                        item.path
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
                      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        <Icon
                          size={25}
                          name={this.renderIcon(item.name)}
                          style={{ marginTop: 11, marginLeft: 10 }}
                        />

                        <Text
                          style={{
                            marginTop: 8,
                            marginLeft: 20,
                            fontSize: 20,
                            fontStyle: "italic",
                            fontWeight: "bold"
                          }}
                        >
                          {item.name}
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
                          {moment(item.clientModifiedDate).fromNow()}
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            this.openFile(item.path, item.id);
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
              keyExtractor={item => item.id}
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
                            title={this.state.curr_name}
                            subtitle="You Can Select The Link At Once With Multiple Friends From Any Platform!!"
                          />
                          <Icon
                            size={20}
                            name="dropbox"
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
                              {moment(this.state.curr_modifiedServer).fromNow()}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: 15,
                              marginTop: 15
                            }}
                          >
                            <Icon name="share-variant" size={25} />
                            <Text
                              style={{
                                marginLeft: 7,
                                marginTop: -2,
                                marginRight: 20,
                                fontSize: 20,
                                fontWeight: "bold"
                              }}
                            >
                              Shared -
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
                              {this.state.curr_shared.toString().toUpperCase()}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: 15,
                              marginTop: 15
                            }}
                          >
                            <Icon
                              name="resize-bottom-right"
                              size={32}
                              style={{ marginLeft: -5, marginTop: -10 }}
                            />
                            <Text
                              style={{
                                marginLeft: 7,
                                marginTop: -2,
                                marginRight: 20,
                                fontSize: 20,
                                fontWeight: "bold"
                              }}
                            >
                              Size -
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
                              {this.state.curr_size} bytes
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 40,
                              marginLeft: 70
                            }}
                          >
                            <Button
                              icon={<Icon name="eye" size={20} color="white" />}
                              title="  View  "
                              raised
                              buttonStyle={{
                                borderRadius: 5
                              }}
                              containerStyle={{ marginLeft: 10 }}
                              onPress={this.showWebView.bind(this)}
                            />
                            <Button
                              icon={
                                <Icon name="share" size={20} color="white" />
                              }
                              title="  Share  "
                              raised
                              buttonStyle={{
                                borderRadius: 5,
                                backgroundColor: "#0DA66E"
                              }}
                              containerStyle={{ marginLeft: 20 }}
                              onPress={() => {
                                this.shareFile(this.state.curr_path);
                              }}
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
