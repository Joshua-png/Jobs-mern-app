/* eslint-disable react/prop-types */
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { createContext, useContext, useState } from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const DashboardContext = createContext();

export const dashboardLoader = async () => {
  try {
    const user = await customFetch.get("/user/get-current-user");
    return user;
  } catch (error) {
    console.log(error);
    return redirect("/");
  }
};

const DashboardLayout = ({ isDarkthemeEnabled }) => {
  const response = useLoaderData();
  const navigate = useNavigate();
  const { user } = response.data;

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarktheme, setIsDarktheme] = useState(isDarkthemeEnabled);

  const toggleDarktheme = () => {
    const theme = !isDarktheme;
    setIsDarktheme(theme);
    document.body.classList.toggle("dark-theme", theme);
    localStorage.setItem("dark-theme", theme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logging out...");
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarktheme,
        toggleSidebar,
        logoutUser,
        toggleDarktheme,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

// Custom Hook
export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
