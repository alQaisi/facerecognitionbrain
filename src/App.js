import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Signin from './components/SignIn/Signin';
import Register from './components/Register/Register';
import './App.css';



const particlesOptions={
  "particles": {
    "number": {
      "value": 35,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.2,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 3,
        "opacity_min":1,
        "sync": true
      }
    },
    "size": {
      "value": 7,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 80,
        "size_min": 0.1,
        "sync": true
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 250,
      "color": "#ffffff",
      "opacity": .5,
      "width": 2
    },
    "move": {
      "enable": true,
      "speed": 7,
      "direction": "top-right",
      "random": false,
      "straight": false,
      "out_mode": "bounce",
      "bounce": false,
      "attract": {
        "enable": true,
        "rotateX": 1600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 800,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 800,
        "size": 80,
        "duration": 2,
        "opacity": 0.8,
        "speed": 3
      },
      "repulse": {
        "distance": 400,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}
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
          joined: ""
      }
    }
  }
  loadUser=(data)=>{
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined
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
                facesNum:faceLocation.length
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
