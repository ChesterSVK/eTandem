export const TeachingMotivationEnum = {
    WTTEACH : "WTTEACH",
    WTLEARN : "WTLEARN",
};


export const MatchingRequestStateEnum = {
	ACCEPTED : "ACCEPTED",
	DECLINED : "DECLINED",
	PENDING  : "PENDING",
	COMPLETED : "COMPLETED",
};

//Order dependent, please do not change the order of these values.
//Dependency files TandemTeachLanguagesInput.jsx, TandemStudyLanguagesInput.jsx,
export const LanguageLevelsEnum = {
	A1 : "tdll_a1",
	A2 : "tdll_a2",
	B1 : "tdll_b1",
	B2 : "tdll_b2",
	C1 : "tdll_c1",
	C2 : "tdll_c2",
	getAsArray : function () {
		return [
			{ _id: this.A1, level: this.keys[0] },
			{ _id: this.A2, level: this.keys[1] },
			{ _id: this.B1, level: this.keys[2] },
			{ _id: this.B2, level: this.keys[3] },
			{ _id: this.C1, level: this.keys[4] },
			{ _id: this.C2, level: this.keys[5] },
		];
	}
};

