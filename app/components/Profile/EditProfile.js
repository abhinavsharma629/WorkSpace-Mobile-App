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
  ProgressBarAndroid,
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
import { countries } from "../StartComponents/countries";
import Carousel from "react-native-snap-carousel";

import {
  ClassicHeader,
  AppleHeader,
  ModernHeader
} from "@freakycoder/react-native-header-view";
// Custom Created

import ImagePicker from "react-native-image-picker";
import Geolocation from "react-native-geolocation-service";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      loading: false,
      closeInterval: 2000,
      loginActive: true,
      countries: countries,
      fname: "",
      lname: "",
      dob: "1900-01-01",
      state: "",
      city: "",
      address: "",
      lmark: "",
      phone: "",
      phone1: "",
      country: "",
      gender: "",
      occupation: "",
      email: "",
      pass: "",
      pass1: "",
      pass2: "",
      hackerrank: "",
      hackerearth: "",
      spoj: "",
      codeforces: "",
      codechef: "",
      twitter: "",
      github: "",
      image:
        "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
      imageData: "",
      lat: "",
      long: "",
      altitude: "",
      photo: {
        fileName: "default.jpg",
        type: "image/jpeg",
        uri:
          "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
      },
      access_token: null,
      user: null,
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user,
      img_url: this.props.screenProps.img_url
    });
    this.askLocationPermission();
    this.updateDetails(this.props.screenProps.access_token);
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

  updateDetails = access_token => {
    fetch("https://shielded-dusk-55059.herokuapp.com/user/getUserDetails", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(JSON.parse(responseJson.data));
        console.log(responseJson.extendedData);
        let userData = responseJson.extendedData;
        let userData1 = JSON.parse(responseJson.data)[0]["fields"];

        this.setState({
          username: userData["username"],
          fname: userData1["first_name"],
          lname: userData1["last_name"],
          dob: userData["dateOfBirth"],
          occupation: userData["occupation"],
          phone: userData["phoneNumber"],
          state: userData["state"],
          country: userData["country"],
          city: userData["city"],
          address: userData["address"],
          gender: userData["gender"],
          email: userData1["email"],
          lat: userData["current_lat"],
          long: userData["current_long"],
          image: userData["profilePhoto"],
          isLoading: false
        });
      });
  };

  static navigationOptions = {
    drawerLabel: "Edit Profile",
    drawerIcon: () => <Icon size={25} name="pencil-plus" />,
    tapToClose: "true"
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
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ username: data });
                }}
                value={this.state.username}
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
                value={this.state.fname}
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
                value={this.state.lname}
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
                value={this.state.phone}
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
                value={this.state.phone1}
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
                value={this.state.occupation}
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
                value={this.state.address}
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
                value={this.state.lmark}
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
                value={this.state.country}
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
                value={this.state.state}
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
                value={this.state.city}
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
                value={this.state.gender}
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
    } else if (index === 1) {
      return (
        <View style={{ flex: 1, marginLeft: 20, marginTop: 15 }}>
          <ScrollView>
            <View style={{ marginLeft: 75 }}>
              <View style={{ flexDirection: "row" }}>
                <Icon name="access-point-network" size={50} />
                <Text
                  style={{
                    marginTop: 15,
                    marginLeft: 20,
                    fontSize: 20,
                    fontFamily: "Roboto",
                    fontWeight: "bold"
                  }}
                >
                  Social Profiles
                </Text>
              </View>
              <Text />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="code-braces" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Codeforces Handle"
                outlined
                autoCapitalize="none"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ codeforces: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon
                name="code-greater-than-or-equal"
                size={30}
                style={{ marginTop: 12 }}
              />
              <TextInput
                placeholder="Hackerrank Handle"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ hackerrank: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="code-tags" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Hackerearth Handle"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ hackerearth: data });
                }}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="code-brackets" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Spoj Handle"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ spoj: data });
                }}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="code-not-equal" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Codechef Handle"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ codechef: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="github-circle" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Github Handle"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ github: data });
                }}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="twitter" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Twitter Handle"
                outlined
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ twitter: data });
                }}
              />
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
                  Update Account
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
                    marginTop: -150,
                    borderColor: "black",
                    borderWidth: 1,
                    backgroundColor: "white"
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
                disabled
                value={this.state.email}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Icon name="eye-off" size={30} style={{ marginTop: 12 }} />
              <TextInput
                placeholder="Current Password"
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
                placeholder="New Password"
                outlined
                autoCompleteType="password"
                secureTextEntry={true}
                autoCapitalize="none"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={data => {
                  this.setState({ pass1: data });
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
                title="  Update    "
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
    if (this.state.pass1 !== this.state.pass2) {
      console.log("new pass don't match");
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Passwords Don't Match"
      );
    } else {
      let s = this.state;
      console.log(s);

      if (s.pass && s.pass1 && s.pass2 && s.pass1.length < 8) {
        console.log("less strong new pass");
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
          s.pass2 &&
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
          data.append("pass1", s.pass1);
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
          data.append("hackerrank", s.hackerrank);
          data.append("hackerearth", s.hackerearth);
          data.append("codechef", s.codechef);
          data.append("codeforces", s.codeforces);
          data.append("spoj", s.spoj);
          data.append("github", s.github);
          data.append("twitter", s.twitter);
          data.append("lat", s.lat);
          data.append("long", s.long);
          data.append("lmark", s.lmark);
          data.append("altitude", s.altitude);

          console.log(data);
          console.log("data formed");

          fetch(
            "https://shielded-dusk-55059.herokuapp.com/user/updateFullUser/",
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + this.state.access_token
              },
              body: data
            }
          )
            .then(response => response.json())
            .then(responseJson => {
              console.log(responseJson);
              if (responseJson.status === "201") {
                // this.dropDownAlertRef.alertWithType(
                //   "success",
                //   "Success",
                //   "Successfully Updated Profile!!"
                // );
                this.setuserStates(responseJson);
              } else {
                this.dropDownAlertRef.alertWithType(
                  "error",
                  "Error",
                  "Please Check Your Current Password!!"
                );
              }
              this.setState({ loading: false });
            });
        } else {
          console.log("please fill up all required data");
        }
      }
    }
  };

  async setuserStates(responseJson) {
    let userStates = await AsyncStorage.getItem("userStates");
    console.log(userStates + "-----------\n\n---------------");

    let userStates1 = JSON.parse(userStates);
    let userDataChange = userStates1[this.state.user];
    delete userStates1[this.state.user];
    userStates1[this.state.username] = userDataChange;
    userStates1[this.state.username]["img_url"] = responseJson.img_url;
    userStates1[this.state.username]["user"] = this.state.username;
    console.log(userStates1);
    await AsyncStorage.setItem("userStates", JSON.stringify(userStates1));
    await AsyncStorage.setItem("user", this.state.username);
    await AsyncStorage.setItem("img_url", responseJson.img_url);
    Alert.alert(
      "Successfully Updated Profile!!\nPlease Restart The App To See The Changes!!"
    );
  }

  checkPassword = data => {
    this.setState({ pass2: data });

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
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, backgroundColor: "#00b5ec" }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
          />
          <ClassicHeader
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ScanScreen");
                }}
              >
                <Icon
                  size={30}
                  name="keyboard-backspace"
                  style={{ marginLeft: 12 }}
                />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 18, color: "#00b5ec", marginTop: 5 }}>
                  {this.state.user}
                </Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="menu" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
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
                  top: 10,
                  borderColor: "black"
                }}
                source={require("../../required_images/ws.png")}
              />
            </TouchableOpacity>
            <Text style={[styles.logoText, { marginTop: -30 }]}>WorkSpace</Text>
          </View>
          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
            hidesWhenStopped
            color="#F2B035"
          />
        </View>
      );
    } else {
      const screenWidth = Dimensions.get("window").width;
      const screenHeight = Dimensions.get("window").height;

      return (
        <View style={{ flex: 1, backgroundColor: "#00b5ec" }}>
          <ClassicHeader
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ScanScreen");
                }}
              >
                <Icon
                  size={30}
                  name="keyboard-backspace"
                  style={{ marginLeft: 12 }}
                />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 18, color: "#00b5ec", marginTop: 5 }}>
                  {this.state.user}
                </Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="menu" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            style={{ elevation: 20 }}
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
                  top: 10,
                  borderColor: "black"
                }}
                source={require("../../required_images/ws.png")}
              />
            </TouchableOpacity>
            <Text style={[styles.logoText, { marginTop: -30 }]}>WorkSpace</Text>
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
              },
              {
                index: 2,
                data: "3"
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
    flex: 0.1
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
    top: "40%"
  },
  instructions: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    color: "#333333"
  }
});
