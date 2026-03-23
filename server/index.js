const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./church.db")

// CREATE TABLE
db.run(`
CREATE TABLE IF NOT EXISTS income (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  category TEXT,
  amount REAL
)
`)

// GET ALL
app.get("/income", (req, res) => {
  db.all("SELECT * FROM income ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

// ADD
app.post("/income", (req, res) => {
  const { date, category, amount } = req.body

  db.run(
    "INSERT INTO income (date, category, amount) VALUES (?, ?, ?)",
    [date, category, amount],
    function (err) {
      if (err) return res.status(500).json(err)
      res.json({ id: this.lastID })
    }
  )
})

// UPDATE
app.put("/income/:id", (req, res) => {
  const { date, category, amount } = req.body

  db.run(
    "UPDATE income SET date=?, category=?, amount=? WHERE id=?",
    [date, category, amount, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err)
      res.json({ success: true })
    }
  )
})

// DELETE
app.delete("/income/:id", (req, res) => {
  db.run("DELETE FROM income WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ success: true })
  })
})

app.listen(5000, () => console.log("Server running on port 5000"))