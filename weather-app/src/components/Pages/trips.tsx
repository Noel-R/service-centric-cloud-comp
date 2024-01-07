"use client";
import { siteContext } from "@/app/page";
import React, { use, useEffect } from "react";
import Loading from "../loading";
import Trip from "../Trips/trip";

const Trips = () => {
    const [ mounted, setMounted ] = React.useState(false);
    const { userContext, pageContext } = React.useContext(siteContext);
    const [ trips, setTrips ] = React.useState<string[]>([]);

    useEffect(() => {
        fetch(`/api/trips`).then((res) => res.json()).then((data) => {
            setTrips(() => [...data]);
        });
        setMounted(true);
    }, []);

    return mounted ? (
        <div className="hero min-h-[500px] max-h-[1080px] h-auto rounded-2xl w-full shadow-2xl" style={{backgroundImage: 'url(https://www.celebritycruises.com/blog/content/uploads/2022/03/most-beautiful-places-in-australia-the-great-ocean-roads-12-apostles-hero.jpg)'}}>
            <div className="hero-overlay bg-opacity-10 rounded-2xl"></div>
            <div className=" flex flex-row justify-around flex-wrap w-full m-10 rounded-2xl">
                {trips.map((trip: string, index: number) => {
                    return <Trip key={trip} uuid={trip} />
                })}
            </div>
        </div>
    ) : <Loading />;
};


export default Trips;