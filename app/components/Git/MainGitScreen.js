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

import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Divider, Overlay } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
import ViewMoreText from "react-native-view-more-text";
import { StackActions, NavigationActions, Actions } from "react-navigation";
import moment from "moment";
// import { RootFolderData } from "./RootFolderData";
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

export default class MainGitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity_loading: true,
      git_access_token: null,
      closeInterval: 2000,
      access_token: null,
      isLoading: true,
      rootFolder: null,
      activity_text:
        "Building Your Main Git Repo Screen!! This May Take A few minutes depending on your repositories for The First Time Only!!",
      drawerOpen: null,
      RootFolderData: null,
      refreshing:false,
      git_img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
    };
  }

  componentDidMount() {
    this.props.navigation.closeDrawer();
    console.log("-------------------------------------------");
    console.log("inside componentDidMount of MainGitScreen");

    console.log(this.props.screenProps.git_access_token);
    console.log(this.props.navigation.state.routeName);
    console.log(this.props.screenProps.access_token);
    console.log("---------------------------------------------")

    // //Temporary
    // this.setState({isLoading:false})
    // //console.log(RootFolderData)
    console.log(this.props.screenProps.git_img_url)
    this.setState({git_img_url:this.props.screenProps.git_img_url})
    this.buildDrive();
  }

  buildDrive = async () => {
    try {
      console.log("ok building");
      fetch(
        "https://shielded-dusk-55059.herokuapp.com/hi/buildDrive?authName=GITHUB",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.props.screenProps.access_token
          }
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          var RootFolderData1 = JSON.parse(responseJson.RootFolder);
          this.setState({
            git_access_token: this.props.screenProps.git_access_token,
            access_token: this.props.screenProps.access_token,
            isLoading: false,
            refreshing:false,
            RootFolderData: RootFolderData1,

          });
          this.dropDownAlertRef.alertWithType(
            "success",
            "Success",
            "Successfully Built Your Drive!!"
          );
          //console.log(RootFolderData);
        });
    } catch (error) {
      //this.setState({git_access_token:this.props.screenProps.git_access_token, access_token:this.props.screenProps.access_token, isLoading:false, rootFolder:RootFolderData})
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Some Error Occured!!"
      );
      if (confirm("Do You Want To Try Again?")) {
        this.buildDrive();
      } else {
        RNExitApp.exitApp();
      }
    }
  }

  _onRefresh = () =>{
    this.setState({refreshing:true})
    this.buildDrive()
  }

  viewRepo(repoId){
    console.log(repoId)
    this.props.navigation.navigate('RepoView', {
      repoId:repoId,
      accessType:"admin"
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onBackButtonPressAndroid
    );
  }

  static navigationOptions = {
    drawerLabel: "My Profile",
    drawerIcon: () => <Icon size={30} name="ios-apps" />,
    tapToClose: "true"
  };

  render() {
    //  console.log(this.props.navigation);
    //console.log(this.state.RootFolderData)
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Your Profile"
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
                      this.state.git_img_url
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
              top: "50%",
              padding: 10,
              elevation: 5,
              textAlign: "center"
            }}
          >
            {this.state.activity_text}
          </Text>
        </View>
      );
    } else {
      //console.log(this.state.RootFolderData)

      let repoView = Object.keys(this.state.RootFolderData).map(key => {
        //console.log(key)
        var description = "";
        var mostUsedLanguage = "Most Used Language ";
        var mostUsedLanguageImage = "https://sdfsf.jpeg";

        if (this.state.RootFolderData[key]["description"]) {
          description = this.state.RootFolderData[key]["description"].substr(
            0,
            200
          );
        } else {
          description = "No Description Available";
        }
        if (this.state.RootFolderData[key]["language"] === "Python") {
          mostUsedLanguageImage =
            "https://michaelwashburnjr.com/wp-content/uploads/2017/09/python.jpg";
          mostUsedLanguage = "Most Used Python";
        } else if (this.state.RootFolderData[key]["language"] === "C") {
          mostUsedLanguageImage =
            "https://www.geeksforgeeks.org/wp-content/uploads/Clanguage-768x256.png";
          mostUsedLanguage += "C";
        } else if (this.state.RootFolderData[key]["language"] === "C++") {
          mostUsedLanguageImage =
            "https://www.geeksforgeeks.org/wp-content/uploads/titleShadow-768x256.png";
          mostUsedLanguage += "C++";
        } else if (this.state.RootFolderData[key]["language"] === "C#") {
          mostUsedLanguageImage =
            "https://inteng-storage.s3.amazonaws.com/img/iea/V0OyRqxYGQ/sizes/ctraining_resize_md.jpg";
          mostUsedLanguage += "C#";
        } else if (this.state.RootFolderData[key]["language"] === "HTML") {
          mostUsedLanguageImage =
            "https://www.geeksforgeeks.org/wp-content/uploads/html-768x256.png";
          mostUsedLanguage += "HTML";
        } else if (this.state.RootFolderData[key]["language"] === "Java") {
          mostUsedLanguageImage =
            "https://www.geeksforgeeks.org/wp-content/uploads/Java-768x256.png";
          mostUsedLanguage += "Java";
        } else if (
          this.state.RootFolderData[key]["language"] === "JavaScript"
        ) {
          mostUsedLanguageImage =
            "https://nadia-training.com/wp-content/uploads/2019/03/JavaScript-Essentials-Course-1024x573.jpg";
          mostUsedLanguage += "JavaScript";
        } else if (this.state.RootFolderData[key]["language"] === "React") {
          mostUsedLanguageImage =
            "https://hackernoon.com/hn-images/1*h8d-4wYLN9wwiEsLAA_5yg.jpeg";
          mostUsedLanguage += "React";
        } else if (
          this.state.RootFolderData[key]["language"] === "TypeScript"
        ) {
          mostUsedLanguageImage =
            "https://pantheon.io/sites/default/files/field/image/TypeScriptImage.jpeg";
          mostUsedLanguage += "TypeScript";
        } else if (this.state.RootFolderData[key]["language"] === "Django") {
          mostUsedLanguageImage =
            "https://miro.medium.com/proxy/1*1OBwwxzJksMv0YDD-XmyBw.png";
          mostUsedLanguage += "Dajngo";
        } else if (this.state.RootFolderData[key]["language"] === "CSS") {
          mostUsedLanguageImage =
            "https://www.competa.com/wp-content/themes/competait/resources/assets/img/banner/css3.jpg";
          mostUsedLanguage += "CSS";
        } else if (this.state.RootFolderData[key]["language"] === "NodeJs") {
          mostUsedLanguageImage =
            "https://railsware.com/blog/wp-content/uploads/2018/09/2400%D1%851260-rw-blog-node-js-1024x538.png";
          mostUsedLanguage += "NodeJs";
        } else if (this.state.RootFolderData[key]["language"] === "Angular") {
          mostUsedLanguageImage =
            "https://hackernoon.com/hn-images/1*FDIQCYA3BNp9Ek-tqGeQjA.png";
          mostUsedLanguage += "Angular";
        } else {
          mostUsedLanguageImage =
            "https://regmedia.co.uk/2018/09/14/shutterstock_634574354.jpg?x=442&y=293&crop=1";
          mostUsedLanguage += "Other";
        }
        var icon = "";
        //console.log(typeof this.state.RootFolderData[key]["private"]);
        if (this.state.RootFolderData[key]["private"] === true) {
          icon = "ios-lock";
        } else {
          icon = "ios-eye";
        }
        //console.log(description)
        return (
          <View key={key}>
            <Card style={{ elevation: 15, borderRadius: 10, padding: 10, borderColor:'black', borderSize:2 ,shadowOffset:5,
            shadowColor:'black'}}>
              <CardImage
                source={{ uri: mostUsedLanguageImage }}
                title={mostUsedLanguage}
              />
              <View style={{ flexDirection: "row" }}>
                <CardTitle title={this.state.RootFolderData[key]["name"]} subtitle={this.state.RootFolderData[key]['updated_at']} />
                <Icon
                  size={20}
                  name={icon}
                  style={{ marginRight: 20, marginTop: 22 }}
                />
              </View>
              <CardContent text={description} />

              <View style={{ flexDirection: "row" }}>

                <Icon
                  size={20}
                  name="ios-git-branch"
                  style={{ marginLeft: 20, marginTop:15 }}
                />
                <Text style={{ marginLeft: 10, marginTop:15, fontWeight:'bold'}}>{this.state.RootFolderData[key]['forks']}</Text>
                <Icon
                  size={20}
                  name="ios-eye"
                  style={{ marginLeft: 20, marginTop:15 }}
                />
                <Text style={{ marginLeft: 10, marginTop:15,  fontWeight:'bold'}}>{this.state.RootFolderData[key]['watchers']}</Text>
                <Icon
                  size={20}
                  name="ios-star"
                  style={{ marginLeft: 20, marginTop:15 }}
                />
                <Text style={{ marginLeft: 10, marginTop:15, fontWeight:'bold'}}>{this.state.RootFolderData[key]['stargazers_count']}</Text>
                <CardAction seperator={true} inColumn={false} style={{marginLeft:10, marginTop:-1}}>
                  <CardButton
                    onPress={() => {
                      this.viewRepo(this.state.RootFolderData[key]["name"]);
                    }}
                    title="View"
                    color="blue"
                  />
                </CardAction>
              </View>


            </Card>
            <Text />
          </View>
        );
      });
      //console.log(repoView);

      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Your Profile"
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
                      this.state.git_img_url
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />
          <ScrollView

            refreshControl={
              <RefreshControl

                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
          <ScrollView>{repoView}</ScrollView>
          </ScrollView>
        </View>
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
    top: "48%"
  }
});
