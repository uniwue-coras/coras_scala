"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCertainMatches = void 0;
function findSingleCertainMatch(sampleSolutionEntry, userSolutionEntries, checkFunc) {
    function reductionFunc({ match, checkedUserSolutionEntries }, userSolutionEntry) {
        if (match) {
            // A match was already found, ignore this sample value
            return { match, checkedUserSolutionEntries: [...checkedUserSolutionEntries, userSolutionEntry] };
        }
        else {
            return checkFunc(sampleSolutionEntry, userSolutionEntry)
                ? { match: { sampleSolutionEntry, userSolutionEntry }, checkedUserSolutionEntries }
                : { checkedUserSolutionEntries: [...checkedUserSolutionEntries, userSolutionEntry] };
        }
    }
    const { match, checkedUserSolutionEntries } = userSolutionEntries.reduce(reductionFunc, { checkedUserSolutionEntries: [] });
    return match
        ? { match, remainingUserSolutionEntries: checkedUserSolutionEntries }
        : undefined;
}
function findCertainMatches(sampleValues, userValues, checkFunc) {
    return sampleValues.reduce(({ matches, notMatchedUser, notMatchedSample }, currentSampleValue) => {
        const maybeMatch = findSingleCertainMatch(currentSampleValue, notMatchedUser, checkFunc);
        if (!maybeMatch) {
            return { matches, notMatchedUser, notMatchedSample: [...notMatchedSample, currentSampleValue] };
        }
        const { match, remainingUserSolutionEntries } = maybeMatch;
        return { matches: [...matches, match], notMatchedSample, notMatchedUser: remainingUserSolutionEntries };
    }, { matches: [], notMatchedUser: userValues, notMatchedSample: [] });
}
exports.findCertainMatches = findCertainMatches;
//# sourceMappingURL=certainMatching.js.map