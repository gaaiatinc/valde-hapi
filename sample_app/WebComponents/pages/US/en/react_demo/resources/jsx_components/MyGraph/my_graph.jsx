/**
 * Created by Ali on 1/3/2016.
 */
"use strict";
import React from "react";
import ReactDOM  from "react-dom";

import * as MyCanvas from "./lib/graph_impl";


/**
 * An example of an element to override the body top element in the parent template.
 */
class MyGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.__canvas = <canvas id="canvas" width="1210" height="610" ref={(canvsNode) => {this.__canvasRef = canvsNode;}} />;
    }

    plotNewGraphData(newGraphData) {
        this.redrawCanvas(newGraphData);
    }

    componentDidMount() {
       this.redrawCanvas();

    }

    redrawCanvas(newGraphData) {
        function getRandomInc() {
            return Math.floor(Math.random() * (30) -15);
        }

        let ctx = this.__canvasRef.getContext("2d");
        let oldCtxStrokeStyle = ctx.strokeStyle;
        let oldCtxFillStyle =  ctx.fillStyle;
        let oldCtxFont =  ctx.font;



        ctx.fillStyle = "#EBF4FA";
        ctx.fillRect(10, 10, 1190, 590);

        ctx.strokeStyle = "black";
        ctx.strokeRect(10, 10, 1190, 590);

        ctx.fillStyle = "black";
        ctx.font = "32px serif";
        ctx.strokeText("Hello world", 500, 40);
        ctx.font = "16px serif";
        ctx.fillText("Goodness proliferation index", 480, 60);


        let yyyy = 295;
        ctx.strokeStyle = "rgba(200, 0, 0, 0.95)";
        ctx.beginPath();
        ctx.moveTo(20, yyyy);

        for(let xxxx = 30; xxxx < 1180; xxxx+=10 ) {
            ctx.lineTo(xxxx, yyyy);
            yyyy -= getRandomInc();
            if(yyyy < 70) {
                yyyy = 70;
            } else if(yyyy > 590) {
                yyyy = 590;
            }
        }
        ctx.stroke();




        ctx.fillStyle = oldCtxFillStyle;
        ctx.strokeStyle = oldCtxStrokeStyle;
        ctx.font = oldCtxFont;
    }

    render() {
        return (
            <div>
                <p>canvas title: demo graph</p>
                {this.__canvas}
                <p>canvas caption: TBD</p>
            </div>
        );
    }
}
MyGraph.propTypes = {modelData: React.PropTypes.object};
MyGraph.defaultProps = {};


export default MyGraph;
