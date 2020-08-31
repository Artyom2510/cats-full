import React from 'react';

import List from '../List';

import './index.scss';

const App = () => {
	return (
		<main className="main">
			<div className="main__container">
				<h1 className="main__title">Ты сегодня покормил кота?</h1>
				<List />
			</div>
		</main>
	);
}

export default App;
