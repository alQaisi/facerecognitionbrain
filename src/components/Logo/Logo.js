import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import robot from './robot.png';
const Logo=()=>{
    return(
       <div className="ma4 logoCont">
           <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
               <div className="Tilt-inner pa3"><img style={{paddingTop:'5px'}} alt='logo' src={robot} /></div>
            </Tilt>
       </div> 
    );
}
export default Logo;