"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configFilePath = path_1.default.join(__dirname, '..', '..', 'BotConfig.json');
const GetConfig = () => {
    if (!fs_1.default.existsSync(configFilePath)) {
        return null;
    }
    const config = fs_1.default.readFileSync(configFilePath, 'utf-8');
    return JSON.parse(config);
};
exports.default = GetConfig;
//# sourceMappingURL=ConfigCaller.js.map