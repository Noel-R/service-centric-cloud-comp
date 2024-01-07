"use client";
import { siteContext } from "@/app/page";
import React, { use, useEffect } from "react";
import Loading from "../loading";
import Trip, { defaultTrip } from "../Trips/trip";
import TripModal, { CreateModal } from "../Trips/modal";
import Button from "../button";

const Home = () => {
    const [ mounted, setMounted ] = React.useState(false);
    const { userContext, pageContext } = React.useContext(siteContext);
    const [ userTrips, setTrips ] = React.useState<string[]>([]);
    const [ userFavs, setFavs ] = React.useState<string[]>([]);
    const [ userComments, setComments ] = React.useState<commentObject[]>([]);
    const [ createModal, setCreateModal ] = React.useState(false);

    useEffect(() => {
        fetch(`/api/trips?user=${userContext.user.uuid}`).then((res) => res.json()).then((data) => {
            setTrips(() => [...data]);
        });
        fetch(`/api/ratings?all=true&user=${userContext.user.uuid}`).then((res) => res.json()).then((data) => {
            switch (data.status) {
                case "ok":
                    setFavs(() => [...data.ratings]);
                    break;
                case "error":
                    console.error(data.message);
                    break;
                default:
                    console.error("unknown error");
                    break;
            }
        });
        fetch(`/api/ratings?comments=true&user=${userContext.user.uuid}`).then((res) => res.json()).then((data) => {
            switch (data.status) {
                case "ok":
                    setComments(() => [...data.comments]);
                    break;
                case "error":
                    break;
                default:
                    console.error("unknown error");
                    break;
            }
        });
        setMounted(() => true);
    }, [userContext.user.uuid]);
    
    useEffect(() => {
        const dialog = document.getElementById("trip-dialog-new") as HTMLDialogElement;
        if (dialog) {
            if (createModal) {
                dialog.showModal();
            } else {
                dialog.close();
            }
        }
    }, [createModal]);

    return mounted ? (
        <div className="flex flex-col w-full">
            <MyTrips userTrips={userTrips} createModal={createModal} setCreateModal={setCreateModal} setUserTrips={setTrips} />
            <div className="divider h-2 m-auto"></div>
                <div className="h-1/2 m-auto flex flex-row mt-4 mb-0 w-full max-h-[300px]">
                    <div className="flex flex-col w-3/4">
                        <MyFavs userFavs={userFavs} setUserFavs={setFavs} />
                    </div>
                    <div className="divider divider-horizontal m-auto w-8"></div>
                    <div className="flex flex-col w-1/2">
                        <MyComments userComments={userComments} setUserComments={setComments} />
                    </div>
                </div>
        </div>
    ) : <Loading className="skeleton h-96 rounded-2xl" />;
};

type commentObject = {
    uuid: string,
    createdAt: Date,
    comment: string,
    trip: {
        uuid: string,
        name: string,
        user: {
            name: string
        }
    }
}

type myCommentsProps = {
    userComments: commentObject[]
    setUserComments: React.Dispatch<React.SetStateAction<commentObject[]>>
}

const TripComment = (props: {tripName: string, tripUUID: string, comment: string, username: string, odd?: boolean, created: Date}) => {
    const { tripName, tripUUID, comment, username, odd, created } = props;

    return (
        <div id={"user-comment-" + tripUUID} className={"chat my-2 " + (odd ? "chat-start" : "chat-end")}>
            <label className="w-full max-w-xs">
                <div className="label">
                    <span className="label-text text-xl text-neutral-content">You commented on the trip {tripName}...</span>
                </div>
                <span className="chat-bubble text-3xl">{comment}</span>
                <div className="label place-self-end">
                    <span className="label-text-alt text-xl text-neutral-content">...on {new Date(created).toDateString()}</span>
                </div>
            </label>
        </div>
    )
}

