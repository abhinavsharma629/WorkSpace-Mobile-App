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
  findNodeHandle
} from "react-native";

import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Card, Divider, Overlay } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
import ViewMoreText from "react-native-view-more-text";
import { StackActions, NavigationActions } from "react-navigation";
import moment from "moment";

export default class OwnProfileView extends Component {
  constructor(props)  {
          super(props);
          this.state={
            git_access_token:null,
          }
      }

    componentDidMount(){

      console.log("Component did mount of OwnProfileView")
      console.log(this.props.screenProps.rootNavigation.state.params.git_access_token)
      this.setState({git_access_token:this.props.screenProps.rootNavigation.state.params.git_access_token})
      //BackHandler.removeEventListener("hardwareBackPress", this.onBackButtonPressAndroid);
    //  BackHandler.addEventListener("hardwareBackPress", this.onBackButton2);


    }
  //   onBackButton2 = () => {
  //     this.props.navigation.goBack();
  //     return true;
  //   };
  //     componentWillUnmount() {
  //     BackHandler.removeEventListener('hardwareBackPress', this.onBackButton2);
  // }

  render() {
    return (
      <View style={styles.container}>
      <DropdownAlert
        ref={ref => (this.dropDownAlertRef = ref)}
        closeInterval={this.state.closeInterval}
      />
      <TouchableOpacity onPress={()=>{this.props.navigation.openDrawer()}}>
      <Icon size={30} name="md-menu" />
      </TouchableOpacity>
      <Text>I'm the OwnProfileView component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
