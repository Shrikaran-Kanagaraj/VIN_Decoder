import React, { Component } from "react";
import { Link } from "react-router-dom";
import {auth,createUserProfileDocument} from '../firebase/firebase.utils';


class SignUp extends Component {
    constructor(props){
        super(props)
            this.state = {
                username : "",
                email : "",
                password : "",
                confirmPassword : ""
            }
    }


    handleSubmit=async event=>{
        event.preventDefault();
        const {username,email,password,confirmPassword} = this.state;
        if(password!==confirmPassword){
            alert(" Password doesn't match !")
        }
        try {

            const {setCurrentUser} = this.props;
            const {user}=await auth.createUserWithEmailAndPassword(email,password);
            await createUserProfileDocument(user,{username});

            setCurrentUser(user);
            
            this.setState = {
                username : "",
                email : "",
                password : "",
                confirmPassword : ""
            }
            
        } catch (error) {
            console.log(error.message);
            alert("It seems like you already have an account, please proceed to sign in.")
        }
    }

    handleChange=(event)=>{
        const { name,value } = event.target;

        this.setState({[name]:value});

    }


    render() {
        return (
            <div className="auth-wrapper">
        <div className="auth-inner">
      
            <form onSubmit={this.handleSubmit}>
                <h3>Sign Up</h3>

                <div className="form-group">
                    <input type="text" onChange={this.handleChange} name="username" className="form-control" placeholder="Name" required/>
                </div>

                <br/>

                <div className="form-group">
                     <input type="email" onChange={this.handleChange} name="email" className="form-control" placeholder="Email ID" required/>
                </div>

                <br/>

                <div className="form-group">
                    <input type="password" onChange={this.handleChange} name="password" className="form-control" placeholder="Password" required/>
                </div>

                <br/>

                <div className="form-group">
                    <input type="password" onChange={this.handleChange} name="confirmPassword" className="form-control" placeholder="Confirm Password" required/>
                </div>

                <br/>

                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                <p className="sign-link text-right">
                    Already registered  <Link className="navbar-brand" to={"/sign-in"}>Sign In</Link>
                </p>
            </form>
            </div>
            </div>
            
        );
    }
}

export default SignUp;