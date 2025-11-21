"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveJson = exports.loadJson = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function loadJson(file) {
    const content = await fs_1.default.promises.readFile(file, 'utf8');
    return JSON.parse(content);
}
exports.loadJson = loadJson;
async function saveJson(file, data) {
    const content = JSON.stringify(data, null, 2);
    await fs_1.default.promises.mkdir(path_1.default.dirname(file), { recursive: true });
    await fs_1.default.promises.writeFile(file, content);
}
exports.saveJson = saveJson;
//# sourceMappingURL=json.js.map