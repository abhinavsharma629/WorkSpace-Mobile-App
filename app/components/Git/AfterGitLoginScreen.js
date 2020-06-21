import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {View, StyleSheet, DrawerActions} from 'react-native';
import { ActivityIndicator, Colors } from "react-native-paper";
// Custom Created
import OwnProfileView from './OwnProfileView';
import OthersProfileView from './OthersProfileView';
import FollowersView from './FollowersView';
import FollowingView from './FollowingView';
import ComparingProfileView from './ComparingProfileView';
import RepoView from './RepoView';
import MainGitScreen from './MainGitScreen';
import DrawerContentComponent from './DrawerContentComponent';
import GitLogout from './GitLogout';

const StartApp = createDrawerNavigator({
  MainGitScreen:{screen:MainGitScreen},
  FollowersView:{screen:FollowersView},
  FollowingView:{screen:FollowingView},
  ComparingProfileView:{screen:ComparingProfileView},
  RepoView:{screen:RepoView},
  GitLogout:{screen:GitLogout},

},
{
  initialRouteName:'ComparingProfileView',
  //contentComponent: DrawerContentComponent,
  drawerWidth:250,
  drawerPosition:'left',
  drawerType:'slide',
  drawerBackgroundColor:'transparent',
})


const StartApp1 = createStackNavigator({
  OthersProfileView:OthersProfileView,
  Drawer:StartApp
},
{
  initialRouteName:'Drawer',
  headerMode:'none',
  navigatorOptions:() => ({
    title:'Welcome'
  })
})



const CreateContainer = createAppContainer(StartApp1)

class App extends Component {
  constructor(props)  {
          super(props);
          this.state={
            git_access_token:null,
            access_token:null,
            isLoading:true,
            auth_login_name:null,
            user:null,
            git_img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
          }
      }



    componentDidMount(){
      console.log("Inside componentDidMount od AfterLoginScreen")
      console.log(this.props.navigation.state.params.git_access_token)
      console.log(this.props.screenProps.access_token)
      this.setState({git_access_token:this.props.navigation.state.params.git_access_token, access_token:this.props.screenProps.access_token, user:this.props.screenProps.user, git_img_url:this.props.navigation.state.params.git_img_url, user:this.props.screenProps.user, isLoading:false, auth_login_name:this.props.navigation.state.params.auth_login_name})
    }

  render() {
    if(this.state.isLoading===false){
      const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

      console.log(this.state.git_access_token)
    return (

      <CreateContainer screenProps={{ rootNavigation: this.props.navigation, user:this.state.user, git_access_token:this.state.git_access_token, access_token:this.state.access_token, git_img_url:this.state.git_img_url, auth_login_name:this.state.auth_login_name }}/>

    );
  }
  else{
    return (<View />);
  }
  }
}
const styles=StyleSheet.create({
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "48%"
  },
})

export default (App);
