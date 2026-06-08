import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const ActivityChart = (props: { data: any }) => {
  const getCurrentDay = () => {
    const dayIndex = new Date().getDay();
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayMap[dayIndex];
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
            padding: '0.2rem 1rem 0.2rem 1rem',
          }}
        >
          <p className="label" style={{ fontWeight: 'bold' }}>
            {label}
          </p>
          <p className="label">{`Activity Total: ${payload[0].value} mins`}</p>
        </div>
      );
    }

    return null;
  };
  const today = getCurrentDay();
  return (
    <div className="activity-chart">
      <BarChart
        width={500}
        height={300}
        data={props.data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey="name"
          stroke="var(--fontColor)"
          scale="point"
          padding={{ left: 15, right: 15 }}
        />
        <YAxis stroke="var(--fontColor)" />
        <Tooltip
          wrapperStyle={{ color: 'var(--background)' }}
          content={<CustomTooltip />}
        />
        <Bar dataKey="duration" barSize={30}>
          {props.data.map((entry: { name: any }, index: any) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.name === today ? 'var(--primary1)' : 'var(--surface2)'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

export default ActivityChart;
