const simulateGroupStage = require('./group_stage');
const generateQuarterFinalMatches = require('./quarter_final');
const {simulateQuarterFinalBracket, simulateSemiFinalsAndFinal} = require('./elim_matches');
const getQualifiedTeams = require('./qualification');
const loadFile = require('./load_file');



// Function to simulate the entire tournament
function simulateTournament() {
    let formData = loadFile('exhibitions.json');
    const groups = loadFile('groups.json');

    if (groups && formData) {
        console.log("Početak simulacije utakmica po grupama.");

        const { results, playedMatches } = simulateGroupStage(groups, formData);

        console.log("\nPrikaz kvalifikovanih timova nakon grupne faze\n");
    
        const qualifiedTeams = getQualifiedTeams(results); // Ova funkcija treba da vrati timove koji su prošli u četvrtfinale

        let {quarterFinalPairs, pots} = generateQuarterFinalMatches(qualifiedTeams, playedMatches); // playedMatches treba da sadrži rezultate grupne faze, dok su qualified teams, samo timovi odvojeni od grupa

        formData = loadFile('exhibitions.json');

        let quarterFinalWinners = simulateQuarterFinalBracket(quarterFinalPairs, formData)

        formData = loadFile('exhibitions.json');

        simulateSemiFinalsAndFinal(quarterFinalWinners,formData)
        
    } else {
        console.log("Nije moguće učitati podatke o grupama ili prijateljskim utakmicama.");
    }

}

simulateTournament();