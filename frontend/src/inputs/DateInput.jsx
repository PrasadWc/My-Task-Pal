import { useState, useEffect, useRef } from "react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DatePicker({ value, onChange }) {
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [datepickerValue, setDatepickerValue] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [noOfDays, setNoOfDays] = useState([]);
  const [blankDays, setBlankDays] = useState([]);
  const dateInputRef = useRef(null);

  useEffect(() => {
    getNoOfDays();
  }, [month, year]);

  const isToday = (date) => {
    const today = new Date();
    return today.toDateString() === new Date(year, month, date).toDateString();
  };

  const getDateValue = (date) => {
    let selectedDate = new Date(year, month, date);
    let formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    setDatepickerValue(formattedDate);
    onChange(formattedDate); // Send selected date to parent
    setShowDatepicker(false);
  };

  const getNoOfDays = () => {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let dayOfWeek = new Date(year, month).getDay();
    setBlankDays(Array.from({ length: dayOfWeek }, (_, i) => i));
    setNoOfDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  };

  return (
    <div className="relative w-full ">
      <input type="hidden" ref={dateInputRef} />
      <div className="relative">
        <input
          type="text"
          readOnly
          value={datepickerValue}
          onClick={() => setShowDatepicker(!showDatepicker)}
          className="w-full pl-4 pr-10 py-2.5 rounded-sm  focus:outline-none focus:shadow-outline text-gray-600 font-medium border border-gray-300"
          placeholder="Select date"
        />
        <div
          className="absolute top-0 right-0 px-3 py-2 cursor-pointer"
          onClick={() => setShowDatepicker(!showDatepicker)}
        >
          📅
        </div>
      </div>

      {showDatepicker && (
        <div className="bg-white mt-2 rounded-lg shadow p-4 absolute top-12 left-0 w-64 z-10">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-lg font-bold text-gray-800">
                {MONTH_NAMES[month]}
              </span>
              <span className="ml-1 text-lg text-gray-600 font-normal">
                {year}
              </span>
            </div>
            <div>
              <button
                className="p-1 rounded-full hover:bg-gray-200"
                disabled={month === 0}
                onClick={() => setMonth((prev) => Math.max(prev - 1, 0))}
              >
                ◀️
              </button>
              <button
                className="p-1 rounded-full hover:bg-gray-200"
                disabled={month === 11}
                onClick={() => setMonth((prev) => Math.min(prev + 1, 11))}
              >
                ▶️
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((day, index) => (
              <div
                key={index}
                className="text-center text-xs font-medium text-gray-800"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {blankDays.map((_, index) => (
              <div key={index} className="p-1"></div>
            ))}
            {noOfDays.map((date) => (
              <div
                key={date}
                className={`cursor-pointer text-center text-sm leading-none rounded-full p-2 transition ease-in-out duration-100 ${
                  isToday(date)
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-200"
                }`}
                onClick={() => getDateValue(date)}
              >
                {date}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
