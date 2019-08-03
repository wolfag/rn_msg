import { Keyboard, Platform } from "react-native";
import PropTypes from "prop-types";
import React from "react";

const INITIAL_ANIMATION_DURATION = 250;

export default class KeyboardState extends React.Component {
  static propTypes = {
    layout: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      heigh: PropTypes.number.isRequired
    }).isRequired,
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const {
      layout: { heigh }
    } = props;

    this.state = {
      contentHeight: heigh,
      keyboardHeight: 0,
      keyboardVisible: false,
      keyboardWillShow: false,
      keyboardWillHide: false,
      keyboardAnimationDuration: INITIAL_ANIMATION_DURATION
    };
  }

  componentWillMount() {
    if (Platform.OS === "ios") {
      this.subscriptions = [
        Keyboard.addListener("keyboardWillShow", this.keyboardWillShow),
        Keyboard.addListener("keyboardWillHide", this.keyboardWillHide),
        Keyboard.addListener("keyboardDidShow", this.keyboardDidShow),
        Keyboard.addListener("keyboardDidHide", this.keyboardDidHide)
      ];
    } else {
      this.subscriptions = [
        Keyboard.addListener("keyboardDidShow", this.keyboardDidShow),
        Keyboard.addListener("keyboardDidHide", this.keyboardDidHide)
      ];
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.remove());
  }

  keyboardWillShow = event => {
    this.setState({ keyboardWillShow: true });
    this.measure(event);
  };

  keyboardWillHide = event => {
    this.setState({ keyboardWillHide: true });
    this.measure(event);
  };

  keyboardDidShow = event => {
    this.setState({
      keyboardWillShow: false,
      keyboardVisible: true
    });
    this.measure(event);
  };

  keyboardDidHide = () => {
    this.setState({
      keyboardWillHide: false,
      keyboardVisible: false
    });
  };

  measure = event => {
    const { layout } = this.props;

    const {
      endCoordinates: { heigh, screenY },
      duration = INITIAL_ANIMATION_DURATION
    } = event;

    this.setState({
      contentHeight: screenY - layout.y,
      keyboardHeight: heigh,
      keyboardAnimationDuration: duration
    });
  };

  render() {
    const { children, layout } = this.props;
    const {
      contentHeight,
      keyboardHeight,
      keyboardVisible,
      keyboardWillShow,
      keyboardWillHide,
      keyboardAnimationDuration
    } = this.state;

    return children({
      containerHeight: layout.heigh,
      contentHeight,
      keyboardHeight,
      keyboardVisible,
      keyboardWillShow,
      keyboardWillHide,
      keyboardAnimationDuration
    });
  }
}
