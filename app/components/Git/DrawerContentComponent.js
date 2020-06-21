import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ScrollView
} from "react-native";

export default class DrawerContentComponent extends Component {
  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.drawerTransparent}
        onPress={() => this.props.navigation.goBack()}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.drawer}
          disabled={false}
        >
          <ScrollView>
            <View style={styles.header}>
              <Image
                source={{
                  uri:
                    "https://www.pngfind.com/pngs/m/110-1102775_download-empty-profile-hd-png-download.png"
                }}
                style={styles.headerImage}
              />
              <Text style={[styles.text, { color: "white" }]}>My Profile</Text>
            </View>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0.2)'} onPress={()=> this.props.navigation.navigate('FollowersView')}>
            <View style={styles.row}>

              <Image
                source={{
                  uri:
                    "https://www.pngfind.com/pngs/m/110-1102775_download-empty-profile-hd-png-download.png"
                }}
                style={styles.headerImage}
              />
              <Text style={styles.text}>My Followers</Text>
              </View>
              </TouchableHighlight>

          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  drawerTransparent: {
    flex: 1,
    backgroundColor: "transparent"
  },
  drawer: {
    flex: 1,
    width: 350,
    backgroundColor: "transparent"
  },
  header: {
    width: "100%",
    height: 100,
    backgroundColor: "#6195ff",
    alignItems: "center",
    justifyContent: "center"
  },
  headerImage: {
    borderRadius: 100
  },
  row: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingLeft: 10
  },
  menu: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 50,
    alignSelf: "center"
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#111"
  },
  line: {
    width: "90%",
    height: 1,
    backgroundColor: "grey",
    margin: 15,
    alignSelf: "center"
  }
});
