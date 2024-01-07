"use client";
import React, { useContext } from "react";
import { siteContext } from "@/app/page";
import Button from "./button";

export type Details = {
    email: string;
    password: string;
    name?: string;
    signup?: boolean;
}

export type User = {
    email: string;
    name: string;
    uuid: string;
}

const UserComponent = () => {
    const { user, setUser } = useContext(siteContext).userContext;

    const Logout = () => {
      setUser(() => {return {email: "", name: "", uuid: ""}});
    };
  
    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar placeholder hover:scale-105 transition-transform ease-in-out duration-500">
                <div className="w-16 mask mask-squircle bg-neutral text-neutral-content text-center">
                    <span className="text-5xl font-bold">{user.name[0]}</span>
                </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu dropdown-content bg-base-200 rounded-box w-36">
                <li>
                    <a onClick={() => Logout()} className="bg-error text-center uppercase text-white font-bold text-2xl">Logout</a>
                </li>
            </ul>
        </div>
    )
}

export default UserComponent;