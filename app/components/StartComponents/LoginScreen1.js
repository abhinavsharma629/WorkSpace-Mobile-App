import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage,
  Linking,
  Image,
  Dimensions,
  PermissionsAndroid,
  BackHandler
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import RNExitApp from "react-native-exit-app";
import Geolocation from "react-native-geolocation-service";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// Custom Created
import MainScreen from "../MainPageComponents/MainPage.js";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loading: false,
      closeInterval: 2000,
      loginActive: true,
      lat: "",
      long: "",
      altitude: ""
    };
  }

  componentDidMount() {
    // this.loadInitialState();

    this.askLocationPermission();

    // BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.onBackButtonPressAndroid
    // );
  }

  // onBackButtonPressAndroid() {
  //   RNExitApp.exitApp();
  // }

  // _loadInitialState = async () => {
  //   var value = await AsyncStorage.getItem("user");
  //   if (value != null) {
  //     this.props.navigation.navigate("MainPage");
  //   } else {
  //     console.log("No Logged In User");
  //     this.setState({ loading: false });
  //   }
  // };

  async askLocationPermission() {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "WorkSpace requires Location permission",
        message:
          "We required Location permission in order to make you easily searchable to your friends and increase your experience a lot with us " +
          "Please grant us."
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the ACCESS_COARSE_LOCATION");

      Geolocation.getCurrentPosition(
        info => {
          console.log(info);
          console.log("Latitude is " + info.coords.latitude);
          console.log("Longitude is " + info.coords.longitude);

          console.log("Longitude and latitude state set");
          this.setState({
            lat: info.coords.latitude,
            long: info.coords.longitude,
            altitude: info.coords.altitude
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log("ACCESS_COARSE_LOCATION permission denied");

      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000
      })
        .then(data => {
          console.log("got data");
          console.log(data);

          Geolocation.getCurrentPosition(
            info => {
              console.log(info);
              console.log("Latitude is " + info.coords.latitude);
              console.log("Longitude is " + info.coords.longitude);

              console.log("Longitude and latitude state set");
              this.setState({
                lat: info.coords.latitude,
                long: info.coords.longitude,
                altitude: info.coords.altitude
              });
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        })
        .catch(err => {
          console.log("Error Again");
          console.log(err);
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
        });
    }
  }

  onLoginPress() {
    var username = this.state.username;
    var password = this.state.password;
    this.setState({ loading: true });

    fetch("https://shielded-dusk-55059.herokuapp.com/user/validateUser/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        pass: password
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === "200") {
          console.log("Logged In");
          console.log(responseJson);
          this.updateState(responseJson);

          //this.props.navigation.navigate('')
        } else {
          console.log("Invalid User");
          this.setState({ loading: false });
          this.dropDownAlertRef.alertWithType(
            "error",
            "Error",
            "Some No Such User Exists!!"
          );
        }
      });
  }


async updateState(responseJson) {
  const currentLoggedUser = await AsyncStorage.getItem('currentLoggedUser');
  const userStates = await AsyncStorage.getItem('userStates');

  console.log(currentLoggedUser)
  console.log(userStates)

  const currentLoggedUser1 = JSON.parse(currentLoggedUser)
  const userStates1 = JSON.parse(userStates)

  if(currentLoggedUser1['user']===this.state.username){
    this.props.navigation.goBack()
  }
  else{

    AsyncStorage.setItem("user", this.state.username);
    AsyncStorage.setItem("access_token", responseJson.token_data.access);
    AsyncStorage.setItem(
      "refresh_token",
      responseJson.token_data.refresh
    );
    AsyncStorage.setItem("img_url", responseJson.img_url);

    let currentUserData = {
      user:this.state.username,
      access_token:responseJson.token_data.access,
      refresh_token:responseJson.token_data.refresh,
      img_url:responseJson.img_url
    }

    let updatedUserStates = userStates1

    console.log(updatedUserStates)
    console.log("\n\n"+responseJson.token_data.access)

    if(this.state.username in updatedUserStates){
      console.log("ok some user data exists")
      updatedUserStates[this.state.username]={...updatedUserStates[this.state.username], ...currentUserData}
    }
    else{
      updatedUserStates[this.state.username] = currentUserData
    }

    console.log(updatedUserStates)

    //updatedUserStates[this.state.username] = currentUserData


    AsyncStorage.setItem('currentLoggedUser', JSON.stringify(currentUserData))

    AsyncStorage.setItem('userStates', JSON.stringify(updatedUserStates))

    console.log("-----------------------\n\n-----------------------")
    console.log(currentLoggedUser)
    console.log(userStates)
    console.log("----------------------------------------------")
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "MainPage",
          params: {
            access_token: responseJson.token_data.access,
            user: this.state.username,
            img_url: responseJson.img_url,
            userStates:updatedUserStates
          }
        })
      ]
    });

    this.props.navigation.state.params.screenProps1.dispatch(resetAction)

    //this.props.screenProps.rootNav.dispatch(resetAction);
  }
}


  set_username = e => {
    this.setState({ username: e });

    if (this.state.password.length > 0 && this.state.username.length > 0) {
      this.setState({ loginActive: false });
    } else if (
      this.state.password.length == 0 ||
      this.state.username.length == 0
    ) {
      this.setState({ loginActive: true });
    }
  };

  set_password = e => {
    this.setState({ password: e });
    if (this.state.password.length > 0 && this.state.username.length > 0) {
      this.setState({ loginActive: false });
    } else if (
      this.state.password.length == 0 ||
      this.state.username.length == 0
    ) {
      this.setState({ loginActive: true });
    }
  };

  openUrl = () => {
    var url = "https://github.com/abhinavsharma629";
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URL: " + url);
      }
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader}
          hidesWhenStopped
          color={Colors.blue800}
        />
      );
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: "#00b5ec" }}>
          <KeyboardAvoidingView style={styles.containerView} behavior="padding">
            <View style={styles.loginScreenContainer}>
              <DropdownAlert
                ref={ref => (this.dropDownAlertRef = ref)}
                closeInterval={this.state.closeInterval}
              />
              <View style={styles.loginFormView}>
                <TouchableOpacity>
                <Image
                  style={{
                    width: 62,
                    height: 40,
                    borderRadius: 7,
                    padding: 15,
                    left: Dimensions.get('window').width/12,
                    top: 72
                  }}
                  source={require("../../required_images/image0.png")}
                />
                </TouchableOpacity>
                <Text style={styles.logoText}>WorkSpace</Text>
                <TextInput
                  placeholder="Username"

                  autoCapitalize="none"
                  placeholderColor="#c4c3cb"
                  style={styles.loginFormTextInput}
                  onChangeText={this.set_username}
                />
                <TextInput
                  placeholder="Password"
                  autoCapitalize="none"
                  placeholderColor="#c4c3cb"
                  style={styles.loginFormTextInput}
                  secureTextEntry={true}
                  onChangeText={this.set_password}
                />
                <TouchableOpacity style={styles.buttonTouchable}>
                  <Button
                    buttonStyle={styles.loginButton}
                    onPress={() => this.onLoginPress()}
                    title="Login"
                    disabled={this.state.loginActive}
                  />
                </TouchableOpacity>

              </View>
            </View>
          </KeyboardAvoidingView>
          <TouchableOpacity style={{ flex: 0.1 }}>
            <Text style={styles.instructions} onPress={this.openUrl}>
              Developer : Abhinav Sharma{"\n"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  containerView: {
    flex: 0.9
  },
  loginScreenContainer: {
    flex: 0.9
  },
  logoText: {
    fontSize: 45,
    fontFamily: "Roboto",
    fontStyle: "italic",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 50,
    textAlign: "center"
  },
  logoText1: {
    fontSize: 20,
    fontWeight: "100",
    marginTop: 100,
    textAlign: "center"
  },
  loginFormView: {
    flex: 0.9,
    top: 120
  },
  loginFormTextInput: {
    height: 45,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5
  },
  loginButton: {
    backgroundColor: "#313340",
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    width: wp('80%'),
    left: 15
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: "transparent"
  },
  buttonTouchable: {
    flex: 0.2,
    padding: 16
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "48%"
  },
  instructions: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    color: "#333333"
  }
});
