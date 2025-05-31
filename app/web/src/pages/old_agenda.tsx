import React from "react";
import {
  Calendar,
  CalendarContent,
  CalendarProvidedEvent
} from "@illostack/react-calendar";
import { CalendarDayView } from "@illostack/react-calendar-day";
import { CalendarMonthView } from "@illostack/react-calendar-month";
import { CalendarRangeView } from "@illostack/react-calendar-range";
import { CalendarWeekView } from "@illostack/react-calendar-week";

const events: CalendarProvidedEvent[] = [
  {
    id: "e0e42853-711a-4be2-8e4f-040338cf690d",
    summary: "aurum tergeo sum",
    startAt: new Date().toISOString(),
    endAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString(),
    color: "green"
  },
  {
    id: "9cb26b3e-922b-4418-9995-910420c8fe4f",
    summary: "teneo candidus copia",
    startAt: "2025-03-09T22:07:39.346Z",
    endAt: "2025-03-10T00:07:39.346Z",
    color: "indigo"
  },
  {
    id: "e608bd41-8d9d-43ad-a3ab-b0404a0574c0",
    summary: "quia substantia celer",
    startAt: "2025-03-08T09:36:09.221Z",
    endAt: "2025-03-08T11:06:09.221Z",
    color: "red"
  },
  {
    id: "8485fdda-d481-4139-8e0f-3b06ad5679a1",
    summary: "vindico claudeo sono",
    startAt: "2025-02-27T13:24:13.935Z",
    endAt: "2025-02-27T14:54:13.935Z",
    color: "blue"
  },
  {
    id: "dac4fc04-bb7f-452e-a5a4-42de0f8943dd",
    summary: "balbus at molestias",
    startAt: "2025-03-15T11:45:01.249Z",
    endAt: "2025-03-15T13:15:01.249Z",
    color: "cyan"
  },
  {
    id: "b25efd4e-850c-4212-a5ab-332da132c8c7",
    summary: "callide teres pecus",
    startAt: "2025-03-12T12:00:45.417Z",
    endAt: "2025-03-12T13:30:45.417Z",
    color: "blue"
  },
  {
    id: "cf021abf-cf96-4c42-9949-28f3e8cf95ff",
    summary: "cur asper perspiciatis",
    startAt: "2025-02-26T19:22:19.586Z",
    endAt: "2025-02-26T20:22:19.586Z",
    color: "purple"
  },
  {
    id: "27f81ce4-65f7-4fe4-9b9f-b4d77e90aade",
    summary: "vitiosus surgo conscendo",
    startAt: "2025-03-16T12:41:04.340Z",
    endAt: "2025-03-16T13:26:04.340Z",
    color: "cyan"
  },
  {
    id: "c765e831-20a8-4c60-8e35-f73fc95d5ccf",
    summary: "adfectus veritatis adinventitias",
    startAt: "2025-03-02T18:00:53.602Z",
    endAt: "2025-03-02T20:00:53.602Z",
    color: "green"
  },
  {
    id: "b005a392-5b92-4cdc-a612-da2eacb97954",
    summary: "deprecator arcesso defluo",
    startAt: "2025-03-14T16:38:08.742Z",
    endAt: "2025-03-14T18:23:08.742Z",
    color: "pink"
  }
];

export const AgendaPage = () => {
  const views = React.useMemo(
    () => [
      CalendarDayView,
      CalendarWeekView,
      CalendarRangeView.configure({ days: 1 }),
      CalendarMonthView
    ],
    []
  );

  return (
    <Calendar
      views={views}
      initialView="week"
      events={events}
      minutesPerRow={15}
      rowHeight={24}
      startHour={0}
      endHour={23}
      translations={{
        calendar: {
          days: {
            0: "Sun",
            1: "Mon",
            2: "Tue",
            3: "Wed",
            4: "Thu",
            5: "Fri",
            6: "Sat"
          },
          months: {
            0: "Jan",
            1: "Feb",
            2: "Mar",
            3: "Apr",
            4: "May",
            5: "Jun",
            6: "Jul",
            7: "Aug",
            8: "Sep",
            9: "Oct",
            10: "Nov",
            11: "Dec"
          }
        },
        literals: {
          day: "Day",
          days: "Days",
          week: "Week",
          month: "Month",
          year: "Year",
          today: "Today",
          previous: "Previous",
          next: "Next",
          range: "Range",
          more: "More",
          "go-to": "Go to"
        },
        form: {
          save: "Save"
        },
        action: {
          "create-event": "Create Event",
          "update-event": "Update Event",
          "delete-event": "Delete Event",
          "duplicate-event": "Duplicate Event",
          "copy-event": "Copy Event",
          "cut-event": "Cut Event",
          "paste-event": "Paste Event",
          undo: "Undo"
        },
        message: {
          "event-created": "Event Created",
          "event-updated": "Event Updated",
          "event-deleted": "Event Deleted",
          "event-restored": "Event Restored",
          "event-duplicated": "Event Duplicated",
          "event-copied": "Event Copied",
          "event-cutted": "Event Cutted",
          "event-pasted": "Event Pasted",
          "event-not-found": "Event Not Found"
        }
      }}
      toasterTheme={"light"}
    >
      <CalendarContent />
    </Calendar>
  );
};
