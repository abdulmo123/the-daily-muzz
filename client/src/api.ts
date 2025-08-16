const BACKEND_URI = "http://localhost:3000";

export async function addSubscriber(email: string) {
    const response = await fetch(`${BACKEND_URI}/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Deleting file failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}