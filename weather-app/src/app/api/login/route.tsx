import React from "react";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
    const data = await req.json();
    const url = new URL(process.env.BACKEND!);
    const nextRes = await fetch( url + "/user/login", {method: "POST", body: JSON.stringify({email: data.email, password: data.password}), headers: {"Content-Type": "application/json"}})
        .then(res => res.json());
    return Response.json(nextRes)
}