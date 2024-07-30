import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Header = ( {taskCount} ) => {
    const router = useRouter();

    let headerText = '';

    if (router.pathname === '/completed') {
        headerText = taskCount === 1 ? `You completed ${taskCount} task 📅` : `You completed ${taskCount} tasks 📅`; 
    } else if (router.pathname === '/pending') {
        headerText = taskCount === 1 ? `You have ${taskCount} task pending 📅` : `You have ${taskCount} tasks pending 📅`; 
    } else {
        headerText = taskCount === 1 ? `You've got ${taskCount} task 📅` : `You've got ${taskCount} tasks 📅`;
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <div className="flex items-center">
                <div className="text-center md:text-left">
                    <h1 className="text-2xl font-bold">Hello, User!</h1>
                    <h1 className="text-4xl font-bold">{headerText}</h1>
                </div>
            </div>
        </div>
    );
};

export default Header;
