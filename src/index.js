import React from 'react';
import { render } from 'react-dom';
import MyForm from './myForm';
import './style.css';

function App() {
    return <MyForm/>;
}

render(<App/>, document.getElementById('root'));
