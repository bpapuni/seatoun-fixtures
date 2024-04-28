import React, { useEffect, useState } from 'react';
import './styles/fonts.css';
import './styles/standings.css';

function Standings() {
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
    const [dataCache, setDataCache] = useState([]);

    const fetchData = async (comp) => {
        try {
          const params = {
            from: "2024-03-01T00:00:00.000Z",
            to: "2024-12-01T00:00:00.000Z"
          };
          
          const url = "/api/v1/standings?";
          const query = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    
          const response = await fetch(url+query);
          const data = await response.json();
          const standings = data.flat();
    
          if (data) {
            setDataCache(standings);
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
        <div id="standings">
            {comps.map((compName, i) => (
                <div key={i} className="standing">
                    <hr />
                    <h1>{compName}</h1>
                    {dataCache.filter(team => team.comp == compName).map((standing, i) => (
                        <div key={i}>
                            <span className="team column">{standing.team.includes("Seatoun") ? <b>{standing.team}</b> : standing.team}</span>
                            <span className="column">{standing.team.includes("Seatoun") ? <b>{standing.played}</b> : standing.played}</span>
                            <span className="column">{standing.team.includes("Seatoun") ? <b>{standing.wins}</b> : standing.wins}</span>
                            <span className="column">{standing.team.includes("Seatoun") ? <b>{standing.draws}</b> : standing.draws}</span>
                            <span className="column">{standing.team.includes("Seatoun") ? <b>{standing.losses}</b> : standing.losses}</span>
                            <span className="column">{standing.team.includes("Seatoun") ? <b>{standing.gd}</b> : standing.gd}</span>
                            <span className="points column">{standing.team.includes("Seatoun") ? <b>{standing.pts}</b> : standing.pts}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Standings;