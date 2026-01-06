const STATES = {
	NONE: '', // -
	UP: 'up', // S
	INDUCTION: 'induction', // I
	PERFORATION: 'perforation', // P
	DOWN: 'down', // B
	REST: 'downtime' // D
};

// Genera calendario de perforación para 3 equipos (S1, S2, S3)
// S1: base inmutable con ciclos regulares
// S2 y S3: coordinados para que siempre haya perforación y nunca juntos en descanso
export function generateSchedule(workDays, restDays, inductionDays, totalDays) {
	const realRestDays = restDays - 2; // -1 UP (subida), -1 DOWN (bajada)

	const schedule = {
		s1: new Array(totalDays).fill(STATES.NONE),
		s2: new Array(totalDays).fill(STATES.NONE),
		s3: new Array(totalDays).fill(STATES.NONE),
		'#P': [] // array de conteo de perforaciones por día
	};

	fillS1(schedule.s1, workDays, realRestDays, inductionDays, totalDays);
	schedule.s2 = Array.from(schedule.s1).slice(0,inductionDays+1).concat(new Array(totalDays - (inductionDays+1)).fill(STATES.PERFORATION));
	fillS2S3(schedule.s1, schedule.s2, schedule.s3, realRestDays, inductionDays);
	return getScheduleResult(schedule, totalDays);
}

// Rellena equipo S1 con ciclos: S (subida) -> I (inducción 1er ciclo) -> P (perforación) -> B (bajada) -> D (descanso)
// S1 es inmutable, define la estructura base
function fillS1(states, workDays, realRestDays, inductionDays, totalDays) {
	let day = 0;
	let cycle = 0;

	while (day < totalDays) {
		// S: subida del equipo
		if (day < totalDays) states[day++] = STATES.UP;

		// I: inducción solo en primer ciclo
		if (cycle === 0) {
			for (let i = 0; i < inductionDays && day < totalDays; i++) {
				states[day++] = STATES.INDUCTION;
			}
		}

		// P: perforación. Primer ciclo restante = workDays - inductionDays
		const perfDays = cycle === 0 ? workDays - inductionDays : workDays;
		for (let i = 0; i < perfDays && day < totalDays; i++) {
			states[day++] = STATES.PERFORATION;
		}

		// B: bajada del equipo
		if (day < totalDays) states[day++] = STATES.DOWN;

		// D: descanso entre ciclos
		for (let i = 0; i < realRestDays && day < totalDays; i++) {
			states[day++] = STATES.REST;
		}
		cycle++;
	}
}

// Coordina descansos de S2 y S3 con transiciones en S1
// Evita que S2 y S3 descansen al mismo tiempo manteniendo perforación activa
function fillS2S3(s1,s2,s3, realRestDays, inductionDays ) {
	let cycle = 0;
	for (let day = 0; day < s1.length; day++) {
		// Detecta inicio de nuevo ciclo en S1 para llenar inducción de S3
		if ( ( s1[day] === STATES.DOWN || s1[day] === STATES.REST ||  s1[day] === STATES.UP) && day > 0 ) {
			fillInduction(s3, day - inductionDays - 1, day - 1, cycle );
			cycle++;
		}

		// Rellena S3 con perforación donde está vacío (después del primer ciclo)
		if( cycle > 0 && day < s3.length && s3[day] === STATES.NONE ) {
			s3[ day ] = STATES.PERFORATION;
		}

		// S1 inicia perforación: S2 entra en descanso (bajada -> descanso -> subida)
		if( ( s1[day - 1]  === STATES.UP && s1[ day ] === STATES.PERFORATION ) ) {
			takeRestDayS2(s1, s2, day, day, Math.min(day + realRestDays + 1, s1.length - 1), realRestDays);
		}

		// S3 sube después de descanso y S1 sigue perforando: S2 descansa otra vez
		if( ( (s3[ day  ] === STATES.UP && s3[ day - 1 ] === STATES.REST) && 
		(s1[ day ] === STATES.PERFORATION && s1[ day + 1 ] !== STATES.DOWN )) ){
			takeRestDayS2(s1, s2, day, day, Math.min(day + realRestDays + 1, s1.length - 1), realRestDays);
		}

		// S2 inicia perforación: S3 entra en descanso
		if ( (s2[ day -1 ] === STATES.UP && s2[ day ] === STATES.PERFORATION) 
			&& ( s1[ day ] === STATES.PERFORATION )
		) {
			takeRestDayS3(s3, day, day, Math.min(day+ realRestDays+1, s1.length - 1) );
		}
	}
}

// Rellena inducción para S3 solo en primer ciclo, marca subida al inicio
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

// S2 descansa: B (bajada) -> D (descanso) -> S (subida)
// Se activa cuando S1 comienza perforación para que S2 descanse mientras S1 y S3 trabajan
function takeRestDayS2(s1, s2, day, fromDay, toDay, restDays) {
	// Marca bajada si S2 estaba perforando
	if ( s2[ day - 1] === STATES.PERFORATION ) {
		s2[ fromDay ] = STATES.DOWN;
	}
	// Rellena descanso mientras S1 siga perforando y no agote dias de descanso
	for (let d = fromDay + 1; (d < toDay && d < s2.length) && ( s1[d + 1] === STATES.PERFORATION  ); d++) {
		s2[d] = STATES.REST;		
		restDays--; 
	}
	// Si solo 1 día disponible, es descanso
	if ( fromDay + 1 === toDay ) s2[ fromDay + 1 ] = STATES.REST;
	// Marca subida al terminar descanso
	if ( s2[ toDay - 1 - restDays ] === STATES.REST  ) {	
		s2[ toDay - restDays ] = STATES.UP;
	}
}

// S3 descansa: B (bajada) -> D (descanso) -> S (subida)
// Se activa cuando S2 comienza perforación para que S3 descanse mientras S1 y S2 trabajan
function takeRestDayS3(s3, day, fromDay, toDay) {
	// Marca bajada si S3 estaba perforando
	if ( s3[ day - 1] === STATES.PERFORATION ) {
		s3[ fromDay ] = STATES.DOWN;
	}
	// Rellena descanso en rango asignado
	for (let d = fromDay + 1; d < toDay && d < s3.length; d++) {
		s3[d] = STATES.REST;
	}
	// Si solo 1 día disponible, es descanso
	if ( fromDay + 1 == toDay ) s3[ fromDay + 1 ] = STATES.REST;
	// Marca subida al terminar descanso
	if ( s3[ toDay - 1 ] === STATES.REST  ) {
		s3[ toDay ] = STATES.UP;
	}
}

// Calcula resultado final: cuenta equipos perforando por día en array #P
function getScheduleResult(schedule, totalDays) {
	// Itera cada día y cuenta equipos en estado PERFORATION
	for (let day = 0; day < totalDays; day++) {
		let count = 0;
		if (schedule.s1[day] === STATES.PERFORATION) count++;
		if (schedule.s2[day] === STATES.PERFORATION) count++;
		if (schedule.s3[day] === STATES.PERFORATION) count++;
		schedule['#P'].push(count);
	}

	return {
		schedule,
	};
}

