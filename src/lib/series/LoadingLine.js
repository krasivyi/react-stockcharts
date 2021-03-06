"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { hexToRGBA, isDefined, isNotDefined, strokeDashTypes, getStrokeDasharray } from "../utils";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

class LoadingLine extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const { type, stroke, strokeWidth, opacity, strokeDasharray } = this.props;
		const { yValue, xValue } = this.props;
		const { xScale } = moreProps;
		const { chartConfig: { yScale, width, height } } = moreProps;
		const {text, fontSize, textColor, loadingBg} = this.props

		ctx.beginPath();

		ctx.strokeStyle = hexToRGBA(stroke, opacity);
		ctx.lineWidth = strokeWidth;

		const { x1, y1, x2, y2 } = getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height);

		ctx.setLineDash(getStrokeDasharray(strokeDasharray).split(","));
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		ctx.closePath()
		ctx.beginPath();

		ctx.fillStyle=loadingBg;
		ctx.fillRect(x1-width, y1, width, y2-1);

		ctx.closePath()
		ctx.beginPath();

		ctx.translate( x1-20, y1+height/2 );
		ctx.rotate( 3 * Math.PI / 2 );
		ctx.font = fontSize + "px " + "Helvetica Neue, Helvetica, Arial, sans-serif";
		ctx.fillStyle = textColor
		ctx.textAlign = "center";
		ctx.fillText(text, 0, 0);
	}
	render() {
		return <GenericChartComponent
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getAxisCanvas}
			drawOn={["pan"]}
		/>;
	}
	renderSVG(moreProps) {
		const { width, height } = moreProps;
		const { xScale, chartConfig: { yScale } } = moreProps;

		const { className } = this.props;
		const { type, stroke, strokeWidth, opacity, strokeDasharray } = this.props;
		const { yValue, xValue } = this.props;

		const lineCoordinates = getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height);

		/*
		type === "horizontal"
			? { x1: xScale(first), y1: yScale(yValue), x2: xScale(last), y2: yScale(yValue) }
			: { x1: xScale(xValue), y1: yScale(0), x2: xScale(xValue), y2: yScale(height) };*/

		return (
			<line
				className={className}
				strokeDasharray={getStrokeDasharray(strokeDasharray)}
				stroke={stroke}
				strokeWidth={strokeWidth}
				opacity={opacity}
				{...lineCoordinates}
			/>
		);
	}
}

function getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height) {
	return type === "horizontal"
		? { x1: 0, y1: yScale(yValue), x2: width, y2: yScale(yValue) }
		: { x1: xScale(xValue), y1: 0, x2: xScale(xValue), y2: height };
}

LoadingLine.propTypes = {
	className: PropTypes.string,
	type: PropTypes.oneOf(["vertical", "horizontal"]),
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
	opacity: PropTypes.number.isRequired,
	yValue: function(props, propName/* , componentName */) {
		if (props.type === "vertical" && isDefined(props[propName])) return new Error("Do not define `yValue` when type is `vertical`, define the `xValue` prop");
		if (props.type === "horizontal" && isNotDefined(props[propName])) return new Error("when type = `horizontal` `yValue` is required");
		// if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `yValue` accepts a number");
	},
	xValue: function(props, propName/* , componentName */) {
		if (props.type === "horizontal" && isDefined(props[propName])) return new Error("Do not define `xValue` when type is `horizontal`, define the `yValue` prop");
		if (props.type === "vertical" && isNotDefined(props[propName])) return new Error("when type = `vertical` `xValue` is required");
		// if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `xValue` accepts a number");
	},
	text: PropTypes.string,
	fontSize: PropTypes.number,
	textColor: PropTypes.string,
	loadingBg: PropTypes.string
};

LoadingLine.defaultProps = {
	className: "line ",
	type: "horizontal",
	stroke: "#000000",
	opacity: 0.5,
	strokeWidth: 1,
	strokeDasharray: "Solid",
	text: "Loading...",
	fontSize: 20,
	textColor: "rgba(255,255,255,0.5)",
	loadingBg: "#1B1F27"
};

export default LoadingLine;
