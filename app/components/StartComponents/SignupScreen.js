import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage,
  Linking,
  ScrollView,
  Image,
  BackHandler,
  Dimensions,
  PermissionsAndroid
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors, TextInput } from "react-native-paper";
import { Button } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import RNExitApp from "react-native-exit-app";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-material-dropdown";
import DatePicker from "react-native-datepicker";
import { countries } from "./countries";
import Carousel from "react-native-snap-carousel";
// Custom Created
import MainScreen from "../MainPageComponents/MainPage.js";
import ImagePicker from "react-native-image-picker";
import Geolocation from "react-native-geolocation-service";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

export default class SignupScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      loading: false,
      closeInterval: 2000,
      loginActive: true,
      countries: countries,
      fname: null,
      lname: null,
      dob: "1900-01-01",
      state: null,
      city: null,
      address: null,
      lmark: null,
      phone: null,
      phone1: null,
      country: null,
      gender: null,
      occupation: null,
      email: null,
      pass: null,
      pass1: null,
      hackerrank: null,
      hackerearth: null,
      spoj: null,
      codeforces: null,
      codechef: null,
      twitter: null,
      github: null,
      image:
        "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
      imageData: "",
      lat: "",
      long: "",
      altitude: null,
      photo: {
        fileName: "default.jpg",
        type: "image/jpeg",
        uri:
          "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
      }
    };
  }

  componentDidMount() {
    this.askLocationPermission();
  }

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
          this.setState({ loading: false });
          AsyncStorage.setItem("user", this.state.username);
          AsyncStorage.setItem("access_token", responseJson.token_data.access);
          AsyncStorage.setItem(
            "refresh_token",
            responseJson.token_data.refresh
          );

          // this.props.navigation.navigate("MainPage", {
          //   access_token: responseJson.token_data.access
          // });

          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "MainPage",
                params: {
                  access_token: responseJson.token_data.access,
                  user: this.state.username
                }
              })
            ]
          });
          this.props.navigation.dispatch(resetAction);

          this.dropDownAlertRef.alertWithType(
            "success",
            "Success",
            "Successfully Logged In!!"
          );

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

  _renderItem = ({ data, index }) => {
    const screenWidth = Dimensions.get("window").width;
    console.log("rendering " + index);
    let countries = [...this.state.countries];

    let gender = [
      {
        index: "M",
        value: "Male"
      },
      {
        index: "F",
        value: "Female"
      },
      {
        index: "O",
        value: "Other"
      }
    ];
    if (index === 0) {
      return (
        <View style={{ flex: 1, marginLeft: 20, marginTop: 15 }}>
          <ScrollView>
            <View style={{ marginLeft: 75 }}>
              <View style={{ flexDirection: "row" }}>
                <Icon name="account-card-details-outline" size={50} />
                <Text
                  style={{
                    marginTop: 15,
                    marginLeft: 20,
                    fontSize: 20,
                    fontFamily: "Roboto",
                    fontWeight: "bold"
                  }}
                >
                  Personal Details
                </Text>
              </View>
              <Text />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon
                name="account-details"
                size={30}
                style={{ marginTop: 12 }}
              />
              <TextInput
                placeholder="Username"
                outlined
                autoCapitalize="none"
                autoCompleteType="username"
                autoFocus
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ username: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="rename-box" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="First Name"
                outlined
                placeholderColor="#c4c3cb"
                autoCompleteType="name"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ fname: data });
                }}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="rename-box" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Last Name"
                outlined
                placeholderColor="#c4c3cb"
                autoCompleteType="name"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ lname: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon
                name="cellphone-iphone"
                size={30}
                style={{ marginTop: 12 }}
              />
              <TextInput
                placeholder="Phone"
                outlined
                keyboardType={"phone-pad"}
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ phone: data });
                }}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon
                name="cellphone-android"
                size={30}
                style={{ marginTop: 12 }}
              />
              <TextInput
                placeholder="Alternate Phone"
                outlined
                keyboardType={"phone-pad"}
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ phone1: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="server-network" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Occupation"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ occupation: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon
                name="home-city-outline"
                size={30}
                style={{ marginTop: 12 }}
              />
              <TextInput
                placeholder="Address"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ address: data });
                }}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="home-modern" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Landmark"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ lmark: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon
                name="city-variant-outline"
                size={30}
                style={{ marginTop: 20 }}
              />
              <Dropdown
                label="Country"
                data={countries}
                containerStyle={{
                  marginLeft: 20,
                  width: 290,
                  marginTop: -10
                }}
                pickerStyle={{ marginTop: -110, backgroundColor: "black" }}
                itemTextStyle={{ color: "white" }}
                textColor="white"
                baseColor="black"
                selectedItemColor="white"
                onChangeText={data => {
                  this.setState({ country: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="city" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="State"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ state: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="home-modern" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="City"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ city: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon
                name="gender-male-female"
                size={30}
                style={{ marginTop: 20 }}
              />
              <Dropdown
                label="Gender"
                data={gender}
                containerStyle={{
                  marginLeft: 20,
                  width: 290,
                  marginTop: -10
                }}
                pickerStyle={{ marginTop: -110, backgroundColor: "black" }}
                itemTextStyle={{ color: "white" }}
                textColor="white"
                baseColor="black"
                selectedItemColor="white"
                onChangeText={data => {
                  this.setState({ gender: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <DatePicker
                style={{ width: 350 }}
                date={this.state.dob}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="1900-01-01"
                maxDate="5000-12-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 15,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 45,
                    marginTop: 20,
                    backgroundColor: "white",
                    borderRadius: 5,
                    elevation: 2
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={date => {
                  this.setState({ dob: date });
                }}
              />
            </View>

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <Icon
                name="map-marker-check"
                size={30}
                style={{ marginTop: 12 }}
              />
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  placeholder="Longitude"
                  outlined
                  disabled
                  value={this.state.long.toString()}
                  placeholderColor="#c4c3cb"
                  style={styles.loginFormTextInput1}
                />
                <TextInput
                  placeholder="Latitude"
                  disabled
                  outlined
                  value={this.state.lat.toString()}
                  placeholderColor="#c4c3cb"
                  style={styles.loginFormTextInput1}
                />
              </View>
            </View>

            <Text />
            <Text />
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, marginLeft: 20, marginTop: 15 }}>
          <ScrollView>
            <View style={{ marginLeft: 75 }}>
              <View style={{ flexDirection: "row" }}>
                <Icon name="account-circle-outline" size={50} />
                <Text
                  style={{
                    marginTop: 15,
                    marginLeft: 20,
                    fontSize: 20,
                    fontFamily: "Roboto",
                    fontWeight: "bold"
                  }}
                >
                  Create Account
                </Text>
              </View>
              <Text />
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  this.selectImage();
                }}
              >
                <Icon
                  name="image-plus"
                  size={30}
                  style={{
                    marginTop: 122,
                    zIndex: 1,
                    marginLeft: 208
                  }}
                />
                <Image
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                    marginLeft: 110,
                    marginTop: -150
                  }}
                  source={{
                    uri: this.state.image
                  }}
                />
              </TouchableOpacity>
            </View>
            <Text />

            <View style={{ flexDirection: "row" }}>
              <Icon
                name="email-mark-as-unread"
                size={30}
                style={{ marginTop: 12 }}
              />
              <TextInput
                placeholder="Email"
                outlined
                autoCapitalize="none"
                autoCompleteType="email"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ email: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="eye-off" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Password"
                outlined
                placeholderColor="#c4c3cb"
                autoCompleteType="password"
                autoCapitalize="none"
                secureTextEntry={true}
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ pass: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon
                name="textbox-password"
                size={30}
                style={{ marginTop: 12 }}
              />
              <TextInput
                placeholder="Confirm Password"
                outlined
                autoCompleteType="password"
                secureTextEntry={true}
                autoCapitalize="none"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.checkPassword(data);
                }}
              />
            </View>
            <Text />
            <View style={{ flexDirection: "row", marginLeft: 110 }}>
              <Button
                icon={<Icon name="google-play" size={20} color="white" />}
                title="  Create    "
                raised
                buttonStyle={{
                  borderRadius: 5,
                  backgroundColor: "#313340"
                }}
                containerStyle={{ marginLeft: 20 }}
                onPress={this.submitData}
              />
            </View>

            <Text />
            <Text />
          </ScrollView>
        </View>
      );
    }
  };

  submitData = () => {
    console.log("submitting data");
    if (this.state.pass !== this.state.pass1) {
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Passwords Don't Match"
      );
    } else {
      let s = this.state;

      if (s.pass && s.pass1 && s.pass.length < 8) {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Create A Strong Password!!"
        );
      } else {
        if (
          s.username &&
          s.fname &&
          s.email &&
          s.pass &&
          s.pass1 &&
          s.lname &&
          s.lmark &&
          s.country &&
          s.state &&
          s.city &&
          s.phone &&
          s.occupation &&
          s.address &&
          s.gender &&
          s.dob &&
          s.email
        ) {
          console.log("All Required Data Filled");

          this.setState({ loading: true });
          const data = new FormData();
          data.append("photo", {
            name: s.photo.fileName,
            type: s.photo.type,
            uri:
              Platform.OS === "android"
                ? s.photo.uri
                : s.photo.uri.replace("file://", "")
          });

          data.append("username", s.username);
          data.append("pass", s.pass);
          data.append("email", s.email);
          data.append("fname", s.fname);
          data.append("lname", s.lname);
          data.append("country", s.country);
          data.append("state", s.state);
          data.append("city", s.city);
          data.append("phone", s.phone);
          data.append("phone1", s.phone1);
          data.append("occupation", s.occupation);
          data.append("address", s.address);
          data.append("dob", s.dob);
          data.append("gender", s.gender);
          data.append("image", s.image);
          data.append("lat", s.lat);
          data.append("long", s.long);
          data.append("lmark", s.lmark);
          data.append("altitude", s.altitude);

          console.log(data);
          console.log("data formed");

          fetch(
            "https://shielded-dusk-55059.herokuapp.com/user/createFullUser/",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
              },
              body: data
            }
          )
            .then(response => response.json())
            .then(responseJson => {
              console.log(responseJson);
              if (responseJson.status === "200") {
                this.dropDownAlertRef.alertWithType(
                  "error",
                  "Error",
                  "Username is Already Taken!! Try Another One Please!!"
                );
              } else if (responseJson.status === "201") {
                this.dropDownAlertRef.alertWithType(
                  "success",
                  "Success",
                  "Successfully Created Your Profile!!"
                );
                console.log("setting");
                AsyncStorage.setItem("user", this.state.username);
                AsyncStorage.setItem(
                  "access_token",
                  responseJson.token_data.access
                );
                AsyncStorage.setItem(
                  "refresh_token",
                  responseJson.token_data.refresh
                );
                AsyncStorage.setItem("img_url", responseJson.img_url);

                console.log("navigating");

                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({
                      routeName: "MainPage",
                      params: {
                        access_token: responseJson.token_data.access,
                        user: this.state.username,
                        img_url: responseJson.img_url
                      }
                    })
                  ]
                });
                this.props.navigation.dispatch(resetAction);

                console.log("navigated");
              } else {
                this.dropDownAlertRef.alertWithType(
                  "error",
                  "Error",
                  "Some Error Occured!! Please Try Again Later!!"
                );
              }
              this.setState({ loading: false });
            });
        } else {
          this.dropDownAlertRef.alertWithType(
            "error",
            "Error",
            "Please Fill All The Enteries For Better Experience!!"
          );
        }
      }
    }
  };

  checkPassword = data => {
    this.setState({ pass1: data });

    //Can Be Used For Real Time Password Match

    // var pass=this.state.pass
    // var pass1=data
    // if(data.length>pass.length){
    //   console.log("pass doesn't match as its length is greater")
    //   this.dropDownAlertRef.alertWithType(
    //     "error",
    //     "Error",
    //     "Passwords Don't Match"
    //   );
    // }
    // else{
    //   if(pass.substring(0,data.length)===pass1){
    //
    //     this.dropDownAlertRef.alertWithType(
    //       "success",
    //       "Success",
    //       "Passwords Matched"
    //     );
    //     console.log("pass matching till now")
    //   }
    //   else{
    //     console.log("pass unmatched")
    //     this.dropDownAlertRef.alertWithType(
    //       "error",
    //       "Error",
    //       "Passwords Don't Match"
    //     );
    //   }
    // }
  };

  selectImage = () => {
    console.log("choosing image");
    let options = {
      title: "Select Image",

      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        // const source = { uri: response.uri };
        console.log(response.uri);

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log("inserting image");
        //console.log(response)

        this.setState({
          image: response.uri,
          imageData: "data:image/jpeg;base64," + response.data,
          photo: response
        });
      }
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1 }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
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
    } else {
      const screenWidth = Dimensions.get("window").width;
      const screenHeight = Dimensions.get("window").height;

      return (
        <View style={{ flex: 1, backgroundColor: "#00b5ec" }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
          />
          <View style={styles.loginFormView}>
            <TouchableOpacity>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  padding: 15,
                  left: 95,
                  top: 60,
                  borderColor: "black"
                }}
                source={require("../../required_images/ws.png")}
              />
            </TouchableOpacity>
            <Text style={styles.logoText}>WorkSpace</Text>
          </View>
          <Text />

          <Carousel
            layout={"default"}
            layoutCardOffset={30}
            ref={c => {
              this._carousel = c;
            }}
            data={[
              {
                index: 0,
                data: "1"
              },
              {
                index: 1,
                data: "2"
              }
            ]}
            renderItem={this._renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
          />
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
    fontSize: 35,
    fontFamily: "Roboto",
    fontStyle: "italic",
    fontWeight: "bold",
    marginTop: 15,
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
    flex: 0.1,
    top: -40
  },
  loginFormTextInput: {
    height: 45,
    fontSize: 14,
    width: 300,
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
  loginFormTextInput1: {
    height: 45,
    fontSize: 14,
    width: 139,
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
    backgroundColor: "#3897f1",
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    width: 350,
    left: 18
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
    fontSize: 15,
    textAlign: "center",
    color: "#333333"
  }
});
