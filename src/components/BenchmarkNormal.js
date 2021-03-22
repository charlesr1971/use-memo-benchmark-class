import React, { Component } from 'react';

class BenchmarkNormal extends Component {

    constructor(props) {

      super(props);

      this.complexObject = {};
      
      this.numbers = this.numbers.bind(this);
      this.randomIntInc = this.randomIntInc.bind(this);

    }

    componentDidMount() {
    }

    numbers = () => {
        const result = [1, 1];
        for (let i = 2; i < this.props.level; i++) {
            result[i] = result[i - 1] + result[i - 2];
        }
        return result;
    }

    randomIntInc(low, high){
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    render() {

        const id = 'span' + this.randomIntInc(1000000, 9999999);
        const fib = this.numbers().join(',');
        const text = parseInt(this.props.idx + 1) == this.props.timesToRender ? 'Benchmark normal test finished' : (parseInt(this.props.idx + 1) == 1 ? '' : '');

        return (
            <span id={id} data-fib={fib}>{text}</span>
        );

    }
}

export default BenchmarkNormal;