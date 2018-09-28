import React, { Component } from 'react';
import { scaleLinear, scaleTime, } from 'd3-scale';
import { max, extent } from 'd3-array';
import { select, event} from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-axis';
import { transition } from 'd3-transition'; // transition IS INDEED USED, fucking bullshit

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.fetchData = this.fetchData.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.createBarChart = this.createBarChart.bind(this);
  }
  componentDidMount() {
    console.log('component mounted!');
    let link = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    this.fetchData(link);
  };
  componentDidUpdate() {
    console.log('component updated!');
    this.createBarChart(this.state.data);
  };
  handleErrors(response) { // throws an error if response is NOT OK
    if (!response.ok) throw Error(response.statusText);
    else return response;
  };
  fetchData(address) {
    fetch(address)
    .then(this.handleErrors)
    .then(response => response.json())
    .then(json => this.setState({ data: json.data }))
  };
  createBarChart(data) {
    const node = this.node;
    const h = 500; const w = 1200 // hardcoded height and width
    const padding = 50; // harcoded padding, too
    const dateArray = data.map(i => new Date(i[0]));
    // const xAxisFormatter = timeFormat("%d %m %Y");
    // console.log(dateArray);
    const barWidth = (w - 2*padding) / dateArray.length;

    const xScale = scaleTime()
                    .domain(extent(dateArray))
                    .range([padding, w-padding])
    const yScale = scaleLinear()
                    .domain([0, max(data.map(i => i[1]))])
                    .range([h-padding , padding])
    
    const xAxis = axisBottom(xScale).ticks(10);
    const yAxis = axisLeft(yScale);

    // const tooltip = document.getElementById('tooltip');
    const tooltip = select('#tooltip');

    const handleMouseover = (d) => {
      // console.log(d[1])
      tooltip.transition()
        .duration(100)
        .style('opacity', 0.9)
        .style('transform', 'scale(1) translate(0, 0)')
      tooltip.html(`date:\t${qtrYearFormat(d[0])} <br/>GDP:\t${withComma(d[1].toString())}`)
        .attr('data-date', d[0])
        .attr('date-gdp', d[1])
    }
    const handleMouseMove = (d) => {
      // console.log({pageX: event.pageX, pageY: event.pageY})
      // console.log(data, tooltip);
      tooltip.style('top', event.pageY-50)
        .style('left', event.pageX-55)
    }
    const handleMouseOut = () => {
      // console.log("moused out")
      tooltip.transition()
        .duration(50)
        .style('opacity', 0)
        .style('transform', 'scale(0)')
    }
    
    select(node).append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${h - padding})`)
      .call(xAxis);
    
    select(node).append('text')
      .attr('id', 'x-axis-label')
      .style('transform', `translate(${w/2}px, ${h-padding/4}px)`)
      .text('Date')
    
    select(node).append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding}, 0)`)
      .call(yAxis);
    
    select(node).append('text')
      .attr('id', 'y-axis-label')
      .style('transform', `translate(0px, ${h/2}px) rotate(-90deg)`)
      .text('USD in Billions')
    
    select(node).append('g')
      .attr('id', 'chart-area')
    select(node).select('#chart-area').selectAll('rect')
      .data(data).enter()
      .append('rect')
      .attr('class', 'bar')
        .attr('x', d => xScale(new Date(d[0])))
        .attr('y', d => yScale(d[1]))
        .attr('height', d => h - yScale(d[1]) - padding)
        .attr('width', barWidth)
        .attr('data-date', d => d[0])
        .attr('date-gdp', d => d[1])
        .on('mouseover', handleMouseover)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut)
  } 
  render() {
    return(
      <div>
        <svg ref={node => this.node = node} width={1200} height={500} />
        <div id='tooltip' style={{"opacity": 0}}></div>
      </div>
    )
  };
};

export default BarChart

const qtrYearFormat = (dateString) => { 
  let month = dateString.slice(5,7);
  switch (month) {
    case "01":
      return 'Q1 ' + dateString.slice(0,4);
    case "04":
      return 'Q2 ' + dateString.slice(0, 4)
    case "07":
      return 'Q3 ' + dateString.slice(0, 4)
    case "10":
      return 'Q4 ' + dateString.slice(0, 4)
    default:
      return 'fuck, this is wrong'
  };
};

const withComma = (numberString) => {
  let numberArray = []; 
  let toUnshift = "";
  let decimalEncountered = false;
  let counterFromDecimal = 0;
  for (let i in numberString) {
    toUnshift = numberString[numberString.length - 1 - i];
    // console.log({toUnshift, counterFromDecimal})
    if (!decimalEncountered) {
      // keep on looping until if statement below is true
      if (toUnshift == ".") {
        decimalEncountered = true;
      }
    } else {
      // decimal is encountered
      if (counterFromDecimal % 3 == 0 && counterFromDecimal !== 0) {
        numberArray.unshift(",");
      }
      counterFromDecimal++
    }
    numberArray.unshift(toUnshift)
  }
  return numberArray.join("");
}

// console.log(withComma("634632345346.23"));