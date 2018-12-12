import React, { Component } from 'react';
import Slider from '@material-ui/lab/Slider';
import './App.css'
import MapComponent from './MapComponent'

class App extends Component {
  state = {
    contrast: 1,
    saturation: 1,
    brightness: 1,
  }

  handleContrastChange = (event, value) => {
    this.setState({ contrast: value/50 });
  }

  handleSaturationChange = (event, value) => {
    this.setState({ saturation: value/50 });
  }

  handleBrightnessChange = (event, value) => {
    this.setState({ brightness: value/50 });
  }

  render() {
    const { contrast, saturation, brightness } = this.state
    return (
      <div className='App-container'>
        <div className='App-slider'>
          <p>Contrast</p>
          <Slider
            value={contrast*50}
            onChange={this.handleContrastChange}
          />
          <p>Saturation</p>
          <Slider
            value={saturation*50}
            onChange={this.handleSaturationChange}
          />
          <p>Brightness</p>
          <Slider
            value={brightness*50}
            onChange={this.handleBrightnessChange}
          />
        </div>
        <div className='App-map'>
          <MapComponent contrast={contrast} saturation={saturation} brightness={brightness}/>
        </div>
      </div>
    );
  }
}

export default App;
