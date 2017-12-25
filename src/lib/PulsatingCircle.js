"use strict";

import React, { Component } from "react";

import GenericChartComponent from "./GenericChartComponent";
import { getCircleCanvas } from "./GenericComponent";

class PulsatingCircle extends Component {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const { xValue } = this.props;
		const { xScale } = moreProps;
		const { chartConfig: { yScale } } = moreProps;

		const { x, y } = getPulsatingCircleCoordinates(xScale, yScale, xValue);

		ctx.beginPath();
		ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'green';
		ctx.fill();
	}
	render() {
		return <GenericChartComponent
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getCircleCanvas}
			drawOn={["pan"]}
		/>;
	}
}

function getPulsatingCircleCoordinates(xScale, yScale, xValue) {
	return { x: xScale(xValue), y: 20 };
}

export default PulsatingCircle;
