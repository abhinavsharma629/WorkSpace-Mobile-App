/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import GDrive from "react-native-google-drive-api-wrapper";
var RNFS = require('react-native-fs');
export default class Test extends Component {
  constructor(props){
    super(props);
    this.state={
      access_token: null,
      isLoading: true,
      user: null,
      gd_access_token: null,
      gd_img_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Logo_of_Google_Drive.svg/2000px-Logo_of_Google_Drive.svg.png",
      gd_login_email: null,
      gd_id_token: null,
      gd_token_info_uri: null,
    }
  }

  componentDidMount() {
    console.log("inside componentDidMount of TestScreen");
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

    this.setDrive(this.props.navigation.state.params["gd_access_token"]);


  }

  setDrive = (access_token) =>{
    console.log("ok initializing")
    console.log(access_token)
    GDrive.setAccessToken(access_token);
    GDrive.init();
    GDrive.isInitialized()?this.setAccess(access_token):this.showError();

  }

  setAccess(access_token){
    console.log("initialized successfully")
    var date      = new Date();
    // let options = {
//   fileCache: true,
//   addAndroidDownloads : {
//     useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
//     notification : false,
//     description : 'Downloading image.'
//   },
//   path: "default"
// }
//     GDrive.files.download("173IUTL3FyBqZ6eEK_n7Uy0SndFxLjvl4", options)

    //GDrive.files.delete("173IUTL3FyBqZ6eEK_n7Uy0SndFxLjvl4")

    //*Working*
    // GDrive.files.safeCreateFolder({
    //  name: "My folder",
    //  parents: ["1Dp1QseI-LHfj8niLfrDYzcUz07FbPQox"]
    //  });
  // DELETE => https://www.googleapis.com/drive/v3/files/16hd6fvppAMrhjuS6duwOOU7GW1AFYUF3
  }

  showError(){
    console.log("error while initializing")
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>I'm the Test component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
