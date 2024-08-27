const {simulateMatch, probabilityVictory, calculateFormAdjustment} = require(`./simulate`)

function simulateQuarterFinalBracket(quarterFinalPairs, formData) {
    console.log("\nCetvrtfinale :\n");
    
    const quarterFinalWinners = [];
    
    quarterFinalPairs.forEach((pair, index) => {
        const result = simulateMatch(pair[0], pair[1], formData);
        console.log(`   Cetvrtfinale mec ${index + 1}: ${pair[0].Team} vs ${pair[1].Team}`);
        console.log(`   Rezultat: ${result.pointsTeam1} - ${result.pointsTeam2}`);
        
        // cuvamo pobednike zbog polufinala
        quarterFinalWinners.push(result.victor);
    });
    
    return quarterFinalWinners;
}

function simulateSemiFinalsAndFinal(semiFinalPairs, formData) {
    console.log("\nPolufinale :\n");

    const finalPair = [];
    const thirdPlacePair = [];

    // prvo polufinale
    let matchResult1 = simulateMatch(semiFinalPairs[0], semiFinalPairs[1], formData);
    console.log(`   Polufinale mec 1: ${semiFinalPairs[0].Team} vs ${semiFinalPairs[1].Team}`);
    console.log(`   Rezultat: ${matchResult1.pointsTeam1} - ${matchResult1.pointsTeam2}`);

    // drugo polufinale
    let matchResult2 = simulateMatch(semiFinalPairs[2], semiFinalPairs[3], formData);
    console.log(`   Polufinale mec 2: ${semiFinalPairs[2].Team} vs ${semiFinalPairs[3].Team}`);
    console.log(`   Rezultat: ${matchResult2.pointsTeam1} - ${matchResult2.pointsTeam2}`);

    finalPair.push(matchResult1.victor, matchResult2.victor);
    thirdPlacePair.push(matchResult1.defeated, matchResult2.defeated);

    // Trece mesto 
    console.log("\nTrece mesto mec:\n");
    const thirdPlaceResult = simulateMatch(thirdPlacePair[0], thirdPlacePair[1], formData);
    console.log(`   ${thirdPlacePair[0].Team} vs ${thirdPlacePair[1].Team}`);
    console.log(`   Rezultat: ${thirdPlaceResult.pointsTeam1} - ${thirdPlaceResult.pointsTeam2}`);



    // finale 
    console.log("\nFinale:\n");
    const finalResult = simulateMatch(finalPair[0], finalPair[1], formData);
    console.log(`   ${finalPair[0].Team} vs ${finalPair[1].Team}`);
    console.log(`   Rezultat : ${finalResult.pointsTeam1} - ${finalResult.pointsTeam2}`)

    console.log(`\n------------------------\n\n   Zlatnja medalja: ${finalResult.victor.Team}`);
    console.log(`   Srebrna medalja: ${finalResult.defeated.Team}`);
    console.log(`   Bronzana medalja: ${thirdPlaceResult.victor.Team}\n`);

}



module.exports = {
    simulateQuarterFinalBracket, 
    simulateSemiFinalsAndFinal
};