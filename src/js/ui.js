// UI and theme logic for JetLagS14 SPA

export function initializeUI() {
	const toggle = document.getElementById("dark-toggle");
	const iconSun = document.getElementById("icon-sun");
	const iconMoon = document.getElementById("icon-moon");
	function updateIcon() {
		if (document.documentElement.classList.contains("dark")) {
			iconSun.style.removeProperty("display");
			iconMoon.style.setProperty("display", "none", "important");
		} else {
			iconSun.style.setProperty("display", "none", "important");
			iconMoon.style.removeProperty("display");
		}
	}
	updateIcon();
	toggle.addEventListener("click", () => {
		document.documentElement.classList.toggle("dark");
		updateIcon();
	});

	// --- Info Button and Modal ---
	const infoBtn = document.getElementById("info-toggle");
	const infoModal = document.getElementById("info-modal");
	const infoModalClose = document.getElementById("info-modal-close");
	if (infoBtn && infoModal && infoModalClose) {
		const showModal = () => {
			infoModal.classList.remove("hidden");
			// Block body scroll
			document.body.style.overflow = "hidden";
			setTimeout(() => {
				infoModal.classList.add("flex");
				const modalBox = infoModal.querySelector(".animate-in");
				if (modalBox) {
					modalBox.classList.remove("opacity-100", "scale-100");
					modalBox.classList.add("opacity-0", "scale-95");
					void modalBox.offsetWidth;
					setTimeout(() => {
						modalBox.classList.remove("opacity-0", "scale-95");
						modalBox.classList.add("opacity-100", "scale-100");
					}, 10);
				}
			}, 10);
		};
		const hideModal = () => {
			// Restore body scroll
			document.body.style.overflow = "";
			const modalBox = infoModal.querySelector(".animate-in");
			if (modalBox) {
				modalBox.classList.remove("opacity-100", "scale-100");
				modalBox.classList.add("opacity-0", "scale-95");
				setTimeout(() => {
					infoModal.classList.remove("flex");
					infoModal.classList.add("hidden");
				}, 150);
			} else {
				infoModal.classList.remove("flex");
				infoModal.classList.add("hidden");
			}
		};
		infoBtn.addEventListener("click", showModal);
		infoModalClose.addEventListener("click", hideModal);
		infoModal.addEventListener("click", (e) => {
			if (e.target === infoModal) hideModal();
		});
		document.addEventListener("keydown", (e) => {
			if (!infoModal.classList.contains("hidden") && (e.key === "Escape" || e.key === "Esc")) {
				hideModal();
			}
		});

		showModal(); // Show modal on initial load
	}
}
