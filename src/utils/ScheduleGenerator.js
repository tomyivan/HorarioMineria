const STATES = {
  NONE: '',
  UP: 'up',
  INDUCTION: 'induction',
  PERFORATION: 'perforation',
  DOWN: 'down',
  REST: 'downtime'
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
  

  const s1FirstDownDay = findFirstDownDay(schedule.s1);
  const s3EntryDay = Math.max(0, s1FirstDownDay - (1 + inductionDays));
//   const s3PerfReadyDay = s3EntryDay + 1 + inductionDays; // When S3 can start performing
  
  const s1UpAfterFirstDown = findNextStateAfter(schedule.s1, STATES.DOWN, s1FirstDownDay);
  fillS2WithHandoff(schedule.s2, s1UpAfterFirstDown, workDays, realRestDays, inductionDays, totalDays);
  

  fillS3ObservingS1S2(schedule, workDays, realRestDays, inductionDays, totalDays, s3EntryDay);
  
  // Retornar resultado
  return getScheduleResult(schedule, totalDays, s3EntryDay);
}

function fillS2WithHandoff(s2, s3PerfReadyDay, workDays, realRestDays, inductionDays, totalDays) {
  let day = 0;
  let cycle = 0;
  
  while (day < totalDays) {
    // Subida
    if (day < totalDays) s2[day++] = STATES.UP;
    
    // Inducción: solo en primer ciclo
    if (cycle === 0) {
      for (let i = 0; i < inductionDays && day < totalDays; i++) {
        s2[day++] = STATES.INDUCTION;
      }
      
      // Perforación: extender más allá del ciclo normal para cubrir hasta que S3 y S1 se reorganicen
      // S2 perfora mientras sea necesario para mantener 2 supervisores
      const s1FirstDownDay = s3PerfReadyDay - inductionDays - 1;
      const minPerfDays = Math.max(workDays - inductionDays, s1FirstDownDay - day + realRestDays + 1);
      
      for (let i = 0; i < minPerfDays && day < totalDays; i++) {
        s2[day++] = STATES.PERFORATION;
      }
      
      // Bajada
      if (day < totalDays) {
        s2[day++] = STATES.DOWN;
        
        // Descanso
        for (let i = 0; i < realRestDays && day < totalDays; i++) {
          s2[day++] = STATES.REST;
        }
        cycle++;
      } else {
        break;
      }
    } else {
      // Ciclos posteriores normales
      for (let i = 0; i < workDays && day < totalDays; i++) {
        s2[day++] = STATES.PERFORATION;
      }
      
      if (day < totalDays) s2[day++] = STATES.DOWN;
      for (let i = 0; i < realRestDays && day < totalDays; i++) {
        s2[day++] = STATES.REST;
      }
      cycle++;
    }
  }
}

function fillS3ObservingS1S2(schedule, workDays, realRestDays, inductionDays, totalDays, startDay) {
  if (startDay >= totalDays) return;
  
  let day = startDay;
  let cycle = 0;
  
  while (day < totalDays) {
    // Subida
    if (day < totalDays) {
      schedule.s3[day] = STATES.UP;
      day++;
    }
    
    // Inducción: solo en primer ciclo de S3
    if (cycle === 0) {
      for (let i = 0; i < inductionDays && day < totalDays; i++) {
        schedule.s3[day] = STATES.INDUCTION;
        day++;
      }
    }
    
    // Perforación: mantener exactamente 2 perforadores
    const targetPerfDays = cycle === 0 ? workDays - inductionDays : workDays;
    for (let i = 0; i < targetPerfDays && day < totalDays; i++) {
      const s1 = schedule.s1[day];
      const s2 = schedule.s2[day];
      
      // Contar cuántos perforadores hay SIN S3
      let perfWithoutS3 = 0;
      if (s1 === STATES.PERFORATION) perfWithoutS3++;
      if (s2 === STATES.PERFORATION) perfWithoutS3++;
      
      // Si hay < 2, S3 debe perforar
      if (perfWithoutS3 < 2) {
        schedule.s3[day] = STATES.PERFORATION;
      } else {
        // Si ya hay 2 o más, no perforar
        schedule.s3[day] = STATES.NONE;
      }
      
      day++;
    }
    
    // Bajada
    if (day < totalDays) {
      schedule.s3[day] = STATES.DOWN;
      day++;
    }
    
    // Descanso
    for (let i = 0; i < realRestDays && day < totalDays; i++) {
      schedule.s3[day] = STATES.REST;
      day++;
    }
    
    cycle++;
  }
}

/**
 * Encuentra el primer día cuando un supervisor baja (DOWN state)
 */
function findFirstDownDay(states) {
  for (let i = 0; i < states.length; i++) {
    if (states[i] === STATES.DOWN) {
      return i;
    }
  }
  return states.length - 1;
}

/**
 * Encuentra el primer día cuando aparece un estado específico DESPUÉS de una posición
 */
function findNextStateAfter(states, targetState, afterDay) {
  for (let i = afterDay + 1; i < states.length; i++) {
    if (states[i] === targetState) {
      return i;
    }
  }
  return states.length - 1;
}

/**
 * Retorna el resultado del cronograma generado
 */
function getScheduleResult(schedule, totalDays, s3EntryDay) {
  const errors = [];
  for (let day = 0; day < totalDays; day++) {
    let count = 0;
    if (schedule.s1[day] === STATES.PERFORATION) count++;
    if (schedule.s2[day] === STATES.PERFORATION) count++;
    if (schedule.s3[day] === STATES.PERFORATION) count++;
    schedule['#P'].push(count);
    
    // Validar después que S3 entró
    if (day >= s3EntryDay) {
      if (count !== 2) {
        errors.push({
          day,
          message: `Día ${day}: ${count} perforadores (debe ser exactamente 2)`
        });
      }
    }
  }
  
  return {
    schedule,
    errors,
    isValid: errors.length === 0
  };
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

export class GenerateSchedule {
  constructor(daysWorks, daysRest, daysInduction, totalDaysPerforation) {
    this.daysWorks = daysWorks;
    this.daysRest = daysRest;
    this.daysInduction = daysInduction;
    this.totalDaysPerforation = totalDaysPerforation;
  }

  generate() {
    return generateSchedule(
      this.daysWorks,
      this.daysRest,
      this.daysInduction,
      this.totalDaysPerforation
    );
  }
}