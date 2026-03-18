const express = require("express")
const snarkjs = require("snarkjs")
const fs = require("fs")

const app = express()
app.use(express.json())

const vKey = JSON.parse(fs.readFileSync("verification-key.json"))

let users = {
  "ocang": {
    hash: "7110303097080024260800444665787206606103183587082596139871399733998958991511"
  }
}

app.post("/login", async (req, res) => {
  const { username, proof, publicSignals } = req.body

  const user = users[username]
  if (!user) {
    return res.status(404).json({ error: "user not found" })
  }

  try {
    const verified = await snarkjs.groth16.verify(
      vKey,
      publicSignals,
      proof
    )

    if (!verified) {
      return res.status(401).json({ error: "invalid proof" })
    }

    return res.json({
      success: true,
      message: "login success"
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(8000, () => {
  console.log("ZK login server running")
})