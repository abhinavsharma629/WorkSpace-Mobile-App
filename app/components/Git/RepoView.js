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
  RefreshControl,
  findNodeHandle
} from "react-native";
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
import { RootFolderData } from "./RootFolderData";
import Overlay from "react-native-modal-overlay";
// import SelectMultiple from 'react-native-select-multiple'
import MultiSelect from "react-native-multiple-select";
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

import BreadCrumbs1 from "./BreadCrumbs1";
import RepoData1 from "./RepoData1";

export default class RepoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      git_access_token: null,
      auth_login_name: null,
      accessType: null,
      repoId: null,
      isLoading: true,
      repoData: null,
      myMap: new Map(),
      rootMap: new Map(),
      breadcrumb: [],
      gitHubData: null,
      gitHubData1: null,
      rootMadeRepo: null,
      modalImg: null,
      modalVisible: false,
      isText: false,
      overlayVisible: false,
      selectedFriends: [],
      friends: [],
      title: "",
      caption: "",
      access_token: null,
      user: null,
      currentRepoId: null,
      closeInterval: 1000,
      totalChildren: null,
      TreeData: null,
      refreshing:false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("----------------------------------");
    console.log("UNSAFE_componentWillReceiveProps of RepoView");
    console.log("--------------------------------------");

    if (nextProps.navigation.state.params) {
      console.log(this.props.screenProps.user);
      console.log(
        "Access token" + " " + nextProps.navigation.state.params.repoId
      );
      // console.log(
      //   nextProps.screenProps.rootNavigation.state.params.git_access_token
      // );
      console.log("received repoId");
      this.setState({
        access_token: this.props.screenProps.access_token,
        user: this.props.screenProps.user,
        git_access_token:
          nextProps.screenProps.rootNavigation.state.params.git_access_token,
        repoId: nextProps.navigation.state.params.repoId,
        auth_login_name: nextProps.screenProps.auth_login_name,
        accessType: nextProps.navigation.state.params.repoId,
        isLoading: true
      });
      this.fetchRepoDetails(
        nextProps.screenProps.auth_login_name,
        nextProps.navigation.state.params.repoId,
        nextProps.screenProps.rootNavigation.state.params.git_access_token
      );
    } else {
      console.log("no repoId received");
      //this.props.navigation.navigate('MainGitScreen');
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Select Your Repo First"
      );

      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    console.log("----------------------------------");
    console.log("Component did mount of RepoView");
    //console.log(this.props.screenProps);
    //console.log(this.props.screenProps.state.params.git_access_token)
    //console.log(this.props.navigation.state.params);
    console.log("--------------------------------------------");

    if (this.props.navigation.state.params) {
      console.log(this.props.navigation.state.params.repoId);
      console.log("Access token" + " " + this.props.screenProps.access_token);
      // console.log(
      //   nextProps.screenProps.rootNavigation.state.params.git_access_token
      // );

      this.setState({
        access_token: this.props.screenProps.access_token,
        user: this.props.screenProps.user,
        git_access_token: this.props.screenProps.rootNavigation.state.params
          .git_access_token,
        repoId: this.props.navigation.state.params.repoId,
        auth_login_name: this.props.screenProps.auth_login_name,
        accessType: this.props.navigation.state.params.repoId
      });
      this.fetchRepoDetails(
        this.props.screenProps.auth_login_name,
        this.props.navigation.state.params.repoId,
        this.props.screenProps.rootNavigation.state.params.git_access_token
      );
    } else {
      //this.props.navigation.navigate('MainGitScreen');
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Select Your Repo First"
      );

      this.setState({ isLoading: false });
    }
  }

  //   onBackButton2 = () => {
  //     this.props.navigation.goBack();
  //     return true;
  //   };
  //     componentWillUnmount() {
  //     BackHandler.removeEventListener('hardwareBackPress', this.onBackButton2);
  // }

  _onRefresh = () =>{
    this.setState({refreshing:true})
    this.fetchRepoDetails(this.state.auth_login_name, this.state.repoId, this.state.git_access_token)
  }

  fetchRepoDetails = (auth_login_name, repoId, git_access_token) => {
    console.log("fetching details for" + " " + repoId);
    // console.log(
    //   "https://api.github.com/repos/" +
    //     auth_login_name +
    //     "/" +
    //     repoId +
    //     "/branches"
    // );
    fetch(
      "https://api.github.com/repos/" +
        auth_login_name +
        "/" +
        repoId +
        "/branches",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + git_access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson)
        var sha = responseJson[0]["commit"]["sha"];

        fetch(
          "https://api.github.com/repos/" +
            auth_login_name +
            "/" +
            repoId +
            "/git/trees/" +
            sha +
            "?recursive=1",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + git_access_token
            }
          }
        )
          .then(response => response.json())
          .then(responseJson => {
            //console.log(responseJson)

            this.setState({ gitHubData: responseJson });
            this.make(responseJson, repoId, auth_login_name);
          });
      });
  };

  make = (response, repoId, auth_login_name) => {
    console.log("making repo maps");
    var makeRootRepo = [];

    var myMap = new Map();
    var rootMap = new Map();
    var a = response;
    //console.log(a);

    for (var i in a["tree"]) {
      var c = 0;
      var ancestor = a["tree"][i]["path"].split("/");
      if (ancestor.length === 1) {
        if (rootMap.has("/")) {
          var curr = rootMap.get("/");
          rootMap.set("/", [...curr, a["tree"][i]]);
        } else {
          var arr = [];
          arr = [...arr, a["tree"][i]];
          rootMap.set("/", arr);
        }
        if (a["tree"][i]["type"] === "blob") {
          makeRootRepo.push({
            id:
              ancestor[0].replace("'", "~|") +
              `-` +
              a["tree"][i]["path"].replace("'", "~|") +
              `-` +
              a["tree"][i]["sha"],
            type: a["tree"][i]["type"],
            sha: a["tree"][i]["sha"],
            path: a["tree"][i]["path"].replace("'", "~|"),
            ancestor: "",
            name: ancestor[0]
          });
          c = 0;
        } else {
          makeRootRepo.push({
            id:
              ancestor[0].replace("'", "~|") +
              `-` +
              a["tree"][i]["path"].replace("'", "~|") +
              `-` +
              a["tree"][i]["sha"],
            type: a["tree"][i]["type"],
            sha: a["tree"][i]["sha"],
            path: a["tree"][i]["path"].replace("'", "~|"),
            ancestor: ancestor[0].replace("'", "~|"),
            name: ancestor[0]
          });
          c = 1;
        }

        if (myMap.has("/")) {
          var array = myMap.get("/");
          myMap.set("/", [...array, a["tree"][i]]);
        } else {
          var arr = [a["tree"][i]];
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
          myMap.set(anc, [...array1, a["tree"][i]]);
        } else {
          var arr1 = [a["tree"][i]];
          myMap.set(anc, arr1);
        }
      }
    }

    console.log(myMap.size);
    console.log(rootMap.size);

    this.setState({
      myMap: myMap,
      rootMap: rootMap,
      rootMadeRepo: makeRootRepo,
      breadcrumb: [
        {
          name: repoId,
          path: "/"
        }
      ],
      isLoading: false,
      refreshing:false,
    });

    //console.log(this.state)
  };

  showBlob = (id, path) => {
    console.log("this is blob");
    var c = false;
    var audioArray = ["mp3", "ogg"];
    var videoArray = ["mp4"];
    var imageArray = ["jpg", "jpeg", "gif"];
    var modalImg = "";

    fetch(
      "https://api.github.com/repos/" +
        this.state.auth_login_name +
        "/" +
        this.state.repoId +
        "/contents/" +
        path,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.git_access_token
        }
      }
    )
      .then(response => response.json())
      .then(response => {
        var ext = path.split("/");
        ext = ext[ext.length - 1].split(".");
        ext = ext[ext.length - 1];

        var response1 = {
          content: this.state.gitHubData["tree"]["content"]
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
          isText: c
        });
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

  goToRepo() {
    this.props.navigation.navigate("MainGitScreen");
  }

  getBlob = async (i, count, path) => {
    let response = await fetch(
      "https://api.github.com/repos/" +
        this.state.auth_login_name +
        "/" +
        this.state.repoId +
        "/contents/" +
        path,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.state.git_access_token
        }
      }
    );
    let responseJson = await response.json();
    return { response: responseJson["content"], count: count, i: i };
  };

  getBlob1 = async (i, count, path) => {
    let response = await fetch(
      "https://api.github.com/repos/" +
        this.state.auth_login_name +
        "/" +
        this.state.repoId +
        "/contents/" +
        path,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.state.git_access_token
        }
      }
    );
    let responseJson = await response.json();
    return { response: responseJson, count: count, i: i };
  };

  setChildrenForBlob = (count, data, i) => {
    let TreeData = this.state.TreeData;
    //console.log(data)
    //console.log(i)
    if ("tree" in TreeData) {
      TreeData["tree"][i]["blob-data"] = data;
    } else {
      TreeData = data;
    }

    this.setState({ TreeData: TreeData });
    if (count === this.state.totalChildren) {
      console.log("Total count Reached");
      console.log("Printing Tree");
      //console.log(this.state.TreeData)
      this.shareTree();
    }
  };

  setChildrenForTree = count => {
    if (count === this.state.totalChildren) {
      console.log("Total count Reached");
      console.log("Printing Tree");
      //console.log(this.state.TreeData)
      this.shareTree();
    }
  };

  shareTree = () => {
    console.log("Sharing Tree");

    this.dropDownAlertRef.alertWithType(
      "success",
      "Success",
      "Sending Data To Your Friends!!"
    );

    var data = null;
    if ("tree" in this.state.TreeData) {
      data = this.state.TreeData["tree"];
    } else {
      data = this.state.TreeData;
    }

    fetch(
      "https://shielded-dusk-55059.herokuapp.com/personalNotes/submitGitHubNote",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        },
        body: JSON.stringify({
          "list[]": this.state.selectedFriends,
          content: JSON.stringify({
            rootFolderData: data
          }),
          title: this.state.title,
          caption: this.state.caption
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.status);
        if (responseJson.status === "201") {
          this.setState({ title: "", caption: "" });
          this.dropDownAlertRef.alertWithType(
            "success",
            "Success",
            "Successfully Sent Data To Your Friends!!"
          );
        } else {
          this.setState({ title: "", caption: "" });
          this.dropDownAlertRef.alertWithType(
            "error",
            "Error",
            "Some Error Occured!! Please Try Again Later!!"
          );
        }
      });
  };

  shareRepo = () => {
    this.dropDownAlertRef.alertWithType(
      "success",
      "Success",
      "This May Take A While!! Your Data Will Be Sent And You Will Be Informed Soon!!"
    );
    this.setState({ overlayVisible: false });

    console.log("sharing");
    console.log("---------------------------------------------");
    console.log("Sharing Details");
    console.log(this.state.currentRepoId);
    var sha = this.state.currentRepoId.sha;
    var ancestor = this.state.currentRepoId.ancestor;
    var path = this.state.currentRepoId.path;
    var auth_login_name = this.state.auth_login_name;

    var git_access_token = this.state.git_access_token;
    var repoName = this.state.repoId;
    var url =
      "https://api.github.com/repos/" +
      auth_login_name +
      "/" +
      repoName +
      "/git/trees/" +
      sha +
      "?recursive=1";

    console.log(sha);
    console.log(ancestor);
    console.log(path);
    console.log(auth_login_name);
    console.log(repoName);
    console.log(git_access_token);
    console.log(url);
    console.log("---------------------------------------------");
    //"https://api.github.com/repos/abhinavsharma629/crud-master/git/trees/c316ec0183712543d515e7dab4f5e59e91da4e90"
    this.dropDownAlertRef.alertWithType(
      "success",
      "Success",
      "Fetching Your Repo Data"
    );
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + git_access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson)
        var TreeData = responseJson;
        this.dropDownAlertRef.alertWithType(
          "success",
          "Success",
          "Fetching File Data"
        );
        var count = 0;

        if ("tree" in TreeData) {
          this.setState({
            TreeData: TreeData,
            totalChildren: TreeData["tree"].length
          });
          for (var i = 0; i < TreeData["tree"].length; i++) {
            count += 1;
            if (TreeData["tree"][i]["type"] === "blob") {
              var blobData = this.getBlob(
                i,
                count,
                path + "/" + TreeData["tree"][i]["path"]
              ).then(data => {
                this.setChildrenForBlob(
                  data["count"],
                  data["response"],
                  data["i"]
                );
              });
              //console.log(blobData)
              // console.log("got blobData")
              // TreeData['tree'][i]['blob-data']=blobData;
              //console.log("set blob data")
            } else {
              this.setChildrenForTree(count);
            }
          }
        } else {
          console.log("only 1");
          this.setState({
            TreeData: TreeData,
            totalChildren: 1
          });
          var blobData = this.getBlob1(0, 1, path).then(data => {
            this.setChildrenForBlob(data["count"], data["response"], data["i"]);
          });
        }
      });
  };

  onClose = () => this.setState({ overlayVisible: false });

  static navigationOptions = {
    drawerLabel: "View Repo",
    drawerIcon: () => <Icon size={30} name="md-eye" />,
    tapToClose: "true"
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onSwipeDown = () => {
    this.setState({ overlayVisible: false });
  };

  showOverlay = repoId => {
    console.log("showing overlay for");
    console.log(repoId);
    this.setState({ overlayVisible: true, currentRepoId: repoId });

    if (this.state.friends.length !== 0) {
      console.log("Friends already formed");
    } else {
      console.log("fetching friends list");
      fetch("https://shielded-dusk-55059.herokuapp.com/shared/allUserFriends", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          var friends = JSON.parse(responseJson.list);
          //console.log(friends)
          var c = 0;
          var friendList = friends.map(friend => {
            console.log(friend["friends_name"] + " " + friend["username"]);
            console.log(this.state.user);
            if (friend["friends_name"] === this.state.user) {
              console.log("inside");
              c += 1;
              return {
                id: c,
                name: friend["username"]
              };
            } else {
              c += 1;
              return {
                id: c,
                name: friend["friends_name"]
              };
            }
          });
          console.log(friendList);
          this.setState({ friends: friendList });
        });
    }
  };

  onSelectionsChange = selectedFriends => {
    console.log("--------------------------");
    console.log("selections change");
    console.log("--------------------------");
    // selectedFriends is array of { label, value }
    console.log(selectedFriends);
    this.setState({ selectedFriends });
  };

  onChangeTitle(text) {
    this.setState({ title: text });
  }
  onChangeCaption(text) {
    this.setState({ caption: text });
  }

  render() {
    const config = {
      velocityThreshold: 0.5,
      directionalOffsetThreshold: 80
    };

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

    console.log(this.state.isLoading);
    if (this.state.isLoading) {
      console.log("content loading");
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="View Repo"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10
                  }}
                  source={{
                    uri:
                      "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
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
        </View>
      );
    } else if (this.state.repoId === null) {
      console.log("no repo Id");
      return (
        <View style={{ flex: 1 }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="View Repo"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10
                  }}
                  source={{
                    uri:
                      "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => this.goToRepo()}
              style={{
                flex: 0.5,
                marginTop: 150,
                marginLeft: 20,
                marginRight: 20
              }}
            >
              <Card
                style={{
                  elevation: 15,
                  borderRadius: 10,
                  padding: 10,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  shadowColor: "black"
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <CardTitle title="Select The Repo First" />
                  <Icon
                    size={20}
                    name="ios-git-network"
                    style={{ marginRight: 20, marginTop: 22 }}
                  />
                </View>
                <CardContent text="Go To Your Repos Or Your Friends Repo And Tap View and then you will be able to access the data." />

                <CardAction
                  seperator={true}
                  inColumn={false}
                  style={{ marginLeft: 10, marginTop: -1 }}
                >
                  <CardButton
                    onPress={() => {
                      this.goToRepo();
                    }}
                    title="Go To Repos"
                    color="blue"
                  />
                </CardAction>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      //console.log(this.props.navigation.state.params.accessType)

      //console.log(this.state.rootMadeRepo)
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

      console.log("inside else");
      console.log("tree" in this.state.gitHubData);
      console.log(this.state.rootMadeRepo);

      return (
        <View style={{ flex: 1 }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="View Repo"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10
                  }}
                  source={{
                    uri:
                      "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
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
                  marginTop: 55,
                  backgroundColor: "#313340",
                  shadowColor: "black",
                  color: "#313340",
                  marginBottom:-15
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
                          title="Sharing List"
                          subtitle="You Can Select Multiple Friends At The Same Time To Share Your Data With!!"
                        />
                        <Icon
                          size={20}
                          name="md-share"
                          style={{ marginRight: 20, marginTop: 22 }}
                        />
                      </View>
                      <KeyboardAvoidingView>
                        <ScrollView
                          style={{
                            marginTop: 5,
                            marginLeft: 10,
                            flex: 1,
                            width: 350
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>Title</Text>
                          <TextInput
                            placeholder="Title"
                            placeholderColor="#c4c3cb"
                            style={styles.loginFormTextInput}
                            onChangeText={text => {
                              this.onChangeTitle(text);
                            }}
                            value={this.state.title}
                          />
                          <Text />

                          <Text style={{ fontWeight: "bold" }}>Caption</Text>
                          <TextInput
                            onChangeText={text => {
                              this.onChangeCaption(text);
                            }}
                            placeholder="Caption"
                            style={{ padding: 1, width: wp('90%'), height: 100 }}
                            outline={true}
                            value={this.state.caption}
                          />
                        </ScrollView>
                        <ScrollView style={{ flex: 1, marginLeft: 10 }}>
                          <MultiSelect
                            hideTags
                            items={this.state.friends}
                            uniqueKey="name"
                            ref={component => {
                              this.multiSelect = component;
                            }}
                            width={wp('90%')}
                            onSelectedItemsChange={this.onSelectionsChange}
                            selectedItems={this.state.selectedFriends}
                            selectText="Select Friends"
                            searchInputPlaceholderText="Search Friends..."
                            onChangeInput={text => console.log(text)}
                            altFontFamily="ProximaNova-Light"
                            tagRemoveIconColor="black"
                            tagBorderColor="black"
                            tagTextColor="#CCC"
                            selectedItemTextColor="#CCC"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            displayKey="name"
                            searchInputStyle={{ color: "black" }}
                            hideSubmitButton={true}
                          />

                          <CardAction
                            seperator={true}
                            inColumn={false}
                            style={{ marginTop: 50, marginLeft: 80 }}
                          >
                            <CardButton
                              onPress={() => {
                                this.onClose();
                              }}
                              title="Cancel"
                              color="red"
                            />
                            <CardButton
                              onPress={() => {
                                this.shareRepo();
                              }}
                              title="Share"
                              color="blue"
                            />
                          </CardAction>
                        </ScrollView>
                      </KeyboardAvoidingView>
                    </Card>
                  </TouchableOpacity>
                </View>
              </Overlay>
            </View>
          </GestureRecognizer>
          <ScrollView

            refreshControl={
              <RefreshControl

                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
          <ScrollView>
            <View style={{ marginTop: 10, marginLeft: 5 }}>
              <BreadCrumbs1
                breadcrumb={this.state.breadcrumb}
                showTree={this.showTree}
              />
            </View>
            <Text />

            <RepoData1
              showTree={this.showTree}
              showBlob={this.showBlob}
              rootMadeRepo={this.state.rootMadeRepo}
              accessType={this.state.accessType}
              showOverlay={this.showOverlay}
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
          </ScrollView>
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
  loginFormTextInput: {
    height: 45,
    fontSize: 14,
    width:wp('90%'),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10
  }
});
