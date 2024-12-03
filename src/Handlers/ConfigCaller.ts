import fs from 'fs';
import path from 'path';


const configFilePath = path.join(__dirname, '..', '..', 'BotConfig.json');

const GetConfig = () => {
    if (!fs.existsSync(configFilePath)) {
        return null;
    }
    const config = fs.readFileSync(configFilePath, 'utf-8');
    return JSON.parse(config);
}

export default GetConfig;