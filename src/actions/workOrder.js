
export const ADMINWORKLIST = 'ADMINWORKLIST';
export const ADMINWORKRELATION = 'ADMINWORKRELATION';
export const ADMINWORKPENDING = 'ADMINWORKPENDING';
export const ALARM = 'ALARM';
export const EMPWORKLIST = 'EMPWORKLIST';

export const adminState = (state) => ({type:ADMINWORKLIST,state});
export const adminRelation = (state) => ({type:ADMINWORKRELATION,state});
export const adminPending = (state) => ({type:ADMINWORKPENDING,state});
export const alarm = (state) => ({type:ALARM,state});

export const empState = (state) => ({type:EMPWORKLIST,state});