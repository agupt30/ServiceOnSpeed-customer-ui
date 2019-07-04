import axios from 'axios'

const sendPushNotification = ({token,title,body,data}) => {
  axios({
      url: 'https://exp.host/--/api/v2/push/send',
      method:'post',
      headers:{
        "Accept":"application/json", 
        "Accept-Encoding":"gzip, deflate",
        "Content-Type":"application/json"
      },
      data:{
        "to":token,
        "title":title,
        "body": body,
        "data": data
      }
    }).then((res) => {
    }).catch((error) => {
    })
}

export default sendPushNotification;