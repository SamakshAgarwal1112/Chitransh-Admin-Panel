import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createKaryakarni, uploadImage } from "../../Api/karyakarniApi";
import { State, City } from "country-state-city";

const KaryakarniCreateForm = () => {
  const navigate = useNavigate();
  const [karyakarni, setKaryakarni] = useState({
    name: "",
    landmark: "",
    city: "",
    state: "",
    address: "",
    logo: "",
    designations: [],
    level: "India"
  });

  const [logo, setLogo] = useState(null);
  const [currentDesignation, setCurrentDesignation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateCode, setStateCode] = useState("");

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  useEffect(() => {
    setCities([]);
    if (karyakarni.state) {
      const indianCities = City.getCitiesOfState("IN", stateCode);
      setCities(indianCities);   
    }
  }, [karyakarni.state, stateCode]);

  const normalButton =
    "border-black hover:border-blue-600 border-2 hover:bg-blue-600 rounded-md text-black hover:text-white";
  const loadingButton =
    "border-blue-600 border-2 bg-blue-600 rounded-md cursor-default";

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state" && value !== "") {
      const selectedState = JSON.parse(value);
      setStateCode(selectedState.isoCode);
      setKaryakarni((prev) => ({ ...prev, [name]: selectedState.name }));
    }
    else {
      setKaryakarni((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoUpload = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleAddDesignation = () => {
    if (currentDesignation.trim()) {
      setKaryakarni((prev) => ({
        ...prev,
        designations: [...prev.designations, currentDesignation.trim()],
      }));
      setCurrentDesignation("");
    }
  };

  const handleRemoveDesignation = (index) => {
    setKaryakarni((prev) => ({
      ...prev,
      designations: prev.designations.filter((_, i) => i !== index),
    }));
  };

  const validateKaryakarniFields = (karyakarni) => {
    const missingFields = [];
    if (karyakarni.name === "") missingFields.push("Name");
    if (karyakarni.landmark === "") missingFields.push("Landmark");
    if (karyakarni.address === "") missingFields.push("Address");
    if (karyakarni.level !== "India" && karyakarni.state === "") missingFields.push("State");
    if (karyakarni.level === "City" && karyakarni.city === "") missingFields.push("City");
    if (karyakarni.designations.length === 0) missingFields.push("Designations");

    return missingFields;
  }

  const createClickHandler = async () => {
    const missingFields = validateKaryakarniFields(karyakarni);
    if (missingFields && missingFields.length > 0) {
      alert(`You must enter all the required fields: ${missingFields.join(", ")}`);
    }
    else if (window.confirm("Are you sure you want to create this karyakarni?")) {
      setIsLoading(true);
      if(karyakarni.level !== "City") {
        karyakarni.city = "";
      }
      if(karyakarni.level === "India") {
        karyakarni.state = "";
      }
      if (logo !== null) {
        const logoUrl = await uploadImage(logo);
        const karyakarniWithLogo = { ...karyakarni, logo: logoUrl };
        await createKaryakarni(karyakarniWithLogo);
      } else {
        await createKaryakarni(karyakarni);
      }
      setIsLoading(false);
      navigate("/karyakarni");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full mt-10">
        <p className="font-bold text-[1.8rem] visby ml-5 sm:mb-0 mb-5">
          Create Karyakarni
        </p>
      </div>
      <div className="mt-10 ml-5">
        <p className="text-xl mb-2">Name</p>
        <input
          name="name"
          onChange={handleChange}
          className="border-black border-[1px] p-2 w-[40rem]"
        />

        <p className="text-xl mb-2 mt-5">Level</p>
        <div onChange={handleChange} className="flex">
          <label className="mr-4">
            <input
              type="radio"
              name="level"
              value="India"
              checked={karyakarni.level === "India"}
              className="mr-2"
            />
            All India
          </label>
          <label className="mr-4">
            <input
              type="radio"
              name="level"
              value="State"
              checked={karyakarni.level === "State"}
              className="mr-2"
            />
            State
          </label>
          <label className="mr-4">
            <input
              type="radio"
              name="level"
              value="City"
              checked={karyakarni.level === "City"}
              className="mr-2"
            />
            City
          </label>
        </div>

        {karyakarni.level !== "India" && (
          <>
            <p className="text-xl mb-2 mt-5">State</p>
            <select
              name="state"
              onChange={handleChange}
              className="border-black border-[1px] p-2 w-[40rem]"
            >
              <option value="">Select State</option>
              {states && states.map((state) => (
                <option key={state.isoCode} value={JSON.stringify({ isoCode: state.isoCode, name: state.name })}>
                  {state.name}
                </option>
              ))}
            </select>
          </>
        )}

        {karyakarni.level === "City" && (
          <>
            <p className="text-xl mb-2 mt-5">City</p>
            <select
              name="city"
              onChange={handleChange}
              className="border-black border-[1px] p-2 w-[40rem]"
              disabled={!karyakarni.state && karyakarni.level === "City"}
            >
              <option value="">Select City</option>
              {cities && cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </>
        )}

        <p className="text-xl mb-2 mt-5">Head Quarters</p>
        <input
          name="landmark"
          onChange={handleChange}
          className="border-black border-[1px] p-2 w-[40rem]"
        />

        <p className="text-xl mb-2 mt-5">Address</p>
        <input
          name="address"
          onChange={handleChange}
          className="border-black border-[1px] p-2 w-[40rem]"
        />

        <p className="text-xl mb-2 mt-5">Select Logo</p>
        <input onChange={handleLogoUpload} type="file" />

        <p className="text-xl mb-2 mt-5">Designations</p>
        <div className="flex items-center">
          <input
            value={currentDesignation}
            onChange={(e) => setCurrentDesignation(e.target.value)}
            className="border-black border-[1px] p-2 w-[30rem]"
          />
          <button
            onClick={handleAddDesignation}
            className="ml-2 p-2 bg-blue-600 text-white rounded-md"
          >
            Add
          </button>
        </div>
        <ul className="mt-2">
          {karyakarni.designations && karyakarni.designations.map((designation, index) => (
            <li key={index} className="flex items-center mb-1">
              <span className="mr-2">{designation}</span>
              <button
                onClick={() => handleRemoveDesignation(index)}
                className="text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={isLoading ? () => {} : createClickHandler}
          className={`block mt-8 w-[128px] h-[51px] font-bold transition-all ease-in-out ${
            isLoading ? loadingButton : normalButton
          }`}
        >
          {!isLoading ? "Create" : <div id="lds-dual-ring" />}
        </button>
      </div>
    </div>
  );
};

export default KaryakarniCreateForm;
