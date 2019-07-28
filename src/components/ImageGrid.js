import { Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import PropTypes from "prop-types";
import React from "react";
import CameraRoll from "@react-native-community/cameraroll";

import Permissions from "react-native-permissions";

import Gird from "./Grid";

const keyExtractor = ({ uri }) => uri;

export default class ImageGrid extends React.Component {
  loading = false;
  cursor = null;

  static propTypes = {
    onPressImage: PropTypes.func
  };

  static defaultProps = {
    onPressImage: () => {}
  };

  state = {
    images: [],
    photoPermission: null
  };

  componentDidMount() {
    // this.getImages();
    Permissions.check("photo").then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response }, () => {
        if (response === "authorized") {
          this.getImages();
        } else {
          this._alertForPhotosPermission();
        }
      });
    });
  }

  _requestPermission = () => {
    Permissions.request("photo").then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response });
      if (response === "authorized") {
        this.getImages();
      }
    });
  };

  _alertForPhotosPermission() {
    Alert.alert(
      "Can we access your photos?",
      "We need access so you can send your photos",
      [
        {
          text: "No way",
          onPress: () => console.log("Permission denied"),
          style: "cancel"
        },
        this.state.photoPermission == "undetermined"
          ? { text: "OK", onPress: this._requestPermission }
          : { text: "Open Settings", onPress: Permissions.openSettings }
      ]
    );
  }

  getImages = async () => {
    if (this.loading) return;
    this.loading = true;

    const result = await CameraRoll.getPhotos({
      first: 20
    });
    const {
      edges,
      page_info: { has_next_page, end_cursor }
    } = result;

    const loadedImages = edges.map(item => item.node.image);

    this.setState({ images: loadedImages }, () => {
      this.loading = false;
      this.cursor = has_next_page ? end_cursor : null;
    });
  };

  getNextImages = () => {
    if (!this.cursor) return;

    this.getImages(this.cursor);
  };

  renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {
    const style = {
      width: size,
      height: size,
      marginLeft,
      marginTop
    };

    const { onPressImage } = this.props;

    return (
      <TouchableOpacity
        key={uri}
        activeOpacity={0.75}
        onPress={() => onPressImage(uri)}
        style={style}
      >
        <Image source={{ uri }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  render() {
    const { images } = this.state;

    return (
      <Gird
        data={images}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        onEndReached={this.getNextImages}
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1
  }
});
