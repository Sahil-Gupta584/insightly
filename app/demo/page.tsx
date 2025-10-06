"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import { CommonChart } from "../dashboard/[websiteId]/components/charts/commonChart";
import LocationCharts from "../dashboard/[websiteId]/components/charts/locationCharts";
import MainGraph from "../dashboard/[websiteId]/components/charts/mainGraph";
import SystemCharts from "../dashboard/[websiteId]/components/charts/systemCharts";
import CustomEvents from "../dashboard/[websiteId]/components/customEvents";
import Filters from "../dashboard/[websiteId]/components/filters";

import { GraphLoader, MainGraphLoader } from "@/components/loaders";

function Page() {
  const websiteId = "68d124eb001034bd8493";
  const [duration, setDuration] = useState("last_7_days");

  const mainGraphQuery = useQuery({
    queryKey: ["mainGraph", websiteId, duration],
    queryFn: async () => {
      return (
        await axios("/api/analytics/main", { params: { duration, websiteId } })
      ).data;
    },
    enabled: false,
  });

  const otherGraphQuery = useQuery({
    queryKey: ["otherGraphs", websiteId, duration],
    queryFn: async () => {
      return (
        await axios("/api/analytics/others", {
          params: { duration, websiteId },
        })
      ).data;
    },
    enabled: false,
  });

  const {
    pageData,
    referrerData,
    countryData,
    regionData,
    cityData,
    browserData,
    deviceData,
    osData,
  } = otherGraphQuery.data || {};

  useEffect(() => {
    mainGraphQuery.refetch();
    otherGraphQuery.refetch();
  }, [duration]);

  const totalVisitors = useMemo(() => {
    if (!mainGraphQuery.data?.dataset) return 0;

    return (
      Number(
        mainGraphQuery.data?.dataset?.reduce(
          (prev: any, cur: any) => prev + cur.visitors,
          0
        )
      ) || 0
    );
  }, [mainGraphQuery.data]);
  const goalsQuery = useQuery({
    queryKey: ["goals", websiteId, duration],
    queryFn: async () => {
      return (
        await axios("/api/analytics/goals", {
          params: { duration, websiteId },
        })
      ).data;
    },
    enabled: false,
  });
  return (
    <section className="mb-6">
      <Filters
        duration={duration}
        setDuration={setDuration}
        websiteId={websiteId}
        data={[{ $id: "68c43d86288fed2fe824", domain: "syncmate.xyz" }]}
        isLoading={mainGraphQuery.isFetching || otherGraphQuery.isFetching}
        refetchMain={mainGraphQuery.refetch}
        refetchOthers={otherGraphQuery.refetch}
        refetchGoals={goalsQuery.refetch}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[minmax(459px,auto)] mt-4">
        {mainGraphQuery.isFetching || !mainGraphQuery.data ? (
          <MainGraphLoader />
        ) : (
          <MainGraph
            totalVisitors={totalVisitors}
            chartData={mainGraphQuery.data?.dataset}
            duration={duration}
            avgSessionTime={mainGraphQuery.data?.avgSessionTime}
            bounceRate={mainGraphQuery.data?.bounceRate}
            $id={websiteId}
            domain="syncmate.xyz"
            conversionRate={otherGraphQuery.data?.overallConversionRate}
          />
        )}
        {otherGraphQuery.isFetching || !pageData ? (
          <GraphLoader length={1} />
        ) : (
          <Card className="border border-neutral-200 dark:border-[#373737]">
            <CardHeader>Page</CardHeader>
            <Divider />
            <CommonChart data={pageData} />
          </Card>
        )}

        {otherGraphQuery.isFetching || !referrerData ? (
          <GraphLoader length={1} />
        ) : (
          <Card className="border border-neutral-200 dark:border-[#373737]">
            <CardHeader>Referrer</CardHeader>
            <Divider />
            <CardBody className="p-0">
              <CommonChart data={referrerData} />
            </CardBody>
          </Card>
        )}

        {otherGraphQuery.isFetching ||
        !countryData ||
        !cityData ||
        !regionData ? (
          <GraphLoader length={3} />
        ) : (
          <LocationCharts
            countryData={countryData}
            regionData={regionData}
            cityData={cityData}
          />
        )}
        {otherGraphQuery.isFetching ||
        !browserData ||
        !deviceData ||
        !osData ? (
          <GraphLoader length={3} />
        ) : (
          <SystemCharts
            browserData={browserData}
            deviceData={deviceData}
            osData={osData}
          />
        )}
        {goalsQuery.isFetching || !goalsQuery.data ? (
          <GraphLoader className="md:col-span-2" length={1} />
        ) : (
          <CustomEvents
            goalsData={goalsQuery.data}
            totalVisitors={totalVisitors}
          />
        )}
      </div>
    </section>
  );
}

export default Page;
