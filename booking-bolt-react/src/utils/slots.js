// Time-slot helpers for the booking widget

export function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToLabel(mins) {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function fmtDate(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Build the next N bookable days (skipping closed days)
export function upcomingDays(availability, count = 10) {
  const days = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let guard = 0;
  while (days.length < count && guard < 40) {
    const dow = cursor.getDay();
    if (availability[dow]?.open) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
    guard++;
  }
  return days;
}

// Generate slot start-times for a given day, marking ones taken by existing appts
export function slotsForDay(day, availability, slotMinutes, serviceDuration, appointments) {
  const dow = day.getDay();
  const rule = availability[dow];
  if (!rule?.open) return [];

  const start = timeToMinutes(rule.start);
  const end = timeToMinutes(rule.end);
  const now = new Date();
  const slots = [];

  for (let t = start; t + serviceDuration <= end; t += slotMinutes) {
    const slotStart = new Date(day);
    slotStart.setHours(0, t, 0, 0);
    const slotEnd = slotStart.getTime() + serviceDuration * 60000;

    const past = slotStart.getTime() < now.getTime();

    const clash = appointments.some(a => {
      if (a.status === 'Cancelled') return false;
      const aStart = new Date(a.start).getTime();
      const aEnd = aStart + (a.duration || 60) * 60000;
      return slotStart.getTime() < aEnd && slotEnd > aStart;
    });

    slots.push({ minutes: t, label: minutesToLabel(t), disabled: past || clash });
  }
  return slots;
}
