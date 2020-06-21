import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { ActivityIndicator, Colors } from "react-native-paper";
import {createDrawerNavigator} from 'react-navigation-drawer';
import {View, StyleSheet, DrawerActions} from 'react-native';

// Custom Created
import Azure from './Azure';
import Dropbox from './Dropbox';
import GoogleDrive from './GoogleDrive';


const StartApp = createDrawerNavigator({
  GoogleDrive:{screen:GoogleDrive},
  Dropbox:{screen:Dropbox},
  Azure:{screen:Azure},
},
{
  initialRouteName:'GoogleDrive',
  //contentComponent: DrawerContentComponent,
  drawerWidth:250,
  drawerPosition:'left',
  drawerType:'slide',
  drawerBackgroundColor:'transparent',
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
    console.log("inside componentDidMount of Main CloudScreen")
    console.log(this.props.screenProps.access_token)
    this.setState({access_token:this.props.screenProps.access_token, isLoading:false, user:this.props.screenProps.user})
  }
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
      <CreateContainer screenProps={{access_token:this.state.access_token, user:this.state.user}} />
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
