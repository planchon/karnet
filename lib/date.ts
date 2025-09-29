import dayjs, { type Dayjs } from "dayjs";

export type Match = {
    regex: RegExp;
    label: string;
    callback: (input: string) => Dayjs;
    priority: number;
};

export const allPossibleMatches: Record<string, Match> = {
    date: {
        regex: /(^|\s)(\d{1,2}\/\d{2})$/g,
        label: "date",
        callback: (input: string) => {
            const [day, month] = input.split("/");
            const dayInt = Number.parseInt(day, 10);
            const monthInt = Number.parseInt(month, 10);

            return dayjs()
                .month(monthInt - 1)
                .date(dayInt);
        },
        priority: 1000,
    },
    hours: {
        regex: /(^|\s)(\d{1,2}h(\d{1,2})?)$/g,
        label: "hours",
        callback: (input: string) => {
            const [hours, minutes] = input.split("h");
            const hoursInt = Number.parseInt(hours, 10);
            const minutesInt = Number.parseInt(minutes, 10);

            return dayjs().hour(hoursInt).minute(minutesInt);
        },
        priority: 2,
    },
    jours: {
        regex: /(^|\s)(\d{1,2}\s?j)$/g,
        label: "jours",
        callback: (input: string) => {
            const daysInt = Number.parseInt(input, 10);
            return dayjs().add(daysInt, "day");
        },
        priority: 2,
    },
    semaines: {
        regex: /(^|\s)(\d{1,2}\s?sem)$/g,
        label: "semaines",
        callback: (input: string) => {
            const weeksInt = Number.parseInt(input, 10);
            return dayjs().add(weeksInt, "week");
        },
        priority: 2,
    },
    mois: {
        regex: /(^|\s)(\d{1,2}\s?m)$/g,
        label: "mois",
        callback: (input: string) => {
            const monthsInt = Number.parseInt(input, 10);
            return dayjs().add(monthsInt, "month");
        },
        priority: 2,
    },
    dateHours: {
        regex: /(^|\s)(\d{1,2}\/\d{1,2}\s\d{1,2}h(\d{1,2})?)$/g,
        label: "dateHours",
        callback: () => {
            throw new Error("Not implemented");
        },
        priority: 1,
    },
    keyword: {
        regex: /(^|\s)(dem|sem|lun|mar|mer|jeu|ven|sam|dim|mon|tue|wed|thu|fri|sat|sun)$/g,
        callback: (input: string) => {
            if (input === "dem") {
                return dayjs().add(1, "day");
            }

            if (input === "sem") {
                return dayjs().add(1, "week");
            }

            return theNext(dayjs(), DAY_TO_NUMBER[input as keyof typeof DAY_TO_NUMBER]);
        },
        label: "keyword",
        priority: 5,
    },
    finSemaine: {
        regex: /(^|\s)(fin sem)$/g,
        label: "finSemaine",
        callback: () => dayjs().endOf("week"),
        priority: 10,
    },
};
export const DAY_TO_NUMBER = {
    dim: 0,
    sun: 0,
    lun: 1,
    mon: 1,
    mar: 2,
    tue: 2,
    mer: 3,
    wed: 3,
    jeu: 4,
    thu: 4,
    ven: 5,
    fri: 5,
    sam: 6,
    sat: 6,
};

const ONE_WEEK = 7;

/**
 * get the next "mon" "tue" "wed" "thu" "fri" "sat" "sun"
 *
 * @param date - The date to get the next day of the week from
 * @param day - The day of the week to get the next day of
 * @returns The next day of the week
 */
export function theNext(date: Dayjs, day: number) {
    const currentDayOfWeek = date.day(); // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

    let daysToAdd = 0;

    if (currentDayOfWeek < day) {
        daysToAdd = day - currentDayOfWeek;
    } else {
        daysToAdd = (day + ONE_WEEK - currentDayOfWeek) % ONE_WEEK;
        if (currentDayOfWeek === day) {
            daysToAdd = ONE_WEEK;
        } else {
            daysToAdd = (day + ONE_WEEK - currentDayOfWeek) % ONE_WEEK;
        }
    }

    return date.add(daysToAdd, "day");
}
