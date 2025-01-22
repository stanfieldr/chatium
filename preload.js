(() => {
	const {ipcRenderer} = require("electron");

	window.addEventListener("DOMContentLoaded", function domLoaded() {
		setInterval(() => {
			const roasterFrame = document.getElementById("gtn-roster-iframe-id");
			if (roasterFrame === null) {
				ipcRenderer.invoke('notification-count', 0);
				return;
			}


			const countDiv = roasterFrame.contentDocument.body.querySelector("[aria-label*='unread']");
			if (countDiv === null) {
				ipcRenderer.invoke('notification-count', 0);
				return;
			}

			const unread = countDiv.innerText;

			// TODO: spaces
			ipcRenderer.invoke('notification-count', unread);
		}, 1000);
	});
})();