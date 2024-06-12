export const reloadSesstion = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};
