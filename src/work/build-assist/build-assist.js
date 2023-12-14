class BuildAssist {
	constructor() {
		this.waitForElementIntervalId = -1;
		this.isAutoRelease = false;
	}
	
	start() {
		this.createToolbox();
		
		console.info('[Build Assist] Ready');
	}
	
	createToolbox() {
		const template = `
			Build Assist
			<button class="handle">&nbsp;</button>
			<div class="auto-release">
				<span class="auto-release-label">Auto Release</span>
				<div id="auto-release-input" class="checkbox-slider">
					<div class="checkbox-slider-handle"></div>
				</div>
			</div>
		`;
		
		const container = document.createElement('div');
		container.id = 'build-assist';
		container.innerHTML = template;
		document.body.appendChild(container);
		
		const autoReleaseInput = document.querySelector('#build-assist .auto-release');
		autoReleaseInput.addEventListener('click', () => {
			this.isAutoRelease = !this.isAutoRelease;
			if (this.isAutoRelease) {
				this.autoRelease().then();
				console.warn('[Build Assist] Auto Release turned on');
				autoReleaseInput.classList.add('active');
			} else {
				clearInterval(this.waitForElementIntervalId);
				console.warn('[Build Assist] Auto Release turned off');
				autoReleaseInput.classList.remove('active');
			}
		})
	}
	
	async autoRelease() {
		const indicator = await this.waitForElement('.bolt-header .bolt-status.success');
		if (!this.isAutoRelease) {
			console.warn('[Build Assist] Auto Release inactive');
			return;
		}
		
		const moreActions = await this.waitForElement('#__bolt-header-command-bar-menu-button1');
		moreActions.click();
		const releaseOption = await this.waitForElement('#__bolt-run-release-action-text');
		releaseOption.click();
		const createReleaseButton = await this.waitForElement('.create-release-queue-button[data-is-focusable=true]');
		createReleaseButton.click();
		const releaseLink = await this.waitForElement('.new-release-created-message-release-name');
		releaseLink.click();
	}
	
	async waitForElement(selector) {
		return await new Promise(resolve => {
			this.waitForElementIntervalId = setInterval(() => {
				const element = document.querySelector(selector);
				if (!!element) {
					clearInterval(this.waitForElementIntervalId);
					resolve(element);
				}
			}, 500);
		});
	}
}

const buildAssist = new BuildAssist();
buildAssist.start();