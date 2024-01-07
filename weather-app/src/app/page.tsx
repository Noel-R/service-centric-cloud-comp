"use client";

import Home from "@/components/Pages/home";
import Make from "@/components/Pages/make";
import Trips from "@/components/Pages/trips";
import Footer from "@/components/footer";
import Loading from "@/components/loading";
import Login from "@/components/login";
import Navigation from "@/components/navigation";
import UserComponent, { User } from "@/components/user";
import React, { use, useContext, useEffect } from "react";

export const siteContext = React.createContext<SiteContext>({
  userContext: {
    user: {email: "", name: "", uuid: ""},
    setUser: () => {}
  },
  pageContext: {
    pages: [],
    setPages: () => {},
    changePage: (page: string) => {}
  }
});

export interface Page {
  name: string;
  component: () => JSX.Element;
  active: boolean;
}

export interface SiteContext {
  userContext: {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<any>>;
  };
  pageContext: {
    pages: Page[];
    setPages: React.Dispatch<React.SetStateAction<any>>;
    changePage: (page: string) => void;
  }
};

const defaultPages: Page[] = [
  {name: "Home", component: () => <Home key="home"/>, active: true},
  {name: "All Trips", component: () => <Trips key="trips"/>, active: false}
];


export default function Page() {
  const [pages, setPages] = React.useState<Page[]>(defaultPages);
  const [user, setUser] = React.useState<User>({email: "", name: "", uuid: ""});

  const changePage = (page: string) => {
    setPages(() => pages.map((p) => {
      if (p.name == page) {
        p.active = true;
      } else {
        p.active = false;
      }
      return p;
    }));
  };

  return (
    <siteContext.Provider value={{userContext: {user: user, setUser: setUser}, pageContext: {pages: pages, setPages: setPages, changePage: changePage}}}>
      <div className="w-full flex flex-col flex-nowrap place-items-center justify-center h-full noscroll">
        {user.uuid == "" ? <Login /> : <Dashboard /> }
      </div>
      <Footer />
    </siteContext.Provider>
  )
}

const Dashboard = () => {
  return (
    <div className="m-2 h-full w-11/12">
      <Navigation />
      <Main />
    </div>
  )
};


const Main = () => {
  const { pages } = useContext(siteContext).pageContext;

  return (
    <div className="my-2 w-auto rounded-2xl bg-base-200">
      {pages.map((page) => {
        return page.active ? page.component() : null;
      })}
    </div>
  )
};