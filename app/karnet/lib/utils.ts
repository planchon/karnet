import { type ClassValue, clsx } from "clsx";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateId() {
	return nanoid(10);
}

export function slugify(text: string) {
	const slug = text
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^a-z0-9-]/g, "");

	return slug.length > 0 ? slug : "";
}

export function capitalize(text: string) {
	return text.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
