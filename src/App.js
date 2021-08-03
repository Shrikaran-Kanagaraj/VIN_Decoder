
import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import SignIn from "./components/signin.component";
import SignUp from "./components/signup.component";
import {connect} from 'react-redux';


import VinDecoder from './components/vin.decoder';
// import VinHistory from './components/vin.history';
import Header from './components/header';
import { auth,createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';


class App extends React.Component {

  unSubscribeFromAuth=null;

  componentDidMount(){
    const {setCurrentUser}=this.props;

    this.unSubscribeFromAuth=auth.onAuthStateChanged(async userAuth=>{
      if(userAuth){
        const userRef=await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapshot=>{
          setCurrentUser({
            id:snapshot.id,
            ...snapshot.data()
          });
        });
      }
      setCurrentUser(userAuth);
    });
  }

  componentWillUnmount(){
    this.unSubscribeFromAuth();
  }

  
render(){  
  const {currentUser}=this.props;
  
  return (
    <Router>
      <div className="App">

      <Header/>
      
          <Switch>
           
           
            <Route exact path='/' render={()=> currentUser ? (<Redirect to='/vin-decoder'/>):(<SignIn/>)  } />
            <Route path="/sign-in" render={()=> currentUser ? (<Redirect to='/vin-decoder'/>):(<SignIn/>)  } />
            <Route path="/sign-up" render={()=> currentUser ? (<Redirect to='/vin-decoder'/>):(<SignUp/>)  } />
            <Route path="/vin-decoder" render={()=> currentUser ? (<VinDecoder/>):(<SignIn/>)  }  />  
            
          </Switch>
      </div>


    </Router>
    
    //<SignForm/>
    //<VinDecoder/>
  );}


}

const mapStateToProps=state=>({
  currentUser:state.user.currentUser  
});

const mapDispatchToProps=dispatch=>({
  setCurrentUser:user=>dispatch(setCurrentUser(user))
})



export default connect(mapStateToProps,mapDispatchToProps)(App);
