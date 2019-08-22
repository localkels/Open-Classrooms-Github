import React from 'react';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      buttonSymbols: [1,2,3,4,5,6,7,8,9,0,"+","–","X","÷"]

    }
  }

  render(){
    let buttonSymbols = this.state.buttonSymbols;
    return (
      this.state.buttonSymbols.map((i) => {
        return <button id={buttonSymbols[i]} key={i}>{buttonSymbols[i]}</button>
      })

      // <button id={buttonSymbols[1]}>{buttonSymbols[1]}</button>
    )
  }
}

class ButtonBlock extends React.Component {
  constructor() {
    super();
    this.state = {

    }
  }


  render(){
    return (<div>Hi</div>)
  }
}

export default App;
