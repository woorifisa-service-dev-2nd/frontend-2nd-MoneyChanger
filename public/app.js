import { getExchangeRate } from './api.js';
import { checkDataFolder, newExchangeBox } from './utils.js';


window.onload = () => checkDataFolder().then(() => getExchangeRate().then((data) => newExchangeBox(data)));
