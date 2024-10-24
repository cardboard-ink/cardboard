export type aboutInfo = {
	bio: string;
	tagline: string;
};

export type User = {
	id: string;
	name: string;
	lastOnline: string;
	profilePicture?: string;
	aboutInfo?: aboutInfo;
	gameIds?: number[];
};
