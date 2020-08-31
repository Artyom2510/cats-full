import React, {useState, useEffect} from 'react';
import CardData from '../../api/card-data';

import Card from '../Card';

import './index.scss';

const List = () => {

	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const res = await CardData();
			setCards(res);
			setLoading(false);
		};

		fetchData();
	}, []);

	return (
		<>
			{
				loading ? <h1 className="main__title">Loading...</h1> :
				<ul className="main__cats cat-list">
					{cards.map(card =>
						<Card key={card.id} {...card}/>
					)}
				</ul>
			}
		</>
	);

}

export default List;