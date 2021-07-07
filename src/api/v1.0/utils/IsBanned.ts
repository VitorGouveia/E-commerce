export const isBanned = (
	ban: boolean | null | undefined,
	shadow_ban: boolean | null | undefined
) => {
	if (shadow_ban === true) {
		throw new Error(
			"Sorry, we couldn't complete your request, please try again later."
		);
	}

	if (ban === true) {
		throw new Error(
			`Your banned. If you think this is a mistake contact our team.`
		);
	}
};
