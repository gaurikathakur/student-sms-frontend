const API_BASE = "https://student-sms-backend-3.onrender.com";


export async function getJSON(path) {
  const res = await fetch(API_BASE + path, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function postJSON(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function putJSON(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function del(path) {
  const res = await fetch(API_BASE + path, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
