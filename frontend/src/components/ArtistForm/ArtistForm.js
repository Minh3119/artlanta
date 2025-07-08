import { toast } from "react-toastify";
import Stepper, { Step } from "./Stepper";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ArtistForm() {
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [yoe, setYoe] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isPhoneVerified) {
      setIsPhoneVerified(false);
    }
  }, [phoneNumber]);

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     console.log("Checking login");
  //     try {
  //       const res = await fetch(
  //         "http://localhost:9999/backend/api/session/check",
  //         {
  //           method: "GET",
  //           credentials: "include",
  //         }
  //       );

  //       const data = await res.json();
  //       console.log("HMM");
  //       if (!data.loggedIn) {
  //         navigate("/");
  //       }
  //     } catch (error) {
  //       console.error("Error checking session:", error);
  //     }
  //   };

  //   checkLogin();
  // }, []);

  const isFormValid = () => {
    let isValid = true;

    if (!address.trim()) {
      toast.error("Address is required.");
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      toast.error("Phone number is required.");
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

    if (!isPhoneVerified) {
      toast.error("Please verify your phone number.");
      isValid = false;
    }

    return isValid;
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:9999/backend/api/artist/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            phoneNumber,
            step: currentStep,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("OTP sended!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error send OTP:", error);
      toast.error("Cannot send OTP please contact with ADMIN!");
    }
  };

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP must be a 6-digit number.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:9999/backend/api/artist/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            otp,
            step: currentStep,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("OTP correct!");
        setIsPhoneVerified(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error verify OTP:", error);
      toast.error("Cannot verify OTP please contact with ADMIN!");
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const artistInfo = {
      currentStep,
      address,
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
        nextButtonText={
          currentStep === 4 && !isPhoneVerified ? "Please verify" : "Continue"
        }
        nextButtonProps={{
          disabled: currentStep === 4 && !isPhoneVerified,
        }}
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
          <h2>Tell us about your address</h2>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your address"
          />
        </Step>

        <Step>
          <h2>Tell us about your phone number</h2>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Your phone number"
          />
          <button onClick={handleSendOTP}>Send OTP</button>
        </Step>

        <Step>
          <h2>Verify OTP</h2>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={handleVerifyOTP}>Verify</button>
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
