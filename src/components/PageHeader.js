import React, { Component, Profiler } from 'react';
import BenchmarkNormal from "./BenchmarkNormal";
import BenchmarkMemo from "./BenchmarkMemo";
import { Spinner, Layout, Header, Navigation, Drawer, Content, Card, CardText, CardTitle, CardActions, CardMenu, IconButton, Icon } from 'react-mdl';

class PageHeader extends Component {

    constructor(props) {

        super(props);

        this.state = {
            showBenchmarkNormal: false,
            showBenchmarkMemo: false,
            avgTimeNormal: 0,
            avgTimeMemo1: 0,
            avgTimeMemo2: 0,
            runAnimation: false,
            renderFinishedNormal: false,
            renderFinishedMemo: false,
            timesToRender: 1000,
            countMemo: 0,
            levels: 1
        };

        this.global_consoleDebug = false;
        this._avgTimeArrayNormal = [];
        this._avgTimeArrayMemo = [];

        this._renderProfilerNormal = this._renderProfilerNormal.bind(this);
        this.renderProfilerNormal = this.renderProfilerNormal.bind(this);
        this.calculateAvgTimeNormal = this.calculateAvgTimeNormal.bind(this);
        this.executeNormal = this.executeNormal.bind(this);
        this.calculationsNormalFinished = this.calculationsNormalFinished.bind(this);
        this._renderProfilerMemo = this._renderProfilerMemo.bind(this);
        this.renderProfilerMemo = this.renderProfilerMemo.bind(this);
        this.calculateAvgTimeMemo = this.calculateAvgTimeMemo.bind(this);
        this.executeMemo = this.executeMemo.bind(this);
        this.calculationsMemoFinished = this.calculationsMemoFinished.bind(this);
        this.calculationsFinished = this.calculationsFinished.bind(this);
        this.animate = this.animate.bind(this);
        this.resetPage = this.resetPage.bind(this);
        this.handleSelectChange1 = this.handleSelectChange1.bind(this);
        this.handleSelectChange2 = this.handleSelectChange2.bind(this);

    }

    componentDidUpdate(prevProps,prevState){

        const proceed1 = prevState.avgTimeNormal !== this.state.avgTimeNormal || prevState.avgTimeMemo1 !== this.state.avgTimeMemo1 || prevState.avgTimeMemo2 !== this.state.avgTimeMemo2 || prevState.renderFinishedNormal !== this.state.renderFinishedNormal || prevState.renderFinishedMemo !== this.state.renderFinishedMemo ? true : false;

        if(proceed1){

            const buttonCalculate = document.getElementById("buttonCalculate");
            const toggleNormal = document.getElementById("toggleNormal");
            const toggleMemo = document.getElementById("toggleMemo");
            const spanAvgTimeMemo1 = document.getElementById("spanAvgTimeMemo1");
            if(buttonCalculate && toggleNormal && toggleMemo && spanAvgTimeMemo1){
                if(this.state.renderFinishedNormal){
                    buttonCalculate.removeAttribute("disabled");
                    toggleNormal.setAttribute("disabled","disabled");
                    toggleMemo.setAttribute("disabled","disabled");
                    window.componentHandler.upgradeDom();
                    if(this.global_consoleDebug){
                        console.log("useEffect: this.state.renderFinishedNormal: this.state.countMemo: ",this.state.countMemo);
                    }
                }
                if(this.calculationsNormalFinished()){
                    buttonCalculate.setAttribute("disabled","disabled");
                    toggleNormal.setAttribute("disabled","disabled");
                    toggleMemo.removeAttribute("disabled");
                    window.componentHandler.upgradeDom();
                    if(this.global_consoleDebug){
                        console.log("useEffect: calculationsNormalFinished: this.state.countMemo: ",this.state.countMemo);
                    }
                }
                if(this.state.renderFinishedMemo){
                    this.setState({
                        countMemo: this.state.countMemo + 1
                    });
                    if(this.global_consoleDebug){
                        console.log("useEffect: calculationsNormalFinished: this.state.countMemo: ",this.state.countMemo);
                    }
                    buttonCalculate.removeAttribute("disabled");
                    toggleMemo.setAttribute("disabled","disabled");
                    window.componentHandler.upgradeDom();
                }
                if(this.calculationsMemoFinished()){
                    buttonCalculate.setAttribute("disabled","disabled");
                    if(this.state.countMemo === 1){
                        toggleMemo.removeAttribute("disabled");
                    }
                    if(this.global_consoleDebug){
                        console.log("useEffect: calculationsMemoFinished 1: this.state.countMemo: ",this.state.countMemo," this.state.showBenchmarkNormal: ",this.state.showBenchmarkNormal," this.state.showBenchmarkMemo: ",this.state.showBenchmarkMemo);
                    }
                    if(this.state.countMemo === 2){
                        toggleMemo.setAttribute("disabled","disabled");
                        buttonCalculate.removeAttribute("disabled");
                    }
                    window.componentHandler.upgradeDom();
                    
                }
                if(this.calculationsFinished()){
                    buttonCalculate.setAttribute("disabled","disabled");
                    window.componentHandler.upgradeDom();
                    if(this.global_consoleDebug){
                        console.log("useEffect: calculationsFinished: this.state.countMemo: ",this.state.countMemo);
                    }
                }
            }

        }

        const proceed2 = prevState.timesToRender !== this.state.timesToRender ? true : false;

        if(proceed2){
            if(this.state.timesToRender !== 10000){
                const loopamountSelect = document.getElementById("loopamountSelect");
                if(loopamountSelect){
                    loopamountSelect.setAttribute("disabled","disabled");
                }
                const levelamountSelect = document.getElementById("levelamountSelect");
                if(levelamountSelect){
                    levelamountSelect.setAttribute("disabled","disabled");
                }
            }
        }

    }

