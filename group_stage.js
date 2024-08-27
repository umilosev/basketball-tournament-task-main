const {simulateMatch, probabilityVictory, calculateFormAdjustment} = require(`./simulate`)

// Funkcija za simulaciju grupne faze sa kolima
function simulateGroupStage(groups, formData) {
    const results = {};
    const playedMatches = new Set();

    // Inicijalizacija rezultata za sve timove u grupama
    for (const group in groups) {
        results[group] = groups[group].map(team => ({
            ...team,
            victories: 0,
            defeats: 0,
            points: 0,
            basketsScored: 0,
            receivedBaskets: 0,
            basketDifference: 0
        }));
    }

    // Definisanje mečeva za svako kolo u svakoj grupi
    const rounds = {
        '1': [
            [0, 1],
            [2, 3]
        ],
        '2': [
            [0, 3],
            [1, 2]

        ],
        '3': [
            [0, 2],
            [1, 3]
        ]
    };

    // Simulacija mečeva po kolima
    for (const round in rounds) {
        console.log(`\n---Grupna faza - Kolo ${round}---`);
        for (const group in groups) {
            const teams = groups[group];
            console.log(`\nGrupa ${group}:`);

            rounds[round].forEach(([i, j]) => {
                const team1 = teams[i];
                const team2 = teams[j];

                if (!hasMatchBeenPlayed(team1.Team, team2.Team, playedMatches)) {
                    let match
                    let forfeit = Math.round(Math.random()*1000)

                        const team1Results = results[group].find(t => t.Team === team1.Team);
                        const team2Results = results[group].find(t => t.Team === team2.Team);
                        if (forfeit <= 1) {
                            const formAdjustment = calculateFormAdjustment(team1, team2, formData);

                            const victoryProb = probabilityVictory(team1.FIBARanking, team2.FIBARanking, formAdjustment);
                            


                            if(Math.random()<victoryProb){
                                match.basketsTeam1 = 10
                                match.basketsTeam2 = 0
                                team1Results.victories += 1;
                                team1Results.points += 2;
                                team2Results.defeats += 1;
                                team2Results.points += 0;
                                saveMatchResult(team1, team2, 20, 0, formData);
                            }
                            else{
                                match.basketsTeam1 = 0
                                match.basketsTeam2 = 10
                                team2Results.victories += 1;
                                team2Results.points += 2;
                                team1Results.defeats += 1;
                                team1Results.points += 0;
                                saveMatchResult(team1, team2, 0, 20, formData);
                            }
                            
                        } else {
                            match = simulateMatch(team1, team2, formData);
                            if (match.victor.Team === team1.Team){
                            team1Results.victories += 1;
                            team1Results.points += 2;
                            team2Results.defeats += 1;
                            team2Results.points += 1;
                        } else {
                            team2Results.victories += 1;
                            team2Results.points += 2;
                            team1Results.defeats += 1;
                            team1Results.points += 1;
                        }
                    }
    
                        team1Results.basketsScored += match.basketsTeam1;
                        team1Results.receivedBaskets += match.basketsTeam2;
                        team2Results.basketsScored += match.basketsTeam2;
                        team2Results.receivedBaskets += match.basketsTeam1;
    
                        team1Results.basketDifference += (match.basketsTeam1 - match.basketsTeam2);
                        team2Results.basketDifference += (match.basketsTeam2 - match.basketsTeam1);
    
                        // Beleženje odigranog meča
                        playedMatches.add({ team1: team1.Team, team2: team2.Team });
    
                        // Ispisivanje rezultata meča
                        console.log(`  Mec ${team1.Team} - ${team2.Team} : ${match.pointsTeam1} - ${match.pointsTeam2}`);
                    
                    }
                
            });
        }
    }

    console.log("\nFinalno rangiranje nakon grupnih utakmica po grupama")

        for (const group in results) {
        const teams = results[group];
        teams.sort((a, b) => {
            if (b.points === a.points) {
                return b.basketDifference - a.basketDifference;
            }
            return b.points - a.points;
        });

        console.log(`\nGroup ${group}:`);
        teams.forEach((team, index) => {
            console.log(`${index + 1}. ${team.Team} - wins: ${team.victories}, losses: ${team.defeats}, points: ${team.points}, scored baskets: ${team.basketsScored}, received baskets: ${team.receivedBaskets}, basket difference: ${team.basketDifference}`);
        });
        console.log('');
    }

    return {
        results: results,
        playedMatches: playedMatches // Return played matches
    };
}

function hasMatchBeenPlayed(team1, team2, playedMatches) {
    return Array.from(playedMatches).some(match => 
        (match.team1 === team1 && match.team2 === team2) || 
        (match.team1 === team2 && match.team2 === team1)
    );
}

module.exports = simulateGroupStage;