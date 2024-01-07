"use client";

import { siteContext } from "@/app/page";
import React, { use, useContext, useEffect, useState } from "react";
import Loading from "../loading";
import Datepicker from "react-tailwindcss-datepicker";
import Button from "../button";
import TripModal, { ViewModal } from "./modal";
import EditModal from "./modal";
import Image from "next/image";



export interface RatingEntity {
    uuid: string;

    user: UserEntity;
    value: number;
    comment: string;
}

export interface ConditionEntity {
    uuid: string;
    
    avgTempC: number;
    avgTempF: number;
    avgHumidity: number;
}

export interface LocationEntity {
    uuid: string;

    name: string;
    latitude: number;
    longitude: number;
    
    condition: ConditionEntity;

    description?: string;
}

export interface TripEntity {
    uuid: string;

    name: string;
    description?: string;
    
    location: LocationEntity;
    startDate: Date;
    endDate: Date;
    
    ratings: RatingEntity[];
    owner: UserEntity;
}

export interface UserEntity {
    uuid: string;
    name: string;
}

type TripContext = {
    uuid: string;
    editable?: boolean;
};

export const defaultTrip: TripEntity = {
    uuid: "",
    name: "",
    description: "",
    location: {
        uuid: "",
        name: "",
        latitude: 0,
        longitude: 0,
        condition: {
            uuid: "",
            avgTempC: 0,
            avgTempF: 0,
            avgHumidity: 0
        },
        description: ""
    },
    startDate: new Date(),
    endDate: new Date(),
    ratings: [],
    owner: {
        uuid: "",
        name: "",
    }
};

const TemperatureStat = (props: {tempF: string, tempC: string}) => {
    const { tempF, tempC } = props;
    const [ celsius, setCelsius ] = React.useState<boolean>(true);

    return (
        <div className="stat select-none cursor-pointer p-2 bg-error text-white" style={{backgroundColor: 'rgba(215,0,34,' + Math.floor((parseFloat(tempC) / 30) * 100) + '%)'}} onClick={() => setCelsius(() => !celsius)}>
            <div className=" stat-value text-base text-center">{!celsius ? tempF + " °F" : tempC + " °C"}</div>
            <div className="stat-title text-center text-white" style={{opacity: '100%'}}>Temp</div>
        </div>
    );
}

