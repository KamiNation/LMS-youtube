"use client"

// started  here  first and deleted the default content

import React, { FC, useState } from "react"

import Heading from "./utils/Heading"

import Header from "./components/Header";

import Hero from "./components/Route/Hero";

interface Props { }

const Page: FC<Props> = ({ }) => {

  const [open, setOpen] = useState(false);

  const [activeItem, setActiveItem] = useState(0)

  // after hero component, created a state for route
  const [route, setRoute] = useState("Login");


  return (
    <div>
      <Heading
        title="KLearning"
        description="A multi platform"
        keywords="MERN, Redux"
      />

      <Header
        open={open}
        activeItem={activeItem}
        setOpen={setOpen}
        setRoute={setRoute}
        route={route}
      />

      <Hero />

    </div>
  )
}


export default Page