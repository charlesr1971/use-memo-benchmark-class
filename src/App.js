import React, { Component } from 'react';
import PageHeader from "./components/PageHeader";

import "./App.css";

class App extends Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
    }
    render() {
      return (
        <PageHeader />
      );
    }
}

export default App;