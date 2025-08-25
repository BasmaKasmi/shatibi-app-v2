import Image from "next/image";
import validate from "@/public/validation.svg";
import Button from "./Button";
import { useRouter } from "next/navigation";

type Student = {
  id: number;
  name: string;
  absent: boolean;
  motive: string | null;
};

interface PassageReviewConfirmationProps {
  onValidate: () => void;
  onCancel: () => void;
}
const PassageReviewConfirmation = ({
  onValidate,
  onCancel,
}: PassageReviewConfirmationProps) => {
  const router = useRouter();

  const redirectToPreviousPage = () => {
    router.back();
  };

  const handleValidate = () => {
    onValidate();
    redirectToPreviousPage();
  };
  return (
    <div className="relative p-2 grid justify-items-center">
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center">
          <Image src={validate} alt="validation icon" width={50} height={50} />
        </div>
      </div>
      <h3 className="text-center text-lg font-semibold text-black my-2">
        vous êtes sur le point de valider votre saisie d’avis de passage
      </h3>
      <div className="text-center"></div>
      <div className="w-full text-center px-4 py-2"></div>
      <div className="flex justify-center gap-6 w-full mt-4">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
          onClick={onCancel}
          variant="red"
        >
          Annuler
        </Button>
        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          onClick={handleValidate}
          variant="green"
        >
          Valider
        </Button>
      </div>
    </div>
  );
};

export default PassageReviewConfirmation;
