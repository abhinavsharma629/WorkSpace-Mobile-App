/* @flow */

import React, { Component } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  KeyboardAwareView,
  TouchableHighlight,
  Image,
  Dimensions,
  Modal,
  SafeAreaView
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Text, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Card, Divider, Overlay } from "react-native-elements";
import base64 from "react-native-base64";
import ShowGithubPostSkeleton from "./ShowGithubPostSkeleton";
import moment from "moment";

import BreadCrumbs from "./BreadCrumbs";
import RepoData from "./RepoData";

export default class GitPostViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteId: null,
      loading: null,
      access_token: null,
      noteDetails: null,
      commentData: "",
      gitHubData: null,
      auth_login_name: null,
      gitHubData1: null,
      myMap: new Map(),
      rootMap: new Map(),
      rootMadeRepo: null,
      isOpen: false,
      isVisible: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      modalImg: null,
      modalVisible: false,
      breadcrumb: [
        {
          name: "Git Repo",
          path: "/"
        }
      ],
      repoId: "Git Repo"
    };
  }

  componentDidMount() {
    console.log("Show GitPostViewScreen componentDidMount");
    console.log(this.props.noteId);

    console.log(this.state.noteId);
    this.setState({
      noteId: this.props.noteId,
      access_token: this.props.access_token,
      noteDetails: this.props.noteDetails,
      gitHubData: this.props.gitHubData,
      gitHubData1: this.props.gitHubData1,
      auth_login_name: this.props.auth_login_name,
      loading: this.props.loading,
      isText: false
    });

    //  this.getAllData(this.props.noteId, this.props.access_token);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Show GitPostViewScreen componentDidMount");
    console.log(nextProps.noteId);

    console.log(this.state.noteId);
    this.setState({
      noteId: nextProps.noteId,
      access_token: nextProps.access_token,
      noteDetails: nextProps.noteDetails,
      gitHubData: nextProps.gitHubData,
      gitHubData1: nextProps.gitHubData1,
      auth_login_name: nextProps.auth_login_name,
      loading: nextProps.loading
    });
  }

  onChangeText(text) {
    console.log(text);
    this.setState({ commentData: text });
  }

  repoDetails(id, name) {
    if (name.length !== 0) {
      console.log("insd");
      this.make(
        this.state.gitHubData1,
        "dsf",
        this.state.auth_login_name,
        name
      );
    } else {
      this.make(this.state.gitHubData1, "dsf", this.state.auth_login_name, "");
    }
  }

  make(response, repoId, auth_login_name, name) {
    var makeRootRepo = [];
    if (name.length === 0) {
      var myMap = new Map();
      var rootMap = new Map();
      var a = response;
      console.log(a);

      for (var i in a) {
        var c = 0;
        var ancestor = a[i]["path"].split("/");
        if (ancestor.length === 1) {
          if (rootMap.has("/")) {
            var curr = rootMap.get("/");
            rootMap.set("/", [...curr, a[i]]);
          } else {
            var arr = [];
            arr = [...arr, a[i]];
            rootMap.set("/", arr);
          }
          if (a[i]["type"] === "blob") {
            makeRootRepo.push({
              id:
                ancestor[0].replace("'", "~|") +
                `-` +
                a[i]["path"].replace("'", "~|") +
                `-` +
                a[i]["sha"],
              type: a[i]["type"],
              sha: a[i]["sha"],
              path: a[i]["path"].replace("'", "~|"),
              ancestor: "",
              name: ancestor[0]
            });
            c = 0;
          } else {
            makeRootRepo.push({
              id:
                ancestor[0].replace("'", "~|") +
                `-` +
                a[i]["path"].replace("'", "~|") +
                `-` +
                a[i]["sha"],
              type: a[i]["type"],
              sha: a[i]["sha"],
              path: a[i]["path"].replace("'", "~|"),
              ancestor: ancestor[0].replace("'", "~|"),
              name: ancestor[0]
            });
            c = 1;
          }

          if (myMap.has("/")) {
            var array = myMap.get("/");
            myMap.set("/", [...array, a[i]]);
          } else {
            var arr = [a[i]];
            myMap.set("/", arr);
          }
        } else {
          var anc = "";
          for (var j = 0; j < ancestor.length - 1; j++) {
            anc += "/" + ancestor[j];
          }
          anc = anc.substr(1, anc.length).replace("'", "~|");
          //console.log("Ans path is:- "+" "+anc)
          if (myMap.has(anc)) {
            var array1 = myMap.get(anc);
            myMap.set(anc, [...array1, a[i]]);
          } else {
            var arr1 = [a[i]];
            myMap.set(anc, arr1);
          }
        }
      }

      console.log(myMap.size);
      console.log(rootMap.size);
      console.log(this.state.gitHubData["rootFolderData"].length);
      this.setState({
        myMap: myMap,
        rootMap: rootMap,
        rootMadeRepo: makeRootRepo
      });
    }
  }

  onClose() {
    console.log("Modal just closed");
  }

  onOpen() {
    console.log("Modal just opened");
  }

  onClosingState(state) {
    console.log("the open/close of the swipeToClose just changed");
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  showBlob = repo => {
    var c = false;
    var audioArray = ["mp3", "ogg"];
    var videoArray = ["mp4"];
    var imageArray = ["jpg", "jpeg", "gif"];
    console.log(repo);
    var path = repo.path.replace("'", "~|");
    var id = repo.sha;
    //path=path.replace("~|", "'")
    console.log(path);
    console.log(id);
    var response = {
      content: this.state.gitHubData1[id]["blob-data"]
    };
    console.log(response);
    var ext = path.split("/");
    var modalImg = "";
    ext = ext[ext.length - 1].split(".");
    ext = ext[ext.length - 1];
    //console.log(ext);
    if (audioArray.indexOf(ext) !== -1) {
      modalImg = "data:audio/mp3;base64," + response["content"];
    } else if (imageArray.indexOf(ext) !== -1) {
      modalImg = "data:image/jpeg;base64," + response["content"];
    } else if (videoArray.indexOf(ext) !== -1) {
      modalImg = "data:video/mp4;base64," + response["content"];
    } else if (ext === "docx") {
      modalImg = "data:application/pdf;base64," + response["content"];
    } else if (ext === "pdf") {
      modalImg = "data:application/pdf;base64," + response["content"];
    } else if (ext === "pptx") {
      modalImg =
        "data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64," +
        response["content"];
    } else {
      modalImg = response["content"];
      modalImg = base64.decode(modalImg);

      c = true;
    }
    console.log("Showing blob");

    this.setState({
      modalVisible: true,
      modalImg: modalImg,
      isVisible: true,
      isText: c
    });
  };

  showB = name => {
    console.log("this is b");
    var c = false;
    var audioArray = ["mp3", "ogg"];
    var videoArray = ["mp4"];
    var imageArray = ["jpg", "jpeg", "gif"];
    var modalImg = "";
    var ext = name.split(".");

    var response = {
      content: this.state.gitHubData["rootFolderData"]["content"]
    };
    if (audioArray.indexOf(ext) !== -1) {
      modalImg = "data:audio/mp3;base64," + response["content"];
    } else if (imageArray.indexOf(ext) !== -1) {
      modalImg = "data:image/jpeg;base64," + response["content"];
    } else if (videoArray.indexOf(ext) !== -1) {
      modalImg = "data:video/mp4;base64," + response["content"];
    } else if (ext === "docx") {
      modalImg = "data:application/pdf;base64," + response["content"];
    } else if (ext === "pdf") {
      modalImg = "data:application/pdf;base64," + response["content"];
    } else if (ext === "pptx") {
      modalImg =
        "data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64," +
        response["content"];
    } else {
      modalImg = response["content"];
      modalImg = base64.decode(modalImg);

      c = true;
    }
    this.setState({
      modalVisible: true,
      modalImg: modalImg,
      isVisible: true,
      isText: c
    });
  };

  showTree = path => {
    console.log("in sh tre");
    var breadData = [];

    var makeRootRepo = [];
    console.log(path);

    var curr = this.state.myMap.get(path);
    //console.log(myMap)
    //console.log(rootMap)
    console.log("Current is:- " + " " + curr);
    var path = curr[0]["path"];
    if (path) {
      //console.log(path);

      path = path.split("/");
      var s = "";
      if (path.length === 1) {
        breadData.push({
          name: this.state.repoId,
          path: "/"
        });
      } else {
        breadData.push({
          name: this.state.repoId,
          path: "/"
        });

        for (var i = 0; i < path.length - 2; i++) {
          s += "/" + path[i];
          //console.log("Current Path is:- "+" "+s);

          breadData.push({
            name: path[i],
            path: s.substr(1, s.length).replace("'", "")
          });
        }

        breadData.push({
          name: path[path.length - 2],
          path: "current"
        });
      }
    }
    for (var j in curr) {
      var ancestor = curr[j]["path"].split("/");
      //console.log(curr)
      var c = 0;
      ancestor = ancestor[ancestor.length - 1];
      //console.log("Tree ans:- "+" "+ancestor)
      if (curr[j]["type"] === "blob") {
        makeRootRepo.push({
          id:
            ancestor +
            `-` +
            curr[j]["path"].replace("'", "~|") +
            `-` +
            curr[j]["sha"],
          type: curr[j]["type"],
          sha: curr[j]["sha"],
          path: curr[j]["path"].replace("'", "~|"),
          ancestor: "",
          name: ancestor
        });

        c = 0;
      } else {
        makeRootRepo.push({
          id:
            ancestor +
            `-` +
            curr[j]["path"].replace("'", "~|") +
            `-` +
            curr[j]["sha"],
          type: curr[j]["type"],
          sha: curr[j]["sha"],
          path: curr[j]["path"].replace("'", "~|"),
          ancestor: curr[j]["path"].replace("'", "~|"),
          name: ancestor
        });

        c = 1;
      }
    }

    this.setState({ breadcrumb: [...breadData], rootMadeRepo: makeRootRepo });
  };
  handleBack(state) {
    console.log(state);
    this.showTree(state.breadcrumb[state.breadcrumb.length - 2]["path"], state);
    //this.setState({breadcrumb:[...state.breadcrumb.slice(0,state.breadcrumb.length-1)]})
  }
  render() {
    var originalAlert = window.alert;
    console.log(originalAlert);

    //IMPORTANT COMPONENT FOR AVOIDING ALERT FOR SPECIFIC SCENARIOS AS FOR base64 plain/text decoding
    window.alert = function(msg) {
      console.log(msg);
      if (
        msg.match(/*There were invalid base64 characters in the input text.Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='Expect errors in decoding.*/)
      ) {
        return undefined;
      } else {
        return originalAlert.bind(window)(msg);
      }
    };

    if (this.state.loading === true || this.state.noteDetails === null) {
      return (
        <View>
          <ShowGithubPostSkeleton />
        </View>
      );
    } else {
      console.log("rendering GitPostViewScreen");
      console.log(this.state.gitHubData["rootFolderData"].length);
      console.log(this.state.myMap.size + " " + this.state.rootMap.size);
      if (
        this.state.gitHubData["rootFolderData"].length === undefined &&
        (this.state.myMap.size === 0 || this.state.rootMap.size === 0)
      ) {
        console.log(
          this.state.gitHubData1[this.state.gitHubData["rootFolderData"]["sha"]]
        );
        this.repoDetails(
          "GitRepo",
          this.state.gitHubData1[this.state.gitHubData["rootFolderData"]["sha"]]
        );
      } else if (
        this.state.gitHubData["rootFolderData"].length !== undefined &&
        (this.state.myMap.size === 0 || this.state.rootMap.size === 0)
      ) {
        console.log("ins1");
        this.repoDetails("GitRepo", "");
      }
      var element = null;
      if (this.state.isText) {
        element = (
          <ScrollView
            style={{
              width: "90%",
              height: "100%",
              marginBottom: 2,
              marginLeft: 20,
              backgroundColor: "white",
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "black",
              padding: 20
            }}
          >
            <Text>{this.state.modalImg}</Text>
          </ScrollView>
        );
      } else {
        element = (
          <Image
            style={{
              width: "90%",
              height: "90%",
              marginLeft: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "black",
              padding: 20
            }}
            source={{ uri: this.state.modalImg }}
          />
        );
      }
      if (this.state.myMap.size === 0 && this.state.rootMap.size === 0) {
        return (
          <ScrollView>
            <BreadCrumbs
              breadcrumb={[
                {
                  name: "Git Repo",
                  path: "/"
                }
              ]}
              showTree={this.showTree}
            />

            <Text />

            <RepoData
              showTree={this.showTree}
              showBlob={this.showBlob}
              showB={this.showB}
              rootMadeRepo={[
                {
                  type: this.state.gitHubData["rootFolderData"]["type"],
                  name: this.state.gitHubData["rootFolderData"]["name"],
                  ancestor: "",
                  path: "/"
                }
              ]}
            />
            <Text />

            <ScrollView style={{ marginTop: 22 }}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  // Alert.alert('Modal has been closed.');
                  this.setState({ modalVisible: false });
                }}
              >
                <View
                  style={{
                    marginTop: 0,
                    backgroundColor: "rgba(100,100,100, 0.5)",
                    width: "100%",
                    height: "100%"
                  }}
                >
                  <View>
                    <TouchableHighlight
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}
                    >
                      <Icon
                        size={40}
                        name="ios-close"
                        style={{ marginLeft: 7, color: "red" }}
                      />
                    </TouchableHighlight>
                  </View>

                  {element}
                </View>
              </Modal>
            </ScrollView>
          </ScrollView>
        );
      } else {
        //var counter = 0;
        //console.log(this.state.breadcrumb.length);

        // console.log(breadData);

        console.log(element);
        if (this.state.breadcrumb.length <= 1) {
          return (
            <ScrollView>
              <BreadCrumbs
                breadcrumb={this.state.breadcrumb}
                showTree={this.showTree}
              />

              <Text />

              <RepoData
                showTree={this.showTree}
                showBlob={this.showBlob}
                rootMadeRepo={this.state.rootMadeRepo}
              />
              <Text />

              <ScrollView style={{ marginTop: 22 }}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                    this.setState({ modalVisible: false });
                  }}
                >
                  <View
                    style={{
                      marginTop: 0,
                      backgroundColor: "rgba(100,100,100, 0.5)",
                      width: "100%",
                      height: "100%"
                    }}
                  >
                    <View>
                      <TouchableHighlight
                        onPress={() => {
                          this.setModalVisible(!this.state.modalVisible);
                        }}
                      >
                        <Icon
                          size={40}
                          name="ios-close"
                          style={{ marginLeft: 7, color: "red" }}
                        />
                      </TouchableHighlight>
                    </View>

                    {element}
                  </View>
                </Modal>
              </ScrollView>
            </ScrollView>
          );
        } else {
          return (
            <ScrollView>
              <BreadCrumbs
                breadcrumb={this.state.breadcrumb}
                showTree={this.showTree}
              />
              <Text />
              <RepoData
                showTree={this.showTree}
                showBlob={this.showBlob}
                rootMadeRepo={this.state.rootMadeRepo}
              />
              <Text />
              <TouchableOpacity
                onPress={() => {
                  this.handleBack(this.state);
                }}
              >
                <Icon
                  size={50}
                  name="ios-arrow-back"
                  style={{
                    paddingLeft: 20,
                    borderWidth: 2,
                    borderRadius: 25,
                    width: 70,
                    marginLeft: 180,
                    elevation: 10,
                    color: "#0DA66E",
                    backgroundColor: "#313340"
                  }}
                />
              </TouchableOpacity>

              <ScrollView style={{ marginTop: 22 }}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                    this.setState({ modalVisible: false });
                  }}
                >
                  <View
                    style={{
                      marginTop: 0,
                      backgroundColor: "rgba(100,100,100, 0.5)",
                      width: "100%",
                      height: "100%"
                    }}
                  >
                    <View>
                      <TouchableHighlight
                        onPress={() => {
                          this.setModalVisible(!this.state.modalVisible);
                        }}
                      >
                        <Icon
                          size={40}
                          name="ios-close"
                          style={{ marginLeft: 7, color: "red" }}
                        />
                      </TouchableHighlight>
                    </View>
                    {element}
                  </View>
                </Modal>
              </ScrollView>
            </ScrollView>
          );
        }
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomView: {
    width: "100%",
    height: 50,

    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0
  },
  wrapper: {
    paddingTop: 50,
    flex: 1,
    zIndex: 10
  },

  modal: {
    justifyContent: "center",
    alignItems: "center"
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: 300
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },

  text: {
    color: "black",
    fontSize: 22
  },
  overlayCancel: {
    padding: 20,
    position: "absolute",
    right: 10,
    top: 0
  },
  cancelIcon: {
    color: "white"
  }
});
