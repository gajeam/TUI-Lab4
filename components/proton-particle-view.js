import React from 'react'
import _ from 'lodash'

const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
var lastFactor = 0; // OOOoohh what a dirty hack!

export default class ProtonParticleView extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(window) {
      console.log('initParticle');
      this.Proton = require('proton-js')
      this.initParticle();
    }
  }

  initParticle() {
    this.canvas = document.getElementById("testCanvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');
    this.bgIntensity = 0.02;
    this.createProton();
    this.createRenderer();

    this.tick();
    window.onresize = function(e) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      crossZoneBehaviour.reset(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'cross');
    }
  }

  createProton() {
    this.proton = new this.Proton;
    this.emitter = new this.Proton.Emitter();
    this.emitter.damping = 0.008;
    this.emitter.rate = new this.Proton.Rate(0, .1);
    this.emitter.addInitialize(new this.Proton.Mass(1));
    this.emitter.addInitialize(new this.Proton.Radius(4));
    this.emitter.addInitialize(new this.Proton.Velocity(new this.Proton.Span(1.5), new this.Proton.Span(0, 360), 'polar'));

    this.mouseObj = {
      x : 1003 / 2,
      y : 610 / 2
    };
    this.attractionBehaviour = new this.Proton.Attraction(this.mouseObj, 0, 0);
    this.crossZoneBehaviour = new this.Proton.CrossZone(new this.Proton.RectZone(0, 0, this.canvas.width, this.canvas.height), 'dead');
    this.emitter.addBehaviour(new this.Proton.Color('#0000ff', '#ff0000'));
    this.emitter.addBehaviour(this.attractionBehaviour, this.crossZoneBehaviour);
    this.emitter.addBehaviour(new this.Proton.RandomDrift(10, 10, .05));
    this.emitter.addBehaviour(new this.Proton.Gravity(.5));
    this.emitter.p.x = this.canvas.width / 2;
    this.emitter.p.y = 0;
    // this.emitter.emitTime = 10;
    // this.emitter.life = 20;
    this.emitter.emit();
    this.proton.addEmitter(this.emitter);
  }

  createRenderer() {
    this.renderer = new this.Proton.Renderer('other', this.proton);
    this.renderer.onProtonUpdate = () => {
      // this.context.fillStyle = `rgba(0, 0, 0, 0.02)`;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    this.renderer.onParticleUpdate = (particle) => {
      this.context.beginPath();
      const c = hexToRgb(particle.color);
      this.context.strokeStyle = particle.color
      this.context.lineWidth = 3;
      this.context.moveTo(particle.old.p.x, particle.old.p.y);
      this.context.lineTo(particle.p.x, particle.p.y);
      this.context.closePath();
      this.context.stroke();
    };

    this.renderer.start();
  }

  updateEmission(factor, pot) {
    if (factor == undefined || this.emitter == undefined) {
      return;
    }
    else if (Math.abs(lastFactor - factor) > 0 && factor == 0) {
      this.proton.emitters[0].rate = new this.Proton.Rate(0, 1);
    } else if (Math.abs(lastFactor - factor) > 30) {
        this.proton.emitters[0].rate = new this.Proton.Rate(1, 100.0/(Math.sqrt(pot) * factor));
    } else {
      return;
    }
    lastFactor = factor;

    console.log("Pot: " + pot + " Force: " + factor);
  }



  updateBackgroundIntensity(factor) {
    this.bgIntensity = factor;
  }

  tick() {
    requestAnimationFrame(this.tick.bind(this));
    this.proton.update();
  }

  render() {
    return (
      <div>
        <canvas id="testCanvas" />
      </div>
    );
  }

}