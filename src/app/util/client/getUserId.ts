export const getUserId = async () => {
  const response = await fetch("/api/user");
  if (!response.ok) {
    throw new Error("Failed to fetch user ID");
  }
  const data = await response.json();
  return data.userId;
};
