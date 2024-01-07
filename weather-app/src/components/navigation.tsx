"use client";

import { Page, siteContext } from "@/app/page";
import { useContext } from "react";
import Button from "./button";
import UserComponent from "./user";

const Navigation = () => {
    const { pages, changePage } = useContext(siteContext).pageContext;

    return (
      <div className=" navbar bg-base-200 px-4 rounded-2xl py-0 my-2 relative top-0">
        <div className="navbar-start">
          <div className="mask mask-squircle my-4 btn btn-neutral btm-md uppercase text-white text-3xl hover:scale-105 transition-all duration-300 ease-in-out">
            tbf
          </div>
        </div>
        <div className="navbar-end">
          <div className="navbar-end join join-horizontal justify-end flex flex-row flex-nowrap px-4">
            { pages.map((page: Page) => {
              return <Button key={page.name + "-button"} text={page.name} onClick={() => changePage(page.name)} classes="join-item btn btn-neutral btn-md shadow-xl text-white text-2xl font-bold" />
            })}
          </div>
          <UserComponent />
        </div>
      </div>
    )
};

export default Navigation;