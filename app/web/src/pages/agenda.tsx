import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

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
        editable={true}
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
        nowIndicator={true}
        dayHeaderFormat={{
          weekday: "short",
          day: "numeric"
        }}
      />
    </div>
  );
};
