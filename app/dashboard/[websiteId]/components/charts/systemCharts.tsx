"use client";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";

import { CommonChart, CommonChartProps } from "./commonChart";
import { classNames } from "./locationCharts";

interface SystemChartProps {
  browserData: CommonChartProps["data"];
  osData: CommonChartProps["data"];
  deviceData: CommonChartProps["data"];
}

export default function SystemCharts({
  browserData,
  deviceData,
  osData,
}: SystemChartProps) {
  return (
    <Card>
      <CardBody className="h-80 p-0">
        <Tabs aria-label="systemCharts" classNames={classNames}>
          <Tab key="browser" title={<span>Browser</span>}>
            <CommonChart data={browserData} />
          </Tab>
          <Tab key="OS" title="OS">
            <CommonChart data={osData} />
          </Tab>
          <Tab key="Device" title="Device">
            <CommonChart data={deviceData} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
