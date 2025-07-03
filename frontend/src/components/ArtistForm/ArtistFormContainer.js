import imgs from "../../assets/images/img-artistPost.svg";
import icon from "../../assets/images/img-artistIcon.svg";
import { Link } from "react-router-dom";
import "../../styles/ArtistForm.css";

export default function ArtistFormContainer() {
  return (
    <div className="artist-form">
      <div className="artist-form__navbar">
        <div className="artist-form__item">
          <img src={icon} alt="" />
          <p className="artist-form__nav">Art Commision</p>
        </div>
        <Link to="/" className="artist-form__cancel-a">
          <div className="artist-form__cancel">
            <p className="artist-form__para">Back to homepage top</p>
          </div>
        </Link>
      </div>

      <p className="artist-form__title">BECOME A</p>

      <p className="artist-form__title">
        <span className="title-span">Artist </span>
        in Artlanta
      </p>

      <img src={imgs} alt="" className="artist-form__imgDeco"/>

      <div className="form-submit__container">
        <div className="form-submit__item">
            <p>Let's go</p>
        </div>
      </div>
    </div>
  );
}
