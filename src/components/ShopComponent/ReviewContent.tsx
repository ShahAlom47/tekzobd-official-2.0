import React from 'react';
import { ProductType } from '@/Interfaces/productInterfaces';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
type ReviewContentType ={
    product:ProductType
}

const ReviewContent =async ({product}:ReviewContentType) => {

   
    return (
        <div className='  '>
            <ReviewForm productId={product?._id.toString()}></ReviewForm>
            <ReviewList productId={product?._id.toString()}></ReviewList>
            
        </div>
    );
};

export default ReviewContent;