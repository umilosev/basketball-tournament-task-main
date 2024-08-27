const fs = require('fs');

// Funkcija za učitavanje JSON fajla
function loadFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Greška prilikom čitanja fajla:", err);
        return null;
    }
}

// Funkcija za izračunavanje verovatnoće pobede uzimajući u obzir formu
function probabilityVictory(rankA, rankB, formA = 1, formB = 1, k = 0.2) {
    const deltaRank = rankA - rankB;
    return 1 / (1 + Math.exp(k * deltaRank));
}

// Simulacija utakmice uz formu
function simulateMatch(team1, team2, formData) {
    if (!team1 || !team2) {
        console.error("One of the teams is undefined:", { team1, team2 });
        return null; // or handle the error appropriately
    }

    const formTeam1 = formData[team1.Team] || 1;
    const formTeam2 = formData[team2.Team] || 1;
    const victoryProb = probabilityVictory(team1.FIBARanking, team2.FIBARanking);

    // Promenljive za broj trojki i dvojki
    let threes1, twos1, threes2, twos2;
    let whoWon = Math.random()

    // Određivanje pobednika i prilagođavanje poena
    if (whoWon < victoryProb) {
        threes1 = (Math.random() * 20) + 10;
        twos1 = (Math.random() * 20) + 8;

        threes2 = (Math.random() * 15)+5;
        twos2 = (Math.random() * 18) +2;
    } else {
        threes1 = (Math.random() * 15) +5;
        twos1 = (Math.random() * 18) +2;

        threes2 = (Math.random() * 15) + 10;
        twos2 = (Math.random() * 18) + 8;
    } 

    if (whoWon == victoryProb){
        threes1 = (Math.random() * 20);
        twos1 = (Math.random() * 20);

        threes2 = (Math.random() * 20);
        twos2 = (Math.random() * 20);
    }


    basketsTeam1 = Math.round(threes1)+Math.round(twos1)
    basketsTeam2 = Math.round(threes2)+Math.round(twos2)

    // Izračunavanje ukupnih poena
    let pointsTeam1 = Math.round(threes1) * 3 + Math.round(twos1) * 2;
    let pointsTeam2 = Math.round(threes2) * 3 + Math.round(twos2) * 2;
    let defeated, victor

    if(pointsTeam1===pointsTeam2){
        victor = team1
        defeated = team1
    }
    else{
        // Određivanje pobednika
        victor = pointsTeam1 > pointsTeam2 ? team1 : team2;
        defeated = victor === team1 ? team2 : team1
    }

    return {
        victor: victor,
        defeated: defeated,
        basketsTeam1 :basketsTeam1,
        basketsTeam2 : basketsTeam2,
        pointsTeam1: pointsTeam1,
        pointsTeam2: pointsTeam2
    };
}

