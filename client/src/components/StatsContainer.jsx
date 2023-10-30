/* eslint-disable react/prop-types */
import Wrapper from "../assets/wrappers/StatsContainer";
import { FaBug, FaCalendarCheck, FaSuitcase } from "react-icons/fa";
import StatItem from "./StatItem";

const StatsContainer = ({ defaultStats }) => {
  const stats = [
    {
      title: "Pending Applications",
      count: defaultStats?.pending || 0,
      icon: <FaSuitcase />,
      color: "#f59e0b",
      bcg: "#fef3c7",
    },
    {
      title: "Interviews Scheduled",
      count: defaultStats?.interview || 0,
      icon: <FaCalendarCheck />,
      color: "#647acb",
      bcg: "#e0e8f9",
    },
    {
      title: "Jobs Declined",
      count: defaultStats?.declined || 0,
      icon: <FaBug />,
      color: "#b66a6a",
      bcg: "#ffeeee",
    },
  ];

  return (
    <Wrapper>
      {stats.map((stat) => {
        const { title, count, icon, color, bcg } = stat;
        return (
          <StatItem
            key={title}
            title={title}
            count={count}
            icon={icon}
            color={color}
            bcg={bcg}
          />
        );
      })}
    </Wrapper>
  );
};
export default StatsContainer;
