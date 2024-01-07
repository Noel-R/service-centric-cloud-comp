import { siteContext } from "@/app/page";
import { useContext, useState, useEffect, use } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import Button from "../button";
import { TripEntity, TripStats, defaultTrip } from "./trip";
import Comments from "./comments";
import Loading from "../loading";
import Image from "next/image";

type ModalProps = {
    trip: TripEntity;
    setTrip: React.Dispatch<React.SetStateAction<any>>;
    selected: boolean;
    setSelected: React.Dispatch<React.SetStateAction<boolean>>;
    photo: string;
    mounted: boolean;
    setMounted: React.Dispatch<React.SetStateAction<boolean>>;
    create?: boolean;
};


const SaveTrip = async (trip: TripEntity) => {
    const res = await fetch("/api/trip?uuid=" + trip.uuid, {method: "PATCH", headers: {"Content-Type": "application/json"}, body: JSON.stringify(trip)}).then(res => res.json());
    switch (res.status) {
        case "ok":
            return {ok: true, trip: res.trip};
        default:
            return {ok: false, trip: null}
    }
};

const DeleteTrip = async (tripId: string) => {
    const res = await fetch("/api/trip?uuid=" + tripId, {method: "DELETE", headers: {"Content-Type": "application/json"}}).then(res => res.json());
    switch (res.status) {
        case "ok":
            return {ok: true};
        default:
            return {ok: false}
    }
};

type CreateProps = {
    trips: string[];
    setTrips: React.Dispatch<React.SetStateAction<string[]>>;
    selected: boolean;
    setSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateModal = (trip: CreateProps) => {
    const { trips, setTrips, selected, setSelected } = trip;
    const { userContext, pageContext } = useContext(siteContext);
    
    const [ tripForm, setTripForm ] = useState<TripEntity>(defaultTrip);
    const [ startDate, setStartDate ] = useState<Date>(new Date(tripForm.startDate));
    const [ endDate, setEndDate ] = useState<Date>(new Date(tripForm.endDate));

    const [ sent, setSent ] = useState<boolean>(false);

    const handleUpdate= (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, location: boolean) => {
        switch (location) {
            case true:
                setTripForm(() => {return {...tripForm, location: {...tripForm.location, [e.target.name]: e.target.value}}});
                break;
            default:
                setTripForm(() => {return {...tripForm, [e.target.name]: e.target.value}});
                break;
        }
    };

    useEffect(() => {
        setTripForm((prev) => {return {...prev, startDate: startDate, endDate: endDate}})
    }, [startDate, endDate])

    const onClear = () => {
        setTripForm(() => {return {...defaultTrip}});
    };

    const onCreate = async () => {
        const res = await fetch("/api/trip?user=" + userContext.user.uuid, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...tripForm})}).then(res => res.json());
        switch (res.status) {
            case "ok":
                setTrips(() => [...trips, res.trip.uuid]);
                setSelected(() => false);
                onClear();
                break;
            case "error":
                const dialog = document.getElementById("trip-modal-new") as HTMLDialogElement;
                dialog.classList.toggle("ring-transparent");
                dialog.classList.toggle("ring-error");
                break;
            default:
                return;
        }
    }

    const close = () => {
        setSelected(() => false);
        onClear();
    }

    return (
        <dialog id={"trip-dialog-new"} className="modal overflow-visible w-full" onClose={() => close()}>
            <div id={"trip-modal-new"} className="modal-box w-max flex flex-col justify-center bg-transparent p-4 overflow-visible ring-4 ring-transparent">
                <div className="card card-compact bg-white max-w-[400px] place-self-center ring-4 ring-transparent overflow-visible">
                    <div className="card-body overflow-visible">
                        <div className="card-title text-2xl mb-0">Edit Trip</div>
                        <div className="divider my-0 h-2"></div>
                        <div className="form-control w-full overflow-visible">
                            <label className="form-control w-full">
                                <div className="label -mb-2">
                                    <span className="label-text text-lg">Name</span>
                                </div>
                                <input type="text" name="name" placeholder="Please enter a name for the trip..." value={tripForm.name} onChange={(e) => handleUpdate(e, false)} className="input input-md bg-gray-200 font-semibold" />
                            </label>
                            <label className="form-control w-full">
                                <div className="label -mb-2">
                                    <span className="label-text text-lg">Description</span>
                                </div>
                                <textarea name="description" placeholder="Please describe the proposed trip..." value={tripForm.description} onChange={(e) => handleUpdate(e, false)} className="textarea textarea-bordered textarea-md bg-gray-200" />
                            </label>
                            <label className="form-control w-full">
                                <div className="label -mb-2">
                                    <span className="label-text text-lg">Location</span>
                                </div>
                                <input type="text" name="name" placeholder="Please type where you'd like to go..." value={tripForm.location.name} onChange={(e) => handleUpdate(e, true)} className="input input-md bg-gray-200" />
                            </label>
                            <label className="form-control w-full overflow-visible">
                                <TripDatepicker date={{startDate: startDate, endDate: endDate}} setDate={{setStart: setStartDate, setEnd: setEndDate}} />
                            </label>
                        </div>
                    </div>
                    <div className="card-actions join join-horizontal flex flex-row flex-nowrap justify-end m-4 gap-0">
                    <Button onClick={() => onCreate()} text={"Submit"} classes={"btn btn-success join-item text-white btn-md"} />
                    <Button onClick={() => onClear()} text={"Clear"} classes={"btn btn-error join-item text-white"} />
                    <Button onClick={() => setSelected(() => false)} text={"Close"} classes={"btn btn-error join-item text-white"} />
                </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>Close</button>
            </form>
        </dialog>
    )

};


