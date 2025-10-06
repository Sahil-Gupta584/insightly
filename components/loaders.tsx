import { Card, CardBody, CardHeader, Divider, Skeleton } from "@heroui/react";

export function GraphLoader({
  length,
  className,
}: {
  length: number;
  className?: string;
}) {
  return (
    <Card
      className={`border border-neutral-200 dark:border-[#373737] ${className}`}
    >
      <CardHeader className="gap-2">
        {Array.from({ length }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-12 rounded-md" />
        ))}
      </CardHeader>
      <Divider />
      <CardBody className="flex justify-center items-center">
        <Skeleton className="h-72 w-full rounded-lg grow" />
      </CardBody>
    </Card>
  );
}

export function MainGraphLoader() {
  return (
    <Card className=" border border-neutral-200 dark:border-[#373737] md:col-span-2">
      <CardHeader className="h-24">
        <div className="grid grid-cols-3 md:grid-cols-6 items-center w-full h-full gap-4">
          {Array.from({ length: 5 }).map((d, i) => (
            <Skeleton key={i} className="grow rounded-lg w-full h-full" />
          ))}
        </div>
      </CardHeader>
      <CardBody className="h-96">
        <Skeleton className="grow rounded-lg" />
      </CardBody>
    </Card>
  );
}
