import { getExchangeRate } from './api.js';
import { checkDataFolder, newExchangeBox } from './utils.js';


window.onload = () => checkDataFolder(getExchangeRate, newExchangeBox);
