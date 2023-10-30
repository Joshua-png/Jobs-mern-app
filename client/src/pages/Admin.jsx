import { redirect, useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/StatsContainer";
import { StatItem } from "../components";
import { FaCalendarCheck, FaSuitcaseRolling } from "react-icons/fa";

export const adminLoader = async () => {
  try {
    const { data } = await customFetch.get(`/user/app-stats`);
    return data;
  } catch (error) {
    toast.error("You are not authorized to view this page.");
    return redirect("/dashboard");
  }
};

const Admin = () => {
  const { users, jobs } = useLoaderData();
  console.log(users, jobs);
  return (
    <Wrapper>
      <StatItem title="Current Users" count={users} color="#e9b949" bcg="#fcefc7" icon={<FaSuitcaseRolling />}/>
      <StatItem title="Total Jobs" count={jobs} color="#647acb" bcg="#e0e8f9" icon={<FaCalendarCheck />}/>
    </Wrapper>
  );
};
export default Admin;
