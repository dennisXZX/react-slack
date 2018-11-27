import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

const config = {
  apiKey: "AIzaSyDlP_txSow1gRs7Nc_RsFNQP_tXJ-uXp6Y",
  authDomain: "react-slack-55d3d.firebaseapp.com",
  databaseURL: "https://react-slack-55d3d.firebaseio.com",
  projectId: "react-slack-55d3d",
  // get the storageBucket URL from Firebase Storage tab
  storageBucket: "react-slack-55d3d.appspot.com",
  messagingSenderId: "661616263825"
}

firebase.initializeApp(config)

export default firebase