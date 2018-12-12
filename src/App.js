import React, { Component } from 'react';
import Slider from '@material-ui/lab/Slider';
import './App.css'

class App extends Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value });
  }

  render() {
    return (
      <div className='App-container'>
        <div className='App-slider'>
          <Slider
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
        <div className='App-map'>
          {this.state.value}
        </div>
      </div>
    );
  }
}

export default App;
