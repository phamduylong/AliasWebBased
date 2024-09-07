export type Word = {
	word: string;
	shown: boolean;
};

export type Game = {
	id: string;				       // PocketBase auto-assigned ID
	game_id: string;
	team1: string;
	team2: string;
	team1_score: number;
	team2_score: number;
	words: Word[];
	is_team1_turn: boolean;
};
