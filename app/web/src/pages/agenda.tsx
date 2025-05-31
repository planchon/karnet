import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  DayHeaderContentArg,
  EventContentArg,
  SlotLabelContentArg
} from "@fullcalendar/core/index.js";
import { cn } from "@/lib/utils";

export const AgendaPage = () => {
  const [events, setEvents] = useState([
    {
      title: "Sample Event",
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 2))
    }
  ]);

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt("Please enter a title for your event");
    if (title) {
      setEvents([
        ...events,
        {
          title,
          start: selectInfo.start,
          end: selectInfo.end
        }
      ]);
    }
  };

  return (
    <div className="calendar-container h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={false}
        initialView="timeGridWeek"
        slotDuration="00:30:00"
        editable={true}
        scrollTime="08:00:00"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        allDaySlot={false}
        weekends={true}
        events={events}
        firstDay={1}
        select={handleDateSelect}
        height="100%"
        themeSystem="standard"
        eventBackgroundColor="transparent"
        eventBorderColor="transparent"
        eventContent={(arg) => {
          return <Event arg={arg} />;
        }}
        dayHeaderContent={(arg) => {
          return <DayHeader arg={arg} />;
        }}
        slotLabelContent={(arg) => {
          return <SlotLabel arg={arg} />;
        }}
        nowIndicator={true}
        dayHeaderFormat={{
          weekday: "short",
          day: "numeric"
        }}
      />
    </div>
  );
};

const Event = ({ arg }: { arg: EventContentArg }) => {
  return (
    <div className="flex h-full justify-end">
      <div className="contents">
        <div
          className="group/event-item relative min-w-full cursor-pointer rounded border border-gray-200 bg-gray-50 before:absolute before:-inset-px before:block before:w-1 before:rounded-l before:bg-blue-500"
          role="button"
          style={{ height: "100%" }}
        >
          <div className="grid grid-cols-[auto_1fr] items-start gap-2 overflow-hidden py-0.5 pl-2 pr-1 text-xs leading-4 text-gray-700">
            <div className="pt-0.5">
              {arg.event.title && (
                <button
                  className="group"
                  aria-label="Complete task"
                  aria-expanded="false"
                  aria-haspopup="dialog"
                >
                  <div className="group-hover:flex">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-flex shrink-0 text-gray-500"
                    >
                      <circle cx="9" cy="9" r="8" fill="#30A66D" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.4826 5.87087C12.7611 6.1029 12.7987 6.51671 12.5666 6.79514L8.52774 11.6418C8.09047 12.1666 7.28454 12.1666 6.84726 11.6418L4.99586 9.42014C4.76383 9.14171 4.80145 8.7279 5.07988 8.49587C5.35831 8.26384 5.77212 8.30146 6.00415 8.5799L7.6875 10.5999L11.5584 5.9549C11.7904 5.67646 12.2042 5.63884 12.4826 5.87087Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </button>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <div data-line-count="6">
                <div className="line-clamp-6 break-words font-medium">
                  <div
                    className="float-right ml-auto inline-flex max-w-[calc(100%-4px)] flex-row items-center gap-0.5 px-0.5 py-0.5 pt-1"
                    data-state="closed"
                  >
                    <svg
                      data-icon="exclamation-circle-solid"
                      width="24"
                      height="24"
                      className="h-2.5 w-2.5 shrink-0 text-red-500"
                    >
                      <use xlinkHref="/20250530_1734_b28e53d7/images/__spritemap_37515358.svg#exclamation-circle-solid" />
                    </svg>
                  </div>
                  <span
                    className="overflow-hidden text-ellipsis"
                    data-state="closed"
                  >
                    {arg.event.title}
                  </span>
                </div>
              </div>
              <span className="truncate text-[9px] font-thin leading-none">
                {arg.event.start?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
                -
                {arg.event.end?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SlotLabel = ({ arg }: { arg: SlotLabelContentArg }) => {
  return (
    <div className="w-18">
      <span className="text-xs font-medium text-slate-500">{arg.text}</span>
    </div>
  );
};

const DayHeader = ({ arg }: { arg: DayHeaderContentArg }) => {
  return (
    <div className="py-2">
      <span
        className={cn(
          "text-sm font-medium text-slate-700",
          arg.isToday && "font-semibold"
        )}
      >
        {arg.text}
      </span>
    </div>
  );
};
