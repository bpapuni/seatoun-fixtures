import React, { useEffect, useState } from 'react';
import './styles/fonts.css';
import './styles/program.css';

function Program() {
    const numOfWeeks = 4;

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

    const endDay = new Date(nextSunday);
    endDay.setDate(endDay.getDate() + numOfWeeks * 7);

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

    const [dataCache, setDataCache] = useState([]);

    const fetchData = async (comp) => {
        try {
          const params = {
            from: nextMonday.toISOString(),
            to: endDay.toISOString()
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

    const FormatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.toLocaleString("en-NZ", {
            day: "numeric",
        });
        const month = newDate.toLocaleString("en-NZ", {
            month: "short",
        });

        const suffixes = ["th", "st", "nd", "rd"];
        
        let suffix;
        if (day >= 11 && day <= 13) {
            suffix = "th"; // Use "th" for 11th, 12th, and 13th
        } else {
            suffix = suffixes[day % 10] || "th"; // Use the appropriate suffix or default to "th"
        }

        return day + suffix + " " + month;
    }

    const RenderWeeks = (index) => {
        const weeks = [];

        for(let i = 0; i < index; i++) {
            const nextMonday = new Date(today);
            const daysUntilMonday = currentDay === 0 ? 1 : 8 - currentDay;
            nextMonday.setDate(today.getDate() + daysUntilMonday + i * 7);
            nextMonday.setHours(0, 0, 0, 0);
            nextMonday.setMinutes(nextMonday.getMinutes() - nextMonday.getTimezoneOffset());
    
            const nextSunday = new Date(nextMonday + i * 7);
            nextSunday.setDate(nextMonday.getDate() + 6);
            nextSunday.setHours(23, 59, 59, 999);
            nextSunday.setMinutes(nextSunday.getMinutes() - nextSunday.getTimezoneOffset());

            weeks.push(
                <div className="program" key={i}>
                    <h2>{FormatDate(nextMonday)} - {FormatDate(nextSunday)}</h2>
                    {dataCache.filter(fixture => ((new Date(fixture.fixtureDate) >= nextMonday) && (new Date(fixture.fixtureDate) <= nextSunday))).sort((a, b) => new Date(a.fixtureDate) - new Date(b.fixtureDate)).map((fixture, j) => (
                        <div key={j}>
                            <hr />
                            <h1>{fixture.comp}</h1>
                            <p>{fixture.homeTeam.includes("Seatoun") ? fixture.awayTeam : fixture.homeTeam}</p>
                            <p> 
                                {FormatDate(fixture.fixtureDate)}
                                {" "}
                                {new Date(fixture.fixtureDate).toLocaleString("en-NZ", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </p>
                            <p>{fixture.venue}</p>
                        </div>
                    ))}
                </div>
            )
        }

        return weeks;
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div id="programs">
            {RenderWeeks(numOfWeeks)}
        </div>
    )
}

export default Program;