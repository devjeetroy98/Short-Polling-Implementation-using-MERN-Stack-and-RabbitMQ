import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [events, setEvents] = useState([] as any[]);
  const [eventName, setEventName] = useState("");
  const baseURL = "http://localhost:8080";

  useEffect(() => {
    
    if (events.length == 0) fetchEvents();
    let timer = setInterval(() => fetchEvents(), 10000);

    return () => clearInterval(timer);
  }, []);

  function handleChange(e: any) {
    setEventName(e.target.value);
  }

  async function handleSubmit() {
    let response: any = await axios.post(`${baseURL}/rest/create`, {
      eventName,
      isEventRegistered: false,
    });
    if (response.data && response.data._id) {
      setEventName("");
      setEvents((prevState: any) => [...prevState, response.data]);
    }
  }

  async function fetchEvents() {
    let fetchedEvents: any = await axios.get(`${baseURL}/rest/findAll`);
    setEvents(fetchedEvents.data);
  }

  return (
    <div className="container-fluid">
      <div className="form-container">
        <div className="form-control">
          <label htmlFor="event">Event Name</label>
          <input
            type="text"
            name="event"
            id="event"
            placeholder="Enter the event name"
            value={eventName}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="form-control">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="event-container">
        <div className="events">
          {events.map((event: any) => {
            console.log(event);
            return (
              <div className="event-card" key={event._id}>
                {event.isEventRegistered ? (
                  <div className="tick">
                    <div>&#x2713;</div>
                  </div>
                ) : (
                  <div>
                    <img src="/loader.gif" alt="" />
                  </div>
                )}
                <div className="event-title">{event.eventName}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
