//import libraries
import React, { Component } from 'react';
import {Router, navigate} from '@reach/router';
import firebase from './Firebase';
//components
import Home from './Home';
import Welcome from './Welcome';
import Navigation from './Navigation';
import Login from './Login';
import Register from './Register';
import UploadImage from './UploadImages';


class App extends Component {
  
  constructor(){
    super();
    this.state = {
      user: null, 
      displayName: null, 
      userID:null
    }
  }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {
      if(FBUser) {
        this.setState({
          user: FBUser, 
          displayName: FBUser.displayName, 
          userID: FBUser.uid
        });
      }
    });
  }
  
  registerUser = userName => {
    firebase.auth().onAuthStateChanged(FBUser => {
      FBUser.updateProfile({
        displayName: userName
      }).then(() => {
        this.setState({
          user: FBUser, 
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });
        navigate('/');
      })
    })
  }

  logOutUser = e => {
    e.preventDefault();
    this.setState({
      user: null, 
      displayName: null, 
      userID:null 
    });
    firebase.auth().signOut().then(()=>{
      navigate('/');
    });
  }

  render() {
    return (
      <div>
        <Navigation user={this.state.user} logOutUser={this.logOutUser}/>
        {this.state.user && <Welcome logOutUser={this.logOutUser}/> } 
        {/* userName={this.state.displayName} */}
        <Router>
        <Home path="/" user={this.state.user}/>
        <Login path="/login" />
        <Register path="/register" registerUser={this.registerUser} />
        <UploadImage path="/uploadimages" user={this.state.user}/>
        </Router>
        
        
      </div>
        
    );
  }
}

export default App;