    componentDidMount() {
        const buttonCalculate = document.getElementById("buttonCalculate");
        const toggleMemo = document.getElementById("toggleMemo");
        if(buttonCalculate && toggleMemo){
            buttonCalculate.setAttribute("disabled","disabled");
            toggleMemo.setAttribute("disabled","disabled");
        }
    }

    // Choose how many times this component needs to be rendered
    // We will then calculate the average render time for all of these renders
    

    _renderProfilerNormal(){
        if(this.global_consoleDebug){
            console.log("_renderProfilerNormal: this.state.showBenchmarkNormal: ",this.state.showBenchmarkNormal);
        }
        return [...Array(this.state.timesToRender)].map((currentValue,index) => {
            return <Profiler id={`normal-${index}`} onRender={this.renderProfilerNormal('normal')} key={index}>
                <BenchmarkNormal level={this.state.levels} timesToRender={this.state.timesToRender} idx={index} />
            </Profiler>;
        })
    }
    
    // Callback for our normal profiler
    renderProfilerNormal(type){
        return (...args) => {
            // Keep our render time in an array
            // Later on, calculate the average time
            // store args[3] which is the render time ...
            this._avgTimeArrayNormal.push(args[3]); 
            let lastId1 = 'normal-' + parseInt(this.state.timesToRender - 1);
            lastId1 = lastId1.trim();
            let lastId2 = args[0].trim();
            if(lastId1 === lastId2){
                this.setState({
                    showBenchmarkNormal: false,
                    renderFinishedNormal: true
                });
                const notificationRightText = document.getElementById("notification-right-text");
                if(notificationRightText){
                    notificationRightText.innerText = "Benchmark normal test finished";
                }
            }
        };
    }

    calculateAvgTimeNormal(){
        let _avgTime = 0;
        console.log("calculateAvgTimeNormal: _avgTime: ",_avgTime);
        if(this.global_consoleDebug){
            console.log("this._avgTimeArrayNormal: ",this._avgTimeArrayNormal);
        }
        for(let i = 0; i < this._avgTimeArrayNormal.length; i++){
            _avgTime += this._avgTimeArrayNormal[i]; 
        }
        if(this.global_consoleDebug){
            console.log("_avgTime normal: ",_avgTime);
        }
        const _avgTimeArrayLength = parseInt(this._avgTimeArrayNormal.length);
        if(this.global_consoleDebug){
            console.log("_avgTimeArrayLength normal: ",_avgTimeArrayLength);
        }
        const avgTimeNumber = parseInt(_avgTime);
        let _avgTimeNormal = avgTimeNumber/_avgTimeArrayLength;
        if(this.global_consoleDebug){
            console.log("_avgTimeNormal normal: ",_avgTimeNormal);
        }
        if(isNaN(_avgTimeNormal)){
            _avgTimeNormal = 0;
        }
        if(this.state.avgTimeNormal === 0){
            this.setState({
                runAnimation: false,
                avgTimeNormal: _avgTimeNormal
            });
        }
        console.log("calculateAvgTimeNormal: _avgTimeNormal: ",_avgTimeNormal);
        this._avgTimeArrayNormal = [];
    };

    executeNormal(){
        this.setState({
            showBenchmarkMemo: false,
            showBenchmarkNormal: true
        });
        if(this.global_consoleDebug){
            console.log("executeNormal: this.state.showBenchmarkNormal: ",this.state.showBenchmarkNormal);
        }
    }

