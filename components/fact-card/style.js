import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export const cardStyle = StyleSheet.create({
  card: {
    elevation: 1,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.7,
    width: wp("90%"),
    backgroundColor: "white"
  }
});
