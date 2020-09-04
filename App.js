import React from "react";
import { StyleSheet, Text, View, Animated, PanResponder } from "react-native";
import FactCard from "./components/fact-card";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import axios from "axios";

const CARD_X_ORIGIN = wp("5%");
const MAX_LEFT_ROTATION_DISTANCE = wp("-150%");
const MAX_RIGHT_ROTATION_DISTANCE = wp("150%");
const LEFT_TRESHOLD_BEFORE_SWIPE = wp("-50%");
const RIGHT_TRESHOLD_BEFORE_SWIPE = wp("50%");
const FACT_URL = "https://uselessfacts.jsph.pl/random.json?language=en";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panResponder: undefined,
      topFact: undefined,
      bottomFact: undefined
    };
    this.position = new Animated.ValueXY();
  }
  componentDidMount() {
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (ecent, gesture) => {
        return Math.abs(gesture.dx) > Math.abs(gesture.dy * 3);
      },
      onPanResponderMove: (event, gesture) => {
        this.position.setValue({
          x: gesture.dx,
          y: 0
        });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx < LEFT_TRESHOLD_BEFORE_SWIPE) {
          this.forceLeftExit();
        } else if (gesture.dx > RIGHT_TRESHOLD_BEFORE_SWIPE) {
          this.forceRightExit();
        } else {
          this.resetPOsition();
        }
      }
    });
    this.setState({ panResponder }, () => {
      axios.get(FACT_URL).then(response => {
        this.setState({
          topFact: {
            ...response.data,
            image: this.getRandomImageUrl()
          }
        });
      });
    });

    this.loadButtonFact();
  }

  loadButtonFact() {
    axios.get(FACT_URL).then(response => {
      this.setState({
        bottomFact: {
          ...response.data,
          image: this.getRandomImageUrl()
        }
      });
    });
  }

  onCardExitDone = () => {
    this.setState({ topFact: this.state.bottomFact });
    this.loadButtonFact();
    this.position.setValue({
      x: 0,
      y: 0
    });
  };

  forceLeftExit() {
    Animated.timing(this.position, {
      toValue: { x: wp("-100%"), y: 0 }
    }).start(this.onCardExitDone);
  }

  forceRightExit() {
    Animated.timing(this.position, {
      toValue: { x: wp("100%"), y: 0 }
    }).start(this.onCardExitDone);
  }

  resetPOsition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getCardStyle() {
    const rotation = this.position.x.interpolate({
      inputRange: [MAX_LEFT_ROTATION_DISTANCE, 0, MAX_RIGHT_ROTATION_DISTANCE],
      outputRange: ["-120deg", "0deg", "120deg"]
    });
    return {
      transform: [{ rotate: rotation }],
      ...this.position.getLayout()
    };
  }

  getRandomImageUrl() {
    return `https://picsum.photos/id/${Math.floor(
      Math.random() * 500 + 1
    )}/${Math.round(hp("30%"))}/${Math.round(wp("90%"))}`;
  }

  renderTopCard() {
    return (
      <Animated.View
        style={this.getCardStyle()}
        {...this.state.panResponder.panHandlers}
      >
        <FactCard disabled={false} fact={this.state.topFact} />
      </Animated.View>
    );
  }

  renderBottomCard() {
    return (
      <View style={{ zIndex: -1, position: "absolute" }}>
        <FactCard disabled={true} fact={this.state.bottomFact} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>FACT SWIPE</Text>
        <View>
          {this.state.topFact && this.renderTopCard()}
          {this.state.bottomFact && this.renderBottomCard()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 50
  },
  title: {
    fontSize: 30,
    marginBottom: 70
  }
});
