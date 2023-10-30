import Wrapper from "../assets/wrappers/DashboardFormPage.js";
import {
  Form,
  redirect,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import { FormRow, FormSelect } from "../components";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants.js";
import customFetch from "../utils/customFetch.js";
import { toast } from "react-toastify";

export const addJobAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/jobs", data);
    toast.success("Job Created Successfully");
    return redirect("all-jobs");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AddJob = () => {
  const { user } = useOutletContext();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">Add Job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" />
          <FormRow type="text" name="company" />
          <FormRow
            type="text"
            labelText="Job Location"
            name="jobLocation"
            defaultValue={user.location}
          />
          <FormSelect
            name="jobStatus"
            defaultValue={JOB_STATUS.PENDING}
            list={JOB_STATUS}
            lableText="Job Status"
          />
          <FormSelect
            name="jobType"
            defaultValue={JOB_TYPE.FULL_TIME}
            list={JOB_TYPE}
            lableText="Job Type"
          />

          <button
            type="submit"
            className="btn btn-block form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "submit"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};
export default AddJob;
