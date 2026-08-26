import type { ReactNode } from "react";

export const ErrorMessage = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-center my-4 bg-red-600 text-white font-bold uppercase p-3 text-sm">
      {children}
    </p>
  );
};
