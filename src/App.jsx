import { useEffect, useState } from "react";
import "./style.css";

const API_URL =
  "https://e-waste-management-system-pblc.onrender.com/api/requests";

const ewasteCentres = [
  {
    id: 1,
    name: "ReTeck Envirotech Pvt. Ltd.",
    address:
      "Plot No. 4A, MIDC Taloja, Taluka Panvel, District Raigad, Maharashtra 410208",
    phone: "9892334045",
    email: "amol.varhadi@reteck.in",
    services: "E-waste recycling and refurbishment",
    map:
      "https://www.google.com/maps/search/?api=1&query=ReTeck+Envirotech+Plot+4A+MIDC+Taloja+Panvel"
  },
  {
    id: 2,
    name: "Recycling Future",
    address:
      "Survey No. 169, Bhangarpada, Post Kundevahal, Taluka Panvel, District Raigad",
    phone: "9892027022",
    email: "katekar.aniket@gmail.com",
    services: "E-waste collection, segregation and dismantling",
    map:
      "https://www.google.com/maps/search/?api=1&query=Recycling+Future+Bhangarpada+Panvel"
  },
  {
    id: 3,
    name: "Panvel Municipal Corporation",
    address:
      "Swami Nityanand Road, opposite Gokhale Marriage Hall, Panvel, Maharashtra 410206",
    phone: "02227458040",
    email: "",
    services:
      "Municipal e-waste collection with dry waste. Contact the department to confirm collection arrangements.",
    map:
      "https://www.google.com/maps/search/?api=1&query=Panvel+Municipal+Corporation"
  }
];

