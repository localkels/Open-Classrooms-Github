import React from 'react';
import ReactDOM from 'react-dom';

import Button from './Button';


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
  constructor() {
    super();
    // this.calculate = this.calculate.bind(this);
  }

  calculate = (e) => {
    console.log(e.target.value);
    //  NEXT UP: working on the calculating part
    // Get the VERY BASICS working first, then clean up later
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
