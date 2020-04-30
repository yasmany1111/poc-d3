import * as d3 from 'd3';
import { getRandomArbitrary } from './random';

// Implementing a simple live reload system for neutrality sockertIO
export const fakeNewsUpdate = (mainSVGElement, data) => {
  let z = d3.scaleLinear().domain([200000, 1310000000]).range([10, 30]);

  console.log(
    mainSVGElement.selectAll('circle').attr('r', (d: any) => {
      d.pop *= getRandomArbitrary(1, 1.1);
      return z(d.pop);
    })
  );
};
