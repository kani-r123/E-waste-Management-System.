import { useEffect, useState } from "react";
import "./style.css";

const API_URL =
  "https://e-waste-management-system-pblc.onrender.com/api/requests";

export default function App() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    name: "",
    itemType: "Old mobile phone",
    quantity: "1",
    area: "Panvel"
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setRequests(data);
      setMessage("");
    } catch (error) {
      setMessage(`Unable to load requests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function submitRequest(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("Submitting collection request...");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name.trim(),
          itemType: form.itemType,
          quantity: Number(form.quantity),
          area: form.area.trim()
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const saved = await response.json();

      setForm({
        name: "",
        itemType: "Old mobile phone",
        quantity: "1",
        area: "Panvel"
      });

      setMessage(`Request T2T-${saved.id} saved successfully. Status: ${saved.status}.`);
      await loadRequests();
    } catch (error) {
      setMessage(`Submission failed: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(request) {
    const nextStatus =
      request.status === "Pending" ? "Completed" : "Pending";

    try {
      const response = await fetch(
        `${API_URL}/${request.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: nextStatus })
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage(`Request T2T-${request.id} updated to ${nextStatus}.`);
      await loadRequests();
    } catch (error) {
      setMessage(`Status update failed: ${error.message}`);
    }
  }

  return (
    <div className="app">
      <header className="top">
        <div className="wrap nav">
          <a className="brand" href="#home">Trash2Tech</a>
          <nav>
            <a href="#home">Home</a>
            <a href="#guide">E-Waste Guide</a>
            <a href="#centres">Collection Centres</a>
            <a href="#request">Collection Request</a>
            <a href="#saved">Saved Requests</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <section id="home" className="hero">
          <p className="eyebrow">RESPONSIBLE E-WASTE MANAGEMENT</p>
          <h1>Give electronic waste a better future.</h1>
          <p>
            Trash2Tech helps people learn about e-waste and record
            collection requests for responsible recycling.
          </p>
          <a className="primary-link" href="#request">
            Submit a Collection Request
          </a>
        </section>

        <section id="guide">
          <h2>E-Waste Guide</h2>
          <div className="cards">
            <article className="card">
              <h3>Mobile Phones</h3>
              <p>
                Keep unused phones out of household waste and take
                them to an authorised e-waste collection service.
              </p>
            </article>
            <article className="card">
              <h3>Chargers and Cables</h3>
              <p>
                Collect unwanted cables separately and send them
                through an appropriate recycling channel.
              </p>
            </article>
            <article className="card">
              <h3>Batteries</h3>
              <p>
                Never burn or dismantle batteries. Use a suitable
                battery collection service.
              </p>
            </article>
            <article className="card">
              <h3>Computers and Laptops</h3>
              <p>
                Back up and remove personal data before recycling
                old electronic devices.
              </p>
            </article>
          </div>
        </section>

        <section id="centres">
          <h2>Collection Centres</h2>
          <article className="card">
            <p>
              Contact authorised recyclers or check municipal
              guidance for collection services near Panvel. Verify
              the centre's location and hours before visiting.
            </p>
          </article>
        </section>

        <section id="request">
          <h2>E-Waste Collection Request</h2>
          <p>
            Submit a request to the Trash2Tech backend.
          </p>

          <form className="form card" onSubmit={submitRequest}>
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Enter your name"
                required
                maxLength={100}
              />
            </label>

            <label>
              E-waste type
              <select
                value={form.itemType}
                onChange={(event) =>
                  setForm({ ...form, itemType: event.target.value })
                }
              >
                <option>Old mobile phone</option>
                <option>Charger or cable</option>
                <option>Battery</option>
                <option>Laptop</option>
                <option>Computer</option>
                <option>Other electronics</option>
              </select>
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                max="1000"
                value={form.quantity}
                onChange={(event) =>
                  setForm({ ...form, quantity: event.target.value })
                }
                required
              />
            </label>

            <label>
              Area
              <input
                value={form.area}
                onChange={(event) =>
                  setForm({ ...form, area: event.target.value })
                }
                placeholder="e.g. Panvel"
                required
                maxLength={100}
              />
            </label>

            <button type="submit" disabled={busy}>
              {busy ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          {message && (
            <p className="message" role="status">{message}</p>
          )}
        </section>

        <section id="saved">
          <div className="section-heading">
            <h2>Saved Collection Requests</h2>
            <button type="button" onClick={loadRequests}>
              Refresh Requests
            </button>
          </div>

          <p>Requests loaded from the Java backend.</p>

          {loading && <p>Loading saved requests...</p>}

          {!loading && requests.length === 0 && (
            <p>No requests found. Submit a test request to get started.</p>
          )}

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Name</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Area</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>T2T-{request.id}</td>
                    <td>{request.name}</td>
                    <td>{request.itemType ?? request.item_type}</td>
                    <td>{request.quantity}</td>
                    <td>{request.area}</td>
                    <td>
                      <span
                        className={`status ${(request.status || "Pending").toLowerCase()}`}
                      >
                        {request.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => updateStatus(request)}
                      >
                        Mark {request.status === "Pending" ? "Completed" : "Pending"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="student-corner">
          <h2>Student Corner</h2>
          <p>
            Students can help reduce e-waste by repairing devices,
            reusing electronics, and choosing authorised recycling.
          </p>
        </section>
      </main>

      <footer>
        <div className="wrap">
          Trash2Tech · Responsible E-Waste Management
        </div>
      </footer>
    </div>
  );
}