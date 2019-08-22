import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types'; // ES6

// Class Component - which has state
class App extends React.Component {
  constructor() {
    super();
    this.state = {items: []}

  }
  UNSAFE_componentWillMount() {
    fetch( 'https://swapi.co/api/people/?format=json' )
    .then( response => response.json() )
    .then( ({results: items}) => this.setState({items}) )

  }

  render () {
    let items = this.state.items;
    if (this.state.filter) {
      items = items.filter( item => )

    }
    return (
      <div>
        {items.map( item => <h4 key={item.name}>{item.name}</h4>)}
      </div>
    )
  }
  }

export default App;

// const Button = (props) => <button>{props.children}</button>
//
// class Heart extends React.Component {
//   render () {
//     return <span>&hearts;</span>
//
//   }
// }

// const Widget = (props) => <input type="text" onChange={props.update}/>

// App.defaultProps = {
//   txt: "this is the default text"
// }

// Stateless function component
// const App = () => {return <h1>Hoi Stateless!</h1>}
