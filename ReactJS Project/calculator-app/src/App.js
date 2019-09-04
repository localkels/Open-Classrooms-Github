//  NEXT UP: working on the calculating part
// Get the VERY BASICS working first, then clean up later

import React from 'react';
import ReactDOM from 'react-dom';

// import Button from './Button';


function NewButton(props) {
    return <li><button value={props.value} onClick={props.onClick}>{props.value}</button></li>
}


class ButtonList extends React.Component {
  constructor() {
    super();
    this.state = {
      buttonSymbols: ["+","–","x","÷","1","2","3","4","5","6","7","8","9","0"],

    }
  }

    render(){
      const buttons = this.state.buttonSymbols.map((buttonSymbol) =>
          <NewButton key={buttonSymbol} value={buttonSymbol} onClick={this.props.callback}/>
        );

      return (
            <ul>{buttons}</ul>
          );
    }

}

class App extends React.Component {
  // constructor() {
  //   super();
  //   // this.calculate = this.calculate.bind(this);
  // }

  calculate = (e) => {
    let clickedValue = e.target.value;
    let onscreenValue;
    console.log(clickedValue);


    // if it's a number (check data type) - concatenate it to onscreenValue.
    // if it's a string - check if it's plus, minus, etc.
  }

  render() {
    return (
      <div>
        <ButtonList callback={this.calculate}/>
      </div>
    )
  }
}

// class ButtonList extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//
//     }
//   }
//
//
//   render(){
//     return (
//       <div>Hi</div>
//     )
//   }
// }

export default App;
