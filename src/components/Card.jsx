import React from "react";

function Card({ title, date, people, total, paid }) {
  return (
    <div className="border border-gray-300 rounded-lg px-4 py-2 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
        <div className="bg-yellow-300 text-black text-sm font-bold py-1 px-2 rounded-full">
          {people} People
        </div>
      </div>

      <div className="border-t border-gray-300 my-3"></div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-[#4B1AD4] text-lg font-bold">{`Rp. ${total ? total : ''}`}</p>
        </div>
        <p className="text-lg font-medium">{`${paid ? paid + '% paid' : ''}`}</p>
      </div>
    </div>
  );
}

export default Card;
