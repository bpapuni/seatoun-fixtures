import React, { useEffect, useState } from 'react';
import Competition from './components/Competition';
import Year from './components/Year';
import './App.css';
import {Accordion, AccordionItem, Spinner} from "@nextui-org/react";

function App() {
  // const year = new Date().getFullYear();
  const year = 2024;
  const comps = [
    // "Masters 2",
    // "Masters 4",
    "Women's Central League",
    "Men's Capital Premier",
    "Kelly Cup",
    "Men's Capital 2",
    // "Women's Capital 1",
    // "Women's Capital 3",
    "Masters Over 45's - 1",
    "Masters Over 45's - 2",
  ]

  const from = "2024-03-01T00:00:00.000Z";
  const to = "2024-12-01T00:00:00.000Z";
  // const from = `${year}-03-01T00:00:00.000Z`;
  // const to = `${year + 1}-03-01T00:00:00.000Z`;
  
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
      
      if (data) {
        setDataCache((prevCache) => ({...prevCache, [comp]: data}));
      } else {
        // fetchData(comp);
        console.log("Failed");
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // throw error;
    }
  };

  // const handleAccordionClick = async (comp) => {
  //   const compOpen = comp.target.dataset.open === "true";
  //   const compName = comp.target.parentElement.firstChild.innerText;
    
  //   if (!compOpen) { return }
  // };

  useEffect(() => {
    for (let comp of comps) {
      if (!dataCache[comp]) {
        fetchData(comp);
      }
    }
  }, [])

  return (
    <>
      <div className="banner">
        <div className="banner-bg">
          <img src="/banner-bg.png" alt="seatoun logo" />
        </div>
        <img className="banner-logo" src="/seatoun-logo.png" alt="seatoun logo" />
      </div>

      <Year year={year} />
      
      <Accordion className="comp-accordion" selectionMode="multiple">
        {comps.map((compName, i) => (
          <AccordionItem key={i} title={compName} className="font-semibold" subtitle="Press to expand">
            {
              dataCache[compName] ? 
              <Competition compName={compName} fixtures={dataCache[compName]}/> : 
              <Spinner className="w-full mb-5" />
            }
          </AccordionItem>
        ))}
      </Accordion>
      
    </>
  )
}

export default App
