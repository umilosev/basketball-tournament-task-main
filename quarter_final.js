
/// Funkcija za generisanje parova četvrtfinala
function generateQuarterFinalMatches(qualifiedTeams) {
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
    const potD = [...pots.D]; 
    const potE = [...pots.E];
    const potF = [...pots.F];
    const potG = [...pots.G];

    quarterFinalPairs.push([potD.pop(), potG.pop()]);
    quarterFinalPairs.push([potE.pop(), potF.pop()]);
    quarterFinalPairs.push([potD.pop(), potF.pop()]);
    quarterFinalPairs.push([potE.pop(), potG.pop()]);

    console.log('\nŠeširi:');
    for (const [potName, teams] of Object.entries(pots)) {
        console.log(`\n    Šešir ${potName}`);
        teams.forEach(team => console.log(`        ${team.Team}`));
    }

    return {
        quarterFinalPairs,
        pots
    };
}

module.exports = generateQuarterFinalMatches;