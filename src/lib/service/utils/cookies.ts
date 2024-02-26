export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`).pop();
  if (!parts) throw new Error(`Cookie with name ${name} not found`);
  if (parts.length === 2) return parts.split(";").shift();
}
