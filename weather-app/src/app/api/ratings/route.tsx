import { NextApiResponse } from "next";


export async function GET(req: Request, res: NextApiResponse) {
    const params = new URL(req.url).searchParams;

    if (params.has("comments")) {
        const user = params.get("user");

        const nextRes = await fetch(`${process.env.BACKEND}/rating/comments/` + user, {method: "GET", headers: {"Content-Type": "application/json"}})
            .then(res => res.json());

        if (nextRes.error) {
            return Response.json({status: "error", message: nextRes.error});
        }

        switch (nextRes.message) {
            case "Comments found.":
                
                return Response.json({status: "ok", comments: nextRes.comments});
            default:
                return Response.json({status: "error", message: nextRes.error});
        }
    }

    if (params.has("all")) {
        const user = params.get("user");
        const nextRes = await fetch(`${process.env.BACKEND}/rating/all/` + user, {method: "GET", headers: {"Content-Type": "application/json"}})
            .then(res => res.json());

        if (nextRes.error) {
            return Response.json({status: "error", message: nextRes.error});
        }

        switch (nextRes.message) {
            case "Favourites found.":
                return Response.json({status: "ok", ratings: nextRes.favourites});
            default:
                return Response.json({status: "error", message: nextRes.error});
        }
    }


    if (params.has("saved")) {
        const user = params.get("user");
        const trip = params.get("trip");

        const nextRes = await fetch(`${process.env.BACKEND}/rating/saved/` + trip + '/' + user, {method: "GET", headers: {"Content-Type": "application/json"}})
            .then(res => res.json());

        switch (nextRes.message) {
            case "error":
                return Response.json({status: "error", message: nextRes.error});
            case "Trip saved.":
                return Response.json({status: "saved"});
            case "Trip not saved.":
                return Response.json({status: "not saved"});
            default:
                return Response.json({status: "error"});
        }
    }

    if (params.has("save")) {
        const trip = params.get("trip");
        const user = params.get("user");
        
        if (!trip || !user) {
            return Response.json({status: "error", message: "missing parameters"});
        }

        const nextRes = await fetch(`${process.env.BACKEND}/rating/save`, {method: "PATCH", headers: {"Content-Type": "application/json"}, body: JSON.stringify({tripId: trip, userId: user})})
            .then(res => res.json());

        if (nextRes.error) {
            return Response.json({status: "error", message: nextRes.error});
        }

        switch (nextRes.message) {
            case "Trip saved.":
                return Response.json({status: "ok"});
            default:
                return Response.json({status: "error", message: "unknown error"});
        }
    }

    if (params.has("delete")) {
        const trip = params.get("trip");
        const user = params.get("user");
        
        if (!trip || !user) {
            return Response.json({status: "error", message: "missing parameters"});
        }

        const nextRes = await fetch(`${process.env.BACKEND}/rating/unsave`, {method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify({tripId: trip, userId: user})})
            .then(res => res.json());

        if (nextRes.error) {
            return Response.json({status: "error", message: nextRes.error});
        }

        switch (nextRes.message) {
            case "Favourite removed.":
                return Response.json({status: "ok"});
            default:
                return Response.json({status: "error", message: "unknown error"});
        }
    }

    if (params.has("trip")) {
        const trip = params.get("trip");
        const nextRes = await fetch(`${process.env.BACKEND}/rating/${trip}`, {method: "GET", headers: {"Content-Type": "application/json"}})
            .then(res => res.json());

        return Response.json({status: "ok", ratings: nextRes})
    }
    return Response.json({status: "error"});
}

export async function POST(req: Request, res: NextApiResponse) {
    const body = await req.json();
    const params = new URL(req.url).searchParams;

    if (params.has("trip")) {
        const trip = params.get("trip");
        const nextRes = await fetch(`${process.env.BACKEND}/rating/create`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...body, trip: trip})})
            .then(res => res.json());

        return Response.json({status: "ok", rating: nextRes})
    }

    return Response.json({status: "error"});
}