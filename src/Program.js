import React, { useEffect, useState } from 'react';
import './styles/fonts.css';
import './styles/program.css';
import {Spinner} from "@nextui-org/react";

function Program() {
    const from = "2024-03-25T00:00:00.000Z";
    const to = "2024-09-09T00:00:00.000Z";

    const numOfWeeks = Math.floor((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24 * 7));

    const today = new Date();
    const currentDay = today.getDay();

    const [dataCache, setDataCache] = useState([]);

    const fetchData = async (comp) => {
        try {
          const params = {
            // from: nextMonday.toISOString(),
            // to: endDay.toISOString()
            from: from,
            to: to
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
          console.log(error)
          window.location = window.location;
          // throw error;
        }
    };

    const FormatDate = (date) => {
        const newDate = new Date(date);
        if (!newDate) {
            return;
        }
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
            const monday = new Date(from);
            monday.setDate(monday.getDate() + i * 7);
            monday.setHours(0, 0, 0, 0);
            // monday.setMinutes(monday.getMinutes() - monday.getTimezoneOffset());
    
            const nextSunday = new Date(monday);
            nextSunday.setDate(monday.getDate() + 6);
            nextSunday.setHours(23, 59, 59, 999);
            // nextSunday.setMinutes(nextSunday.getMinutes() - nextSunday.getTimezoneOffset());

            weeks.push(
                <div className="program" key={i}>
                    <h2>{FormatDate(monday)} - {FormatDate(nextSunday)}</h2>
                    {dataCache.filter(fixture => ((new Date(fixture.fixtureDate) >= monday) && (new Date(fixture.fixtureDate) <= nextSunday))).sort((a, b) => new Date(a.fixtureDate) - new Date(b.fixtureDate)).map((fixture, j) => (
                        <div key={j}>
                            <hr />
                            <h1>{fixture.comp}</h1>
                            <p>{fixture.homeTeam.includes("Seatoun") ? fixture.awayTeam : fixture.homeTeam}</p>
                            <p> 
                                {FormatDate(fixture.fixtureDate)}
                                {" "}
                                {fixture.homeTeam != "Bye" && fixture.awayTeam != "Bye" && new Date(fixture.fixtureDate).toLocaleString("en-NZ", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </p>
                            <p>{!fixture.homeScore && fixture.venue}</p>
                            <p>
                                {
                                    fixture.homeScore && fixture.homeTeam != "Bye" && fixture.awayTeam != "Bye" && (
                                    (fixture.homeTeam.includes("Seatoun") && fixture.homeScore > fixture.awayScore) && `Won ${fixture.homeScore} - ${fixture.awayScore}` ||
                                    (fixture.homeTeam.includes("Seatoun") && fixture.awayScore > fixture.homeScore) && `Lost ${fixture.awayScore} - ${fixture.homeScore}` ||
                                    (fixture.awayTeam.includes("Seatoun") && fixture.awayScore > fixture.homeScore) && `Won ${fixture.awayScore} - ${fixture.homeScore}` ||
                                    (fixture.awayTeam.includes("Seatoun") && fixture.homeScore > fixture.awayScore) && `Lost ${fixture.homeScore} - ${fixture.awayScore}` ||
                                    (fixture.homeScore == fixture.awayScore && fixture.penaltyScore && fixture.homeTeam.includes("Seatoun") && fixture.penaltyScore.match(/(\d+):(\d+)/)[1] > fixture.penaltyScore.match(/(\d+):(\d+)/)[2]) && `Won ${fixture.homeScore} - ${fixture.awayScore} ${fixture.penaltyScore}` ||
                                    (fixture.homeScore == fixture.awayScore && fixture.penaltyScore && fixture.homeTeam.includes("Seatoun") && fixture.penaltyScore.match(/(\d+):(\d+)/)[2] > fixture.penaltyScore.match(/(\d+):(\d+)/)[1]) && `Lost ${fixture.homeScore} - ${fixture.awayScore} ${fixture.penaltyScore}` ||
                                    (fixture.homeScore == fixture.awayScore && fixture.penaltyScore && fixture.awayTeam.includes("Seatoun") && fixture.penaltyScore.match(/(\d+):(\d+)/)[2] > fixture.penaltyScore.match(/(\d+):(\d+)/)[1]) && `Won ${fixture.homeScore} - ${fixture.awayScore} ${fixture.penaltyScore}` ||
                                    (fixture.homeScore == fixture.awayScore && fixture.penaltyScore && fixture.awayTeam.includes("Seatoun") && fixture.penaltyScore.match(/(\d+):(\d+)/)[1] > fixture.penaltyScore.match(/(\d+):(\d+)/)[2]) && `Lost ${fixture.homeScore} - ${fixture.awayScore} ${fixture.penaltyScore}` ||
                                    (fixture.homeScore == fixture.awayScore) && `Draw ${fixture.homeScore} - ${fixture.awayScore}`
                                )}
                            </p>
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
            {dataCache.length > 0 ? RenderWeeks(numOfWeeks) : <Spinner size="lg" className="w-full" label="Loading data..." />}
        </div>
    )
}

export default Program;