const Trip = (props: TripContext) => {
    const { uuid, editable } = props;
    const { userContext, pageContext } = useContext(siteContext);
    const [ mounted, setMounted ] = React.useState(false);
    const [ trip, setTrip ] = React.useState<TripEntity>(defaultTrip);
    const [ photo, setPhoto ] = React.useState<string>("");
    const [ edit, setEdit ] = React.useState<boolean>(false);
    const [ view, setView ] = React.useState<boolean>(false);
    const [ deleted, setDeleted ] = React.useState<boolean>(false);

    useEffect(() => {

        switch (uuid) {
            case "new":
                setTrip(() => {
                    return {
                        ...defaultTrip,
                        owner: userContext.user
                    }
                });
                setMounted(true);
                return;
            default:
                fetch(`/api/trip?uuid=${uuid}`).then((res) => res.json()).then((data) => {
                    const trip: TripEntity = {
                        uuid: data.uuid,
                        name: data.name,
                        description: data.comment ? data.comment : "",
                        location: {
                            uuid: data.location.uuid,
                            name: data.location.name ? data.location.name : "",
                            latitude: data.location.latitude,
                            longitude: data.location.longitude,
                            condition: {
                                uuid: data.location.condition.uuid,
                                avgTempC: data.location.condition.avgTempC,
                                avgTempF: data.location.condition.avgTempF,
                                avgHumidity: data.location.condition.avgHumidity
                            },
                            description: data.location.description ? data.location.description : ""
                        },
                        startDate: new Date(data.startDate),
                        endDate: new Date(data.endDate),
                        ratings: [...data.ratings],
                        owner: {
                            uuid: data.user.uuid,
                            name: data.user.name
                        }
                    }

                    updatePicture(trip.location.latitude.toString(), trip.location.longitude.toString());
                    setTrip(() => trip);
                    setMounted(true);
                });
        }
    }, [uuid, userContext.user]);

    const updatePicture = async (lat: string, lng: string) => {
        fetch("/api/trip?photos=true&lat=" + lat + "&lng=" + lng, {headers: {
            "Cache-Control": "max-age=604800, s-maxage=604800, public"
        }}).then((res) => res.json()).then((data) => {
            setPhoto(() => data.photo);
        });
    }

    useEffect(() => {
        updatePicture(trip.location.latitude.toString(), trip.location.longitude.toString());
    }, [trip]);

    const openEdit = () => {
        setEdit(() => true);
    };

    const openView = () => {
        setView(() => true);
    };

    useEffect(() => {
        const modal = document.getElementById("trip-dialog-"+trip.uuid) as HTMLDialogElement;
        if (!modal) return;
        if (edit) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [edit, trip.uuid]);

    useEffect(() => {
        const modal = document.getElementById("trip-view-"+trip.uuid) as HTMLDialogElement;
        if (!modal) return;
        if (view) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [view, trip.uuid]);

    if (deleted) return null;

    return mounted ? ( 
        <>
            <div id={"trip-card-" + trip.uuid} className="card card-compact bg-white shadow-2xl rounded-2xl max-w-[400px] m-2 h-96 transition-all ease-in-out duration-500">
                { photo == "" ? null : <figure><img src={photo} alt={trip.location.name}/></figure> }
                <div className="card-body">
                    <div className="card-title text-3xl whitespace-break-spaces m-0">{trip.name}</div>
                    <div className="divider m-0"></div>
                    <div className="stats shadow max-w-[400px]">
                        <div className="stat">
                            <div className="stat-value text-lg max-w-xs whitespace-break-spaces">{trip.location.name}</div>
                            <div className="stat-title text-base">Location</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value text-lg">{trip.startDate.getDate()} {trip.startDate.getMonth() < 9 ? '0' + (trip.startDate.getMonth() + 1) : trip.startDate.getMonth() + 1} {trip.startDate.getFullYear()}</div>
                            <div className="stat-title">From</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value text-lg">{trip.endDate.getDate()} {trip.endDate.getMonth() < 9 ? '0' + (trip.endDate.getMonth() + 1) : trip.endDate.getMonth() + 1} {trip.endDate.getFullYear()}</div>
                            <div className="stat-title">To</div>
                        </div>
                    </div>
                </div>
                <TripStats trip={trip} />
                <div className="card-actions join join-horizontal flex flex-row flex-nowrap justify-end mx-2 my-2 rounded-2xl gap-0">
                    { editable ? <Button text={"Edit"} onClick={() => openEdit()} classes="btn btn-info text-white text-xl join-item"/> : null }
                    <Button text={"View"} onClick={() => openView()} classes="btn btn-success text-white text-xl join-item"/>
                </div>
                { editable ? <EditModal trip={trip} setTrip={setTrip} selected={edit} setSelected={setEdit} photo={photo} mounted={deleted} setMounted={setDeleted} /> : null }
                <ViewModal trip={trip} setTrip={setTrip} open={view} setOpen={setView} photo={photo} />
                <Favourite user={userContext.user} trip={trip} />
            </div>
        </>
    ) : <Loading />;
}

export const TripStats = (props: {trip: TripEntity}) => {
    const { trip } = props;

    return (
        <div className="stats stats-vertical absolute right-4 top-4 rounded-2xl w-16 text-sm">
            <div className="stat p-2 bg-info text-white" style={{backgroundColor: 'oklch(0.54615 0.215208 262.881 / 0.' + trip.location.condition.avgHumidity.toFixed(0) + ")"}}>
                <div className="stat-value text-base text-center">{trip.location.condition.avgHumidity.toFixed(1)}%</div>
                <div className="stat-title text-center text-white">Humidity</div>
            </div>
            <TemperatureStat tempC={trip.location.condition.avgTempC.toFixed(0)} tempF={trip.location.condition.avgTempF.toFixed(0)} />
        </div>
    );

}

type FavouriteProps = {
    trip: TripEntity;
    user: UserEntity;
}


export const Favourite = (props: FavouriteProps) => {
    const { trip, user } = props;
    const [ favourite, setFavourite ] = React.useState<boolean>(false);

    useEffect(() => {
        fetch(`/api/ratings?saved=true&user=${user.uuid}&trip=${trip.uuid}`).then((res) => res.json()).then((data) => {
            switch (data.status) {
                case "saved":
                    setFavourite(() => true);
                    break;
                default:
                    setFavourite(() => false);
                    break;
            }
        });
    }, [user.uuid, trip.uuid]);

    const toggleFavourite = () => {
        if (favourite) {
            fetch(`/api/ratings?delete=true&user=${user.uuid}&trip=${trip.uuid}`).then((res) => res.json()).then((data) => {
                switch (data.status) {
                    case "ok":
                        setFavourite(() => false);
                        break;
                    case "error":
                        setFavourite(() => true);
                        break;
                }
            });
        } else {
            fetch(`/api/ratings?save=true&user=${user.uuid}&trip=${trip.uuid}`).then((res) => res.json()).then((data) => {
                switch (data.status) {
                    case "ok":
                        setFavourite(() => true);
                        break;
                    case "error":
                        setFavourite(() => false);
                        break;
                }
            });
        }
    }

    return favourite ? <button onClick={() => toggleFavourite()} className="badge mask mask-squircle badge-lg p-6 bottom-2 -left-2 absolute hover:scale-105 hover:bg-base-200 transition-all"><span className="mask mask-heart p-4 bg-error"></span></button> : <button onClick={() => toggleFavourite()}  className="badge mask mask-squircle badge-lg p-6 bottom-2 -left-2 absolute hover:scale-105 hover:bg-base-200 transition-all"><span className="mask mask-heart p-4 bg-base-300"></span></button>
}

export default Trip;