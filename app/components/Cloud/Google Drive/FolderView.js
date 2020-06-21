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
import FilePickerManager from "react-native-file-picker";

export default class FolderView extends Component {
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
      activity_text: "Initializing Your Folder View!!",
      startIndex: 0,
      endIndex: 20,
      overlayVisible: false,
      curr_title: null,
      curr_fileId: null,
      curr_created: null,
      curr_version: null,
      curr_editable: true,
      curr_embedLink: null,
      curr_modifiedDate: null,
      areChildren: false,
      showUpData1: {},
      currentAccessId: "ROOT FOLDER",
      showUpData: {},
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
    console.log("inside componentDidMount of FolderView");
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
    try {
      if ("currentAccessId" in this.props.navigation.state.params) {
        console.log("Show this folder/file");
        this.setState({
          currentAccessId: this.props.navigation.state.params[
            "currentAccessId"
          ],
          startIndex: this.props.navigation.state.params["startIndex"],
          endIndex: this.props.navigation.state.params["endIndex"]
        });
        this.fetchHeirarchicalData(
          this.props.screenProps.access_token,
          this.props.navigation.state.params["currentAccessId"],
          0,
          20,
          this.state.showUpData1
        );
      } else {
        this.fetchRootFolder(
          this.props.screenProps.access_token,
          0,
          20,
          this.state.showUpData
        );
        console.log("Access Root Folder");
        //this.fetchRootFolder();
      }
    } catch (error) {
      console.log("Caught in Catch!!");
      this.fetchRootFolder(
        this.props.screenProps.access_token,
        0,
        20,
        this.state.showUpData
      );
      console.log("Access Root Folder");
    }