function validateForm(form) {
  const name = form.name.trim();
  const area = form.area.trim();
  const quantity = Number(form.quantity);

  if (!name) {
    return "Please enter your name.";
  }

  if (name.length < 2 || name.length > 60) {
    return "Name must contain between 2 and 60 characters.";
  }

  if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(name)) {
    return "Name should contain letters, spaces, apostrophes, dots or hyphens only.";
  }

  if (!form.itemType) {
    return "Please select an e-waste type.";
  }

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 1000
  ) {
    return "Quantity must be a whole number between 1 and 1000.";
  }

  if (area.length < 2 || area.length > 100) {
    return "Please enter a valid area between 2 and 100 characters.";
  }

  if (!/^[\p{L}\p{N}\s,.'()/-]+$/u.test(area)) {
    return "Area contains unsupported characters.";
  }

  return "";
}

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
    setLoading(true);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response from the server.");
      }

      setRequests(data);
      setMessage("");
    } catch (error) {
      setMessage(
        `Unable to load requests: ${error.message}. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function submitRequest(event) {
    event.preventDefault();

    const validationError = validateForm(form);

    if (validationError) {
      setMessage(validationError);
      return;
    }

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
        const errorText = await response.text();
        throw new Error(
          errorText || `Server returned ${response.status}`
        );
      }

      const saved = await response.json();

      setForm({
        name: "",
        itemType: "Old mobile phone",
        quantity: "1",
        area: "Panvel"
      });

      setMessage(
        `Request T2T-${saved.id} saved successfully. Status: ${saved.status || "Pending"}.`
      );

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
        throw new Error(`Server returned ${response.status}`);
      }

      setMessage(
        `Request T2T-${request.id} updated to ${nextStatus}.`
      );

      await loadRequests();
    } catch (error) {
      setMessage(`Status update failed: ${error.message}`);
    }
  }

  return (
    <div className="app">
      <header className="top">
        <div className="wrap nav">
          <a className="brand" href="#home">
            Trash2Tech
          </a>

          <nav>
            <a href="#home">Home</a>
            <a href="#guide">E-Waste Guide</a>
            <a href="#centres">Collection Centres</a>
            <a href="#request">Collection Request</a>
            <a href="#saved">Saved Requests</a>
            <a href="#student-corner">Student Corner</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <section id="home" className="hero">
          <p className="eyebrow">
            RESPONSIBLE E-WASTE MANAGEMENT
          </p>

          <h1>Give electronic waste a better future.</h1>

          <p>
            Trash2Tech helps people learn about e-waste, find
            collection options around Panvel, and record collection
            requests for responsible recycling.
          </p>

          <a className="primary-link" href="#request">
            Submit a Collection Request
          </a>

          <a className="primary-link" href="#centres">
            Find E-Waste Centres
          </a>
        </section>

        <section id="guide">
          <h2>E-Waste Guide</h2>

          <div className="cards">
            <article className="card">
              <h3>Mobile Phones</h3>
              <p>
                Keep unused phones out of household waste and take
                them to an appropriate e-waste collection service.
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
                Do not burn or dismantle batteries. Use an
                appropriate battery collection service.
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
          <h2>E-Waste Collection Centres in Panvel</h2>

          <p>
            These entries are based on public directory information.
            Contact the organisation before visiting to confirm its
            current operating hours, accepted items and collection
            arrangements.
          </p>

          <div className="cards">
            {ewasteCentres.map((centre) => (
              <article className="card" key={centre.id}>
                <h3>{centre.name}</h3>

                <p>
                  <strong>Address:</strong> {centre.address}
                </p>

                <p>
                  <strong>Services:</strong> {centre.services}
                </p>

                {centre.phone && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${centre.phone}`}>
                      {centre.phone}
                    </a>
                  </p>
                )}

                {centre.email && (
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${centre.email}`}>
                      {centre.email}
                    </a>
                  </p>
                )}

                <a
                  href={centre.map}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View location on Google Maps
                </a>
              </article>
            ))}
          </div>

          <p>
            Official reference:{" "}
            <a
              href="https://www.panvelcorporation.maharashtra.gov.in/faqs/department/Solid%20Waste%20Management%20Department"
              target="_blank"
              rel="noopener noreferrer"
            >
              Panvel Municipal Corporation waste-management FAQs
            </a>
          </p>
        </section>

        <section id="request">
          <h2>E-Waste Collection Request</h2>

          <p>
            Complete the form to submit a collection request to
            the Trash2Tech backend.
          </p>

          <form className="form card" onSubmit={submitRequest}>
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={60}
              />
            </label>

            <label>
              E-waste type
              <select
                name="itemType"
                value={form.itemType}
                onChange={handleChange}
                required
              >
                <option value="Old mobile phone">
                  Old mobile phone
                </option>
                <option value="Charger or cable">
                  Charger or cable
                </option>
                <option value="Battery">Battery</option>
                <option value="Laptop">Laptop</option>
                <option value="Computer">Computer</option>
                <option value="Other electronics">
                  Other electronics
                </option>
              </select>
            </label>

            <label>
              Quantity
              <input
                name="quantity"
                type="number"
                min="1"
                max="1000"
                step="1"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Area
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="e.g. Panvel"
                required
                minLength={2}
                maxLength={100}
              />
            </label>

            <button type="submit" disabled={busy}>
              {busy ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          {message && (
            <p className="message" role="status" aria-live="polite">
              {message}
            </p>
          )}
        </section>

        <section id="saved">
          <div className="section-heading">
            <h2>Saved Collection Requests</h2>

            <button
              type="button"
              onClick={loadRequests}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Requests"}
            </button>
          </div>

          <p>Requests loaded from the Java backend.</p>

          {loading && <p>Loading saved requests...</p>}

          {!loading && requests.length === 0 && (
            <p>
              No requests found. Submit a test request to get started.
            </p>
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
                    <td>
                      {request.itemType ?? request.item_type}
                    </td>
                    <td>{request.quantity}</td>
                    <td>{request.area}</td>
                    <td>
                      <span
                        className={`status ${
                          (request.status || "Pending").toLowerCase()
                        }`}
                      >
                        {request.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => updateStatus(request)}
                      >
                        Mark{" "}
                        {request.status === "Pending"
                          ? "Completed"
                          : "Pending"}
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
            reusing electronics, and choosing appropriate recycling
            services.
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
