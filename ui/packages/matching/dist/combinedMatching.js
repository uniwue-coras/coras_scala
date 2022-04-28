"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combinedMatchingResultQuality = exports.combinedMatching = void 0;
const certainMatching_1 = require("./certainMatching");
const ambiguousMatching_1 = require("./ambiguousMatching");
function combinedMatching(sampleValues, userValues, certainMatchFunc, assessAmbiguousMatchCertainty, certaintyThreshold = 0) {
    const { matches: certainMatches, notMatchedUser: remainingUserValues, notMatchedSample: remainingSampleValues } = (0, certainMatching_1.findCertainMatches)(sampleValues, userValues, certainMatchFunc);
    const { matches: ambiguousMatches, notMatchedUser, notMatchedSample } = (0, ambiguousMatching_1.findAmbiguousMatches)(remainingSampleValues, remainingUserValues, assessAmbiguousMatchCertainty, certaintyThreshold);
    return { certainMatches, ambiguousMatches, notMatchedUser, notMatchedSample };
}
exports.combinedMatching = combinedMatching;
function combinedMatchingResultQuality({ certainMatches, ambiguousMatches, notMatchedSample, notMatchedUser }) {
    return certainMatches.length + ambiguousMatches.map(({ matchAnalysis: { certainty } }) => certainty).reduce((acc, val) => acc + val, 0) / (certainMatches.length + ambiguousMatches.length + notMatchedSample.length + notMatchedUser.length);
}
exports.combinedMatchingResultQuality = combinedMatchingResultQuality;
//# sourceMappingURL=combinedMatching.js.map