    calculationsNormalFinished(){
        const spanAvgTimeNormal = document.getElementById("spanAvgTimeNormal");
        let spanAvgTimeNormalDone = false;
        if(spanAvgTimeNormal){
            if(spanAvgTimeNormal.innerText !== "0"){
                spanAvgTimeNormalDone = true;
            }
        }
        if(this.global_consoleDebug){
            console.log("calculationsNormalFinished: ",spanAvgTimeNormalDone);
        }
        return spanAvgTimeNormalDone;
    }

    _renderProfilerMemo(){
        if(this.global_consoleDebug){
            console.log("_renderProfilerMemo: this.state.showBenchmarkMemo: ",this.state.showBenchmarkMemo);
        }
        return [...Array(this.state.timesToRender)].map((currentValue,index) => {
            return <Profiler id={`memo-${index}`} onRender={this.renderProfilerMemo('memo')} key={index}>
                <BenchmarkMemo level={this.state.levels} timesToRender={this.state.timesToRender} idx={index} />
            </Profiler>;
        })
    }

    // Callback for our memo profiler
    renderProfilerMemo(type){
        return (...args) => {
            // Keep our render time in an array
            // Later on, calculate the average time
            // store args[3] which is the render time ...
            this._avgTimeArrayMemo.push(args[3]);
            let lastId1 = 'memo-' + parseInt(this.state.timesToRender - 1);
            lastId1 = lastId1.trim();
            let lastId2 = args[0].trim();
            if(lastId1 === lastId2){
                this.setState({
                    showBenchmarkMemo: false,
                    renderFinishedMemo: true
                });
                const notificationRightText = document.getElementById("notification-right-text");
                if(notificationRightText){
                    notificationRightText.innerText = "Benchmark memo test finished";
                }
            }
        };
    };

    calculateAvgTimeMemo(){
        let _avgTime = 0;
        if(this.global_consoleDebug){
            console.log("this._avgTimeArrayMemo1: ",this._avgTimeArrayMemo);
        }
        for(let i = 0; i < this._avgTimeArrayMemo.length; i++){
            _avgTime += this._avgTimeArrayMemo[i]; 
        }
        if(this.global_consoleDebug){
            console.log("_avgTime memo: ",_avgTime);
        }
        const _avgTimeArrayLength = parseInt(this._avgTimeArrayMemo.length);
        if(this.global_consoleDebug){
            console.log("_avgTimeArrayLength memo: ",_avgTimeArrayLength);
        }
        const avgTimeNumber = parseInt(_avgTime);
        let _avgTimeMemo = avgTimeNumber/_avgTimeArrayLength;
        if(this.global_consoleDebug){
            console.log("_avgTimeMemo memo: ",_avgTimeMemo);
        }
        if(isNaN(_avgTimeMemo)){
            _avgTimeMemo = 0;
        }
        if(this.state.avgTimeMemo1 === 0 || this.state.avgTimeMemo2 === 0){
            this.setState({
                runAnimation: false
            });
            if(this.state.countMemo === 1){
                if(this.state.avgTimeMemo1 === 0){
                    this.setState({
                        avgTimeMemo1: _avgTimeMemo
                    });
                }
                if(this.global_consoleDebug){
                    console.log("_renderProfilerMemo: this.state.avgTimeMemo1: ",this.state.avgTimeMemo1);
                }
            }
            if(this.state.countMemo === 2){
                if(this.state.avgTimeMemo2 === 0){
                    this.setState({
                        avgTimeMemo2: _avgTimeMemo
                    });
                }
                if(this.global_consoleDebug){
                    console.log("_renderProfilerMemo: this.state.avgTimeMemo2: ",this.state.avgTimeMemo2);
                }
            }
        }
        this._avgTimeArrayMemo = [];
    };

    executeMemo(){
        this.setState({
            showBenchmarkNormal: false,
            showBenchmarkMemo: true
        });
        if(this.global_consoleDebug){
            console.log("executeMemo: this.state.showBenchmarkMemo: ",this.state.showBenchmarkMemo," this.state.countMemo: ",this.state.countMemo);
        }
        if(this.state.countMemo === 2){
            const toggleMemo = document.getElementById("toggleMemo");
            if(toggleMemo){
                toggleMemo.setAttribute("disabled","disabled");
            }
            const buttonCalculate = document.getElementById("buttonCalculate");
            if(buttonCalculate){
                buttonCalculate.removeAttribute("disabled");
            }
        }
    }

