(() => {
	const {ipcRenderer} = require("electron");

	window.addEventListener("DOMContentLoaded", function domLoaded() {
		setInterval(() => {
			const roasterFrame = document.getElementById("gtn-roster-iframe-id");
			if (roasterFrame === null) {
				ipcRenderer.invoke('notification-count', 0);
				return;
			}


			const countDivs = roasterFrame.contentDocument.body.querySelectorAll("[aria-label*='unread']");
			if (countDivs.length === 0) {
				ipcRenderer.invoke('notification-count', 0);
				return;
			}

			let sum = 0;
			for (let i = countDivs.length - 1; i >= 0; i--) {
				sum += Number(countDivs[i].innerText);
			}

			// TODO: spaces
			ipcRenderer.invoke('notification-count', sum);
		}, 1000);
	});
})();