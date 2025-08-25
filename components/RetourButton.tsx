import { useRouter } from "next/navigation";
import Button from "./Button";

const RetourButton = () => {
  const router = useRouter();

  return (
    <Button
      className="h-8 w-28 text-m"
      onClick={() => router.back()}
      variant="red"
    >
      Retour
    </Button>
  );
};

export default RetourButton;
