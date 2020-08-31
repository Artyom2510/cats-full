'use strict';

// Я уже пожалел, что сдал делать без жикури)

window.addEventListener('load', function () {
	var card = document.querySelectorAll('.js-btn-tgl');
	var cardBuy = document.querySelectorAll('.js-btn-tgl-word');
	var text;
	var defaultStr = 'Чего сидишь? Порадуй котэ,';
	var defaultLabel = 'Сказочное заморское яство';
	var negativeLabel = 'Котэ не одобряет?';
	var label;
	var dataText;

	var classSelect = 'card_selected';
	var classDisable = 'card_disable';
	var labelClass = 'btn__label_pink';

	// Возвращение defaultLabel
	function clearLabel(parent) {
		label = parent.children[0].children[0];
		label.classList.remove(labelClass);
		label.innerHTML = defaultLabel;
	}

	// Добавление активного класса, подмена текста
	function tglClass(parent) {
		text = parent.children[1].children[0];
		if (!parent.classList.contains(classSelect) && !parent.classList.contains(classDisable)) {
			parent.classList.add(classSelect);
			dataText = parent.children[0].getAttribute('data-text');
			text.innerHTML = dataText;
		} else {
			parent.classList.remove(classSelect);
			text.innerHTML = defaultStr;
			clearLabel(parent);
		}
	}

	// замена лейбла на negativeLabel
	function tglLabel(parent) {
		if (parent.classList.contains(classSelect)) {
			label = parent.children[0].children[0];
			label.classList.add(labelClass);
			label.innerHTML = negativeLabel;
		}
	}

	for (var i = 0; i < card.length; i++) {
		// Клик по всей карточке
		card[i].addEventListener('click', function () {
			tglClass(this.parentElement);
		});

		// Клик по слову - "купить"
		cardBuy[i].addEventListener('click', function () {
			tglClass(this.parentElement.parentElement);
		});

		// Пунк 6, тут я слегка запутался, что именно должно произойти
		// то ли меняться цвет бордера,
		// то ли Сказочное заморское яство
		// то ли и то и другое
		card[i].addEventListener('mouseenter', function () {
			tglLabel(this.parentElement);
		});

		card[i].addEventListener('mouseleave', function () {
			if (this.parentElement.classList.contains(classSelect)) {
				clearLabel(this.parentElement);
			}
		});
	}
});