const MyComments = (props: myCommentsProps) => {
    const { userComments, setUserComments } = props;

    return (
        <div className="hero min-h-[500px] max-h-[500px] rounded-t-none rounded-l-none flex flex-row rounded-2xl w-full shadow-2xl  mt-0 pt-0" style={{backgroundImage: 'url(https://www.thephoblographer.com/wp-content/uploads/2019/11/Chris-Gampat-The-Phoblographer-Tamron-17-28mm-f2.8-Di-III-RXD-review-samples-ILCE-7RM3E-17-28mm-F2.8-2.8111-1.6s100.jpg)'}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content min-w-full">
                <article className="prose prose-2xl max-w-md prose-headings:underline text-white prose-headings:text-white">
                    <h1>My Comments</h1>
                </article>
                <div className="divider divider-horizontal bg-white w-2 my-12 rounded-xl"></div>
                <div className="flex flex-col flex-nowrap w-full overflow-y-scroll max-h-[500px]">
                {userComments.length > 0 ? userComments.map((comment: commentObject, index: number) => {
                    return <TripComment key={"user-key-" + comment.uuid} tripName={comment.trip.name} tripUUID={comment.trip.uuid} comment={comment.comment} username={comment.trip.user.name} odd={index % 2 === 0} created={comment.createdAt}/>
                }) : <div className="label"><span className="label-text">You have no comments yet.</span></div>}
                </div>
            </div>
        </div>
    )
};

type myFavProps = {
    userFavs: string[]
    setUserFavs: React.Dispatch<React.SetStateAction<string[]>>
};

const MyFavs = (props: myFavProps) => {
    const { userFavs, setUserFavs } = props;

    return (
        <div className="hero min-h-[500px] h-auto rounded-t-none rounded-r-none flex flex-row rounded-2xl w-full shadow-2xl  mt-0 pt-0" style={{backgroundImage: 'url(https://ipt.imgix.net/200048/x/0/10-tips-to-master-wide-angle-landscape-photography-4.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883)'}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content min-w-full">
                <article className="prose prose-2xl max-w-md prose-headings:underline text-white prose-headings:text-white">
                    <h1>My Favourites</h1>
                </article>
                <div className="divider divider-horizontal bg-white w-2 rounded-xl"></div>
                <div className=" flex flex-row justify-start w-full overflow-x-scroll">
                {userFavs.map((trip: string, index: number) => {
                    return <Trip key={trip} uuid={trip} />
                })}
                </div>
            </div>
        </div>
    )
};




type myTripsProps = {
    userTrips: string[]
    createModal: boolean
    setCreateModal: React.Dispatch<React.SetStateAction<boolean>>
    setUserTrips: React.Dispatch<React.SetStateAction<string[]>>
};

const MyTrips = (props: myTripsProps) => {
    const { userTrips, createModal, setCreateModal, setUserTrips } = props;

    const makeTrip = () => {
        setCreateModal(() => true);
    };

    return (
        <div className="hero min-h-[500px] h-auto rounded-b-none flex flex-row rounded-2xl w-full shadow-2xl" style={{backgroundImage: 'url(https://i.pinimg.com/originals/eb/f0/02/ebf002d6348c3ae432649da4418fce40.jpg)'}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content min-w-full">
                <article className="prose prose-2xl max-w-md prose-headings:underline text-white prose-headings:text-white">
                    <h1>My Trips</h1>
                    <p>
                    Welcome to your trips page! Here you can view all your trips and adventures. Explore the world and create unforgettable memories.
                    </p>
                </article>
                <Button text="Make a Trip" onClick={() => makeTrip()} classes="btn btn-primary" />
                <div className="divider divider-horizontal bg-white w-2 rounded-xl"></div>
                <div className=" flex flex-row justify-start w-full overflow-x-scroll">
                {userTrips.map((trip: string, index: number) => {
                    return <Trip key={trip} uuid={trip} editable />
                })}
                </div>
            </div>
            <CreateModal selected={createModal} setSelected={setCreateModal} trips={userTrips} setTrips={setUserTrips} />
        </div>
    )
};

export default Home;