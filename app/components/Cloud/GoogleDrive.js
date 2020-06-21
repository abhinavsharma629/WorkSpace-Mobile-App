import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { ActivityIndicator, Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Custom Created
import BeforeGDLoginScreen from './Google Drive/BeforeGDLoginScreen'
import AfterGDLoginScreen from './Google Drive/AfterGDLoginScreen'
import WebView1 from './Google Drive/WebView';
import FolderView from './Google Drive/FolderView';
import Test from './Google Drive/Test';

const StartApp = createStackNavigator({
  BeforeGDLoginScreen:BeforeGDLoginScreen,
  AfterGDLoginScreen:AfterGDLoginScreen,
  WebView1:WebView1,
  FolderView:FolderView,
  // Test:Test,
},
{
  initialRouteName:'BeforeGDLoginScreen',
  headerMode:'none',
  navigatorOptions:() => ({
    title:'Welcome'
  })
})

const CreateContainer = createAppContainer(StartApp)

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      access_token:null,
      isLoading:true,
      user:null,
    }
  }

  componentDidMount(){
    console.log("inside componentDidMount of BeforeGDLoginScreen")
    console.log(this.props.screenProps.access_token)
    this.setState({access_token:this.props.screenProps.access_token, isLoading:false, user:this.props.screenProps.user})
  }

  static navigationOptions = {
    drawerLabel: "Google Drive",
    drawerIcon: () => <Icon size={25} name="google-drive" />,
    tapToClose: "true"
  };

  render() {
    if(this.state.isLoading){
      return(
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader}
          hidesWhenStopped
          color={Colors.blue800}
        />
      )
    }
    else{
    return (
      <CreateContainer screenProps={{gdRootNav:this.props.navigation, access_token:this.state.access_token, user:this.state.user}} />
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
    top: "48%"
  },
});
