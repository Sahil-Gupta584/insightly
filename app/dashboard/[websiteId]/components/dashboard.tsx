"use client";
import { Card, CardHeader, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CommonChart } from "./charts/commonChart";
import LocationCharts from "./charts/locationCharts";
import MainGraph from "./charts/mainGraph";
import SystemCharts from "./charts/systemCharts";
import CustomEvents from "./customEvents";
import Filters from "./filters";
import WaitForFirstEvent from "./WaitForFirstEvent";

import { account } from "@/appwrite/clientConfig";
import { GraphLoader, MainGraphLoader } from "@/components/loaders";
import { TWebsite } from "@/lib/types";

export default function Dashboard() {
  const { websiteId } = useParams<{ websiteId: string }>();
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

  const getWebsitesQuery = useQuery({
    queryKey: ["getWebsites"],
    queryFn: async () => {
      const user = await account.get();
      const res = await axios("/api/website", {
        params: { userId: user.$id },
      });

      return res.data?.websites as TWebsite[];
    },
    enabled: false,
  });

  const currentWebsite = useMemo(() => {
    return getWebsitesQuery.data
      ? getWebsitesQuery.data.find((w) => w?.$id === websiteId)
      : null;
  }, [getWebsitesQuery.data]);

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

  useEffect(() => {
    mainGraphQuery.refetch();
    otherGraphQuery.refetch();
    getWebsitesQuery.refetch();
    goalsQuery.refetch();
  }, [duration]);

  return (
    <section className="mb-12">
      {mainGraphQuery.data && mainGraphQuery.data?.isEmpty && (
        <WaitForFirstEvent
          websiteId={websiteId}
          currentWebsite={currentWebsite}
        />
      )}
      {getWebsitesQuery.data && (
        <Filters
          duration={duration}
          setDuration={setDuration}
          websiteId={websiteId}
          data={getWebsitesQuery.data}
          isLoading={
            getWebsitesQuery.isFetching ||
            mainGraphQuery.isFetching ||
            otherGraphQuery.isFetching
          }
          refetchMain={mainGraphQuery.refetch}
          refetchOthers={otherGraphQuery.refetch}
          refetchGoals={goalsQuery.refetch}
        />
      )}

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
            domain={currentWebsite?.domain as string}
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
            <CommonChart data={referrerData} />
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
