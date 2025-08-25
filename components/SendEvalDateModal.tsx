import { Modal } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import Image from "next/image";
import Button from "@/components/Button";
import CustomDateInput from "@/components/CustomDateInput/CustomDateInput";
import validate from "@/public/validation.svg";
import { Dispatch, SetStateAction } from "react";

interface SendEvalDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SendEvalDateModal = ({
  isOpen,
  onClose,
  date,
  setDate,
  onConfirm,
}: SendEvalDateModalProps) => {
  return (
    <Modal
      centered
      opened={isOpen}
      withCloseButton={false}
      radius="lg"
      onClose={onClose}
    >
      <div className="select-none">
        <div className="flex justify-center items-center my-4">
          <Image src={validate} alt="validation icon" width={50} height={50} />
        </div>
        <h2 className="text-center text-lg font-semibold text-black mb-8 mx-4">
          Envoyer les notes et appréciation aux étudiants
        </h2>
        <div className="flex justify-evenly items-center font-semibold min-h-[50px] h-12">
          <CustomDateInput date={date} setDate={setDate} />
          <p className="h-full flex items-center">à</p>
          <div
            className="border border-gray-300 rounded-lg flex items-center"
            style={{ height: "95%", padding: "0 10px" }}
          >
            <TimeInput
              variant="unstyled"
              value={`${String(date.getHours()).padStart(2, "0")}:${String(
                date.getMinutes()
              ).padStart(2, "0")}`}
              onChange={(event) => {
                const [hours, minutes] = event.target.value
                  .split(":")
                  .map(Number);
                const updatedDate = new Date(date);
                updatedDate.setHours(hours, minutes, 0, 0);
                if (
                  updatedDate.toString() === "Invalid Date" ||
                  updatedDate < new Date()
                ) {
                  return;
                }
                setDate(updatedDate);
              }}
            />
          </div>
        </div>

        <div className="flex gap-2 items-center justify-center">
          <div className="flex justify-center items-center gap-6 w-full mt-4">
            <Button
              className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
              variant="red"
              onClick={onClose}
            >
              Retour
            </Button>
            <Button
              className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
              variant="green"
              onClick={onConfirm}
            >
              Valider
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SendEvalDateModal;
