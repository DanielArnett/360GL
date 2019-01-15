import React, { Component } from 'react';
import Slider from '@material-ui/lab/Slider';
import './App.css'
import ProjectionComponent from './ProjectionComponent'
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

class App extends Component {
  state = {
    pitch: 1,
    roll: 1,
    yaw: 1,
    fovIn: 1,
    fovOut: 1,
    inputProjection: 0,
    outputProjection: 0,
    sourceImage: "earth.jpg", 
    name: "",
  }
  handleProjectionChange = (event, value) => {
    this.setState({ inputProjection: value });
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handlePitchChange = (event, value) => {
    this.setState({ pitch: value/50 });
  }

  handleRollChange = (event, value) => {
    this.setState({ roll: value/50 });
  }

  handleYawChange = (event, value) => {
    this.setState({ yaw: value/50 });
  }
  handleFovInChange = (event, value) => {
    this.setState({ fovIn: value/50 });
  }

  handleFovOutChange = (event, value) => {
    this.setState({ fovOut: value/50 });
  }

  render() {
    const { pitch, roll, yaw, fovIn, fovOut, inputProjection, outputProjection, sourceImage } = this.state
    return (
      <div className='App-container'>
      <div className='App-slider'>
        <div className='Source-image-selecter'>
          <InputLabel htmlFor="sourceImage">Source Image</InputLabel>
              { <Select
                value={this.sourceImage}
                onChange={this.handleChange}
                inputProps={{
                  name: 'sourceImage',
                  id: 'sourceImage',
                }}
              >
                <MenuItem value={"earth.jpg"}>Earth</MenuItem>
                <MenuItem value={"earth_8k.jpg"}>Earth 8k</MenuItem>
                <MenuItem value={"radial.jpg"}>Fisheye Grid</MenuItem>
                <MenuItem value={"bourke_sphericalpano.jpg"}>360 Photo</MenuItem>
              </Select>
              }
        </div>
        <InputLabel shrink htmlFor="inputProjection">
            Input Projection
          </InputLabel>
            { <Select
              value={this.inputProjection}
              onChange={this.handleChange}
              inputProps={{
                name: 'inputProjection',
                id: 'inputProjection',
              }}
              displayEmpty
            >
              <MenuItem value={0}>Equirectangular</MenuItem>
              <MenuItem value={1}>Fisheye</MenuItem>
              <MenuItem value={2}>Rectilinear</MenuItem>
            </Select>
            }
            <InputLabel htmlFor="outputProjection">Output Projection</InputLabel>
            { <Select
              value={this.outputProjection}
              onChange={this.handleChange}
              inputProps={{
                name: 'outputProjection',
                id: 'outputProjection',
              }}
            >
              <MenuItem value={0}>Equirectangular</MenuItem>
              <MenuItem value={1}>Fisheye</MenuItem>
              <MenuItem value={2}>Rectilinear</MenuItem>
              <MenuItem value={3}>Sphere</MenuItem>
            </Select>
            }
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
            <p>Field of View In</p>
            <Slider
              value={fovIn*50}
              onChange={this.handleFovInChange}
            />
            <p>Field of View Out</p>
            <Slider
              value={fovOut*50}
              onChange={this.handleFovOutChange}
            />
        </div>
        <div className='App-Projection'>
          <ProjectionComponent pitch={pitch} roll={roll} yaw={yaw} fovIn={fovIn} fovOut={fovOut} inputProjection={inputProjection} outputProjection={outputProjection} sourceImage={sourceImage}/>
        </div>
      </div>
    );
  }
}

export default App;