const EditModal = (props: ModalProps) => {
    const { trip, setTrip, setSelected, mounted, setMounted, photo } = props;
    const { userContext, pageContext } = useContext(siteContext);

    const [ tripForm, setTripForm ] = useState<TripEntity>(trip);

    const [ startDate, setStartDate ] = useState<Date>(new Date(tripForm.startDate));
    const [ endDate, setEndDate ] = useState<Date>(new Date(tripForm.endDate));
    
    const handleUpdate= (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, location: boolean) => {
        switch (location) {
            case true:
                setTripForm(() => {return {...tripForm, location: {...tripForm.location, [e.target.name]: e.target.value}}});
                break;
            default:
                setTripForm(() => {return {...tripForm, [e.target.name]: e.target.value}});
                break;
        }
    };

    useEffect(() => {
        setTripForm((prev) => {return {...prev, startDate: startDate, endDate: endDate}})
    }, [startDate, endDate])

    const onSave = async () => {
        const res = await SaveTrip(tripForm);
        if (res.ok) {
            setTrip(() => {return {...tripForm, location: {...tripForm.location, condition: {...res.trip.location.condition}}}});
            setSelected(() => false);
        } else {
            const dialog = document.getElementById("trip-dialog-"+trip.uuid) as HTMLDialogElement;
            dialog.classList.toggle("ring-transparent");
            dialog.classList.toggle("ring-error");
        }
    };

    const onDelete = async () => {
        const res = await DeleteTrip(tripForm.uuid);
        if (res.ok) {
            setSelected(() => false);
            const card = document.getElementById("trip-card-"+trip.uuid) as HTMLDivElement;
            card.remove();
            setMounted(() => false);
        } else {
            const dialog = document.getElementById("trip-dialog-"+trip.uuid) as HTMLDialogElement;
            dialog.classList.toggle("ring-transparent");
            dialog.classList.toggle("ring-error");
        }
    };

    return (
        <>
            <dialog id={"trip-dialog-"+trip.uuid} className="modal overflow-visible w-full" onClose={() => setSelected(() => false)}>
                <div className="modal-box w-max flex flex-col justify-center bg-transparent p-4">
                    <div className="card card-compact bg-white max-w-[400px] place-self-center ring-4 ring-transparent">
                        <figure><img src={photo} alt={trip.location.name}/></figure>
                        <div className="card-body">
                            <div className="card-title text-2xl mb-0">Edit Trip</div>
                            <div className="divider my-0 h-2"></div>
                            <div className="form-control w-full">
                                <label className="form-control w-full">
                                    <div className="label -mb-2">
                                        <span className="label-text text-lg">Name</span>
                                    </div>
                                    <input type="text" name="name" placeholder="Please enter a name for the trip..." value={tripForm.name} onChange={(e) => handleUpdate(e, false)} className="input input-md bg-gray-200 font-semibold" />
                                </label>
                                <label className="form-control w-full">
                                    <div className="label -mb-2">
                                        <span className="label-text text-lg">Description</span>
                                    </div>
                                    <textarea name="description" placeholder="Please describe the proposed trip..." value={tripForm.description} onChange={(e) => handleUpdate(e, false)} className="textarea textarea-bordered textarea-md bg-gray-200" />
                                </label>
                                <label className="form-control w-full">
                                    <div className="label -mb-2">
                                        <span className="label-text text-lg">Location</span>
                                    </div>
                                    <input type="text" name="name" placeholder="Please type where you'd like to go..." value={tripForm.location.name} onChange={(e) => handleUpdate(e, true)} className="input input-md bg-gray-200" />
                                </label>
                                <label className="form-control w-full">
                                    <TripDatepicker date={{startDate: startDate, endDate: endDate}} setDate={{setStart: setStartDate, setEnd: setEndDate}} />
                                </label>
                            </div>
                        </div>
                        <TripStats trip={tripForm} />
                        <div className="card-actions join join-horizontal flex flex-row flex-nowrap justify-end m-4 gap-0">
                        <Button onClick={() => onSave()} text={"Save"} classes={"btn btn-success join-item text-white btn-md"} />
                        <Button onClick={() => onDelete()} text={"Delete"} classes={"btn btn-error join-item text-white"} />
                    </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </>
    )
};

