import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Cards from './Cards';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Comment from './Comment';

function HomePage() {
  const settings = {
    infinite: true,
    speed: 1500, 
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true, 
    dots: true, 
    centerMode: false, 
  };

  return (
    <><Header />
    <div className="min-h-screen flex flex-col">
      
      <div className="flex flex-col items-center justify-center w-full">
        <Slider
          {...settings}
          className="slider-container"
          style={{
            height: '350px',
            width: '90%', 
            margin: '20px auto', 
          }}
        >
          {[
            { src: '/src/pages/Main_Page/1.jpg', alt: 'Slide 1' },
            { src: '/src/pages/Main_Page/2.jpg', alt: 'Slide 2' },
            { src: '/src/pages/Main_Page/3.jpg', alt: 'Slide 3' },
          ].map((slide, index) => (
            <div
              key={index}
              className="slide-item flex justify-center items-center"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="rounded-lg shadow"
                style={{
                  width: '100%', 
                  height: '350px', 
                  objectFit: 'cover', 
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
      <Cards />
      <div className="flex flex-wrap justify-center mt-8">
        {/* <Comment /> */}
      </div>
      <Footer />
    </div>
    </>
  );

  
}

export default HomePage;
