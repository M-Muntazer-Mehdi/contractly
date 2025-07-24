import { ContractContext } from "@/context/ContractContext";
import { useContext } from "react";

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};


