import React, { useEffect, useState } from 'react';
import Competition from './components/Competition';
import Year from './components/Year';
import './App.css';
import {Accordion, AccordionItem, Spinner} from "@nextui-org/react";

function App() {
  const year = 2024;
  const comps = [
    "Women's Central League",
    "Men's Capital Premier",
    "Men's Capital 2",
    "Women's Capital 1",
    "Women's Capital 3",
    "Masters 1",
    "Masters Over 45's - 1",
    "Masters Over 45's - 2",
  ]

  const from = "2024-03-01T00:00:00.000Z";
  const to = "2024-12-01T00:00:00.000Z";
  // const from = `${year}-03-01T00:00:00.000Z`;
  // const to = `${year + 1}-03-01T00:00:00.000Z`;
  
  const [dataCache, setDataCache] = useState({});

  const fetchData = async (compName) => {
    try {
      const params = {
        from: from,
        to: to,
        compName: compName
      };
      
      const url = "/api/v1/fixtures?";
      const query = Object.entries(params)
        .map( ([key, value]) => `${key}=${value}` )
        .join('&');

      const response = await fetch(url+query);
      const data = await response.json();
      const fixtures = data.flat().sort((a, b) => new Date(a.fixtureDate) - new Date(b.fixtureDate));

      if (data) {
        setDataCache( existingData => ({
          ...existingData,
          [compName]: fixtures
        }))
      } else {
        console.log("Failed");
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // throw error;
    }
  };

  const handleAccordionClick = async ( e ) => {
    const compName = e.target.parentElement.firstChild.innerText.split("Press")[0].trim();
    
    if (dataCache[compName]) {
      return;
    }
    fetchData(compName);
  };

  // useEffect(() => {
  //     console.log(dataCache);
  // }, [dataCache]);

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
          <AccordionItem key={i} title={compName} onClick={ handleAccordionClick } className="font-semibold" subtitle="Press to expand">
            {
              dataCache[compName] ?
              // <Competition compName={compName} fixtures={dataCache.filter(fixture => fixture.comp == compName)}/> : 
              <Competition compName={ compName } fixtures={ dataCache[compName] }/> : 
              <Spinner className="w-full mb-5" />
            }
          </AccordionItem>
        ))}
      </Accordion>
      
    </>
  )
}

export default App
