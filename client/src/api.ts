const BACKEND_URI = "http://localhost:3000";

export async function addSubscriber(email: string) {
    const response = await fetch(`${BACKEND_URI}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Adding subscriber failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

export async function removeSubscriber(email: string) {
  const response = await fetch(`${BACKEND_URI}/unsubscribe`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`Removing subscriber failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}