import React, { useEffect, useState } from 'react';
import Competition from './components/Competition';
import './App.css';
// import TeamSelect from './components/TeamSelect';
import {Accordion, AccordionItem} from "@nextui-org/react";

function App() {
  const [backendData, setBackendData] = useState([{}])

  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const daysUntilLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const daysUntilThisSunday = dayOfWeek === 0 ? dayOfWeek : 7 - dayOfWeek;
  const lastMonday = new Date(currentDate);
  lastMonday.setDate(currentDate.getDate() - daysUntilLastMonday);
  const thisSunday = new Date(currentDate);
  thisSunday.setDate(currentDate.getDate() + daysUntilThisSunday);

  // const comps = [
  //   "Men's Capital Premier",
  //   "Men's Capital 2",
  //   "Wellington 1",
  //   "Masters 2",
  //   "Masters 4",
  //   "Masters Over 45's - Top 8",
  //   "Masters Over 45's - Bottom 4",
  //   "Women's Central League",
  //   "Women's Capital 1",
  //   "Women's Capital 3"
  // ]

  const from = "2023-01-21T21:22:00.284Z";
  const to = "2023-09-21T21:22:00.284Z";

  useEffect(() => {
    fetch(`/api/v1/fixtures/${from}/${to}`)
    .then (res => res.json())
    .then(data => {
      setBackendData(data)
    })
  }, [])


  return (
    <>
      <Accordion className="comp-accordion" selectionMode="multiple">
        {backendData.map(competitions => (
          Object.entries(competitions).map(([compName, fixtures]) => (
            <AccordionItem aria-label="" title={compName}>
              <Competition compName={compName} fixtures={fixtures} />
            </AccordionItem>
          ))
        ))}
      </Accordion>
      
    </>
  )
}

export default App
