import React, { useState } from "react";
import MemberItemContent from "./MemberItemContent";
import { Link, useLocation } from "react-router-dom";
import MemberView from "./MemberView";

const MemberList = () => {
  const { id, familyID, members } = useLocation().state;
  const [memberVariant, setMemberVariant] = useState(true);
  const [displayMember, setDisplayMember] = useState({});

  const clickHandler = (item, id) => {
    setMemberVariant((prev) => !prev);
    setDisplayMember(item);
  };

  if (memberVariant) {
    return (
      <div className="w-full">
        <div className="w-full mt-24">
          <div className=" flex justify-between">
            <p className="font-bold text-[1.8rem] visby ml-5 sm:mb-0 mb-5">
              Members
            </p>
            <Link to="/addMember" state={{id,familyID}}>
              <button className="my-2 w-[128px] h-[51px] font-bold transition-all ease-in-out border-black hover:border-blue-600 border-2 hover:bg-blue-600 rounded-md text-black hover:text-white block">
                Add Member
              </button>
            </Link>
          </div>
          <ul className="my-5 sm:flex hidden justify-around font-medium text-[#A7A7A7]">
            <li>Name</li>
            <li>Relation</li>
            <li> Contact</li>
          </ul>
          {members && members.map((item, idx) => (
            <div
            key={idx}
              onClick={() => clickHandler(item, id)}
              className="w-full cursor-pointer border-black border-[0.5px] h-[5rem] hover:h-[7rem] rounded-lg relative overflow-hidden px-5 py-3 sm:pt-3 transition-all ease-in-out my-2"
            >
              <MemberItemContent key={idx} item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <MemberView setMemberVariant={setMemberVariant} displayMember={displayMember} familyID={familyID} id={id} />;
};

export default MemberList;