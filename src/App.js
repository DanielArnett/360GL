import React, { Component } from 'react';
import Slider from '@material-ui/lab/Slider';
import './App.css'
import ProjectionComponent from './ProjectionComponent'

class App extends Component {
  state = {
    pitch: 1,
    roll: 1,
    yaw: 1,
  }

  handlePitchChange = (event, value) => {
    this.setState({ pitch: value/50 });
  }

  handleRollChange = (event, value) => {
    this.setState({ roll: value/50 });
  }

  handleYawChange = (event, value) => {
    this.setState({ yaw: value/50 });
  }

  render() {
    const { pitch, roll, yaw } = this.state
    return (
      <div className='App-container'>
        <div className='App-slider'>
          <p>Pitch</p>
          <Slider
            value={pitch*50}
            onChange={this.handlePitchChange}
          />
          <p>Roll</p>
          <Slider
            value={roll*50}
            onChange={this.handleRollChange}
          />
          <p>Yaw</p>
          <Slider
            value={yaw*50}
            onChange={this.handleYawChange}
          />
        </div>
        <div className='App-Projection'>
          <ProjectionComponent pitch={pitch} roll={roll} yaw={yaw}/>
        </div>
      </div>
    );
  }
}

export default App;
