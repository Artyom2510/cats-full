import axios from 'axios';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

const CardData = async () => {
	const _apiBase = 'https://run.mocky.io/v3/ffd17f8c-8103-4f57-b1ed-74481af8bc06';

	const result = await axios(
		_apiBase
	);

	return result.data.cards;
};

export default CardData;

// {
// 	"cards": [
// 		{
// 			"id": "0",
// 			"kg": "0,5",
// 			"desc": "с фуа-гра",
// 			"info": "10 порций мышь в подарок",
// 			"buy": true,
// 			"text": "Печень утки разварная с артишоками",
// 			"amoun": "2"
// 		},
// 		{
// 			"id": "1",
// 			"kg": "2",
// 			"label": "Сказочное заморское яство",
// 			"desc": "с рыбой",
// 			"info": "40 порций 2 мыши в подарок",
// 			"buy": true,
// 			"text": "Головы щучьи с чесноком да свежайщая сёмга",
// 			"amoun": "5"
// 		},
// 		{
// 			"id": "3",
// 			"kg": "5",
// 			"label": "Сказочное заморское яство",
// 			"desc": "с курой",
// 			"info": "100 порций 5 мышей в подарок заказчик доволен",
// 			"buy": false,
// 			"text": "Печалька, с курой закончилось.",
// 			"amoun": "1"
// 		}
// 	]
// }