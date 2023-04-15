import DebugPrettyJSON from "./DebugPrettyJSON";
import { useState } from "react";
import { Obj } from "types/utility-types";

const DebugPanel = ({ data }: { data: Obj }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <div className="flex flex-col max-w-lg absolute bottom-4 left-4 gap-5 text-xs">
      {open && <DebugPrettyJSON data={data} />}
      <button
        onClick={toggleOpen}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full self-start"
      >
        {open ? "Close" : "Debug"}
      </button>
    </div>
  );
};

export default DebugPanel;
