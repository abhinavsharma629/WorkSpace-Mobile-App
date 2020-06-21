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
import DialogInput from "react-native-dialog-input";
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
import RNFetchBlob from "rn-fetch-blob";
import FilePickerManager from "react-native-file-picker";

export default class FolderView extends Component {
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
      db_token_info_uri: null,
      activity_text: "Initializing Your Folder View!!",
      startIndex: 0,
      endIndex: 20,
      overlayVisible: false,
      isDialogVisible: false,
      isDialogVisible1: false,
      curr_fileId: null,
      curr_name: null,
      curr_created: null,
      curr_modifiedServer: null,
      curr_size: null,
      curr_shared: "",
      curr_path: null,
      curr_editable: "",
      areChildren: false,
      showUpData1: {},
      currentAccessId: "ROOT FOLDER",
      showUpData: [],
      currIcon: "cloud-download",
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

      db_access_token: this.props.navigation.state.params["db_access_token"],
      db_id_token: this.props.navigation.state.params["db_id_token"],
      db_img_url: this.props.navigation.state.params["db_img_url"],
      db_login_email: this.props.navigation.state.params["db_login_email"]
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
          this.state.showUpData
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
      "https://shielded-dusk-55059.herokuapp.com/hi/rootFolderDataForDropbox",
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
          let rootData = JSON.parse(responseJson.rootData);
          console.log(rootData["children"]);
          this.setState({
            isLoading: false,
            showUpData: [...showUpData, ...rootData["children"]]
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
      "https://shielded-dusk-55059.herokuapp.com/hi/hierarchicalFolderDataForDropbox?currentAccessId=" +
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
            showUpData: [
              ...showUpData,
              ...JSON.parse(responseJson.hierarchicalData)
            ],
            areChildren: true,
            startIndex: startIndex,
            endIndex: endIndex
          });
        } else {
          console.log("error");
          this.setState({
            isLoading: false,
            showUpData: [...showUpData],
            areChildren: true,
            startIndex: startIndex,
            endIndex: endIndex
          });
        }
      });
  };

  openFolder = folderId => {
    console.log("redirecting to folder " + folderId);
    this.props.navigation.push("FolderView", {
      currentAccessId: folderId,
      startIndex: 0,
      endIndex: 20,
      db_access_token: this.state.db_access_token,
      db_id_token: this.state.db_id_token,
      db_img_url: this.state.db_img_url,
      db_login_email: this.state.db_login_email
    });
  };

  openFile = (filePath, fileId) => {
    console.log("Opening " + filePath);
    try {
      this.props.navigation.navigate("WebView1", {
        currentEmbedLink: filePath,
        access_token: this.state.db_access_token,
        curr_fileId: fileId
      });
    } catch (error) {
      this.props.navigation.state.params.navProps.navigate("WebView1", {
        currentEmbedLink: filePath,
        access_token: this.state.db_access_token,
        curr_fileId: fileId
      });
    }
  };

  openDetails = (fileId, name, created, modifiedServer, size, shared, path) => {
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

  openOverlay = (
    fileId,
    name,
    created,
    modifiedServer,
    size,
    shared,
    path,
    type
  ) => {
    console.log("opening overlay");
    console.log(shared);
    let currIcon = "cloud-download";
    if (type === "file") {
      currIcon = "progress-download";
    }
    this.setState({
      overlayVisible: true,
      curr_fileId: fileId,
      curr_name: name,
      curr_created: created,
      curr_modifiedServer: modifiedServer,
      curr_size: size,
      curr_shared: shared,
      curr_path: path,
      currIcon: currIcon
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

    this.props.navigation.navigate("WebView1", {
      currentEmbedLink: path,
      access_token: this.state.db_access_token,
      curr_fileId: fileId
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

  loadMoreHierarchical = () => {
    this.fetchHeirarchicalData(
      this.state.access_token,
      this.state.currentAccessId,
      this.state.endIndex + 1,
      this.state.endIndex + 20,
      this.state.showUpData
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

  downloadData = () => {
    console.log(this.state.curr_path);
    if (this.state.currIcon === "cloud-download") {
      console.log("downloading folder as zip");
      const dirs = RNFetchBlob.fs.dirs;
      const android = RNFetchBlob.android;
      console.log(`${dirs.DownloadDir}/Workspace/` + this.state.curr_name);

      RNFetchBlob.config({
        addAndroidDownloads: {
          notification: true,
          title: this.state.curr_name,
          description: "Downloaded via Workspace",
          mime: "application/octect-stream",
          useDownloadManager: true,
          path: `${dirs.DownloadDir}/Workspace/` + this.state.curr_name
        }
      })
        .fetch("POST", "https://content.dropboxapi.com/2/files/download_zip", {
          "Dropbox-API-Arg": '{"path": "' + this.state.curr_path + '"}',
          Authorization: "Bearer " + this.state.db_access_token
        })
        .then(resp => {
          console.log(resp);
        })
        .catch(err => {
          console.log(err);
          console.log("error downloading");
        });
    } else {
      console.log("downloading file");

      const dirs = RNFetchBlob.fs.dirs;
      const android = RNFetchBlob.android;
      console.log(`${dirs.DownloadDir}/Workspace/` + this.state.curr_name);

      RNFetchBlob.config({
        addAndroidDownloads: {
          notification: true,
          mediaScannable: true,
          title: this.state.curr_name,
          description: "Downloaded via Workspace",
          useDownloadManager: true,
          path: `${dirs.DownloadDir}/Workspace/` + this.state.curr_name
        }
      })
        .fetch("POST", "https://content.dropboxapi.com/2/files/download", {
          "Dropbox-API-Arg": '{"path": "' + this.state.curr_path + '"}',
          Authorization: "Bearer " + this.state.db_access_token
        })
        .then(resp => {
          console.log(resp);
        })
        .catch(err => {
          console.log(err);
          console.log("error downloading");
        });
    }
  };

  deleteData = (path, id, type) => {
    Alert.alert(
      "Confirm Deletion",
      "Press OK To Confirm Deletion of the " + type,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            console.log(path);
            console.log(id);
            console.log(type);

            fetch("https://api.dropboxapi.com/2/files/delete_v2", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.state.db_access_token
              },
              body: '{"path": "' + path + '"}'
            })
              .then(response => response.json())
              .then(responseJson => {
                console.log(responseJson);

                if (type === "folder") {
                  this.reflectOnServer(path, id, "folder");

                  console.log("delete folder");
                } else {
                  this.reflectOnServer(path, id, "file");
                  console.log("delete file");
                }

                let copy = this.state.showUpData.filter(function(ele) {
                  return ele["id"] != id;
                });

                this.setState({ showUpData: copy });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  async reflectOnServer(path, id, type) {
    let url =
      "https://shielded-dusk-55059.herokuapp.com/hi/deleteDropboxFolderData";
    if (type === "file") {
      url =
        "https://shielded-dusk-55059.herokuapp.com/hi/deleteDropboxFileData";
    }

    console.log(this.state.currentAccessId);
    let isRoot = false;
    if (this.state.currentAccessId === "ROOT FOLDER") {
      isRoot = true;
    }

    let type1 = path.split(".")[1];
    console.log(type1);

    fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        path: path,
        id: id,
        isRoot: isRoot,
        type: type1
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
      });
  }

  makeRootFolderData = () => {
    let rootData = this.state.showUpData;
    //console.log(rootData);
    let rootFolders = [];
    let tempArray = [];
    let c = 1;
    this.state.showUpData.map(data => {
      console.log(data["typeOfFile"]);
      if (c % 2 == 0 || c === rootData.length) {
        if (data["typeOfFile"] === "folder") {
          rootFolders.push(
            <View style={{ flexDirection: "row" }}>
              {tempArray[0]}

              <View style={{ marginLeft: 70 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.openFolder(data["path"]);
                  }}
                  onLongPress={() => {
                    this.deleteData(data["path"], data["id"], "folder");
                  }}
                >
                  <Icon
                    name="folder-account"
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
                    {data["name"]}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.openOverlay(
                        data["id"],
                        data["name"],
                        "",
                        "",
                        "",
                        "",
                        data["path"],
                        "folder"
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
          let icon = [...this.renderIcon(data["name"])];
          let icon1 = icon[0];
          let color = icon[1];

          //console.log(icon1 + " " + color);

          rootFolders.push(
            <View style={{ flexDirection: "row" }}>
              {tempArray[0]}

              <View style={{ marginLeft: 70 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.openFile(data["path"], data["id"]);
                  }}
                  onLongPress={() => {
                    this.deleteData(data["path"], data["id"], "file");
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
                    {data["name"].substring(0, 13)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.openOverlay(
                        data["id"],
                        data["name"],
                        data["clientModifiedDate"],
                        data["serverModifiedDate"],
                        data["size"],
                        data["hasSharedMembers"],
                        data["path"],
                        "file"
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
        if (data["typeOfFile"] === "folder") {
          tempArray.push(
            <View style={{ marginLeft: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.openFolder(data["path"]);
                }}
                onLongPress={() => {
                  this.deleteData(data["path"], data["id"], "folder");
                }}
              >
                <Icon
                  name="folder-account"
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
                  {data["name"]}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.openOverlay(
                      data["id"],
                      data["name"],
                      "",
                      "",
                      "",
                      "",
                      data["path"],
                      "folder"
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
          let icon = [...this.renderIcon(data["name"])];
          let icon1 = icon[0];
          let color = icon[1];

          tempArray.push(
            <View style={{ marginLeft: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.openFile(data["path"], data["id"]);
                }}
                onLongPress={() => {
                  this.deleteData(data["path"], data["id"], "file");
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
                  {data["name"].substring(0, 13)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.openOverlay(
                      data["id"],
                      data["name"],
                      data["clientModifiedDate"],
                      data["serverModifiedDate"],
                      data["size"],
                      data["hasSharedMembers"],
                      data["path"],
                      "file"
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
    });
    if (this.state.areChildren) {
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
            <TouchableOpacity
              onPress={() => {
                this.loadMoreHierarchical();
              }}
            >
              <View
                style={{ flexDirection: "row", marginLeft: 130, marginTop: 20 }}
              >
                <Icon name="loading" size={25} style={{ color: "#4703A6" }} />
                <Text
                  style={{ fontSize: 17, color: "#4703A6", fontWeight: "bold" }}
                >
                  Load More
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              this.setState({ isDialogVisible: true });
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
    } else {
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
              this.setState({ isDialogVisible: true });
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
    }
  };

  clickHandler = name => {
    //console.log(this.state.currentAccessId+"/"+name);
    this.setState({ isDialogVisible: false });
    let currFol = this.state.currentAccessId + "/" + name;
    let isRoot = false;
    if (this.state.currentAccessId === "ROOT FOLDER") {
      currFol = "/" + name;
      isRoot = true;
    }
    console.log(currFol);

    fetch("https://api.dropboxapi.com/2/files/create_folder_v2", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.db_access_token
      },
      body: JSON.stringify({
        path: currFol,
        autorename: true
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        var dict = {
          id: responseJson["metadata"]["id"],
          name: responseJson["metadata"]["name"],
          path: responseJson["metadata"]["path_display"],
          typeOfFile: "folder"
        };
        this.setBackendData(isRoot, dict);
        let showData = this.state.showUpData;
        showData.push(dict);
        this.setState({ showUpData: showData });
      });
  };

  async setBackendData(isRoot, dict) {
    //console.log(this.state.access_token)
    fetch("https://shielded-dusk-55059.herokuapp.com/hi/setDropboxFolderData", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        dict: dict,
        isRoot: isRoot
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
      });
  }

  clickHandler1 = res => {
    console.log(this.state.currentAccessId);
    let currFol = this.state.currentAccessId + "/" + res["fileName"];
    let isRoot = false;
    if (this.state.currentAccessId === "ROOT FOLDER") {
      currFol = "/" + res["fileName"];
      isRoot = true;
    }

    RNFetchBlob.fetch(
      "POST",
      "https://content.dropboxapi.com/2/files/upload",
      {
        Authorization: "Bearer " + this.state.db_access_token,
        "Dropbox-API-Arg": JSON.stringify({
          path: currFol,
          mode: "add",
          autorename: true,
          mute: false
        }),
        "Content-Type": "application/octet-stream"
        // here's the body you're going to send, should be a BASE64 encoded string
        // (you can use "base64"(refer to the library 'mathiasbynens/base64') APIs to make one).
        // The data will be converted to "byte array"(say, blob) before request sent.
      },
      RNFetchBlob.wrap(res["uri"])
    )
      .then(res => {
        console.log(res.text());

        let data = JSON.parse(res.text());
        let dict = {
          id: data["id"],
          name: data["name"],
          path: data["path_display"],
          size: data["size"],
          typeOfFile: "file",
          uniqueHash: data["content_hash"],
          canBeDownload: data["is_downloadable"],
          hasSharedMembers: false,
          clientModifiedDate: data["client_modified"],
          serverModifiedDate: data["server_modified"]
        };
        console.log(dict);
        let showData = this.state.showUpData;
        showData.push(dict);
        this.setState({ showUpData: [...showData] });
        this.setBackendFileData(dict, isRoot);
      })
      .catch(err => {
        // error handling ..
      });
  };

  async setBackendFileData(dict, isRoot) {
    fetch("https://shielded-dusk-55059.herokuapp.com/hi/setDropboxFileData", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        dict: dict,
        isRoot: isRoot
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
      });
  }

  chooseFile = () => {
    FilePickerManager.showFilePicker(null, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled file picker");
      } else if (response.error) {
        console.log("FilePickerManager Error: ", response.error);
      } else {
        this.clickHandler1(response);
      }
    });
  };

  renderIcon = type => {
    let itemName = type.split(".");

    if (itemName.length === 1) {
      itemName = itemName[0];
    } else {
      itemName = itemName[type.split(".").length - 1];
    }
    console.log(itemName);

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
    let color = "#555555";
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
      color = "#ED1D24";
      icon = this.state.extentionsDict.pdf.logo;
    } else if (itemName === "octect-stream") {
      icon = this.state.extentionsDict.document.logo;
    } else if (itemName === "video" || videoExtensionArray.includes(itemName)) {
      color = "#313340";
      icon = this.state.extentionsDict.video.logo;
    } else if (itemName === "audio" || itemName === "mp3") {
      color = "#313340";
      icon = this.state.extentionsDict.music.logo;
    } else if (
      itemName === "image" ||
      itemName === "jpeg" ||
      itemName === "png" ||
      itemName === "jpg" ||
      itemName === "gif"
    ) {
      color = "#313340";
      icon = this.state.extentionsDict.image.logo;
    } else if (itemName === "text" || itemName === "txt") {
      icon = this.state.extentionsDict.text.logo;
    } else if (itemName === "form") {
      color = "#009925";
      icon = this.state.extentionsDict.form.logo;
    } else if (
      itemName === "document" ||
      itemName === "doc" ||
      itemName === "docx"
    ) {
      color = "#034C8C";
      icon = this.state.extentionsDict.word.logo;
    } else if (
      itemName === "presentation" ||
      itemName === "pptx" ||
      itemName === "ppt"
    ) {
      color = "#EEB211";
      icon = this.state.extentionsDict.presentation.logo;
    } else if (
      itemName === "spreadsheet" ||
      itemName === "sheet" ||
      itemName === "excel" ||
      itemName === "csv"
    ) {
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
              <TouchableOpacity>
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
    } else {
      return (
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
              <TouchableOpacity>
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
                            icon={<Icon name="share" size={20} color="white" />}
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
                        <TouchableOpacity
                          onPress={() => {
                            this.downloadData();
                          }}
                        >
                          <Icon
                            name={this.state.currIcon}
                            size={45}
                            style={{ marginLeft: 150, marginTop: 10 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </View>
              </Overlay>
            </View>
          </GestureRecognizer>
          <DialogInput
            isDialogVisible={this.state.isDialogVisible}
            title={"Folder Name"}
            message={"Your Folder Name"}
            hintInput={"Name"}
            submitInput={inputText => {
              this.clickHandler(inputText);
            }}
            closeDialog={() => {
              this.setState({ isDialogVisible: false });
            }}
          />
          <DialogInput
            isDialogVisible={this.state.isDialogVisible1}
            title={"File Name"}
            message={"Your File's Name"}
            hintInput={"Name"}
            submitInput={inputText => {
              this.clickHandler1(inputText);
            }}
            closeDialog={() => {
              this.setState({ isDialogVisible1: false });
            }}
          />
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
