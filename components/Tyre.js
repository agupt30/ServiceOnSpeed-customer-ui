import React, { Component } from 'react'
import { View, ScrollView, Image, StyleSheet, Dimensions, Text, Animated, TouchableOpacity} from 'react-native';
import { Icon} from 'react-native-elements';
const { width } = Dimensions.get('window');
export default class Tyre extends Component {
  // static navigationOptions = ({ navigation }) => ({
//     drawerIcon : ({tintColor}) => (
//       <Icon size={15} name="bell"  type="font-awesome" color={tintColor} />
//     )
// });
  render() {
    return (
      <View>
        <Text>Tyre replacement and puncture</Text>
      </View>
    )
  }
}
