import type { Dayjs } from "dayjs";

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
