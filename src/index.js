import React, { Component } from 'react';
import { render } from 'react-dom';
import MyForm from './myForm';
import './style.css';

class App extends Component {

    render() {
        return (
            <div>
            <MyForm />
            </div>
    );
    }
}

render(<App />, document.getElementById('root'));
