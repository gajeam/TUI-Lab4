import React from 'react'
import ReactDOM from 'react-dom'
import WebAudioFont from '../components/web-audio-font'
import ProtonParticleView from '../components/proton-particle-view'
import globalCss from '../css/global.css.js'

export default class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isFrontEnd: false,
      analogInput: 0
    }
  }

  componentDidMount() {
    this.setState({ isFrontEnd: true })
    this.overlay = document.getElementById("overlay");
  }

  renderWS() {
    if(this.state.isFrontEnd) {
      const Websocket = require('react-websocket');
      return (<Websocket url='ws://localhost:8080/' onMessage={this.handleData.bind(this)}/>);
    }
  }

  handleData(data) {
    let result = JSON.parse(data);
    if(result.event ==='sensor') {
      if(this.webAudioFont && result.phr) {
        this.webAudioFont.playPipeNote(Math.floor(result.phr * 48 / 1024.0), 0.1) 
        if(this.overlay) {
          const intensity = result.phr * 0.2 / 1024.0
          // this.overlay.setAttribute('style', `background-color: rgba(255,0,0,${intensity})`)
        }
      }
      if(this.webAudioFont && result.fsr) {
        if(result.fsr > 300) {
          this.webAudioFont.playPianoNote(Math.floor(result.fsr * 48 / 1024.0), 0.5) 
        }
      }
    }

    if(this.protonParticleViewRef) {
      this.protonParticleViewRef.updateAttraction(result.fsr / 1024.0);
    }

  }

  render() {
    const { analogInput, isFrontEnd } = this.state;
    const fullscreenStyle = { position: 'absolute', left: 0, top: 0 };
    return (
      <div>
        <style jsx global>{globalCss}</style>
        <div style={fullscreenStyle}>
          {isFrontEnd &&
            <ProtonParticleView ref={(ref) => {this.protonParticleViewRef = ref}}/>
          }
        </div>
        <div style={{...fullscreenStyle, padding: '40px'}}>
          <h1>Sensing FSR and Photocell</h1>
        </div>
        <div style={{...fullscreenStyle, width: '100vw', height: '100vh' }} id="overlay">
        </div>
        {this.renderWS()}
        <WebAudioFont ref={(ref) => {this.webAudioFont = ref}}/>
      </div>
    );
  }

}