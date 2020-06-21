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
  findNodeHandle
} from "react-native";

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

export default class CodeScreen extends Component {
  constructor(props)  {
          super(props);
          this.state={
            access_token:null,
            isLoading:true,
            user:null,
            closeInterval: 2000,
            drawerOpen:null,
            activity_text:"Initializing Code Editor",
            img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
          }
      }

  componentDidMount(){
    this.props.navigation.closeDrawer();
    this.setState({access_token:this.props.screenProps.access_token, user:this.props.screenProps.user, img_url:this.props.screenProps.img_url})
  }


  static navigationOptions = {
    drawerLabel: "Write Code",
    drawerIcon: () => <Icon size={25} name="code-greater-than-or-equal"/>,
    tapToClose: "true"
  };


  render() {
    if(this.state.isLoading){
        return (
          <View style={styles.container}>
            <DropdownAlert
              ref={ref => (this.dropDownAlertRef = ref)}
              closeInterval={this.state.closeInterval}
              elevation={20}
            />
            <ClassicHeader
              headerTitle="Write Code"
              leftComponent={
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.openDrawer();
                  }}
                >
                  <Icon size={30} name="menu" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              }
              rightComponent={
                <TouchableOpacity onPress={() => {}}>
                  <Image
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 25,
                      marginRight: 10,
                      borderColor:'black',
                      borderWidth:1,
                      backgroundColor:'white'
                    }}
                    source={{
                      uri:
                        this.state.img_url
                    }}
                  />
                </TouchableOpacity>
              }
              height={55}
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
                top: "42%",
                padding: 10,
                elevation: 5,
                textAlign: "center"
              }}
            >
              {this.state.activity_text}
            </Text>
          </View>
        );
    }
    else{
    return (
      <View style={styles.container}>
        <Text>I'm the CodeScreen component</Text>
      </View>
    );
  }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "40%"
  }
});