    //this.props.navigation.push('FolderView')
  }

  fetchRootFolder = (access_token, startIndex, endIndex, showUpData) => {
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/hi/rootFolderDataForDrive",
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
        //console.log(responseJson);
        if (responseJson.status === "200") {
          //console.log(JSON.parse(responseJson.rootData));
          this.setState({
            isLoading: false,
            showUpData: { ...showUpData, ...JSON.parse(responseJson.rootData) }
          });
        } else {
          console.log("error");
        }
      });
  };

  fetchHeirarchicalData = (
    access_token,
    currentAccessId,
    startIndex,
    endIndex,
    showUpData
  ) => {
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/hi/hierarchicalFolderDataForDrive?currentAccessId=" +
        currentAccessId +
        "&startIndex=" +
        startIndex +
        "&endIndex=" +
        endIndex,
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
        //console.log(responseJson);
        if (responseJson.status === "200") {
          //console.log(JSON.parse(responseJson.hierarchicalData));
          this.setState({
            isLoading: false,
            showUpData1: {
              ...showUpData,
              ...JSON.parse(responseJson.hierarchicalData)
            },
            areChildren: true,
            startIndex: startIndex,
            endIndex: endIndex
          });
        } else {
          console.log("error");
        }
      });
  };

  openFile = embedLink => {
    try {
      this.props.navigation.navigate("WebView1", {
        currentEmbedLink: embedLink
      });
    } catch (error) {
      this.props.navigation.state.params.navProps.navigate("WebView1", {
        currentEmbedLink: embedLink
      });
    }
  };

  openDetails = (
    fileId,
    embedLink,
    title,
    created,
    modifiedDate,
    editable,
    version
  ) => {
    console.log("opening details for " + fileId);
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
      curr_version: null
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
      curr_version: null
    });
  };

  showWebView = () => {
    let embedLink = this.state.curr_embedLink;
    this.setState({
      overlayVisible: false,
      curr_fileId: null,
      curr_embedLink: null,
      curr_title: null,
      curr_created: null,
      curr_modifiedDate: null,
      curr_editable: true,
      curr_version: null
    });

    try {
      this.props.navigation.state.params.naviBackProp.navigate("WebView1", {
        currentEmbedLink: embedLink
      });
    } catch (error) {
      this.props.navigation.navigate("WebView1", {
        currentEmbedLink: embedLink
      });
    }
  };

  shareFile = fileId => {
    const shareOptions = {
      title: "Share via",
      message:
        "Hey I am sharing this via Workspace!! Join now and become powerful enough in your data access!!\n",
      url: "https://drive.google.com/file/d/" + fileId + "/view?usp=sharing",
      showAppsToView: true
    };
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
    console.log("Deleting " + fileId);
  };

  openFolder = folderId => {
    console.log("redirecting to folder " + folderId);
    this.props.navigation.push("FolderView", {
      currentAccessId: folderId,
      startIndex: 0,
      endIndex: 20,
      gd_access_token: this.state.gd_access_token,
      gd_id_token: this.state.gd_id_token,
      gd_img_url: this.state.gd_img_url,
      gd_login_email: this.state.gd_login_email,
      gd_token_info_uri: this.state.gd_token_info_uri
    });

    // try {
    //   this.props.navigation.state.params.naviBack.push("FolderView", {
    //     user: this.state.user,
    //     access_token:this.state.access_token,
    //     currentAccessId:folderId,
    //     navi:this.this.props.navigation.state.params.naviBack
    //   });
    // } catch (error) {
    //   console.log("error navigating")
    //
    // }
  };

  chooseFile = () => {
    Alert.alert(
      "Feature Still Under Development!!",
      "Please Be Patient. We Will Soon Be Back With An Interesting Update For Your Drive!!"
    );
    // FilePickerManager.showFilePicker(null, response => {
    //   console.log("Response = ", response);
    //
    //   if (response.didCancel) {
    //     console.log("User cancelled file picker");
    //   } else if (response.error) {
    //     console.log("FilePickerManager Error: ", response.error);
    //   } else {
    //     console.log(response)
    //     //this.clickHandler1(response);
    //     Alert.alert("Feature Still Under Development!!", "Please Be Patient. We Will Soon Be Back With An Interesting Update For Your Drive!!")
    //   }
    // });
  };

  loadMoreHierarchical = () => {
    this.fetchHeirarchicalData(
      this.state.access_token,
      this.state.currentAccessId,
      this.state.endIndex + 1,
      this.state.endIndex + 20,
      this.state.showUpData1
    );
  };

  loadMoreRoot = () => {
    this.fetchRootFolder(
      this.state.access_token,
      this.state.endIndex + 1,
      this.state.endIndex + 20,
      this.state.showUpData
    );
  };

  makeRootFolderData = () => {
    let rootData = this.state.showUpData;
    console.log(rootData);
    let rootFolders = [];
    let tempArray = [];
    let c = 1;
    for (let i in rootData) {
      //console.log(rootData[i][0]);
      if (c % 2 == 0 || c === Object.keys(rootData).length) {
        if (rootData[i][0]["type"] === "folder") {
          rootFolders.push(
            <View style={{ flexDirection: "row" }}>
              {tempArray[0]}

              <View style={{ marginLeft: 70 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.openFolder(
                      rootData[i][0]["alternateLink"].split("/")[5]
                    );
                  }}
                >
                  <Icon
                    name="folder-google-drive"
                    size={140}
                    style={{ color: "grey" }}
                  />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", marginTop: -15 }}>
                  <Text
                    style={{
                      flex: 1,
                      flexWrap: "wrap",
                      marginLeft: 20,
                      fontSize: 15,
                      fontWeight: "bold",
                      fontStyle: "italic"
                    }}
                  >
                    {rootData[i][0]["title"]}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.openDetails(
                        rootData[i][0]["alternateLink"].split("/")[5],
                        rootData[i][0]["embedLink"],
                        rootData[i][0]["title"],
                        rootData[i][0]["created"],
                        rootData[i][0]["modifiedDate"],
                        rootData[i][0]["editable"],
                        rootData[i][0]["version"]
                      );
                    }}
                  >
                    <Icon
                      name="dots-vertical"
                      size={25}
                      style={{ marginLeft: 30, marginTop: -5 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        } else {
          let icon = [...this.renderIcon(rootData[i][0]["type"])];
          let icon1 = icon[0];
          let color = icon[1];

          //console.log(icon1 + " " + color);

          rootFolders.push(
            <View style={{ flexDirection: "row" }}>
              {tempArray[0]}

              <View style={{ marginLeft: 70 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.openFile(rootData[i][0]["embedLink"]);
                  }}
                >
                  <Icon name={icon1} size={120} style={{ color: color }} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", marginTop: -10 }}>
                  <Text
                    style={{
                      flex: 1,
                      flexWrap: "wrap",
                      marginLeft: 30,
                      marginTop: 10,
                      fontSize: 15,
                      marginRight: -20,
                      fontWeight: "bold",
                      fontStyle: "italic"
                    }}
                  >
                    {rootData[i][0]["title"].substring(0, 13)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.openDetails(
                        rootData[i][0]["alternateLink"].split("/")[5],
                        rootData[i][0]["embedLink"],
                        rootData[i][0]["title"],
                        rootData[i][0]["created"],
                        rootData[i][0]["modifiedDate"],
                        rootData[i][0]["editable"],
                        rootData[i][0]["version"]
                      );
                    }}
                  >
                    <Icon
                      name="dots-vertical"
                      size={25}
                      style={{ marginLeft: 30, marginTop: 0 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }

        tempArray = [];
      } else {
        if (rootData[i][0]["type"] === "folder") {
          tempArray.push(
            <View style={{ marginLeft: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.openFolder(
                    rootData[i][0]["alternateLink"].split("/")[5]
                  );
                }}
              >
                <Icon
                  name="folder-google-drive"
                  size={140}
                  style={{ color: "grey" }}
                />
              </TouchableOpacity>
              <View style={{ flexDirection: "row", marginTop: -15 }}>
                <Text
                  style={{
                    flex: 1,
                    flexWrap: "wrap",
                    marginLeft: 20,
                    fontSize: 15,
                    fontWeight: "bold",
                    fontStyle: "italic"
                  }}
                >
                  {rootData[i][0]["title"]}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.openDetails(
                      rootData[i][0]["alternateLink"].split("/")[5],
                      rootData[i][0]["embedLink"],
                      rootData[i][0]["title"],
                      rootData[i][0]["created"],
                      rootData[i][0]["modifiedDate"],
                      rootData[i][0]["editable"],
                      rootData[i][0]["version"]
                    );
                  }}
                >
                  <Icon
                    name="dots-vertical"
                    size={25}
                    style={{ marginLeft: 30, marginTop: -5 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        } else {
          let icon = [...this.renderIcon(rootData[i][0]["type"])];
          let icon1 = icon[0];
          let color = icon[1];

          tempArray.push(
            <View style={{ marginLeft: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.openFile(rootData[i][0]["embedLink"]);
                }}
              >
                <Icon name={icon1} size={120} style={{ color: color }} />
              </TouchableOpacity>
              <View style={{ flexDirection: "row", marginTop: -15 }}>
                <Text
                  style={{
                    flex: 1,
                    flexWrap: "wrap",
                    marginLeft: 30,
                    marginTop: 10,
                    fontSize: 15,
                    marginRight: -20,
                    fontWeight: "bold",
                    fontStyle: "italic"
                  }}
                >
                  {rootData[i][0]["title"].substring(0, 13)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.openDetails(
                      rootData[i][0]["alternateLink"].split("/")[5],
                      rootData[i][0]["embedLink"],
                      rootData[i][0]["title"],
                      rootData[i][0]["created"],
                      rootData[i][0]["modifiedDate"],
                      rootData[i][0]["editable"],
                      rootData[i][0]["version"]
                    );
                  }}
                >
                  <Icon
                    name="dots-vertical"
                    size={25}
                    style={{ marginLeft: 30, marginTop: 0 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }
      }
      c += 1;
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {rootFolders}
          </View>
        </ScrollView>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Alert.alert(
              "Feature Still Under Development!!",
              "Please Be Patient. We Will Soon Be Back With An Interesting Update For Your Drive!!"
            );
          }}
          style={styles.TouchableOpacityStyle}
        >
          <Image
            source={require("../../../required_images/addq.png")}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this.chooseFile();
          }}
          style={styles.TouchableOpacityStyle1}
        >
          <Image
            source={require("../../../required_images/File3.png")}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>
      </View>
    );
  };

  makeChildrenFolderData = () => {
    let rootData = this.state.showUpData1;
    console.log(rootData);
    let rootFolders = [];
    let tempArray = [];
    let c = 1;
    for (let i in rootData) {
      //console.log(rootData[i][0]);
      if (c % 2 == 0 || c === Object.keys(rootData).length) {
        if (rootData[i]["type"] === "folder") {
          rootFolders.push(
            <View style={{ flexDirection: "row" }}>
              {tempArray}

              <View style={{ marginLeft: 70 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.openFolder(rootData[i]["alternateLink"].split("/")[5]);
                  }}
                >
                  <Icon
                    name="folder-google-drive"
                    size={140}
                    style={{ color: "grey" }}
                  />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", marginTop: -15 }}>
                  <Text
                    style={{
                      flex: 1,
                      flexWrap: "wrap",
                      marginLeft: 20,
                      fontSize: 15,
                      fontWeight: "bold",
                      fontStyle: "italic"
                    }}
                  >
                    {rootData[i]["title"]}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.openDetails(
                        rootData[i]["alternateLink"].split("/")[5],
                        rootData[i]["embedLink"],
                        rootData[i]["title"],
                        rootData[i]["created"],
                        rootData[i]["modifiedDate"],
                        rootData[i]["editable"],
                        rootData[i]["version"]
                      );
                    }}
                  >
                    <Icon
                      name="dots-vertical"
                      size={25}
                      style={{ marginLeft: 30, marginTop: -5 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        } else {
          let icon = [...this.renderIcon(rootData[i]["type"])];
          let icon1 = icon[0];
          let color = icon[1];

          //console.log(icon1 + " " + color);

          rootFolders.push(
            <View style={{ flexDirection: "row" }}>
              {tempArray}

              <View style={{ marginLeft: 70 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.openFile(rootData[i]["embedLink"]);
                  }}
                >
                  <Icon name={icon1} size={120} style={{ color: color }} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", marginTop: -10 }}>
                  <Text
                    style={{
                      flex: 1,
                      flexWrap: "wrap",
                      marginLeft: 30,
                      marginTop: 10,
                      fontSize: 15,
                      marginRight: -20,
                      fontWeight: "bold",
                      fontStyle: "italic"
                    }}
                  >
                    {rootData[i]["title"].substring(0, 13)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.openDetails(
                        rootData[i]["alternateLink"].split("/")[5],
                        rootData[i]["embedLink"],
                        rootData[i]["title"],
                        rootData[i]["created"],
                        rootData[i]["modifiedDate"],
                        rootData[i]["editable"],
                        rootData[i]["version"]
                      );
                    }}
                  >
                    <Icon
                      name="dots-vertical"
                      size={25}
                      style={{ marginLeft: 30, marginTop: 0 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }

        tempArray = [];
      } else {
        if (rootData[i]["type"] === "folder") {
          tempArray.push(
            <View style={{ marginLeft: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.openFolder(rootData[i]["alternateLink"].split("/")[5]);
                }}
              >
                <Icon
                  name="folder-google-drive"
                  size={140}
                  style={{ color: "grey" }}
                />
              </TouchableOpacity>
              <View style={{ flexDirection: "row", marginTop: -15 }}>
                <Text
                  style={{
                    flex: 1,
                    flexWrap: "wrap",
                    marginLeft: 20,
                    fontSize: 15,
                    fontWeight: "bold",
                    fontStyle: "italic"
                  }}
                >
                  {rootData[i]["title"]}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.openDetails(
                      rootData[i]["alternateLink"].split("/")[5],
                      rootData[i]["embedLink"],
                      rootData[i]["title"],
                      rootData[i]["created"],
                      rootData[i]["modifiedDate"],
                      rootData[i]["editable"],
                      rootData[i]["version"]
                    );
                  }}
                >
                  <Icon
                    name="dots-vertical"
                    size={25}
                    style={{ marginLeft: 30, marginTop: -5 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        } else {
          let icon = [...this.renderIcon(rootData[i]["type"])];
          let icon1 = icon[0];
          let color = icon[1];

          tempArray.push(
            <View style={{ marginLeft: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.openFile(rootData[i]["embedLink"]);
                }}
              >
                <Icon name={icon1} size={120} style={{ color: color }} />
              </TouchableOpacity>
              <View style={{ flexDirection: "row", marginTop: -15 }}>
                <Text
                  style={{
                    flex: 1,
                    flexWrap: "wrap",
                    marginLeft: 30,
                    marginTop: 10,
                    fontSize: 15,
                    marginRight: -20,
                    fontWeight: "bold",
                    fontStyle: "italic"
                  }}
                >
                  {rootData[i]["title"].substring(0, 13)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.openDetails(
                      rootData[i]["alternateLink"].split("/")[5],
                      rootData[i]["embedLink"],
                      rootData[i]["title"],
                      rootData[i]["created"],
                      rootData[i]["modifiedDate"],
                      rootData[i]["editable"],
                      rootData[i]["version"]
                    );
                  }}
                >
                  <Icon
                    name="dots-vertical"
                    size={25}
                    style={{ marginLeft: 30, marginTop: 0 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }
      }
      c += 1;
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {rootFolders}
          </View>
        </ScrollView>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Alert.alert(
              "Feature Still Under Development!!",
              "Please Be Patient. We Will Soon Be Back With An Interesting Update For Your Drive!!"
            );
          }}
          style={styles.TouchableOpacityStyle}
        >
          <Image
            source={require("../../../required_images/addq.png")}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this.chooseFile();
          }}
          style={styles.TouchableOpacityStyle1}
        >
          <Image
            source={require("../../../required_images/File3.png")}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.loadMoreHierarchical();
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginLeft: 0,
              marginBottom: 5,
              marginTop: 5,
              backgroundColor: "transparent"
            }}
          >
            <ActivityIndicator
              animating={true}
              size="small"
              hidesWhenStopped
              color={Colors.blue800}
            />
            <Text
              style={{
                fontSize: 17,
                color: "#4703A6",
                fontWeight: "bold",
                marginLeft: 10
              }}
            >
              Load More
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
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
    let color = "#555555";
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
        color = "#ED1D24";
        icon = this.state.extentionsDict.pdf.logo;
      } else if (otherPart === "octect-stream") {
        icon = this.state.extentionsDict.document.logo;
      } else {
        icon = this.state.extentionsDict.code.logo;
      }
    } else if (itemName === "video") {
      color = "#313340";
      icon = this.state.extentionsDict.video.logo;
    } else if (itemName === "audio") {
      color = "#313340";
      icon = this.state.extentionsDict.music.logo;
    } else if (itemName === "image") {
      color = "#313340";
      icon = this.state.extentionsDict.image.logo;
    } else if (itemName === "text") {
      icon = this.state.extentionsDict.text.logo;
    } else if (itemName === "form") {
      color = "#009925";
      icon = this.state.extentionsDict.form.logo;
    } else if (itemName === "document") {
      color = "#034C8C";
      icon = this.state.extentionsDict.word.logo;
    } else if (itemName === "presentation") {
      color = "#EEB211";
      icon = this.state.extentionsDict.presentation.logo;
    } else if (itemName === "spreadsheet" || itemName === "sheet") {
      color = "#009925";
      icon = this.state.extentionsDict.excel.logo;
    } else {
      icon = this.state.extentionsDict.others.logo;
    }
    return [icon, color];
  };

  render() {
    const config = {
      velocityThreshold: 0.5,
      directionalOffsetThreshold: 80
    };
    if (this.state.isLoading) {
      return (
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
              <TouchableOpacity>
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
              color: "#0DA66E",
              marginTop: 270,
              padding: 10,
              elevation: 5,
              fontWeight: "bold",
              fontSize: 15,
              textAlign: "center"
            }}
          >
            {this.state.activity_text}
          </Text>
        </View>
      );
    } else if (this.state.areChildren) {
      return (
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
              <TouchableOpacity>
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
          {this.makeChildrenFolderData()}
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
                        <View style={{ flexDirection: "row", marginLeft: 15 }}>
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
                            {this.state.curr_editable.toString().toUpperCase()}
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
                            icon={<Icon name="share" size={20} color="white" />}
                            title="  Share  "
                            raised
                            buttonStyle={{
                              borderRadius: 5,
                              backgroundColor: "#0DA66E"
                            }}
                            containerStyle={{ marginLeft: 20 }}
                            onPress={() => {
                              this.shareFile(this.state.curr_fileId);
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
      );
    } else {
      return (
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
              <TouchableOpacity>
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
          {this.makeRootFolderData()}
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
                        <View style={{ flexDirection: "row", marginLeft: 15 }}>
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
                            {this.state.curr_editable.toString().toUpperCase()}
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
                            icon={<Icon name="share" size={20} color="white" />}
                            title="  Share  "
                            raised
                            buttonStyle={{
                              borderRadius: 5,
                              backgroundColor: "#0DA66E"
                            }}
                            containerStyle={{ marginLeft: 20 }}
                            onPress={() => {
                              this.shareFile(this.state.curr_fileId);
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
    top: "40%"
  },
  TouchableOpacityStyle: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20
  },
  TouchableOpacityStyle1: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    left: 20,
    bottom: 20
  },

  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 60,
    height: 60
  }
});
