"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certainMatchingResultQuality = exports.ambiguousMatchingResultQuality = exports.findCertainMatches = exports.combinedMatchingResultQuality = exports.combinedMatching = exports.findAmbiguousMatches = void 0;
var ambiguousMatching_1 = require("./ambiguousMatching");
Object.defineProperty(exports, "findAmbiguousMatches", { enumerable: true, get: function () { return ambiguousMatching_1.findAmbiguousMatches; } });
var combinedMatching_1 = require("./combinedMatching");
Object.defineProperty(exports, "combinedMatching", { enumerable: true, get: function () { return combinedMatching_1.combinedMatching; } });
Object.defineProperty(exports, "combinedMatchingResultQuality", { enumerable: true, get: function () { return combinedMatching_1.combinedMatchingResultQuality; } });
var certainMatching_1 = require("./certainMatching");
Object.defineProperty(exports, "findCertainMatches", { enumerable: true, get: function () { return certainMatching_1.findCertainMatches; } });
var matchingResult_1 = require("./matchingResult");
Object.defineProperty(exports, "ambiguousMatchingResultQuality", { enumerable: true, get: function () { return matchingResult_1.ambiguousMatchingResultQuality; } });
Object.defineProperty(exports, "certainMatchingResultQuality", { enumerable: true, get: function () { return matchingResult_1.certainMatchingResultQuality; } });
//# sourceMappingURL=index.js.map