console.info('[SproutHR Safe Handling]: Activated');

if (window.location.href.includes('EmployeeDashboard')) {
	waitForElement('.clock-in-out-dropdown li:nth-child(2)')
		.then(clockOutButton => {
			const requiredOut = new Date(new Date().setHours(12+6, 30, 0, 0));
			if (new Date() > requiredOut) {
				console.info('[SproutHR Safe Handling]: Safe to Clock Out');
				return;
			}
			
			const latestLogType = document.querySelector('#dashboard-container-fluid .widget:nth-of-type(2) table tr:nth-of-type(1) td:nth-of-type(2)').innerText;
			if (latestLogType === 'IN') {
				const clone = clockOutButton.cloneNode(true);
				clone.innerHTML = clone.innerHTML.replace('Clock Out', 'Not Yet');
				const parent = clockOutButton.parentElement;
				parent.appendChild(clone);
				clockOutButton.outerHTML = '';
				console.info('[SproutHR Safe Handling]: Premature Clock Out Mitigated');
			}
		});
} else if (window.location.href.includes('my-attendance')) {
	const button = document.createElement('button');
	button.classList.add('shru-attendance-button');
	button.classList.add('btn');
	button.classList.add('btn-success');
	button.classList.add('ripple-surface');
	button.setAttribute('role', 'button');
	const span = document.createElement('span');
	span.classList.add('shru-attendance-button-text');
	span.innerText = 'Check for Warnings';
	button.appendChild(span);
	button.addEventListener('click', () => {
		console.warn('yeah');	
	});
	document.querySelector('body').appendChild(button);
}

function waitForElement(selector, interval = 200) {
	return new Promise(resolve => {
		const timer = setInterval(() => {
			const el = document.querySelector(selector);
			if (!!el) {
				clearInterval(timer);
				resolve(el);
			}
		}, interval);
	});
}