import React, { Component } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase.utils";

class SignIn extends Component {
    constructor(props){
        super(props)
        this.state = {
            email : "",
            password : ""
        }
    }

    handleSubmit = async event=>{
        event.preventDefault();
        const {email,password} = this.state;
        try {
            await auth.signInWithEmailAndPassword(email,password);

            this.setState = {
                email : "",
                password : ""
            }

        } catch (error) {
            console.log(error.message);
            alert('Please ensure the credentials are correct and Try again');
            
        }
        

    }

    handleChange = (event)=>{
        // event.preventDefault();
        console.log();
        const { name, value } = event.target;
        this.setState({[name]:value});
    }


    render() {
        return (
            <div className="auth-wrapper">
        <div className="auth-inner">
      
            <form onSubmit={this.handleSubmit}>
                <h3>Sign In</h3>

                <div className="form-group">
                    <input type="email" onChange={this.handleChange} name="email" className="form-control" placeholder="Email ID" required />
                </div>

                <br/>

                <div className="form-group">
                    <input type="password" onChange={this.handleChange} name="password" className="form-control" placeholder="Password" required/>
                </div>
                <br/>
                

                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                <p className="sign-link text-right">
                    Don't have an Account ?  <Link className="navbar-brand" to={"/sign-up"}>Sign Up</Link>
                </p>
            </form>
            </div>
      </div>
            
        );
    }
}

export default SignIn;