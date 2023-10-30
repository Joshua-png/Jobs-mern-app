/* eslint-disable react/prop-types */
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
  CartesianGrid,
} from "recharts";
const ReBarChart = ({ monthlyApplications }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyApplications} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar barSize={75} dataKey="count" stroke="#2cb1bc" fill="#2cb1bc" />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default ReBarChart;
