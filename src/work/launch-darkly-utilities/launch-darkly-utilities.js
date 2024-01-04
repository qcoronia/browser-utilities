let intervalId = setInterval(() => {
	let snackbar = document.querySelector('[data-test-id=snackbar]');
	if (!!snackbar) {
		const dismissButton = snackbar.querySelector('[data-test-id=snackbar-dismiss]');
		dismissButton.click();
		snackbar = document.querySelector('[data-test-id=snackbar]');
	}
}, 500);
setTimeout(() => clearInterval(intervalId), 10000);