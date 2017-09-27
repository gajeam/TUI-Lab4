import React from 'react'
import Script from 'react-load-script'
import _ from 'lodash'
import { generateBeat, generateBeatWithSynth } from '../lib/beat-generator'
const  scale = require('music-scale')

const scriptList = [
  'https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js',
  'https://surikov.github.io/webaudiofontdata/sound/12836_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12840_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12841_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12842_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12846_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12848_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12851_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/0390_Aspirin_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/0480_Chaos_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/0550_Chaos_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/0090_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/0750_Chaos_sf2_file.js',
];

const noteToNumber = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

export default class WebAudioFont extends React.Component {

  constructor(props) {
    super(props);
    this.scriptLatch = scriptList.length;
    this.bgmNoteIndex = 0;
    this.bgm = [];
    this.scaleNotes = [];
  }

  handleScriptLoad() {
    if(this.scriptLatch - 1 > 0) {
      this.scriptLatch -= 1;
    } else {
      if(window) {
        const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextFunc();
        this.player = new WebAudioFontPlayer();
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0750_Chaos_sf2_file');

        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_36_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_40_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_42_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0390_Aspirin_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0480_Chaos_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_46_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_48_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_51_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0550_Chaos_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0090_JCLive_sf2_file');

        if (this.props.onSoundFontsLoaded) {
          this.props.onSoundFontsLoaded();
        }

        // Generate blackground music
        console.log(scale);
        const sc = scale('pentatonic', 'C')
        this.bgm = _.map(sc, n => (12 * 3 + noteToNumber[n]));
        
        for(var i = 3; i < 7; i++) {
          this.scaleNotes = _.concat(this.scaleNotes, _.map(sc, n => (12 * i + noteToNumber[n])))
        }
        
        console.log(this.bgm);
        setTimeout(() => {
          setInterval(() => {
            this.playBgmNote(this.bgm[Math.floor(Math.random() * this.bgm.length)], Math.random() * 0.5 + 0.5)
            if(this.bgmNoteIndex + 1 < 8) {
              this.bgmNoteIndex += 1
            } else {
              this.bgmNoteIndex = 0;
            }
            if(this.bgmNoteIndex === 0) {
              this.playBassDrum(1.0);
            } else if (this.bgmNoteIndex === 4){
              this.playRide(1.0);
            }
          }, 500);
        }, 2000)
        
        
      }
    }
  }

  mapNote(n) {
    return this.scaleNotes[n % this.scaleNotes.length]
  }

  playPipeNote(pitch, volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _tone_0750_Chaos_sf2_file, 0, this.mapNote(pitch), 0.75, vol);
    // this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _tone_0090_JCLive_sf2_file, 0, pitch, 0.75, vol);
  }

  playPianoNote(pitch, volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _tone_0090_JCLive_sf2_file, 0, this.mapNote(pitch), 0.75, vol);
  }

  playBgmNote(pitch, volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _tone_0090_JCLive_sf2_file, 0, pitch, 4, vol);
  }

  playSnare(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_40_6_JCLive_sf2_file, 0, 35, 3, vol);
  }

  playHihat(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_46_6_JCLive_sf2_file, 0, 35, 3, vol);
  }

  playBassDrum(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_36_6_JCLive_sf2_file, 0, 36, 10, vol);
  }

  playTom(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_48_6_JCLive_sf2_file, 0, 35, 3, vol);
  }

  playRide(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_51_6_JCLive_sf2_file, 0, 51, 10, vol);
  }

  playDrumsWithLabel(label, volume) {
    if(label === 'snare') this.playSnare(volume);
    else if(label === 'tom') this.playTom(volume);
    else if(label === 'hihat') this.playHihat(volume);
    else if(label === 'ride') this.playRide(volume);
    else if(label === 'bassdrum') this.playBassDrum(volume);
  }


  render() {
    return (
      <div>
        {_.map(scriptList, scr => (
          <Script url={scr} onLoad={this.handleScriptLoad.bind(this)} key={scr}/>
        ))}
      </div>
      );
  }

}