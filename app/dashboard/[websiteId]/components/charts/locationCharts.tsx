"use client";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { useTheme } from "next-themes";

import CommonTooltip from "../commonTooltip";

import { CommonChart, CommonChartProps } from "./commonChart";

import { getCountryName } from "@/lib/utils/client";

const geoUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface LocationChartProps {
  countryData: (CommonChartProps["data"][0] & { countryCode: string })[];
  regionData: CommonChartProps["data"];
  cityData: CommonChartProps["data"];
}

export const classNames = {
  tabList: "bg-transparent p-3",
  tabContent:
    "group-data-[selected=true]:text-neutral-900 dark:group-data-[selected=true]:text-white",
  cursor: "bg-transparent",
  panel: "p-0 h-full overflow-x-hidden",
  base: "border-b-[1px] rounded-none w-full border-b-neutral-200 dark:border-b-[#ffffff26]",
};

export default function LocationCharts({
  cityData,
  countryData,
  regionData,
}: LocationChartProps) {
  const { resolvedTheme } = useTheme();

  // 🎨 Define theme-based colors
  const colors = {
    dark: {
      base: "#1d1d21",
      stroke: "#4A5568",
      hoverStroke: "#EC4899",
      high: "#fd366e",
      medium: "#fd366eb3",
      low: "#fd366e38",
    },
    light: {
      base: "#e5e7eb", // light gray
      stroke: "#d1d5db", // lighter border
      hoverStroke: "#ec4899", // pink still pops in light
      high: "#db2777",
      medium: "#db2777b3",
      low: "#db277738",
    },
  };

  const themeColors = resolvedTheme === "light" ? colors.light : colors.dark;

  const getCountryDetails = (countryCode: string) => {
    const country = countryData.find((c) => c.countryCode == countryCode);
    let color = themeColors.base;

    if (country) {
      const maxVisitors = Math.max(...countryData.map((c) => c.visitors));
      const intensity = country.visitors / maxVisitors;

      if (intensity > 0.7) color = themeColors.high;
      else if (intensity > 0.4) color = themeColors.medium;
      else if (intensity > 0.1) color = themeColors.low;
    }

    return {
      color,
      ...country,
    };
  };

  return (
    <Card>
      <CardBody className="h-80 overflow-hidden p-0">
        <Tabs aria-label="Options" classNames={classNames}>
          <Tab key="map" title={<span>Map</span>}>
            <ComposableMap
              projection="geoMercator"
              width={800}
              height={400}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryCode = geo.properties["ISO3166-1-Alpha-2"];
                    const countryDetails = getCountryDetails(countryCode);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={countryDetails.color}
                        stroke={themeColors.stroke}
                        strokeWidth={0.5}
                        style={{
                          default: {
                            fill: countryDetails.color,
                            stroke: themeColors.stroke,
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            stroke: themeColors.hoverStroke,
                            strokeWidth: 1,
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: themeColors.hoverStroke,
                            stroke: themeColors.hoverStroke,
                            strokeWidth: 1,
                            outline: "none",
                          },
                        }}
                        data-tooltip-id="map-tooltip"
                        data-tooltip-content={JSON.stringify({
                          countryCode,
                          ...countryDetails,
                        })}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            <Tooltip
              id="map-tooltip"
              place="bottom-end"
              style={{
                padding: 0,
                background: "transparent",
              }}
              render={({ content }) => {
                let parsed: any;
                try {
                  parsed = JSON.parse(content as string);
                } catch {
                  return null;
                }

                return (
                  <CommonTooltip
                    data={parsed}
                    label={getCountryName(parsed?.countryCode)}
                  />
                );
              }}
            />
          </Tab>

          <Tab key="country" title="Country">
            <CommonChart data={countryData} />
          </Tab>
          <Tab key="Region" title="Region">
            <CommonChart data={regionData} />
          </Tab>
          <Tab key="City" title="City">
            <CommonChart data={cityData} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
