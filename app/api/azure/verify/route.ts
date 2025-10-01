import { NextResponse } from "next/server";

export function GET() {
    console.log("Azure verify");
    return NextResponse.json({
        associatedApplications: [
            {
                applicationId: "e7f0e4a8-abbe-4c39-b12a-c5cce1fedc20",
            },
        ],
    });
}
