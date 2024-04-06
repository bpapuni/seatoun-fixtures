const express = require('express');
const cors = require('cors');
const app = express()

app.use(cors());
app.get("/api/v1/fixtures", async (req, res) => {
    const comp = req.query.comp;
    const from = req.query.from;
    const to = req.query.to;

    try {
        const fixtures = await fetchAndOrganizeFixtures(comp, from, to);
        res.json(fixtures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function fetchAndOrganizeFixtures(comp, from, to) {
    const competitionIds = {
        // "Kate Sheppard Cup": 2630433561,             // Seatoun Association Football Club NOT READY
        // "Kelly Cup": 2700849949,                        // Seatoun Association Football Club
        "Masters 1" : 2702491229,                       // Seatoun AFC Gulls
        "Masters Over 45's - 1":  2702494160,           // Seatoun Vorstermans Architects 99s
        "Masters Over 45's - 2":  2702495303,           // Seatoun Originals
        "Men's Capital Premier":  2701097689,           // Seatoun AFC
        "Men's Capital 2": 2701097873,                  // Seatoun AFC Reserves
        "Women's Capital 1": 2702664070,                // Seatoun AFC Women Shanties
        "Women's Capital 3": 2702664316,                // Seatoun AFC Women Seagals
        "Women's Central League": [ 2700992533, 2700849949 ],           // Seatoun Association Football Club
    }
    
    const fixtures = [];
    async function feeeetch(compId) {
        const body = {
            "competitionId": compId,
            "orgIds": comp === "Masters 4" ? 45282 : 45289,
            "from": from,
            "to": to,
            // "from": "2024-04-01T00:00:00.000Z",
            // "to": "2024-05-01T00:00:00.000Z",
            
            "sportId": "1",
            "seasonId": "2024",
            "gradeIds": "SENIORS",
        };
        
        const response = await fetch("https://www.capitalfootball.org.nz/api/1.0/competition/cometwidget/filteredfixtures", {
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
            method: "POST",
            body: JSON.stringify(body),
        });
        
        const data = await response.json();
        if (data.fixtures && data.fixtures.length > 0) {
            const match = data.fixtures.map(fixture => ({
                "homeTeam": fixture.HomeTeamNameAbbr,
                "awayTeam": fixture.AwayTeamNameAbbr,
                "fixtureDate": fixture.Date,
                "venue": fixture.VenueName,
                "map": `https://www.google.com/maps/search/?api=1&query=${fixture.Latitude},${fixture.Longitude}`,
                "homeScore": fixture.HomeScore,
                "awayScore": fixture.AwayScore,
                "homeLogo": fixture.HomeOrgLogo,
                "awayLogo": fixture.AwayOrgLogo
            }));
            
            fixtures.push(match);
        }
    }

    if (Array.isArray(competitionIds[comp])) {
        for (let compId of competitionIds[comp]) {
            await feeeetch(compId);
        }
    } else {
        await feeeetch(competitionIds[comp]);
    }
    
    // let fixtures = null;
    // async function fetchDataWithRetries() {
    //     const maxRetries = 3;
    //     let retries = 0;

    //     while (retries < maxRetries) {
    //         try {
    //             const response = await fetch("https://www.capitalfootball.org.nz/api/1.0/competition/cometwidget/filteredfixtures", {
    //                 headers: {
    //                     "content-type": "application/json; charset=UTF-8",
    //                 },
    //                 method: "POST",
    //                 body: JSON.stringify(body),
    //             });
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             if (data.fixtures && data.fixtures.length > 0) {
    //                 const matches = data.fixtures.map(fixture => ({
    //                     "homeTeam": fixture.HomeTeamNameAbbr,
    //                     "awayTeam": fixture.AwayTeamNameAbbr,
    //                     "fixtureDate": fixture.Date,
    //                     "venue": fixture.VenueName,
    //                     "map": `https://www.google.com/maps/search/?api=1&query=${fixture.Latitude},${fixture.Longitude}`,
    //                     "homeScore": fixture.HomeScore,
    //                     "awayScore": fixture.AwayScore,
    //                     "homeLogo": fixture.HomeOrgLogo,
    //                     "awayLogo": fixture.AwayOrgLogo
    //                 }));
    //                 return matches;
    //             }
    //         } catch (error) {
    //             console.error('Fetch error:', error);
    //             retries++;
    //             console.log(`Retrying (${retries}/${maxRetries})...`);
    //             await new Promise(resolve => setTimeout(resolve, 1000)); // Delay before retrying
    //         }
    //     }
    //     throw new Error('Max retries reached');
    // }

    // // Call the fetch function with retries
    // try {
    //     fixtures = await fetchDataWithRetries();
    // } catch (error) {
    //     console.error('Failed to retrieve fixtures:', error);
    //     // Handle failure
    // }
    return fixtures;
}


function getKeyByValue(object, value) {
    for (const key in object) {
        if (object[key] === value) {
            return key;
        }
    }
    return null;
}

app.listen(3001, () => {
    console.log("Server started on port 3001")
})

module.exports = app
