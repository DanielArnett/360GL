import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/lab/Slider';
import './App.css'
import ProjectionComponent from './ProjectionComponent'
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ImageUploader from 'react-images-upload';
 
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
    cropTop: 1,
    cropBottom: 1,
    cropLeft: 1,
    cropRight: 1,
    xCenter: 1,
    inputProjection: 0,
    outputProjection: 0,
    gridLines: 0,
    pictures: [],
    sourceImage: "earth.jpg", 
    name: "",
    uploadedImage: "",
    test: 1,
    url: "",
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleUrlChange = event => {
    this.setState({ url: event.target.value });
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
  handleCropTopChange = (event, value) => {
    this.setState({ cropTop: value/50,
                    cropBottom: 2.0 - value/50 });
  }
  handleCropBottomChange = (event, value) => {
    this.setState({ cropBottom: value/50,
                    cropTop: 2.0 - value/50 });
  }
  handleCropLeftChange = (event, value) => {
    this.setState({ cropLeft: value/50, 
                    cropRight: 2.0 - value/50});
  }
  handleCropRightChange = (event, value) => {
    this.setState({ cropRight: value/50,
                    cropLeft: 2.0 - value/50 });
  }
  handleXCenterChange = (event, value) => {
    this.setState({ xCenter: value/50 });
  }
  handleTestChange = (event, value) => {
    this.setState({ test: value/50 });
  }
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.url);
    event.preventDefault();
  }
  constructor(props) {
      super(props);
        this.onDrop = this.onDrop.bind(this);
  }
  onDrop(picture) {
      this.setState({
          pictures: picture,
          uploadedImage: picture[picture.length-1].name,
          sourceImage: picture[picture.length-1].name,
          
      });
  }
  render() {
    const { pitch, roll, yaw, fovIn, fovOut, x, y, z, correction1, correction2, correction3, correction4, cropTop, cropBottom, cropLeft, cropRight, xCenter, inputProjection, outputProjection, gridLines, sourceImage, url, test } = this.state
    return (
      <div className='App-container'>
      <div className='App-slider'>
      <TextField
        id="outlined-name"
        label="URL"
        className={TextField}
        value={this.state.url}
        onChange={this.handleUrlChange}
        margin="normal"
        variant="outlined"
      />
        {/*<div className='App-Options'>
          <ImageUploader
              withIcon={true}
              buttonText='Choose image'
              onChange={this.onDrop}
              imgExtension={['.jpg', '.gif', '.png', '.gif']}
              maxFileSize={5242880}
              singleImage={true}
              withPreview={false}
          />
        </div>*/}
        <div className='App-Options'>
          <p>Source Image</p>
            <Select
              value={this.state.sourceImage}
              onChange={this.handleChange}
              inputProps={{
                name: 'sourceImage',
                id: 'sourceImage',
              }}
            >
              <MenuItem value={"earth.jpg"}>Earth</MenuItem>
              <MenuItem value={"sru.jpg"}>Rectilinear Photo</MenuItem>
              <MenuItem value={"radial.jpg"}>Fisheye Grid</MenuItem>
              <MenuItem value={"360planetarium.jpg"}>360 Photo</MenuItem>
              <MenuItem value={this.state.url}>URL</MenuItem>
            </Select>
        </div>
        
        <div className='App-Options'>
          <p>Input Projection</p>
          <Select
            value={this.state.inputProjection}
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
        </div>
        
        <div className='App-Options'>
          <p>Output Projection</p>
          <Select
            value={this.state.outputProjection}
            onChange={this.handleChange}
            inputProps={{
              name: 'outputProjection',
              id: 'outputProjection',
            }}
          >
            <MenuItem value={0}>Equirectangular</MenuItem>
            <MenuItem value={1}>Fisheye</MenuItem>
            <MenuItem value={2}>Rectilinear</MenuItem>
            {/*<MenuItem value={3}>Sphere</MenuItem>*/}
          </Select>
        
        </div>
        <div className='App-Options'>
          <p>Grid Lines</p>
          <Select
            value={this.state.gridLines}
            onChange={this.handleChange}
            inputProps={{
              name: 'gridLines',
              id: 'gridLines',
            }}
          >
            <MenuItem value={0}>Off</MenuItem>
            <MenuItem value={1}>On</MenuItem>
          </Select>
        </div>
        <div className='App-Options'>
            <p>Pitch: {((this.state.pitch - 1.0) * 180.0).toFixed(1)} degrees</p>
            <Slider
              value={pitch*50}
              onChange={this.handlePitchChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Roll: {((this.state.roll - 1.0) * 180.0).toFixed(1)} degrees</p>
            <Slider
              value={roll*50}
              onChange={this.handleRollChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Yaw: {((this.state.yaw - 1.0) * 180.0).toFixed(1)} degrees</p>
            <Slider
              value={yaw*50}
              onChange={this.handleYawChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Field of View In: {(180.0*this.state.fovIn).toFixed(1)} degrees</p>
            <Slider
              value={fovIn*50}
              onChange={this.handleFovInChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Field of View Out: {(this.state.fovOut).toFixed(2)}</p>
            <Slider
              value={fovOut*50}
              onChange={this.handleFovOutChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>X: {((this.state.x-1.0)*5.0).toFixed(1)} meters</p>
            <Slider
              value={x*50}
              onChange={this.handleXChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Y: {((this.state.y-1.0)*5.0).toFixed(1)} meters</p>
            <Slider
              value={y*50}
              onChange={this.handleYChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Z: {((this.state.z-1.0)*5.0).toFixed(1)} meters</p>
            <Slider
              value={z*50}
              onChange={this.handleZChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Crop Top: {((this.state.cropTop-1.0)*1400.0/4.0).toFixed(0)} pixels</p>
            <Slider
              value={cropTop*50}
              onChange={this.handleCropTopChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Crop Bottom: {((this.state.cropBottom-1.0)*1400.0/4.0).toFixed(0)} pixels</p>
            <Slider
              value={cropBottom*50}
              onChange={this.handleCropBottomChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Crop Left  {((this.state.cropLeft-1.0)*1400.0/4.0).toFixed(0)} pixels</p>
            <Slider
              value={cropLeft*50}
              onChange={this.handleCropLeftChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Crop Right {((this.state.cropRight-1.0)*1400.0/4.0).toFixed(0)} pixels</p>
            <Slider
              value={cropRight*50}
              onChange={this.handleCropRightChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>X Center : {((this.state.xCenter-1.0)*1400.0/2.0).toFixed(0)} pixels</p>
            <Slider
              value={xCenter*50}
              onChange={this.handleXCenterChange}
            />
        </div>
        
        <div className='App-Options'>
            <p>Fisheye Correction 1: {(this.state.correction1 - 0.5).toFixed(4)} r</p>
            <Slider
              value={correction1*50}
              onChange={this.handleCorrection1Change}
            />
        </div>
        
        <div className='App-Options'>
            <p>Fisheye Correction 2: {(this.state.correction2 - 1).toFixed(4)} r^2</p>
            <Slider
              value={correction2*50}
              onChange={this.handleCorrection2Change}
            />
        </div>
        
        <div className='App-Options'>
            <p>Fisheye Correction 3: {(this.state.correction3 - 1).toFixed(4)} r^3</p>
            <Slider
              value={correction3*50}
              onChange={this.handleCorrection3Change}
            />
        </div>
        
        <div className='App-Options'>
            <p>Fisheye Correction 4: {(this.state.correction4 - 1).toFixed(4)} r^4</p>
            <Slider
              value={correction4*50}
              onChange={this.handleCorrection4Change}
            />
        </div>
        {/*<div className='App-Options'>
            <p>Test: {this.state.test}</p>
            <Slider
              value={test*50}
              onChange={this.handleTestChange}
            />
        </div>*/}
        </div>
        <div className='App-Projection'>
          <ProjectionComponent pitch={pitch} roll={roll} yaw={yaw} fovIn={fovIn} fovOut={fovOut} x={x} y={y} z={z} xCenter={xCenter} correction1={correction1} correction2={correction2} correction3={correction3} correction4={correction4} cropTop={cropTop} cropBottom={cropBottom} cropLeft={cropLeft} cropRight={cropRight}  inputProjection={inputProjection} outputProjection={outputProjection} gridLines={gridLines} sourceImage={sourceImage} test={test}/>
        </div>
      </div>
    );
  }
}

export default App;
