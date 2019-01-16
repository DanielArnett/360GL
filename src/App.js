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
    x: 1,
    y: 1,
    z: 1,
    correction1: 1,
    correction2: 1, 
    correction3: 1,
    correction4: 1, 
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
  handleCorrection1Change = (event, value) => {
    this.setState({ correction1: value/50 });
  }
  handleCorrection2Change = (event, value) => {
    this.setState({ correction2: value/50 });
  }
  handleCorrection3Change = (event, value) => {
    this.setState({ correction3: value/50 });
  }
  handleCorrection4Change = (event, value) => {
    this.setState({ correction4: value/50 });
  }
  handleXChange = (event, value) => {
    this.setState({ x: value/50 });
  }
  handleYChange = (event, value) => {
    this.setState({ y: value/50 });
  }
  handleZChange = (event, value) => {
    this.setState({ z: value/50 });
  }
  handleSliderChange = (event, value) => {
    this.setState({ [event.target.name]: event.target.value/50 });
  }

  render() {
    const { pitch, roll, yaw, fovIn, fovOut, x, y, z, correction1, correction2, correction3, correction4, inputProjection, outputProjection, sourceImage } = this.state
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
            <p>X</p>
            <Slider
              value={x*50}
              onChange={this.handleXChange}
            />
            <p>Y</p>
            <Slider
              value={y*50}
              onChange={this.handleYChange}
            />
            <p>Z</p>
            <Slider
              value={z*50}
              onChange={this.handleZChange}
            />
            <p>Fisheye Correction 1: {this.state.correction1 - 0.5}</p>
            <Slider
              value={correction1*50}
              onChange={this.handleCorrection1Change}
            />
            <p>Fisheye Correction 2: {this.state.correction2 - 1}</p>
            <Slider
              value={correction2*50}
              onChange={this.handleCorrection2Change}
            />
            <p>Fisheye Correction 3: {this.state.correction3 - 1}</p>
            <Slider
              value={correction3*50}
              onChange={this.handleCorrection3Change}
            />
            <p>Fisheye Correction 4: {this.state.correction4 - 1}</p>
            <Slider
              value={correction4*50}
              onChange={this.handleCorrection4Change}
            />
        </div>
        <div className='App-Projection'>
          <ProjectionComponent pitch={pitch} roll={roll} yaw={yaw} fovIn={fovIn} fovOut={fovOut} x={x} y={y} z={z} correction1={correction1} correction2={correction2} correction3={correction3} correction4={correction4}  inputProjection={inputProjection} outputProjection={outputProjection} sourceImage={sourceImage}/>
        </div>
      </div>
    );
  }
}

export default App;
