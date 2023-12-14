class PreventAutoPause {
	constructor() {
		this.intervalId = 0;
		this.observer = null;
	}
	
	start() {
		const isInPlaylist = window.location.href.includes('&list=');
		if (!isInPlaylist) {
			console.warn('[Auto Dismiss Safety Warning]: not in playlist');
			return;
		}
		
		const onVisible = (element, callback) => {
            new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if(entry.intersectionRatio > 0) {
                        callback(element);
                    }
                });
            }).observe(element);
        };
		
		this.intervalId = setInterval(function () {
			const dialog = document.querySelector("yt-confirm-dialog-renderer");
			if (!dialog) {
				console.warn('[Prevent Auto Pause]: no dialog');
				return;
			} else if (!this.observer) {
				this.observer = onVisible(dialog, _ => {
					const button = document.querySelector("#confirm-button > yt-button-shape > button");
					if (!!button) {
						button.click();
						console.warn('[Prevent Auto Pause]: auto-pause mitigated');
					} else {
						console.warn('[Prevent Auto Pause]: no dialog button');
					}
				});
			
				console.warn('[Prevent Auto Pause]: started');
				clearInterval(this.intervalId);
				this.intervalId = 0;
			}
		}, 1000 * 5);
	}
	
	stop() {
		this.observer.disconnect();
		console.warn('[Prevent Auto Pause]: stopped');
		if (this.intervalId > 0) {
			clearInterval(this.intervalId);
			this.intervalId = 0;
		}
	}
	
	toggle () {
		if (!!this.observer) {
			this.stop();
		} else {
			this.start();
		}
	}
}

let preventAutoPauseTask = new PreventAutoPause();
preventAutoPauseTask.start();

class AutoDismissSafetyWarning {
	constructor() {
		this.checkInterval = 0.2;
		this.checkingEnd = 2;
		this.intervalId = 0;
	}
	
	start() {
		const isInPlaylist = window.location.href.includes('&list=');
		if (!isInPlaylist) {
			console.warn('[Auto Dismiss Safety Warning]: not in playlist');
			return;
		}
		
		const endCheck = () => {
			clearInterval(this.intervalId);
			this.intervalId = 0;
			console.warn('[Auto Dismiss Safety Warning]: stopped');
		};
		
		this.intervalId = setInterval(function () {
			const proceedButton = [...document.querySelectorAll('button')].find(e => e.innerText.includes('I understand and wish to proceed'));
			if (!proceedButton) {
				console.warn('[Auto Dismiss Safety Warning]: no proceed button');
				return;
			}
			
			proceedButton.click();
			console.warn('[Auto Dismiss Safety Warning]: safety warning dismissed');
			endCheck();
		}, this.checkInterval * 1000);
		console.warn('[Auto Dismiss Safety Warning]: started');
		
		setTimeout(() => {
			endCheck();
		}, this.checkingEnd * 1000);
	}
	
	stop() {
		clearInterval(this.intervalId);
		this.intervalId = 0;
		console.warn('[Auto Dismiss Safety Warning]: stopped');
	}
	
	toggle () {
		if (this.intervalId > 0) {
			this.stop();
		} else {
			this.start();
		}
	}
}

let autoDismissSafetyWarningTask = new AutoDismissSafetyWarning();
autoDismissSafetyWarningTask.start();

class HideRelatedVideos {
	constructor() {
		this.isHidden = false;
	}
	
	start() {
		const isInPlaylist = window.location.href.includes('&list=');
		if (!isInPlaylist) {
			console.warn('[Hide Related Videos]: not in playlist');
			return;
		}
		
		const _this = this;
		const hideContent = () => {
			const container = document.querySelector('ytd-watch-next-secondary-results-renderer');
			if (!container) {
				console.warn('[Hide Related Videos]: the container does not exist');
				return;
			}
			
			container.style = 'display: none;';
			console.warn('[Hide Related Videos]: content hidden');
		};
		
		hideContent();
		console.warn('[Hide Related Videos]: hiding content');
		
		setTimeout(() => {
			console.warn('[Hide Related Videos]: re-checking visibility');
			hideContent();
				
			setTimeout(() => {
				console.warn('[Hide Related Videos]: re-checking visibility');
				hideContent();
			}, 1000);
		}, 1000);
	}
}

let hideRelatedVideosTask = new HideRelatedVideos();
hideRelatedVideosTask.start();
