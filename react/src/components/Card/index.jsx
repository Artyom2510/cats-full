import React, {useState} from 'react';

import './index.scss';

const Card = ({kg, buy, text, desc, info}) => {

	const cardClasses = "cat-list__card card";

	const [selected, setSelected] = useState(false);
	const [approves, setApproves] = useState(false);

	const isSelected = () => {
		setSelected(selected => {
			return !selected
		});
		setApproves(false);
	}

	let classNames = cardClasses;
	let cardDesc = "Чего сидишь? Порадуй котэ, ";

	if (!buy) {
		classNames += " card_disable";
		cardDesc = `Печалька, ${desc} закончилось.`;
	}

	if (selected) {
		classNames += " card_selected";
		cardDesc = `${text}`;
	}

	const catApproves = () => {
		if (selected) {
			setApproves(true);
		}
	}

	const catApprovesClear = () => {
		if (selected) {
			setApproves(false);
		}
	}

	const textLabel = approves ? "Котэ не одобряет?" : "Сказочное заморское яство";

	return (
		<li
			className={classNames}
			onMouseEnter={catApproves}
			onMouseLeave={catApprovesClear}
		>
			<button
				className="card__wrap btn"
				data-kg={kg}
				onClick={isSelected}
			>
				<span className={approves ? "btn__label btn__label_pink" : "btn__label"}>
					{textLabel}
					<span></span>
				</span>
				<div className="btn__body">
					<p className="btn__name">Нямушка</p>
					<p className="btn__desc">{desc}</p>
					<p className="btn__info">{info}</p>
				</div>
			</button>
			<p className="card__desc">
				<span>{cardDesc}</span>
				<button
					onClick={isSelected}
				>
					купи
				</button>
			</p>
		</li>
	);
}

export default Card;