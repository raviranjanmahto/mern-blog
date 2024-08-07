import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";

import Image1 from "../../assets/hero-carousel/img1.jpg";
import Image2 from "../../assets/hero-carousel/img2.jpg";
import Image3 from "../../assets/hero-carousel/img3.jpg";
import Image4 from "../../assets/hero-carousel/img4.jpg";

const Hero = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:gap-14 gap-8">
      <div className="md:w-1/2 w-full">
        <h1 className="md:text-5xl text-3xl md:leading-tight">
          Welcome to My Blog
        </h1>
        <p className="py-4">
          Discover the latest insights, trends, and stories from around the
          world. Join our community of readers who are passionate about
          exploring new ideas and sharing their thoughts. Stay tuned for
          exciting updates and articles that will inspire and inform.
        </p>
      </div>

      <div className="md:w-1/2 w-full mx-auto bg-green-500">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              src={Image1}
              alt="Banner Image1"
              className="w-full lg:h-[420px] sm:h-96 h-80"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Image2}
              alt="Banner Image2"
              className="w-full lg:h-[420px] sm:h-96 h-80"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Image3}
              alt="Banner Image3"
              className="w-full lg:h-[420px] sm:h-96 h-80"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Image4}
              alt="Banner Image4"
              className="w-full lg:h-[420px] sm:h-96 h-80"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
