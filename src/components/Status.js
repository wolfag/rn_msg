import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import NetInfo from "@react-native-community/netinfo";

export default class Status extends React.Component {
  state = {
    connectionType: null
  };

  async componentDidMount() {
    this.subscription = NetInfo.addEventListener(state => {
      this.handleChange(state.type);
    });
  }

  componentWillUnmount() {
    this.subscription();
  }

  handleChange = connectionType => {
    this.setState({ connectionType });
  };

  render() {
    const { connectionType } = this.state;

    const isConnected = connectionType !== "none";

    const backgroundColor = isConnected ? "white" : "red";

    const statusBar = (
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? "dark-content" : "light-content"}
        animated={false}
      />
    );

    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents={"none"}>
        {statusBar}
        {!isConnected && (
          <View style={styles.bubble}>
            <Text style={styles.text}>No network connection</Text>
          </View>
        )}
      </View>
    );

    if (Platform.OS === "ios") {
      return (
        <View style={[styles.status, { backgroundColor }]}>
          {messageContainer}
        </View>
      );
    }
    return messageContainer;
  }
}

const statusHeight = Platform.OS === "ios" ? 20 : 0;
const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight
  },
  messageContainer: {
    zIndex: 1,
    position: "absolute",
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: "center"
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "red"
  },
  text: {
    color: "white"
  }
});