type DateProps = {
    date: {startDate: Date, endDate: Date};
    setDate: {setStart: React.Dispatch<React.SetStateAction<any>>, setEnd: React.Dispatch<React.SetStateAction<any>>};
}

const TripDatepicker = (props: DateProps) => {
    const { date, setDate } = props;

    const handleDateChange = (newDate: any) => {
        if (newDate.startDate == null || newDate.endDate == null) {
            setDate.setStart(() => new Date());
            setDate.setEnd(() => new Date());
            return;
        }
        setDate.setStart(() => new Date(newDate.startDate));
        setDate.setEnd(() => new Date(newDate.endDate));
    };

    return (
        <>
            <Datepicker
                primaryColor={"amber"}
                value={date}
                onChange={handleDateChange}
                toggleClassName={"btn btn-ghost text-black bg-gray-200 btn-sm btn-square align-middle m-auto mx-2 right-0"}
                containerClassName={"w-full flex flex-row flex-nowrap justify-between h-min mt-4"}
                inputClassName={"input input-ghost bg-gray-200 text-black focus:text-black"}
                minDate={new Date()}
                showFooter={true}
                showShortcuts={true}
            />
        </>
    )
}

type ViewProps = {
    trip: TripEntity;
    setTrip: React.Dispatch<React.SetStateAction<any>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    photo: string;

}

const ViewModal = (props: ViewProps) => {
    const { trip, setTrip, open, setOpen, photo } = props;
    const { userContext, pageContext } = useContext(siteContext);

    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(() => true);
    }, []);

    const onClose = () => {
        setOpen(() => false)
    }

    return mounted ? (
        <>
            <dialog id={"trip-view-"+trip.uuid} className="modal overflow-visible w-full" onClose={() => setOpen(() => false)}>
                <div className="modal-box w-max flex flex-col justify-center bg-transparent p-4">
                    <div className="card card-compact bg-white max-w-[400px] place-self-center ring-4 ring-transparent">
                        <figure><img src={photo} alt={trip.location.name}/></figure>
                        <div className="card-body">
                            <article className="prose prose-2xl max-w-xs prose-headings:underline prose-headings:mb-0 text-xl font-medium">
                                <h1>{trip.name}</h1>
                                <h3>{trip.location.name}</h3>
                                <h4>{trip.startDate.toDateString()} - {trip.endDate.toDateString()}</h4>
                                <p>
                                    {trip.description}
                                </p>
                            </article>
                            <div className="user-info flex flex-row flex-nowrap btn btn-ghost w-min">
                                <div className="w-8 mask mask-squircle bg-neutral text-neutral-content text-center m-auto mr-1 ml-0">
                                    <span className="text-2xl font-bold text-center">{trip.owner.name[0]}</span>
                                </div>
                                <div className="user-info-content m-auto ml-0 text-2xl">{trip.owner.name}</div>
                            </div>
                        </div>
                        <TripStats trip={trip} />
                        <Comments trip={trip} />
                        <div className="card-actions join join-horizontal flex flex-row flex-nowrap justify-end m-4 gap-0">
                        <Button onClick={() => onClose()} text={"Close"} classes={"btn btn-error join-item text-white"} />
                    </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </>
    ) : <Loading />;
}


export default EditModal;
export { CreateModal, ViewModal };