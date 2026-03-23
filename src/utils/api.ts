const BASE = "http://localhost:5000"

export const api = {
  async get(url: string) {
    try {
      const res = await fetch(BASE + url)
      return await res.json()
    } catch {
      return []
    }
  },

  async post(url: string, data: any) {
    const res = await fetch(BASE + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async put(url: string, data: any) {
    const res = await fetch(BASE + url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async delete(url: string) {
    await fetch(BASE + url, { method: "DELETE" })
  },
}