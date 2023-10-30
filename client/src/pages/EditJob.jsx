import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { Form, redirect, useLoaderData, useNavigation } from "react-router-dom";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { FormRow, FormSelect } from "../components";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";

export const editLoader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/jobs/${params.id}`);
    return data;
    // eslint-disable-next-line no-unreachable
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect("/dashboard/all-jobs");
  }
};

export const editAction = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  try {
    await customFetch.patch(`/jobs/${params.id}`, data);
    toast.success("Job Edited Successfully");
    return redirect("/dashboard/all-jobs");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const EditJob = () => {
  const { job } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">Edit Job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow
            type="text"
            name="jobLocation"
            defaultValue={job.jobLocation}
            labelText="Job Location"
          />
          <FormSelect
            name="jobStatus"
            lableText="Job Status"
            list={JOB_STATUS}
            defaultValue={job.jobStatus}
          />
          <FormSelect
            name="jobType"
            lableText="Job Type"
            list={JOB_TYPE}
            defaultValue={job.jobType}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-block form-btn"
          >
            {isSubmitting ? "Submiting..." : "Edit"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};
export default EditJob;
