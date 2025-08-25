"use client";

import React from "react";
import Button from "@/components/Button";

interface FinishButtonProps {
  onClick?: () => void;
}

const FinishButton = ({ onClick }: FinishButtonProps): JSX.Element => {
  return (
    <Button variant="red" onClick={onClick} className="py-1 px-4 font-bold">
      Fin
    </Button>
  );
};

export default FinishButton;
