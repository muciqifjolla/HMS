import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Cards from './Cards';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Tables from './Tables';
import Comment from './Comment';

function HomePage() {
    const settings = {
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1200,
        centerMode: true, 
        centerPadding: '0px' 
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <br/>
            <Slider {...settings} className="slider-container" style={{ height: '350px', marginTop: '10px', marginBottom: '10px' }}>
                <div className="slide-item" style={{ marginLeft: '400px', marginRight: '420px' }}>
                    <img src="/src/pages/Main_Page/1.jpg" alt="Slide 1" style={{ height: '400px', width: '1200px'}} className="rounded-lg shadow" />
                </div>
                <div className="slide-item" style={{ marginLeft: '400px', marginRight: '420px' }}>
                    <img src="/src/pages/Main_Page/2.jpg" alt="Slide 2" style={{ height: '400px', width: '1200px'}} className="rounded-lg shadow" />
                </div>
                <div className="slide-item" style={{ marginLeft: '400px', marginRight: '420px' }}>
                    <img src="/src/pages/Main_Page/3.jpg" alt="Slide 3" style={{ height: '400px', width: '1200px'}} className="rounded-lg shadow" />
                </div>
                
            </Slider>
            <br/>
            <Cards/>
            <br/>
            <div className='flex flex-wrap justify-center mt-8'>
                {/* <Tables/> */}
                <Comment />
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
