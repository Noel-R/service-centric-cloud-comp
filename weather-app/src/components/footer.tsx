"use client";
import React from 'react';


export default function Footer() {
    return (
        <footer className="footer items-center p-4 bg-neutral text-neutral-content absolute bottom-0 left-0">
            <aside className="items-center grid-flow-col">
                <div className="mask mask-squircle my-0 btn btn-neutral-content btm-md uppercase text-neutral hover:rotate-180 text-3xl hover:scale-105 transition-all duration-300 ease-in-out">
                    tbf
                </div> 
                <p>Copyright © 2024 - Noel Rottenbiller | Nottingham Trent University</p>
            </aside> 
            <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            </nav>
        </footer>
    )
}