import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import doctor1 from "../../assets/new-assets/img/doc1.jpg";
import doctor2 from "../../assets/new-assets/img/doc2.jpg";
import doctor3 from "../../assets/new-assets/img/doc3.jpg";
import doctor4 from "../../assets/new-assets/img/doc4.jpg";
import doctor5 from "../../assets/new-assets/img/doc5.jpg";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetinaUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

// Doctor data with location, address, and specialization
const doctorData = [
  {
    img: doctor1,
    name: "Dr. Ramesh Gupta",
    specialization: "Cardiologist",
    address: "101, Apollo Hospital, Andheri East, Mumbai, Maharashtra 400069",
    cost: "₹2000 - Consultation Fee",
    location: [19.1193, 72.8462],
  },
  {
    img: doctor2,
    name: "Dr. Priya Sharma",
    specialization: "Dermatologist",
    address: "1st Floor, SkinCare Clinic, Bandra West, Mumbai, Maharashtra 400050",
    cost: "₹1500 - Skin Consultation",
    location: [19.0662, 72.8306],
  },
  {
    img: doctor3,
    name: "Dr. Anil Mehta",
    specialization: "Orthopedic",
    address: "A-102, Bone Health Clinic, Lower Parel, Mumbai, Maharashtra 400013",
    cost: "₹1800 - Bone & Joint Consultation",
    location: [18.9935, 72.8295],
  },
  {
    img: doctor4,
    name: "Dr. Sunita Deshmukh",
    specialization: "Pediatrician",
    address: "4th Floor, Child Care Hospital, Goregaon East, Mumbai, Maharashtra 400063",
    cost: "₹1200 - Child Consultation",
    location: [19.1642, 72.8495],
  },
  {
    img: doctor5,
    name: "Dr. Arjun Khanna",
    specialization: "Neurologist",
    address: "A-1902, Lodha Bellissimo, N M Joshi Marg, Mahalaxmi, Mumbai, Maharashtra 400011",
    cost: "₹2500 - Neurology Consultation",
    location: [18.9878, 72.8323],
  },
];

const Doctors = () => {
  const slider = useRef(null);
  const [hoveredDoctor, setHoveredDoctor] = useState(null);

  const settings = {
    accessibility: true,
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1023,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true },
      },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-16">
      <div className="flex flex-col items-center lg:flex-row justify-between mb-10 lg:mb-0">
        <div>
          <h1 className="text-4xl font-semibold text-center lg:text-start">Our Doctors</h1>
          <p className="mt-2 text-center lg:text-start">
            Find trusted doctors associated with us. Hover over each doctor to see their location on the map.
          </p>
        </div>
        <div className="flex gap-5 mt-4 lg:mt-0">
          <button
            className="bg-[#d5f2ec] text-backgroundColor px-4 py-2 rounded-lg active:bg-[#ade9dc]"
            onClick={() => slider.current.slickPrev()}
          >
            <FaArrowLeft size={25} />
          </button>
          <button
            className="bg-[#d5f2ec] text-backgroundColor px-4 py-2 rounded-lg active:bg-[#ade9dc]"
            onClick={() => slider.current.slickNext()}
          >
            <FaArrowRight size={25} />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <Slider ref={slider} {...settings}>
          {doctorData.map((doctor, index) => (
            <div
              key={index}
              className="h-[450px] text-black rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mb-2 cursor-pointer relative"
              onMouseEnter={() => setHoveredDoctor(index)}
              onMouseLeave={() => setHoveredDoctor(null)}
            >
              <div className="h-56 relative transition-opacity duration-500">
                {hoveredDoctor === index ? (
                  <div className="opacity-0 transition-opacity duration-500 hover:opacity-100">
                    <MapContainer
                      center={doctor.location}
                      zoom={13}
                      scrollWheelZoom={false}
                      className="h-56 rounded-t-xl"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={doctor.location}>
                        <Popup>{doctor.name}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : (
                  <img
                    src={doctor.img}
                    alt={doctor.name}
                    className="h-full w-full object-cover rounded-t-xl transition-opacity duration-500 hover:opacity-50"
                  />
                )}
              </div>
              <div className="p-4 flex flex-col justify-center items-center">
                <h1 className="font-semibold text-xl">{doctor.name}</h1>
                <p className="text-sm text-gray-600">{doctor.specialization}</p>
                <p className="text-sm text-gray-600">{doctor.address}</p>
                <p className="text-sm text-gray-600 mb-4">{doctor.cost}</p>
                <button className="bg-[#00b894] text-white px-4 py-2 rounded-lg">Book Now</button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Doctors;