    calculationsMemoFinished(){
        const spanAvgTimeMemo = document.getElementById("spanAvgTimeMemo" + this.state.countMemo);
        let spanAvgTimeMemoDone = false;
        if(spanAvgTimeMemo){
            if(spanAvgTimeMemo.innerText !== "0"){
                spanAvgTimeMemoDone = true;
            }
        }
        if(this.global_consoleDebug){
            console.log("calculationsMemoFinished: this.state.countMemo: ",this.state.countMemo,' spanAvgTimeMemoDone: ',spanAvgTimeMemoDone);
        }
        return spanAvgTimeMemoDone;
    }

    calculationsFinished(){
        let result = false;
        const spanAvgTimeNormal = document.getElementById("spanAvgTimeNormal");
        const spanAvgTimeMemo1 = document.getElementById("spanAvgTimeMemo1");
        let spanAvgTimeNormalDone = false;
        let spanAvgTimeMemo1Done = false;
        if(spanAvgTimeNormal){
            if(spanAvgTimeNormal.innerText !== "0"){
                spanAvgTimeNormalDone = true;
            }
        }
        if(spanAvgTimeMemo1){
            if(spanAvgTimeMemo1.innerText !== "0"){
                spanAvgTimeMemo1Done = true;
            }
        }
        if(spanAvgTimeNormalDone && spanAvgTimeMemo1Done){
            result = true;
        }
        if(this.global_consoleDebug){
            console.log("calculationsFinished: ",result);
        }
        return result;
    }

    animate(type){
        this.setState({
            runAnimation: true
        });
        if(this.global_consoleDebug){
            console.log("calculationsMemoFinished: this.state.countMemo: ",this.state.countMemo);
        }
        const loopamountSelect = document.getElementById("loopamountSelect");
        if(loopamountSelect){
            if(!loopamountSelect.hasAttribute("disabled")){
                loopamountSelect.setAttribute("disabled","disabled");
            }
        }
        const levelamountSelect = document.getElementById("levelamountSelect");
        if(levelamountSelect){
            if(!levelamountSelect.hasAttribute("disabled")){
                levelamountSelect.setAttribute("disabled","disabled");
            }
        }
        if(this.state.countMemo === 2){
            if(this.state.showBenchmarkMemo){
                this.setState({
                    showBenchmarkMemo: false
                });
            }
        }
        if(type === 'normal'){
            setTimeout(function(){
                this.executeNormal();
            }.bind(this),500);
        }
        if(type === 'memo'){
            setTimeout(function(){
                this.executeMemo();
            }.bind(this),500);
        }
    }

    resetPage(){
        document.location = document.location;
    }

    handleSelectChange1(event){
        if(this.global_consoleDebug){
            console.log('Pageheader: handleSelectChange1(): event.target.value: ',event.target.value);
        }
        this.setState({
            timesToRender: parseInt(event.target.value)
        });
    }

    handleSelectChange2(event){
        if(this.global_consoleDebug){
            console.log('Pageheader: handleSelectChange2(): event.target.value: ',event.target.value);
        }
        this.setState({
            levels: parseInt(event.target.value)
        });
    }

