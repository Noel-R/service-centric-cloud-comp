"use client";
import React from 'react';

interface LoadingProps {
    className?: string;
}

export default function Loading(props: LoadingProps) {
    const { className } = props;
    
    return className ? (
        <div className={className}></div>
    ) : (
        <div className="card w-6/12">
            <div className="card-body flex flex-row place-items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        </div>
    )
}