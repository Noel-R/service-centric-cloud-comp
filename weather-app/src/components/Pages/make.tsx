"use client";
import { siteContext } from "@/app/page";
import React, { use, useEffect } from "react";
import Loading from "../loading";

const Make = () => {
    const [ mounted, setMounted ] = React.useState(false);
    const { userContext, pageContext } = React.useContext(siteContext);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? (
        <>
            <div>Make Trip</div>
        </>
    ) : <Loading />;
};


export default Make;