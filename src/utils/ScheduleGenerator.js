const STATES = {
	NONE: '', // -
	UP: 'up', // S
	INDUCTION: 'induction', // I
	PERFORATION: 'perforation', // P
	DOWN: 'down', // B
	REST: 'downtime' // D
};

export function generateSchedule(workDays, restDays, inductionDays, totalDays) {
	const realRestDays = restDays - 2; // -1 UP, -1 DOWN

	const schedule = {
		s1: new Array(totalDays).fill(STATES.NONE),
		s2: new Array(totalDays).fill(STATES.NONE),
		s3: new Array(totalDays).fill(STATES.NONE),
		'#P': []
	};


	fillS1(schedule.s1, workDays, realRestDays, inductionDays, totalDays);
	schedule.s2 = Array.from(schedule.s1);
	fillS2S3(schedule.s1, schedule.s2, schedule.s3, workDays, realRestDays, inductionDays);
	return getScheduleResult(schedule, totalDays);
}

function fillS1(states, workDays, realRestDays, inductionDays, totalDays) {
	let day = 0;
	let cycle = 0;

	while (day < totalDays) {
		// Subida
		if (day < totalDays) states[day++] = STATES.UP;

		// Inducción: solo en primer ciclo
		if (cycle === 0) {
			for (let i = 0; i < inductionDays && day < totalDays; i++) {
				states[day++] = STATES.INDUCTION;
			}
		}

		// Perforación
		const perfDays = cycle === 0 ? workDays - inductionDays : workDays;
		for (let i = 0; i < perfDays && day < totalDays; i++) {
			states[day++] = STATES.PERFORATION;
		}

		// Bajada
		if (day < totalDays) states[day++] = STATES.DOWN;

		// Descanso
		for (let i = 0; i < realRestDays && day < totalDays; i++) {
			states[day++] = STATES.REST;
		}
		cycle++;
	}
}

function fillS2S3(s1,s2,s3, workDays, realRestDays, inductionDays ) {
	let cycle = 0;
	let lastTakeRestDay = "s3"; 
	for (let day = 0; day < s1.length; day++) {
		if ( ( s1[day] === STATES.DOWN || s1[day] === STATES.REST ||  s1[day] === STATES.UP) && day > 0 ) {
			s2[day] = STATES.PERFORATION;			
			fillInduction(s3, day - inductionDays - 1, day - 1, cycle );
			cycle++;
		}

		if( cycle > 0 && day < s3.length && s3[day] === STATES.NONE ) {
			s3[ day ] = STATES.PERFORATION;
		}

		if ( (s1[ day -1 ] === STATES.UP && s1[ day ] === STATES.PERFORATION) || 
			 (s2[ day -1 ] === STATES.UP && s2[ day ] === STATES.PERFORATION)
	) { 
			takeRestDay( lastTakeRestDay === "s2" ? s3 : s2, day, day, Math.min(day+ realRestDays+1, s1.length - 1) );
			lastTakeRestDay = lastTakeRestDay === "s2" ? "s3" : "s2";
		}
	}
}

function fillInduction(states, fromDay, toDay, cycle) {
	for (let day = fromDay; day <= toDay && day < states.length; day++) {
		if ( cycle === 0 ) {
			states[day] = STATES.INDUCTION;
		}
	}
	if ( cycle === 0 && fromDay < states.length ) {
		states[fromDay] = STATES.UP;
	}
}

function takeRestDay(states, day, fromDay, toDay) {
	if ( states[day - 1] === STATES.PERFORATION ) {
		states[day] = STATES.DOWN;
	}
	for (let day = fromDay+1; day < toDay && day < states.length; day++) {
		states[day] = STATES.REST;
	}
	if ( states[ toDay - 1 ] === STATES.REST  ) {
		states[toDay] = STATES.UP;
	}
}

function getScheduleResult(schedule, totalDays) {
	const errors = [];
	for (let day = 0; day < totalDays; day++) {
		let count = 0;
		if (schedule.s1[day] === STATES.PERFORATION) count++;
		if (schedule.s2[day] === STATES.PERFORATION) count++;
		if (schedule.s3[day] === STATES.PERFORATION) count++;
		schedule['#P'].push(count);

	}

	return {
		schedule,
		errors,
		isValid: errors.length === 0
	};
}