function hasMatchBeenPlayed(team1, team2, playedMatches) {
    return Array.from(playedMatches).some(match => 
        (match.team1 === team1 && match.team2 === team2) || 
        (match.team1 === team2 && match.team2 === team1)
    );
}


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
            draws: 0,
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
        console.log(`\nKolo ${round}:`);
        for (const group in groups) {
            const teams = groups[group];
            console.log(`Grupa ${group}:`);

            rounds[round].forEach(([i, j]) => {
                const team1 = teams[i];
                const team2 = teams[j];

                if (!hasMatchBeenPlayed(team1.Team, team2.Team, playedMatches)) {
                    const match = simulateMatch(team1, team2, formData);

                    const team1Results = results[group].find(t => t.Team === team1.Team);
                    const team2Results = results[group].find(t => t.Team === team2.Team);
                    if(match.victor.Team === team1.Team && match.defeated.Team === team1.Team){
                        team1Results.draws +=1;
                        team1Results.points +=1;
                        team2Results.draws +=1;
                        team2Results.points +=1;
                    }
                    if (match.victor.Team === team1.Team) {
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

    return {
        results: results,
        playedMatches: playedMatches // Return played matches
    };
}


// Funkcija za prikaz konačnog rangiranja
function displayFinalRanking(results) {
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
            console.log(`${index + 1}. ${team.Team} - wins: ${team.victories}, losses: ${team.defeats},draws : ${team.draws}, points: ${team.points}, scored baskets: ${team.basketsScored}, received baskets: ${team.receivedBaskets}, basket difference: ${team.basketDifference}`);
        });
        console.log('');
    }
}

function getQualifiedTeams(results) {
    // Prikupi sve timove iz svih grupa
    let allTeams = [];
    for (const group in results) {
        allTeams = allTeams.concat(results[group]);
    }

    // Sortiraj timove prema bodovima, koš razlici i broju postignutih koševa
    allTeams.sort((a, b) => {
        if (b.points === a.points) {
            if (b.basketDifference === a.basketDifference) {
                return b.basketsScored - a.basketsScored;
            }
            return b.basketDifference - a.basketDifference;
        }
        return b.points - a.points;
    });

    // Izaberi 9 najboljih timova (za pretpostavku da treba 8 timova za eliminacionu fazu)
    const qualifiedTeams = allTeams.slice(0, 8);

    console.log("Qualified teams for elimination phase:");
    qualifiedTeams.forEach((team, index) => {
        console.log(`${index + 1}. ${team.Team} - points: ${team.points}, basket difference: ${team.basketDifference}, baskets scored: ${team.basketsScored}`);
    });

    return qualifiedTeams;
}


/// Funkcija za generisanje parova četvrtfinala
function generateQuarterFinalMatches(qualifiedTeams, groupResults) {
    // Generisanje parova četvrtfinala
    const quarterFinalPairs = [];
    const pots = {
        D: [],
        E: [],
        F: [],
        G: []
    };

    // Podela timova u šešire
    qualifiedTeams.forEach((team, index) => {
        if (index < 2) {
            pots.D.push(team);
        } else if (index < 4) {
            pots.E.push(team);
        } else if (index < 6) {
            pots.F.push(team);
        } else {
            pots.G.push(team);
        }
    });

    // Generisanje parova četvrtfinala
    const potD = [...pots.D]; // Kopiranje potova
    const potE = [...pots.E];
    const potF = [...pots.F];
    const potG = [...pots.G];

    quarterFinalPairs.push([potD.pop(), potG.pop()]);
    quarterFinalPairs.push([potE.pop(), potF.pop()]);
    quarterFinalPairs.push([potD.pop(), potF.pop()]);
    quarterFinalPairs.push([potE.pop(), potG.pop()]);

    return {
        quarterFinalPairs,
        pots
    };
}

// Funkcija za generisanje parova polufinala
function generateSemiFinalMatches(quarterFinalPairs) {
    const semiFinalPairs = [];

    // Razdvajanje parova u dve grupe: D-E i F-G
    const dePairs = quarterFinalPairs.filter(pair =>
        (pair.teamA.rank <= 2 && pair.teamB.rank > 6) ||
        (pair.teamA.rank > 6 && pair.teamB.rank <= 2)
    );

    const fgPairs = quarterFinalPairs.filter(pair =>
        (pair.teamA.rank > 2 && pair.teamA.rank <= 4 && pair.teamB.rank > 2 && pair.teamB.rank <= 4) ||
        (pair.teamA.rank > 4 && pair.teamA.rank <= 6 && pair.teamB.rank > 4 && pair.teamB.rank <= 6)
    );

    // Formiranje parova polufinala
    if (dePairs.length === 2 && fgPairs.length === 2) {
        semiFinalPairs.push({ teamA: dePairs[0].teamA, teamB: fgPairs[0].teamA });
        semiFinalPairs.push({ teamA: dePairs[1].teamB, teamB: fgPairs[1].teamB });
    }

    return semiFinalPairs;
}

// Funkcija za prikaz timova po šeširima i eliminacione faze
function displayDraw(pots) {
    console.log('\nŠeširi:');
    for (const [potName, teams] of Object.entries(pots)) {
        console.log(`\n    Šešir ${potName}`);
        teams.forEach(team => console.log(`        ${team.Team}`));
    }
}

function displayQuarterFinalBracket(quarterFinalPairs) {
    console.log("\nQuarterfinals Bracket:\n");
    quarterFinalPairs.forEach((team, index) => {
        console.log(`   Match ${index + 1}: ${team[0].Team} vs ${team[1].Team}\n`);
    });
}

// Definišemo main funkciju
function main() {
    const filePath = './groups.json';
    const groups = loadFile(filePath);
    const exhibitions = loadFile('./exhibitions.json');

    if (groups && exhibitions) {
        console.log("Početak simulacije utakmica po grupama.\n");
        const { results, playedMatches } = simulateGroupStage(groups, exhibitions);

        console.log("\nFinalno rangiranje nakon grupnih utakmica po grupama")
        displayFinalRanking(results);

        console.log("Prikaz kvalifikovanih timova nakon grupne faze\n");
    
        const qualifiedTeams = getQualifiedTeams(results); // Ova funkcija treba da vrati timove koji su prošli u četvrtfinale

        const {quarterFinalPairs,pots} = generateQuarterFinalMatches(qualifiedTeams, playedMatches); // playedMatches treba da sadrži rezultate grupne faze
        

        displayDraw(pots);
        displayQuarterFinalBracket(quarterFinalPairs)

        
    } else {
        console.log("Nije moguće učitati podatke o grupama ili prijateljskim utakmicama.");
    }
}

// Pokretanje main funkcije
main();