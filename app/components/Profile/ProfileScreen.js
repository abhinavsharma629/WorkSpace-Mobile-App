import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { ActivityIndicator, Colors } from "react-native-paper";
import {createDrawerNavigator} from 'react-navigation-drawer';
import {View, StyleSheet, DrawerActions} from 'react-native';

// Custom Created
import MainProfilePage from './MainProfilePage';
import ScanScreen from './ScanScreen';
import Settings from './Settings';
import Logout from './Logout';
import EditProfile from './EditProfile';
import PrivacyPolicies from './PrivacyPolicies';

import 'react-native-gesture-handler'

const StartApp = createDrawerNavigator({
  MainProfilePage:{screen:MainProfilePage},
  EditProfile:{screen:EditProfile},
  ScanScreen:{screen:ScanScreen},
  Settings:{screen:Settings},
  PrivacyPolicies:{screen:PrivacyPolicies},
  Logout:{screen:Logout},
},
{
  initialRouteName:'MainProfilePage',
  //contentComponent: DrawerContentComponent,
  drawerWidth:250,
  drawerPosition:'right',
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
      <CreateContainer screenProps={{rootNav:this.props.screenProps.rootNav, access_token:this.state.access_token, user:this.state.user, img_url:this.props.screenProps.img_url}} />
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
