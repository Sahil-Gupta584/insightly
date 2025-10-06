import { Button } from "@heroui/react";
import Link from "next/link";
import { IoIosArrowRoundUp } from "react-icons/io";

import { TClassName } from "@/lib/types";

const BackBtn = ({
  text,
  pathname,
  className,
}: {
  text: string;
  pathname: string;
  className?: TClassName;
}) => {
  return (
    <Button
      className={`self-start mb-5 ${className}`}
      variant="ghost"
      startContent={<IoIosArrowRoundUp className="-rotate-90 size-6" />}
      as={Link}
      href={pathname}
    >
      {text}
    </Button>
  );
};

export default BackBtn;
