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
  SafeAreaView,
  findNodeHandle
} from "react-native";

import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Divider } from "react-native-elements";
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
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";
import Overlay from "react-native-modal-overlay";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import ViewShot, { captureScreen } from "react-native-view-shot";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";

export default class NoteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: null,
      isLoading: false,
      user: null,
      closeInterval: 1000,
      drawerOpen: null,
      activity_text: "Initializing Note Editor",
      noteHtml: "",
      screenShotUri: "",
      overlayVisible: false,
      modalVisible: false,
      title: "",
      caption: "",
      fileUri: null,
      fileData: null,
      filePath: null,
      img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
    };
  }

  componentDidMount() {
    this.props.navigation.closeDrawer();
    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user,
      img_url:this.props.screenProps.img_url
    });
  }

  static navigationOptions = {
    drawerLabel: "Create Note",
    drawerIcon: () => <Icon size={25} name="file-document-edit-outline" />,
    tapToClose: "true"
  };

  onPressAddImage = () => {
    // insert URL
    console.log("adding image");
    this.richText.insertImage(
      "https://user-images.githubusercontent.com/19371443/29345991-f483791a-8274-11e7-9d1e-8001016b6409.png"
    );
    // insert base64
    // this.richText.insertImage(`data:${image.mime};base64,${image.data}`);
    this.richText.blurContentEditor();
  };

  save = async () => {
    // Get the data here and call the interface to save the data
    let html = await this.richText.getContentHtml();
    // console.log(html);
    alert(html);
  };

  setImage = async data => {
    // Get the data here and call the interface to save the data
    let html = await this.richText.getContentHtml();
    // console.log(html);
    html += `<br><img src="` + data + `" /><br>`;

    this.richText.setContentHTML(html);
    this.richText.blurContentEditor();
    console.log("inserted image");
  };

  clearEditor = () => {
    console.log("clearing editor");
    this.setState({ noteHtml: "" });
    this.richText.setContentHTML("");
  };

  saveNote = async () => {
    let html = await this.richText.getContentHtml();
    console.log(html);
    captureScreen({
      format: "jpg",
      quality: 0.8
    }).then(
      uri => {
        this.setState({ screenShotUri: uri });
      },
      error => console.error("Oops, snapshot failed", error)
    );
    this.setState({ overlayVisible: true, noteHtml: html });
  };

  onClose = () => this.setState({ overlayVisible: false });

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onSwipeDown = () => {
    this.setState({ overlayVisible: false });
  };

  onChangeTitle = text => {
    this.setState({ title: text });
  };

  onChangeCaption = text => {
    this.setState({ caption: text });
  };

  serverSaveNote = () => {
    console.log(
      JSON.stringify({
        content: this.state.noteHtml,
        title: this.state.title,
        caption: this.state.caption,
        imgData: this.state.screenShotUri
      })
    );
    let noteHtml=this.state.noteHtml
    let title=this.state.title
    let caption=this.state.caption

    console.log("Saving note data");
    this.setState({noteHtml:"", title:"", caption:"", overlayVisible:false})
    this.richText.setContentHTML("")
    this.dropDownAlertRef.alertWithType(
      "success",
      "Success",
      "Your Data Will Be Saved And You Will Be Informed Soon!!"
    );

    let data = "";
    RNFetchBlob.fs
      .readStream(
        // file path
        this.state.screenShotUri,
        // encoding, should be one of `base64`, `utf8`, `ascii`
        "base64",
        // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
        // when reading file in BASE64 encoding, buffer size must be multiples of 3.
        4095
      )
      .then(ifstream => {
        ifstream.open();
        ifstream.onData(chunk => {
          // when encoding is `ascii`, chunk will be an array contains numbers
          // otherwise it will be a string
          data += chunk;
        });
        ifstream.onError(err => {
          console.log("oops", err);
          this.dropDownAlertRef.alertWithType(
            "error",
            "error",
            "Some Error Occured While Taking ScreenShot!! Please Try Again Later!!"
          );
        });
        ifstream.onEnd(() => {
          console.log("data:image/jpeg;base64," + data);

          fetch(
            "https://shielded-dusk-55059.herokuapp.com/personalNotes/saveDeleteNote",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.state.access_token
              },
              body:JSON.stringify({
                    content:noteHtml,
                    title:title,
                    caption:caption,
                    imgData: "data:image/jpeg;base64," + data
              })

            }
          )
            .then(response => response.json())
            .then(responseJson => {
              if(responseJson.status==="201"){
                this.dropDownAlertRef.alertWithType(
                  "success",
                  "Success",
                  "Successfully Saved Note Data!!"
                );
              }
              else{
                this.dropDownAlertRef.alertWithType(
                  "error",
                  "error",
                  "Some Error Occured While Saving Data!! Please Try Again Later!!"
                );
              }

            })
        });
      });


  }

  chooseImage = () => {
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
        this.setImage("data:image/jpeg;base64," + response.data);
      }
    });
  };

  render() {
    const config = {
      velocityThreshold: 0.5,
      directionalOffsetThreshold: 80
    };

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Create Note"
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
    } else {
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Create Note"
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
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 0.9,
                elevation: 10,
                padding: 5,
                borderRadius: 5,
                shadowColor: "#313340"
              }}
            >
              <ScrollView style={styles.scroll}>
                <RichEditor
                  ref={rf => (this.richText = rf)}
                  initialContentHTML={this.state.noteHtml}
                  style={styles.rich}
                />
              </ScrollView>
              <KeyboardAvoidingView>
                <RichToolbar
                  style={styles.richBar}
                  getEditor={() => this.richText}
                  iconTint={"#000033"}
                  selectedIconTint={"#2095F2"}
                  selectedButtonStyle={{ backgroundColor: "transparent" }}
                  onPressAddImage={this.chooseImage}
                />
              </KeyboardAvoidingView>
            </View>
            <View style={{ flex: 0.1, backgroundColor: "white" }}>
              <View
                style={{ flexDirection: "row", marginTop: 10, marginLeft: 70 }}
              >
                <Button
                  icon={
                    <Icon name="content-save-move" size={20} color="white" />
                  }
                  title="  Save Note "
                  raised
                  buttonStyle={{
                    borderRadius: 5
                  }}
                  onPress={this.saveNote}
                />

                <Button
                  icon={
                    <Icon name="delete-sweep-outline" size={20} color="white" />
                  }
                  title="  Clear Editor "
                  raised
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: "#313340"
                  }}
                  containerStyle={{ marginLeft: 20 }}
                  onPress={this.clearEditor}
                />
              </View>
            </View>
          </View>

          <GestureRecognizer onSwipeDown={this.onSwipeDown} config={config}>
            <View style={{ flex: 1 }}>
              <Overlay
                visible={this.state.overlayVisible}
                onClose={this.onClose}
                containerStyle={{
                  elevation: 15,
                  borderRadius: 20,
                  marginBottom: -17,
                  padding: 20,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  marginTop: 55,
                  backgroundColor: "#313340",
                  shadowColor: "black",
                  color: "#313340"
                }}
                closeOnTouchOutside
                animationType="fadeInUp"
              >
                <View>
                  <View
                    style={{
                      flex: 1
                    }}
                  >
                    <Card
                      style={{
                        marginTop: -25,
                        marginBottom: -25,

                        elevation: 15,
                        borderRadius: 10,
                        padding: 10,
                        borderColor: "black",
                        borderSize: 2,
                        shadowOffset: 5,
                        width: 380,

                        shadowColor: "black"
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <CardTitle
                          title="Save Note"
                          subtitle="We Will Take A Screen Shot Of Your Note So That You Can Take An OverView Later!!"
                        />
                        <Icon
                          size={20}
                          name="content-save-all"
                          style={{ marginRight: 20, marginTop: 22 }}
                        />
                      </View>

                      <ScrollView
                        style={{
                          marginTop: 5,
                          marginLeft: 10,
                          flex: 1,
                          width: 350
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>Title</Text>
                        <TextInput
                          placeholder="Title"
                          placeholderColor="#c4c3cb"
                          style={styles.loginFormTextInput}
                          onChangeText={text => {
                            this.onChangeTitle(text);
                          }}
                          value={this.state.title}
                        />
                        <Text />

                        <Text style={{ fontWeight: "bold" }}>Caption</Text>
                        <TextInput
                          multiline={true}
                          onChangeText={text => {
                            this.onChangeCaption(text);
                          }}
                          placeholder="Caption"
                          style={styles.caption}
                          outline={true}
                          value={this.state.caption}
                        />
                      </ScrollView>
                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: 70,
                          marginTop: 10
                        }}
                      >
                        <Button
                          icon={
                            <Icon
                              name="content-save-outline"
                              size={20}
                              color="white"
                            />
                          }
                          title="  Save Note "
                          raised
                          buttonStyle={{
                            borderRadius: 5,
                            backgroundColor: "#0DA66E"
                          }}
                          onPress={this.serverSaveNote}
                        />

                        <Button
                          icon={
                            <Icon
                              name="close-circle-outline"
                              size={20}
                              color="white"
                            />
                          }
                          title="  Close   "
                          raised
                          buttonStyle={{
                            borderRadius: 5,
                            backgroundColor: "red"
                          }}
                          containerStyle={{ marginLeft: 20 }}
                          onPress={this.onClose}
                        />
                      </View>
                    </Card>
                  </View>
                </View>
              </Overlay>
            </View>
          </GestureRecognizer>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "40%"
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5
  },
  rich: {
    minHeight: 300,
    flex: 1
  },
  richBar: {
    height: 50,
    backgroundColor: "#F5FCFF"
  },
  scroll: {
    backgroundColor: "#ffffff"
  },
  loginFormTextInput: {
    height: 45,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 5
  },
  caption: {
    height: 100,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 5
  }
});
