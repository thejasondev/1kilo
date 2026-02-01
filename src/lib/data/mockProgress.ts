export const WEIGHT_HISTORY = [
  { date: "01/01", weight: 82.5 },
  { date: "08/01", weight: 81.8 },
  { date: "15/01", weight: 81.2 },
  { date: "22/01", weight: 80.5 },
  { date: "29/01", weight: 79.8 },
  { date: "05/02", weight: 79.2 }, // Current projection
];

export const CALORIE_LOGS = [
  { day: "Lun", calories: 2100, target: 2000 },
  { day: "Mar", calories: 1950, target: 2000 },
  { day: "Mié", calories: 2200, target: 2000 }, // Over
  { day: "Jue", calories: 1800, target: 2000 }, // Under
  { day: "Vie", calories: 2050, target: 2000 },
  { day: "Sáb", calories: 2400, target: 2000 }, // Weekend spike
  { day: "Dom", calories: 1900, target: 2000 },
];

export const INSIGHTS = {
  weightTrend: -0.7, // kg per week
  weeksToGoal: 4,
  consistencyScore: 85, // percent
  nextMilestone: 78.0,
};
