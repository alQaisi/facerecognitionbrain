import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Signin from './components/SignIn/Signin';
import Register from './components/Register/Register';
import particlesOptions from "./particlesOptions";
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:[],
      route:'Signin',
      isSignedIn:false,
      user:{
          id: "",
          name: "",
          email:"",
          password: "",
          entries: 0,
      }
    }
  }
  loadUser=(data)=>{
    this.setState({user:{
      id:data._id,
      name:data.name,
      email:data.email,
      entries:data.facesNum,
    }});
  }
  calculateFaceLocation=(data)=>{
    const faces=[];
    const facesNumber=data.outputs[0].data.regions.length;
    for(let i=0;i<facesNumber;i++){
      const clarifaiFace=data.outputs[0].data.regions[i].region_info.bounding_box;
      const image=document.getElementById('inputimage');
      const width=Number(image.width);
      const height=Number(image.height);
      faces.push({
        leftCol:clarifaiFace.left_col * width,
        topRow:clarifaiFace.top_row *height,
        rightCol:width-(clarifaiFace.right_col*width),
        bottomRow:height-(clarifaiFace.bottom_row *height)
      })
    }
    return faces;
  }
  displayFaceBox=box=>{
    this.setState({box});    
  }
  onInputChange=(event)=>{
    this.setState({input:event.target.value})
  }
  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input});
    fetch('https://floating-harbor-99449.herokuapp.com/imageurl',{
          method:'post',
          headers:{'Content-type':'application/json'},
          body: JSON.stringify({
          input:this.state.input
           })
          })
      .then(response=>response.json())
      .then(response=>{
        if(response){
            const faceLocation=this.calculateFaceLocation(response)
            this.displayFaceBox(faceLocation);
            fetch('https://floating-harbor-99449.herokuapp.com/image',{
                method:'put',
                headers:{'Content-type':'application/json'},
                body: JSON.stringify({
                id:this.state.user.id,
                facesNumber:faceLocation.length
                })
              })
            .then(response=>response.json())
            .then(count=>{
                this.setState(Object.assign(this.state.user,{entries:count}))
              }).catch(console.log);
          }
      })
      .catch(console.log);
  }
  onRouteChange=(data)=>{
    if(data === 'signout'){
      this.setState({
        isSignedIn:false,
        input:'',
        imageUrl:'',
        box:[],
      })
    }else if(data==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:data});
}
  render(){
    const {isSignedIn,imageUrl,route,box,user}=this.state;
    return (
      <div className="App">
        <Particles className="particles"
            params={particlesOptions}
              />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {this.state.route==='home'
        ?<div><Logo />
        <Rank name={user.name} entries={user.entries} />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        :(
          route==='Signin' || route==="signout"
          ?<Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          :<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />  
          )
        }      
      </div>
    );
  }
  
}

export default App;
