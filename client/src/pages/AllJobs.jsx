import { toast } from "react-toastify";
import { JobsContainer } from "../components";
import { SearchContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { createContext } from "react";
import { useContext } from "react";

// Setting up Jobs Context beacuse the search and jobs containers are going to contain more components
const AllJobsContext = createContext();

export const allJobsLoader = async ({ request }) => {
  console.log(request.url);

  // Query Parameters
  // console.log(new URL(request.url).searchParams.entries());
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  // console.log(params);

  try {
    const { data } = await customFetch.get("/jobs", {
      params: params,
    });
    return { data, searchValues: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();
  // console.log(data);
  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

// custom hook
export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
