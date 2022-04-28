"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAmbiguousMatches = void 0;
const matchingResult_1 = require("./matchingResult");
function generateAllPossibleMatches(sampleSolutionEntry, userSolutionEntries, generateMatch, certaintyThreshold = 0) {
    const result = [];
    const prior = [];
    const later = [...userSolutionEntries];
    while (later.length > 0) {
        // FIXME: do not use shift or else you always have to copy the array!
        const userSolutionEntry = later.shift();
        const matchAnalysis = generateMatch(sampleSolutionEntry, userSolutionEntry);
        if (matchAnalysis && matchAnalysis.certainty > certaintyThreshold) {
            result.push({
                match: { sampleSolutionEntry, userSolutionEntry, matchAnalysis },
                newNotMatchedUser: [...prior, ...later]
            });
        }
        prior.push(userSolutionEntry);
    }
    return result;
}
function findAmbiguousMatches(sampleValues, userValues, generateMatch, certaintyThreshold = 0) {
    function reductionFunc(allMatchingResults, sampleSolutionEntry) {
        return allMatchingResults.flatMap(({ matches, notMatchedUser, notMatchedSample }) => {
            const allPossibleMatches = generateAllPossibleMatches(sampleSolutionEntry, notMatchedUser, generateMatch, certaintyThreshold)
                .filter(({ match }) => match.matchAnalysis.certainty > certaintyThreshold);
            return allPossibleMatches.length === 0
                ? { matches, notMatchedUser, notMatchedSample: [...notMatchedSample, sampleSolutionEntry] }
                : allPossibleMatches.map(({ match, newNotMatchedUser }) => ({
                    matches: [...matches, match],
                    notMatchedSample,
                    notMatchedUser: newNotMatchedUser
                }));
        });
    }
    return sampleValues
        .reduce(reductionFunc, [{ matches: [], notMatchedUser: userValues, notMatchedSample: [] }])
        .sort((a, b) => (0, matchingResult_1.ambiguousMatchingResultQuality)(a) - (0, matchingResult_1.ambiguousMatchingResultQuality)(b))[0];
}
exports.findAmbiguousMatches = findAmbiguousMatches;
//# sourceMappingURL=ambiguousMatching.js.map