import { Form, Link, redirect, useNavigation } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { Logo } from "../components";
import FormRow from "../components/FormRow";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const registerAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration Successful");
    return redirect("/login");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    // console.log(error);
    return error;
  }
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <div className="form">
        <Form action="/register" method="post">
          <Logo />
          <h4>Register</h4>
          {/* <FormRow type="text" name="name" defaultValue="Joshuas" /> */}
          <FormRow type="text" name="name" />
          <FormRow type="text" name="lastName" labelText="Last Name" />
          <FormRow type="text" name="location" />
          <FormRow type="email" name="email" />
          <FormRow type="password" name="password" />
          <button
            type="submit"
            className="btn btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
          <p>
            Already a member?{" "}
            <Link to="/login" className="member-btn">
              Login
            </Link>
          </p>
        </Form>
      </div>
    </Wrapper>
  );
};
export default Register;
