import { NextApiResponse } from "next";

export async function GET(req: Request, res: NextApiResponse) {
    const params = new URL(req.url).searchParams;

    if (params.has("photos")) {
        const lat = params.get("lat");
        const lng = params.get("lng");
        const nextRes = await fetch(`${process.env.BACKEND}/trip/photo/${lat}/${lng}`, {method: "GET", headers: {"Content-Type": "application/json"}})
            .then(res => res.json());
        return Response.json(nextRes)
    }

    if (params.has("uuid")) {
        const uuid = params.get("uuid");
        const nextRes = await fetch(`${process.env.BACKEND}/trip/get/${uuid}`, {method: "GET", headers: {"Content-Type": "application/json"}})
            .then(res => res.json());
        return Response.json(nextRes)
    }
}

export async function PATCH(req: Request, res: NextApiResponse) {
    const params = new URL(req.url).searchParams;

    if (params.has("uuid")) {
        const uuid = params.get("uuid");
        const body = await req.json();

        const nextRes = await fetch(`${process.env.BACKEND}/trip/update`, {method: "PATCH", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)})
            .then(res => res.json());
        switch (nextRes.message) {
            case "error":
                return Response.json({status: "error"});
            case "ok":
                return Response.json({status: "ok", trip: nextRes.trip});
        }
    }
    
    return Response.json({status: "error"});
}

export async function DELETE(req: Request, res: NextApiResponse) {
    const params = new URL(req.url).searchParams;

    if (params.has("uuid")) {
        const uuid = params.get("uuid");
        const nextRes = await fetch(`${process.env.BACKEND}/trip/delete/${uuid}`, {method: "DELETE", headers: {"Content-Type": "application/json"}})
            .then(res => res.json());
        switch (nextRes.message) {
            case "error":
                return Response.json({status: "error"});
            case "ok":
                return Response.json({status: "ok"});
        }
    }
    
    return Response.json({status: "error"});
}

export async function POST(req: Request, res: NextApiResponse) {
    const params = new URL(req.url).searchParams;
    const body = await req.json();

    if (!params.has("user")) {
        return Response.json({status: "error"});
    }

    const newTrip = {
        user: params.get("user"),
        tripName: body.name,
        comment: body.description,
        location: body.location.name,
        startDate: new Date(body.startDate).valueOf(),
        endDate: new Date(body.endDate).valueOf()
    }

    const nextRes = await fetch(`${process.env.BACKEND}/trip/create`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(newTrip)})
        .then(res => res.json());

    switch (nextRes.message) {
        case "error":
            return Response.json({status: "error"});
        case "ok":
            return Response.json({status: "ok", trip: nextRes.trip});
        default:
            return Response.json({status: "error"});
    };
}