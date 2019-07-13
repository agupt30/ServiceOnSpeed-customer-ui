import React, { Component } from 'react';
import {View,Text,TouchableOpacity, StyleSheet} from 'react-native';
import Icon from '../components/CustomIcon';
export default BookingDetails = (props) => (
    <React.Fragment>
    <View style={{marginTop: 20,paddingLeft:10}}>
    <Text style={{fontSize:17, fontWeight:"bold"}}>Booking Id : {props.currentBookingData.bookingId}</Text>
    <View style = {{flexDirection : "row"}}>
        <Text style={{fontSize:17, fontWeight:"bold"}}> Booking Status : </Text>
        <Text style={{color:props.currentBookingData.bookingStatus === 7? 'green' : 'red'}}>
        {props.currentBookingData.bookingStatus === 7 ? 'COMPLETED' : 'CANCELLED '}
        </Text>
    </View>
    </View>
    <View style={{borderBottomWidth:2,borderColor:"#dcdcdc",marginTop:15}}></View>
    <View style={{backgroundColor:"#ffffff",width:"100%",marginTop:20}}>
                <View style={{flexDirection:"row",marginTop:10}}>
                      <View style={{width:"60%",flexDirection:"row",paddingLeft:10}}>
                          <Icon
                            size={15}
                            name="building-filled"
                            color="#000000"
                           />
                        <View style={{marginLeft:10}}><Text>{props.currentBookingData.shopName}</Text></View>        
                    </View> 
                </View>
                <View style={{flexDirection:"row",marginTop:20}}>
                    <View style={{width:"60%",flexDirection:"row",paddingLeft:10}}>
                        <Icon
                            size={15}
                            name="location"
                            color="#000000"
                        />
                        <View style={{marginLeft:10}}><Text>{props.currentBookingData.address}</Text></View>   
                    </View> 
                </View>
                <View style={{flexDirection:"row",marginTop:20,marginBottom:10}}>
                    <View style={{width:"60%",flexDirection:"row",paddingLeft:10}}>
                        <Icon
                            size={15}
                            name="car"
                            color="#000000"
                        />
                        <View style={{marginLeft:10}}><Text>{props.currentBookingData.vehicle}</Text></View>        
                    </View>
                </View>
            </View>
{props.currentBookingData.bookingStatus === 7 ? <View>
    <View style={{borderBottomWidth:2,borderColor:"#dcdcdc",marginTop:5}}></View>
    <View style={{marginTop: 20,paddingLeft:10}}><Text style={{fontSize:17,fontWeight:"bold"}}>BILL DETAILS</Text></View>
    <View style={{padding:10,flexDirection:"row"}}>
    <View style={{alignItems:"flex-start",width:"50%"}}><Text>Services Amount</Text></View>
    <View style={{alignItems:"center",width:"50%",flexDirection:"row"}}>
    <Icon
                                size={12}
                                name="rupee"
                                color="#000000"
                            />
        <Text> {props.currentBookingData.total}</Text>
    </View>
    </View>
    <View style={{padding:10,flexDirection:"row"}}>
    <View style={{alignItems:"flex-start",width:"50%"}}><Text>Pickup Amount</Text></View>
    <View style={{alignItems:"center",width:"50%",flexDirection:"row"}}>
    <Icon
                                size={12}
                                name="rupee"
                                color="#000000"
                            />
        <Text>Rs </Text>
    </View>
    </View>
    <View style={{padding:10,flexDirection:"row"}}>
    <View style={{alignItems:"flex-start",width:"50%"}}><Text style={{fontWeight:"bold"}}>Total Amount</Text></View>
    <View style={{alignItems:"center",width:"50%",flexDirection:"row"}}>
    <Icon
                                size={12}
                                name="rupee"
                                color="#000000"
                            />
        <Text> {props.currentBookingData.total}</Text>
    </View>
    </View>
    <View style={{borderBottomWidth:2,borderColor:"#dcdcdc",marginTop:5}}></View>
    <View style={{marginTop: 20,paddingLeft:10}}><Text style={{fontSize:17,fontWeight:"bold"}}>PAYMENTS</Text></View>
    <View style={{padding:10,flexDirection:"row"}}>
    <View style={{alignItems:"flex-start",width:"50%"}}><Text style={{fontWeight:"bold"}}>Payment By</Text></View>
    <View style={{alignItems:"center",width:"50%"}}>
        <Text style={{fontWeight:"bold"}}>PAID</Text>
    </View>
    </View>
 </View> : null
}
 <View style={{alignItems: 'center',marginBottom:20}}>
      <TouchableOpacity style={styles.buttonStyle} onPress={() => this.onSubmit()}>
          <Text style={styles.textStyle}>Send Invoice Through Mail</Text>
      </TouchableOpacity>
</View>
</React.Fragment>
)

const styles = StyleSheet.create({
    sortStyle:{
     justifyContent: 'center',
     marginTop: 20,
     marginLeft:10,
     width:100,
     height:35,
     borderColor:"#dbdbdb",
     flexDirection:"row",
     borderWidth : 1,
     backgroundColor: '#ffffff',
     },
     filterStyle:{
     padding:10,
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: 20,
     width:100,
     borderColor:"#dbdbdb",
     height:35,
     flexDirection:"row",
     marginRight:10,
     borderWidth : 1,
     backgroundColor: '#ffffff',
     },
    
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
         width:300,
         backgroundColor: '#015b63',
       borderRadius:5
     }
   });
   