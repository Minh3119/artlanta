import { useState } from "react";
import share from "../../assets/images/share.svg";
import sharedone from "../../assets/images/sharedone.svg";

export default function ShareButton({ link }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={handleCopy}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
      >
        <img
          src={copied ? sharedone : share}
          alt="Share"
          width={20}
          height={20}
        />
      </button>

      {copied && (
        <div
          style={{
            position: "absolute",
            top: "-25px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "black",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          Đã copy link!
        </div>
      )}
    </div>
  );
}
