import React, { useEffect, useState } from "react";
import { checkBackend } from "../api";

export default function ConnectionStatus() {
  const [status, setStatus] = useState({ checking: true });

  useEffect(() => {
    const check = async () => {
      try {
        const result = await checkBackend();
        setStatus(result);
      } catch (err) {
        setStatus({ ok: false, message: err.message });
      }
    };
    check();
  }, []);

  if (status.checking) return null;

  if (status.ok) {
    return (
      <div className="fixed bottom-4 right-4 px-4 py-2 bg-green-100 text-green-800 rounded-md shadow-sm">
        API Connected
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 px-4 py-2 bg-red-100 text-red-800 rounded-md shadow-sm">
      API Error: {status.message}
    </div>
  );
}
