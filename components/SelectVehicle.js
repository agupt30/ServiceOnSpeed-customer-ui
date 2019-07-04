import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Icon from '../components/CustomIcon'; // Version can be specified in package.json
import DateTimePicker from 'react-native-modal-datetime-picker';
import axios from 'axios';


class SelectVehicle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        text:"",
        showLoader: true,
        List1: [],
        textValue:'',
        isDateTimePickerVisible: false,
        // initialSearchList =
    };
  }
   _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
 
  _handleDatePicked = (date) => {
   this.props.dateSelectedAction(date);
    this._hideDateTimePicker();
    this.props.navigation.navigate('ServiceBookScreen',{customerToken : ""});
  };

  static navigationOptions = ({ navigation }) => ({
    headerTintColor: '#fff',
    headerTitle: (
      <View style={{ justifyContent: 'center',width:"100%"}}>
        <Text
          style={{
            marginLeft:35,
            fontSize:15,
            color: '#ffffff',
            textAlign: 'left',
            fontWeight: 'bold',
          }}>
          Select your Vehicle  
        </Text>
      </View>
    ),
    headerStyle: {
      backgroundColor: '#015b63',
    },
  });

  filteredDataForVehicles=(text)=>{
    this.setState({
      text
    }, () => {
      let textData = this.state.text
      if(!textData){
        textData = "a"
      }
    const URL = "https://dev.driveza.space/v1/vehicles/suggestions?key=" + textData;
    axios.get(URL)
    .then(response => {
      let places = response.data.list;
        this.setState({
          List1 : places,
        }); 
    })
    .catch(error => {
      alert(JSON.stringify(error.status));
    })
    })
    
  }

  onPressVehicle =(index)=>{
    this.props.vehicleTypeSelectedAction(index);
    this._showDateTimePicker();
  }
  componentWillMount(){
    this.getVehicleList();
  }

  // Function to get the List of Vehicles
  getVehicleList = () => {
    const URL = "https://dev.driveza.space/v1/vehicles/suggestions?key=a";
    axios.get(URL)
    .then(response => {
      let places = response.data.list;
        this.setState({
          List1 : places
        }, () => {
          this.setState({
            showLoader:false
          })
        }); 
    })
    .catch(error => {
      alert(JSON.stringify(error.status));
    })
  }


  render() {
    if(!this.state.showLoader){
      return (
        <React.Fragment>
            <View style={styles.inputWrapper}>
            <Icon style={styles.inputIcon} name="search" color="#dcdcdc" size={22}/>
            <TextInput
                style={styles.input}
                value={this.state.text}
                placeholder="Select Your vehicle"
                onChangeText={(text)=>this.filteredDataForVehicles(text)}
               underlineColorAndroid="transparent"
              />
             </View>
            <ScrollView style={{backgroundColor:'#efefef'}}>
              {this.state.List1.map((data,index) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#ffffff',
                      marginBottom: 2,
                      paddingLeft:10,
                      //paddingBottom:10,
                      paddingTop:10
                    }} onPress={() => this.onPressVehicle(data)} key={index}>
                    <View>{data.Type==="T"?<Icon style={styles.inputIcon} name="bike" color="#000000" size={15}/>:<Icon style={styles.inputIcon} name="car" color="#000000" size={15}/>}</View>
                    <View style={{marginTop:12}}><Text style={{fontSize:15}}>{data.name}
                    </Text></View>
                  </TouchableOpacity>
                  
                );
              })}
              <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode="datetime"
          />
            </ScrollView>
            
        </React.Fragment>
      );
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#015b63" />
        </View>
        )
    }
  }
}
const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingLeft: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 15,
    paddingLeft: 5,
    paddingBottom: 10,
    backgroundColor: '#fff',
    color: '#dcdcdc',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 5,
  },
});


export default SelectVehicle;