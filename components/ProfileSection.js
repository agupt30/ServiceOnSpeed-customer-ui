import React from 'react';
import {ScrollView,View,Text,StyleSheet,TouchableOpacity,AsyncStorage} from 'react-native';
import { connect } from 'react-redux';
import { loginCheckAction } from '../actions/index';
import { resetSelection } from '../actions/index';

 class ProfileSection extends React.Component {
    constructor(props){
        super(props);
        this.state={
            customerName: null,
            customerPhone: null,
            customerEmail: null,
            customerNameInitial: null,
        }
    }
    static navigationOptions = ({ navigation }) => ({
      headerTitle: "My Profile",
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#015b63',
      }
    });
    componentWillMount(){
      this.getCustomerDetails();
    }
    getCustomerDetails = () => {
      AsyncStorage.getItem("customerName").then(value => {
        if(value)
        this.setState({
          customerNameInitial : value.substring(0, 2).toUpperCase(),
          customerName : value
        })
      
      })
      AsyncStorage.getItem("customerPhone").then(value => {
        if(value)
        this.setState({
          customerPhone : value
        })
      })
      AsyncStorage.getItem("customerEmail").then(value => {
        if(value)
        this.setState({
          customerEmail : value
        })
      })
    }
    onLogout=()=>{
      AsyncStorage.clear();
      this.props.loginCheckAction(false);
      this.props.resetSelection();
      this.props.navigation.navigate('WelcomePageScreen')
    }
    render(){
      return(
          <ScrollView style={{height:"100%"}}>
               <View style={{height:"35%",width:"100%",backgroundColor:"#015b63",alignItems:"center",justifyContent:"center"}}>
                    <View style={{alignItems:"center",justifyContent:"center",width:70,height:70,backgroundColor:"#ffffff",marginBottom:20,borderRadius:     10}}>
                        <Text style={{fontSize: 36}}>{this.state.customerNameInitial}</Text>
                    </View>
               </View>
               <View style={{height:500}}>
               <View style={{height:50,width:"100%",alignItems:"center",justifyContent:"center"}}>
                  <Text style={{fontSize:22,fontWeight:"bold"}}>{this.state.customerName}</Text>
               </View>
                  <View style={{borderColor:"#dbdbdb",borderWidth:2,width:"100%",padding:10,borderRadius:5,flexDirection:"row",marginBottom:20}}>
                      <View style={{alignItems:"flex-start",width:"50%"}}><Text>Email</Text></View>
                      <View style={{width:"50%",alignItems:"center"}}><Text>{this.state.customerEmail}</Text></View>
                  </View> 
                  <View style={{borderColor:"#dbdbdb",borderWidth:2,width:"100%",padding:10,borderRadius:5,flexDirection:"row",marginBottom:50}}>
                      <View style={{alignItems:"flex-start",width:"50%"}}><Text>Phone</Text></View>
                      <View style={{width:"50%",alignItems:"center"}}><Text>{this.state.customerPhone}</Text></View>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress= {this.onLogout}>
                        <Text style={styles.textStyle}>Logout</Text>
                    </TouchableOpacity>
                </View>
                </View>
          </ScrollView>
     );
   }
 }
 const styles = StyleSheet.create({
  textStyle: {
    fontSize:20,
    color: '#ffffff',
    textAlign: 'center'
  },
  buttonStyle: {
    padding:10,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 20,
      marginTop: 20,
      marginRight: 20,
      width:200,
      backgroundColor: '#015b63',
    borderRadius:5
  }
});

const mapDispatchToProps= (dispatch) => ({
  loginCheckAction: (flag) => dispatch(loginCheckAction(flag)),
  resetSelection: () => dispatch(resetSelection())
})

export default connect(null,mapDispatchToProps)(ProfileSection);