"use client";
import React, { useEffect, useContext } from "react";
import Loading from "./loading";
import { siteContext } from "@/app/page";
import { Details } from "./user";
import Signup from "./signup";

const Login = () => {
    const { user, setUser} = useContext(siteContext).userContext;
    const [mounted, setMounted] = React.useState(false);
    const [details, setDetails] = React.useState<Details>({email: "", password: "", signup: false});
    const [status, setStatus] = React.useState<string>("");

    useEffect(() => {
        setMounted(() => true);
    }, []);

    const updateDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const toggleSignup = () => {
        setDetails((prev) => ({
            ...prev,
            signup: !prev.signup
        }));
    };

    const clearErrors = () => {
        let inputs: NodeListOf<HTMLInputElement> = window.document.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
        inputs.forEach((input) => {
            input.classList.remove("input-error");
        });
    };

    const sendLogin = async (details: Details) => {
        const result = await fetch("/api/login", {method: "POST", body: JSON.stringify({email: details.email, password: details.password}), headers: {"Content-Type": "application/json;charset=utf8"}})
        .then((res) => res.json())
        .then((data) => {return data});

        if (result.uuid) {
            setStatus(() => "Login successful");
            setUser(() => {return {email: result.email, name: result.name, uuid: result.uuid}})
        } else {
            setStatus(() => "Login failed");
            clearErrors();

            let emailbox: HTMLInputElement = window.document.querySelector("input[name='email']") as HTMLInputElement;
            let passbox: HTMLInputElement = window.document.querySelector("input[name='password']") as HTMLInputElement;

            switch (result.error) {
                case "User not found.":{
                    if (emailbox != null && passbox != null) {
                        emailbox.classList.add("input-error");
                        emailbox.value = "";
                        passbox.value = "";
                        emailbox.focus();
                    }
                    break;
                }
                case "Incorrect password.": {
                    if (passbox != null) {
                        passbox.classList.add("input-error");
                        passbox.value = "";
                        passbox.focus();
                    }
                    break;
                }
                default: {
                    clearErrors();
                    break;
                }
            }
        }
    };

    return mounted ? (
        details.signup ? <Signup details={details} setDetails={setDetails} updateDetails={updateDetails} toggleSignup={toggleSignup} /> : (
        <div className="card w-auto mx-4 shadow-xl bg-base-200 px-10 py-10">
            <div className="card-header text-center uppercase font-bold text-3xl whitespace-break-spaces">
                <h1>Welcome, Please login to continue.</h1>
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
                        <span className="label-text text-xl uppercase">Password</span>
                    </div>
                    <input name="password" type="password" onChange={(e) => updateDetails(e)} placeholder="Enter your password here..." className="input input-bordered w-full max-w-xs" />
                </label>
            </div>
            <div className=" card-actions flex flex-row flex-nowrap place-items-center justify-around">
                <a className="btn btn-ghost text-center uppercase text-xl" onClick={async () => sendLogin(details)}>Login</a>
                <a className="btn btn-ghost text-center uppercase text-xl" onClick={() => toggleSignup()}>Signup</a>
            </div>
        </div>
        )
    ) : <Loading />
};

export default Login;
