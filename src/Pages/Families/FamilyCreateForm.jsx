import React, { useState } from "react";
import { addMember } from "../../Api/memberApi";
import { useNavigate } from "react-router-dom";

const FamilyCreateForm = () => {
  const [familyHead, setFamilyHead] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const normalButton =
    "border-black hover:border-blue-600 border-2 hover:bg-blue-600 rounded-md text-black hover:text-white";
  const loadingButton =
    "border-blue-600 border-2 bg-blue-600 rounded-md cursor-default";

  const handleChange = (input) => (e) => {
    e.preventDefault();
    setFamilyHead((prev) => ({ ...prev, [input]: e.target.value }));
  };

  const createFamilyId = (name, contact) => {
    const firstThreeLetters = name.slice(0, 3).toUpperCase();
    const lastThreeDigits = contact.slice(-3);
    return `CH${firstThreeLetters}${lastThreeDigits}`;
  };

  const createClickHandler = async () => {
    if (window.confirm("Are you sure you want to create this family?")) {
      setIsLoading(true);
      const familyID = createFamilyId(familyHead.name, familyHead.contact);
      const headMemberData = {
        ...familyHead,
        relation: "head",
        familyID,
      };
      const response = await addMember({ familyID, memberData: headMemberData });
      if (response.status === 201) {
        alert("Family created successfully");
        window.location.reload();
      } else {
        alert("Couldn't create family. Please try again.");
      }
      setIsLoading(false);
      navigate("/family");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full mt-10">
        <p className="font-bold text-[1.8rem] visby ml-5 sm:mb-0 mb-5">
          Create Family
        </p>
      </div>
      <div className="mt-10 ml-5">
        <p className="text-xl mb-2">Name</p>
        <input
          onChange={handleChange("name")}
          className="border-black border-[1px] p-2 w-[40rem]"
        ></input>

        <div className="flex gap-[2rem]">
          <div>
            <p className="text-xl mb-2 mt-5">Age</p>
            <input
              type="number"
              onChange={handleChange("age")}
              className="border-black border-[1px] p-2 w-[19rem]"
            ></input>
          </div>
          <div>
            <p className="text-xl mb-2 mt-5">Gender</p>
            <select
              onChange={handleChange("gender")}
              className="border-black border-[1px] p-2 w-[19rem]"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="flex gap-[2rem]">
          <div>
            <p className="text-xl mb-2 mt-5">Contact</p>
            <input
              type="text"
              onChange={handleChange("contact")}
              className="border-black border-[1px] p-2 w-[19rem]"
            ></input>
          </div>
          <div>
            <p className="text-xl mb-2 mt-5">Date of Birth</p>
            <input
              type="date"
              onChange={handleChange("DOB")}
              className="border-black border-[1px] p-2 w-[19rem]"
            ></input>
          </div>
        </div>

        <div className="flex gap-[2rem]">
          <div>
            <p className="text-xl mb-2 mt-5">Blood Group</p>
            <input
              onChange={handleChange("bloodGroup")}
              className="border-black border-[1px] p-2 w-[19rem]"
            ></input>
          </div>
          <div>
            <p className="text-xl mb-2 mt-5">Occupation</p>
            <input
              onChange={handleChange("occupation")}
              className="border-black border-[1px] p-2 w-[19rem]"
            ></input>
          </div>
        </div>

        <div className="flex gap-[2rem]">
          <div>
            <p className="text-xl mb-2 mt-5">Education</p>
            <input
              onChange={handleChange("education")}
              className="border-black border-[1px] p-2 w-[19rem]"
            ></input>
          </div>
          <div>
            <p className="text-xl mb-2 mt-5">Landmark</p>
            <input
              onChange={handleChange("landmark")}
              className="border-black border-[1px] p-2 w-[19rem]"
            ></input>
          </div>
        </div>

        <div className="flex gap-[2rem]">
          <div>
            <p className="text-xl mb-2 mt-5">City</p>
            <input
              onChange={handleChange("city")}
              className="border-black border-[1px] p-2 w-[19rem]"
            ></input>
          </div>
          <div>
            <p className="text-xl mb-2 mt-5">State</p>
            <input
              onChange={handleChange("state")}
              className="border-black border-[1px] p-2 w-[19rem]"
            ></input>
          </div>
        </div>

        <div className="flex gap-[2rem]">
          <div>
            <p className="text-xl mb-2 mt-5">Karyakarni</p>
            <input
              onChange={handleChange("karyakarni")}
              className="border-black border-[1px] p-2 w-[40rem]"
            ></input>
          </div>
        </div>

        <p className="text-xl my-2">Profile Pic</p>
        <input
          onChange={handleChange("profilePic")}
          className="border-black border-[1px] p-2 w-[40rem]"
        ></input>

        <button
          onClick={isLoading ? () => {} : createClickHandler}
          className={`block mt-8 w-[128px] h-[51px] font-bold transition-all ease-in-out ${
            isLoading ? loadingButton : normalButton
          }`}
        >
          {!isLoading ? "Create Family " : <div id="lds-dual-ring" />}
        </button>
      </div>
    </div>
  );
};

export default FamilyCreateForm;