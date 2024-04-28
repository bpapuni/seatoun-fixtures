import React, { useEffect, useState } from 'react';
import './styles/fonts.css';
import './styles/program.css';

function Program() {
    const suffixes = ["th", "st", "nd", "rd"];
    const comps = [
        "Women's Central League",
        "Men's Capital Premier",
        "Men's Capital 2",
        "Women's Capital 1",
        "Women's Capital 3",
        "Masters 1",
        "Masters Over 45's - 1",
        "Masters Over 45's - 2",
    ];

    const today = new Date();
    const currentDay = today.getDay();

    const nextMonday = new Date(today);
    const daysUntilMonday = currentDay === 0 ? 1 : 8 - currentDay;
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);
    nextMonday.setMinutes(nextMonday.getMinutes() - nextMonday.getTimezoneOffset());

    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    nextSunday.setHours(23, 59, 59, 999);
    nextSunday.setMinutes(nextSunday.getMinutes() - nextSunday.getTimezoneOffset());

    const [dataCache, setDataCache] = useState([]);

    const fetchData = async (comp) => {
        try {
          const params = {
            from: nextMonday.toISOString(),
            to: nextSunday.toISOString()
          };
          
          const url = "/api/v1/fixtures?";
          const query = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    
          const response = await fetch(url+query);
          const data = await response.json();
          const fixtures = data.flat();
    
          if (data) {
            setDataCache(fixtures);
          } else {
            console.log("Failed");
          }
          
        } catch (error) {
          console.error('Error fetching data:', error);
          // throw error;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div id="program">
            {comps.map((compName, i) => (
                <div key={i}>
                    <hr />
                    <h1>{compName}</h1>
                    {dataCache.filter(fixture => fixture.comp == compName).map((fixture, j) => (
                        <div key={j}>
                            <p>{fixture.homeTeam.includes("Seatoun") ? fixture.awayTeam : fixture.homeTeam}</p>
                            <p> 
                                {new Date(fixture.fixtureDate).toLocaleString('en-NZ', {
                                    day: 'numeric',
                                    month: 'short',
                                })}
                                {" "}
                                {new Date(fixture.fixtureDate).toLocaleString('en-NZ', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </p>
                            <p>{fixture.venue}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Program;