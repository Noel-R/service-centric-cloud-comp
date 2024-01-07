
import { NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
    const data = await req.json();
    const url = new URL(process.env.BACKEND!);
    const nextRes = await fetch(url + "user/create", {method: "POST", body: JSON.stringify({email: data.email, password: data.password, name: data.name}), headers: {"Content-Type": "application/json"}})
        .then(res => res.json());
    return Response.json(nextRes)
}