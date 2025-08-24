import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
            We are a dedicated team of developers passionate about transforming healthcare through technology. Our mission is to streamline hospital operations, enhance patient care, and modernize medical data systems with secure and efficient digital solutions. With a strong foundation in full-stack development and real-world problem-solving, we aim to build impactful applications that matter.
          </p>
          <p>We are all in 2025!</p>
          <p>We are working on a MERN STACK PROJECT.</p>
          <p>
            In a world driven by innovation, we strive to make healthcare smarter, more accessible, and more connected. Our work empowers medical professionals to focus on what truly matters—saving lives.
          </p>
          <h6>What We’re Building</h6>
          <p>We are currently developing a comprehensive Hospital Management System using the MERN Stack (MongoDB, Express.js, React, Node.js). This solution integrates patient management, doctor scheduling, departmental records, and secure data handling—all in one platform.</p>
          <p><b>Code meets care. Technology meets trust. That’s what we stand for.</b></p>
        </div>
      </div>
    </>
  );
};

export default Biography;