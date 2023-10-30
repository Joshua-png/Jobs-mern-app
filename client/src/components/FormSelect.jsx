/* eslint-disable react/prop-types */
const FormSelect = ({ lableText, name, list, defaultValue = "", onChange }) => {
  return (
    <div className="form-row">
      <label htmlFor="jobStatus" className="form-label">
        {lableText || name}
      </label>
      <select
        name={name}
        id={name}
        className="form-select"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {Object.values(list).map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default FormSelect;
