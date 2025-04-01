import React, { useState } from "react";

const TimeInput = ({ value, onChange }) => {
  const [time, setTime] = useState({
    hours: "1",
    minutes: "00",
    ampm: "AM",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedTime = { ...time, [name]: value };
    setTime(updatedTime);

    // Format and log the selected time

    const formattedTime = `${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.ampm}`;
    onChange(formattedTime);
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="w-full pl-4 pr-10 py-3 leading-none rounded-sm border border-gray-300 focus:outline-none focus:shadow-outline text-gray-600 font-medium flex items-center">
          <select
            name="hours"
            value={time.hours}
            onChange={handleChange}
            className="bg-transparent text-sm appearance-none outline-none"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <span className="text-sm mx-2">:</span>
          <select
            name="minutes"
            value={time.minutes}
            onChange={handleChange}
            className="bg-transparent text-sm appearance-none outline-none mr-4"
          >
            <option value="00">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
          <select
            name="ampm"
            value={time.ampm}
            onChange={handleChange}
            className="bg-transparent text-sm appearance-none outline-none"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TimeInput;
