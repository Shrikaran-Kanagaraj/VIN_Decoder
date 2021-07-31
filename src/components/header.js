import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase.utils";
import {connect} from 'react-redux';

function Header(props) {

    const {currentUser}=props;
    console.log(currentUser);

    return (
        <div>
        {
            currentUser
            ?
            
            <nav className="navbar navbar-expand-lg navbar-light ">
                <div className="container">
                    <Link className="navbar-brand" to={"/"}>VIN DECODER</Link>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item-active">
                                <Link className="nav-link" to={"#"}>Hi {props.currentUser.username}</Link>                                
        </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/"}><div onClick={()=>auth.signOut()}>Sign Out</div></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            
            :
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container">
                    <Link className="navbar-brand" to={"/"}>VIN DECODER</Link>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to={"/sign-in"}>Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>     
            


        }
</div>
    )   
}

const mapStateToProps=state=>({
    currentUser:state.user.currentUser
})

export default connect(mapStateToProps)(Header);
