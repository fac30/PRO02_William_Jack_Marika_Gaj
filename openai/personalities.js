let personality = "pirate";

const handlePersonalityChange = (newPersonality) => {
  personality = newPersonality;
  console.log(personality);
};

export { personality, handlePersonalityChange };
