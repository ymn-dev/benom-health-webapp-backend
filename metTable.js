const exercises = {
  Cycling: {
    "vigorous-mountain": 14,
    "general-mountain": 8.5,
    racing: 15.8,
    general: 7.5,
    stationary: 7,
  },
  Calisthenics: {
    vigorous: 8,
    moderate: 3.8,
    light: 2.8,
    general: 3.5,
    water: 5.5,
  },
  Running: {
    "walk-combination": 6,
    general: 7,
    "in-place": 8,
    "stairs-up": 15,
    marathon: 13.3,
  },
  Swimming: {
    "moderate-freestyle": 5.8,
    "general-backstroke": 9.5,
    "general-breaststroke": 10.3,
    "general-butterfly": 13.8,
    "general-sidestroke": 7,
  },
  Walking: {
    race: 6.5,
    normal: 4.5,
    slow: 2.5,
    "stair-climb": 8,
    "hills-climb": 2.5,
  },
  Yoga: {
    hatha: 2.5,
    power: 4,
    nadisodhana: 2,
    "surya-namaskar": 3.3,
    stretching: 2.8,
  },
};

const getMET = (exerciseString) => {
  const [type, variation] = exerciseString.split(":");
  if (exercises[type] && exercises[type][variation]) {
    return exercises[type][variation];
  }
  return null;
};

module.exports = { getMET };
