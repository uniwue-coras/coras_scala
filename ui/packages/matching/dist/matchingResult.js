"use strict";
// Certain matches
Object.defineProperty(exports, "__esModule", { value: true });
exports.ambiguousMatchingResultQuality = exports.certainMatchingResultQuality = void 0;
function certainMatchingResultQuality({ matches, notMatchedUser, notMatchedSample }) {
    return matches.length / (matches.length + notMatchedUser.length + notMatchedSample.length);
}
exports.certainMatchingResultQuality = certainMatchingResultQuality;
function ambiguousMatchingResultQuality({ matches }) {
    // FIXME: baloney...
    return matches.reduce((a, b) => a + b.matchAnalysis.certainty, 0);
}
exports.ambiguousMatchingResultQuality = ambiguousMatchingResultQuality;
//# sourceMappingURL=matchingResult.js.map