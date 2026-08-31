import type { ReactNode } from "react";

type AlertMessageProps = {
  children: ReactNode;
};
export const AlertMessage = ({ children }: AlertMessageProps) => {
  return <div className="text-center mb-2 uppercase font-bold">{children}</div>;
};
