import React, { useEffect, useState } from 'react';
import Competition from './components/Competition';
import './App.css';
// import TeamSelect from './components/TeamSelect';
import {Accordion, AccordionItem, Spinner} from "@nextui-org/react";

function App() {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const daysUntilLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const daysUntilThisSunday = dayOfWeek === 0 ? dayOfWeek : 7 - dayOfWeek;
  const lastMonday = new Date(currentDate);
  lastMonday.setDate(currentDate.getDate() - daysUntilLastMonday);
  const thisSunday = new Date(currentDate);
  thisSunday.setDate(currentDate.getDate() + daysUntilThisSunday);

  const comps = [
    "Masters 2",
    "Masters 4",
    "Masters Over 45's - Bottom 4",
    "Masters Over 45's - Top 8",
    "Men's Capital Premier",
    "Men's Capital 2",
    "Wellington 1",
    "Women's Capital 1",
    "Women's Capital 3",
    "Women's Central League",
  ]

  const from = "2023-01-21T21:22:00.284Z";
  const to = "2023-09-21T21:22:00.284Z";
  
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
      
      setDataCache((prevCache) => ({...prevCache, [comp]: data}));
      
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const handleAccordionClick = async (comp) => {
    const compOpen = comp.target.dataset.open === "true";
    
    if (!compOpen) { return }

    if (!dataCache[comp.target.innerText]) {
      await fetchData(comp.target.innerText);
    }
  };

  // useEffect(() => {
  //   alert("Set");
  // }, [dataCache["Masters 2"]])

  return (
    <>
      <Accordion className="comp-accordion" selectionMode="multiple">
        {comps.map((compName, i) => (
          <AccordionItem key={i} onClick={handleAccordionClick} title={compName}>
            {dataCache[compName] ? (
              <Competition compName={compName} fixtures={dataCache[compName]} />
            ) : (
              <Spinner />
            )}
          </AccordionItem>
        ))}
      </Accordion>
      
    </>
  )
}

export default App
