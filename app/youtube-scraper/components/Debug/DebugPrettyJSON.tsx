import { Obj } from "types/utility-types";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const DebugPrettyJSON = ({ data }: { data: Obj | unknown[] }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <div className="flex flex-col max-w-lg gap-5 max-h-96">
     

      {open && (
        <>
          <div className="border-red-800 border rounded-md overflow-scroll p-5 hide-scroll backdrop-blur-sm bg-teal-950/50">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </>
      )}
        <button
          onClick={toggleOpen}
          className="bg-teal-800 hover:bg-teal-900 text-white font-bold py-1 px-2 rounded-full self-start"
        >
          {open && "X "} Data
        </button>
    </div>
  );
};

export default DebugPrettyJSON;
