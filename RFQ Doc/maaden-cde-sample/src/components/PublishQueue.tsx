"use client";

import { useState } from "react";

export default function PublishQueue({
  events,
}: {
  events: {
    id: number;
    status: string;
    created_at: string;
    payload: any;
    payload_sha256: string;
    tag: string;
    system_name: string;
    family: string;
  }[];
}) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="card">
      <h3>
        Publish queue &amp; events{" "}
        <span className="sub">click a row for the JSON payload</span>
      </h3>
      <table className="data">
        <thead>
          <tr>
            <th>Time</th>
            <th>Asset</th>
            <th>Target</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <>
              <tr
                key={e.id}
                onClick={() => setOpenId(openId === e.id ? null : e.id)}
                style={{ cursor: "pointer" }}
              >
                <td className="small">
                  {new Date(e.created_at).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="mono">{e.tag}</td>
                <td>{e.system_name}</td>
                <td>
                  <span
                    className={`chip ${
                      e.status === "sent"
                        ? "c-ok"
                        : e.status === "blocked"
                          ? "c-err"
                          : "c-info"
                    }`}
                  >
                    {e.status === "sent"
                      ? "Sent"
                      : e.status === "blocked"
                        ? "Blocked — compliance"
                        : "Queued"}
                  </span>
                </td>
              </tr>
              {openId === e.id && (
                <tr key={`${e.id}-payload`}>
                  <td colSpan={4}>
                    <div className="small mb-1">
                      sha256: <span className="mono">{e.payload_sha256.slice(0, 16)}…</span>
                    </div>
                    <pre
                      className="mono"
                      style={{
                        background: "#f7f6f2",
                        border: "1px solid var(--line)",
                        borderRadius: 6,
                        padding: 10,
                        fontSize: 11,
                        overflowX: "auto",
                        maxHeight: 220,
                      }}
                    >
                      {JSON.stringify(e.payload, null, 2)}
                    </pre>
                  </td>
                </tr>
              )}
            </>
          ))}
          {events.length === 0 && (
            <tr>
              <td colSpan={4} className="small">
                No publish events yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
