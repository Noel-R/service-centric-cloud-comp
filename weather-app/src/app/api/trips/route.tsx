import React from "react";
import { NextApiResponse } from "next";
import { TripEntity } from "@/components/Trips/trip";

export async function GET(req: Request, res: NextApiResponse) {

    const params = new URL(req.url).searchParams;

    if (params.has("user")) {
        const user = params.get("user");
        const nextRes = await fetch(`${process.env.BACKEND}/trip/all/${user}`, {method: "GET", headers: {"Content-Type": "application/json"}})
            .then(res => res.json());
        const trips = nextRes.map((trip: TripEntity) => { return trip.uuid; });
        return Response.json(trips)
    }

    const nextRes = await fetch(`${process.env.BACKEND}/trip/all`, {method: "GET", headers: {"Content-Type": "application/json"}})
        .then(res => res.json());
    const trips = nextRes.map((trip: TripEntity) => { return trip.uuid; });
    return Response.json(trips)
}