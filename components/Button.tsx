import clsx from "clsx";

type Props = {
  variant?: "orange" | "base" | "green" | "red" | "grey" | "blue" | "black";
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const Button = ({
  variant = "base",
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
}: Props) => {
  const classNames = clsx(
    { "text-white bg-shatibi-orange": variant === "base" },
    { "bg-shatibi-orange/[.15] text-shatibi-orange": variant === "orange" },
    { "bg-shatibi-green/[.15] text-shatibi-green": variant === "green" },
    { "bg-shatibi-red/[.15] text-shatibi-red": variant === "red" },
    { "bg-shatibi-grey/[.15] text-shatibi-grey": variant === "grey" },
    { "bg-shatibi-blue/[.15] text-shatibi-blue": variant === "blue" },
    { "border border-black bg-white text-black": variant === "black" },
    "rounded-full p-3 px-7 font-bold flex flex-row place-items-center text-center",
    className
  );
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames}
      disabled={disabled}
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <p className="w-full">{children}</p>
    </button>
  );
};

export default Button;
