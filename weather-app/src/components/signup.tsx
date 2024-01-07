"use client";
import React from "react";
import { Details } from "./user";

const Signup = (props: {details: Details, setDetails: any, updateDetails: any, toggleSignup: any}) => {
    const {details, setDetails, updateDetails, toggleSignup} = props;
    const [status, setStatus] = React.useState<string>("");

    const sendSignup = async (details: Details) => {
        const result = await fetch("/api/signup", {method: "POST", body: JSON.stringify({email: details.email, password: details.password, name: details.name}), headers: {"Content-Type": "application/json;charset=utf8"}})
        .then((res) => res.json())
        .then((data) => {return data});
    
        if (result.uuid) {
            setStatus(() => "Signup successful");
        } else {
            setStatus(() => "Signup failed");
        }
    };

    return (
        <div className="card w-auto mx-4 shadow-xl bg-base-200 px-10 py-10">
            <div className="card-header text-center uppercase font-bold text-3xl whitespace-break-spaces">
                <h1>Please Signup to Continue.</h1>
            </div>
            <div className="card-body flex flex-col flex-nowrap place-items-center">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-xl uppercase">Email</span>
                    </div>
                    <input name="email" type="text" onChange={(e) => updateDetails(e)} placeholder="Type your email here..." className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-xl uppercase">Name</span>
                    </div>
                    <input name="name" type="text" onChange={(e) => updateDetails(e)} placeholder="Enter your name here..." className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-xl uppercase">Password</span>
                    </div>
                    <input name="password" type="password" onChange={(e) => updateDetails(e)} placeholder="Enter your password here..." className="input input-bordered w-full max-w-xs" />
                </label>
            </div>
            <div className=" card-actions flex flex-row flex-nowrap place-items-center justify-around">
                {status == "" ? <a className="btn btn-ghost text-center uppercase text-xl" onClick={async () => sendSignup(details)}>Signup</a> : status == "Signup successful" ? <a className="btn btn-ghost bg-success text-center uppercase text-xl" onClick={() => toggleSignup()} >To Login</a> : <a className="btn btn-ghost bg-error text-center uppercase text-xl" onClick={() => sendSignup(details)}>Retry</a>}
                <a className="btn btn-ghost text-center uppercase text-xl" onClick={() => toggleSignup()}>Return</a>
            </div>
        </div>
    )
}

export default Signup;