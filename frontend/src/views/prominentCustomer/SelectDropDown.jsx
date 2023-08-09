import Select from "react-select";
// import "bootstrap/dist/css/bootstrap.css";

const SelectDropDown = () => {
  const options = [
    { value: "blues", label: "Blues" },
    { value: "rock", label: "Rock" },
    { value: "jazz", label: "Jazz" },
    { value: "orchestra", label: "Orchestra" },
  ];
  // const customStyles = {
  //   option: (defaultStyles, state) => ({
  //     ...defaultStyles,
  //     color: state.isSelected ? "#212529" : "#fff",
  //     backgroundColor: state.isSelected ? "#a0a0a0" : "#212529",
  //   }),

    // control: (defaultStyles) => ({
    //   ...defaultStyles,
    //   backgroundColor: "#212529",
    //   padding: "10px",
    //   border: "none",
    //   boxShadow: "none",
    // }),
    // singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#fff" }),
  // };

  return (
    <div className="container">
      <div className="mt-5 m-auto w-50 text-light">
        <Select options={options}  />
      </div>
    </div>
  );
};

export default SelectDropDown;
