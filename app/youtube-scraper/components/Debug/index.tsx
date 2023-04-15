import { PropsWithChildren, memo } from "react";
import DebugPanel from "./DebugPanel";
import { useDebugContext } from "hooks/contexts/debug";

const Debug = ({ path, data }: PropsWithChildren<{ path: string; data: unknown }>) => {
  const { debugData } = useDebugContext(path, data);
  return <DebugPanel data={debugData} />;
};

export default memo(Debug);
