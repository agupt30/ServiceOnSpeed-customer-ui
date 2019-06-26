import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
	TouchableOpacity
} from 'react-native';
import axios from 'axios';
import Icon from '../components/CustomIcon';

const API_KEY = 'AIzaSyAaKNdcx_twduM4Ag3ZCZDHotJQhCKA-QI';

 class SelectPlace extends React.Component {
   constructor(props) {
     super(props);
     this.state ={
       places:[],
       textValue:'',
       position: {
        latitude: 0,
        longitude: 0,
        address : '',
       }
     }
     this.timeoutID
   }
  static navigationOptions = ({ navigation }) => ({
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: '#015b63',
    },
    headerTitle: (
      <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{ alignItems: 'center',justifyContent: 'center'}}>
              <Text
                  style={{
                      fontSize: 20,
                      color: '#ffffff',
                      fontWeight: 'bold',
                      justifyContent: 'center',
                      alignItems: 'center',
              }}>Service Place</Text>
          </View>
      </View>
    ),
  });

  callPlacesValue = (textValue) => {
    if(textValue.length > 1) {
      this.setState({
      textValue,
      secondCount: this.state.secondCount+1
    },() => {
      clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout(() => {
        axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+this.state.textValue+'&language=en&location='+this.state.position+'&radius=10000&key='+API_KEY)
        .then(response => {
          let places = response.data.predictions;
          if(this.state.textValue.length !== 2) {
            this.setState({
              places
            });
          } else {
            this.setState({
              places: []
            });
          }
        })
        .catch(error => {
          alert(JSON.stringify(error.status));
        })
      },500);
    })
  } else {
      this.setState({
        places: []
      })
    }
  }

  placeDetails = (item) => {
    axios.get('https://maps.googleapis.com/maps/api/place/details/json?placeid='+item.place_id+'&fields=geometry&key='+API_KEY).then(response => {
      this.setState({position: {
        ...this.state.position,
        latitude:JSON.stringify(response.data.result.geometry.location.lat),
        longitude:JSON.stringify(response.data.result.geometry.location.lng),
        address: item.description
      }},() => {
        // alert(JSON.stringify(this.state.position));
          this.props.locationSelectedAction(this.state.position);
          this.props.navigation.navigate('ServiceBookScreen');
      });
    }).catch(error => {
      alert("error");
    })
  }
 
   render() {
    return (
      <ScrollView style={{paddingLeft:10,paddingRight:10,paddingTop:10}}>
       <View style={styles.inputWrapper}>
            <Icon  name="search" color='#d8d8d8' size={15}/>
            <TextInput
              style={styles.input}
              placeholder="Your Location"
              onChangeText = {
                (text) => this.callPlacesValue(text)
              }
            />
        </View>
        <View style={{width:"100%"}}>
         {
           this.state.places.length > 0 ? 
          this.state.places.map((item,index) => {
            return(
              <TouchableOpacity onPress={() => this.placeDetails(item)} style={{flexDirection: 'row', borderBottomWidth:2, borderBottomColor:"#dcdcdc", paddingBottom: 5}} key = {index}>
          <View key = {index} style={{paddingTop: 10,paddingRight: 15, paddingLeft:15,marginTop:10,marginBottom:10}}>
                <Icon  name="location" color="#d8d8d8" size={15}/>
              </View>
              <View>
                <Text numberOfLines={1} style={{fontSize: 15,paddingRight: 50,color: '#000000',marginTop: 10}}>{item.structured_formatting.main_text}</Text>
                <Text numberOfLines={1} style={{fontSize: 13,paddingRight: 50,color:'#868482',marginBottom: 10}}>{item.structured_formatting.secondary_text}</Text>
              </View>
        </TouchableOpacity>
            )
          }) : null
         }
         </View>
      </ScrollView>
    );
       
}
}

export default SelectPlace;
const styles = StyleSheet.create({
  inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 3,
      shadowColor: '#dbdbdb',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
      borderColor: "#dcdcdc",
      paddingLeft: 15,
      borderRadius: 5,
  },
  input: {
      flex: 1,
      paddingTop: 10,
      paddingRight: 10,
      paddingLeft: 5,
      paddingBottom: 10,
      backgroundColor: '#fff',
      color: '#000000',
      borderWidth: 1,
      borderColor: "transparent",
      borderRadius: 5,
  },
})
