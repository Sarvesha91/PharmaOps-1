import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Typography } from '@mui/material';

type ComplianceDatum = {
  label: string;
  value: number;
};

const data: ComplianceDatum[] = [
  { label: 'EU', value: 92 },
  { label: 'US', value: 88 },
  { label: 'LATAM', value: 81 },
  { label: 'APAC', value: 85 },
];

const ComplianceChart = () => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const width = 320;
    const height = 180;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '0.75rem');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}%` as string))
      .selectAll('text')
      .style('font-size', '0.75rem');

    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d.label)!)
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => y(0) - y(d.value))
      .attr('rx', 6)
      .attr('fill', '#006D77');
  }, []);

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        Regional Audit Readiness
      </Typography>
      <svg ref={ref} width={320} height={180} role="img" aria-label="Regional compliance chart" />
    </Box>
  );
};

export default ComplianceChart;