    render() {

        const buttonResetStyle = {
            display: "none"
        };
    
        const headerA = (<a className="bitbucket-link" href="https://bitbucket.org/charlesrobertson/use-memo-benchmark-functional/src/master/" target="_blank" rel="noreferrer"><i className="fa fa-github"></i></a>);
        const headerSpan = (<span className="mdl-layout-title">Use Memo Benchmark</span>);
    
        const defaultStyle1 = {
            display: 'block'
        };
    
        const defaultStyle2 = {
            padding: '20px'
        };
        
        const defaultStyle3 = {
            background: 'tomato'
        };
    
        let optsClassName1 = {};
        optsClassName1['className'] = "demo-card-wide";
        let optsClassName2 = {};
        optsClassName2['className'] = "post";
        
        const defaultStyle4 = {
            display: 'none'
        };
        if(this.state.runAnimation){
            defaultStyle4['display'] = "block";
        }
    
        const spinner = (<div className="spinner-container" style={defaultStyle4}><div className="spinner-container-inner"><Spinner singleColor /></div></div>);
    
        const _loopamount_select = [100,500,1000,5000,10000,15000,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000];
    
        let loopamount_select = _loopamount_select.map(
            function (records, index) {
                return (
                    <option value={records} key={index}>{records}</option>
                );
            }
        );
        loopamount_select = (<div className="loopamount-select"><select id="loopamountSelect" className="custom" onChange={this.handleSelectChange1.bind(this)} value={this.state.timesToRender}>{loopamount_select}</select></div>);

        const _levelamount_select = [1,2,3,4,5,6,7,8,9,10];

        let levelamount_select = _levelamount_select.map(
            function (records, index) {
                return (
                <option value={records} key={index}>{records}</option>
                );
            }
        );
        levelamount_select = (<div className="levelamount-select"><select id="levelamountSelect" className="custom" onChange={this.handleSelectChange2.bind(this)} value={this.state.levels}>{levelamount_select}</select></div>);
    
        const headerLink = ( 
            
            <Card shadow={0} {...optsClassName1} style={defaultStyle1}>
                <CardTitle {...optsClassName2}>
                    <h2 className="mdl-card__title-text"></h2>
                </CardTitle>
                <CardText>
                    <ol>
                        <li>
                            Please click on the Toggle Normal button, until a 'finish' notification appears, and then the calculate button
                        </li>
                        <li>
                            Please click on the Toggle Memo button, until a 'finish' notification appears, and then the calculate button
                        </li>
                        <li>
                            Repeat step 2. This ensures that the <strong>MemoizeOne</strong> library has an opportunity to cache each element.
                        </li>
                        <li>
                            Click on the refresh icon above.
                        </li>
                    </ol>
                </CardText>
                <CardActions border>
                    <div className="todo-container" style={defaultStyle2}>

                        <div>
                            <p className="select-title"><span>Levels</span></p>
                            {levelamount_select}
                            <p className="select-title"><span>Loops</span></p>
                            {loopamount_select}
                            <div className="notification"> 
                                <div className="left">{spinner}</div>
                                <div id="notification-right" className="right"> 
                                    {this.state.showBenchmarkNormal ? this._renderProfilerNormal() : (this.state.showBenchmarkMemo ? this._renderProfilerMemo() : '')}
                                    <span id="notification-right-text"></span>
                                </div>
                            </div>
                            <p>
                                <button id="toggleNormal" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={() => {this.animate('normal')}}>Toggle Normal</button>
                            </p>
                            <p>
                                <button id="toggleMemo" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={() => {this.animate('memo')}}>Toggle Memo</button>
                            </p>
                            <p>
                                <button id="buttonCalculate" style={defaultStyle3} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={() => {this.calculateAvgTimeNormal();this.calculateAvgTimeMemo()}}>Calculate</button>
                            </p>
                            <div>

                                <Card className="card-calculate" shadow={0} style={{marginTop: '40px'}}>
                                    <CardTitle expand style={{alignItems: 'flex-start', color: '#fff'}}>
                                        <h4 style={{marginTop: '0'}}>
                                            <strong>Avg time</strong> normal for a {this.state.timesToRender} loop
                                        </h4>
                                    </CardTitle>
                                    <CardActions border style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center', color: '#fff'}}>
                                        <span id="spanAvgTimeNormal">{this.state.avgTimeNormal}</span>
                                        <div className="mdl-layout-spacer"></div>
                                        <Icon name="calculate" />
                                    </CardActions>
                                </Card>

                                <Card className="card-calculate" shadow={0} style={{marginTop: '20px'}}>
                                    <CardTitle expand style={{alignItems: 'flex-start', color: '#fff'}}>
                                        <h4 style={{marginTop: '0'}}>
                                            <strong>Avg time</strong> memo for a {this.state.timesToRender} loop
                                        </h4>
                                    </CardTitle>
                                    <CardActions border style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center', color: '#fff'}}>
                                        <span id="spanAvgTimeMemo1">{this.state.avgTimeMemo1}</span>
                                        <div className="mdl-layout-spacer"></div>
                                        <Icon name="calculate" />
                                    </CardActions>
                                    <CardActions border style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center', color: '#fff'}}>
                                        <span id="spanAvgTimeMemo2">{this.state.avgTimeMemo2}</span>
                                        <div className="mdl-layout-spacer"></div>
                                        <Icon name="calculate" />
                                    </CardActions>
                                    
                                </Card>

                            </div>
                        </div> 

                    </div>     

                </CardActions>
                <CardMenu style={{color: '#fff'}}>
                    <IconButton  id="buttonReset" name="refresh" onClick={() => {this.resetPage()}} />
                </CardMenu>
            </Card>
            
        );

        return (
            <Layout fixedHeader>
                <Header title={headerSpan}>
                    {headerA}
                </Header>
                <Drawer>
                    <Navigation className="mdl-navigation"></Navigation>
                </Drawer>
                <Content>
                    <div className="page-content">
                        {headerLink}
                    </div>
                </Content>
            </Layout>
        );
    }

};

export default PageHeader;