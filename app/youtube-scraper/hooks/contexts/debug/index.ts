import { Obj } from "types/utility-types";
import { createContext, useState, useContext, useCallback, useEffect } from "react";

type DebugContextState = {
  debugData: Obj;
  updateDebugData: (newDebugData: Obj) => void;
};

const DebugContextDefaultState = {
  debugData: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateDebugData: () => {},
};

const DebugContext = createContext<DebugContextState>(DebugContextDefaultState);

export function useDebugContextState(): DebugContextState {
  const [debugData, setDebugData] = useState<DebugContextState["debugData"]>(DebugContextDefaultState.debugData);

  const updateDebugData = useCallback((newDebugData: Obj) => {
    setDebugData((prev) => {
      const newData = { ...prev, ...newDebugData };
      console.log("updateDebugData", { prev, newData, delta: newDebugData });
      return newData;
    });
  }, []);

  return {
    debugData,
    updateDebugData,
  };
}

export function useDebugContext(key: string, data?: unknown) {
  const debugContext = useContext(DebugContext);
  const { updateDebugData } = debugContext;
  console.log({ data });
  useEffect(() => {
    updateDebugData({
      [key]:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof data == "object" && (data as any)?._superjson ? { ...data, _superjson: "Removed by debugger" } : data,
    });
  }, [updateDebugData, data, key]);
  return debugContext;
}

export default DebugContext;
