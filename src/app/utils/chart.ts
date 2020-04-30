import * as d3 from 'd3';
import { fakeNewsUpdate } from './fake-update';
import { Subject } from 'rxjs';

export const generateChart = () => {};

export const getChart = async () => {
  const simpleDebugger = new Subject();

  const margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

  const mainSVGElement = d3
    .select('.main-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  //Read the data
  d3.csv('http://localhost:5000/data.csv', (data: any) => {
    // Add X axis
    let x = d3.scaleLinear().domain([0, 10000]).range([0, width]);
    mainSVGElement
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear().domain([35, 90]).range([height, 0]);
    mainSVGElement.append('g').call(d3.axisLeft(y));

    // Add a scale for bubble size
    let z = d3.scaleLinear().domain([200000, 1310000000]).range([10, 30]);

    // Add dots
    const dotElement = mainSVGElement
      .append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => {
        return x(d.gdpPercap);
      })
      .attr('cy', (d: any) => {
        return y(d.lifeExp);
      })
      .attr('r', (d: any) => {
        return z(d.pop);
      })
      .style('fill', '#0092b3')
      .style('opacity', '0.7')
      .attr('stroke', 'black');

    // simple effects
    dotElement.on('mouseenter', function () {
      const dotElementCustom = d3.select(this);
      const selected = dotElementCustom.attr('selected') === 'true';

      if (!selected) d3.select(this).style('opacity', '1');

      simpleDebugger.next(`Mouse enter, selected: ${selected}`);
    });
    dotElement.on('mouseleave', function () {
      const dotElementCustom = d3.select(this);
      const selected = dotElementCustom.attr('selected') === 'true';

      if (!selected) d3.select(this).style('opacity', '0.7');

      simpleDebugger.next(`Mouse leave, selected: ${selected}`);
    });

    dotElement.on('click', function () {
      const dotElementCustom = d3.select(this);
      const selected = dotElementCustom.attr('selected') === 'true';

      if (selected) {
        dotElementCustom.style('fill', '#0092b3');
        dotElementCustom.attr('selected', 'false');
      } else {
        dotElementCustom.style('fill', 'red');
        dotElementCustom.attr('selected', 'true');
      }
      console.log(dotElementCustom.data());
      simpleDebugger.next(
        `Mouse click, selected: ${selected}, Country: ${
          (dotElementCustom.data()[0] as any).country
        }`
      );
    });

    setInterval(() => fakeNewsUpdate(mainSVGElement, data), 1000);

    return null;
  });

  return simpleDebugger;
};
