import React from 'react';

const Navigation=({onRouteChange,isSignedIn})=>{
        if(isSignedIn){
            return(
            <nav style={{display:'flex',justifyContent:'flex-end'}}>
            <p onClick={onRouteChange.bind(this,'signout')} className="f3 link dim pa3 black underline pointer">Sign Out</p>
            </nav>);
        }else{
            return(
            <nav style={{display:'flex',justifyContent:'flex-end'}}>
            <p onClick={onRouteChange.bind(this,'Signin')} className="f3 link dim pa3 black underline pointer">Sign In</p>
            <p onClick={onRouteChange.bind(this,'Register')} className="f3 link dim pa3 black underline pointer">Register</p>
            </nav>
            );
        }
        

}
export default Navigation;