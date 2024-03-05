// frontend/src/components/HomeComponents/LocationGrid.jsx
import React from "react";
import Slider from "react-slick";
import LocationCard from "./LocationCard";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const LocationGrid = ({ locations }) => {
  return locations.length > 6 ? (
    <Slider {...settings}>
      {locations.map((location, index) => (
        <div key={index}>
          <LocationCard {...location} />
        </div>
      ))}
    </Slider>
  ) : (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {locations.map((location, index) => (
        <LocationCard key={index} {...location} />
      ))}
    </div>
  );
};

export default LocationGrid;
