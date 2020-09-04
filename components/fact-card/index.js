import React, { Component } from "react";
import { Image, Button, View, Text, Linking, ScrollView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { cardStyle } from "./style";

class FactCard extends Component {
  goToTopScrollView = () => {
    this.ScrollView.scrollTo({ x: 0, Y: 0, animated: true });
  };

  render() {
    return (
      <View style={cardStyle.card}>
        <Image
          source={{
            uri: this.props.fact.image
          }}
          style={{ width: wp("90%"), height: hp("30%") }}
        />
        <ScrollView
          ref={ScrollViewRef => {
            this.ScrollView = ScrollViewRef;
          }}
          onScrollEndDrag={this.goToTopScrollView}
          height={hp("10%")}
        >
          <Text>{this.props.fact.text}</Text>
        </ScrollView>
        <Button
          title="See the source "
          disabled={this.props.disabled}
          onPress={() => Linking.openURL(this.props.fact.source_url)}
        />
      </View>
    );
  }
}

export default FactCard;
