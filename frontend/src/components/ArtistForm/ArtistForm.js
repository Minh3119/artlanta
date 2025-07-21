import { toast } from "react-toastify";
import Stepper, { Step } from "./Stepper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ArtistForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [yoe, setYoe] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();

  const phoneRegex = /^\d{10,20}$/;

  const isFormValid = () => {
    let isValid = true;

    if (!agreed) {
      toast.error("Bạn phải đồng ý cung cấp thông tin để tiếp tục.");
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      toast.error("Phone number is required.");
      isValid = false;
    }

    if (!phoneRegex.test(phoneNumber.trim())) {
      toast.error("Phone number must contain 10–20 digits only.");
      isValid = false;
    }

    if (!specialty.trim()) {
      toast.error("Specialty is required.");
      isValid = false;
    }

    if (yoe === "" || Number(yoe) < 0) {
      toast.error("Years of experience must be 0 or greater.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const artistInfo = {
      currentStep,
      phoneNumber,
      specialty,
      experienceYears: Number(yoe),
    };

    try {
      const res = await fetch(
        "http://localhost:9999/backend/api/artist/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(artistInfo),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Artist info submitted successfully!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting artist info:", error);
      toast.error("Server error!");
    }
  };

  return (
    <>
      <Stepper
        initialStep={1}
        onStepChange={(step) => setCurrentStep(step)}
        onFinalStepCompleted={handleSubmit}
        backButtonText="Previous"
        nextButtonText={"Continue"}
      >
        <Step>
          <h2>Welcome, future artist!</h2>
          <p>
            Thanks for joining us. Let’s get you set up as an artist on the
            platform.
          </p>
          <p>
            Click <b>Continue</b> to get started!
          </p>
        </Step>
        <Step>
          <h2>Identity Verification Policy</h2>
          <p>
            To ensure secure transactions and build a trusted artist community,
            we require identity verification.
          </p>
          <p style={{ fontWeight: "bold" }}>
            Purpose: To verify the identity of artists for safe and trustworthy
            transactions.
          </p>
          <div style={{ marginTop: "1em" }}>
            <label>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />{" "}
              I agree to provide my personal information for identity
              verification.
            </label>
          </div>
        </Step>
        <Step>
          <h2>Tell us about your phone number</h2>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Your phone number"
          />
        </Step>

        <Step>
          <h2>Let clients know more about you</h2>
          <p>Help clients understand your background, values, and approach</p>
        </Step>

        <Step>
          <h2>What's your specialty? (e.g., Portraits, Logo Design, etc.)</h2>
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g. Logo Design"
          />
        </Step>

        <Step>
          <h2>How many years of experience do you have?</h2>
          <input
            type="number"
            min="0"
            value={yoe}
            onChange={(e) => setYoe(Number(e.target.value))}
            placeholder="e.g. 2"
          />
        </Step>

        <Step>
          <h2>That's it</h2>
          <p>Thanks for your information. We really appreciate it!</p>
        </Step>
      </Stepper>
    </>
  );
}
