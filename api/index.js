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
        "Kate Sheppard Cup": 2630433561,                // Seatoun Association Football Club
        "Kelly Cup": 2600922677,                        // Seatoun Association Football Club
        "Masters 2":  2656200449,                       // Seatoun AFC Masters
        "Masters 4":  2656238270,                       // IBU Seatoun Qnited
        "Masters Over 45's - Top 8":  2695624069,       // Seatoun Vorstermans Architects 99s
        "Masters Over 45's - Bottom 4":  2695624290,    // Seatoun Originals
        "Men's Capital Premier":  2619536530,           // Seatoun AFC
        "Men's Capital 2": 2642142077,                  // Seatoun AFC Reserves
        "Wellington 1": 2695087789,                     // Seatoun AFC Thirds
        "Women's Capital 1": 2695317873,                // Seatoun AFC Women Shanties
        "Women's Capital 3": 2695320403,                // Seatoun AFC Women Seagals
        // "Women's Central League": 2617950277,           // Seatoun Association Football Club
        "Women's Central League": 2700992533,           // Seatoun Association Football Club
    }

    // const teamComps = {
    //     45282: [ competitionIds["Masters 4"] ],
    //     45289: [ competitionIds["Masters 2"], competitionIds["Masters Over 45's - Top 8"], competitionIds["Masters Over 45's - Bottom 4"], 
    //              competitionIds["Men's Capital Premier"], competitionIds["Men's Capital 2"], competitionIds["Women's Capital 1"], competitionIds["Women's Capital 3"],
    //              competitionIds["Kate Sheppard Cup"], competitionIds["Kelly Cup"], competitionIds["Women's Central League"] ]
    // }

    const body = {
        "competitionId": competitionIds[comp],
        "orgIds": comp === "Masters 4" ? 45282 : 45289,
        "from": from,
        "to": to,
        // "from": "2024-04-01T00:00:00.000Z",
        // "to": "2024-05-01T00:00:00.000Z",
        "sportId": "1",
        "seasonId": "2024",
        "gradeIds": "SENIORS",
    };

    // console.log(body);

    const fixtures = await fetch("https://www.capitalfootball.org.nz/api/1.0/competition/cometwidget/filteredfixtures", {
        headers: {
            "content-type": "application/json; charset=UTF-8",
        },
        method: "POST",
        body: JSON.stringify(body),
    })
    .then(res => res.json())
    .then(data => {
        if (data.fixtures.length > 0) {
            const matches = [];
            for (let i = data.fixtures.length - 1; i >= data.fixtures.length - 5; i--) {
                if (data.fixtures[i] == null) { break; }
                matches.push({
                    "homeTeam": data.fixtures[i].HomeTeamNameAbbr,
                    "awayTeam": data.fixtures[i].AwayTeamNameAbbr,
                    "fixtureDate": new Date(data.fixtures[i].Date),
                    "venue": data.fixtures[i].VenueName,
                    "homeScore": data.fixtures[i].HomeScore,
                    "awayScore": data.fixtures[i].AwayScore,
                    "homeLogo": data.fixtures[i].HomeOrgLogo,
                    "awayLogo": data.fixtures[i].AwayOrgLogo
                });
            }
            
            return matches;
        }
    })
    .catch(error => {
        console.error(error);
    });

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
