const generateId = (): string => {
  return Math.random().toString(16).slice(2, 18);
}

export { generateId };
