import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import React, { useState } from 'react';
import './donutChart.css';

const DonutChart = (props: { data: any }) => {
  const COLORS = ['#242424', '#3b3b3b', '#545454', '#6e6e6e', '#898989'];
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_: any, index: React.SetStateAction<number>) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  // Custom tooltip for the activity chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: 'var(--surface2)',
            color: 'var(--fontColor)',
            padding: '0.2rem 0.5rem 0.2rem 0.8rem',
          }}
        >
          <p
            className="label"
            style={{ fontWeight: 'bold' }}
          >{`${payload[0].name}`}</p>
          <p className="label">{`${payload[0].value} times this week`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <PieChart width={300} height={300}>
      <Pie
        dataKey="value"
        data={props.data}
        cx={150}
        cy={150}
        outerRadius={100}
        innerRadius={70}
        paddingAngle={4}
        onMouseEnter={onPieEnter}
        onMouseLeave={onPieLeave}
        stroke="var(--background)"
        strokeWidth={0.5}
      >
        {props.data.map((entry: any, index: any) => (
          <Cell
            key={`cell-${index}`}
            fill={
              index === activeIndex
                ? 'var(--primary2)'
                : COLORS[index % COLORS.length]
            }
          />
        ))}
      </Pie>
      <Tooltip
        wrapperStyle={{ color: 'var(--background)' }}
        content={<CustomTooltip />}
      />
    </PieChart>
  );
};

export default DonutChart;
