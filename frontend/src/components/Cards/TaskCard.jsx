import React from "react";
import { MdCreate, MdDelete, MdCheckCircleOutline } from "react-icons/md";

const TaskCard = ({
  title,
  content,
  date,
  time,
  isComplete,
  createdOn,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border border-gray-300 rounded-2xl p-4 bg-white hover:shadow-xl transition-all ease-in-out flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <h6 className="text-2xl font-medium ">{title}</h6>
        <MdCheckCircleOutline
          className={`size-6.5 ${
            isComplete ? "text-green-500" : "text-slate-400"
          }`}
        />
      </div>

      <p className="text-sm text-slate-700 mt-1">{content}</p>
      <span className="text-sm text-slate-500">
        {date} - {time}
      </span>

      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-slate-500">Created on:{createdOn}</div>
        <div className="flex items-center gap-2">
          <MdCreate
            className="size-5 text-gray-600 hover:text-green-500 cursor-pointer"
            onClick={onEdit}
          />
          <MdDelete
            className="size-5 text-gray-600 hover:text-red-500 cursor-pointer"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
