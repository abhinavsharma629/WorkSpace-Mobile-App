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
  Dimensions,
  RefreshControl,
  findNodeHandle
} from "react-native";

import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Divider } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
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
// import SelectMultiple from 'react-native-select-multiple'
import MultiSelect from "react-native-multiple-select";

export default class CodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: null,
      isLoading: true,
      user: null,
      closeInterval: 2000,
      drawerOpen: null,
      share: false,
      unshare: false,
      overlayVisible: false,
      currentAccessedNote: null,
      friends: [],
      selectedFriends: [],
      activity_text: "Getting Your Saved Data",
      savedNotes: {},
      overlayTitle: "",
      overlayCaption: "",
      overlayButton: "",
      overlayIcon: "",
      showUpImg: null,
      overlayVisible1: false,
      refreshing:false,
      img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
    };
  }

  componentDidMount() {
    console.log("Inside componentDidMount of SavedNoteScreen");
    this.props.navigation.closeDrawer();
    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user,
      img_url:this.props.screenProps.img_url
    });
    this.getSavedNotes(this.props.screenProps.access_token);
  }

  setEdit = (noteId) =>{
    console.log(noteId)
  }


  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getSavedNotes(this.state.access_token)
  }



  getSavedNotes = access_token => {
    console.log("getting saved notes");
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/personalNotes/getAllNotesWithLessData",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "200") {
          var notes = JSON.parse(responseJson.data);
          this.saveState(notes);
        } else {
          this.dropDownAlertRef.alertWithType(
            "error",
            "Error",
            "Some Error Occured While Fetching Saved Notes!! Please Try Again Later!!"
          );
        }
      });
  };

  saveState = notes => {
    var noteData = {};
    for (var i = 0; i < notes.length; i++) {
      noteData[notes[i]["noteId"]] = notes[i];
    }
    this.setState({ refreshing:false, savedNotes: noteData, isLoading: false });
    console.log(this.state.savedNotes);
  };

  deleteNote = noteId => {
    console.log("deleting note");
    var updatedNotes = this.state.savedNotes;
    var noteData = updatedNotes[noteId];
    delete updatedNotes[noteId];
    this.setState({ savedNotes: updatedNotes });
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/personalNotes/saveDeleteNote",
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        },
        body: JSON.stringify({
          noteId: noteId
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "200") {
          this.dropDownAlertRef.alertWithType(
            "success",
            "Success",
            "Successfully Deleted The Note!!"
          );
        } else {
          this.dropDownAlertRef.alertWithType(
            "error",
            "Error",
            "Some Error Occured While Deleting The Note!! Please Try Again Later!!"
          );
          updatedNotes[noteId] = noteData;
          this.setState({ savedNotes: updatedNotes });
        }
      });
  };

  shareOrUnshareNote = () => {
    console.log(this.state.selectedFriends);
    var currentAccessedNote = this.state.currentAccessedNote;
    var selectedFriends = this.state.selectedFriends;

    var unsel_arr = [];

    this.setState({
      overlayVisible: false,
      share: false,
      unshare: false,
      currentAccessedNote: null,
      selectedFriends: []
    });

    if (this.state.share === true) {
      console.log("okay sharing " + this.state.currentAccessedNote);
      console.log(selectedFriends);
      fetch("https://shielded-dusk-55059.herokuapp.com/shared/shareNote/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        },
        body: JSON.stringify({
          noteId: currentAccessedNote,
          list: selectedFriends
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status === "201") {
            this.dropDownAlertRef.alertWithType(
              "success",
              "Success",
              "Successfully Shared Note!!"
            );
          } else {
            this.dropDownAlertRef.alertWithType(
              "error",
              "Error",
              "Some Error Occured While Sharing The Note!! Please Try Again Later!!"
            );
          }
        });
    } else if (this.state.unshare === true) {
      console.log("okay unsharing " + currentAccessedNote);
      console.log(selectedFriends);

      for (var i = 0; i < this.state.friends.length; i++) {
        if (!selectedFriends.includes(this.state.friends[i]["name"])) {
          unsel_arr.push(this.state.friends[i]["name"]);
        }
      }

      console.log(unsel_arr);
      fetch(
        "https://shielded-dusk-55059.herokuapp.com/shared/deleteSharedNote/",
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.state.access_token
          },
          body: JSON.stringify({
            noteId: currentAccessedNote,
            list: unsel_arr
          })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status === "200") {
            this.dropDownAlertRef.alertWithType(
              "success",
              "Success",
              "Successfully UnShared Note!!"
            );
          } else {
            this.dropDownAlertRef.alertWithType(
              "error",
              "Error",
              "Some Error Occured While UnSharing The Note!! Please Try Again Later!!"
            );
          }
        });
    }
  };

  onSelectionsChange = selectedFriends => {
    console.log("--------------------------");
    console.log("selections change");
    console.log("--------------------------");
    // selectedFriends is array of { label, value }
    console.log(selectedFriends);
    this.setState({ selectedFriends });
  };

  setShare = noteId => {
    this.setState({
      currentAccessedNote: noteId,
      overlayVisible: true,
      share: true,
      unshare: false,
      overlayTitle: "Sharing List",
      overlayIcon: "md-share",
      overlayButton: "Share",
      overlayCaption:
        "You Can Select Multiple Friends At The Same Time To Share Your Data With!!"
    });

    console.log("showing overlay and setting for share");

    console.log("fetching friends list for share");
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/shared/getFriends?noteId=" +
        noteId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        var friends = JSON.parse(responseJson.list);
        console.log(friends);
        var c = 0;
        var friendList = friends.map(friend => {
          console.log(friend["friends_name"] + " " + friend["username"]);
          console.log(this.state.user);
          if (friend["friends_name"] === this.state.user) {
            console.log("inside");
            c += 1;
            return {
              id: c,
              name: friend["username"]
            };
          } else {
            c += 1;
            return {
              id: c,
              name: friend["friends_name"]
            };
          }
        });
        console.log(friendList);
        this.setState({ friends: friendList, selectedFriends: [] });
      });
  };

  setUnshare = noteId => {
    console.log("showing overlay and setting for unshare");

    this.setState({
      currentAccessedNote: noteId,
      overlayVisible: true,
      share: false,
      unshare: true,
      overlayTitle: "UnSharing List",
      overlayIcon: "ios-remove-circle",
      overlayButton: "UnShare",
      overlayCaption:
        "You Can Select Multiple Friends At The Same Time To UnShare Your Data With!!"
    });

    console.log("fetching friends list for unshare");
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/shared/getUnshareFriends?noteId=" +
        noteId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        var friends = JSON.parse(responseJson.list);
        console.log(friends);
        var c = 0;
        var friendList = friends.map(friend => {
          console.log(friend["friends_name"] + " " + friend["username"]);
          console.log(this.state.user);
          if (friend["friends_name"] === this.state.user) {
            console.log("inside");
            c += 1;
            return {
              id: c,
              name: friend["username"]
            };
          } else {
            c += 1;
            return {
              id: c,
              name: friend["friends_name"]
            };
          }
        });
        console.log(friendList);
        var sel_fri = [];
        for (var i = 0; i < friendList.length; i++) {
          sel_fri.push(friendList[i]["name"]);
        }
        this.setState({ friends: friendList, selectedFriends: [...sel_fri] });
      });
  };

  onClose = () => {
    this.setState({
      overlayVisible: false,
      share: false,
      unshare: false,
      currentAccessedNote: null,
      friends: [],
      selectedFriends: []
    });
  };

  onSwipeDown = () => {
    this.setState({
      overlayVisible: false,
      share: false,
      unshare: false,
      currentAccessedNote: null,
      friends: [],
      selectedFriends: []
    });
  };

  onSwipeUp = () => {
    this.setState({
      overlayVisible: false,
      share: false,
      unshare: false,
      currentAccessedNote: null,
      friends: [],
      selectedFriends: []
    });
  };

  onClose1 = () => {
    this.setState({
      showUpImg: null,
      overlayVisible1: false
    });
  };

  onSwipeDown1 = () => {
    this.setState({
      showUpImg: null,
      overlayVisible1: false
    });
  };

  onSwipeUp1 = () => {
    this.setState({
      showUpImg: null,
      overlayVisible1: false
    });
  };

  showUpImg = noteId => {
    this.setState({ overlayVisible1: true });

    fetch(
      "https://shielded-dusk-55059.herokuapp.com/personalNotes/getNoteImage?noteId=" +
        noteId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "200") {
          console.log(responseJson.showUpImg);
          this.setState({
            showUpImg: responseJson.showUpImg
          });
        }
      });
  };

  static navigationOptions = {
    drawerLabel: "Saved Data",
    drawerIcon: () => <Icon size={25} name="ios-save" />,
    tapToClose: "true"
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
            headerTitle="Saved Data"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
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
      var notes = [];
      for (let i in this.state.savedNotes) {
        notes.push(
          <View style={{ flex: 1, marginTop: 10 }} key={i}>
            <Card
              style={{
                elevation: 5,
                borderRadius: 10,
                padding: 10,
                borderColor: "black",
                borderSize: 2,
                shadowOffset: 5,
                shadowColor: "black",
                backgroundColor: "#fffff4"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <CardTitle
                  title={this.state.savedNotes[i]["title"]}
                  subtitle={this.state.savedNotes[i]["caption"]}
                />
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginRight: 10,
                      marginTop: 20
                    }}
                  >
                    <Icon size={20} name="ios-create" />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      {moment(this.state.savedNotes[i]["createdAt"]).fromNow()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginRight: 20 }}>
                    <Icon size={20} name="ios-hourglass" />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      {moment(
                        this.state.savedNotes[i]["lastUpdated"]
                      ).fromNow()}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Button
                  icon={
                    <Icon
                      name="md-remove-circle-outline"
                      size={20}
                      color="white"
                    />
                  }
                  title="  Delete"
                  raised
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: "#E8351A"
                  }}
                  onPress={this.deleteNote.bind(this, i)}
                />

                <Button
                  icon={<Icon name="ios-create" size={20} color="white" />}
                  title="  Edit"
                  raised
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: "#0DA66E"
                  }}
                  containerStyle={{ marginLeft: 10 }}
                  onPress={this.setEdit.bind(this,i)}
                />

                <Button
                  icon={<Icon name="md-share" size={20} color="white" />}
                  title="  Share"
                  raised
                  buttonStyle={{
                    borderRadius: 5
                  }}
                  containerStyle={{ marginLeft: 10 }}
                  onPress={this.setShare.bind(this, i)}
                />

                <Button
                  icon={
                    <Icon name="md-reverse-camera" size={20} color="white" />
                  }
                  title="  Unshare"
                  raised
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: "#313340"
                  }}
                  containerStyle={{ marginLeft: 10 }}
                  onPress={this.setUnshare.bind(this, i)}
                />
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Icon size={20} name="ios-globe" />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "grey"
                  }}
                >
                  {this.state.savedNotes[i]["createdFrom"]}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.showUpImg(i);
                  }}
                  style={{ marginLeft: Dimensions.get('window').width/4 }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Icon size={20} name="ios-eye" />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        fontWeight: "bold"
                      }}
                    >
                      {this.state.savedNotes[i]["typeOfData"]}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        );
      }

      let imgData;
      if (this.state.showUpImg) {
        imgData = (
          <View>
          <Image
            source={{ uri: this.state.showUpImg }}
            style={{
              width: 300,
              height: 300,
              marginLeft:20,
              borderColor:'black',
              borderWidth:1,
              backgroundColor:'white',
              resizeMode: 'contain',
            }}
          />
          <CardAction
            seperator={true}
            inColumn={false}
            style={{ marginTop: 20, marginLeft: 130 }}
          >
            <CardButton
              onPress={() => {
                this.onClose1();
              }}
              title="Cancel"
              color="red"
            />
          </CardAction>
          </View>
        );
      } else {
        imgData = (
          <View>
          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader1}
            hidesWhenStopped
            color={Colors.blue800}
          />
          <CardAction
            seperator={true}
            inColumn={false}
            style={{ marginTop: 350, marginLeft: 130 }}
          >
            <CardButton
              onPress={() => {
                this.onClose1();
              }}
              title="Cancel"
              color="red"
            />
          </CardAction>
          </View>
        );
      }

      console.log(imgData)
      return (

        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Saved Data"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
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
          <ScrollView

            refreshControl={
              <RefreshControl

                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
          <View style={{ flex: 1 }}>
            <ScrollView>{notes}</ScrollView>
          </View>
          </ScrollView>

          <GestureRecognizer
            onSwipeDown={this.onSwipeDown}
            onSwipeUp={this.onSwipeUp}
            config={config}
          >
            <View style={{ flex: 1 }}>
              <Overlay
                visible={this.state.overlayVisible}
                onClose={this.onClose}
                containerStyle={{
                  elevation: 15,
                  borderRadius: 20,
                  padding: 20,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  marginTop: 300,
                  backgroundColor: "#313340",
                  shadowColor: "black",
                  color: "#313340",
                  marginBottom: -15
                }}
                closeOnTouchOutside
                animationType="fadeInUp"
              >
                <View>
                  <TouchableWithoutFeedback
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
                          title={this.state.overlayTitle}
                          subtitle={this.state.overlayCaption}
                        />
                        <Icon
                          size={20}
                          name={this.state.overlayIcon}
                          style={{ marginRight: 20, marginTop: 22 }}
                        />
                      </View>
                      <KeyboardAvoidingView>
                        <ScrollView style={{ flex: 1, marginLeft: 10 }}>
                          <MultiSelect
                            hideTags
                            items={this.state.friends}
                            uniqueKey="name"
                            ref={component => {
                              this.multiSelect = component;
                            }}
                            onSelectedItemsChange={this.onSelectionsChange}
                            selectedItems={this.state.selectedFriends}
                            selectText="Select Friends"
                            searchInputPlaceholderText="Search Friends..."
                            onChangeInput={text => console.log(text)}
                            altFontFamily="ProximaNova-Light"
                            tagRemoveIconColor="black"
                            tagBorderColor="black"
                            tagTextColor="#CCC"
                            selectedItemTextColor="#CCC"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            displayKey="name"
                            searchInputStyle={{ color: "black" }}
                            hideSubmitButton={true}
                          />

                          <CardAction
                            seperator={true}
                            inColumn={false}
                            style={{ marginTop: 50, marginLeft: 80 }}
                          >
                            <CardButton
                              onPress={() => {
                                this.onClose();
                              }}
                              title="Cancel"
                              color="red"
                            />
                            <CardButton
                              onPress={() => {
                                this.shareOrUnshareNote();
                              }}
                              title={this.state.overlayButton}
                              color="blue"
                            />
                          </CardAction>
                        </ScrollView>
                      </KeyboardAvoidingView>
                    </Card>
                  </TouchableWithoutFeedback>
                </View>
              </Overlay>
            </View>
          </GestureRecognizer>

          <GestureRecognizer
            onSwipeDown={this.onSwipeDown1}
            onSwipeUp={this.onSwipeUp1}
            config={config}
          >
            <View style={{ flex: 1 }}>
              <Overlay
                visible={this.state.overlayVisible1}
                onClose={this.onClose1}
                containerStyle={{
                  elevation: 15,
                  borderRadius: 20,
                  padding: 20,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  marginTop: 55,
                  backgroundColor: "#313340",
                  shadowColor: "black",
                  color: "#313340",
                  marginBottom: -15
                }}
                closeOnTouchOutside
                animationType="fadeInUp"
              >
                <View>
                  <TouchableWithoutFeedback
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
                        <CardTitle title="ScreenShot Overview" />
                        <Icon
                          size={20}
                          name="md-image"
                          style={{ marginRight: 20, marginTop: 22 }}
                        />
                      </View>

                      <View style={{ flex: 1, marginLeft: 10 }}>
                        {imgData}


                      </View>
                    </Card>
                  </TouchableWithoutFeedback>
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
    flex: 1
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "40%",

  },
  loader1: {
    alignItems: "center",
    justifyContent: "center",
    top: "40%",
    left: "30%"
  }
});
