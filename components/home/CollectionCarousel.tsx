import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation,Pagination } from 'swiper/modules';
import 'swiper/css'; 
import 'swiper/css/navigation'; 
import CollectionCard,{ CollectionItem }  from 'components/collections/CollectionCard';



interface CollectionsCarouselProps {
  topCollections: CollectionItem[]; 
}

const CollectionsCarousel: React.FC<CollectionsCarouselProps> = ({ topCollections}) => { 


  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      modules={[
        Navigation,
        Pagination
      ]}
    >
      {topCollections.map((collection) => (
        <SwiperSlide  >
         <CollectionCard  topCollection={collection} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CollectionsCarousel;
