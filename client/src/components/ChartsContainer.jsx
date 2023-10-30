/* eslint-disable react/prop-types */
import Wrapper from "../assets/wrappers/ChartsContainer";
import ReBarChart from "./BarChart";
import ReAreaChart from "./AreaChart";
import { useState } from "react";

const ChartsContainer = ({ monthlyApplications }) => {
  const [barChart, setBarChart] = useState(true);

  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? "Bar Chart" : "Area Chart"}
      </button>
      {barChart ? (
        <ReBarChart monthlyApplications={monthlyApplications} />
      ) : (
        <ReAreaChart monthlyApplications={monthlyApplications} />
      )}
    </Wrapper>
  );
};
export default ChartsContainer;
