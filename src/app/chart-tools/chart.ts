import * as d3 from 'd3';
import { fakeNewsUpdate } from './fake-update';
import { Subject } from 'rxjs';
// Chart properties
import {
  width,
  margin,
  height,
  maxElementsInX,
  verticalRowHeight,
  verticalTowTopMagin,
  verticalRowWidth,
  primaryColor,
  leftBarColor,
} from './properties';
import { fakeNewsDefault, countryData } from './data';
import { getAllDifferentTopics } from './data/data-parse';
import {
  ChartToolsService,
  ChartToolEvents,
} from '../services/chart-tool.service';

let _chartToolService: ChartToolsService;

export const getChart = async (chartToolService: ChartToolsService) => {
  _chartToolService = chartToolService;
  const simpleDebugger = new Subject();

  // Bootstrap the container
  const svgContainer = d3
    .select('.main-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Bootstrap the main graphics
  const svgMainChart = svgContainer
    .append('g')
    .attr('width', width)
    .attr('height', height);

  // Add X axis
  let x = d3.scaleLinear().domain([0, 7]).range([verticalRowWidth, width]);
  svgMainChart
    .append('g')
    // place at bottom
    .attr('transform', 'translate(0,' + (height - 40) + ')')
    .call(d3.axisBottom(x));

  // Add Y axis
  let y = d3
    .scaleLinear()
    .domain([0, fakeNewsDefault.length])
    .range([height, 0]);
  // svgMainChart.append('g').call(d3.axisLeft(y));

  // Topic names

  // Add a scale for bubble size
  let z = d3.scaleLinear().domain([0, 200]).range([10, 50]);

  let countX = 1;
  let countY = 1;
  // Topic names

  //
  let dateElementWidth = 0;

  countY = 1;
  const fullLeftBar = svgMainChart
    .append('rect')
    .attr('width', verticalRowWidth)
    .attr('fill', leftBarColor)
    .attr('height', height);
  const topicY = generateYAxis(svgMainChart, fakeNewsDefault);
  const dotElement = svgMainChart
    .append('g')
    .selectAll('dot')
    .data(fakeNewsDefault)
    .enter()
    .append('circle')
    .attr('cx', (d: any) => {
      return x(d.date) + dateElementWidth;
    })
    .attr('cy', (d: any) => {
      return topicY.getYForTopic(d.topicName) - 4;
    })
    .attr('r', (d: any) => {
      return z(d.newsAmount);
    })
    .style('fill', '#0092b3')
    .style('opacity', '0.7')
    .attr('stroke', 'black');

  registerScrollEvents(svgMainChart, topicY.topicNames, dotElement);
  initDebugger(dotElement, simpleDebugger);
  debugOptions(svgMainChart, topicY.topicNames, dotElement);

  const topicX = generateXAxis(svgMainChart, fakeNewsDefault);
  dotElement.attr('cx', (d: any) => {
    return x(d.date) + topicX.dateWidth / 2;
  });
  return simpleDebugger;
};

const generateYAxis = (svgMainChart, data) => {
  const uniqueTopics = getAllDifferentTopics(data);
  let count = 0;

  const topicNames = svgMainChart
    .append('g')
    .selectAll('dot')
    .data(uniqueTopics)
    .enter()
    .append('text')
    .attr('fill', 'white')
    .attr('x', verticalRowWidth / 2)
    .attr('y', 60 / 2 + 17 / 4)
    .attr('text-anchor', 'middle')
    .attr('y', (d: any) => {
      return count++ * verticalRowHeight + 21;
    })
    .attr('width', (d: any) => {
      return 50;
    })
    .attr('height', (d: any) => {
      return 50;
    })
    .style('fill', 'purple')
    .style('opacity', '0.7')
    .attr('stroke', 'black')
    .text((d: any) => {
      return d;
    });

  return {
    topicNames,
    getYForTopic: (topicName: string) => {
      let returnPosition = uniqueTopics.indexOf(topicName);

      if (returnPosition === -1) {
        throw Error('Topic non existant: ' + topicName);
      }
      return returnPosition * verticalRowHeight + 21;
    },
  };
};

const generateXAxis = (svgMainChart, data) => {
  const datesElements = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Staurday',
    'Sunday',
  ];

  const inViewDatesAmount = datesElements.length;
  let count = 0;
  let alternate = false;

  const fullBottomBar = svgMainChart
    .append('rect')
    .attr('width', width)
    .attr('fill', primaryColor)
    .attr('height', 60)
    .attr('transform', 'translate(0,' + (height - 60) + ')');

  for (const dateElement of datesElements) {
    const dateZoneWidth = (width - verticalRowWidth) / inViewDatesAmount;
    const gElement = svgMainChart
      .append('g')
      .attr('fill', primaryColor)
      .attr('transform', () => {
        return (
          'translate(' +
          (count++ * dateZoneWidth + verticalRowWidth) +
          ',' +
          (height - 60) +
          ')'
        );
      });
    gElement.append('rect').attr('width', dateZoneWidth).attr('height', 60);
    // place at bottom
    gElement
      .append('text')
      .text(dateElement)
      .attr('fill', 'white')
      .attr('x', dateZoneWidth / 2)
      .attr('y', 60 / 2 + 17 / 4)
      .attr('text-anchor', 'middle');
  }

  return {
    dateWidth: (width - verticalRowWidth) / inViewDatesAmount,
  };
};

// Events
const registerScrollEvents = (
  svgMainChart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  topicNames,
  dotElement
) => {
  let currentScrollYDisplace = 0;
  //
  _chartToolService.chartToolEvent.subscribe((eventType: ChartToolEvents) => {
    if (eventType === ChartToolEvents.ScrollUp) {
      currentScrollYDisplace -= 80;
    } else {
      currentScrollYDisplace += 80;
    }
    if (currentScrollYDisplace > 0) {
      currentScrollYDisplace = 0;
    }

    topicNames
      .transition()
      .attr('duration', function (d, i) {
        return 5000 * (i + 1);
      })
      .attr('transform', function (d, i) {
        return `translate(0, ${currentScrollYDisplace})`;
      });

    dotElement
      .transition()
      .attr('duration', function (d, i) {
        return 1000 * (i + 1);
      })
      .attr('transform', function (d, i) {
        return `translate(0, ${currentScrollYDisplace})`;
      });

    console.log(currentScrollYDisplace);
  });
};

// Debug
const initDebugger = (dotElement, simpleDebugger) => {
  dotElement.on('mouseenter', function () {
    const dotElementCustom = d3.select(this);
    const selected = dotElementCustom.attr('selected') === 'true';

    if (!selected) d3.select(this).style('opacity', '1');

    simpleDebugger.next(
      `Mouse enter, selected: ${selected}, Topic: ${
        (dotElementCustom.data()[0] as any).topicName
      }, Amount: ${(dotElementCustom.data()[0] as any).newsAmount}, date: ${
        (dotElementCustom.data()[0] as any).date
      }`
    );
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
};

const debugOptions = (
  svgMainChart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  topicNames,
  dotElement
) => {
  // Debug 1
  let scrollAmount = 0;
  document.querySelector('#debug1').addEventListener('click', (e) => {
    scrollAmount++;
    topicNames
      .transition()
      .attr('duration', function (d, i) {
        return 1000 * (i + 1);
      })
      .attr('transform', function (d, i) {
        return `translate(0, ${scrollAmount * 40})`;
      });

    dotElement
      .transition()
      .attr('duration', function (d, i) {
        return 1000 * (i + 1);
      })
      .attr('transform', function (d, i) {
        return `translate(0, ${scrollAmount * 40})`;
      });
  });
  // Debug 2
};
