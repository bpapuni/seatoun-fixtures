import React, { useEffect, useState } from 'react';
import { useRef } from 'react'
import Competition from './components/Competition';
import Month from './components/Month';
import './App.css';
// import TeamSelect from './components/TeamSelect';
import {Accordion, AccordionItem, Spinner} from "@nextui-org/react";
import {Button, ButtonGroup} from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@nextui-org/react";

function App() {
  const myRef = useRef(null);
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const daysUntilLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const daysUntilThisSunday = dayOfWeek === 0 ? dayOfWeek : 7 - dayOfWeek;
  const lastMonday = new Date(currentDate);
  lastMonday.setDate(currentDate.getDate() - daysUntilLastMonday);
  const thisSunday = new Date(currentDate);
  thisSunday.setDate(currentDate.getDate() + daysUntilThisSunday);

  const comps = [
    // "Masters 2",
    // "Masters 4",
    "Masters Over 45's - Bottom 4",
    // "Masters Over 45's - Top 8",
    "Men's Capital Premier",
    "Men's Capital 2",
    // "Wellington 1",
    // "Women's Capital 1",
    // "Women's Capital 3",
    "Women's Central League",
  ]

  const from = "2024-04-01T00:00:00.000Z";
  const to = "2024-12-01T00:00:00.000Z";
  const date = new Date(from).toLocaleString("en-NZ", { month: "long", year: "numeric" });
  
  const [dataCache, setDataCache] = useState({});

  const fetchData = async (comp) => {
    try {
      const params = {
        comp: comp,
        from: from,
        to: to
      };
      
      const url = "/api/v1/fixtures?";
      const query = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const response = await fetch(url+query);
      const data = await response.json();
      
      // alert(data);
      
      setDataCache((prevCache) => ({...prevCache, [comp]: data}));
      
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const handleAccordionClick = async (comp) => {
    const compOpen = comp.target.dataset.open === "true";
    
    if (!compOpen) { return }

    // if (!dataCache[comp.target.innerText]) {
    //   await fetchData(comp.target.innerText);
    // }
  };

  for (let comp of comps) {
    if (!dataCache[comp]) {
      fetchData(comp);
    }
  }

  return (
    <>
      <div className="banner">
        <div className="banner-bg">
          <img src="/banner-bg.png" />
        </div>
        <img className="banner-logo" src="/seatoun-logo.png" />
      </div>
          {/* <Month date={date} ref={myRef} /> */}
      {/* <Dropdown>
        <DropdownTrigger>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="new">New file</DropdownItem>
          <DropdownItem key="copy">Copy link</DropdownItem>
          <DropdownItem key="edit">Edit file</DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
      
      <Accordion className="comp-accordion" selectionMode="multiple">
        {comps.map((compName, i) => (
          <AccordionItem key={i} onClick={handleAccordionClick} title={compName}>
            {dataCache[compName] ? (
              <Competition compName={compName} fixtures={dataCache[compName]} />
            ) : (
              <Spinner className="w-full mb-5" />
            )}
          </AccordionItem>
        ))}
      </Accordion>
      
    </>
  )
}

export default App
