const express = require('express');
const cors = require('cors');
const app = express()

app.use(cors());
app.get("/api/v1/fixtures", async (req, res) => {
    // const comp = req.query.comp;
    const from = req.query.from;
    const to = req.query.to;
    const compName = req.query.compName;

    try {
        // const fixtures = await GetSeatounFixtures(comp, from, to);
        const fixtures = await GetSeatounFixtures(from, to, compName);
        res.json(fixtures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/v1/standings", async (req, res) => {
    const from = req.query.from;
    const to = req.query.to;

    try {
        const standings = await GetSeatounStandings(from, to);
        res.json(standings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/v1/nearbygames", async (req, res) => {
    // const comp = req.query.comp;
    // const from = req.query.from;
    // const to = req.query.to;

    try {
        const fixtures = await GetWakefieldFixtures();
        res.json(fixtures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/v1/gamestocsv", async (req, res) => {
    const from = new Date().toISOString();
    const to = "2024-12-01T00:00:00.000Z";
    const params = {
        from: from,
        to: to
    };

    const url = "http://192.168.20.3:3000/api/v1/fixtures?";
    const query = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    const response = await fetch(url+query);
    const data = await response.json();
    const fixtures = data.flat().sort((a, b) => new Date(a.fixtureDate) - new Date(b.fixtureDate));
    
    const jsonToCsv = (json) => {
        let csv = "";
    
        json.forEach(item => {
            const { comp, homeTeam, awayTeam, venue, fixtureDate } = item;
            const date = new Date(fixtureDate);
            const startDate = date.toLocaleDateString("en-NZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
            const startTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
            csv += `${comp} vs ${homeTeam.includes("Seatoun") ? awayTeam : homeTeam}, ${venue}, ${startDate}, ${startTime}\n`;
        });
    
        return csv;
    };

    const csvData = jsonToCsv(fixtures);
    const fileName = "data.csv";

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(csvData);
})

async function GetSeatounFixtures(from, to, compName) {
    const fixtures = [];
    const competitionIds = {
        // "Kate Sheppard Cup": 2630433561,             // Seatoun Association Football Club NOT READY
        // "Kelly Cup": 2700849949,                     // Seatoun Association Football Club
        "Masters 1" : 2702491229,                       // Seatoun AFC Gulls
        "Masters Over 45's - 1":  2702494160,           // Seatoun Vorstermans Architects 99s
        "Masters Over 45's - 2":  2702495303,           // Seatoun Originals
        "Men's Capital Premier":  2701097689,           // Seatoun AFC
        "Men's Capital 2": 2701097873,                  // Seatoun AFC Reserves
        "Women's Capital 1": 2702664070,                // Seatoun AFC Women Shanties
        "Women's Capital 3": 2702664313,                // Seatoun AFC Women Seagals
        "Women's Central League": [ 2700992533, 2700849949 ],           // Seatoun Association Football Club | WCL && Kelly Cup
    }

    async function GetSeatounFixturesForComp(compId) {
        const body = {
            "competitionId": compId,
            "orgIds": 45289,
            "from": from,
            "to": to,            
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
                "comp": Object.keys(competitionIds).find(key => (Array.isArray(competitionIds[key]) ? competitionIds[key].includes(compId) : competitionIds[key] === compId)),
                "homeTeam": fixture.HomeTeamNameAbbr,
                "awayTeam": fixture.AwayTeamNameAbbr,
                "fixtureDate": fixture.Date,
                "venue": fixture.VenueName,
                "map": `https://www.google.com/maps/search/?api=1&query=${fixture.Latitude},${fixture.Longitude}`,
                "homeScore": fixture.HomeScore,
                "awayScore": fixture.AwayScore,
                "penaltyScore": fixture.CometScore ? fixture.CometScore.match(/[\d():]+/g).join("") : null,
                "homeLogo": fixture.HomeOrgLogo,
                "awayLogo": fixture.AwayOrgLogo
            }));
            
            return match;
        }
    }
    
    if (compName) {
        if (Array.isArray(competitionIds[compName])) {
            for (let compId of competitionIds[compName]) {
                const fixture = await GetSeatounFixturesForComp(compId);
                if (fixture !== undefined) {
                    fixtures.push(fixture);
                }
            }
        } else {
            const fixture = await GetSeatounFixturesForComp(competitionIds[compName]);
            if (fixture !== undefined) {
                fixtures.push(fixture);
            }
        }
    } else {
        for (let comp in competitionIds) {
            if (Array.isArray(competitionIds[comp])) {
                for (let compId of competitionIds[comp]) {
                    const fixture = await GetSeatounFixturesForComp(compId);
                    if (fixture !== undefined) {
                        fixtures.push(fixture);
                    }
                }
            } else {
                const fixture = await GetSeatounFixturesForComp(competitionIds[comp]);
                if (fixture !== undefined) {
                    fixtures.push(fixture);
                }
            }
        }
    }
    
    return fixtures;
}

async function GetSeatounStandings(from, to) {
    const standings = [];
    const competitionIds = {
        "Masters 1" : 2702491229,                       // Seatoun AFC Gulls
        "Masters Over 45's - 1":  2702494160,           // Seatoun Vorstermans Architects 99s
        "Masters Over 45's - 2":  2702495303,           // Seatoun Originals
        "Men's Capital Premier":  2701097689,           // Seatoun AFC
        "Men's Capital 2": 2701097873,                  // Seatoun AFC Reserves
        "Women's Capital 1": 2702664070,                // Seatoun AFC Women Shanties
        "Women's Capital 3": 2702664313,                // Seatoun AFC Women Seagals
        "Women's Central League": [ 2700992533, 2700849949 ],           // Seatoun Association Football Club | WCL && Kelly Cup
    }

    async function GetSeatounStandingsForComp(compId) {
        const body = {
            "competitionId": compId,
            "phaseId": compId,
            "from": from,
            "to": to,
            "roundsOn": false,
            "sportId": "1",
            "seasonId": "2024",
        };
        
        const response = await fetch("https://www.capitalfootball.org.nz/api/1.0/competition/cometwidget/filteredstandings", {
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
            method: "POST",
            body: JSON.stringify(body),
        });
        
        const data = await response.json();
        if (data[0].Sections[0].Standings) {
            const standing = data[0].Sections[0].Standings.map(team => ({
                "comp": Object.keys(competitionIds).find(key => (Array.isArray(competitionIds[key]) ? competitionIds[key].includes(compId) : competitionIds[key] === compId)),
                "team": team.TeamName,
                "played": team.Played,
                "wins": team.Wins,
                "draws": team.Draws,
                "losses": team.Losses,
                "gd": team.Differential,
                "pts": team.StandingPoints,
            }));
            
            return standing;
        }
    }

    for (let comp in competitionIds) {
        if (Array.isArray(competitionIds[comp])) {
            for (let compId of competitionIds[comp]) {
                const standing = await GetSeatounStandingsForComp(compId);
                if (standing !== undefined) {
                    standings.push(standing);
                }
            }
        } else {
            const standing = await GetSeatounStandingsForComp(competitionIds[comp]);
            if (standing !== undefined) {
                standings.push(standing);
            }
        }
    }

    return standings;
}

async function GetWakefieldFixtures() {
    const fixtures = [];
    const competitionIds = {
        "Mens Central League": 2701371410,
        // "Mens Capital Premier": 2701097689
    }
    

    async function GetWakefieldFixturesForComp(compName) {
        const body = {
            "competitionId": competitionIds[compName],
            "orgIds": "45282,46072,45252,45257,45290,45292,45297,45296,45289,45259,282772,45293,45244,45243,44539",
            "from": "2024-04-01T00:00:00.000Z",
            "to": "2024-12-01T00:00:00.000Z",
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
                "compName": compName,
                "homeTeam": fixture.HomeTeamNameAbbr,
                "awayTeam": fixture.AwayTeamNameAbbr,
                "fixtureDate": fixture.Date,
                "venue": fixture.VenueName,
                "map": `https://www.google.com/maps/search/?api=1&query=${fixture.Latitude},${fixture.Longitude}`,
                "homeScore": fixture.HomeScore,
                "awayScore": fixture.AwayScore,
                "penaltyScore": fixture.CometScore ? fixture.CometScore.match(/[\d():]+/g).join("") : null,
                "homeLogo": fixture.HomeOrgLogo,
                "awayLogo": fixture.AwayOrgLogo
            }));
            
            return match;
        }
    }

    for (let compName in competitionIds) {
        fixtures.push(await GetWakefieldFixturesForComp(compName));
    }

    return fixtures.flat().filter(fixture => fixture.venue.includes("Wakefield Park")).sort((a, b) => new Date(a.fixtureDate) - new Date(b.fixtureDate));
}

app.listen(3001, () => {
    console.log("Server started on port 3001");
});

module.exports = app;