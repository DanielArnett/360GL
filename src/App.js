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
    correction1: 0.5,
    correction2: 0.0, 
    correction3: 0.0,
    correction4: 0.0, 
    inputProjection: 1,
    outputProjection: 1,
    sourceImage: "radial.jpg", 
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
    this.setState({ correction1: value/100 });
  }
  handleCorrection2Change = (event, value) => {
    this.setState({ correction2: value/100 });
  }
  handleCorrection3Change = (event, value) => {
    this.setState({ correction3: value/100 });
  }
  handleCorrection4Change = (event, value) => {
    this.setState({ correction4: value/100 });
  }
  handleSliderChange = (event, value) => {
    this.setState({ [event.target.name]: event.target.value/50 });
  }

  render() {
    const { pitch, roll, yaw, fovIn, fovOut, correction1, correction2, correction3, correction4, inputProjection, outputProjection, sourceImage } = this.state
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
            <p>Fisheye Correction 1: {this.state.correction1}</p>
            <Slider
              value={correction1*100}
              onChange={this.handleCorrection1Change}
            />
            <p>Fisheye Correction 2: {this.state.correction2}</p>
            <Slider
              value={correction2*100}
              onChange={this.handleCorrection2Change}
            />
            <p>Fisheye Correction 3: {this.state.correction3}</p>
            <Slider
              value={correction3*100}
              onChange={this.handleCorrection3Change}
            />
            <p>Fisheye Correction 4: {this.state.correction4}</p>
            <Slider
              value={correction4*100}
              onChange={this.handleCorrection4Change}
            />
        </div>
        <div className='App-Projection'>
          <ProjectionComponent pitch={pitch} roll={roll} yaw={yaw} fovIn={fovIn} fovOut={fovOut} correction1={correction1} correction2={correction2} correction3={correction3} correction4={correction4}  inputProjection={inputProjection} outputProjection={outputProjection} sourceImage={sourceImage}/>
        </div>
      </div>
    );
  }
}

export default App;
