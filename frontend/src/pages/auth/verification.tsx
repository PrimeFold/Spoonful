import styled from "styled-components";
import { verifyOtp, authClient } from "../../../lib/auth";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Verification = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleChange = (value: string, index: number) => {
    const cleaned = value.slice(-1);
    if (!/^\d*$/.test(cleaned)) return;

    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedText)) return;

    const digits = pastedText.slice(0, 6).split("");
    const newOtp = [...otp];

    digits.forEach((digit, idx) => {
      if (idx < 6) {
        newOtp[idx] = digit;
      }
    });

    setOtp(newOtp);

    const focusIndex = Math.min(5, digits.length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Not authenticated");
      navigate("/login");
      return;
    }
    setLoading(true);

    try {

      const joinedOtp = otp.join("");

      if (joinedOtp.length !== 6) {
        toast.error("Enter complete OTP");
        return;
      }

      const res = await verifyOtp(joinedOtp);

      if (!res?.success) {
        toast.error(res?.message || "Invalid OTP");
        return;
      }


      await authClient.getSession({
        query: { disableCookieCache: true }
      });

      toast.success("OTP verified");

      navigate("/app/home");

    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center px-4 py-10">

      <StyledWrapper>
        <form className="otp-Form" onSubmit={handleVerification}>
          <span className="mainHeading">Enter OTP</span>

          <p className="otpSubheading">
            We have sent a verification code to your email
          </p>

          <div className="inputContainer">
             {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                required
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="otp-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            className="verifyButton"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            className="exitBtn"
            onClick={() => navigate("/")}
          >
            ×
          </button>

          <p className="resendNote">
            Didn’t receive the code?
            <button type="button" className="resendBtn">
              Resend Code
            </button>
          </p>
        </form>
      </StyledWrapper>
    </main>
  );
};

const StyledWrapper = styled.div`
  .otp-Form {
    width: 330px;
    height: 300px;
    background-color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 30px;
    gap: 20px;
    position: relative;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.082);
    border-radius: 15px;
  }

  .mainHeading {
    font-size: 1.1em;
    color: rgb(15, 15, 15);
    font-weight: 700;
  }

  .otpSubheading {
    font-size: 0.7em;
    color: black;
    line-height: 17px;
    text-align: center;
  }

  .inputContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .otp-input {
    background-color: rgb(228, 228, 228);
    width: 30px;
    height: 30px;
    text-align: center;
    border: none;
    border-radius: 7px;
    caret-color: rgb(127, 129, 255);
    color: rgb(44, 44, 44);
    outline: none;
    font-weight: 600;
  }

  .otp-input:focus,
  .otp-input:valid {
    background-color: rgba(127, 129, 255, 0.199);
    transition-duration: 0.3s;
  }

  .verifyButton {
    width: 100%;
    height: 30px;
    border: none;
    background-color: rgb(127, 129, 255);
    color: white;
    font-weight: 600;
    cursor: pointer;
    border-radius: 10px;
    transition-duration: 0.2s;
  }

  .verifyButton:hover {
    background-color: rgb(144, 145, 255);
  }

  .exitBtn {
    position: absolute;
    top: 5px;
    right: 5px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.171);
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: none;
    color: black;
    font-size: 1.1em;
    cursor: pointer;
  }

  .resendNote {
    font-size: 0.7em;
    color: black;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .resendBtn {
    background-color: transparent;
    border: none;
    color: rgb(127, 129, 255);
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 700;
  }
`;

export default Verification;