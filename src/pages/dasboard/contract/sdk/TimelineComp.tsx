/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { Typography, Divider } from "@mui/material";
import { ContractContext } from "@/context/ContractContext";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import { getList } from "@/service/api/clauses";

const TimelineComp = () => {
  const { auditTrails } = useContext(ContractContext);

  const [isLoading, setIsLoading] = useState(false);
  const [List, setlist] = useState<any[]>([]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getList();
      console.log(data);
      setlist(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listData();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Utility function to format the time as "Hour:Minute AM/PM"
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // @ts-ignore
  const sortedAuditTrails = auditTrails?.sort(
    // @ts-ignore
    (a: any, b: any) => new Date(b.date) - new Date(a.date)
  );

  // Separate "today" and "other" items
  const todayItems = sortedAuditTrails?.filter((item: any) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate.getTime() === today.getTime();
  });


  const otherItems = sortedAuditTrails?.filter((item: any) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate.getTime() !== today.getTime();
  });

  return (
    <div style={{ textAlign: "left" ,background:"#fefefe",height:"100vh"}}>
      <Typography variant="subtitle1" color="black">
        Timeline
      </Typography>
      <Divider sx={{ mt: 0.1, mb: 1, pl: -1, background: "#174B8B" }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {isLoading ? (
          <Typography>Loading timeline...</Typography>
        ) : auditTrails?.length > 0 ? (
          <Timeline style={{ padding: 0, width: "" }}>
            {todayItems.length > 0 && (
              <TimelineItem style={{ minHeight: 0 }}>
                <TimelineSeparator>
                  <TimelineDot color="success"/>
                  {todayItems.length > 0 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent style={{ width: "" }}>
                  <Typography variant="h6" component="h1">
                    Today
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            )}
            {todayItems.map((item, index) => (
              <TimelineItem key={item._id}>
                <TimelineSeparator>
                  {index < todayItems.length && (
                    <TimelineConnector style={{ margin: "0 4px" }} />
                  )}
                </TimelineSeparator>
                <TimelineContent style={{fontSize:11,color:"#B1B1B1"}}>
                  <h6 style={{fontSize:14}}>{formatTime(item.date)}</h6>
                  <Typography
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      width: "100%",
                      fontSize:14
                    }}
                  >
                    {" "}
                    <b style={{fontWeight:"",color:"#000000"}}>{item.user}</b> <span style={{color:"#656565"}}>{item.message || "No Description"}</span>
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}

            {otherItems.length > 0 && (
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  {otherItems.length > 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent style={{ width: "" }}>
                  <Typography variant="h6" component="h1">
                    {formatDate(new Date(otherItems[0].date))}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            )}
            {otherItems.map((item, index) => (
              <TimelineItem key={item._id}>
                <TimelineSeparator>
                  <TimelineDot />
                  {index < otherItems.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent style={{ width: "" }}>
                  {index === 0 ||
                  formatDate(new Date(otherItems[index - 1].date)) !==
                    formatDate(new Date(item.date)) ? (
                    <Typography variant="h6" component="h1">
                      {formatDate(new Date(item.date))}
                    </Typography>
                  ) : null}
                  <Typography
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      width: "100%",
                    }}
                  >
                    {item.message || "No Description"} at{" "}
                    {formatTime(new Date(item.date))}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <Typography>No timeline data available.</Typography>
        )}
      </div>
    </div>
  );
};

export default TimelineComp;
