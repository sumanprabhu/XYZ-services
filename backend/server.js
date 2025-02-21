const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Parses incoming JSON requests

// Initialize Supabase clients
const supabaseAnon = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ✅ Fetch latest bookings (READ)
app.get("/bookings", async (req, res) => {
  try {
    const { data, error } = await supabaseAnon.from("bookings").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Insert new booking (CREATE)
app.post("/api/bookings", async (req, res) => {
  const { customer_name, contact_number, secondary_contact, problem_description, service_date, time_interval } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .insert([{ customer_name, contact_number, secondary_contact, problem_description, service_date, time_interval }])
      .select();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a booking (UPDATE)
app.put("/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { customer_name, contact_number, secondary_contact, problem_description, service_date, time_interval } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update({ customer_name, contact_number, secondary_contact, problem_description, service_date, time_interval })
      .eq("id", id);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a booking (DELETE)
app.delete("/bookings/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabaseAdmin.from("bookings").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Booking deleted", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start the server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
