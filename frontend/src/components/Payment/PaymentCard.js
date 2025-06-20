import "../../styles/payment.css";
import { Link } from "react-router-dom";
import PaymentPaypal from "./PaymentPaypal";

export default function PaymentCard() {
    return <div className="payment-card">
        <div className="header-payment">
            <div class="payment-logo">
                <img src="./artlanta.svg" alt="Logo"></img>
            </div>
            <div className="payment-back">
                <Link to="/">Back</Link>
            </div>
        </div>
        <PaymentPaypal></PaymentPaypal>
    </div>
}